import { mockExams, mockQuestions, mockColleges, mockLeaderboard, mockTeams, mockDoubts } from '../data/mockData';
import { generateBatchExamQuestions, submitAttemptToBackend, fetchExamsFromBackend, fetchQuestionsFromBackend, generateFullAiExamQuestions, createExamInBackend, saveQuestionToBackend, deleteQuestionFromBackend, clearAllQuestionsInBackend } from './api';

class Store {
  constructor() {
    this.listeners = new Set();

    // Clear stale pre-loaded questions & stale customExams from local storage
    try {
      const storedRaw = localStorage.getItem('neet_cbt_questions');
      if (storedRaw) {
        const parsed = JSON.parse(storedRaw);
        if (Array.isArray(parsed) && parsed.some((q) => q.id && q.id.startsWith('ai_1786'))) {
          localStorage.removeItem('neet_cbt_questions');
        }
      }

      // Purge any built-in exam cache that had stale 2026 or partial question counts
      const storedCustom = localStorage.getItem('neet_cbt_customExams');
      if (storedCustom) {
        const parsed = JSON.parse(storedCustom);
        if (Array.isArray(parsed)) {
          const onlyUserCreated = parsed.filter(
            (e) => e && e.id && (e.id.startsWith('exam_custom_') || e.id.startsWith('exam_ai_'))
          );
          localStorage.setItem('neet_cbt_customExams', JSON.stringify(onlyUserCreated));
        }
      }
    } catch (e) {}

    const sanitizeExam = (e) => {
      if (!e) return e;
      const cleanTitle = (e.title || '').replace(/\b2026\b/g, '').replace(/2026/g, '').replace(/\s{2,}/g, ' ').trim();
      const cleanCode = (e.code || '').replace(/-2026/g, '').replace(/2026-/g, '').replace(/2026/g, '').trim();
      return {
        ...e,
        title: cleanTitle || e.title,
        code: cleanCode || e.code
      };
    };

    const storedCustomOnly = this.loadFromStorage('customExams', []);
    const initialExamMap = new Map();
    mockExams.forEach((e) => initialExamMap.set(e.id, sanitizeExam(e)));
    (storedCustomOnly || []).forEach((e) => {
      if (e && e.id && (e.id.startsWith('exam_custom_') || e.id.startsWith('exam_ai_'))) {
        const cleaned = sanitizeExam(e);
        initialExamMap.set(cleaned.id, cleaned);
      }
    });

    this.state = {
      theme: this.loadFromStorage('theme', 'light'),
      currentUser: this.loadFromStorage('user', null),

      activeExam: null,
      activeExamPhase: 'idle',
      examResponses: {},
      examAnswersVisited: {},
      examTimeRemainingSec: 0,
      currentQuestionIndex: 0,
      activeSection: 'Physics',

      proctorLogs: [],
      proctorAlertActive: null,
      proctorStrictness: 'Strict AI',

      questions: this.loadFromStorage('questions', mockQuestions),
      exams: Array.from(initialExamMap.values()),
      colleges: mockColleges,
      leaderboard: mockLeaderboard,
      teams: this.loadFromStorage('teams', mockTeams),
      doubts: this.loadFromStorage('doubts', mockDoubts),
      userNotes: this.loadFromStorage('userNotes', {}),
      submittedAttempts: this.loadFromStorage('submittedAttempts', [])
    };

    this.syncBackendData();
  }

  async syncBackendData() {
    try {
      const sanitizeExam = (e) => {
        if (!e) return e;
        const cleanTitle = (e.title || '').replace(/\b2026\b/g, '').replace(/\s{2,}/g, ' ').trim();
        const cleanCode = (e.code || '').replace(/-2026/g, '').replace(/2026-/g, '').replace(/2026/g, '').trim();
        return {
          ...e,
          title: cleanTitle || e.title,
          code: cleanCode || e.code
        };
      };

      const remoteExams = await fetchExamsFromBackend();
      if (remoteExams && remoteExams.length > 0) {
        const customExams = this.loadFromStorage('customExams', []);
        const merged = [...mockExams, ...customExams, ...remoteExams];
        const uniqueMap = new Map();
        merged.forEach((e) => uniqueMap.set(e.id, sanitizeExam(e)));
        this.setState({ exams: Array.from(uniqueMap.values()) });
      }

      const remoteQuestions = await fetchQuestionsFromBackend();
      const storedQ = this.loadFromStorage('questions', mockQuestions);
      const mergedQ = (remoteQuestions && remoteQuestions.length > 0)
        ? [...remoteQuestions, ...storedQ, ...mockQuestions]
        : [...storedQ, ...mockQuestions];

      const uniqueQMap = new Map();
      mergedQ.forEach((q) => {
        if (q && q.id) uniqueQMap.set(q.id, q);
      });
      this.setState({ questions: Array.from(uniqueQMap.values()) });
    } catch (e) {
      console.warn('Backend sync failed, using mockQuestions:', e);
    }
  }

