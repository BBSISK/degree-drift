import React from 'react';
import { GraduationCap, Share2, Filter, Clock, BookOpen, Building2 } from 'lucide-react';
import { NfqKey } from '../types';

interface HeaderProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
  selectedNfq: NfqKey;
  onSelectNfq: (key: NfqKey) => void;
  selectedInstitution: string;
  onSelectInstitution: (inst: string) => void;
  institutions: Record<string, string>;
  onOpenShare: () => void;
  onOpenMethodology: () => void;
  availableYears: number[];
}

export const Header: React.FC<HeaderProps> = ({
  selectedYear,
  onSelectYear,
  selectedNfq,
  onSelectNfq,
  selectedInstitution,
  onSelectInstitution,
  institutions,
  onOpenShare,
  onOpenMethodology,
  availableYears,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Metadata */}
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-slate-950 font-bold shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Degree Drift
              <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                CSO Administrative Data
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            10-year longitudinal analysis tracking Irish university graduates from lecture hall to actual economic sectors, linked directly with Revenue tax data.
          </p>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Institution Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-2.5 py-1 shadow-inner">
            <Building2 className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
            <select
              value={selectedInstitution}
              onChange={(e) => onSelectInstitution(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer py-1"
            >
              {Object.entries(institutions).map(([code, name]) => (
                <option key={code} value={code} className="bg-slate-900 text-white">
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* NFQ Level Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-inner">
            <span className="text-[11px] font-semibold text-slate-500 px-2 flex items-center space-x-1">
              <Filter className="w-3 h-3" />
              <span>Degree:</span>
            </span>
            <button
              onClick={() => onSelectNfq('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                selectedNfq === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => onSelectNfq('level_8')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                selectedNfq === 'level_8'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Level 8 (Honours)
            </button>
            <button
              onClick={() => onSelectNfq('level_9')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                selectedNfq === 'level_9'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Level 9 (Masters)
            </button>
          </div>

          {/* Methodology & Licensing Trigger */}
          <button
            onClick={onOpenMethodology}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-semibold text-xs transition active:scale-95"
            title="Read data methodology, individual linkage & CC BY 4.0 license"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Methodology & License</span>
          </button>

          {/* Share on LinkedIn / Export Button */}
          <button
            onClick={onOpenShare}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-indigo-500/20 active:scale-95 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share / LinkedIn</span>
          </button>
        </div>
      </div>

      {/* 10-Year Timeline Slider Bar */}
      <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Timeline Horizon:</span>
          <span className="text-cyan-400 font-mono-numbers font-extrabold text-sm">
            Year {selectedYear} After Graduation
          </span>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => onSelectYear(yr)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono-numbers transition-all ${
                selectedYear === yr
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Year {yr}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
