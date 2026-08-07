import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ShieldCheck, BookOpen, Edit3, ArrowLeft } from 'lucide-react';
import { store } from '../../services/store';

export default function PostExamScorecard({ attempt, storeState, onExit }) {
  const [activeTab, setActiveTab] = useState('scorecard');
  const [noteInputs, setNoteInputs] = useState(storeState.userNotes || {});

  const questions = store.getExamQuestions();

  const handleSaveNote = (qId) => {
    store.saveUserNote(qId, noteInputs[qId] || '');
  };

  return (
    <div className="min-h-screen p-3 sm:p-8 max-w-6xl mx-auto space-y-5 pb-20 md:pb-8 animate-fadeIn">
      
      <div className="glass-panel rounded-3xl p-5 sm:p-8 border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Exam Submission Completed
          </span>
          <h1 className="text-xl sm:text-3xl font-display font-extrabold text-white mt-2">
            NEET CBT Performance Result
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Exam: {attempt.examTitle} | Submitted: {new Date(attempt.submittedAt).toLocaleTimeString()}
          </p>
        </div>

        <button
          onClick={onExit}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('scorecard')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'scorecard' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overall Scorecard
        </button>
        <button
          onClick={() => setActiveTab('solutions')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'solutions' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Solutions & Explanations
        </button>
        <button
          onClick={() => setActiveTab('proctoring')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'proctoring' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          AI Proctor Logs ({attempt.proctorLogs ? attempt.proctorLogs.length : 0})
        </button>
      </div>

      {activeTab === 'scorecard' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-900/40 via-slate-900 to-slate-900 border border-cyan-500/40 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Your Score</p>
                <p className="text-2xl font-extrabold text-cyan-300 font-mono">
                  {attempt.score} <span className="text-xs font-normal text-slate-400">/ {attempt.totalPossibleScore}</span>
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Accuracy Rate</p>
                <p className="text-2xl font-extrabold text-emerald-300 font-mono">{attempt.accuracy}%</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Correct / Incorrect</p>
                <p className="text-lg font-bold text-white font-mono">
                  <span className="text-emerald-400">{attempt.correctCount}</span> / <span className="text-red-400">{attempt.incorrectCount}</span>
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Estimated NEET AIR</p>
                <p className="text-xl font-extrabold text-amber-300 font-mono">
                  ~{Math.max(1, Math.round(2000000 * Math.pow(1 - attempt.score / 720, 2)))}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'solutions' && (
        <div className="space-y-4 animate-fadeIn">
          {questions.map((q, idx) => {
            const resp = attempt.responses[q.id] || {};
            const userSelected = resp.selectedOption;
            const isCorrect = userSelected === q.correctOption;
            const isUnattempted = userSelected === null || userSelected === undefined;

            return (
              <div key={q.id} className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800">
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

                <p className="text-xs sm:text-sm text-slate-100 font-medium mb-3 leading-relaxed">{q.text}</p>

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
                        <span className="leading-snug">{String.fromCharCode(65 + optIdx)}. {optText}</span>
                        {isRightOpt && <span className="font-bold text-emerald-400 shrink-0 text-[11px]">✓ Correct</span>}
                        {isUserOpt && !isRightOpt && <span className="font-bold text-red-400 shrink-0 text-[11px]">✗ Your Pick</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-3">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Official Solution & Explanation:
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{q.explanation}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
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

    </div>
  );
}
