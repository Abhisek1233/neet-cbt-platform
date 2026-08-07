import React, { useState } from 'react';
import { UserCheck, UserPlus, Play, X, KeyRound, Mail, User, GraduationCap, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { store } from '../../services/store';
import { loginUserBackend, registerUserBackend } from '../../services/api';
import { showToast } from '../ui/Toast';

export default function AuthModal({ isOpen, onClose, currentUser }) {
  const [activeTab, setActiveTab] = useState('login');
  
  // Clean Login Inputs (No hardcoded pre-filled credentials)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Clean Sign Up Inputs
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('student');
  const [targetYear, setTargetYear] = useState('2026');

  // Guest State
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast('Please enter both your email address and password.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const resData = await loginUserBackend({ email: loginEmail, password: loginPassword });
      if (resData && resData.user) {
        store.setState({ currentUser: resData.user });
        store.saveToStorage('user', resData.user);
        showToast(`✅ Welcome back, ${resData.user.name}! Account authenticated.`, 'success');
        onClose();
      } else {
        showToast('❌ Account not found or incorrect password. Please check your credentials or click Sign Up.', 'error', 5000);
      }
    } catch (err) {
      showToast('❌ Login server error. Please try again.', 'error');
    }
    setIsSubmitting(false);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      showToast('Please fill out all registration fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const resData = await registerUserBackend({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword.trim(),
        role: signUpRole
      });

      if (resData && resData.user) {
        store.setState({ currentUser: resData.user });
        store.saveToStorage('user', resData.user);
        showToast(`🎉 Account Created! Welcome ${resData.user.name}.`, 'success');
        onClose();
      } else {
        const fallbackUser = {
          id: `usr_${Date.now()}`,
          name: signUpName,
          email: signUpEmail,
          role: signUpRole,
          avatar: signUpRole === 'teacher' 
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' 
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        };
        store.setState({ currentUser: fallbackUser });
        store.saveToStorage('user', fallbackUser);
        showToast(`🎉 Welcome ${signUpName}! Session initialized.`, 'success');
        onClose();
      }
    } catch (err) {
      showToast('❌ Registration failed. Please try again.', 'error');
    }
    setIsSubmitting(false);
  };

  const handleQuickPresetLogin = async (name, email, role) => {
    setLoginEmail(email);
    setLoginPassword('password123');
    setIsSubmitting(true);
    const resData = await loginUserBackend({ email, password: 'password123' });
    if (resData && resData.user) {
      store.setState({ currentUser: resData.user });
      store.saveToStorage('user', resData.user);
    } else {
      store.setUserCustomAccount(name, email, role);
    }
    setIsSubmitting(false);
    showToast(`Logged in as ${name}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-700 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header & Tab Switches */}
        <div className="text-center space-y-1.5 pr-6 sm:pr-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-extrabold border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> PostgreSQL Cloud Database Auth
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
            Welcome to NEET CBT Portal
          </h2>
        </div>

        {/* Auth Sub-Tabs */}
        <div className="flex items-center justify-center bg-slate-950 p-1 rounded-2xl border border-slate-800 gap-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-xl text-[11px] sm:text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'login' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Sign In
          </button>

          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 rounded-xl text-[11px] sm:text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'signup' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Sign Up
          </button>

          <button
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-2 rounded-xl text-[11px] sm:text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'guest' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Guest
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
                    placeholder="Enter your registered Gmail ID..."
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
                    placeholder="Enter your password..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer mt-2"
              >
                {isSubmitting ? 'Authenticating with PostgreSQL...' : 'Sign In to CBT Account'}
              </button>
            </form>

            {/* Quick Demo Preset Chips */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Or One-Click Quick Login:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickPresetLogin('Rahul Kumar (Student)', 'rahul.student@neet.edu', 'student')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs transition-all cursor-pointer"
                >
                  <p className="font-extrabold text-white flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> Rahul Kumar
                  </p>
                  <p className="text-[10px] text-slate-400">Student • AIR #420 Target</p>
                </button>

                <button
                  onClick={() => handleQuickPresetLogin('Dr. S. K. Roy (HOD Physics)', 'hod.physics@neet.edu', 'teacher')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs transition-all cursor-pointer"
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
              <label className="text-xs font-bold text-slate-300 block mb-1">Email Address (Gmail)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="priya.sharma@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer mt-2"
            >
              {isSubmitting ? 'Creating PostgreSQL Account...' : 'Create Account & Enter Platform'}
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
