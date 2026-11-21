import React, { useState } from 'react';
import { X, ShieldCheck, Scale, FileText, CheckCircle2, ExternalLink, BookOpen, Building2 } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'methodology' | 'institutions' | 'licensing'>('methodology');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Data Provenance, Methodology & Institutional Layering
            </h3>
            <p className="text-xs text-slate-400">
              Technical, statistical, and legal documentation for academic assessment
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('methodology')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'methodology'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Linkage Methodology</span>
          </button>
          <button
            onClick={() => setActiveTab('institutions')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'institutions'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>2. Institutional Layering</span>
          </button>
          <button
            onClick={() => setActiveTab('licensing')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'licensing'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>3. Copyright & GDPR</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="overflow-y-auto pr-2 space-y-4 text-xs text-slate-300 leading-relaxed flex-1">
          {activeTab === 'methodology' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>The Statutory Administrative Linkage</span>
                </h4>
                <p>
                  A common question in data visualization is: <em>"How can you know graduate career flows without individual-level tracking data?"</em>
                </p>
                <p>
                  The answer is that the <strong>Central Statistics Office (CSO) conducted the individual linkage directly</strong> under the legal powers of the <strong>Statistics Act 1993</strong> before publishing the aggregate tables.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Source Database 1</span>
                  <h5 className="font-bold text-white text-xs">HEA Student Records System (SRS)</h5>
                  <p className="text-slate-400 text-[11px]">
                    Holds the record of every student graduating from Irish higher education: field of study, NFQ level (6 to 10), higher education institution and graduation year.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Source Database 2</span>
                  <h5 className="font-bold text-white text-xs">Revenue Commissioners PAYE / P35</h5>
                  <p className="text-slate-400 text-[11px]">
                    Employer payroll tax returns. Every registered employer in Ireland is categorized by an official <strong>NACE economic activity code</strong> (e.g. J = Tech, M = Professional/Scientific).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white">What Each Flow Means</h4>
                <p>
                  By joining these two databases on pseudo-anonymized PPSNs (Protected Identifier Keys), the CSO produced <strong>Table HEO08</strong>. 
                </p>
                <p>
                  Every cell in HEO08 is a multi-dimensional cross-tabulation of:
                  <code className="block my-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-mono">
                    (Graduation Cohort, NACE Sector, Field of Study, NFQ Level, Years Since Graduation)
                  </code>
                  Each cell is a headcount, rounded by the CSO to the nearest 10, of graduates from that field employed in that NACE sector. It covers <strong>young graduates in substantial employment in Ireland</strong>; graduates working abroad are not included.
                </p>
                <p>
                  The Sankey shows this distribution with no modelling or imputation. Each "years since graduation" view <strong>pools every graduating cohort the CSO has published for that horizon</strong>: Year 1 covers 2010–2022 graduates, Year 5 covers 2010–2018, and Year 10 only 2010–2013 (latest data: 2023). Year 1 and Year 10 are therefore not the same graduates. Ribbon counts are summed across those cohorts; percentages are shares within each field or sector.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'institutions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>How Institutions Are Layered (Statistical Disclosure Control)</span>
                </h4>
                <p>
                  The CSO does not publish one table combining institution, field, sector, NFQ level and years since graduation.
                </p>
                <p>
                  Under the <strong>Statistics Act 1993</strong>, the CSO must protect confidentiality, so it applies statistical disclosure control: small cells are suppressed and counts are rounded. A single table with every dimension would be mostly small cells.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white">The Dual-Layer Architecture</h4>
                <p>
                  Instead, the dashboard combines separate CSO tables from the same linkage:
                </p>
                <div className="space-y-2 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-indigo-400 block mb-0.5">Macroeconomic Flow Layer (CSO Table HEO08)</strong>
                    <span className="text-slate-400 text-[11px]">
                      National sector of employment by field of study, NFQ level and years since graduation. It has no institution breakdown.
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-400 block mb-0.5">Institutional Earnings Layer (CSO Table HEO16)</strong>
                    <span className="text-slate-400 text-[11px]">
                      Median earnings by institution, field, NFQ level and years since graduation. Newer technological universities only appear from their founding cohorts (e.g. TU Dublin from 2018; MTU from 2020; ATU, TUS and SETU from 2021), so they have no Year 10 figures yet.
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 pt-1">
                  When you select an institution, the earnings chart shows that institution's published figures only. Fields the CSO did not publish are left out, never filled in from the national figure. The "vs nat." comparison uses the national median for the <strong>same graduating cohorts</strong>, so cohort timing and wage inflation don't distort it.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'licensing' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Open Data Licensing (CC BY 4.0)</span>
                </h4>
                <p>
                  All data used in this project is officially published by the Government of Ireland and the Central Statistics Office under the <strong>Creative Commons Attribution 4.0 International (CC BY 4.0)</strong> license and the European Union Public Sector Information (PSI) Directive.
                </p>
                <p>
                  Under CC BY 4.0, users are legally authorized to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                  <li><strong>Share</strong>: Copy and redistribute the material in any medium or format.</li>
                  <li><strong>Adapt</strong>: Remix, transform, and build upon the material for academic, portfolio, or public showcase purposes.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white">GDPR & Data Protection Compliance</h4>
                <p>
                  This application processes <strong>zero Personally Identifiable Information (PII)</strong>.
                </p>
                <p>
                  Under the Statistics Act 1993, the CSO applies statistical disclosure control (suppression and rounding) before publishing open data, so no individual can be identified.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white">Formal Academic Citation</h4>
                <p className="text-slate-400">
                  You can cite this dataset in college documentation, dissertations, or project bibliographies as follows:
                </p>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 select-all leading-normal">
                  Central Statistics Office (CSO) Ireland. <em>Higher Education Outcomes: Graduate Sector of Employment (Table HEO08), National Graduate Earnings (Table HEO12), and Graduate Earnings by Higher Education Institution (Table HEO16)</em>. data.cso.ie, accessed November 2026. Licensed under CC BY 4.0.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Verified compliant for college portfolio & public showcase</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
