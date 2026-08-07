import React, { useState } from 'react';
import { Play, ShieldCheck, UserCheck, GraduationCap, Cpu, Award, Video, MessageSquarePlus, Mail } from 'lucide-react';
import { store } from '../../services/store';
import AiVideoExplainer from '../video/AiVideoExplainer';
import FeedbackModal from './FeedbackModal';

export default function LandingPage({ onOpenAuth, onStartGuest, theme }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  const isDark = theme === 'dark';
  const currentUser = store.getState().currentUser;

  const handleStartGuestMode = () => {
    store.setUserRole('student', true, 'Guest Aspirant');
    if (onStartGuest) {
      onStartGuest();
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-5rem)] py-3 px-3 sm:px-6 max-w-7xl mx-auto space-y-4 pb-20 md:pb-6 animate-fadeIn">
      
      <AiVideoExplainer
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        theme={theme}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        theme={theme}
      />

      {/* Top Main Hero Card */}
      <div className={`cbt-panel p-5 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-[10px] sm:text-[11px] font-extrabold shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>NTA-PATTERN NEET UG 2026 MOCK ENGINE & GEMINI AI</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-display font-extrabold leading-tight tracking-tight">
            India's #1 NEET CBT Mock Preparation & AI Portal
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Practice on authentic National Testing Agency (NTA) Computer-Based Test format with 200-question paper patterns, Section A & B choices, Google Gemini AI question generation, and strict camera/mic proctoring telemetry.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleStartGuestMode}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Practice Instantly as Guest</span>
            </button>

            <button
              onClick={onOpenAuth}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl border font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isDark ? 'bg-slate-950 border-slate-800 text-amber-300 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Student / Teacher Login</span>
            </button>

            <button
              onClick={() => setIsVideoOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Video className="w-4 h-4 text-slate-950" />
              <span>🎬 Watch Animated AI Video</span>
            </button>
          </div>
        </div>

        {/* Right Badge Summary */}
        <div className={`shrink-0 p-4 sm:p-5 rounded-2xl border text-center max-w-xs w-full space-y-3 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <img src="/logo.jpg" alt="Logo" className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shadow-md border-2 border-amber-400 mx-auto" />
          <div>
            <h3 className="text-base font-extrabold">NTA NEET UG 2026</h3>
            <p className="text-[10px] text-amber-400 font-mono font-bold mt-0.5">200 QUESTIONS / 720 MARKS</p>
          </div>

          <div className="pt-2 border-t border-slate-300/30 text-[11px] space-y-1.5 text-left font-medium">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Full Length Mocks:</span>
              <span className="font-bold font-mono">200Q / 200m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Subject Special Tests:</span>
              <span className="font-bold font-mono text-blue-600">Phy, Chem, Bio</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">AI Question Generator:</span>
              <span className="font-bold font-mono text-emerald-600">Gemini Live</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom 3 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className={`cbt-panel p-4 sm:p-5 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
        }`}>
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold">Authentic NTA CBT Interface</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Replicates official test center screen palette (Answered, Not Answered, Marked for Review), Section A & B rules, and +4/-1 scoring.
          </p>
        </div>

        <div className={`cbt-panel p-4 sm:p-5 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
        }`}>
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold">Google Gemini AI Test Engine</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Generates fresh, unique NEET questions matching Assertion-Reason, Statement I & II, and NCERT weightage predictions in real time.
          </p>
        </div>

        <div className={`cbt-panel p-4 sm:p-5 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
        }`}>
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold">AI Medical College Predictor</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Analyzes MCC All-India Quota and State 85% closing ranks for AIIMS New Delhi, MAMC, VMMC, JIPMER, and top Govt Medical Colleges.
          </p>
        </div>

      </div>

      {/* Contact & Feedback Card Banner */}
      <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400">
            <MessageSquarePlus className="w-4 h-4" /> Found an issue or want a new feature?
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Contact us directly or submit in-app feedback. Emailing guarantees faster responses!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="mailto:abhishekkumar.support@gmail.com?subject=NEET%20CBT%20Platform%20Issue%20or%20Feature%20Request"
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Mail className="w-3.5 h-3.5" /> Email Creator (Recommended)
          </a>
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
              isDark ? 'bg-slate-950 border-slate-700 text-slate-200 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-cyan-400" /> Post In-App Feedback
          </button>
        </div>
      </div>

    </div>
  );
}
