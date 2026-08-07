import React, { useState } from 'react';
import { Plus, Search, Sparkles, X, BookOpen, CheckCircle2, Cpu, FileCheck, RefreshCw, Trash2 } from 'lucide-react';
import { store } from '../../services/store';
import { generateQuestionsFromTeacherPrompt, fetchQuestionsFromBackend } from '../../services/api';
import CreateExamModal from './CreateExamModal';
import { showToast } from '../ui/Toast';

export default function QuestionBank({ questions, theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [showAiPromptModal, setShowAiPromptModal] = useState(false);
  const [promptQuestionCount, setPromptQuestionCount] = useState(3);

  const [newQ, setNewQ] = useState({
    subject: 'Physics',
    chapter: 'Electrodynamics & Optics',
    difficulty: 'Hard',
    text: '',
    opt0: '',
    opt1: '',
    opt2: '',
    opt3: '',
    correctOption: 0,
    explanation: ''
  });

  const isDark = theme === 'dark';

  const filteredQuestions = questions.filter((q) => {
    const matchesSub = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchesSearch = (q.text || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (q.chapter || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSub && matchesDiff && matchesSearch;
  });

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!newQ.text || !newQ.opt0 || !newQ.opt1 || !newQ.opt2 || !newQ.opt3) {
      showToast('⚠️ Please fill out the question statement and all 4 options!', 'error');
      return;
    }

    store.addQuestion({
      id: `q_custom_${Date.now()}`,
      subject: newQ.subject,
      chapter: newQ.chapter || 'General NCERT',
      difficulty: newQ.difficulty,
      text: newQ.text,
      options: [newQ.opt0, newQ.opt1, newQ.opt2, newQ.opt3],
      correctOption: parseInt(newQ.correctOption),
      explanation: newQ.explanation || 'Official step-by-step solution provided by HOD Faculty.'
    });

    setNewQ({
      subject: 'Physics',
      chapter: '',
      difficulty: 'Medium',
      text: '',
      opt0: '',
      opt1: '',
      opt2: '',
      opt3: '',
      correctOption: 0,
      explanation: ''
    });

    setShowAddModal(false);
    showToast('✅ Custom Question saved to PostgreSQL Database!', 'success');
  };

  const handleExecuteAiPrompt = async (e) => {
    e.preventDefault();
    if (!aiCustomPrompt.trim()) return;

    setIsGeneratingAi(true);
    showToast('⚡ Connecting to Google Gemini AI to generate custom prompt questions...', 'info', 4000);
    const sub = selectedSubject === 'All' ? 'Physics' : selectedSubject;
    const aiQuestions = await generateQuestionsFromTeacherPrompt(aiCustomPrompt, sub, promptQuestionCount);
    
    aiQuestions.forEach((q) => store.addQuestion(q));
    setIsGeneratingAi(false);
    setShowAiPromptModal(false);
    setAiCustomPrompt('');
    showToast(`✨ Generated ${aiQuestions.length} Questions via Gemini AI Prompt & saved to DB!`, 'success');
  };

  const handleSyncRealDbQuestions = async () => {
    showToast('🔄 Syncing fresh questions directly from Neon Cloud PostgreSQL...', 'info', 3000);
    const remote = await fetchQuestionsFromBackend();
    if (remote && remote.length >= 0) {
      localStorage.setItem('neet_cbt_questions', JSON.stringify(remote));
      store.setState({ questions: remote });
      showToast(`✅ Synced ${remote.length} live database questions from PostgreSQL!`, 'success');
    }
  };

  const handleDeleteSingleQuestion = (id) => {
    store.deleteQuestion(id);
    showToast('🗑️ Question deleted from PostgreSQL database.', 'info');
  };

  const handleClearAllQuestions = () => {
    if (window.confirm('⚠️ Are you sure you want to clear all questions from the database? This action cannot be undone.')) {
      store.clearAllQuestions();
      showToast('🗑️ Question Bank cleared completely (0 questions remaining).', 'success');
    }
  };

  return (
    <>
      <div className="space-y-6 pb-20 md:pb-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-xl sm:text-2xl font-display font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Faculty Question Bank & Exam Suite
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Prompt Gemini AI, write/paste custom questions, and set private student exams with shareable access links.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowAiPromptModal(true)}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Custom Prompt</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>

            <button
              onClick={() => setShowCreateExamModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-slate-950" />
              <span>Set Private Exam for Students</span>
            </button>

            {questions.length > 0 && (
              <button
                onClick={handleClearAllQuestions}
                title="Clear All Questions from Database"
                className="px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            )}

            <button
              onClick={handleSyncRealDbQuestions}
              title="Sync Real Live Database Questions"
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={`p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
        }`}>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search questions or chapters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400 ${
                isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs font-bold ${
              isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-800'
            }`}
          >
            <option value="All">All Subjects</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Botany">Botany</option>
            <option value="Zoology">Zoology</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs font-bold ${
              isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-800'
            }`}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 font-mono">Showing {filteredQuestions.length} Questions</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSyncRealDbQuestions}
                className="text-[11px] font-bold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Database View
              </button>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className={`p-8 text-center rounded-3xl border space-y-3 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-300 text-slate-600'
            }`}>
              <BookOpen className="w-10 h-10 mx-auto text-slate-500" />
              <h3 className="text-base font-extrabold">Question Bank is Clean & Empty</h3>
              <p className="text-xs max-w-sm mx-auto">
                No questions found in PostgreSQL. Click "AI Custom Prompt" or "Add Question" above to generate fresh questions into your live database!
              </p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => (
              <div key={q.id || idx} className={`p-5 rounded-3xl border space-y-3 ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-950 text-amber-300 font-mono text-xs font-extrabold">
                      {q.subject}
                    </span>
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{q.chapter}</span>
                    {q.isAiPredicted && (
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 text-[10px] font-bold">
                        ⚡ Gemini AI
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                      q.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {q.difficulty || 'Medium'}
                    </span>
                    <button
                      onClick={() => handleDeleteSingleQuestion(q.id)}
                      title="Delete Question"
                      className="p-1 rounded text-slate-400 hover:text-red-400 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-semibold leading-relaxed">{q.text}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options && q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctOption;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                            : (isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700')
                        }`}
                      >
                        <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                        {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                    <span className="font-bold text-amber-300 flex items-center gap-1 mb-0.5">
                      <BookOpen className="w-3.5 h-3.5" /> Solution:
                    </span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

      {/* AI Prompt Generator Modal */}
      {showAiPromptModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
          <form onSubmit={handleExecuteAiPrompt} className="w-full max-w-lg bg-slate-900 p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-extrabold">Generate Questions with AI Prompt</h3>
              </div>
              <button type="button" onClick={() => setShowAiPromptModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Write AI Instructions / Prompt</label>
              <textarea
                required
                rows={4}
                placeholder='e.g. "Create 3 high-yield Assertion-Reason questions on Thermodynamics with multi-statement options for NEET 2026"'
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Botany">Botany</option>
                  <option value="Zoology">Zoology</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Questions Count</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={promptQuestionCount}
                  onChange={(e) => setPromptQuestionCount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setShowAiPromptModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGeneratingAi}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isGeneratingAi ? 'Generating via Gemini...' : 'Generate AI Questions'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manual Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
          <form onSubmit={handleCreateQuestion} className="w-full max-w-2xl bg-slate-900 p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Author / Paste New Question</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Subject</label>
                <select
                  value={newQ.subject}
                  onChange={(e) => setNewQ({ ...newQ, subject: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Botany">Botany</option>
                  <option value="Zoology">Zoology</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Chapter Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ray Optics, Mendelian Genetics"
                  value={newQ.chapter}
                  onChange={(e) => setNewQ({ ...newQ, chapter: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Difficulty Level</label>
                <select
                  value={newQ.difficulty}
                  onChange={(e) => setNewQ({ ...newQ, difficulty: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Question Statement</label>
              <textarea
                required
                rows={3}
                placeholder="Paste or type complete question statement..."
                value={newQ.text}
                onChange={(e) => setNewQ({ ...newQ, text: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Option A</label>
                <input type="text" required placeholder="Option A text" value={newQ.opt0} onChange={(e) => setNewQ({ ...newQ, opt0: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Option B</label>
                <input type="text" required placeholder="Option B text" value={newQ.opt1} onChange={(e) => setNewQ({ ...newQ, opt1: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Option C</label>
                <input type="text" required placeholder="Option C text" value={newQ.opt2} onChange={(e) => setNewQ({ ...newQ, opt2: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Option D</label>
                <input type="text" required placeholder="Option D text" value={newQ.opt3} onChange={(e) => setNewQ({ ...newQ, opt3: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Correct Option Answer</label>
              <select
                value={newQ.correctOption}
                onChange={(e) => setNewQ({ ...newQ, correctOption: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
              >
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Solution & Explanation</label>
              <textarea
                rows={2}
                placeholder="Detailed step-by-step solution..."
                value={newQ.explanation}
                onChange={(e) => setNewQ({ ...newQ, explanation: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold shadow-md cursor-pointer">
                Save & Add to Question Bank
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Set Exam Modal */}
      <CreateExamModal
        isOpen={showCreateExamModal}
        onClose={() => setShowCreateExamModal(false)}
        selectedQuestions={filteredQuestions.slice(0, 10)}
        theme={theme}
      />
    </>
  );
}
