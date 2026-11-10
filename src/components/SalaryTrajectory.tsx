import React from 'react';
import { Banknote, Building2, TrendingUp } from 'lucide-react';
import { FieldEarnings } from '../types';

interface SalaryTrajectoryProps {
  earnings: Record<string, FieldEarnings>;
  nationalEarnings?: Record<string, FieldEarnings>;
  selectedInstitutionName?: string;
  isSpecificInstitution: boolean;
  selectedYear: number;
}

export const SalaryTrajectory: React.FC<SalaryTrajectoryProps> = ({
  earnings,
  nationalEarnings,
  selectedInstitutionName,
  isSpecificInstitution,
  selectedYear,
}) => {
  const sortedEarnings = Object.values(earnings)
    .filter(e => e.annualEquivalentEur > 0)
    .sort((a, b) => b.annualEquivalentEur - a.annualEquivalentEur);

  const highestEarning = sortedEarnings[0];

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {isSpecificInstitution ? `${selectedInstitutionName} — Median Earnings` : 'National Median Earnings by Field'}
              </h4>
              {isSpecificInstitution && (
                <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded-full font-semibold">
                  CSO Table HEO16
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {isSpecificInstitution
                ? `Tracking verified Revenue PAYE earnings for ${selectedInstitutionName} graduates at Year ${selectedYear}`
                : `Source: CSO HEO12 & HEO16 linked Revenue tax records (P50 median weekly earnings × 52 at Year ${selectedYear})`}
            </p>
          </div>
        </div>

        {highestEarning && (
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Top Earning Field</span>
            <div className="text-xs font-bold text-emerald-400">
              {highestEarning.fieldName}: €{highestEarning.annualEquivalentEur.toLocaleString()}/yr
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {sortedEarnings.map((item, idx) => {
          const nat = nationalEarnings ? nationalEarnings[item.fieldId] : null;
          let diffPct: number | null = null;
          if (isSpecificInstitution && nat && nat.annualEquivalentEur > 0 && item.annualEquivalentEur > 0) {
            diffPct = Math.round(((item.annualEquivalentEur - nat.annualEquivalentEur) / nat.annualEquivalentEur) * 100);
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
                      diffPct > 0 ? 'text-emerald-400' : diffPct < 0 ? 'text-rose-400' : 'text-slate-400'
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
  );
};
