import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

let toastListener = null;

export function showToast(message, type = 'info', duration = 3000) {
  if (toastListener) {
    toastListener({ id: Date.now(), message, type, duration });
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastListener = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration);
    };

    return () => {
      toastListener = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs font-bold transition-all transform translate-y-0 animate-scaleUp ${
            t.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-500 text-white backdrop-blur-md'
              : t.type === 'warning'
              ? 'bg-amber-900/90 border-amber-500 text-white backdrop-blur-md'
              : t.type === 'error'
              ? 'bg-red-900/90 border-red-500 text-white backdrop-blur-md'
              : 'bg-slate-900/90 border-slate-700 text-amber-300 backdrop-blur-md'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {t.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {t.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
            <span className="leading-snug">{t.message}</span>
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="p-1 hover:bg-white/10 rounded transition-colors text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
