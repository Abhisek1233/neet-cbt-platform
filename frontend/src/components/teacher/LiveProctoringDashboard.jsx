import React from 'react';
import { Eye, ShieldAlert, Video, Users, FileText, Cpu, Activity, BarChart2 } from 'lucide-react';

export default function LiveProctoringDashboard({ storeState }) {
  const activeStudents = [
    { id: 's1', name: 'Aarav Sharma', exam: 'NTA-NEET-2026-MOCK1', status: 'Active', face: 'Normal', mic: 'Quiet', tabSwitches: 0, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { id: 's2', name: 'Diya Patel', exam: 'NTA-NEET-2026-MOCK1', status: 'Active', face: 'Normal', mic: 'Whisper (42dB)', tabSwitches: 1, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
    { id: 's3', name: 'Rohan Gupta', exam: 'NTA-NEET-2026-MOCK1', status: 'Flagged ⚠️', face: 'Multi-Face Detected', mic: 'Voice Spike (62dB)', tabSwitches: 3, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' }
  ];

  const totalAttempts = storeState.submittedAttempts ? storeState.submittedAttempts.length : 12;
  const totalQuestions = storeState.questions ? storeState.questions.length : 50;

  return (
    <div className="space-y-6 animate-fadeIn pb-20 md:pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">Live AI Proctoring & Traffic Control Room</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time candidate activity, live test session feeds, and platform usage analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Live Server Online
          </span>
        </div>
      </div>

      {/* Real-time Platform Usage Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Active Online Visitors</p>
            <p className="text-xl font-extrabold text-emerald-400 font-mono flex items-center gap-1.5">
              <span>{activeStudents.length + 1} Candidates</span>
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Completed CBT Mocks</p>
            <p className="text-xl font-extrabold text-blue-400 font-mono">{totalAttempts} Submissions</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Gemini AI Questions</p>
            <p className="text-xl font-extrabold text-amber-300 font-mono">{totalQuestions} High-Yield Qs</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Vercel Analytics Status</p>
            <p className="text-sm font-extrabold text-purple-300 font-mono">Live Visitor Tracking</p>
          </div>
        </div>

      </div>

      {/* Main Proctoring & Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Video className="w-4 h-4 text-cyan-400" /> Active Student Cameras & Live Stream Feed
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeStudents.map((student) => {
              const isFlagged = student.status.includes('Flagged') || student.tabSwitches > 1;
              return (
                <div
                  key={student.id}
                  className={`glass-panel p-4 rounded-2xl border ${
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

                  <div className="relative w-full h-28 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center mb-3">
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

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" /> Real-time Proctor Event Logs
            </h3>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {storeState.proctorLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl border bg-slate-900 border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{log.studentName}</span>
                    <span className="text-[10px] font-mono opacity-70">{log.timestamp}</span>
                  </div>
                  <p className="font-semibold text-cyan-300">{log.eventType}</p>
                  <p className="text-[10px] text-slate-400">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
