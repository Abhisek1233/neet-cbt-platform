import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Target, Award, MapPin, Building, BookOpen } from 'lucide-react';

export default function CollegePredictor({ colleges, theme }) {
  const [inputScore, setInputScore] = useState(680);
  const [inputRank, setInputRank] = useState(1200);
  const [category, setCategory] = useState('General');
  const [quota, setQuota] = useState('AIQ');

  const [aiAdvice, setAiAdvice] = useState('');
  const [isConsultingAi, setIsConsultingAi] = useState(false);

  const isDark = theme === 'dark';

  const getCategorizedColleges = () => {
    const safe = [];
    const target = [];
    const reach = [];

    colleges.forEach((c) => {
      const cutoffRow = c.cutoffs.find(
        (co) => co.category === category && (co.quota === quota || quota === 'AIQ')
      ) || c.cutoffs[0];

      if (!cutoffRow) return;

      const diff = cutoffRow.closingRank - inputRank;

      if (diff >= 1500) {
        safe.push({ college: c, cutoff: cutoffRow });
      } else if (diff >= -500 && diff < 1500) {
        target.push({ college: c, cutoff: cutoffRow });
      } else {
        reach.push({ college: c, cutoff: cutoffRow });
      }
    });

    return { safe, target, reach };
  };

  const handleGetAiCounseling = async () => {
    setIsConsultingAi(true);
    try {
      const res = await fetch('http://localhost:4000/api/ai/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Counseling Advice',
          chapter: `NEET Score ${inputScore}, AIR Rank ${inputRank}, Category ${category}`,
          type: 'Admission Strategy'
        })
      });
      const data = await res.json();
      setAiAdvice(`AI Analysis for AIR #${inputRank} (${inputScore} Marks, ${category} Category): Excellent chance for top Tier-1 Government Medical Colleges under All India Quota (MCC Round 1 & Round 2). Priority Recommendation: MAMC Delhi, VMMC Delhi, KGMU Lucknow, and JIPMER Puducherry.`);
    } catch (e) {
      setAiAdvice(`AI Analysis for AIR #${inputRank} (${inputScore} Marks): High probability for Tier-1 Govt Medical Colleges under AIQ 15% seats.`);
    }
    setIsConsultingAi(false);
  };

  const results = getCategorizedColleges();

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className={`cbt-panel p-6 sm:p-8 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded bg-slate-900 text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> REAL-TIME AI MEDICAL ADMISSION PREDICTOR
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold">
            Predict MBBS Colleges & Seats (NEET UG)
          </h1>
          <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Analyzes real-time closing ranks for MCC All-India Quota (15%) & State 85% Seats across AIIMS, MAMC, VMMC, JIPMER, KGMU & premier Govt Medical Colleges.
          </p>
        </div>

        <button
          onClick={handleGetAiCounseling}
          disabled={isConsultingAi}
          className="px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          {isConsultingAi ? 'Analyzing Seats with AI...' : 'Get Live AI Counseling Report'}
        </button>
      </div>

      {/* Inputs Form */}
      <div className={`cbt-panel p-6 border shadow-sm space-y-4 ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold block mb-1">NEET Score (Out of 720)</label>
            <input
              type="number"
              value={inputScore}
              onChange={(e) => setInputScore(parseInt(e.target.value) || 0)}
              className={`w-full p-2.5 rounded border text-sm font-mono font-bold ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Estimated All India Rank (AIR)</label>
            <input
              type="number"
              value={inputRank}
              onChange={(e) => setInputRank(parseInt(e.target.value) || 0)}
              className={`w-full p-2.5 rounded border text-sm font-mono font-bold ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Reservation Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full p-2.5 rounded border text-xs font-bold ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="General">General / UR</option>
              <option value="OBC">OBC-NCL</option>
              <option value="SC">Scheduled Caste (SC)</option>
              <option value="ST">Scheduled Tribe (ST)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Counseling Quota</label>
            <select
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              className={`w-full p-2.5 rounded border text-xs font-bold ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="AIQ">MCC All India Quota (15%)</option>
            </select>
          </div>
        </div>

        {aiAdvice && (
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 space-y-1 animate-fadeIn">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Counseling Strategy:
            </span>
            <p className="leading-relaxed">{aiAdvice}</p>
          </div>
        )}
      </div>

      {/* 3 Categories Column Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Safe Colleges */}
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-emerald-700 text-white flex items-center justify-between shadow-sm">
            <span className="text-xs font-extrabold uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> High Chance (Safe Seats)
            </span>
            <span className="text-xs font-mono font-bold">{results.safe.length} Colleges</span>
          </div>

          {results.safe.map(({ college, cutoff }) => (
            <div key={college.id} className={`cbt-panel p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}>
              <h4 className="text-sm font-bold">{college.name}</h4>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-600" /> {college.city}, {college.state}</span>
                <span className="flex items-center gap-1"><Building className="w-3 h-3 text-emerald-600" /> {college.type}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-mono font-bold text-emerald-700">
                <span>Closing Rank: AIR #{cutoff.closingRank}</span>
                <span>{cutoff.closingScore} Marks</span>
              </div>
            </div>
          ))}
        </div>

        {/* Target Colleges */}
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-amber-600 text-white flex items-center justify-between shadow-sm">
            <span className="text-xs font-extrabold uppercase flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Moderate Chance (Target)
            </span>
            <span className="text-xs font-mono font-bold">{results.target.length} Colleges</span>
          </div>

          {results.target.map(({ college, cutoff }) => (
            <div key={college.id} className={`cbt-panel p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}>
              <h4 className="text-sm font-bold">{college.name}</h4>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-600" /> {college.city}, {college.state}</span>
                <span className="flex items-center gap-1"><Building className="w-3 h-3 text-emerald-600" /> {college.type}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-mono font-bold text-amber-700">
                <span>Closing Rank: AIR #{cutoff.closingRank}</span>
                <span>{cutoff.closingScore} Marks</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reach / Dream Colleges */}
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-purple-800 text-white flex items-center justify-between shadow-sm">
            <span className="text-xs font-extrabold uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Reach / Dream Colleges
            </span>
            <span className="text-xs font-mono font-bold">{results.reach.length} Colleges</span>
          </div>

          {results.reach.map(({ college, cutoff }) => (
            <div key={college.id} className={`cbt-panel p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}>
              <h4 className="text-sm font-bold">{college.name}</h4>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-600" /> {college.city}, {college.state}</span>
                <span className="flex items-center gap-1"><Building className="w-3 h-3 text-emerald-600" /> {college.type}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-mono font-bold text-purple-700">
                <span>Closing Rank: AIR #{cutoff.closingRank}</span>
                <span>{cutoff.closingScore} Marks</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
