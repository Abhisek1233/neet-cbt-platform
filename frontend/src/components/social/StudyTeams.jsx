import React, { useState } from 'react';
import { Users, Send, Plus } from 'lucide-react';
import { store } from '../../services/store';

export default function StudyTeams({ teams, currentUser }) {
  const [activeTeamId, setActiveTeamId] = useState(teams[0]?.id || 'team-1');
  const [chatMessage, setChatMessage] = useState('');

  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const updated = teams.map((t) => {
      if (t.id === activeTeam.id) {
        return {
          ...t,
          chat: [
            ...t.chat,
            {
              sender: currentUser.name,
              text: chatMessage,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return t;
    });

    store.setState({ teams: updated });
    setChatMessage('');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-white">NEET Study Squads & Team Hub</h2>
          <p className="text-xs text-slate-400 mt-1">
            Compete with friends, solve mock tests together, and chat in dedicated team channels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Your Active Squads</h3>
          {teams.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveTeamId(t.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                t.id === activeTeam.id
                  ? 'bg-cyan-500/15 border-cyan-400'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <h4 className="text-sm font-bold text-white">{t.name}</h4>
              <p className="text-xs text-slate-400 mt-1">{t.description}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between h-[520px]">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> {activeTeam.name}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
            {activeTeam.chat.map((msg, idx) => (
              <div key={idx} className="flex flex-col items-start">
                <span className="text-[10px] text-slate-400 mb-0.5">{msg.sender} • {msg.time}</span>
                <div className="px-3.5 py-2 rounded-2xl max-w-sm text-xs bg-slate-900 border border-slate-800 text-slate-200">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Type message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
            >
              Send
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
