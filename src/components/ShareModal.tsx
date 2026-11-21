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

  const linkedInPostText = `Where do Irish university graduates actually work, 1 to 10 years after graduating?

Most people assume their degree locks them into one industry. I used Central Statistics Office (CSO) open data (HEO08, HEO12, HEO16), which links graduation records with Revenue PAYE records, to build an interactive dashboard: "Degree Drift".

What the data shows (honours degree, NFQ Level 8, national):
1. Tech isn't just for computing graduates: at Year 5, more people in the Irish tech sector hold a Business degree (26.9%) than an ICT degree (24.4%). Business and Arts & Humanities together make up 49.5%, about twice the ICT share.
2. The Arts "landing pad": in Year 1, 27% of Arts & Humanities graduates work in retail. By Year 5 that's about 10%, and by Year 10 7%, as Education (36%), Tech (10.5%) and Professional Services (9.4%) take them in.
3. Field stickiness: Education (87.5%) and Health & Welfare (68.7%) keep the most graduates in their own sector in Year 1. Social Sciences and Natural Sciences graduates spread most widely across the economy.
4. Earnings: ICT has the highest median at Year 10 (€70.2k), but Arts & Humanities (+146%) and Business (+137%) grow faster from Year 1 than ICT (+123%).

How to read it: each "years since graduation" pools every cohort the CSO has published for that horizon (Year 1: 2010–2022 graduates; Year 10: 2010–2013). It covers graduates in substantial employment in Ireland, so those working abroad aren't included.

Interactive dashboard & open-source code: [Paste Link Here]

Data: CSO Higher Education Outcomes (HEO08, HEO12, HEO16), CC BY 4.0.

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

        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <span>Tip: Use the "LinkedIn Graphic" button in the Salary Trajectory section to download high-res images, carousel slides, or animated video!</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium self-end sm:self-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
