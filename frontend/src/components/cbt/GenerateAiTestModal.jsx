import React, { useState, useEffect } from 'react';
import { Sparkles, X, Cpu, Layers, BookOpen, CheckCircle2, ChevronRight, Zap, Target, Award } from 'lucide-react';
import { fetchLiveAiBatchQuestions } from '../../services/api';
import { store } from '../../services/store';
import { showToast } from '../ui/Toast';

const CHAPTERS_BY_SUBJECT = {
  Physics: [
    'Ray Optics & Optical Instruments',
    'Current Electricity & Circuits',
    'Thermodynamics & Heat Transfer',
    'Wave Optics & Interference',
    'Electrostatics & Capacitance',
    'Dual Nature of Radiation & Matter',
    'Mechanics, Work & Energy',
    'Gravitation & Planetary Motion',
    'Custom Chapter'
  ],
  Chemistry: [
    'Organic Chemistry - Hydrocarbons & Functional Groups',
    'Chemical Kinetics & Rate Laws',
    'Coordination Compounds & CFT',
    'Electrochemistry & Redox Potentials',
    'Chemical Bonding & Molecular Structure',
    'P-Block & D-Block Elements',
    'Ionic & Chemical Equilibrium',
    'Thermodynamics & Thermochemistry',
    'Custom Chapter'
  ],
  Botany: [
    'Genetics & Principles of Inheritance',
    'Photosynthesis in Higher Plants',
    'Sexual Reproduction in Flowering Plants',
    'Cell Cycle & Cell Division',
    'Molecular Basis of Inheritance',
    'Plant Physiology & Water Transport',
    'Ecosystem & Environmental Biology',
    'Plant Kingdom & Morphology',
    'Custom Chapter'
  ],
  Zoology: [
    'Human Physiology - Neural Control & Coordination',
    'Body Fluids & Circulation (ECG & Heart)',
    'Biotechnology & Recombinant DNA',
    'Human Reproduction & Reproductive Health',
    'Excretory Products & Their Elimination',
    'Chemical Coordination & Endocrine Glands',
    'Animal Kingdom & Classification',
    'Evolution & Natural Selection',
    'Custom Chapter'
  ]
};

