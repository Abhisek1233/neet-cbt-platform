import React from 'react';
import { Trophy } from 'lucide-react';
import { mockLeaderboard } from '../../data/mockData';

export default function Leaderboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-900">All-India NEET CBT Leaderboard</h2>
          <p className="text-xs text-slate-600 mt-1">
            Real-time rankings calculated using score, accuracy percentage, and test completion speed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-bold rounded bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
            <Trophy className="w-4 h-4" /> AIR Rank Update: Live
          </span>
        </div>
      </div>

      <div className="cbt-panel rounded-xl border border-slate-300 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3.5 pl-5">AIR Rank</th>
              <th className="p-3.5">Candidate Name</th>
              <th className="p-3.5">Score</th>
              <th className="p-3.5">Accuracy</th>
              <th className="p-3.5">Time Taken</th>
              <th className="p-3.5">Study Squad</th>
              <th className="p-3.5 pr-5">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockLeaderboard.map((row) => (
              <tr key={row.rank} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 pl-5 font-bold font-mono text-blue-700">#{row.rank}</td>
                <td className="p-3.5 font-bold text-slate-900">{row.name}</td>
                <td className="p-3.5 font-extrabold font-mono text-emerald-700">{row.score} / 720</td>
                <td className="p-3.5 font-medium text-slate-700">{row.accuracy}</td>
                <td className="p-3.5 font-mono text-slate-600">{row.timeTaken}</td>
                <td className="p-3.5 text-blue-700 font-bold">{row.squad}</td>
                <td className="p-3.5 pr-5 text-slate-600">{row.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
