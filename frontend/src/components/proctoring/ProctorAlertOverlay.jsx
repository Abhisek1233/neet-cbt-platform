import React from 'react';
import { AlertOctagon, ShieldAlert, X } from 'lucide-react';
import { store } from '../../services/store';

export default function ProctorAlertOverlay({ activeAlert }) {
  if (!activeAlert) return null;

  const isCritical = activeAlert.severity === 'Critical';

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md p-4 animate-bounce">
      <div className={`p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex items-start gap-3.5 ${
        isCritical
          ? 'bg-red-950/90 border-red-500/80 text-red-100 shadow-red-500/20'
          : 'bg-amber-950/90 border-amber-500/80 text-amber-100 shadow-amber-500/20'
      }`}>
        <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {isCritical ? <AlertOctagon className="w-6 h-6 animate-spin" /> : <ShieldAlert className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold tracking-wide uppercase">
              Proctoring Flag Logged
            </h4>
            <span className="text-[10px] font-mono opacity-75">{activeAlert.timestamp}</span>
          </div>
          <p className="text-xs font-semibold mt-0.5">{activeAlert.eventType}</p>
          <p className="text-xs opacity-90 mt-1 leading-relaxed">{activeAlert.details}</p>
        </div>
        <button
          onClick={() => store.setState({ proctorAlertActive: null })}
          className="p-1 rounded text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
