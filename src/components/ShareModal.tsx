import React, { useState } from 'react';
import { X, Copy, Check, Share2, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedYear: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, selectedYear }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const linkedInPostText = `Where do Irish university graduates actually end up 5 to 10 years after college?

Most people assume their college major locks them into one industry. I dug into the Central Statistics Office (CSO) open data (HEO08 & HEO12)—which uniquely links university graduation records directly with Revenue tax data—and built an interactive 10-year longitudinal dashboard: "Degree Drift".

A few striking takeaways:
1. The Tech Inflow Paradox: At Year 5, more graduates working in the Irish Tech sector hold Business degrees (26.9%) and Arts & Humanities degrees (22.6%) than pure ICT Computer Science degrees (24.4%).
2. The Arts Landing Pad: In Year 1, over 27% of Arts grads work in retail. By Year 5 and 10, that drops to ~10% as Education (36%), Tech (10.5%), and Professional Services absorb them.
3. Field Stickiness: Education (87%) and Health (68%) have the highest retention in their core sectors, while Sciences and Humanities act as Swiss Army knives across the economy.
4. Earning Velocity: While starting salaries across many disciplines are relatively close in Year 1, ICT and Engineering compound fastest, reaching a median of €70k+ at Year 10.

Interactive dashboard link & open-source code: [Paste Link Here]

Data source: CSO Higher Education Outcomes (HEO08 & HEO12), linked with Revenue tax returns.

#DataAnalytics #HigherEducation #Ireland #CSO #TechCareers #Engineering`;

  const handleCopy = () => {
    navigator.clipboard.writeText(linkedInPostText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 text-cyan-400 mb-2">
          <Share2 className="w-5 h-5" />
          <h3 className="text-lg font-bold text-white">Share on LinkedIn</h3>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Here is a high-engagement LinkedIn post draft with the exact findings and verified data citations ready to copy and share:
        </p>

        <div className="relative">
          <textarea
            readOnly
            rows={12}
            value={linkedInPostText}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none resize-none leading-relaxed select-all"
          />
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: Take a quick screenshot of the Sankey chart to attach as the post image!</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
