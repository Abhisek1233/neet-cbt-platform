import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { store } from '../../services/store';

export default function MyNotes({ notes, questions }) {
  const noteKeys = Object.keys(notes).filter((k) => notes[k] && notes[k].trim() !== '');

  const handleClearNote = (qId) => {
    store.saveUserNote(qId, '');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-white">My Personal Revision Notes</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review personal notes attached to questions during CBT mock exams and post-exam scorecard reviews.
        </p>
      </div>

      {noteKeys.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3">
          <Edit3 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No Revision Notes Saved Yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {noteKeys.map((qId) => {
            const question = questions.find((q) => q.id === qId) || { subject: 'General', chapter: 'Question Note', text: `Question ${qId}` };
            return (
              <div key={qId} className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold">
                      {question.subject}
                    </span>
                    <button
                      onClick={() => handleClearNote(qId)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{question.text}</p>
                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs font-medium">
                    "{notes[qId]}"
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
