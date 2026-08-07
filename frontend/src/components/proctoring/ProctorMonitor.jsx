import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic } from 'lucide-react';
import { store } from '../../services/store';

export default function ProctorMonitor({ exam, isTakingExam }) {
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [micVolume, setMicVolume] = useState(0);
  const [faceDetected, setFaceDetected] = useState(true);
  const [multiFaceDetected, setMultiFaceDetected] = useState(false);
  const [tabFocusLostCount, setTabFocusLostCount] = useState(0);

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

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
            store.logProctorEvent('Audio / Voice Detected', 'Warning', `Sustained microphone audio amplitude spike (${Math.round(avg)} dB).`);
          }

          requestAnimationFrame(checkAudioVolume);
        };

        checkAudioVolume();
        store.logProctorEvent('Camera & Mic Feed Active', 'Info', 'Proctoring video stream & Web Audio analyzer initialized successfully.');

      } catch (err) {
        console.warn('Proctor media permission error:', err);
      }
    }

    setupProctorMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isTakingExam]);

  useEffect(() => {
    if (!isTakingExam) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabFocusLostCount((prev) => prev + 1);
        store.logProctorEvent(
          'Tab Switch / Window Blur',
          'Critical',
          'Student switched tabs or minimized the exam window.'
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTakingExam]);

  if (!isTakingExam) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-56 sm:w-64 bg-slate-900 rounded-xl p-3 border border-slate-700 shadow-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold tracking-wide uppercase text-emerald-400">
            Strict AI Proctor
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          NTA Level 3
        </span>
      </div>

      <div className="relative w-full h-36 rounded-lg bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
        {cameraStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 text-xs p-2 text-center">
            <Camera className="w-6 h-6 mb-1 text-slate-600 animate-pulse" />
            <span>AI Camera Feed Simulator</span>
          </div>
        )}
      </div>

      <div className="mt-2.5 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1">
            <Mic className="w-3 h-3 text-cyan-400" /> Mic Amplitude:
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
