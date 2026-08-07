import React, { useState } from 'react';
import { Sparkles, X, Cpu } from 'lucide-react';
import { generateAiQuestion } from '../../services/api';
import { store } from '../../services/store';

export default function GenerateAiTestModal({ isOpen, onClose, category = 'Full-Length', theme }) {
  const [testTitle, setTestTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('Ray Optics & Electrostatics');
  const [questionCount, setQuestionCount] = useState(20);
  const [isGenerating, setIsGenerating] = useState(false);

  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleGenerateCustomTest = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    const generatedQuestions = [];
    const targetSubject = category === 'Subject-Wise' ? subject : 'Physics';
    const targetChapter = category === 'Topic-Wise' ? chapter : `${subject} High-Yield`;

    for (let i = 0; i < Math.min(questionCount, 5); i++) {
      const q = await generateAiQuestion(targetSubject, targetChapter, 'Assertion-Reason');
      generatedQuestions.push(q);
      store.addQuestion(q);
    }

    const newExamId = `exam_ai_${Date.now()}`;
    const newExam = {
      id: newExamId,
      title: testTitle || `AI Custom ${category} Test: ${targetSubject} (${targetChapter})`,
      category: category,
      code: `AI-${category.toUpperCase().substr(0, 4)}-${Date.now().toString().substr(-4)}`,
      durationMin: questionCount * 1.5,
      totalMarks: questionCount * 4,
      questionCount: questionCount,
      markingScheme: '+4 / -1',
      sections: [targetSubject],
      proctoringLevel: 'Strict AI',
      createdBy: 'Google Gemini AI',
      questionIds: generatedQuestions.map((q) => q.id)
    };

    const currentExams = store.getState().exams;
    store.setState({ exams: [newExam, ...currentExams] });

    setIsGenerating(false);
    onClose();
    store.startPreExamCheck(newExam);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-slate-300/30">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm sm:text-base font-extrabold">Generate Custom AI Test ({category})</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-slate-200/20 text-slate-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleGenerateCustomTest} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold block mb-1">Test Title (Optional)</label>
            <input
              type="text"
              placeholder={`e.g. AI ${category} Speed Paper #1`}
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {(category === 'Subject-Wise' || category === 'Topic-Wise' || category === 'Full-Length') && (
            <div>
              <label className="text-xs font-bold block mb-1">Subject Focus</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Botany">Botany</option>
                <option value="Zoology">Zoology</option>
              </select>
            </div>
          )}

          {category === 'Topic-Wise' && (
            <div>
              <label className="text-xs font-bold block mb-1">Chapter / Topic Name</label>
              <input
                type="text"
                placeholder="e.g. Mendelian Genetics, Ray Optics..."
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold block mb-1">Total Questions</label>
            <input
              type="number"
              min="5"
              max="200"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
              className={`w-full p-2.5 rounded-xl border text-xs font-mono font-bold ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            {isGenerating ? 'Generating AI Questions with Gemini...' : 'Create & Start AI Custom Test'}
          </button>
        </form>
      </div>
    </div>
  );
}