  loadFromStorage(key, defaultValue) {
    try {
      const stored = localStorage.getItem(`neet_cbt_${key}`);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(`neet_cbt_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  toggleTheme() {
    const nextTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.saveToStorage('theme', nextTheme);
    this.setState({ theme: nextTheme });
  }

  setUserRole(role, isGuest = false, name = '') {
    const user = {
      id: isGuest ? `guest_${Date.now()}` : `usr_${role}_1`,
      name: isGuest ? (name || 'Guest Aspirant') : (role === 'teacher' ? 'Dr. S. K. Roy (HOD Physics)' : 'Rahul Kumar'),
      email: isGuest ? 'guest@temporary.session' : (role === 'teacher' ? 'hod.physics@neet.edu' : 'rahul.student@neet.edu'),
      role: isGuest ? 'student' : role,
      isGuest: isGuest,
      avatar: isGuest 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : (role === 'teacher' 
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
    };

    this.saveToStorage('user', user);
    this.setState({ currentUser: user });
  }

  setUserCustomAccount(name, email, role = 'student') {
    const user = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: name || 'NEET Aspirant',
      email: email || 'user@neet.edu',
      role: role,
      isGuest: false,
      avatar: role === 'teacher' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };

    this.saveToStorage('user', user);
    this.setState({ currentUser: user });
  }

  logoutUser() {
    localStorage.removeItem('neet_cbt_user');
    this.setState({ currentUser: null, activeExamPhase: 'idle', activeExam: null });
  }

  createTeacherExam(examData) {
    const newExam = {
      id: `exam_custom_${Date.now()}`,
      code: `EXP-${Date.now().toString().slice(-4)}`,
      title: examData.title || 'Teacher Custom Assigned Exam',
      category: examData.category || 'Subject-Wise',
      durationMin: examData.durationMin || 30,
      totalMarks: (examData.questionIds?.length || 10) * 4,
      questionCount: examData.questionIds?.length || 10,
      markingScheme: '+4 / -1',
      sections: examData.sections || ['Physics'],
      proctoringLevel: 'Strict AI',
      createdBy: examData.createdBy || (this.state.currentUser ? this.state.currentUser.name : 'Faculty HOD'),
      allowedStudentEmails: examData.allowedStudentEmails || [],
      questionIds: examData.questionIds || []
    };

    createExamInBackend(newExam);

    const updatedExams = [newExam, ...this.state.exams];
    const customOnly = updatedExams.filter((e) => e.id.startsWith('exam_custom_') || e.id.startsWith('exam_ai_'));
    this.saveToStorage('customExams', customOnly);
    this.setState({ exams: updatedExams });
    return newExam;
  }

  createGroupSquad(groupData) {
    const newSquad = {
      id: `team_${Date.now()}`,
      name: groupData.name,
      description: groupData.description || 'Custom Squad formed by Phone & Email invites.',
      avatar: groupData.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80',
      type: groupData.type || 'Student Squad',
      memberCount: (groupData.members?.length || 0) + 1,
      targetScore: groupData.targetScore || '680+ Marks',
      rank: 'Unranked Squad',
      creator: this.state.currentUser ? this.state.currentUser.name : 'Founder',
      members: groupData.members || []
    };

    const updatedTeams = [newSquad, ...this.state.teams];
    this.saveToStorage('teams', updatedTeams);
    this.setState({ teams: updatedTeams });
    return newSquad;
  }

  isEmailAllowedForExam(email, exam) {
    if (!exam || !exam.allowedStudentEmails || exam.allowedStudentEmails.length === 0) {
      return true;
    }
    if (!email) return false;
    return exam.allowedStudentEmails.some((allowed) => allowed.toLowerCase().trim() === email.toLowerCase().trim());
  }

  async startPreExamCheck(exam) {
    const targetCount = exam.questionCount || 20;

    const allKnownMap = new Map();
    [...this.state.questions, ...mockQuestions].forEach((q) => {
      if (q && q.id) allKnownMap.set(q.id, q);
    });

    let currentQuestions = (exam.questionIds || [])
      .map((id) => allKnownMap.get(id))
      .filter(Boolean);

    // If existing questions don't match the exact targetCount (e.g. 13 vs 200, or empty vs 50):
    if (currentQuestions.length !== targetCount) {
      const generated = generateBatchExamQuestions({
        category: exam.category || 'Full-Length',
        subjects: exam.sections && exam.sections.length > 0 ? exam.sections : ['Physics', 'Chemistry', 'Botany', 'Zoology'],
        count: targetCount,
        difficulty: 'Real Mix',
        questionType: 'All Types'
      });

      generated.forEach((q) => allKnownMap.set(q.id, q));
      currentQuestions = generated;
    }

    const updatedExam = {
      ...exam,
      questionCount: targetCount,
      questionIds: currentQuestions.map((q) => q.id)
    };

    const firstQId = updatedExam.questionIds[0] || 'q1';

    this.setState({
      activeExam: updatedExam,
      questions: Array.from(allKnownMap.values()),
      activeExamPhase: 'pre-check',
      examResponses: {},
      examAnswersVisited: { [firstQId]: true },
      examTimeRemainingSec: (exam.durationMin || 200) * 60,
      currentQuestionIndex: 0,
      activeSection: updatedExam.sections?.[0] || 'Physics',
      proctorLogs: []
    });
  }

  startPracticeDrill(subject, chapter, count = 5) {
    const drillQuestions = generateBatchExamQuestions({
      category: 'Topic-Wise',
      subjects: [subject],
      count,
      difficulty: 'Real Mix',
      questionType: 'All Types',
      chapter
    });

    const allKnownMap = new Map();
    [...this.state.questions, ...drillQuestions].forEach((q) => {
      if (q && q.id) allKnownMap.set(q.id, q);
    });

    const drillExam = {
      id: `exam_drill_${Date.now()}`,
      code: `DRILL-${Date.now().toString().slice(-4)}`,
      title: `⚡ AI Remedial Drill: ${chapter} (${subject})`,
      category: 'Topic-Wise',
      targetChapter: chapter,
      durationMin: Math.max(5, count * 2),
      totalMarks: count * 4,
      questionCount: count,
      markingScheme: '+4 / -1',
      sections: [subject],
      proctoringLevel: 'Standard',
      createdBy: 'Gemini AI Diagnostic Engine',
      questionIds: drillQuestions.map((q) => q.id)
    };

    const firstQId = drillExam.questionIds[0] || 'q1';

    this.setState({
      activeExam: drillExam,
      questions: Array.from(allKnownMap.values()),
      activeExamPhase: 'taking',
      examResponses: {},
      examAnswersVisited: { [firstQId]: true },
      examTimeRemainingSec: drillExam.durationMin * 60,
      currentQuestionIndex: 0,
      activeSection: subject,
      proctorLogs: []
    });
    this.logProctorEvent('Remedial Drill Started', 'Info', `Targeted revision drill launched for ${chapter}.`);
  }

  startActiveExam() {
    this.setState({ activeExamPhase: 'taking' });
    this.logProctorEvent('Exam Session Started', 'Info', 'Student initiated CBT session.');
  }

  saveQuestionResponse(questionId, selectedOption, isMarkedForReview = false) {
    const current = this.state.examResponses[questionId] || {};
    const updated = {
      ...this.state.examResponses,
      [questionId]: {
        selectedOption: selectedOption !== undefined ? selectedOption : (current.selectedOption ?? null),
        isMarkedForReview: isMarkedForReview !== undefined ? isMarkedForReview : (current.isMarkedForReview ?? false),
        timeSpent: (current.timeSpent || 0) + 5
      }
    };

    const visited = { ...this.state.examAnswersVisited, [questionId]: true };

    this.setState({
      examResponses: updated,
      examAnswersVisited: visited
    });
  }

  clearQuestionResponse(questionId) {
    const updated = { ...this.state.examResponses };
    if (updated[questionId]) {
      updated[questionId].selectedOption = null;
    }
    this.setState({ examResponses: updated });
  }

  setCurrentQuestionIndex(index) {
    const examQuestions = this.getExamQuestions();
    const q = examQuestions[index];
    if (q) {
      const visited = { ...this.state.examAnswersVisited, [q.id]: true };
      this.setState({
        currentQuestionIndex: index,
        activeSection: q.subject,
        examAnswersVisited: visited
      });
    }
  }

  setActiveSection(section) {
    const examQuestions = this.getExamQuestions();
    const firstInSection = examQuestions.findIndex(
      (q) => q.subject && q.subject.toLowerCase() === section.toLowerCase()
    );
    if (firstInSection !== -1) {
      this.setCurrentQuestionIndex(firstInSection);
    }
  }

  getExamQuestions() {
    if (!this.state.activeExam) return mockQuestions;

    const exam = this.state.activeExam;
    const targetCount = exam.questionCount || 20;

    const allKnownMap = new Map();
    [...this.state.questions, ...mockQuestions].forEach((q) => {
      if (q && q.id) allKnownMap.set(q.id, q);
    });

    let foundQuestions = (exam.questionIds || [])
      .map((id) => allKnownMap.get(id))
      .filter(Boolean);

    // Guarantee that foundQuestions matches targetCount exactly
    if (foundQuestions.length !== targetCount) {
      foundQuestions = generateBatchExamQuestions({
        category: exam.category || 'Full-Length',
        subjects: exam.sections && exam.sections.length > 0 ? exam.sections : ['Physics', 'Chemistry', 'Botany', 'Zoology'],
        count: targetCount,
        difficulty: 'Real Mix',
        questionType: 'All Types'
      });

      foundQuestions.forEach((q) => allKnownMap.set(q.id, q));
      this.state.questions = Array.from(allKnownMap.values());
      exam.questionIds = foundQuestions.map((q) => q.id);
    }

    return foundQuestions;
  }

  async submitExam() {
    const exam = this.state.activeExam;
    if (!exam) return;

    const questions = this.getExamQuestions();
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    questions.forEach((q) => {
      const resp = this.state.examResponses[q.id];
      if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
        if (resp.selectedOption === q.correctOption) {
          score += 4;
          correctCount++;
        } else {
          score -= 1;
          incorrectCount++;
        }
      } else {
        unattemptedCount++;
      }
    });

    const totalPossibleScore = questions.length * 4;
    const accuracy = correctCount + incorrectCount > 0 
      ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
      : 0;

    const attemptResult = {
      id: `attempt_${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      studentName: this.state.currentUser ? this.state.currentUser.name : 'Candidate',
      studentEmail: this.state.currentUser ? this.state.currentUser.email : 'guest@temporary.session',
      score,
      totalPossibleScore,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracy,
      submittedAt: new Date().toISOString(),
      responses: { ...this.state.examResponses },
      proctorLogs: [...this.state.proctorLogs]
    };

    submitAttemptToBackend(attemptResult);

    const updatedAttempts = [attemptResult, ...this.state.submittedAttempts];
    this.saveToStorage('submittedAttempts', updatedAttempts);
    this.setState({
      activeExamPhase: 'scorecard',
      submittedAttempts: updatedAttempts
    });
  }

  exitExamToHome() {
    this.setState({
      activeExam: null,
      activeExamPhase: 'idle',
      examResponses: {},
      examAnswersVisited: {},
      currentQuestionIndex: 0,
      proctorLogs: [],
      proctorAlertActive: null
    });
  }

  logProctorEvent(eventType, severity = 'Warning', details = '') {
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      studentName: this.state.currentUser ? this.state.currentUser.name : 'Candidate',
      eventType,
      severity,
      details
    };

    const updated = [newLog, ...this.state.proctorLogs];
    
    if (severity === 'Warning' || severity === 'Critical') {
      this.setState({
        proctorLogs: updated,
        proctorAlertActive: newLog
      });
      setTimeout(() => {
        if (this.state.proctorAlertActive?.id === newLog.id) {
          this.setState({ proctorAlertActive: null });
        }
      }, 4000);
    } else {
      this.setState({ proctorLogs: updated });
    }
  }

  saveUserNote(questionId, noteText) {
    const updated = { ...this.state.userNotes, [questionId]: noteText };
    this.saveToStorage('userNotes', updated);
    this.setState({ userNotes: updated });
  }

  addDoubt(subject, topic, questionText) {
    const newDoubt = {
      id: `d_${Date.now()}`,
      author: this.state.currentUser ? this.state.currentUser.name : 'Aspirant',
      subject,
      topic,
      question: questionText,
      upvotes: 1,
      replies: []
    };
    const updated = [newDoubt, ...this.state.doubts];
    this.saveToStorage('doubts', updated);
    this.setState({ doubts: updated });
  }

  addDoubtReply(doubtId, replyText) {
    const updated = this.state.doubts.map((d) => {
      if (d.id === doubtId) {
        return {
          ...d,
          replies: [
            ...d.replies,
            {
              author: this.state.currentUser ? this.state.currentUser.name : 'User',
              role: this.state.currentUser && this.state.currentUser.role === 'teacher' ? 'Teacher' : 'Student',
              text: replyText,
              time: 'Just now'
            }
          ]
        };
      }
      return d;
    });
    this.saveToStorage('doubts', updated);
    this.setState({ doubts: updated });
  }

  addQuestion(newQuestion) {
    const q = { ...newQuestion, id: newQuestion.id || `q_${Date.now()}` };
    saveQuestionToBackend(q);
    const updated = [q, ...this.state.questions];
    this.saveToStorage('questions', updated);
    this.setState({ questions: updated });
  }

  deleteQuestion(id) {
    deleteQuestionFromBackend(id);
    const updated = this.state.questions.filter((q) => q.id !== id);
    this.saveToStorage('questions', updated);
    this.setState({ questions: updated });
  }

  clearAllQuestions() {
    clearAllQuestionsInBackend();
    this.saveToStorage('questions', mockQuestions);
    this.setState({ questions: mockQuestions });
  }
}

export const store = new Store();
