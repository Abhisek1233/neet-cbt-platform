import React from 'react';

export function SkeletonCard() {
  return (
    <div className="p-6 rounded-xl border border-slate-300 bg-white/50 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 w-20 bg-slate-300 rounded"></div>
        <div className="h-4 w-16 bg-slate-300 rounded"></div>
      </div>
      <div className="h-6 w-3/4 bg-slate-300 rounded"></div>
      <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
      <div className="h-10 w-full bg-slate-200 rounded"></div>
    </div>
  );
}
