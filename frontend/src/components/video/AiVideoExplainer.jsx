import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, X, ShieldCheck, Cpu, GraduationCap, Award, Eye, Film, Radio, Video } from 'lucide-react';

export default function AiVideoExplainer({ isOpen, onClose, theme }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState('hi');
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const isDark = theme === 'dark';
  const synthRef = useRef(window.speechSynthesis);

  const dialogues = {
    hi: [
      {
        sceneId: 0,
        sceneName: '01. Intro & Welcome',
        speaker: 'teacher',
        name: 'Dr. S. K. Roy',
        role: 'Senior Physics HOD',
        avatar: '/teacher_avatar.jpg',
        subtitle: 'अरे राहुल! आओ बैठो। NEET 2026 Exam पास आ रहा है, तैयारी कैसी चल रही है तुम्हारी?',
        textToSpeak: 'Are Rahul! Aao baitho. NEET 2026 Exam paas aa raha hai, tayyari kaisi chal rahi hai tumhari?',
        previewType: 'intro',
        previewTitle: 'Welcome to NEET CBT Platform',
        previewSubtitle: 'India\'s #1 NTA-Pattern Mock Exam & AI Portal'
      },
      {
        sceneId: 1,
        sceneName: '02. NTA Exam Palette',
        speaker: 'student',
        name: 'Rahul Kumar',
        role: 'NEET Aspirant',
        avatar: '/student_avatar.jpg',
        subtitle: 'Sir, padhai toh acchi hai... par exam hall me NTA ki tarah CBT Test practice karne me thoda darr lagta hai.',
        textToSpeak: 'Sir, padhai toh acchi hai... par exam hall me NTA ki tarah CBT Test practice karne me thoda darr lagta hai.',
        previewType: 'palette',
        previewTitle: 'Authentic 5-State NTA Palette',
        previewSubtitle: 'Answered (Green) • Marked for Review (Purple) • Unvisited'
      },
      {
        sceneId: 1,
        sceneName: '02. NTA Exam Palette',
        speaker: 'teacher',
        name: 'Dr. S. K. Roy',
        role: 'Senior Physics HOD',
        avatar: '/teacher_avatar.jpg',
        subtitle: 'Chinta mat karo! Iss NEET CBT Platform par tum bilkul NTA ke real test center ki tarah 200 questions ka Section A aur B exam de sakte ho.',
        textToSpeak: 'Chinta mat karo! Iss NEET CBT Platform par tum bilkul NTA ke real test center ki tarah 200 questions ka Section A aur B exam de sakte ho.',
        previewType: 'timer',
        previewTitle: 'NTA Official 200m Timer & +4/-1',
        previewSubtitle: 'Physics • Chemistry • Botany • Zoology Section A & B'
      },
      {
        sceneId: 2,
        sceneName: '03. Gemini AI Generator',
        speaker: 'student',
        name: 'Rahul Kumar',
        role: 'NEET Aspirant',
        avatar: '/student_avatar.jpg',
        subtitle: 'Wow Sir! Aur kya hum Google Gemini AI se daily naye Subject-Wise aur Topic Speed Tests generate kar sakte hain?',
        textToSpeak: 'Wow Sir! Aur kya hum Google Gemini AI se daily naye Subject-Wise aur Topic Speed Tests generate kar sakte hain?',
        previewType: 'ai-gen',
        previewTitle: 'Google Gemini AI Question Engine',
        previewSubtitle: 'Assertion-Reason • Statement I & II • NCERT Predicted'
      },
      {
        sceneId: 3,
        sceneName: '04. AI Proctoring Feed',
        speaker: 'teacher',
        name: 'Dr. S. K. Roy',
        role: 'Senior Physics HOD',
        avatar: '/teacher_avatar.jpg',
        subtitle: 'Haan Rahul! Gemini AI real-time me NCERT High-Yield questions generate karta hai. Aur AI Proctoring camera aur mic se tumhari speed monitor karti hai.',
        textToSpeak: 'Haan Rahul! Gemini AI real-time me NCERT High-Yield questions generate karta hai. Aur AI Proctoring camera aur mic se tumhari speed monitor karti hai.',
        previewType: 'proctor',
        previewTitle: 'Live AI Camera & Mic Telemetry',
        previewSubtitle: 'Real-Time Face Tracking & Audio Anomaly Guard'
      },
      {
        sceneId: 4,
        sceneName: '05. College Predictor',
        speaker: 'student',
        name: 'Rahul Kumar',
        role: 'NEET Aspirant',
        avatar: '/student_avatar.jpg',
        subtitle: 'Kya baat hai Sir! Iska matlab ab AI Medical College Predictor se humein humare score par top Government Medical College pehle se pata chal jayega!',
        textToSpeak: 'Kya baat hai Sir! Iska matlab ab AI Medical College Predictor se humein humare score par top Government Medical College pehle se pata chal jayega!',
        previewType: 'predictor',
        previewTitle: 'AI Medical College Predictor',
        previewSubtitle: 'MCC All-India Quota & State 85% Seats Cutoffs'
      },
      {
        sceneId: 0,
        sceneName: '01. Intro & Welcome',
        speaker: 'teacher',
        name: 'Dr. S. K. Roy',
        role: 'Senior Physics HOD',
        avatar: '/teacher_avatar.jpg',
        subtitle: 'Bilkul sahi! Toh ab der kis baat ki... Practice Instantly as Guest par click karo aur apna pehla AI Mock Test shuru karo!',
        textToSpeak: 'Bilkul sahi! Toh ab der kis baat ki... Practice Instantly as Guest par click karo aur apna pehla AI Mock Test shuru karo!',
        previewType: 'intro',
        previewTitle: 'Start Free Guest CBT Mock Exam',
        previewSubtitle: 'Click Practice Instantly as Guest to Begin'
      }
    ],
    en: [
      {
        sceneId: 0,
        sceneName: '01. Intro & Welcome',
        speaker: 'teacher',
        name: 'Dr. S. K. Roy',
        role: 'Senior Physics HOD',
        avatar: '/teacher_avatar.jpg',
        subtitle: 'Hey Rahul! Come in. NEET 2026 is approaching fast, how is your preparation going on?',
        textToSpeak: 'Hey Rahul! Come in. NEET 2026 is approaching fast, how is your preparation going on?',
        previewType: 'intro',
        previewTitle: 'Welcome to NEET CBT Platform',
        previewSubtitle: 'India\'s #1 NTA-Pattern Mock Exam & AI Portal'
      },
      {
        sceneId: 1,
        sceneName: '02. NTA Exam Palette',
        speaker: 'student',
        name: 'Rahul Kumar',
        role: 'NEET Aspirant',
        avatar: '/student_avatar.jpg',
        subtitle: 'Sir, my concepts are clear, but I feel nervous about practicing in the exact NTA computer test center environment.',
        textToSpeak: 'Sir, my concepts are clear, but I feel nervous about practicing in the exact NTA computer test center environment.',
        previewType: 'palette',
        previewTitle: 'Authentic 5-State NTA Palette',
        previewSubtitle: 'Answered (Green) • Marked for Review (Purple) • Unvisited'
      },
      {
        sceneId: 1,
        sceneName: '02. NTA Exam Palette',
        speaker: 'teacher',
        name: 'Dr. S. K. Roy',
        role: 'Senior Physics HOD',
        avatar: '/teacher_avatar.jpg',
        subtitle: 'Don\'t worry at all! On this NEET CBT Platform, you can practice authentic 200-question Section A & B papers just like NTA test centers.',
        textToSpeak: 'Don\'t worry at all! On this NEET CBT Platform, you can practice authentic 200-question Section A & B papers just like NTA test centers.',
        previewType: 'timer',
        previewTitle: 'NTA Official 200m Timer & +4/-1',
        previewSubtitle: 'Physics • Chemistry • Botany • Zoology Section A & B'
      },
      {
        sceneId: 2,
        sceneName: '03. Gemini AI Generator',
        speaker: 'student',
        name: 'Rahul Kumar',
        role: 'NEET Aspirant',
        avatar: '/student_avatar.jpg',
        subtitle: 'That\'s amazing Sir! Can we also generate unlimited fresh Subject-Wise and Topic Speed Tests powered by Google Gemini AI?',
        textToSpeak: 'That\'s amazing Sir! Can we also generate unlimited fresh Subject-Wise and Topic Speed Tests powered by Google Gemini AI?',
        previewType: 'ai-gen',
        previewTitle: 'Google Gemini AI Question Engine',
        previewSubtitle: 'Assertion-Reason • Statement I & II • NCERT Predicted'
      },
      {
        sceneId: 3,
        sceneName: '04. AI Proctoring Feed',
        speaker: 'teacher',
        name: 'Dr. S. K. Roy',
        role: 'Senior Physics HOD',
        avatar: '/teacher_avatar.jpg',
        subtitle: 'Yes Rahul! Gemini AI creates NCERT high-yield questions instantly. Plus, AI Proctoring monitors your test session via camera and mic.',
        textToSpeak: 'Yes Rahul! Gemini AI creates NCERT high-yield questions instantly. Plus, AI Proctoring monitors your test session via camera and mic.',
        previewType: 'proctor',
        previewTitle: 'Live AI Camera & Mic Telemetry',
        previewSubtitle: 'Real-Time Face Tracking & Audio Anomaly Guard'
      },
      {
        sceneId: 4,
        sceneName: '05. College Predictor',
        speaker: 'student',
        name: 'Rahul Kumar',
        role: 'NEET Aspirant',
        avatar: '/student_avatar.jpg',
        subtitle: 'Awesome Sir! And the AI College Predictor will guide us on target Government Medical Colleges for AIIMS New Delhi and MCC quotas!',
        textToSpeak: 'Awesome Sir! And the AI College Predictor will guide us on target Government Medical Colleges for AIIMS New Delhi and MCC quotas!',
        previewType: 'predictor',
        previewTitle: 'AI Medical College Predictor',
        previewSubtitle: 'MCC All-India Quota & State 85% Seats Cutoffs'
      },
      {
        sceneId: 0,
        sceneName: '01. Intro & Welcome',
        speaker: 'teacher',
        name: 'Dr. S. K. Roy',
        role: 'Senior Physics HOD',
        avatar: '/teacher_avatar.jpg',
        subtitle: 'Exactly! So click Practice Instantly as Guest and start your first AI Mock Exam right now!',
        textToSpeak: 'Exactly! So click Practice Instantly as Guest and start your first AI Mock Exam right now!',
        previewType: 'intro',
        previewTitle: 'Start Free Guest CBT Mock Exam',
        previewSubtitle: 'Click Practice Instantly as Guest to Begin'
      }
    ]
  };

  const currentDialogueList = dialogues[language];
  const activeDialogue = currentDialogueList[currentStep] || currentDialogueList[0];

  const scenesList = [
    '01. Intro & Welcome',
    '02. NTA Exam Palette',
    '03. Gemini AI Generator',
    '04. AI Proctoring Feed',
    '05. College Predictor'
  ];

  useEffect(() => {
    if (isPlaying && !isMuted && synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(activeDialogue.textToSpeak);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.92;
      utterance.pitch = activeDialogue.speaker === 'teacher' ? 0.95 : 1.15;

      utterance.onend = () => {
        if (currentStep < currentDialogueList.length - 1) {
          setTimeout(() => setCurrentStep((prev) => prev + 1), 600);
        } else {
          setIsPlaying(false);
        }
      };

      synthRef.current.speak(utterance);
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [currentStep, isPlaying, language, isMuted]);

  if (!isOpen) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (synthRef.current) synthRef.current.cancel();
    } else {
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (synthRef.current) synthRef.current.cancel();
    setCurrentStep(0);
  };

  const jumpToScene = (sceneIndex) => {
    const targetStep = currentDialogueList.findIndex((d) => d.sceneId === sceneIndex);
    if (targetStep !== -1) {
      setCurrentStep(targetStep);
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-2xl animate-fadeIn">
      <div className={`w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col justify-between ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-950 border-slate-800 text-white'
      }`}>
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-2 border-b border-slate-800 bg-slate-900/90 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] sm:text-[11px] font-extrabold shadow-md">
              <Film className="w-3.5 h-3.5" /> 1080p AI Video Theater
            </span>
          </div>

          {/* Chapter / Scene Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-md bg-slate-950 p-1 rounded-xl border border-slate-800">
            {scenesList.map((scName, idx) => (
              <button
                key={idx}
                onClick={() => jumpToScene(idx)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  activeDialogue.sceneId === idx 
                    ? 'bg-amber-400 text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {scName.split('. ')[1] || scName}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => {
                  setLanguage('hi');
                  handleReset();
                }}
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                  language === 'hi' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇮🇳 Hindi
              </button>
              <button
                onClick={() => {
                  setLanguage('en');
                  handleReset();
                }}
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                  language === 'en' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇬🇧 English
              </button>
            </div>

            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1080p Video Stage with Live Screen Morphing Canvas */}
        <div className="relative flex-1 min-h-[260px] max-h-[55vh] bg-slate-950 flex items-center justify-between p-3 sm:p-6 overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-indigo-950/50 to-purple-950/40 pointer-events-none" />

          {/* Left Animated Avatar: Faculty */}
          <div className={`relative flex flex-col items-center text-center space-y-1 z-10 transition-all duration-500 ${
            activeDialogue.speaker === 'teacher' ? 'scale-105 opacity-100' : 'scale-95 opacity-45 blur-[0.4px]'
          }`}>
            <div className="relative">
              <div className={`rounded-2xl p-1 transition-all duration-500 ${
                activeDialogue.speaker === 'teacher' && isPlaying 
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-xl animate-pulse ring-4 ring-amber-400/20' 
                  : 'bg-slate-800'
              }`}>
                <img
                  src="/teacher_avatar.jpg"
                  alt="Teacher Avatar"
                  className="w-16 h-16 sm:w-28 sm:h-28 rounded-xl object-cover shadow-lg"
                />
              </div>

              {activeDialogue.speaker === 'teacher' && isPlaying && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[8px] sm:text-[9px] font-extrabold shadow-lg border border-amber-300">
                  <Radio className="w-2 h-2 text-slate-950 animate-pulse" />
                  <span>SPEAKING</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-[11px] sm:text-xs font-extrabold text-white">Dr. S. K. Roy</p>
              <p className="text-[9px] sm:text-[10px] text-amber-400 font-bold">Faculty HOD</p>
            </div>
          </div>

          {/* CENTER: Live Interactive Website Screen Morphing Preview */}
          <div className="hidden sm:flex flex-col items-center justify-center max-w-xs w-full z-20 px-2 animate-scaleUp">
            
            <div className="w-full rounded-2xl bg-slate-900/95 border border-slate-700/90 shadow-2xl p-3 space-y-2 backdrop-blur-xl text-center">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[10px] font-mono font-bold text-amber-300">
                <span className="flex items-center gap-1">
                  <Video className="w-3 h-3 text-amber-400" /> DEMO CANVAS
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30 truncate max-w-[110px]">
                  {activeDialogue.sceneName}
                </span>
              </div>

              {activeDialogue.previewType === 'intro' && (
                <div className="space-y-1.5 py-1 animate-fadeIn">
                  <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-xl border border-amber-400 shadow mx-auto" />
                  <h4 className="text-xs font-extrabold text-white">{activeDialogue.previewTitle}</h4>
                  <p className="text-[10px] text-slate-400">{activeDialogue.previewSubtitle}</p>
                </div>
              )}

              {activeDialogue.previewType === 'palette' && (
                <div className="space-y-1.5 py-1 animate-fadeIn">
                  <div className="grid grid-cols-4 gap-1 max-w-[160px] mx-auto text-[9px] font-mono font-bold">
                    <span className="p-0.5 rounded bg-emerald-600 text-white">Q.1 ✔</span>
                    <span className="p-0.5 rounded bg-red-600 text-white">Q.2 ✘</span>
                    <span className="p-0.5 rounded bg-purple-600 text-white">Q.3 👁</span>
                    <span className="p-0.5 rounded bg-slate-700 text-slate-300">Q.4</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-emerald-400">{activeDialogue.previewTitle}</h4>
                  <p className="text-[10px] text-slate-400">{activeDialogue.previewSubtitle}</p>
                </div>
              )}

              {activeDialogue.previewType === 'timer' && (
                <div className="space-y-1.5 py-1 animate-fadeIn">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-slate-950 text-amber-300 font-mono font-extrabold text-xs border border-amber-400/40">
                    ⏱ 03 : 19 : 59
                  </div>
                  <h4 className="text-xs font-extrabold text-white">{activeDialogue.previewTitle}</h4>
                  <p className="text-[10px] text-slate-400">{activeDialogue.previewSubtitle}</p>
                </div>
              )}

              {activeDialogue.previewType === 'ai-gen' && (
                <div className="space-y-1.5 py-1 animate-fadeIn">
                  <div className="p-1.5 rounded bg-indigo-950 border border-indigo-700 text-[10px] text-indigo-200 space-y-0.5">
                    <p className="font-extrabold text-amber-300">⚡ Gemini AI Question</p>
                    <p className="line-clamp-1 font-mono">Assertion: Ray Optics...</p>
                  </div>
                  <h4 className="text-xs font-extrabold text-indigo-400">{activeDialogue.previewTitle}</h4>
                </div>
              )}

              {activeDialogue.previewType === 'proctor' && (
                <div className="space-y-1.5 py-1 animate-fadeIn">
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-[10px] flex items-center justify-between text-emerald-400 font-mono">
                    <span>🟢 Camera Active</span>
                    <span>🎙️ Mic Guard</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-emerald-400">{activeDialogue.previewTitle}</h4>
                </div>
              )}

              {activeDialogue.previewType === 'predictor' && (
                <div className="space-y-1.5 py-1 animate-fadeIn">
                  <div className="p-1.5 rounded bg-blue-950 border border-blue-700 text-[10px] text-blue-200 text-left font-mono space-y-0.5">
                    <p className="font-bold text-amber-300">AIIMS New Delhi</p>
                    <p className="text-emerald-400">99.4% Admission Prob</p>
                  </div>
                  <h4 className="text-xs font-extrabold text-blue-400">{activeDialogue.previewTitle}</h4>
                </div>
              )}

            </div>
          </div>

          {/* Right Animated Avatar: Student */}
          <div className={`relative flex flex-col items-center text-center space-y-1 z-10 transition-all duration-500 ${
            activeDialogue.speaker === 'student' ? 'scale-105 opacity-100' : 'scale-95 opacity-45 blur-[0.4px]'
          }`}>
            <div className="relative">
              <div className={`rounded-2xl p-1 transition-all duration-500 ${
                activeDialogue.speaker === 'student' && isPlaying 
                  ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 shadow-xl animate-pulse ring-4 ring-blue-400/20' 
                  : 'bg-slate-800'
              }`}>
                <img
                  src="/student_avatar.jpg"
                  alt="Student Avatar"
                  className="w-16 h-16 sm:w-28 sm:h-28 rounded-xl object-cover shadow-lg"
                />
              </div>

              {activeDialogue.speaker === 'student' && isPlaying && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[8px] sm:text-[9px] font-extrabold shadow-lg border border-blue-300">
                  <Radio className="w-2 h-2 text-white animate-pulse" />
                  <span>SPEAKING</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-[11px] sm:text-xs font-extrabold text-white">Rahul Kumar</p>
              <p className="text-[9px] sm:text-[10px] text-blue-400 font-bold">NEET Aspirant</p>
            </div>
          </div>

          {/* Animated Subtitle Speech Bubble Card */}
          <div className="absolute bottom-2 inset-x-3 sm:inset-x-8 bg-slate-900/95 border border-slate-700/90 p-2.5 rounded-xl shadow-2xl text-center space-y-0.5 backdrop-blur-lg animate-fadeIn z-20">
            <div className="flex items-center justify-center gap-2">
              <span className={`w-2 h-2 rounded-full ${activeDialogue.speaker === 'teacher' ? 'bg-amber-400' : 'bg-blue-400'}`} />
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                {activeDialogue.name} ({activeDialogue.role})
              </p>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white leading-tight font-sans line-clamp-2">
              "{activeDialogue.subtitle}"
            </p>
          </div>

        </div>

        {/* Video Player Controls Bar */}
        <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlayPause}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow flex items-center gap-1 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-slate-950" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" /> Play
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Restart Video"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            {currentDialogueList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(true);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-800 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400">
            {currentStep + 1} / {currentDialogueList.length}
          </span>

        </div>

      </div>
    </div>
  );
}
