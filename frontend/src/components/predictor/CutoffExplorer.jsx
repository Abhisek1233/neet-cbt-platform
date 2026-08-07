import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

export default function CutoffExplorer({ colleges }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const filteredColleges = colleges.filter((c) => {
    const matchesType = selectedType === 'All' || c.type === selectedType;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-white">NEET Medical College Cutoff Explorer</h2>
          <p className="text-xs text-slate-400 mt-1">
            Searchable 3-year closing ranks, total seats, fees, and NIRF rankings across top Govt & Deemed universities.
          </p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by college name, city, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
        >
          <option value="All">All Institution Types</option>
          <option value="Govt">Government Colleges</option>
          <option value="Deemed">Deemed Universities</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredColleges.map((c) => (
          <div key={c.id} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  c.type === 'Govt' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'
                }`}>
                  {c.type} Medical College
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  NIRF Rank #{c.nirfRank}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{c.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {c.city}, {c.state} | Est. {c.established}
              </p>

              <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs font-mono">
                <div>
                  <p className="text-[10px] text-slate-400">MBBS Seats</p>
                  <p className="font-bold text-white">{c.totalSeats}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Annual Fee</p>
                  <p className="font-bold text-cyan-300">{c.annualFee}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Beds</p>
                  <p className="font-bold text-emerald-400">{c.hospitalBeds}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
