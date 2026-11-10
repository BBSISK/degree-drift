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
                    Maintains the record of every student graduating from Irish higher education: exact field of study, NFQ level (7, 8, 9, 10), higher education institution, and graduation year.
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
                <h4 className="text-sm font-bold text-white">Why This Flow Is Exact (Not an Estimate)</h4>
                <p>
                  By joining these two databases on pseudo-anonymized PPSNs (Protected Identifier Keys), the CSO produced <strong>Table HEO08</strong>. 
                </p>
                <p>
                  Every cell in HEO08 is a multi-dimensional cross-tabulation of:
                  <code className="block my-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-mono">
                    (Graduation Cohort, NACE Sector, Field of Study, NFQ Level, Years Since Graduation)
                  </code>
                  The value in that cell represents the <strong>literal headcount</strong> of graduates from that field who are registered employees in that specific NACE sector.
                </p>
                <p>
                  Our Sankey visualization directly queries this joint distribution. There is <strong>no probabilistic guessing or synthetic imputation</strong>; every ribbon represents verified administrative tax and graduation data.
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
                  Why did the CSO not release a single table combining all 33 Higher Education Institutions, 11 fields, 14 economic sectors, 6 NFQ levels, and 10 graduation years?
                </p>
                <p>
                  Under <strong>Section 33 of the Statistics Act 1993</strong>, strict statistical disclosure control applies: any cell with fewer than 10 individuals must be suppressed to prevent personal re-identification. In a single 6-dimensional table, hundreds of cells would hold only 1 or 2 graduates.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white">The Dual-Layer Architecture</h4>
                <p>
                  To maximize statistical depth while adhering to disclosure limits, the CSO releases two complementary, harmonized cubes:
                </p>
                <div className="space-y-2 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-indigo-400 block mb-0.5">Macroeconomic Flow Layer (CSO Table HEO08 & HEO09)</strong>
                    <span className="text-slate-400 text-[11px]">
                      Captures the complete national sector destination flow across fields of study and types of institutes (Universities vs. Technological Universities / IoTs).
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-400 block mb-0.5">Institutional Outcomes & Earnings Layer (CSO Table HEO14 & HEO16)</strong>
                    <span className="text-slate-400 text-[11px]">
                      Tracks verified Revenue PAYE median earnings and graduation counts by specific higher education institution (e.g. Maynooth University, Trinity, UCD, TU Dublin, MTU, ATU) across 1 to 10 years post-graduation.
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 pt-1">
                  When you select an institution in the dashboard dropdown, the salary trajectories and variance indicators dynamically switch from the national baseline to that institution's verified Revenue data.
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
                  Under statutory obligations in the Statistics Act 1993, the CSO applies statistical disclosure control prior to open-data release. Any micro-cohort with fewer than 10 individuals is statistically suppressed to prevent personal re-identification.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white">Formal Academic Citation</h4>
                <p className="text-slate-400">
                  You can cite this dataset in college documentation, dissertations, or project bibliographies as follows:
                </p>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 select-all leading-normal">
                  Central Statistics Office (CSO) Ireland. (2024). <em>Higher Education Outcomes: Graduate Sector of Employment (Table HEO08), National Graduate Earnings (Table HEO12), and Institutional Graduate Outcomes & Earnings (Tables HEO14 & HEO16)</em>. data.cso.ie. Licensed under CC BY 4.0.
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
