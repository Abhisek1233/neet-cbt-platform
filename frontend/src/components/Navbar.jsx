import React, { useState } from 'react';
import { FileText, Users, GraduationCap, BookOpen, Eye, ChevronDown, Sun, Moon, LogOut, UserCheck, Play } from 'lucide-react';
import { store } from '../services/store';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuth, theme }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'exams', label: 'CBT Exams', icon: FileText },
    { id: 'predictor', label: 'College Predictor', icon: GraduationCap, badge: 'AI' },
    { id: 'social', label: 'Squads & Doubts', icon: Users },
    ...(currentUser && currentUser.role === 'teacher' ? [
      { id: 'teacher-qbank', label: 'Q-Bank', icon: BookOpen },
      { id: 'teacher-proctoring', label: 'Live Feed', icon: Eye, badge: 'Live' },
    ] : [])
  ];

  const isDark = theme === 'dark';

  return (
    <>
      {/* Desktop & Main Header Bar */}
      <header className={`sticky top-0 z-40 border-b-2 shadow-md transition-colors w-full ${
        isDark ? 'bg-slate-900 border-amber-500 text-white' : 'cbt-header-bar border-amber-500 text-white'
      }`}>
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 w-full">
            
            {/* FAR LEFT: Brand Logo & NTA Emblem */}
            <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => setActiveTab('exams')}>
              <img
                src="/logo.jpg"
                alt="NEET CBT Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-amber-400/80 shadow-md"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-base sm:text-xl tracking-tight text-white">
                    NEET<span className="text-amber-400">CBT</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider rounded bg-amber-400 text-slate-950 shadow-sm">
                    NTA 2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 font-medium hidden md:block">National Mock Exam & AI Proctoring Portal</p>
              </div>
            </div>

            {/* CENTER: Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-950/70 p-1.5 rounded-xl border border-slate-700 mx-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || (item.id === 'predictor' && ['predictor', 'cutoffs', 'compare'].includes(activeTab));
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'text-slate-200 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-indigo-500 text-white shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* FAR RIGHT: Dark Mode Toggle & Auth Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Visual Icon Switch Toggle for Dark/Light Mode */}
              <button
                onClick={() => store.toggleTheme()}
                className={`relative inline-flex items-center h-7 w-12 sm:h-8 sm:w-14 rounded-full p-1 transition-colors cursor-pointer border shadow-inner ${
                  isDark ? 'bg-indigo-950 border-indigo-700' : 'bg-slate-800 border-slate-600'
                }`}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <span className={`transform transition-transform duration-300 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-md ${
                  isDark ? 'translate-x-5 sm:translate-x-6 bg-amber-400 text-slate-950' : 'translate-x-0 bg-slate-200 text-amber-500'
                }`}>
                  {isDark ? <Moon className="w-3 h-3 fill-slate-950" /> : <Sun className="w-3 h-3 fill-amber-500" />}
                </span>
              </button>

              {/* Unauthenticated vs Logged In */}
              {!currentUser ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => store.setUserRole('student', true, 'Guest Aspirant')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700 text-amber-300 hover:bg-slate-800 text-[11px] sm:text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-amber-300" /> <span className="hidden sm:inline">Guest</span>
                  </button>
                  <button
                    onClick={onOpenAuth}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-[11px] sm:text-xs shadow hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Login
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700 hover:border-amber-400 text-slate-100 text-xs font-bold transition-all cursor-pointer"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover ring-1 ring-amber-400"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-white line-clamp-1">
                        {currentUser.name}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-scaleUp">
                      <div className="p-2 border-b border-slate-800">
                        <p className="font-bold text-white line-clamp-1">{currentUser.name}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenAuth();
                        }}
                        className="w-full text-left p-2 hover:bg-slate-800 rounded-lg text-slate-200 flex items-center gap-2 mt-1 font-medium cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-amber-400" /> Switch Profile / Role
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          store.logoutUser();
                        }}
                        className="w-full text-left p-2 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2 font-bold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Phones & Small Tablets) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'predictor' && ['predictor', 'cutoffs', 'compare'].includes(activeTab));
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'text-amber-400 bg-slate-900 border border-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[64px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
