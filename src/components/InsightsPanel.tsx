import React from 'react';
import { Sparkles, TrendingUp, Compass, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { TimelineData, FlowItem } from '../types';

interface InsightsPanelProps {
  timeline: TimelineData;
  selectedSourceId: string | null;
  selectedTargetId: string | null;
  onClearSelection: () => void;
  selectedYear: number;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  timeline,
  selectedSourceId,
  selectedTargetId,
  onClearSelection,
  selectedYear,
}) => {
  // If a source field is selected (Outflow)
  const selectedSourceFlows = selectedSourceId
    ? timeline.flows.filter((f) => f.sourceId === selectedSourceId)
    : [];
  const selectedSourceName = selectedSourceFlows[0]?.sourceName;

  // If a target sector is selected (Inflow)
  const selectedTargetFlows = selectedTargetId
    ? timeline.flows.filter((f) => f.targetId === selectedTargetId)
    : [];
  const selectedTargetName = selectedTargetFlows[0]?.targetName;

  // Calculate field stickiness (who stays in their direct counterpart sector)
  // E.g. Education -> Education & Teaching, ICT -> Info & Comm, Health -> Health
  const fieldDirectMap: Record<string, string> = {
    '01': 'P', // Education -> Education
    '02': 'Y7500', // Arts -> Arts/Culture
    '04': 'Y3500', // Business -> Finance/Real Estate
    '06': 'J', // ICT -> Tech
    '07': 'Y0900', // Engineering -> Industry/Manufacturing
    '09': 'Q', // Health -> Health
    '08': 'A', // Agriculture -> Agriculture
  };

  const stickinessRankings = Object.entries(fieldDirectMap).map(([fCode, sCode]) => {
    const directFlow = timeline.flows.find(f => f.sourceId === fCode && f.targetId === sCode);
    const fTotal = timeline.fieldTotals[fCode] || 1;
    const count = directFlow ? directFlow.count : 0;
    const pct = Math.round((count / fTotal) * 100);
    return {
      fieldId: fCode,
      fieldName: directFlow?.sourceName || fCode,
      directSectorName: directFlow?.targetName || sCode,
      percentDirect: pct,
      count,
    };
  }).sort((a, b) => b.percentDirect - a.percentDirect);

  return (
    <div className="space-y-6">
      {/* Selected Inspection Card */}
      {(selectedSourceId || selectedTargetId) && (
        <div className="rounded-3xl bg-slate-900 border border-cyan-500/50 p-6 shadow-2xl relative animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {selectedSourceId && selectedTargetId
                  ? 'Isolated Flow'
                  : selectedSourceId
                  ? `Outflow Analysis: ${selectedSourceName}`
                  : `Inflow Analysis: ${selectedTargetName}`}
              </h3>
            </div>
            <button
              onClick={onClearSelection}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Reset view
            </button>
          </div>

          {/* If Target Sector is selected (e.g. Who feeds into Tech?) */}
          {selectedTargetId && (
            <div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Breakdown of graduate degree backgrounds working in{' '}
                <strong className="text-cyan-400 font-bold">{selectedTargetName}</strong> at Year {selectedYear}:
              </p>
              <div className="space-y-2">
                {selectedTargetFlows.slice(0, 6).map((flow, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/70 border border-slate-800"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono-numbers text-slate-500 text-[10px]">#{i + 1}</span>
                      <span className="font-semibold text-slate-200">{flow.sourceName}</span>
                    </div>
                    <div className="flex items-center space-x-3 font-mono-numbers">
                      <span className="text-slate-400">{flow.count.toLocaleString()} grads</span>
                      <strong className="text-cyan-400 text-sm">{flow.percentOfSector}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If Source Field is selected (e.g. Where do Arts grads go?) */}
          {selectedSourceId && !selectedTargetId && (
            <div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Where graduates of <strong className="text-indigo-400 font-bold">{selectedSourceName}</strong> are employed at Year {selectedYear}:
              </p>
              <div className="space-y-2">
                {selectedSourceFlows.slice(0, 6).map((flow, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/70 border border-slate-800"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono-numbers text-slate-500 text-[10px]">#{i + 1}</span>
                      <span className="font-semibold text-slate-200">{flow.targetName}</span>
                    </div>
                    <div className="flex items-center space-x-3 font-mono-numbers">
                      <span className="text-slate-400">{flow.count.toLocaleString()} grads</span>
                      <strong className="text-indigo-400 text-sm">{flow.percentOfField}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Standout Finding of this Year */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Key Pattern at Year {selectedYear}</span>
        </div>
        {selectedYear === 1 && (
          <p className="text-sm text-slate-200 leading-relaxed">
            In Year 1, over <strong className="text-white">27%</strong> of Arts & Humanities graduates and <strong className="text-white">15.7%</strong> of Business graduates are working in Retail and Hospitality while transitioning into postgraduate study or corporate entry points.
          </p>
        )}
        {selectedYear >= 2 && selectedYear <= 3 && (
          <p className="text-sm text-slate-200 leading-relaxed">
            By Years 2–3, the "retail landing pad" drops sharply as graduates migrate into Professional Services, Public Administration, and Tech. Teaching absorbs nearly a third of Arts graduates.
          </p>
        )}
        {selectedYear === 5 && (
          <p className="text-sm text-slate-200 leading-relaxed">
            At Year 5, more employees in the Irish Tech sector hold <strong className="text-white">Business degrees (26.9%)</strong> and <strong className="text-white">Arts & Humanities degrees (22.6%)</strong> than pure ICT computer science degrees (24.4%), reflecting Dublin’s high volume of tech operations, policy, and business development roles.
          </p>
        )}
        {selectedYear >= 8 && (
          <p className="text-sm text-slate-200 leading-relaxed">
            At Year 8–10, ICT and Engineering graduates show the highest salary compound rates, with median ICT earnings reaching <strong className="text-emerald-400">€70,200/year</strong>, and 9% drifting into Banking & Financial Services.
          </p>
        )}
      </div>

      {/* Degree "Field Stickiness" Table */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Field "Stickiness" Index (Year {selectedYear})
            </h4>
          </div>
          <span className="text-[10px] text-slate-500">% in core sector</span>
        </div>

        <div className="space-y-3">
          {stickinessRankings.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">{item.fieldName}</span>
                <span className="font-mono-numbers font-bold text-slate-300">
                  {item.percentDirect}%{' '}
                  <span className="text-[10px] text-slate-500 font-normal">in {item.directSectorName}</span>
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, item.percentDirect)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
