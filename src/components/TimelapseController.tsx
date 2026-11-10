import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Maximize2, Minimize2 } from 'lucide-react';

interface TimelapseControllerProps {
  currentYear: number;
  availableYears: number[];
  onSelectYear: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  isCinemaMode: boolean;
  onToggleCinema: () => void;
}

export const TimelapseController: React.FC<TimelapseControllerProps> = ({
  currentYear,
  availableYears,
  onSelectYear,
  isPlaying,
  onTogglePlay,
  onReset,
  isCinemaMode,
  onToggleCinema,
}) => {
  const currentIndex = availableYears.indexOf(currentYear);
  const progressPct = ((currentIndex + 1) / availableYears.length) * 100;

  // Story beats for each year in the 10-year migration
  const storyBeats: Record<number, { tag: string; headline: string; detail: string; color: string }> = {
    1: {
      tag: 'Year 1: The Landing Pad',
      headline: 'Early Employment & Retail Absorption',
      detail: '27% of Arts and 16% of Business graduates land in retail/hospitality while testing graduate schemes and postgraduate options.',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40',
    },
    2: {
      tag: 'Year 2: First Corporate Shift',
      headline: 'Migration to Professional Services',
      detail: 'Retail employment drops by a third as graduates secure formal graduate contracts in Finance, Consulting, and Public Administration.',
      color: 'from-indigo-500/20 to-blue-500/20 text-indigo-300 border-indigo-500/40',
    },
    3: {
      tag: 'Year 3: Postgrad Re-Entry',
      headline: 'Teaching & Civil Service Surge',
      detail: 'Education absorbs over 25% of Arts/Humanities graduates as PME teaching qualifications complete. Tech hiring widens across non-CS fields.',
      color: 'from-cyan-500/20 to-teal-500/20 text-cyan-300 border-cyan-500/40',
    },
    5: {
      tag: 'Year 5: The Mid-Career Inflow Peak',
      headline: 'The Tech & Industry Consolidation',
      detail: 'Inflow Paradox peaks: Business (27%) and Arts (23%) outnumber pure ICT majors in the Irish Tech sector as sales, policy, and product mature.',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40',
    },
    8: {
      tag: 'Year 8: Seniority & Sector Drift',
      headline: 'Leadership & Fintech Migration',
      detail: 'Engineers and ICT specialists increasingly drift into Financial Services and multinational senior management.',
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/40',
    },
    10: {
      tag: 'Year 10: The Decade Horizon',
      headline: 'Salary Compounding & Settled Fields',
      detail: 'Retail presence disappears from top 5 sectors; ICT median reaches €70,200/yr. Career stickiness stabilizes across the entire economy.',
      color: 'from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/40',
    },
  };

  const currentBeat = storyBeats[currentYear] || storyBeats[5];

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-4">
      {/* Top Controller Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Play / Pause / Reset Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onTogglePlay}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all active:scale-95 ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30'
                : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-cyan-500/25 ring-2 ring-cyan-400/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause Timelapse</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Play 10-Year Migration</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            title="Reset to Year 1"
            className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Cinema recording mode toggle */}
          <button
            onClick={onToggleCinema}
            title={isCinemaMode ? 'Exit LinkedIn Capture Mode' : 'Enter LinkedIn Capture Mode (Full Focus)'}
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-2xl border text-xs font-semibold transition ${
              isCinemaMode
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {isCinemaMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isCinemaMode ? 'Exit Focus' : 'LinkedIn Capture View'}</span>
          </button>
        </div>

        {/* Year Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {availableYears.map((yr, idx) => {
            const isCurrent = currentYear === yr;
            const isPast = availableYears.indexOf(currentYear) >= idx;

            return (
              <button
                key={yr}
                onClick={() => onSelectYear(yr)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold font-mono-numbers transition-all ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 scale-105 ring-2 ring-cyan-400/50'
                    : isPast
                    ? 'bg-slate-950 border border-cyan-800/60 text-cyan-300'
                    : 'bg-slate-950 border border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                Y{yr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrubber Progress Bar */}
      <div className="relative w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full shadow-lg shadow-cyan-400/50"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Story beat banner for the active year */}
      <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentBeat.color} border transition-all duration-500 animate-fadeIn`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider font-mono-numbers">
            {currentBeat.tag}
          </span>
          <span className="text-xs font-bold text-white">
            {currentBeat.headline}
          </span>
        </div>
        <p className="text-xs text-slate-200/90 leading-relaxed font-normal">
          {currentBeat.detail}
        </p>
      </div>
    </div>
  );
};
