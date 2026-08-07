import React, { useState } from 'react';
import { X, Mail, MessageSquarePlus, Send, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { sendFeedbackToBackend } from '../../services/api';
import { showToast } from '../ui/Toast';

export default function FeedbackModal({ isOpen, onClose, currentUser, onOpenAuth, theme }) {
  const [feedbackType, setFeedbackType] = useState('Feature Request');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || currentUser.isGuest) {
      showToast('🔒 Real account login is required to post feedback to database. Guests cannot submit in-app posts!', 'error', 5000);
      onOpenAuth();
      return;
    }

    if (!message.trim()) {
      showToast('⚠️ Please write your feedback message before submitting!', 'error');
      return;
    }

    setIsSubmitting(true);
    showToast('⚡ Saving your feedback into Database...', 'info', 3000);

    const result = await sendFeedbackToBackend({
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: feedbackType,
      message: message.trim()
    });

    setIsSubmitting(false);

    if (result && result.status === 'success') {
      showToast('🎉 Thank you! Your feedback has been saved directly to Database.', 'success', 5000);
      setMessage('');
      onClose();
    } else {
      showToast('❌ Failed to save feedback. Please try again or email directly.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className={`w-5 h-5 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
            <h3 className={`text-sm sm:text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Report Issue, Suggest Feature or Improvement
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Priority Option 1: Direct Email (Higher Chance) */}
        <div className={`p-4 rounded-2xl border space-y-2.5 ${
          isDark ? 'bg-amber-400/10 border-amber-400/40 text-slate-200' : 'bg-amber-50 border-amber-300 text-slate-900'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className={`text-xs font-extrabold flex items-center gap-1.5 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              <Mail className="w-4 h-4" /> Email Creator Directly
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
              ⭐ Recommended (Fast Response)
            </span>
          </div>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            For urgent issues or feature requests, sending an email directly guarantees highest priority review:
          </p>
          <a
            href="mailto:a37317020@gmail.com?subject=NEET%20CBT%20Platform%20Feedback"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow cursor-pointer transition-all"
          >
            <Mail className="w-3.5 h-3.5" /> Email: a37317020@gmail.com
          </a>
        </div>

        {/* Priority Option 2: Post to Database */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold block">Or Submit In-App Feedback (Saved to DB)</label>
            <span className="text-[10px] text-slate-400 font-medium">Requires Real Account Login</span>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Feedback Category</label>
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs font-bold ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="Bug / Issue">🐛 Report Bug / Issue</option>
              <option value="Feature Request">💡 Suggest New Feature</option>
              <option value="UI Improvement">🎨 UI / UX Improvement</option>
              <option value="General Feedback">💬 General Feedback</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Message Statement</label>
            <textarea
              rows={4}
              required
              placeholder="Describe the issue, improvement, or feature you would like to see..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-amber-400 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Notice Box */}
          <div className={`p-3 rounded-xl border text-[11px] flex items-start gap-2 ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-700'
          }`}>
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>Notice:</strong> In-app database submissions are reviewed periodically (there is a less chance to see in-app posts immediately compared to emailing directly).
            </p>
          </div>

          {!currentUser || currentUser.isGuest ? (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Lock className="w-4 h-4 text-red-400 shrink-0" /> Login required to submit (Guest disabled)
              </span>
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-[11px] shrink-0 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !currentUser || currentUser.isGuest}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all ${
                !currentUser || currentUser.isGuest
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting to DB...' : 'Post to Database'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
