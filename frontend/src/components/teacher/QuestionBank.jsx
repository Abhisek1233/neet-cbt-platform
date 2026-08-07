import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { store } from '../../services/store';

export default function QuestionBank({ questions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newQ, setNewQ] = useState({
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

  const filteredQuestions = questions.filter((q) => {
    const matchesSub = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.chapter.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSub && matchesSearch;
  });

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!newQ.text || !newQ.opt0 || !newQ.opt1 || !newQ.opt2 || !newQ.opt3) {
      alert('Please fill out question text and all 4 options!');
      return;
    }

    store.addQuestion({
      subject: newQ.subject,
      chapter: newQ.chapter || 'General',
      difficulty: newQ.difficulty,
      text: newQ.text,
      options: [newQ.opt0, newQ.opt1, newQ.opt2, newQ.opt3],
      correctOption: parseInt(newQ.correctOption),
      explanation: newQ.explanation || 'Solution explanation provided by HOD.'
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-white">Teacher Question Bank</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage, filter, and create NEET-pattern Physics, Chemistry, Botany & Zoology questions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create New Question
        </button>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
        >
          <option value="All">All Subjects</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Botany">Botany</option>
          <option value="Zoology">Zoology</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div key={q.id} className="glass-panel p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold">
                  {q.subject}
                </span>
                <span className="text-xs text-slate-400">{q.chapter}</span>
              </div>
            </div>
            <p className="text-sm text-slate-100 font-medium mb-3">{q.text}</p>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleCreateQuestion} className="w-full max-w-2xl bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Add New Question</h3>

            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Question Text" value={newQ.text} onChange={(e) => setNewQ({ ...newQ, text: e.target.value })} className="col-span-2 p-2 rounded bg-slate-950 text-xs text-white border border-slate-800" />
              <input type="text" placeholder="Option A" value={newQ.opt0} onChange={(e) => setNewQ({ ...newQ, opt0: e.target.value })} className="p-2 rounded bg-slate-950 text-xs text-white border border-slate-800" />
              <input type="text" placeholder="Option B" value={newQ.opt1} onChange={(e) => setNewQ({ ...newQ, opt1: e.target.value })} className="p-2 rounded bg-slate-950 text-xs text-white border border-slate-800" />
              <input type="text" placeholder="Option C" value={newQ.opt2} onChange={(e) => setNewQ({ ...newQ, opt2: e.target.value })} className="p-2 rounded bg-slate-950 text-xs text-white border border-slate-800" />
              <input type="text" placeholder="Option D" value={newQ.opt3} onChange={(e) => setNewQ({ ...newQ, opt3: e.target.value })} className="p-2 rounded bg-slate-950 text-xs text-white border border-slate-800" />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded bg-slate-800 text-xs text-slate-300">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-cyan-600 text-white text-xs font-bold">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
