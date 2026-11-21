import React, { useState } from 'react';
import {
  Banknote,
  Building2,
  TrendingUp,
  BarChart3,
  LayoutGrid,
  Share2,
  Sparkles,
} from 'lucide-react';
import { FieldEarnings } from '../types';
import { HorizontalSalaryBarChart } from './HorizontalSalaryBarChart';
import { LinkedInGraphicModal } from './LinkedInGraphicModal';

interface SalaryTrajectoryProps {
  earnings: Record<string, FieldEarnings>;
  nationalEarnings?: Record<string, FieldEarnings>;
  allEarningsByYear?: Record<number, Record<string, FieldEarnings>>;
  selectedInstitutionName?: string;
  isSpecificInstitution: boolean;
  selectedYear: number;
  onSelectYear?: (year: number) => void;
  availableYears?: number[];
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  selectedNfq?: string;
}

export const SalaryTrajectory: React.FC<SalaryTrajectoryProps> = ({
  earnings,
  nationalEarnings,
  allEarningsByYear,
  selectedInstitutionName,
  isSpecificInstitution,
  selectedYear,
  onSelectYear,
  availableYears = [1, 2, 3, 5, 8, 10],
  isPlaying = false,
  onTogglePlay,
  selectedNfq = 'level_8',
}) => {
  const [viewMode, setViewMode] = useState<'bars' | 'cards'>('bars');
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);

  // Fallback for allEarningsByYear if not passed
  const resolvedAllEarnings = allEarningsByYear || {
    [selectedYear]: earnings,
  };

  const sortedEarnings = Object.values(earnings)
    .filter((e) => e && e.annualEquivalentEur > 0)
    .sort((a, b) => b.annualEquivalentEur - a.annualEquivalentEur);

  const highestEarning = sortedEarnings[0];

  const nfqLabelMap: Record<string, string> = {
    all: 'All NFQ Levels Combined',
    level_8: 'Level 8 (Honours Bachelor)',
    level_9: 'Level 9 (Masters / Postgraduate)',
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Top Header & View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-5 pb-4 border-b border-slate-800 gap-4">
        {/* Left: Title & Methodology Tag */}
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 shadow-sm shadow-emerald-500/10">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                {isSpecificInstitution
                  ? `${selectedInstitutionName} — Median Earnings`
                  : 'National Median Earnings by Field (2015 → 2025 Horizon)'}
              </h4>
              {isSpecificInstitution && (
                <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded-full font-semibold">
                  CSO Table HEO16
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isSpecificInstitution
                ? `Tracking verified Revenue PAYE earnings for ${selectedInstitutionName} graduates at Year ${selectedYear}`
                : `Source: CSO HEO12 & HEO16 linked Revenue tax records (2015 cohort tracked through 2016–2025)`}
            </p>
          </div>
        </div>

        {/* Right: Controls & Switchers */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          {/* Top Earning Field Callout */}
          {highestEarning && (
            <div className="hidden sm:block text-right pr-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                #1 Top Earning Field
              </span>
              <div className="text-xs font-bold text-emerald-400">
                {highestEarning.fieldName}: €{highestEarning.annualEquivalentEur.toLocaleString()}/yr
              </div>
            </div>
          )}

          {/* View Mode Toggle: Bar Chart Race vs Card Grid */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1 shadow-inner">
            <button
              onClick={() => setViewMode('bars')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                viewMode === 'bars'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Horizontal Bar Chart with animated position swapping"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bar Chart Race</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                viewMode === 'cards'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid Overview"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Card Grid</span>
            </button>
          </div>

          {/* LinkedIn Graphic Studio Export Button */}
          <button
            onClick={() => setIsLinkedInModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition active:scale-95"
            title="Export high-resolution graphic, carousel slides or video for LinkedIn"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-950" />
            <span>LinkedIn Graphic</span>
          </button>
        </div>
      </div>

      {/* Main Content: Bar Chart Race OR Card Grid */}
      {viewMode === 'bars' ? (
        <HorizontalSalaryBarChart
          currentEarnings={earnings}
          allEarningsByYear={resolvedAllEarnings}
          nationalEarnings={nationalEarnings}
          selectedYear={selectedYear}
          availableYears={availableYears}
          onSelectYear={onSelectYear || (() => {})}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay || (() => {})}
          isSpecificInstitution={isSpecificInstitution}
          selectedInstitutionName={selectedInstitutionName}
          maxSalaryScale={75000}
        />
      ) : (
        /* The Original 10-Card Grid View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {sortedEarnings.map((item, idx) => {
              const nat = nationalEarnings ? nationalEarnings[item.fieldId] : null;
              let diffPct: number | null = null;
              if (
                isSpecificInstitution &&
                nat &&
                nat.annualEquivalentEur > 0 &&
                item.annualEquivalentEur > 0
              ) {
                diffPct = Math.round(
                  ((item.annualEquivalentEur - nat.annualEquivalentEur) /
                    nat.annualEquivalentEur) *
                    100
                );
              }

              return (
                <div
                  key={item.fieldId}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="truncate pr-1">{item.fieldName}</span>
                    <span className="font-mono-numbers text-slate-500">#{idx + 1}</span>
                  </div>
                  <div className="text-lg font-black text-white font-mono-numbers">
                    €{item.annualEquivalentEur.toLocaleString()}
                    <span className="text-xs text-slate-400 font-normal">/yr</span>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-mono-numbers">
                    <span>€{item.weeklyMedianEur.toLocaleString()}/wk</span>
                    {diffPct !== null && (
                      <span
                        className={`font-semibold ${
                          diffPct > 0
                            ? 'text-emerald-400'
                            : diffPct < 0
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {diffPct > 0 ? `+${diffPct}%` : `${diffPct}%`} vs nat.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LinkedIn Graphic Studio Export Modal */}
      <LinkedInGraphicModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        allEarningsByYear={resolvedAllEarnings}
        availableYears={availableYears}
        initialYear={selectedYear}
        nfqLabel={nfqLabelMap[selectedNfq] || 'Level 8 (Honours Bachelor)'}
        institutionName={
          isSpecificInstitution
            ? selectedInstitutionName || 'Institution'
            : 'National (All Institutions)'
        }
      />
    </div>
  );
};
