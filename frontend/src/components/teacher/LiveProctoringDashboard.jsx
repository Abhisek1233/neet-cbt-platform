import React from 'react';
import { Eye, ShieldAlert, Video } from 'lucide-react';

export default function LiveProctoringDashboard({ storeState }) {
  const activeStudents = [
    { id: 's1', name: 'Aarav Sharma', exam: 'NTA-NEET-2026-MOCK1', status: 'Active', face: 'Normal', mic: 'Quiet', tabSwitches: 0, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { id: 's2', name: 'Diya Patel', exam: 'NTA-NEET-2026-MOCK1', status: 'Active', face: 'Normal', mic: 'Whisper (42dB)', tabSwitches: 1, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
    { id: 's3', name: 'Rohan Gupta', exam: 'NTA-NEET-2026-MOCK1', status: 'Flagged ⚠️', face: 'Multi-Face Detected', mic: 'Voice Spike (62dB)', tabSwitches: 3, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h2 className="text-2xl font-display font-extrabold text-white">Live AI Proctoring Control Room</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring grid of active CBT test sessions and AI telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> Active Candidates Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Active Student Cameras & Feed</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeStudents.map((student) => {
              const isFlagged = student.status.includes('Flagged') || student.tabSwitches > 1;
              return (
                <div
                  key={student.id}
                  className={`glass-panel p-4 rounded-xl border ${
                    isFlagged ? 'border-red-500/80 bg-red-950/20' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/40" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{student.name}</h4>
                        <p className="text-[10px] text-slate-400">{student.exam}</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full h-28 rounded-lg bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center mb-3">
                    <img src={student.avatar} alt="Live Video" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-2 border border-emerald-500/40 rounded flex items-start justify-between p-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900/90 text-[9px] font-mono text-emerald-300">
                        {student.face}
                      </span>
                      <Video className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" /> Real-time Event Stream
            </h3>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {storeState.proctorLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl border bg-slate-900 border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{log.studentName}</span>
                    <span className="text-[10px] font-mono opacity-70">{log.timestamp}</span>
                  </div>
                  <p className="font-semibold text-cyan-300">{log.eventType}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
