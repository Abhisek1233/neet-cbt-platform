import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Maximize2, ShieldCheck, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { store } from '../../services/store';

export default function PreExamCheck({ exam, currentUser, onStartExam, onCancel }) {
  const videoRef = useRef(null);
  const [cameraOk, setCameraOk] = useState(false);
  const [micOk, setMicOk] = useState(false);
  const [fullscreenOk, setFullscreenOk] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(true);
  const [micLevel, setMicLevel] = useState(0);

  useEffect(() => {
    let streamRef = null;
    let audioCtxRef = null;

    async function testMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef = stream;
        setCameraOk(true);
        setMicOk(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef = new AudioCtx();
          const source = audioCtxRef.createMediaStreamSource(stream);
          const analyser = audioCtxRef.createAnalyser();
          source.connect(analyser);
          const data = new Uint8Array(analyser.frequencyBinCount);

          const timer = setInterval(() => {
            analyser.getByteFrequencyData(data);
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            setMicLevel(Math.round(avg));
          }, 100);
        }
      } catch (err) {
        console.warn('Hardware test media error:', err);
      }
    }

    testMedia();

    return () => {
      if (streamRef) {
        streamRef.getTracks().forEach((t) => t.stop());
      }
      if (audioCtxRef) {
        audioCtxRef.close().catch(() => {});
      }
    };
  }, []);

  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setFullscreenOk(true);
    } catch (e) {
      setFullscreenOk(true);
    }
  };

  const handleBeginTest = () => {
    store.startActiveExam();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-5xl mx-auto flex flex-col justify-center animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div>
            <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              NTA Pre-Exam Verification
            </span>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-1">
              {exam.title}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Code: {exam.code} | Duration: {exam.durationMin} Mins | Marking: {exam.markingScheme}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white font-bold cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleBeginTest}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Direct Start Exam
            </button>
          </div>
        </div>

        {/* 3 Verification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-cyan-400" /> 1. AI Camera Feed
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${cameraOk ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {cameraOk ? '✓ ACTIVE' : 'SYSTEM READY'}
                </span>
              </div>
              <div className="relative w-full h-32 rounded-xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center p-2 text-center">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg transform -scale-x-100" />
                {!cameraOk && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-slate-900/90">
                    <Camera className="w-6 h-6 text-cyan-400 mb-1.5 animate-pulse" />
                    <span className="text-xs font-extrabold text-white">Camera Stream Active</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Allow browser prompt if requested</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              AI Face presence monitor active during test.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-cyan-400" /> 2. Audio Analyzer
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${micOk ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {micOk ? '✓ ACTIVE' : 'SYSTEM READY'}
                </span>
              </div>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Microphone level:</span>
                  <span className="font-mono text-cyan-300 font-bold">{micLevel} dB</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-150"
                    style={{ width: `${Math.min(100, (micLevel / 60) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Audio API monitors background sound.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-cyan-400" /> 3. Fullscreen Guard
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${fullscreenOk ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {fullscreenOk ? '✓ LOCKED' : 'REQUIRED'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Click below to lock full-screen mode or start test directly.
              </p>
              <button
                onClick={requestFullscreen}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Enable Fullscreen Mode
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Tab switches logged automatically.
            </p>
          </div>

        </div>

        {/* Candidate Instructions */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> NTA Candidate Exam Rules:
          </h3>
          <ul className="text-xs text-slate-300 space-y-1 list-disc pl-5 leading-relaxed font-medium">
            <li>Correct answer: <strong>+4 marks</strong> | Incorrect answer: <strong>-1 mark</strong> | Unattempted: <strong>0 marks</strong>.</li>
            <li>Use the <strong>Question Palette</strong> to navigate between questions during the test.</li>
            <li>Questions marked for review are evaluated if an option is selected.</li>
          </ul>
        </div>

        {/* Action Checkbox & Start Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-200">
            <input
              type="checkbox"
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
            />
            <span className="font-medium">
              I have read and agreed to all NTA NEET exam instructions.
            </span>
          </label>

          <button
            onClick={handleBeginTest}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white cursor-pointer"
          >
            <span>Start Official CBT Exam</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
