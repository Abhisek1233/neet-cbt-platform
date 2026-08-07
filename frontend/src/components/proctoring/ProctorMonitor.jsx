import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, Minus, Plus, Eye, EyeOff } from 'lucide-react';
import { store } from '../../services/store';

export default function ProctorMonitor({ exam, isTakingExam }) {
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [micVolume, setMicVolume] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!isTakingExam) return;

    let localStream = null;

    async function setupProctorMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, frameRate: 15 },
          audio: true
        });

        localStream = stream;
        setCameraStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkAudioVolume = () => {
            if (!audioContextRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setMicVolume(Math.round(avg));

            if (avg > 55) {
              store.logProctorEvent('Audio / Voice Detected', 'Warning', `Microphone amplitude spike (${Math.round(avg)} dB).`);
            }

            requestAnimationFrame(checkAudioVolume);
          };

          checkAudioVolume();
        }

        store.logProctorEvent('Camera & Mic Active', 'Info', 'Proctoring video stream initialized.');

      } catch (err) {
        console.warn('Proctor media error:', err);
      }
    }

    setupProctorMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isTakingExam]);

  // Tab switch listener
  useEffect(() => {
    if (!isTakingExam) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        store.logProctorEvent(
          'Tab Switch / Window Blur',
          'Critical',
          'Candidate switched tabs or minimized exam window.'
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTakingExam]);

  if (!isTakingExam) return null;

  // Render Hidden / Minimized Pill Badge
  if (isHidden || isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40 animate-fadeIn">
        <button
          onClick={() => {
            setIsHidden(false);
            setIsMinimized(false);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-emerald-400 border border-emerald-500/40 shadow-xl backdrop-blur-md text-xs font-bold hover:bg-slate-900 cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>🟢 AI Proctor Active</span>
          <Eye className="w-3.5 h-3.5 ml-1 text-slate-400 hover:text-white" />
        </button>
      </div>
    );
  }

  // Render Full Floating Camera Card
  return (
    <div className="fixed bottom-4 right-4 z-40 w-52 sm:w-60 bg-slate-900/95 rounded-2xl p-2.5 border border-slate-700 shadow-2xl backdrop-blur-md animate-fadeIn">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-extrabold tracking-wide uppercase text-emerald-400">
            Strict AI Proctor
          </span>
        </div>

        {/* Minimize & Hide Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize Overlay"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsHidden(true)}
            title="Hide Overlay (Background Active)"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Video Frame */}
      <div className="relative w-full h-28 sm:h-32 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
        {!cameraStream && (
          <div className="flex flex-col items-center justify-center text-slate-500 text-[10px] p-2 text-center">
            <Camera className="w-5 h-5 mb-1 text-cyan-400 animate-pulse" />
            <span>AI Camera Active</span>
          </div>
        )}
      </div>

      {/* Mic Meter Bar */}
      <div className="mt-2 space-y-1 text-[10px]">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1 font-bold">
            <Mic className="w-3 h-3 text-cyan-400" /> Mic:
          </span>
          <span className="font-mono text-cyan-300">{micVolume} dB</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-150 ${
              micVolume > 50 ? 'bg-red-500' : micVolume > 30 ? 'bg-amber-400' : 'bg-cyan-500'
            }`}
            style={{ width: `${Math.min(100, (micVolume / 70) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
