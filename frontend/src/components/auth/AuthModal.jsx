import React, { useState } from 'react';
import { UserCheck, UserPlus, Play, X, KeyRound, Mail, User, GraduationCap, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { store } from '../../services/store';

export default function AuthModal({ isOpen, onClose, currentUser }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'signup', 'guest'
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('rahul.student@neet.edu');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  
  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('student');
  const [targetYear, setTargetYear] = useState('2026');

  // Guest State
  const [guestName, setGuestName] = useState('');

  if (!isOpen) return null;

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (loginEmail.includes('teacher') || loginEmail.includes('roy') || loginEmail.includes('hod')) {
      store.setUserCustomAccount('Dr. S. K. Roy (HOD Physics)', loginEmail, 'teacher');
    } else {
      store.setUserCustomAccount(loginEmail.split('@')[0] || 'Rahul Kumar', loginEmail, 'student');
    }
    onClose();
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    store.setUserCustomAccount(signUpName || 'NEET Aspirant', signUpEmail || 'aspirant@neet.edu', signUpRole);
    onClose();
  };

  const handleQuickPresetLogin = (name, email, role) => {
    store.setUserCustomAccount(name, email, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header & Tab Switches */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> NEET CBT Portal Authentication
          </span>
          <h2 className="text-2xl font-display font-extrabold text-white">
            Welcome to NEET CBT Platform
          </h2>
        </div>

        {/* Auth Sub-Tabs */}
        <div className="flex items-center justify-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'login' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Sign In
          </button>

          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'signup' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Create Account
          </button>

          <button
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'guest' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Instant Guest
          </button>
        </div>

        {/* TAB 1: SIGN IN FORM */}
        {activeTab === 'login' && (
          <div className="space-y-4 animate-fadeIn">
            <form onSubmit={handleSignInSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@neet.edu"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer mt-2"
              >
                Sign In to CBT Account
              </button>
            </form>

            {/* Quick Demo Preset Chips */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Or One-Click Quick Login:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickPresetLogin('Rahul Kumar (Student)', 'rahul.student@neet.edu', 'student')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs transition-all cursor-pointer"
                >
                  <p className="font-extrabold text-white flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> Rahul Kumar
                  </p>
                  <p className="text-[10px] text-slate-400">Student • AIR #420 Target</p>
                </button>

                <button
                  onClick={() => handleQuickPresetLogin('Dr. S. K. Roy (HOD Physics)', 'hod.physics@neet.edu', 'teacher')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs transition-all cursor-pointer"
                >
                  <p className="font-extrabold text-white flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Dr. S. K. Roy
                  </p>
                  <p className="text-[10px] text-slate-400">Faculty HOD • Teacher Portal</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIGN UP / REGISTER FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3 animate-fadeIn">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="priya.sharma@neet.edu"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Account Role</label>
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="student">NEET Student / Aspirant</option>
                  <option value="teacher">Teacher / Faculty Admin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target NEET Year</label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="2026">NEET UG 2026</option>
                  <option value="2027">NEET UG 2027</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Create Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer mt-2"
            >
              Create Account & Enter Platform
            </button>
          </form>
        )}

        {/* TAB 3: GUEST MODE */}
        {activeTab === 'guest' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Instant Temporary Guest Practice Session
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice full CBT mock tests instantly without creating an account.
              </p>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Enter Your Aspirant Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Guest Aspirant"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>
            </div>

            <button
              onClick={() => {
                store.setUserRole('student', true, guestName || 'Guest Aspirant');
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer"
            >
              Start Instant Guest CBT Session
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
