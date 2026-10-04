import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Bookmark, RotateCcw, ArrowRight, ArrowLeft, Send, User, Menu, X, CheckCircle2, ZoomIn, ZoomOut, Type, Layers, Keyboard, HelpCircle } from 'lucide-react';
import { store } from '../../services/store';
import { showToast } from '../ui/Toast';
import MathText from '../ui/MathText';

export default function ExamEngine({ exam, currentUser, storeState, onExit }) {
  const [timeRemainingSec, setTimeRemainingSec] = useState((exam.durationMin || 200) * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [fontSizeMode, setFontSizeMode] = useState('normal'); // 'normal' | 'large' | 'xl'
  const [paletteFilter, setPaletteFilter] = useState('all'); // 'all' | 'A' | 'B'


  const questions = store.getExamQuestions();
  const currentIndex = storeState.currentQuestionIndex || 0;
  const currentQuestion = questions[currentIndex] || questions[0];
  const activeSection = storeState.activeSection || 'Physics';

  const sections = ['Physics', 'Chemistry', 'Botany', 'Zoology'];

  const response = (currentQuestion && storeState.examResponses[currentQuestion.id]) || { selectedOption: null, isMarkedForReview: false };
  const selectedOption = response.selectedOption;

  const isSectionB = (currentIndex % 50) >= 35;
  const questionFontClass = fontSizeMode === 'xl' ? 'text-base sm:text-lg' : fontSizeMode === 'large' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm';
  const optionFontClass = fontSizeMode === 'xl' ? 'text-sm sm:text-base' : fontSizeMode === 'large' ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm';


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

  // Compute Section B attempted count for a given subject
  const getSubjectSecBAttemptCount = (subject) => {
    if (!subject) return 0;
    const subQuestions = questions.filter(
      (q) => q.subject && q.subject.toLowerCase() === subject.toLowerCase()
    );
    const secBQuestions = subQuestions.slice(35, 50);
    return secBQuestions.filter((q) => {
      const resp = storeState.examResponses[q.id];
      return resp && resp.selectedOption !== null && resp.selectedOption !== undefined;
    }).length;
  };

  const handleSelectOption = (idx) => {
    if (!currentQuestion) return;

    // Check NTA Section B 10/10 Attempt limit
    if (isSectionB) {
      const isAlreadyAnswered = selectedOption !== null && selectedOption !== undefined;
      const currentSecBCount = getSubjectSecBAttemptCount(currentQuestion.subject);

      if (!isAlreadyAnswered && currentSecBCount >= 10) {
        showToast(
          `⚠️ NTA Rule: You have already attempted 10 questions in Section B of ${currentQuestion.subject}. Only 10 attempts are evaluated. Clear an existing attempt to answer this question.`,
          'warning',
          5000
        );
        return;
      }
    }

    store.saveQuestionResponse(currentQuestion.id, idx);
  };

  const handleSaveAndNext = () => {
    if (currentQuestion && selectedOption !== null && selectedOption !== undefined) {
      store.saveQuestionResponse(currentQuestion.id, selectedOption);
    }

    if (currentIndex < questions.length - 1) {
      store.setCurrentQuestionIndex(currentIndex + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      store.setCurrentQuestionIndex(currentIndex - 1);
    }
  };

  const handleMarkForReviewAndNext = () => {
    if (currentQuestion) {
      store.saveQuestionResponse(currentQuestion.id, selectedOption, true);
    }
    if (currentIndex < questions.length - 1) {
      store.setCurrentQuestionIndex(currentIndex + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handleClearResponse = () => {
    if (currentQuestion) {
      store.clearQuestionResponse(currentQuestion.id);
    }
  };

  // Keyboard navigation shortcuts (A/B/C/D, Enter, R, Backspace, Arrow keys, ?)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || showSubmitModal) return;

      const key = e.key.toLowerCase();

      if (key === 'a' || key === '1') {
        e.preventDefault();
        handleSelectOption(0);
      } else if (key === 'b' || key === '2') {
        e.preventDefault();
        handleSelectOption(1);
      } else if (key === 'c' || key === '3') {
        e.preventDefault();
        handleSelectOption(2);
      } else if (key === 'd' || key === '4') {
        e.preventDefault();
        handleSelectOption(3);
      } else if (key === 'enter') {
        e.preventDefault();
        handleSaveAndNext();
      } else if (key === 'arrowright') {
        e.preventDefault();
        if (currentIndex < questions.length - 1) {
          store.setCurrentQuestionIndex(currentIndex + 1);
        }
      } else if (key === 'arrowleft') {
        e.preventDefault();
        if (currentIndex > 0) {
          store.setCurrentQuestionIndex(currentIndex - 1);
        }
      } else if (key === 'r') {
        e.preventDefault();
        handleMarkForReviewAndNext();
      } else if (key === 'backspace' || key === 'delete') {
        e.preventDefault();
        handleClearResponse();
      } else if (key === '?') {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion, selectedOption, showSubmitModal, questions.length]);


  const handleSectionTabClick = (sec) => {
    const firstInSection = questions.findIndex(
      (q) => q.subject && q.subject.toLowerCase() === sec.toLowerCase()
    );
    if (firstInSection !== -1) {
      store.setCurrentQuestionIndex(firstInSection);
    }
    store.setActiveSection(sec);
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
      <div className="h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white space-y-4">
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
    <div className="h-screen max-h-screen flex flex-col justify-between text-slate-900 font-sans select-none bg-slate-100 overflow-hidden">
      
      {/* 1. Official NTA CBT Header Bar */}
      <header className="cbt-header-bar shrink-0 px-3 sm:px-4 py-2 flex items-center justify-between shadow-md border-b-2 border-amber-500 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-amber-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded text-xs tracking-wider">
            NEET UG
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{exam.title}</h1>
            <p className="text-[10px] text-slate-200 hidden sm:block">
              Pattern: <span className="font-mono text-amber-300 font-bold">{questions.length}Q</span> | Scoring: <span className="text-emerald-300">+4 / -1</span>
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

          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-amber-300 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Shortcuts</span>
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Question Paper Canvas View */}
        <main className="lg:col-span-8 flex flex-col h-full overflow-hidden border-r border-slate-300 bg-slate-100">
          
          {/* Scrollable Question Content Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
            
            {/* Subject Section Tabs (Scrollable on phones) */}
            <div className="flex items-center gap-1.5 border-b-2 border-slate-300 pb-2 mb-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide mr-1 shrink-0">Subject:</span>
              {sections.map((sec) => {
                const countForSec = questions.filter(
                  (q) => q.subject && q.subject.toLowerCase() === sec.toLowerCase()
                ).length;
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleSectionTabClick(sec)}
                    className={`px-3 py-1 rounded text-xs font-extrabold transition-all border shrink-0 cursor-pointer flex items-center gap-1 ${
                      activeSection === sec
                        ? 'bg-slate-900 text-amber-300 border-slate-900 shadow'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-300'
                    }`}
                  >
                    <span>{sec}</span>
                    {countForSec > 0 && (
                      <span className="text-[10px] opacity-75 font-mono">({countForSec})</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Question Bar Header with Official NTA Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-300 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded bg-slate-900 text-amber-400 font-mono text-xs font-extrabold">
                  Q. {currentIndex + 1} of {questions.length}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                  isSectionB
                    ? getSubjectSecBAttemptCount(currentQuestion?.subject) >= 10
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-purple-100 text-purple-900 border border-purple-300'
                    : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}>
                  {isSectionB
                    ? `Section B (Attempted: ${getSubjectSecBAttemptCount(currentQuestion?.subject)}/10)`
                    : 'Section A (Mandatory 1-35)'}
                </span>
                <span className="text-[11px] font-bold font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  +4 / -1
                </span>
              </div>

              {/* NTA Font Size Zoom Tool (A- | A | A+) */}
              <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded-lg border border-slate-200 text-xs">
                <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">Zoom:</span>
                <button
                  type="button"
                  onClick={() => setFontSizeMode('normal')}
                  className={`px-1.5 py-0.5 rounded font-bold text-[11px] transition-all cursor-pointer ${
                    fontSizeMode === 'normal' ? 'bg-white text-blue-700 shadow-xs border border-slate-300' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Standard Font Size"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSizeMode('large')}
                  className={`px-1.5 py-0.5 rounded font-bold text-xs transition-all cursor-pointer ${
                    fontSizeMode === 'large' ? 'bg-white text-blue-700 shadow-xs border border-slate-300' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Large Font Size"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSizeMode('xl')}
                  className={`px-1.5 py-0.5 rounded font-extrabold text-sm transition-all cursor-pointer ${
                    fontSizeMode === 'xl' ? 'bg-white text-blue-700 shadow-xs border border-slate-300' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Extra Large Font Size"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Question Statement Card with KaTeX Math Rendering */}
            <div className="cbt-question-card p-4 sm:p-5 rounded-xl border border-slate-300 bg-white shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {currentQuestion.subject} • {currentQuestion.chapter || 'NCERT Core'}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                  {currentQuestion.difficulty || 'Medium'}
                </span>
              </div>
              <div className={`text-slate-900 font-semibold leading-relaxed font-sans ${questionFontClass}`}>
                <MathText text={currentQuestion.text} />
              </div>
            </div>

            {/* 4 Options Radio Cards with KaTeX Math Rendering */}
            <div className="space-y-2.5 pb-4">
              {currentQuestion.options && currentQuestion.options.map((optText, idx) => {
                const isSelected = selectedOption === idx;
                const optLetter = String.fromCharCode(65 + idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all min-h-[48px] select-none ${
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
                    <div className={`font-medium leading-relaxed pt-0.5 ${optionFontClass}`}>
                      <MathText text={optText} />
                    </div>
                  </div>
                );
              })}
            </div>


          </div>

          {/* Sticky Bottom Action Bar - ALWAYS VISIBLE AT BOTTOM */}
          <div className="shrink-0 bg-white/95 backdrop-blur-sm p-3 sm:px-5 border-t border-slate-300 shadow-md flex flex-wrap items-center justify-between gap-2 z-20">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-3 sm:px-3.5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <button
                type="button"
                onClick={handleClearResponse}
                className="px-2.5 sm:px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </button>

              <button
                type="button"
                onClick={handleMarkForReviewAndNext}
                className="px-3 sm:px-3.5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Review & Next</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Palette Jump Button */}
              <button
                type="button"
                onClick={() => setShowMobilePalette(true)}
                className="lg:hidden px-3 py-2 rounded-lg bg-slate-900 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Menu className="w-3.5 h-3.5" /> Palette
              </button>

              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-4 sm:px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span>{currentIndex === questions.length - 1 ? 'Save & Review' : 'Save & Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </main>

        {/* Right Desktop NTA Question Palette Panel */}
        <aside className="hidden lg:flex lg:col-span-4 bg-white flex-col h-full overflow-hidden border-l border-slate-300">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            
            {/* Candidate Card & Status Counts */}
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-300 space-y-2 text-xs">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-300">
                <img src={currentUser.avatar} alt="Candidate" className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-400" />
                <div>
                  <p className="font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-600">Roll: NEET-NTA-9842</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center font-bold text-[10px] q-btn-answered shadow-xs">{statusCounts.answered}</span>
                  <span className="text-slate-700 font-medium">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center font-bold text-[10px] q-btn-not-answered shadow-xs">{statusCounts.notAnswered}</span>
                  <span className="text-slate-700 font-medium">Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center font-bold text-[10px] q-btn-not-visited shadow-xs">{statusCounts.notVisited}</span>
                  <span className="text-slate-700 font-medium">Not Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center font-bold text-[10px] q-btn-marked shadow-xs">{statusCounts.marked}</span>
                  <span className="text-slate-700 font-medium">Marked Review</span>
                </div>
                {statusCounts.markedAnswered > 0 && (
                  <div className="flex items-center gap-2 col-span-2">
                    <span className="w-5 h-5 flex items-center justify-center font-bold text-[10px] q-btn-marked-answered shadow-xs">{statusCounts.markedAnswered}</span>
                    <span className="text-slate-700 font-medium">Ans & Marked for Review</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                <span className="text-xs font-bold text-slate-800">Question Palette:</span>

                {/* Official NTA Section A (1-35) & Section B (36-50) Palette Filters */}
                {questions.length >= 35 && (
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPaletteFilter('all')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        paletteFilter === 'all' ? 'bg-slate-900 text-amber-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({questions.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaletteFilter('A')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        paletteFilter === 'A' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sec A (1-35)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaletteFilter('B')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        paletteFilter === 'B' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sec B (36-50)
                    </button>
                  </div>
                )}
              </div>

              {/* Responsive Auto-Fill Grid with Section Filter */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(42px,1fr))] gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 overflow-y-auto max-h-[calc(100vh-370px)] min-h-[140px]">
                {questions.map((q, idx) => {
                  const secIdx = idx % 50;
                  if (paletteFilter === 'A' && secIdx >= 35) return null;
                  if (paletteFilter === 'B' && secIdx < 35) return null;

                  const statusClass = getPaletteStatusClass(q);
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => store.setCurrentQuestionIndex(idx)}
                      className={`w-10 h-10 aspect-square mx-auto font-mono font-bold text-xs flex items-center justify-center rounded-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs relative ${statusClass} ${
                        isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 font-extrabold z-10' : ''
                      }`}
                      title={`Question ${idx + 1} (${q.subject} - ${secIdx < 35 ? 'Section A' : 'Section B'})`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>


          <div className="shrink-0 p-4 border-t border-slate-300 bg-white">
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" /> Submit Exam Paper
            </button>
          </div>
        </aside>

      </div>

      {/* Mobile Question Palette Drawer Modal */}
      {showMobilePalette && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn lg:hidden">
          <div className="w-full max-w-sm bg-white h-full p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">Question Palette</h3>
                <button onClick={() => setShowMobilePalette(false)} className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status summary in mobile drawer */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-[9px] q-btn-answered">{statusCounts.answered}</span>
                  <span className="text-slate-700 font-medium">Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-[9px] q-btn-not-answered">{statusCounts.notAnswered}</span>
                  <span className="text-slate-700 font-medium">Not Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-[9px] q-btn-not-visited">{statusCounts.notVisited}</span>
                  <span className="text-slate-700 font-medium">Not Visited</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 flex items-center justify-center font-bold text-[9px] q-btn-marked">{statusCounts.marked}</span>
                  <span className="text-slate-700 font-medium">Review</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-800">Select Question:</span>
                {questions.length >= 35 && (
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPaletteFilter('all')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        paletteFilter === 'all' ? 'bg-slate-900 text-amber-300' : 'text-slate-600'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaletteFilter('A')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        paletteFilter === 'A' ? 'bg-blue-700 text-white' : 'text-slate-600'
                      }`}
                    >
                      Sec A
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaletteFilter('B')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        paletteFilter === 'B' ? 'bg-purple-700 text-white' : 'text-slate-600'
                      }`}
                    >
                      Sec B
                    </button>
                  </div>
                )}
              </div>

              {/* Responsive Auto-Fill Grid in Mobile Drawer */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(42px,1fr))] gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 max-h-[50vh] overflow-y-auto">
                {questions.map((q, idx) => {
                  const secIdx = idx % 50;
                  if (paletteFilter === 'A' && secIdx >= 35) return null;
                  if (paletteFilter === 'B' && secIdx < 35) return null;

                  const statusClass = getPaletteStatusClass(q);
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        store.setCurrentQuestionIndex(idx);
                        setShowMobilePalette(false);
                      }}
                      className={`w-10 h-10 aspect-square mx-auto font-mono font-bold text-xs flex items-center justify-center rounded-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs relative ${statusClass} ${
                        isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 font-extrabold z-10' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

            </div>

            <div className="pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setShowMobilePalette(false);
                  setShowSubmitModal(true);
                }}
                className="w-full py-3 rounded-xl bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Submit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-600">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Confirm Exam Submission</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to end and submit your exam? You cannot change your answers after submission.
            </p>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
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
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Resume Test
              </button>
              <button
                type="button"
                onClick={handleFinalSubmission}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">CBT Keyboard Shortcuts</h3>
              </div>
              <button onClick={() => setShowShortcutsModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Select Option A, B, C, D</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300 text-slate-800">A, B, C, D / 1, 2, 3, 4</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Save & Next Question</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300 text-slate-800">Enter</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Mark for Review & Next</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300 text-slate-800">R</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Clear Current Selection</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300 text-slate-800">Backspace</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Previous / Next Question</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300 text-slate-800">← / →</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600">Toggle Shortcuts Menu</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300 text-slate-800">?</span>
              </div>
            </div>

            <button
              onClick={() => setShowShortcutsModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

