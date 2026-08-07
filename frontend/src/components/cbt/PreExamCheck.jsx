import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Maximize2, ShieldCheck, ArrowRight } from 'lucide-react';
import { store } from '../../services/store';

export default function PreExamCheck({ exam, currentUser, onStartExam, onCancel }) {
  const videoRef = useRef(null);
  const [cameraOk, setCameraOk] = useState(false);
  const [micOk, setMicOk] = useState(false);
  const [fullscreenOk, setFullscreenOk] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [micLevel, setMicLevel] = useState(0);

  useEffect(() => {
    async function testMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setCameraOk(true);
        setMicOk(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        const timer = setInterval(() => {
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          setMicLevel(Math.round(avg));
        }, 100);

        return () => {
          clearInterval(timer);
          stream.getTracks().forEach((t) => t.stop());
          audioCtx.close();
        };
      } catch (err) {
        console.warn('Hardware test media error:', err);
      }
    }

    testMedia();
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
    if (!agreedToRules) return;
    store.startActiveExam();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-5xl mx-auto flex flex-col justify-center">
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              NTA Pre-Exam Compatibility Verification
            </span>
            <h1 className="text-2xl font-display font-extrabold text-white mt-2">
              {exam.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Exam Code: {exam.code} | Duration: {exam.durationMin} Mins | Marking: {exam.markingScheme}
            </p>
          </div>
          <button onClick={onCancel} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-cyan-400" /> 1. AI Camera Feed
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${cameraOk ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {cameraOk ? '✓ READY' : 'TESTING'}
                </span>
              </div>
              <div className="relative w-full h-32 rounded-lg bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                {!cameraOk && <span className="text-xs text-slate-500">Connecting Camera...</span>}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              AI Face presence monitor will stay active during the exam.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-cyan-400" /> 2. Audio Analyzer
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${micOk ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {micOk ? '✓ ACTIVE' : 'TESTING'}
                </span>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Speak into mic to test:</span>
                  <span className="font-mono text-cyan-300">{micLevel} dB</span>
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
              Web Audio API monitors background noise & talking.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-cyan-400" /> 3. Secure Lock
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${fullscreenOk ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {fullscreenOk ? '✓ LOCKED' : 'PENDING'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                NTA NEET CBT requires full-screen lock. Leaving or switching windows triggers proctoring logs.
              </p>
              <button
                onClick={requestFullscreen}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Enable Fullscreen Mode
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Tab switches log timestamps automatically.
            </p>
          </div>

        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Important NTA Candidate Instructions:
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5 leading-relaxed">
            <li>Each correct answer awards <strong>+4 marks</strong>. Each incorrect answer deducts <strong>-1 mark</strong>. Unattempted questions receive <strong>0 marks</strong>.</li>
            <li>Use the <strong>Question Palette</strong> on the right to navigate between questions.</li>
            <li>Questions marked for review will be evaluated if an option is selected.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-200">
            <input
              type="checkbox"
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="mt-0.5 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
            />
            <span>
              I have read and understood all NTA NEET exam instructions. I agree to enable client-side camera/mic AI proctoring for this test session.
            </span>
          </label>

          <button
            disabled={!agreedToRules}
            onClick={handleBeginTest}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              agreedToRules
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>Start Official CBT Exam</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
