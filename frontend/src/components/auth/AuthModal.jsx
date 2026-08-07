import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Lock, Mail, Phone, User, KeyRound, Sparkles } from 'lucide-react';
import { store } from '../../services/store';
import { loginUserBackend, registerUserBackend } from '../../services/api';
import { showToast } from '../ui/Toast';

export default function AuthModal({ isOpen, onClose, currentUser, theme }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'teacher'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('⚠️ Please enter your registered email and password!', 'error');
      return;
    }

    setIsSubmitting(true);
    showToast('🔐 Authenticating with Secure Database...', 'info', 3000);

    const result = await loginUserBackend({ email, password });
    setIsSubmitting(false);

    if (result && result.user) {
      store.setUserCustomAccount(result.user.name, result.user.email, result.user.role);
      showToast(`🎉 Welcome back, ${result.user.name}! (${result.user.role.toUpperCase()} Account Signed In)`, 'success');
      onClose();
    } else {
      showToast('❌ Account not found or incorrect password. Please check your credentials or Register.', 'error', 5000);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('⚠️ Please fill out Name, Email, and Password!', 'error');
      return;
    }

    setIsSubmitting(true);
    showToast('⚡ Creating your account in Secure Database...', 'info', 3000);

    const result = await registerUserBackend({
      name,
      email,
      password,
      role: selectedRole,
      phone
    });
    setIsSubmitting(false);

    if (result && result.user) {
      store.setUserCustomAccount(result.user.name, result.user.email, result.user.role);
      showToast(`✨ Account Created Successfully! Logged in as ${result.user.name}`, 'success');
      onClose();
    } else {
      showToast('❌ Registration failed. Email ID may already be registered.', 'error', 5000);
    }
  };

  const fillQuickPreset = (presetRole, presetEmail, presetPass, presetName) => {
    setSelectedRole(presetRole);
    setEmail(presetEmail);
    setPassword(presetPass);
    setName(presetName);
    showToast(`🔑 Loaded ${presetRole.toUpperCase()} demo credentials. Click Sign In!`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-extrabold">NEET CBT Secure Portal Authentication</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl border ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setAuthMode('login')}
            className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-amber-400 text-slate-950 shadow'
                : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
            }`}
          >
            Sign In (Login)
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-amber-400 text-slate-950 shadow'
                : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Role Selection Chips */}
        <div>
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
            Select Account Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : (isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600')
              }`}
            >
              <User className="w-4 h-4" /> Student Aspirant
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('teacher')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'teacher'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : (isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600')
              }`}
            >
              <UserCheck className="w-4 h-4" /> Faculty / Teacher
            </button>
          </div>
        </div>

        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-bold block mb-1">Gmail / Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder={selectedRole === 'teacher' ? 'hod.physics@neet.edu' : 'rahul.student@neet.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-amber-400 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter secret password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-amber-400 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer mt-2"
            >
              {isSubmitting ? 'Authenticating with Database...' : 'Sign In to CBT Account'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-bold block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder={selectedRole === 'teacher' ? 'Dr. S. K. Roy (HOD Physics)' : 'Rahul Kumar'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-amber-400 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Gmail / Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@neet.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-amber-400 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Phone Number (For Squad Invites)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-amber-400 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-amber-400 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer mt-2"
            >
              {isSubmitting ? 'Creating Account in Database...' : 'Create Account & Enter Platform'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