export default function GenerateAiTestModal({ isOpen, onClose, category = 'Full-Length', theme }) {
  // Map incoming category to modal tab
  const getInitialCategory = (cat) => {
    if (cat === 'All' || cat === 'Full-Length' || cat === 'Full Mocks') return 'Full-Length';
    if (cat === 'Subject-Wise' || cat === 'Subject Mocks') return 'Subject-Wise';
    if (cat === 'Topic-Wise' || cat === 'Topic Tests') return 'Topic-Wise';
    if (cat === 'AI-Predicted' || cat === 'AI High-Yield') return 'AI-Predicted';
    return 'Full-Length';
  };

  const [activeTab, setActiveTab] = useState(getInitialCategory(category));
  const [testTitle, setTestTitle] = useState('');
  
  // Subject & Topic state
  const [subject, setSubject] = useState('Physics');
  const [selectedChapter, setSelectedChapter] = useState('Ray Optics & Optical Instruments');
  const [customChapterText, setCustomChapterText] = useState('');

  // AI High-Yield scope
  const [aiScope, setAiScope] = useState('All');
  const [aiFocusMode, setAiFocusMode] = useState('10-Year Most Repeated NEET Concepts');

  // Question configuration
  const [questionCount, setQuestionCount] = useState(20);
  const [durationMin, setDurationMin] = useState(20);
  const [difficulty, setDifficulty] = useState('Real Mix');
  const [questionType, setQuestionType] = useState('All Types');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const isDark = theme === 'dark';

  // Sync activeTab when category prop changes
  useEffect(() => {
    setActiveTab(getInitialCategory(category));
  }, [category]);

  // Adjust defaults when activeTab switches
  useEffect(() => {
    if (activeTab === 'Full-Length') {
      setQuestionCount(20);
      setDurationMin(20);
      setDifficulty('Real Mix');
      setQuestionType('All Types');
    } else if (activeTab === 'Subject-Wise') {
      setQuestionCount(50);
      setDurationMin(50);
      setDifficulty('Real Mix');
      setQuestionType('All Types');
    } else if (activeTab === 'Topic-Wise') {
      setQuestionCount(15);
      setDurationMin(18);
      const defaultChap = CHAPTERS_BY_SUBJECT[subject]?.[0] || 'Ray Optics & Optical Instruments';
      setSelectedChapter(defaultChap);
    } else if (activeTab === 'AI-Predicted') {
      setQuestionCount(40);
      setDurationMin(40);
      setDifficulty('High-Yield Critical');
      setQuestionType('All Types');
    }
  }, [activeTab]);

  // Update chapter when subject changes
  const handleSubjectChange = (newSub) => {
    setSubject(newSub);
    const firstChap = CHAPTERS_BY_SUBJECT[newSub]?.[0] || 'Core NCERT';
    setSelectedChapter(firstChap);
  };

  if (!isOpen) return null;

  const handlePresetSelect = (qCount, duration) => {
    setQuestionCount(qCount);
    setDurationMin(duration);
  };

  const handleGenerateCustomTest = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      let targetSubjects = [];
      let targetChapter = '';
      let defaultTitle = '';
      const now = Date.now();

      if (activeTab === 'Full-Length') {
        targetSubjects = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
        targetChapter = 'Full NEET UG Syllabus';
        defaultTitle = testTitle.trim() || `NTA Pattern All-India Full Mock Test (${questionCount}Q)`;
      } else if (activeTab === 'Subject-Wise') {
        targetSubjects = [subject];
        targetChapter = `${subject} Comprehensive Special`;
        defaultTitle = testTitle.trim() || `NEET ${subject} Master Mock (${questionCount}Q)`;
      } else if (activeTab === 'Topic-Wise') {
        targetSubjects = [subject];
        targetChapter = selectedChapter === 'Custom Chapter'
          ? (customChapterText.trim() || 'Custom Chapter')
          : selectedChapter;
        defaultTitle = testTitle.trim() || `NEET ${subject}: ${targetChapter} Topic Drill (${questionCount}Q)`;
      } else if (activeTab === 'AI-Predicted') {
        targetSubjects = aiScope === 'All' ? ['Physics', 'Chemistry', 'Botany', 'Zoology'] : [aiScope];
        targetChapter = `${aiFocusMode}`;
        defaultTitle = testTitle.trim() || `NEET AI High-Yield Predicted Paper: ${aiScope === 'All' ? 'All Subjects' : aiScope} (${questionCount}Q)`;
      }

      setGenerationStep('Connecting to Google Gemini 3.8 Flash AI Engine...');
      await new Promise(r => setTimeout(r, 200));

      setGenerationStep(`Formulating authentic NCERT questions across ${targetSubjects.join(', ')}...`);

      const generatedQuestions = await fetchLiveAiBatchQuestions({
        category: activeTab,
        subjects: targetSubjects,
        count: questionCount,
        difficulty: difficulty,
        questionType: questionType,
        chapter: targetChapter
      });


      // Register questions in the local store
      generatedQuestions.forEach((q) => {
        store.addQuestion(q);
      });

      const totalMarks = questionCount * 4;
      const calcDuration = durationMin || Math.round(questionCount * 1.0);

      const newExamId = `exam_ai_${now}`;
      const newExam = {
        id: newExamId,
        title: defaultTitle,
        category: activeTab,
        code: `AI-${activeTab.toUpperCase().slice(0, 4)}-${now.toString().slice(-4)}`,
        durationMin: calcDuration,
        totalMarks: totalMarks,
        questionCount: questionCount,
        markingScheme: '+4 for Correct, -1 for Incorrect',
        sections: targetSubjects,
        proctoringLevel: 'Strict AI',
        createdBy: 'Google Gemini AI',
        questionIds: generatedQuestions.map((q) => q.id)
      };

      const currentExams = store.getState().exams;
      store.setState({ exams: [newExam, ...currentExams] });

      showToast(`✨ Generated ${newExam.title} with ${questionCount} questions across ${targetSubjects.join(', ')}! Starting exam...`, 'success', 4000);

      setIsGenerating(false);
      onClose();
      store.startPreExamCheck(newExam);
    } catch (err) {
      console.error('Test generation failed:', err);
      showToast('❌ Failed to generate custom test. Please try again.', 'error');
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-xl rounded-3xl p-5 sm:p-7 border shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3.5 border-slate-300/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-display font-extrabold">Generate Custom AI Test</h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
                  Powered by Gemini 3.8
                </span>
                <span>•</span>
                <span>Authentic NTA Format & NCERT Blueprint</span>
              </p>

            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200/30 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Category Sub-Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-300/50 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('Full-Length')}
            className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${
              activeTab === 'Full-Length'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
            }`}
          >
            Full Mocks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Subject-Wise')}
            className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${
              activeTab === 'Subject-Wise'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
            }`}
          >
            Subject Mocks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Topic-Wise')}
            className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${
              activeTab === 'Topic-Wise'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
            }`}
          >
            Topic Tests
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('AI-Predicted')}
            className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${
              activeTab === 'AI-Predicted'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
            }`}
          >
            AI High-Yield
          </button>
        </div>

        <form onSubmit={handleGenerateCustomTest} className="space-y-4">
          
          {/* Category-Specific Info Banner */}
          {activeTab === 'Full-Length' && (
            <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
              isDark ? 'bg-indigo-950/30 border-indigo-900/50 text-indigo-200' : 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                <Layers className="w-4 h-4 shrink-0" />
                <span>Real NTA Pattern: All 4 Subjects Included (Equal 25% Ratio)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                Questions will be generated simultaneously across <strong>Physics, Chemistry, Botany, and Zoology</strong> matching official NTA section divisions and +4/-1 scoring.
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {['Physics (25%)', 'Chemistry (25%)', 'Botany (25%)', 'Zoology (25%)'].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-indigo-200/60 dark:bg-indigo-900/60 text-[10px] font-mono font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Subject-Wise' && (
            <div className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
              isDark ? 'bg-blue-950/30 border-blue-900/50 text-blue-200' : 'bg-blue-50/80 border-blue-200 text-blue-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Single Subject Deep Mock Drill</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Select your focus subject. Questions are crafted with Section A & B balance or speed drill patterns.
              </p>
              <div className="grid grid-cols-4 gap-2 pt-1">
                {['Physics', 'Chemistry', 'Botany', 'Zoology'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSubjectChange(s)}
                    className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${
                      subject === s
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Topic-Wise' && (
            <div className={`p-3.5 rounded-2xl border text-xs space-y-3 ${
              isDark ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-200' : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                <Target className="w-4 h-4 shrink-0" />
                <span>Targeted Chapter & Topic Booster</span>
              </div>
              
              {/* Subject Selector for Topic */}
              <div className="grid grid-cols-4 gap-1.5">
                {['Physics', 'Chemistry', 'Botany', 'Zoology'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSubjectChange(s)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      subject === s
                        ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                        : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Chapter Dropdown */}
              <div>
                <label className="text-[11px] font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Select High-Yield NCERT Chapter ({subject})
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-semibold ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  {(CHAPTERS_BY_SUBJECT[subject] || []).map((ch) => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>

              {selectedChapter === 'Custom Chapter' && (
                <div>
                  <label className="text-[11px] font-bold block mb-1">Enter Custom Chapter / Topic Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Photoelectric Effect, Mendelian Dihybrid Cross..."
                    value={customChapterText}
                    onChange={(e) => setCustomChapterText(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'AI-Predicted' && (
            <div className={`p-3.5 rounded-2xl border text-xs space-y-3 ${
              isDark ? 'bg-amber-950/30 border-amber-900/50 text-amber-200' : 'bg-amber-50/80 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                <Zap className="w-4 h-4 shrink-0" />
                <span>AI Predicted High-Yield Paper (95%+ Probability)</span>
              </div>
              
              <div>
                <label className="text-[11px] font-bold block mb-1">Subject Scope</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { id: 'All', label: 'All 4 Sub' },
                    { id: 'Physics', label: 'Physics' },
                    { id: 'Chemistry', label: 'Chemistry' },
                    { id: 'Botany', label: 'Botany' },
                    { id: 'Zoology', label: 'Zoology' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAiScope(item.id)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                        aiScope === item.id
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1">High-Yield Prediction Focus</label>
                <select
                  value={aiFocusMode}
                  onChange={(e) => setAiFocusMode(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-semibold ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="10-Year Most Repeated NEET Concepts">10-Year Most Repeated NEET Concepts (High Weightage)</option>
                  <option value="NCERT Line-by-Line Direct Traps">NCERT Line-by-Line Direct Traps & Exceptions</option>
                  <option value="Tricky Assertion-Reason & Statement Traps">Tricky Assertion-Reason & Statement I & II Traps</option>
                  <option value="High-Yield Formula Application & Numericals">High-Yield Formula Application & Numericals</option>
                </select>
              </div>
            </div>
          )}

          {/* Test Title (Optional) */}
          <div>
            <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
              Custom Test Title (Optional)
            </label>
            <input
              type="text"
              placeholder={
                activeTab === 'Full-Length'
                  ? 'e.g. All-India NEET Grand Speed Test #1'
                  : activeTab === 'Subject-Wise'
                  ? `e.g. NEET ${subject} High-Yield Score Booster`
                  : activeTab === 'Topic-Wise'
                  ? `e.g. ${subject}: ${selectedChapter} Rapid Drill`
                  : 'e.g. NEET AI Predicted Grand Paper #1'
              }
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Question Count & Duration Presets */}
          <div>
            <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
              Total Questions & Time Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activeTab === 'Full-Length' && (
                <>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(200, 200)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 200 ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">200 Q (720M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">200 mins (Real NTA)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(80, 80)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 80 ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">80 Q (320M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">80 mins (20 per sub)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(40, 40)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 40 ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">40 Q (160M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">40 mins (10 per sub)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(20, 20)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 20 ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">20 Q (80M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">20 mins (Quick)</p>
                  </button>
                </>
              )}

              {activeTab === 'Subject-Wise' && (
                <>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(50, 50)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 50 ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">50 Q (180M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">50m (Sec A+B)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(45, 45)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 45 ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">45 Q (180M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">45 mins</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(30, 30)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 30 ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">30 Q (120M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">30 mins</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(20, 20)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 20 ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">20 Q (80M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">20 mins</p>
                  </button>
                </>
              )}

              {activeTab === 'Topic-Wise' && (
                <>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(10, 12)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 10 ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">10 Q (40M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">12 mins</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(15, 18)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 15 ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">15 Q (60M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">18 mins</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(20, 25)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 20 ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">20 Q (80M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">25 mins</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(30, 35)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 30 ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">30 Q (120M)</p>
                    <p className="text-[10px] text-slate-500 font-mono">35 mins</p>
                  </button>
                </>
              )}

              {activeTab === 'AI-Predicted' && (
                <>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(200, 200)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 200 ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">200 Q Grand</p>
                    <p className="text-[10px] text-slate-500 font-mono">200m (720M)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(80, 80)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 80 ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">80 Q Core</p>
                    <p className="text-[10px] text-slate-500 font-mono">80m (320M)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(40, 40)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 40 ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">40 Q Rapid</p>
                    <p className="text-[10px] text-slate-500 font-mono">40m (160M)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(20, 20)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      questionCount === 20 ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-xs font-extrabold">20 Q Speed</p>
                    <p className="text-[10px] text-slate-500 font-mono">20m (80M)</p>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Difficulty & Question Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="Real Mix">NTA Real Exam Mix (40% Easy, 45% Med, 15% Hard)</option>
                <option value="Easy">Easy (Foundation / Speed Check)</option>
                <option value="Medium">Medium (Standard NTA NEET Level)</option>
                <option value="Hard">Hard (High-Rank AIIMS / JIPMER Level)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">
                Question Type Focus
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="All Types">All NTA Types (MCQs, Assertion-Reason, Statement, Match)</option>
                <option value="Assertion-Reason">Assertion & Reason Specialized</option>
                <option value="Statement I & II">Statement I & II Focused</option>
                <option value="Matching Type">Match the Following (List-I & List-II)</option>
                <option value="Conceptual MCQ">Conceptual Standard MCQs</option>
                <option value="Numerical Problem">Formula & Numerical Calculations</option>
              </select>
            </div>
          </div>

          {/* Live Progress Bar while Generating */}
          {isGenerating && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 space-y-2 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-extrabold">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Generating {activeTab} Paper ({questionCount} Questions)...</span>
              </div>
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                {generationStep}
              </p>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              {isGenerating
                ? 'Synthesizing NCERT Exam Questions...'
                : `Create & Start AI ${activeTab} Test (${questionCount} Qs)`}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
