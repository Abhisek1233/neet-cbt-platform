import React, { useState } from 'react';
import { X, ShieldCheck, Link2, Copy, Check, Sparkles, Users } from 'lucide-react';
import { store } from '../../services/store';
import { showToast } from '../ui/Toast';

export default function CreateExamModal({ isOpen, onClose, selectedQuestions = [], theme }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [durationMin, setDurationMin] = useState(45);
  const [studentEmails, setStudentEmails] = useState('');
  const [createdExamLink, setCreatedExamLink] = useState('');
  const [copied, setCopied] = useState(false);

  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleCreateExam = (e) => {
    e.preventDefault();

    const allowedList = studentEmails
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    const questionIds = selectedQuestions.length > 0
      ? selectedQuestions.map((q) => q.id)
      : ['p1', 'p2', 'c1', 'b1', 'z1'];

    const newExam = store.createTeacherExam({
      title: title || `Custom ${subject} Assessed Paper`,
      subject: subject,
      durationMin: parseInt(durationMin) || 45,
      sections: [subject],
      allowedStudentEmails: allowedList,
      questionIds: questionIds
    });

    const shareUrl = `${window.location.origin}${window.location.pathname}?examId=${newExam.id}`;
    setCreatedExamLink(shareUrl);
    showToast(`✅ Custom Exam "${newExam.title}" Created! Share the link with your students.`, 'success', 5000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(createdExamLink);
    setCopied(true);
    showToast('📋 Exam Access Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-xl rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-extrabold">Teacher Exam Setter & Private Link Generator</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!createdExamLink ? (
          <form onSubmit={handleCreateExam} className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1">Exam Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Chapter 4 Electrostatics Weekly Assessment Test"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <option value="Full-Length">Full NEET Mock</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Time Limit (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono font-bold ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> Authorized Student Gmail IDs (Private Restriction)
                </span>
                <span className="text-[10px] text-amber-300 font-medium">Leave empty for public access</span>
              </label>
              <textarea
                rows={3}
                placeholder="Enter student emails separated by commas: e.g. rahul.student@neet.edu, priya.sharma@gmail.com"
                value={studentEmails}
                onChange={(e) => setStudentEmails(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-cyan-400 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                🔒 Only students logging in with these exact Gmail IDs will be allowed to open and submit this exam!
              </p>
            </div>

            <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="font-bold">Questions Attached:</span>
              <span className="font-mono font-bold text-emerald-400">
                {selectedQuestions.length > 0 ? `${selectedQuestions.length} Questions Selected` : '5 High-Yield NCERT Qs'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Generate Exam & Private Access Link
            </button>
          </form>
        ) : (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs space-y-1">
              <p className="font-extrabold text-sm flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Custom Exam Set Successfully!
              </p>
              <p>Send this generated link to your authorized students. When they click it and log in with their email, their exam will start with live AI proctoring!</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Generated Student Access Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdExamLink}
                  className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 font-bold"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setCreatedExamLink('');
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Close & Return to Question Bank
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
