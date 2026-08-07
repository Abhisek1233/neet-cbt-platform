import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/auth/AuthModal';
import LandingPage from './components/auth/LandingPage';

import PreExamCheck from './components/cbt/PreExamCheck';
import ExamEngine from './components/cbt/ExamEngine';
import PostExamScorecard from './components/cbt/PostExamScorecard';
import GenerateAiTestModal from './components/cbt/GenerateAiTestModal';

import ProctorMonitor from './components/proctoring/ProctorMonitor';
import ProctorAlertOverlay from './components/proctoring/ProctorAlertOverlay';

import QuestionBank from './components/teacher/QuestionBank';
import LiveProctoringDashboard from './components/teacher/LiveProctoringDashboard';

import Leaderboard from './components/social/Leaderboard';
import StudyTeams from './components/social/StudyTeams';
import DoubtForum from './components/social/DoubtForum';
import MyNotes from './components/social/MyNotes';

import CollegePredictor from './components/predictor/CollegePredictor';
import CutoffExplorer from './components/predictor/CutoffExplorer';

import ToastContainer, { showToast } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';

import { store } from './services/store';
import { Play, ShieldCheck, Sparkles, Users, HelpCircle, Edit3, Plus, Lock } from 'lucide-react';

export default function App() {
  const [storeState, setStoreState] = useState(store.getState());
  const [activeTab, setActiveTab] = useState('exams');
  const [examCategory, setExamCategory] = useState('All');
  const [socialSubTab, setSocialSubTab] = useState('leaderboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStartingExamId, setIsStartingExamId] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setStoreState(newState);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const theme = storeState.theme || 'light';
    document.body.className = `theme-${theme} font-sans antialiased min-h-screen`;
  }, [storeState.theme]);

  // Handle Shareable Exam Link URL parameter ?examId=...
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetExamId = urlParams.get('examId');
    if (targetExamId) {
      const foundExam = storeState.exams.find((e) => e.id === targetExamId);
      if (foundExam) {
        if (!storeState.currentUser) {
          setIsAuthOpen(true);
          showToast(`🔐 Private Exam "${foundExam.title}" requested! Log in with your Gmail ID to access.`, 'info', 6000);
        } else if (!store.isEmailAllowedForExam(storeState.currentUser.email, foundExam)) {
          showToast(`🚫 Email "${storeState.currentUser.email}" is not authorized for this private teacher exam.`, 'error', 6000);
        } else if (storeState.activeExamPhase === 'idle') {
          showToast(`⚡ Authorized! Opening Teacher Exam "${foundExam.title}"...`, 'success', 4000);
          store.startPreExamCheck(foundExam);
        }
      }
    }
  }, [storeState.currentUser, storeState.exams]);

  const handleStartExamFlow = async (exam) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('🔒 Please Sign In or Register to start taking CBT Mock Tests.', 'info');
      return;
    }

    if (exam.allowedStudentEmails && exam.allowedStudentEmails.length > 0) {
      const isAllowed = store.isEmailAllowedForExam(currentUser?.email, exam);
      if (!isAllowed) {
        showToast(`🔒 Private Exam! Access restricted to allowed student emails (${exam.allowedStudentEmails.slice(0, 2).join(', ')}...). Log in with your invited Gmail ID.`, 'error', 6000);
        setIsAuthOpen(true);
        return;
      }
    }

    setIsStartingExamId(exam.id);
    showToast(`⚡ Connecting to Google Gemini AI to generate fresh questions for ${exam.title}...`, 'info', 4000);
    await store.startPreExamCheck(exam);
    setIsStartingExamId(null);
  };

  const currentUser = storeState.currentUser;
  const activeExamPhase = storeState.activeExamPhase;
  const activeExam = storeState.activeExam;
  const isDark = storeState.theme === 'dark';

  const filteredExams = storeState.exams.filter((e) => {
    if (examCategory === 'All') return true;
    return e.category === examCategory;
  });

  if (activeExamPhase === 'pre-check' && activeExam) {
    return (
      <ErrorBoundary>
        <PreExamCheck
          exam={activeExam}
          currentUser={currentUser || { name: 'Guest Aspirant', isGuest: true }}
          onStartExam={() => store.startActiveExam()}
          onCancel={() => store.exitExamToHome()}
          theme={storeState.theme}
        />
      </ErrorBoundary>
    );
  }

  if (activeExamPhase === 'taking' && activeExam) {
    return (
      <ErrorBoundary>
        <div className="relative min-h-screen cbt-canvas">
          <ProctorMonitor exam={activeExam} isTakingExam={true} />
          <ProctorAlertOverlay activeAlert={storeState.proctorAlertActive} />
          <ExamEngine
            exam={activeExam}
            currentUser={currentUser || { name: 'Guest Aspirant', isGuest: true }}
            storeState={storeState}
            onExit={() => store.exitExamToHome()}
          />
        </div>
      </ErrorBoundary>
    );
  }

  if (activeExamPhase === 'scorecard' && storeState.submittedAttempts[0]) {
    return (
      <ErrorBoundary>
        <PostExamScorecard
          attempt={storeState.submittedAttempts[0]}
          storeState={storeState}
          onExit={() => store.exitExamToHome()}
          theme={storeState.theme}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col font-sans transition-colors ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}>
        
        <ToastContainer />

        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab)}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          theme={storeState.theme}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          currentUser={currentUser}
          theme={storeState.theme}
        />

        <GenerateAiTestModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          category={examCategory === 'All' ? 'Full-Length' : examCategory}
          theme={storeState.theme}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-20 md:pb-8">
          
          {!currentUser ? (
            <LandingPage onOpenAuth={() => setIsAuthOpen(true)} theme={storeState.theme} />
          ) : (
            <>
              {activeTab === 'exams' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Top NTA Pattern Banner */}
                  <div className={`cbt-panel p-5 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
                  }`}>
                    <div className="max-w-2xl">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-[10px] sm:text-xs font-extrabold mb-2.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" /> NTA-PATTERN 200Q MOCK FORMAT & DYNAMIC GEMINI AI
                      </span>
                      <h1 className={`text-xl sm:text-3xl font-display font-extrabold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        National Eligibility cum Entrance Test (NEET UG) Mock CBT Portal
                      </h1>
                      <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Practice on existing tests or generate unlimited fresh AI mock papers for Subject-Wise, Topic-Wise, Full-Length, and AI High-Yield series!
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAiModalOpen(true)}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate New AI Test Paper</span>
                    </button>
                  </div>

                  {/* Exam Categories Sub-Tabs */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-sm overflow-x-auto max-w-full">
                        <button
                          onClick={() => setExamCategory('All')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                            examCategory === 'All' ? 'bg-slate-900 text-amber-300' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          All Exams
                        </button>
                        <button
                          onClick={() => setExamCategory('Full-Length')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                            examCategory === 'Full-Length' ? 'bg-slate-900 text-amber-300' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Full Mocks (200Q, 720M)
                        </button>
                        <button
                          onClick={() => setExamCategory('Subject-Wise')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                            examCategory === 'Subject-Wise' ? 'bg-slate-900 text-amber-300' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Subject Mocks
                        </button>
                        <button
                          onClick={() => setExamCategory('Topic-Wise')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                            examCategory === 'Topic-Wise' ? 'bg-slate-900 text-amber-300' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Topic Tests
                        </button>
                        <button
                          onClick={() => setExamCategory('AI-Predicted')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                            examCategory === 'AI-Predicted' ? 'bg-slate-900 text-amber-300' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          AI High-Yield
                        </button>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                        <span className="text-xs font-mono font-bold text-slate-600">{filteredExams.length} Tests Ready</span>
                        <button
                          onClick={() => setIsAiModalOpen(true)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Generate {examCategory === 'All' ? 'Custom' : examCategory} Test</span>
                        </button>
                      </div>
                    </div>

                    {/* Exams Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredExams.map((exam) => {
                        const isRestricted = exam.allowedStudentEmails && exam.allowedStudentEmails.length > 0;
                        const isAllowed = store.isEmailAllowedForExam(currentUser?.email, exam);
                        return (
                          <div key={exam.id} className={`cbt-panel p-5 rounded-3xl border flex flex-col justify-between hover:shadow-md transition-all space-y-4 ${
                            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
                          }`}>
                            <div>
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-amber-300 font-mono text-[11px] font-extrabold">
                                  {exam.code}
                                </span>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${
                                  isRestricted ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-purple-100 text-purple-800 border-purple-300'
                                }`}>
                                  {isRestricted && <Lock className="w-3 h-3 text-amber-600 shrink-0" />}
                                  {isRestricted ? 'Private Email Restricted' : exam.proctoringLevel}
                                </span>
                              </div>

                              <h3 className={`text-sm sm:text-base font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>{exam.title}</h3>
                              <p className="text-xs text-slate-500 mt-1">Created by {exam.createdBy}</p>

                              <div className={`grid grid-cols-3 gap-2 mt-3 p-3 rounded-2xl border text-center text-xs font-mono ${
                                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                              }`}>
                                <div>
                                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Duration</p>
                                  <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{exam.durationMin}m</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Marks</p>
                                  <p className="font-bold text-blue-700">{exam.totalMarks}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Questions</p>
                                  <p className="font-bold text-emerald-700">{exam.questionCount}</p>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleStartExamFlow(exam)}
                              disabled={isStartingExamId === exam.id}
                              className={`w-full py-3 rounded-xl font-extrabold text-xs shadow flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                isRestricted && !isAllowed
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                  : 'bg-blue-700 hover:bg-blue-800 text-white'
                              }`}
                            >
                              {isStartingExamId === exam.id ? (
                                <span className="flex items-center gap-1.5 animate-pulse">
                                  <Sparkles className="w-4 h-4 text-amber-300" /> Generating AI Questions...
                                </span>
                              ) : isRestricted && !isAllowed ? (
                                <>
                                  <Lock className="w-4 h-4" /> Private Test (Requires Email Login)
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 fill-white" /> Start CBT Mock Test
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {activeTab === 'predictor' && (
                <CollegePredictor colleges={storeState.colleges} theme={storeState.theme} />
              )}

              {activeTab === 'cutoffs' && (
                <CutoffExplorer colleges={storeState.colleges} theme={storeState.theme} />
              )}

              {activeTab === 'social' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className={`flex items-center gap-1.5 p-1 rounded-xl border w-full sm:w-auto overflow-x-auto shadow-sm ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
                  }`}>
                    <button
                      onClick={() => setSocialSubTab('leaderboard')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        socialSubTab === 'leaderboard' 
                          ? 'bg-slate-950 text-amber-300' 
                          : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-700 hover:text-slate-900')
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> All-India Ranks
                    </button>
                    <button
                      onClick={() => setSocialSubTab('teams')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        socialSubTab === 'teams' 
                          ? 'bg-slate-950 text-amber-300' 
                          : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-700 hover:text-slate-900')
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" /> Study Squads
                    </button>
                    <button
                      onClick={() => setSocialSubTab('doubts')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        socialSubTab === 'doubts' 
                          ? 'bg-slate-950 text-amber-300' 
                          : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-700 hover:text-slate-900')
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Doubt Forum
                    </button>
                    <button
                      onClick={() => setSocialSubTab('notes')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        socialSubTab === 'notes' 
                          ? 'bg-slate-950 text-amber-300' 
                          : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-700 hover:text-slate-900')
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Revision Notes
                    </button>
                  </div>

                  {socialSubTab === 'leaderboard' && <Leaderboard theme={storeState.theme} />}
                  {socialSubTab === 'teams' && <StudyTeams teams={storeState.teams} currentUser={currentUser} theme={storeState.theme} />}
                  {socialSubTab === 'doubts' && <DoubtForum doubts={storeState.doubts} currentUser={currentUser} theme={storeState.theme} />}
                  {socialSubTab === 'notes' && <MyNotes notes={storeState.userNotes} questions={storeState.questions} theme={storeState.theme} />}
                </div>
              )}

              {activeTab === 'teacher-qbank' && (
                currentUser?.role === 'teacher' ? (
                  <QuestionBank questions={storeState.questions} storeState={storeState} theme={storeState.theme} />
                ) : (
                  <div className="p-8 text-center space-y-4 max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl text-white my-12 shadow-2xl animate-fadeIn">
                    <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
                    <h3 className="text-xl font-extrabold">Protected Route — Faculty HOD Restricted</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The Question Bank requires an authorized Teacher / Faculty Admin account. Log in with your faculty email address to author and manage questions.
                    </p>
                    <button onClick={() => setIsAuthOpen(true)} className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md cursor-pointer">
                      Sign In as Teacher / Faculty HOD
                    </button>
                  </div>
                )
              )}

              {activeTab === 'teacher-proctoring' && (
                currentUser?.role === 'teacher' ? (
                  <LiveProctoringDashboard storeState={storeState} theme={storeState.theme} />
                ) : (
                  <div className="p-8 text-center space-y-4 max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl text-white my-12 shadow-2xl animate-fadeIn">
                    <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
                    <h3 className="text-xl font-extrabold">Protected Route — Faculty HOD Restricted</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The Live AI Proctoring Control Room requires an authorized Teacher / Faculty Admin account. Log in with your faculty email address to view live candidate webcams and telemetry.
                    </p>
                    <button onClick={() => setIsAuthOpen(true)} className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md cursor-pointer">
                      Sign In as Teacher / Faculty HOD
                    </button>
                  </div>
                )
              )}
            </>
          )}

        </main>

        <footer className={`border-t py-6 text-center text-xs pb-20 md:pb-6 ${
          isDark ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-white border-slate-300 text-slate-600'
        }`}>
          <p className="px-4">NTA-Pattern NEET UG CBT Preparation Platform — Replicating Test Center Standards for Physics, Chemistry, Botany & Zoology.</p>
        </footer>

      </div>
    </ErrorBoundary>
  );
}
