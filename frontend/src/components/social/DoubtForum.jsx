import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { store } from '../../services/store';

export default function DoubtForum({ doubts, currentUser }) {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [showAskModal, setShowAskModal] = useState(false);
  const [replyText, setReplyText] = useState({});

  const [newSub, setNewSub] = useState('Physics');
  const [newTopic, setNewTopic] = useState('');
  const [newQText, setNewQText] = useState('');

  const filteredDoubts = doubts.filter((d) => selectedSubject === 'All' || d.subject === selectedSubject);

  const handlePostDoubt = (e) => {
    e.preventDefault();
    if (!newQText.trim()) return;
    store.addDoubt(newSub, newTopic || 'General Topic', newQText);
    setShowAskModal(false);
    setNewTopic('');
    setNewQText('');
  };

  const handleSendReply = (doubtId) => {
    const text = replyText[doubtId];
    if (!text || !text.trim()) return;
    store.addDoubtReply(doubtId, text);
    setReplyText({ ...replyText, [doubtId]: '' });
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-white">NEET Doubt Q&A Community</h2>
          <p className="text-xs text-slate-400 mt-1">
            Ask doubts, get verified solutions from HOD teachers & top peer NEET aspirants.
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ask a Doubt
        </button>
      </div>

      <div className="space-y-4">
        {filteredDoubts.map((doubt) => (
          <div key={doubt.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold">
                {doubt.subject}
              </span>
              <span className="text-xs text-slate-400">Asked by {doubt.author}</span>
            </div>

            <h3 className="text-sm font-bold text-white leading-relaxed">{doubt.question}</h3>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              {doubt.replies.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <span className="font-bold text-white">{r.author}: </span>
                  <span className="text-slate-300">{r.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Write an answer..."
                value={replyText[doubt.id] || ''}
                onChange={(e) => setReplyText({ ...replyText, [doubt.id]: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                onClick={() => handleSendReply(doubt.id)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handlePostDoubt} className="w-full max-w-lg bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Ask a Doubt</h3>

            <textarea
              rows="4"
              placeholder="Explain your doubt..."
              value={newQText}
              onChange={(e) => setNewQText(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowAskModal(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-600 text-white text-xs font-bold">
                Post Doubt
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
