import React, { useState } from 'react';
import { Users, Send, Plus, Phone, Mail, X, Sparkles, ShieldCheck } from 'lucide-react';
import { store } from '../../services/store';
import { showToast } from '../ui/Toast';

export default function StudyTeams({ teams, currentUser, theme }) {
  const [activeTeamId, setActiveTeamId] = useState(teams[0]?.id || 'team-1');
  const [chatMessage, setChatMessage] = useState('');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [memberPhoneNumbers, setMemberPhoneNumbers] = useState('');
  const [memberEmails, setMemberEmails] = useState('');

  const isDark = theme === 'dark';
  const isTeacher = currentUser?.role === 'teacher';
  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const updated = teams.map((t) => {
      if (t.id === activeTeam.id) {
        return {
          ...t,
          chat: [
            ...(t.chat || []),
            {
              sender: currentUser ? currentUser.name : 'Aspirant',
              text: chatMessage,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return t;
    });

    store.saveToStorage('teams', updated);
    store.setState({ teams: updated });
    setChatMessage('');
  };

  const handleCreateGroupSquad = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const phonesList = memberPhoneNumbers.split(',').map((p) => p.trim()).filter(Boolean);
    const emailsList = memberEmails.split(',').map((e) => e.trim()).filter(Boolean);

    const newSquad = store.createGroupSquad({
      name: groupName,
      description: groupDescription || (isTeacher ? 'Faculty Managed Batch Cohort' : 'Student Study Squad'),
      type: isTeacher ? 'Faculty & Batch Cohort' : 'Student Study Squad',
      targetScore: isTeacher ? 'Faculty HOD Network' : '690+ Target Batch',
      members: [
        { name: currentUser?.name || 'Group Founder', email: currentUser?.email || 'founder@neet.edu' },
        ...emailsList.map((em, idx) => ({ name: `Member ${idx + 1}`, email: em })),
        ...phonesList.map((ph, idx) => ({ name: `Contact ${idx + 1}`, phone: ph }))
      ]
    });

    setActiveTeamId(newSquad.id);
    setGroupName('');
    setGroupDescription('');
    setMemberPhoneNumbers('');
    setMemberEmails('');
    setShowCreateGroupModal(false);
    showToast(`🎉 Group "${newSquad.name}" Created with ${phonesList.length + emailsList.length} Invited Members!`, 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20 md:pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {isTeacher ? (
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            ) : (
              <Users className="w-5 h-5 text-cyan-400" />
            )}
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              {isTeacher ? 'Faculty & Student Batch Cohorts' : 'NEET Study Squads & Peer Groups'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isTeacher
              ? 'Create student batch cohorts and faculty networks by inviting phone numbers and Gmail IDs.'
              : 'Form target study squads with your friends, invite classmates via phone & email, and solve test papers together.'}
          </p>
        </div>

        <button
          onClick={() => setShowCreateGroupModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Group Squad
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Squads */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide px-1">Your Active Squads & Batches</h3>
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {teams.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveTeamId(t.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                  t.id === activeTeam.id
                    ? 'bg-cyan-500/15 border-cyan-400 text-white'
                    : (isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400')
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold">{t.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 text-[10px] font-mono font-bold">
                    {t.memberCount || 5} Members
                  </span>
                </div>
                <p className="text-xs opacity-75 line-clamp-2">{t.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Chat Canvas */}
        <div className={`lg:col-span-8 p-5 rounded-3xl border flex flex-col justify-between h-[520px] ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
        }`}>
          <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeTeam.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100'} alt="Group" className="w-9 h-9 rounded-xl object-cover ring-2 ring-cyan-500/40" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  {activeTeam.name}
                </h3>
                <p className="text-[11px] text-slate-400">{activeTeam.type || 'Study Squad'} • Created by {activeTeam.creator || 'Faculty'}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
            {(activeTeam.chat || []).map((msg, idx) => (
              <div key={idx} className="flex flex-col items-start space-y-1">
                <span className="text-[10px] text-slate-400 px-1">{msg.sender} • {msg.time}</span>
                <div className="px-4 py-2.5 rounded-2xl max-w-md text-xs bg-slate-950 border border-slate-800 text-slate-100 shadow-sm leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800/80 flex gap-2">
            <input
              type="text"
              placeholder="Type message to squad members..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-400 ${
                isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
              }`}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>

      </div>

      {/* Create Group Squad Modal (Phone & Email Invites) */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleCreateGroupSquad} className="w-full max-w-lg bg-slate-900 p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-4 text-white max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-extrabold">Create New Group (Student / Teacher)</h3>
              </div>
              <button type="button" onClick={() => setShowCreateGroupModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Group Name</label>
              <input
                type="text"
                required
                placeholder={isTeacher ? "e.g. AIIMS Delhi Batch-A 2026" : "e.g. 700+ Aimers Physics Squad"}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Description / Goal</label>
              <input
                type="text"
                placeholder="e.g. Daily Botany & Physics Mock Practice Batch"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Invite Members via Phone Numbers
              </label>
              <input
                type="text"
                placeholder="Comma separated: +919876543210, +919123456789"
                value={memberPhoneNumbers}
                onChange={(e) => setMemberPhoneNumbers(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Invite Members via Gmail / Email IDs
              </label>
              <textarea
                rows={2}
                placeholder="Comma separated: rahul.student@neet.edu, priya.sharma@gmail.com"
                value={memberEmails}
                onChange={(e) => setMemberEmails(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateGroupModal(false)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300'
                }`}
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold shadow-md cursor-pointer">
                Create & Add Group Squad
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
