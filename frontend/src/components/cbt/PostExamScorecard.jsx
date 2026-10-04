import React, { useState, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  BookOpen,
  Edit3,
  ArrowLeft,
  Printer,
  Sparkles,
  Zap,
  AlertTriangle,
  Target,
  Filter,
  FileSpreadsheet,
  Clock,
  RotateCcw
} from 'lucide-react';
import { store } from '../../services/store';
import MathText from '../ui/MathText';
import { showToast } from '../ui/Toast';

export default function PostExamScorecard({ attempt, storeState, onExit, theme }) {
  const [activeTab, setActiveTab] = useState('scorecard');
  const [noteInputs, setNoteInputs] = useState(storeState.userNotes || {});
  const [mistakeFilter, setMistakeFilter] = useState('All');

  const questions = store.getExamQuestions();
  const isDark = theme === 'dark';

  const handleSaveNote = (qId) => {
    store.saveUserNote(qId, noteInputs[qId] || '');
    showToast('📝 Revision note saved to your personal notebook!', 'success', 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Group performance by Subject
  const subjectsList = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
  const subjectStats = useMemo(() => {
    return subjectsList.map((sub) => {
      const subQuestions = questions.filter((q) => q.subject === sub);
      let attempted = 0;
      let correct = 0;
      let incorrect = 0;
      let unattempted = 0;
      let score = 0;

      subQuestions.forEach((q) => {
        const resp = attempt.responses?.[q.id];
        const sel = resp?.selectedOption;
        if (sel === null || sel === undefined) {
          unattempted++;
        } else if (sel === q.correctOption) {
          attempted++;
          correct++;
          score += 4;
        } else {
          attempted++;
          incorrect++;
          score -= 1;
        }
      });

      const total = subQuestions.length || (questions.length ? Math.floor(questions.length / 4) : 0);
      const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      return {
        subject: sub,
        total,
        attempted,
        correct,
        incorrect,
        unattempted,
        score,
        accuracy
      };
    });
  }, [questions, attempt]);

  // Group Mistakes by Chapter to identify weak areas
  const { weakChapters, mistakeQuestions } = useMemo(() => {
    const chapterMap = new Map();
    const mistakes = [];

    questions.forEach((q, idx) => {
      const resp = attempt.responses?.[q.id];
      const sel = resp?.selectedOption;
      const isUnattempted = sel === null || sel === undefined;
      const isIncorrect = !isUnattempted && sel !== q.correctOption;

      if (isIncorrect || isUnattempted) {
        mistakes.push({
          ...q,
          index: idx,
          userSelected: sel,
          isUnattempted,
          isIncorrect
        });
      }

      if (isIncorrect) {
        const key = `${q.subject}:::${q.chapter || 'NCERT Core'}`;
        if (!chapterMap.has(key)) {
          chapterMap.set(key, {
            subject: q.subject,
            chapter: q.chapter || 'NCERT Core',
            incorrectCount: 0,
            marksLost: 0, // In NEET, each wrong Q costs 5 marks (4 lost + 1 negative penalty)
            questions: []
          });
        }
        const data = chapterMap.get(key);
        data.incorrectCount += 1;
        data.marksLost += 5;
        data.questions.push(q);
      }
    });

    const sortedWeak = Array.from(chapterMap.values()).sort(
      (a, b) => b.marksLost - a.marksLost
    );

    return { weakChapters: sortedWeak, mistakeQuestions: mistakes };
  }, [questions, attempt]);

  // Filtered mistake list
  const filteredMistakes = useMemo(() => {
    if (mistakeFilter === 'All') return mistakeQuestions;
    return mistakeQuestions.filter((q) => q.subject === mistakeFilter);
  }, [mistakeQuestions, mistakeFilter]);

  // Launch targeted AI drill on a weak topic
  const handleLaunchDrill = (subject, chapter) => {
    showToast(`⚡ Generating 5 targeted AI practice questions on ${chapter}...`, 'info', 3000);
    store.startPracticeDrill(subject, chapter, 5);
  };

  const estimatedAIR = Math.max(
    1,
    Math.round(2000000 * Math.pow(Math.max(0, 1 - attempt.score / 720), 2.2))
  );

  const rollNumber =
    attempt.rollNumber ||
    `NEET26-${String(new Date(attempt.submittedAt).getTime()).slice(-7)}`;

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 pb-24 md:pb-12 animate-fadeIn">
      
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Exam Submission Completed
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              NTA CBT Format
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-2">
            NEET UG Performance Scorecard & AI Diagnostic Report
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>Exam: <strong className="text-slate-200">{attempt.examTitle}</strong></span>
            <span>•</span>
            <span>Submitted: {new Date(attempt.submittedAt).toLocaleString()}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            title="Download or Print Scorecard as PDF (Ctrl + P)"
          >
            <Printer className="w-4 h-4" /> Print / Save Scorecard PDF
          </button>
          <button
            onClick={onExit}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>

      {/* =========================================================================
          OFFICIAL NTA NEET (UG) SCORECARD IDENTIFICATION HEADER (Prints cleanly)
          ========================================================================= */}
      <div className="scorecard-printable bg-white text-slate-900 rounded-2xl p-5 sm:p-7 border-2 border-slate-300 shadow-lg print-avoid-break">
        
        {/* NTA Watermark Emblem Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-blue-900 text-white font-extrabold flex flex-col items-center justify-center shadow-inner text-[11px] leading-tight shrink-0 border-2 border-amber-400">
              <span className="text-[13px] font-black text-amber-300">NTA</span>
              <span className="text-[8px] uppercase tracking-tighter">NEET UG</span>
            </div>
            <div>
              <p className="text-[11px] font-extrabold tracking-wider text-blue-900 uppercase">
                Government of India • Ministry of Education
              </p>
              <h2 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                National Testing Agency (NTA)
              </h2>
              <p className="text-[11px] font-bold text-slate-600">
                National Eligibility cum Entrance Test (UG) — Score Card 2026
              </p>
            </div>
          </div>
          <div className="text-right sm:border-l-2 sm:border-slate-300 sm:pl-4">
            <p className="text-[10px] uppercase font-bold text-slate-500">Official Candidate Score Card</p>
            <p className="text-xs font-mono font-bold text-blue-950">Roll: {rollNumber}</p>
            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 mt-1">
              PROVISIONAL CBT RESULT
            </span>
          </div>
        </div>

        {/* Candidate & Test Meta Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Candidate Name</span>
            <span className="font-extrabold text-slate-900 font-sans">{attempt.studentName || 'Aspirant'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Roll Number</span>
            <span className="font-mono font-bold text-blue-900">{rollNumber}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Exam Category</span>
            <span className="font-bold text-slate-800">{attempt.examTitle}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Exam Date & Session</span>
            <span className="font-medium text-slate-700">{new Date(attempt.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* 4 Score Badges in Print/Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <span className="text-[11px] font-bold text-blue-800 uppercase block">Total Marks</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-900 font-mono">
              {attempt.score}
              <span className="text-xs font-normal text-slate-500"> / {attempt.totalPossibleScore}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">Accuracy Rate</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
              {attempt.accuracy}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-[11px] font-bold text-purple-800 uppercase block">Correct / Wrong</span>
            <span className="text-xl sm:text-2xl font-black text-purple-900 font-mono">
              <span className="text-emerald-700">{attempt.correctCount}</span> / <span className="text-red-600">{attempt.incorrectCount}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[11px] font-bold text-amber-800 uppercase block">Estimated NEET AIR</span>
            <span className="text-xl sm:text-2xl font-black text-amber-900 font-mono">
              ~{estimatedAIR.toLocaleString()}
            </span>
          </div>
        </div>

      </div>

      {/* Tab Navigation (Hidden in Print) */}
      <div className="no-print flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto shadow-md">
        <button
          onClick={() => setActiveTab('scorecard')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'scorecard'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" /> Overall Scorecard & Diagnostic
        </button>
        <button
          onClick={() => setActiveTab('mistakes')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'mistakes'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-300" /> AI Mistake Notebook ({mistakeQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab('solutions')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'solutions'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Solutions & Explanations ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('proctoring')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'proctoring'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> AI Proctor Logs ({attempt.proctorLogs ? attempt.proctorLogs.length : 0})
        </button>
      </div>

      {/* =========================================================================
          TAB 1: OVERALL SCORECARD & DIAGNOSTIC
          ========================================================================= */}
      {(activeTab === 'scorecard' || typeof window !== 'undefined') && (
        <div className={`space-y-6 ${activeTab !== 'scorecard' ? 'hidden print:block' : 'animate-fadeIn'}`}>
          
          {/* Official Subject-Wise Performance Table */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-700/80 shadow-lg print-avoid-break">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Subject-Wise Performance Breakdown (NTA Marking Scheme)
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                +4 for Correct, -1 for Incorrect, 0 for Unattempted
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800/90 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-lg">Subject</th>
                    <th className="py-2.5 px-3 text-center">Total Qs</th>
                    <th className="py-2.5 px-3 text-center">Attempted</th>
                    <th className="py-2.5 px-3 text-center text-emerald-400">Correct (+4)</th>
                    <th className="py-2.5 px-3 text-center text-red-400">Incorrect (-1)</th>
                    <th className="py-2.5 px-3 text-center text-slate-400">Unattempted</th>
                    <th className="py-2.5 px-3 text-center">Accuracy</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Marks Obtained</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
                  {subjectStats.map((stat) => (
                    <tr key={stat.subject} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          stat.subject === 'Physics' ? 'bg-cyan-400' :
                          stat.subject === 'Chemistry' ? 'bg-amber-400' :
                          stat.subject === 'Botany' ? 'bg-emerald-400' : 'bg-purple-400'
                        }`} />
                        {stat.subject}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">{stat.total}</td>
                      <td className="py-3 px-3 text-center font-mono">{stat.attempted}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">{stat.correct}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-red-400">{stat.incorrect}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-400">{stat.unattempted}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold">
                        <span className={stat.accuracy >= 75 ? 'text-emerald-400' : stat.accuracy >= 50 ? 'text-amber-400' : 'text-red-400'}>
                          {stat.accuracy}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-cyan-300">
                        {stat.score} <span className="text-[10px] text-slate-400 font-normal">/ {stat.total * 4}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-700 bg-slate-900/60 font-bold text-slate-100">
                  <tr>
                    <td className="py-3 px-3 font-extrabold">Total Evaluated</td>
                    <td className="py-3 px-3 text-center font-mono">{questions.length}</td>
                    <td className="py-3 px-3 text-center font-mono">{attempt.correctCount + attempt.incorrectCount}</td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-400">{attempt.correctCount}</td>
                    <td className="py-3 px-3 text-center font-mono text-red-400">{attempt.incorrectCount}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{attempt.unattemptedCount}</td>
                    <td className="py-3 px-3 text-center font-mono text-cyan-300">{attempt.accuracy}%</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-base text-amber-300">
                      {attempt.score} <span className="text-[10px] text-slate-400 font-normal">/ {attempt.totalPossibleScore}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* AI Diagnostic Weak Area Analysis & Direct Remedial Practice Triggers */}
          <div className="glass-panel rounded-2xl p-5 border border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 shadow-xl print-avoid-break">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-amber-500/20 pb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> AI Diagnostic Engine
                </span>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" /> Priority Weak Chapters & Negative Mark Leaks
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Identified chapters where incorrect answers led to mark deductions. Click below to launch an instant 5-question AI drill!
                </p>
              </div>

              <button
                onClick={() => setActiveTab('mistakes')}
                className="no-print px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Mistake Notebook</span>
                <Zap className="w-3.5 h-3.5" />
              </button>
            </div>

            {weakChapters.length === 0 ? (
              <div className="p-6 text-center text-slate-300 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-sm text-emerald-300">Flawless Negative Mark Management!</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  You did not incur negative marks in this mock exam. Keep maintaining this level of discipline and precision!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {weakChapters.slice(0, 4).map((weak, wIdx) => (
                  <div
                    key={wIdx}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between gap-3 shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          weak.subject === 'Physics' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                          weak.subject === 'Chemistry' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          weak.subject === 'Botany' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {weak.subject}
                        </span>
                        <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                          -{weak.marksLost} Marks Leak
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-extrabold text-white leading-snug">
                        {weak.chapter}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        <strong className="text-red-400">{weak.incorrectCount} incorrect</strong> answer{weak.incorrectCount > 1 ? 's' : ''} in this topic.
                      </p>
                    </div>

                    <button
                      onClick={() => handleLaunchDrill(weak.subject, weak.chapter)}
                      className="no-print w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>⚡ Practice 5 AI Questions on {weak.chapter}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: AI MISTAKE NOTEBOOK (All Incorrect & Unattempted Questions)
          ========================================================================= */}
      {activeTab === 'mistakes' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Mistake Notebook Banner */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-amber-500/40 bg-slate-900 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Candidate Mistake Log & Revision Hub
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review questions missed, learn the exact NCERT concept, and attach your personal notes for future revision.
              </p>
            </div>

            {/* Subject Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
              {['All', 'Physics', 'Chemistry', 'Botany', 'Zoology'].map((f) => (
                <button
                  key={f}
                  onClick={() => setMistakeFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    mistakeFilter === f
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredMistakes.length === 0 ? (
            <div className="p-8 text-center glass-panel rounded-2xl border border-slate-800 text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-base font-bold text-white">No Mistakes Found</h4>
              <p className="text-xs text-slate-400 mt-1">
                You have 0 incorrect or unattempted questions in {mistakeFilter === 'All' ? 'this mock' : mistakeFilter}!
              </p>
            </div>
          ) : (
            filteredMistakes.map((q) => {
              const userSelected = q.userSelected;
              const isUnattempted = q.isUnattempted;

              return (
                <div key={q.id} className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md solution-item-card">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2.5 mb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-cyan-300 font-mono text-xs font-bold">
                        Q.{q.index + 1}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {q.subject} • {q.chapter}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                        isUnattempted
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {isUnattempted ? '0 Marks (Unattempted)' : '-1 Mark (Negative Marked)'}
                      </span>
                      
                      <button
                        onClick={() => handleLaunchDrill(q.subject, q.chapter)}
                        className="no-print px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/20 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Practice 5 questions on this chapter"
                      >
                        <Zap className="w-3 h-3" /> Drill Topic
                      </button>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-100 font-medium mb-3 leading-relaxed">
                    <MathText text={q.text} />
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((optText, optIdx) => {
                      const isRightOpt = optIdx === q.correctOption;
                      const isUserOpt = optIdx === userSelected;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 ${
                            isRightOpt
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                              : isUserOpt
                              ? 'bg-red-950/60 border-red-500 text-red-200'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="leading-snug flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                            <MathText text={optText} />
                          </span>
                          {isRightOpt && <span className="font-bold text-emerald-400 shrink-0 text-[11px]">✓ Correct</span>}
                          {isUserOpt && !isRightOpt && <span className="font-bold text-red-400 shrink-0 text-[11px]">✗ Your Pick</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Official Solution */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 mb-3">
                    <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> Official Solution & Key Concept:
                    </h4>
                    <div className="text-xs text-slate-300 leading-relaxed font-sans">
                      <MathText text={q.explanation} />
                    </div>
                  </div>

                  {/* Personal Revision Note */}
                  <div className="pt-2 border-t border-slate-800/80 no-print">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-bold text-slate-300">My Personal Mistake Note:</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Remember to check units or review formula..."
                        value={noteInputs[q.id] || ''}
                        onChange={(e) => setNoteInputs({ ...noteInputs, [q.id]: e.target.value })}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => handleSaveNote(q.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 3: COMPLETE SOLUTIONS & EXPLANATIONS
          ========================================================================= */}
      {activeTab === 'solutions' && (
        <div className="space-y-4 animate-fadeIn">
          {questions.map((q, idx) => {
            const resp = attempt.responses[q.id] || {};
            const userSelected = resp.selectedOption;
            const isCorrect = userSelected === q.correctOption;
            const isUnattempted = userSelected === null || userSelected === undefined;

            return (
              <div key={q.id} className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 solution-item-card">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2.5 mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-cyan-300 font-mono text-xs font-bold">
                      Q.{idx + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{q.subject} • {q.chapter}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                    isCorrect
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isUnattempted
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {isCorrect ? '+4 Marks (Correct)' : isUnattempted ? '0 Marks (Unattempted)' : '-1 Mark (Incorrect)'}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-100 font-medium mb-3 leading-relaxed">
                  <MathText text={q.text} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((optText, optIdx) => {
                    const isRightOpt = optIdx === q.correctOption;
                    const isUserOpt = optIdx === userSelected;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 ${
                          isRightOpt
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : isUserOpt
                            ? 'bg-red-950/60 border-red-500 text-red-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="leading-snug flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                          <MathText text={optText} />
                        </span>
                        {isRightOpt && <span className="font-bold text-emerald-400 shrink-0 text-[11px]">✓ Correct</span>}
                        {isUserOpt && !isRightOpt && <span className="font-bold text-red-400 shrink-0 text-[11px]">✗ Your Pick</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-3">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Official Solution & Explanation:
                  </h4>
                  <div className="text-xs text-slate-300 leading-relaxed font-sans">
                    <MathText text={q.explanation} />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 no-print">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-slate-300">My Personal Revision Note:</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Add personal note..."
                      value={noteInputs[q.id] || ''}
                      onChange={(e) => setNoteInputs({ ...noteInputs, [q.id]: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleSaveNote(q.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          TAB 4: AI PROCTOR LOGS & SECURITY AUDIT
          ========================================================================= */}
      {activeTab === 'proctoring' && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 animate-fadeIn">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> AI Proctor Telemetry & Audit Logs
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Session biometric events, tab switching, and fullscreen lock audit logs.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
              Total Logs: {attempt.proctorLogs ? attempt.proctorLogs.length : 0}
            </span>
          </div>

          {(!attempt.proctorLogs || attempt.proctorLogs.length === 0) ? (
            <div className="p-6 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs">No proctoring violations recorded. Session adhered to all NTA security protocols.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {attempt.proctorLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    log.severity === 'Critical'
                      ? 'bg-red-950/40 border-red-500/40 text-red-200'
                      : log.severity === 'Warning'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-bold">{log.eventType}</span>: {log.details}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
