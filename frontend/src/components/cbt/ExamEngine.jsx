import React, { useState, useEffect } from 'react';
import { Clock, Bookmark, RotateCcw, ArrowRight, Send, User, Menu, X, CheckCircle2 } from 'lucide-react';
import { store } from '../../services/store';

export default function ExamEngine({ exam, currentUser, storeState, onExit }) {
  const [timeRemainingSec, setTimeRemainingSec] = useState(exam.durationMin * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showMobilePalette, setShowMobilePalette] = useState(false);

  const questions = store.getExamQuestions();
  const currentIndex = storeState.currentQuestionIndex || 0;
  const currentQuestion = questions[currentIndex] || questions[0];
  const activeSection = storeState.activeSection || 'Physics';

  const sections = ['Physics', 'Chemistry', 'Botany', 'Zoology'];

  const response = storeState.examResponses[currentQuestion?.id] || { selectedOption: null, isMarkedForReview: false };
  const selectedOption = response.selectedOption;

  const isSectionB = (currentIndex % 50) >= 35;

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmission();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFinalSubmission = () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}

    store.submitExam();
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getStatusCounts = () => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let markedAnswered = 0;
    let notVisited = 0;

    questions.forEach((q) => {
      const resp = storeState.examResponses[q.id];
      const visited = storeState.examAnswersVisited[q.id];

      if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
        if (resp.isMarkedForReview) {
          markedAnswered++;
        } else {
          answered++;
        }
      } else if (resp && resp.isMarkedForReview) {
        marked++;
      } else if (visited) {
        notAnswered++;
      } else {
        notVisited++;
      }
    });

    return { answered, notAnswered, marked, markedAnswered, notVisited };
  };

  const statusCounts = getStatusCounts();

  const handleSelectOption = (idx) => {
    store.saveQuestionResponse(currentQuestion.id, idx);
  };

  const handleSaveAndNext = () => {
    if (currentIndex < questions.length - 1) {
      store.setCurrentQuestionIndex(currentIndex + 1);
    }
  };

  const handleMarkForReviewAndNext = () => {
    store.saveQuestionResponse(currentQuestion.id, selectedOption, true);
    if (currentIndex < questions.length - 1) {
      store.setCurrentQuestionIndex(currentIndex + 1);
    }
  };

  const handleClearResponse = () => {
    store.clearQuestionResponse(currentQuestion.id);
  };

  const getPaletteStatusClass = (q) => {
    const resp = storeState.examResponses[q.id];
    const visited = storeState.examAnswersVisited[q.id];

    if (resp && resp.selectedOption !== null && resp.selectedOption !== undefined) {
      return resp.isMarkedForReview ? 'q-btn-marked-answered' : 'q-btn-answered';
    }
    if (resp && resp.isMarkedForReview) {
      return 'q-btn-marked';
    }
    if (visited) {
      return 'q-btn-not-answered';
    }
    return 'q-btn-not-visited';
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white space-y-4">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-amber-300">Loading NTA CBT Engine & NCERT Questions...</p>
        <button
          onClick={onExit}
          className="px-5 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:text-white border border-slate-700 cursor-pointer shadow-md"
        >
          Return to Exam Portal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen cbt-canvas flex flex-col justify-between text-slate-900 font-sans select-none">
      
      {/* 1. Official NTA CBT Header Bar (Mobile & Desktop Responsive) */}
      <header className="cbt-header-bar px-3 sm:px-4 py-2 flex items-center justify-between shadow-md border-b-2 border-amber-500 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-amber-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded text-xs tracking-wider">
            NEET UG
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{exam.title}</h1>
            <p className="text-[10px] text-slate-200 hidden sm:block">
              Pattern: <span className="font-mono text-amber-300 font-bold">200Q (720M)</span> | Scoring: <span className="text-emerald-300">+4 / -1</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setShowMobilePalette(true)}
            className="lg:hidden px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5" /> Palette
          </button>

          <div className="hidden md:flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-700">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <div className="text-left text-xs">
              <p className="font-bold text-white leading-tight">{currentUser.name}</p>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-mono font-bold text-xs sm:text-sm border ${
            timeRemainingSec < 600 ? 'bg-red-600 text-white border-red-400 animate-pulse' : 'bg-amber-400 text-slate-950 border-amber-300'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeRemainingSec)}</span>
          </div>
        </div>
      </header>

      {/* 2. Main CBT Test Workplace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Question Paper Canvas View */}
        <main className="lg:col-span-8 p-3 sm:p-6 flex flex-col justify-between border-r border-slate-300 bg-slate-100">
          
          <div>
            {/* Subject Section Tabs (Scrollable on phones) */}
            <div className="flex items-center gap-1.5 border-b-2 border-slate-300 pb-2 mb-3 overflow-x-auto">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide mr-1 shrink-0">Subject:</span>
              {sections.map((sec) => (
                <button
                  key={sec}
                  onClick={() => store.setActiveSection(sec)}
                  className={`px-3 py-1 rounded text-xs font-extrabold transition-all border shrink-0 cursor-pointer ${
                    activeSection === sec
                      ? 'bg-slate-900 text-amber-300 border-slate-900 shadow'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-300'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {/* Question Bar Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded border border-slate-300 mb-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-slate-900 text-amber-400 font-mono text-xs font-extrabold">
                  Q. {currentIndex + 1}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                  isSectionB ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}>
                  {isSectionB ? 'Section B (Attempt Any 10)' : 'Section A (Mandatory 35)'}
                </span>
              </div>
              <span className="text-[11px] font-bold font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                +4 Marks / -1 Mark
              </span>
            </div>

            {/* Question Statement Card */}
            <div className="cbt-question-card p-4 sm:p-5 rounded-lg mb-4">
              {currentQuestion.isAiPredicted && (
                <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase mb-2">
                  ⚡ AI High-Yield Predicted ({currentQuestion.probabilityWeight || 'High Prob'})
                </span>
              )}
              <p className="text-sm sm:text-base text-slate-900 font-semibold leading-relaxed font-sans">
                {currentQuestion.text}
              </p>
            </div>

            {/* 4 Options Radio Cards (Touch-Optimized) */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((optText, idx) => {
                const isSelected = selectedOption === idx;
                const optLetter = String.fromCharCode(65 + idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all min-h-[48px] ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold ring-2 ring-blue-600/30 shadow-sm'
                        : 'bg-white border-slate-300 hover:border-slate-400 text-slate-800'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-400 bg-slate-100 text-slate-600'
                    }`}>
                      {optLetter}
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">{optText}</span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Action Buttons Footer (Responsive Layout) */}
          <div className="pt-4 border-t border-slate-300 flex flex-wrap items-center justify-between gap-2 mt-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleMarkForReviewAndNext}
                className="flex-1 sm:flex-initial px-3 py-2 rounded bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" /> Mark Review & Next
              </button>

              <button
                onClick={handleClearResponse}
                className="flex-1 sm:flex-initial px-3 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </button>
            </div>

            <button
              onClick={handleSaveAndNext}
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Save & Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </main>

        {/* Right Desktop NTA Question Palette Panel */}
        <aside className="hidden lg:flex lg:col-span-4 bg-white p-4 border-l border-slate-300 flex-col justify-between">
          <div>
            <div className="bg-slate-100 p-3 rounded border border-slate-300 mb-4 space-y-2 text-xs">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-300">
                <img src={currentUser.avatar} alt="Candidate" className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-400" />
                <div>
                  <p className="font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-600">Roll: NEET-NTA-9842</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center font-bold text-[10px] q-btn-answered">{statusCounts.answered}</span>
                  <span className="text-slate-700 font-medium">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center font-bold text-[10px] q-btn-not-answered">{statusCounts.notAnswered}</span>
                  <span className="text-slate-700 font-medium">Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center font-bold text-[10px] q-btn-not-visited">{statusCounts.notVisited}</span>
                  <span className="text-slate-700 font-medium">Not Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center font-bold text-[10px] q-btn-marked">{statusCounts.marked}</span>
                  <span className="text-slate-700 font-medium">Marked Review</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">Question Palette:</span>
                <span className="text-[11px] font-mono font-bold text-slate-600">{questions.length} Questions</span>
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const statusClass = getPaletteStatusClass(q);
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => store.setCurrentQuestionIndex(idx)}
                      className={`w-9 h-9 font-mono font-bold text-xs flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${statusClass} ${
                        isCurrent ? 'ring-2 ring-slate-900 ring-offset-2 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-300 mt-4">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 rounded bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" /> Submit Exam Paper
            </button>
          </div>
        </aside>

      </div>

      {/* Mobile Question Palette Drawer Modal */}
      {showMobilePalette && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-4 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <h3 className="text-sm font-bold text-slate-900">Question Palette</h3>
                <button onClick={() => setShowMobilePalette(false)} className="p-1 text-slate-500 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto pr-1 mb-4">
                {questions.map((q, idx) => {
                  const statusClass = getPaletteStatusClass(q);
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        store.setCurrentQuestionIndex(idx);
                        setShowMobilePalette(false);
                      }}
                      className={`w-9 h-9 font-mono font-bold text-xs flex items-center justify-center ${statusClass} ${
                        isCurrent ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setShowMobilePalette(false);
                setShowSubmitModal(true);
              }}
              className="w-full py-3 rounded bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Submit Test
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-300 shadow-2xl text-slate-900 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Confirm CBT Test Submission?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submitting will automatically exit fullscreen mode and release your hardware proctoring streams.
            </p>

            <div className="bg-slate-100 p-3 rounded-xl border border-slate-300 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-700">
                <span>Total Questions:</span> <span className="font-bold">{questions.length}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Answered:</span> <span className="font-bold">{statusCounts.answered + statusCounts.markedAnswered}</span>
              </div>
              <div className="flex justify-between text-red-700">
                <span>Unanswered:</span> <span className="font-bold">{statusCounts.notAnswered + statusCounts.notVisited}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Resume Test
              </button>
              <button
                onClick={handleFinalSubmission}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
