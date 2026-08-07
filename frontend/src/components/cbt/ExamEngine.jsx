import React, { useState, useEffect } from 'react';
import { Clock, Bookmark, RotateCcw, ArrowRight, Send, User, ShieldAlert } from 'lucide-react';
import { store } from '../../services/store';

export default function ExamEngine({ exam, currentUser, storeState, onExit }) {
  const [timeRemainingSec, setTimeRemainingSec] = useState(exam.durationMin * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const questions = store.getExamQuestions();
  const currentIndex = storeState.currentQuestionIndex || 0;
  const currentQuestion = questions[currentIndex] || questions[0];
  const activeSection = storeState.activeSection || 'Physics';

  const sections = ['Physics', 'Chemistry', 'Botany', 'Zoology'];

  const response = storeState.examResponses[currentQuestion?.id] || { selectedOption: null, isMarkedForReview: false };
  const selectedOption = response.selectedOption;

  // Section A vs Section B classification (NEET NTA Pattern: Q1-35 Section A, Q36-50 Section B per subject)
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

  // Hardware Teardown & Fullscreen Exit Handler
  const handleFinalSubmission = () => {
    // 1. Exit Fullscreen Mode cleanly
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}

    // 2. Submit Exam in store (disables camera & mic states)
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
    return <div className="p-8 text-center text-slate-800">Loading NTA CBT Engine...</div>;
  }

  return (
    <div className="min-h-screen cbt-canvas flex flex-col justify-between text-slate-900 font-sans select-none">
      
      {/* 1. Official NTA CBT Header Bar */}
      <header className="cbt-header-bar px-4 py-2.5 flex items-center justify-between shadow-md border-b-2 border-amber-500">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 text-slate-950 font-extrabold px-3 py-1 rounded text-sm tracking-wider">
            NTA NEET UG (200Q Pattern)
          </div>
          <div>
            <h1 className="text-sm font-bold text-white line-clamp-1">{exam.title}</h1>
            <p className="text-[11px] text-slate-200">
              Pattern: <span className="font-mono text-amber-300 font-bold">200 Questions (720 Marks)</span> | Marking: <span className="text-emerald-300">+4 / -1</span>
            </p>
          </div>
        </div>

        {/* Candidate Info Box & Countdown Timer */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 px-3 py-1 rounded border border-slate-700">
            <User className="w-4 h-4 text-amber-400" />
            <div className="text-left text-xs">
              <p className="font-bold text-white">{currentUser.name}</p>
              <p className="text-[10px] text-slate-300">Roll: NEET-2026-9842</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded font-mono font-bold text-sm sm:text-base border ${
            timeRemainingSec < 600 ? 'bg-red-600 text-white border-red-400 animate-pulse' : 'bg-amber-400 text-slate-950 border-amber-300'
          }`}>
            <Clock className="w-4 h-4" />
            <span>Time Left: {formatTime(timeRemainingSec)}</span>
          </div>
        </div>
      </header>

      {/* 2. Main CBT Test Center Workplace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left 8/12: High-Contrast Question Paper Paper View */}
        <main className="lg:col-span-8 p-4 sm:p-6 flex flex-col justify-between border-r border-slate-300 bg-slate-100">
          
          <div>
            {/* Section Tabs (Physics, Chemistry, Botany, Zoology) */}
            <div className="flex items-center gap-2 border-b-2 border-slate-300 pb-3 mb-4 overflow-x-auto">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide mr-2">Subject Section:</span>
              {sections.map((sec) => (
                <button
                  key={sec}
                  onClick={() => store.setActiveSection(sec)}
                  className={`px-4 py-1.5 rounded text-xs font-extrabold transition-all border ${
                    activeSection === sec
                      ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-300'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {/* Question Bar Header (Section A vs Section B) */}
            <div className="flex items-center justify-between bg-white p-3 rounded border border-slate-300 mb-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-slate-900 text-amber-400 font-mono text-xs font-extrabold">
                  Question No. {currentIndex + 1}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${
                  isSectionB ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}>
                  {isSectionB ? 'Section B (Attempt Any 10 out of 15)' : 'Section A (Mandatory 35 Questions)'}
                </span>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                +4 Marks / -1 Mark
              </span>
            </div>

            {/* Question Text Box */}
            <div className="cbt-question-card p-5 rounded-lg mb-6">
              {currentQuestion.isAiPredicted && (
                <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase mb-2">
                  ⚡ AI High-Yield Predicted ({currentQuestion.probabilityWeight || 'High Prob'})
                </span>
              )}
              <p className="text-base text-slate-900 font-semibold leading-relaxed font-sans">
                {currentQuestion.text}
              </p>
            </div>

            {/* 4 Options Radio Cards */}
            <div className="space-y-3">
              {currentQuestion.options.map((optText, idx) => {
                const isSelected = selectedOption === idx;
                const optLetter = String.fromCharCode(65 + idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold ring-2 ring-blue-600/30'
                        : 'bg-white border-slate-300 hover:border-slate-400 text-slate-800'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-400 bg-slate-100 text-slate-600'
                    }`}>
                      {optLetter}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{optText}</span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* NTA Action Buttons Footer */}
          <div className="pt-6 border-t border-slate-300 flex flex-wrap items-center justify-between gap-3 mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-4 py-2 rounded bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Bookmark className="w-3.5 h-3.5" /> Mark for Review & Next
              </button>

              <button
                onClick={handleClearResponse}
                className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Response
              </button>
            </div>

            <button
              onClick={handleSaveAndNext}
              className="px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Save & Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </main>

        {/* Right 4/12: NTA Question Palette Drawer */}
        <aside className="lg:col-span-4 bg-white p-4 border-t lg:border-t-0 border-slate-300 flex flex-col justify-between">
          
          <div>
            {/* Candidate Photo & Legend */}
            <div className="bg-slate-100 p-3 rounded border border-slate-300 mb-4 space-y-2 text-xs">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-300">
                <div className="w-12 h-14 bg-slate-300 rounded border border-slate-400 overflow-hidden shrink-0">
                  <img src={currentUser.avatar} alt="Candidate" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-600">Roll: NEET-2026-9842</p>
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
                  <span className="text-slate-700 font-medium">Marked for Review</span>
                </div>
              </div>
            </div>

            {/* Question Number Palette Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">Question Palette:</span>
                <span className="text-[11px] font-mono font-bold text-slate-600">{questions.length} Questions</span>
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const statusClass = getPaletteStatusClass(q);
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => store.setCurrentQuestionIndex(idx)}
                      className={`w-9 h-9 font-mono font-bold text-xs flex items-center justify-center transition-transform hover:scale-105 ${statusClass} ${
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

          {/* Submit Test Button */}
          <div className="pt-4 border-t border-slate-300 mt-4">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 rounded bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" /> Submit Exam (Exit Hardware & Fullscreen)
            </button>
          </div>

        </aside>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-xl p-6 border border-slate-300 shadow-2xl text-slate-900">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm CBT Test Submission?</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Submitting will automatically exit fullscreen mode and release your camera & microphone hardware streams.
            </p>

            <div className="bg-slate-100 p-3 rounded border border-slate-300 space-y-1.5 text-xs mb-6">
              <div className="flex justify-between text-slate-700">
                <span>Total Questions:</span> <span className="font-bold font-mono">{questions.length}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Answered:</span> <span className="font-bold font-mono">{statusCounts.answered + statusCounts.markedAnswered}</span>
              </div>
              <div className="flex justify-between text-red-700">
                <span>Unanswered:</span> <span className="font-bold font-mono">{statusCounts.notAnswered + statusCounts.notVisited}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded bg-slate-200 text-slate-800 hover:bg-slate-300 text-xs font-bold"
              >
                Resume Test
              </button>
              <button
                onClick={handleFinalSubmission}
                className="flex-1 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Confirm & Turn Off Hardware
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
