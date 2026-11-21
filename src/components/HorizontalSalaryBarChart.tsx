import React, { useMemo } from 'react';
import { Play, Pause, RotateCcw, TrendingUp, Sparkles, Award, Clock } from 'lucide-react';
import { FieldEarnings } from '../types';
import {
  COHORT_LABELS,
  POOLING_NOTE,
  STORY_SCOPE_LABEL,
  getStoryBeat,
  computeRankedSalaryRows,
  ProcessedSalaryRow,
} from '../utils/salaryConstants';

interface HorizontalSalaryBarChartProps {
  currentEarnings: Record<string, FieldEarnings>;
  allEarningsByYear?: Record<number, Record<string, FieldEarnings>>;
  nationalEarnings?: Record<string, FieldEarnings>;
  selectedYear: number;
  availableYears: number[];
  onSelectYear: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isSpecificInstitution?: boolean;
  selectedInstitutionName?: string;
  maxSalaryScale?: number;
  selectedNfq?: string;
}

export const HorizontalSalaryBarChart: React.FC<HorizontalSalaryBarChartProps> = ({
  currentEarnings,
  allEarningsByYear,
  nationalEarnings,
  selectedYear,
  availableYears,
  onSelectYear,
  isPlaying,
  onTogglePlay,
  isSpecificInstitution = false,
  selectedInstitutionName = 'All Institutions',
  maxSalaryScale = 75000,
  selectedNfq = 'level_8',
}) => {
  // Determine previous milestone year for calculating rank movements
  const curIdx = availableYears.indexOf(selectedYear);
  const prevYear = curIdx > 0 ? availableYears[curIdx - 1] : undefined;

  const previousEarnings =
    prevYear && allEarningsByYear ? allEarningsByYear[prevYear] : undefined;
  const year1Earnings = allEarningsByYear ? allEarningsByYear[1] : undefined;

  // Process rows and ranks
  const rows: ProcessedSalaryRow[] = useMemo(() => {
    return computeRankedSalaryRows(
      currentEarnings,
      previousEarnings,
      year1Earnings,
      maxSalaryScale
    );
  }, [currentEarnings, previousEarnings, year1Earnings, maxSalaryScale]);

  const isCurated = !isSpecificInstitution && selectedNfq === 'level_8';
  const baseStory = getStoryBeat(selectedYear, rows, isCurated);

  // Cohorts actually behind the figures on screen. For an institution these
  // come from the data (e.g. TU Dublin Year 5 = 2018 graduates only).
  const instCohorts = Array.from(
    new Set(Object.values(currentEarnings).flatMap((e) => (e && e.annualEquivalentEur > 0 ? e.cohorts || [] : [])))
  ).sort();
  const cohortText = !isSpecificInstitution
    ? COHORT_LABELS[selectedYear]
    : instCohorts.length === 0
    ? 'none published'
    : instCohorts.length === 1
    ? `${instCohorts[0]} grads`
    : `${instCohorts[0]}–${String(instCohorts[instCohorts.length - 1]).slice(2)} grads`;
  const story = { ...baseStory, cohortLabel: cohortText };
  const topEarningRow = rows[0];
  const isFinalYear = selectedYear === 10;
  const decadePct = Math.round((selectedYear / 10) * 100);

  // Ruler tick marks
  const ticks = [0, 20000, 40000, 60000, 80000];

  // Fixed row height in pixels for the animated translation
  const rowHeight = 54;
  const containerHeight = rows.length * rowHeight;

  return (
    <div className="space-y-4">
      {/* 1. High-Impact 10-Year Period Indicator & Story Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3.5">
        {/* Top Tag & 10-Year Period Context */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 text-[11px] font-bold tracking-wider text-cyan-400 uppercase bg-cyan-950/80 border border-cyan-800 px-3 py-1 rounded-full shadow-sm">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Years 1–10 after graduation</span>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              {isCurated ? `${STORY_SCOPE_LABEL} • ` : ''}Year {selectedYear}: {isSpecificInstitution ? `${selectedInstitutionName}, cohorts with published figures: ${cohortText}` : `pools the ${cohortText}`} (CSO, Revenue PAYE records)
            </span>
          </div>

          {/* Decade Completion Badge */}
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-mono-numbers font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                isFinalYear
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              {`${isFinalYear ? '★ ' : ''}Year ${selectedYear} of 10 • ${story.cohortLabel}`}
            </span>
          </div>
        </div>

        {/* Big Year Indicator & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Big Year Indicator */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div
                className={`px-4 py-2 rounded-2xl bg-gradient-to-br from-cyan-950/90 to-slate-900 border-2 shadow-lg flex flex-col items-center justify-center min-w-[138px] transition-all duration-700 ${
                  isFinalYear
                    ? 'border-amber-500/70 shadow-amber-500/20'
                    : 'border-cyan-500/50 shadow-cyan-500/10'
                }`}
              >
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  10-Yr Horizon
                </span>
                <span className="text-xl font-black text-white tracking-tight font-mono-numbers">
                  YEAR {selectedYear}
                </span>
                <span className="text-[10px] font-bold text-cyan-300 font-mono-numbers">
                  {story.cohortLabel}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase mt-0.5">
                  since graduation
                </span>
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full animate-ping opacity-75 ${
                  isFinalYear ? 'bg-amber-400' : 'bg-cyan-400'
                }`}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-black text-white tracking-wide">
                  {story.headline}
                </h4>
                <span className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-md font-semibold font-mono-numbers">
                  {story.yearOfTen}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                {story.detail}
              </p>
            </div>
          </div>

          {/* Right: Year Scrubber & Play Button */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            <button
              onClick={onTogglePlay}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition active:scale-95 ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Pause Race</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Play Years 1–10</span>
                </>
              )}
            </button>

            {/* Year Selector Pills with Calendar Years */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              {availableYears.map((yr) => {
                const isActive = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    onClick={() => onSelectYear(yr)}
                    title={isSpecificInstitution ? `Year ${yr}` : `Year ${yr}: ${COHORT_LABELS[yr]}`}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono-numbers transition flex flex-col items-center ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span>Y{yr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 10-Year Period Progress Horizon Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[11px] font-mono-numbers text-slate-500 mb-1">
            <span className="font-semibold text-slate-400 flex items-center space-x-1">
              <span>●</span>
              <span>Graduation</span>
            </span>
            <span className="font-bold text-cyan-400">
              Year {selectedYear} of 10 since graduation • {story.cohortLabel}
            </span>
            <span
              className={`font-semibold flex items-center space-x-1 transition-colors ${
                isFinalYear ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              <span>Year 10</span>
              <span>●</span>
            </span>
          </div>

          <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-full shadow-lg shadow-cyan-500/20"
              style={{ width: `${decadePct}%` }}
            />
          </div>

          {/* Milestone timeline points with calendar years */}
          <div className="flex justify-between text-[9px] font-mono-numbers text-slate-500 mt-1.5 px-0.5">
            {[1, 2, 3, 5, 8, 10].map((y) => (
              <span key={y} className={selectedYear === y ? (y === 10 ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold') : ''}>
                {isSpecificInstitution ? `Y${y}` : `Y${y} (${COHORT_LABELS[y]})`}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Bar Chart Race Container */}
      <div className="relative pt-2 pb-6">
        {/* Subtle Background Vertical Grid Guidelines */}
        <div className="absolute inset-0 pl-48 sm:pl-72 pr-28 sm:pr-32 pointer-events-none">
          <div className="relative w-full h-full">
            {ticks.map((val) => {
              const leftPct = (val / maxSalaryScale) * 100;
              return (
                <div
                  key={val}
                  className="absolute top-0 bottom-0 border-l border-slate-800/40 flex flex-col justify-between"
                  style={{ left: `${leftPct}%` }}
                >
                  <span className="text-[10px] text-slate-600 font-mono-numbers -translate-x-1/2">
                    €{val === 0 ? '0' : `${val / 1000}k`}
                  </span>
                  <span className="text-[9px] text-slate-700 font-mono-numbers -translate-x-1/2">
                    €{val === 0 ? '0' : `${val / 1000}k`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {rows.length === 0 && (
          <div className="relative z-10 py-10 text-center text-sm text-slate-400">
            The CSO has not published earnings for this selection at Year {selectedYear}.
          </div>
        )}

        {/* Absolutely-Positioned Animated Rows with Ultra-Smooth Hardware-Accelerated 1000ms Transition */}
        <div
          className="relative w-full"
          style={{ height: `${containerHeight}px` }}
        >
          {rows.map((row) => {
            const isTop3 = row.rankDisplay <= 3;
            const nat = nationalEarnings ? nationalEarnings[row.fieldId] : null;
            let diffPct: number | null = null;
            if (
              isSpecificInstitution &&
              nat &&
              nat.annualEquivalentEur > 0 &&
              row.annualEquivalentEur > 0
            ) {
              diffPct = Math.round(
                ((row.annualEquivalentEur - nat.annualEquivalentEur) /
                  nat.annualEquivalentEur) *
                  100
              );
            }

            return (
              <div
                key={row.fieldId}
                className="absolute left-0 right-0 h-[48px] flex items-center transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group"
                style={{
                  transform: `translateY(${row.rank * rowHeight}px)`,
                }}
              >
                {/* Left Label & Rank Pill */}
                <div className="w-48 sm:w-72 flex items-center space-x-2.5 pr-3 shrink-0">
                  {/* Rank Badge */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono-numbers shrink-0 shadow-sm transition-colors duration-500 ${
                      row.rankDisplay === 1
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-amber-500/20 ring-1 ring-amber-400/20'
                        : row.rankDisplay === 2
                        ? 'bg-slate-300/20 text-slate-200 border border-slate-400/50'
                        : row.rankDisplay === 3
                        ? 'bg-amber-700/20 text-amber-500 border border-amber-700/50'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    #{row.rankDisplay}
                  </div>

                  {/* Rank Shift Indicator */}
                  <div className="w-8 shrink-0 text-center font-mono-numbers text-[11px] font-bold">
                    {row.rankShift > 0 ? (
                      <span className="text-emerald-400 flex items-center justify-center">
                        ▲+{row.rankShift}
                      </span>
                    ) : row.rankShift < 0 ? (
                      <span className="text-rose-400 flex items-center justify-center">
                        ▼{Math.abs(row.rankShift)}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </div>

                  {/* Field Dot & Name */}
                  <div className="flex items-center space-x-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: row.config.color }}
                    />
                    <span
                      className={`text-xs font-semibold truncate transition-colors duration-500 ${
                        isTop3 ? 'text-white font-bold' : 'text-slate-300'
                      }`}
                      title={row.fieldName}
                    >
                      {row.fieldName}
                    </span>
                  </div>
                </div>

                {/* Horizontal Bar Track */}
                <div className="flex-1 relative h-7 bg-slate-950/70 border border-slate-800/80 rounded-xl overflow-hidden flex items-center">
                  {/* Ultra-Smooth Animated Bar Fill */}
                  <div
                    className={`h-full rounded-lg transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width] relative flex items-center bg-gradient-to-r ${row.config.gradient} shadow-md`}
                    style={{
                      width: `${row.barWidthPct}%`,
                    }}
                  >
                    {/* Glowing Right Cap */}
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/70 shadow-[0_0_8px_#ffffff]" />
                  </div>

                  {/* Salary Value Inside Track */}
                  <div className="absolute left-3 z-10 flex items-center space-x-2 pointer-events-none drop-shadow">
                    <span className="text-xs font-black text-white font-mono-numbers">
                      €{row.annualEquivalentEur.toLocaleString()}
                      <span className="text-[10px] font-normal text-slate-300">
                        /yr
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-300/80 font-mono-numbers hidden sm:inline-block">
                      (€{row.weeklyMedianEur.toLocaleString()}/wk)
                    </span>
                  </div>
                </div>

                {/* Right Growth & Comparison Badge */}
                <div className="w-28 sm:w-32 pl-3 flex items-center justify-end shrink-0">
                  {isSpecificInstitution && diffPct !== null ? (
                    <span
                      className={`text-[11px] font-mono-numbers font-semibold px-2 py-0.5 rounded-md border ${
                        diffPct > 0
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : diffPct < 0
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {diffPct > 0 ? `+${diffPct}%` : `${diffPct}%`} vs nat.
                    </span>
                  ) : (
                    <span
                      className={`text-[11px] font-mono-numbers font-semibold px-2 py-0.5 rounded-md border transition-colors duration-500 ${
                        row.growthFromY1Pct > 100
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                      }`}
                      title={`Total salary growth since Year 1 (+€${row.growthFromY1Eur.toLocaleString()})`}
                    >
                      +{row.growthFromY1Pct}% vs Y1
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Summary Ticker */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            {story.notableChange}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 max-w-md">{POOLING_NOTE}</p>
        <div className="flex items-center space-x-3 text-[11px] text-slate-500">
          {topEarningRow ? (
            <span>
              Top: <strong className="text-emerald-400">{topEarningRow.fieldName}</strong> (€{topEarningRow.annualEquivalentEur.toLocaleString()}/yr)
            </span>
          ) : (
            <span>No published figures for this selection</span>
          )}
          <span>•</span>
          <span>
            {isSpecificInstitution
              ? '"vs nat." = national median for the same cohorts'
              : 'Growth vs Year 1 compares different cohorts'}
          </span>
        </div>
      </div>
    </div>
  );
};
