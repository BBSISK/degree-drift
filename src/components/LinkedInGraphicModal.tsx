import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Play,
  Pause,
  RotateCcw,
  Video,
  Layers,
  Copy,
  Check,
  Sparkles,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { FieldEarnings } from '../types';
import {
  computeRankedSalaryRows,
  COHORT_LABELS,
  getStoryBeat,
  isCuratedScope,
} from '../utils/salaryConstants';
import {
  drawSalaryGraphicToCanvas,
  downloadCanvasAsPng,
  downloadAllSlidesAsImages,
  recordSalaryRaceVideo,
} from '../utils/salaryCanvasExport';

interface LinkedInGraphicModalProps {
  isOpen: boolean;
  onClose: () => void;
  allEarningsByYear: Record<number, Record<string, FieldEarnings>>;
  availableYears: number[];
  initialYear: number;
  nfqLabel?: string;
  institutionName?: string;
}

export const LinkedInGraphicModal: React.FC<LinkedInGraphicModalProps> = ({
  isOpen,
  onClose,
  allEarningsByYear,
  availableYears,
  initialYear,
  nfqLabel = 'Level 8 (Honours Bachelor)',
  institutionName = 'National (All Institutions)',
}) => {
  const [currentYear, setCurrentYear] = useState<number>(initialYear);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1'>('16:9');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [isDownloadingCarousel, setIsDownloadingCarousel] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync initialYear when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentYear(initialYear);
    }
  }, [isOpen, initialYear]);

  // Re-render canvas whenever currentYear or aspectRatio changes
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const curIdx = availableYears.indexOf(currentYear);
    const prevYear = curIdx > 0 ? availableYears[curIdx - 1] : undefined;
    const curEarnings = allEarningsByYear[currentYear] || {};
    const prevEarnings = prevYear ? allEarningsByYear[prevYear] : undefined;
    const y1Earnings = allEarningsByYear[1] || curEarnings;
    const rows = computeRankedSalaryRows(
      curEarnings,
      prevEarnings,
      y1Earnings,
      75000
    );
    const story = getStoryBeat(currentYear, rows, isCuratedScope(nfqLabel, institutionName));

    drawSalaryGraphicToCanvas(canvasRef.current, {
      rows,
      year: currentYear,
      story,
      maxSalaryScale: 75000,
      nfqLabel,
      institutionName,
      aspectRatio,
    });
  }, [isOpen, currentYear, aspectRatio, allEarningsByYear, availableYears, nfqLabel, institutionName]);

  // Auto-play animation loop with 4x hold at Year 10 final position
  useEffect(() => {
    if (!isPlaying || isRecording) return;

    // Normal hold is 2.2s; final position (Year 10) holds 4x longer (8.8s) for analysis
    const isFinalPosition = currentYear === availableYears[availableYears.length - 1];
    const holdDuration = isFinalPosition ? 8800 : 2200;

    const timeout = setTimeout(() => {
      setCurrentYear((prev) => {
        const idx = availableYears.indexOf(prev);
        if (idx === -1 || idx === availableYears.length - 1) {
          return availableYears[0];
        }
        return availableYears[idx + 1];
      });
    }, holdDuration);

    return () => clearTimeout(timeout);
  }, [isPlaying, isRecording, currentYear, availableYears]);

  if (!isOpen) return null;

  // Single PNG download
  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const filename = `degree-drift-salary-year-${currentYear}-${aspectRatio.replace(':', 'x')}.png`;
    downloadCanvasAsPng(canvasRef.current, filename);
  };

  // Batch carousel download (all 6 years)
  const handleDownloadAllCarousel = async () => {
    setIsDownloadingCarousel(true);
    try {
      await downloadAllSlidesAsImages(allEarningsByYear, nfqLabel, institutionName);
    } finally {
      setIsDownloadingCarousel(false);
    }
  };

  // Record 60fps video
  const handleRecordVideo = async () => {
    if (!canvasRef.current || isRecording) return;
    setIsPlaying(false);
    setIsRecording(true);
    setRecordProgress(0);

    try {
      const blob = await recordSalaryRaceVideo(canvasRef.current, allEarningsByYear, {
        nfqLabel,
        institutionName,
        onProgress: (pct, yr) => {
          setRecordProgress(pct);
          setCurrentYear(yr);
        },
      });

      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `degree-drift-salary-race-10year.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error recording video:', err);
    } finally {
      setIsRecording(false);
      setRecordProgress(0);
    }
  };

  // LinkedIn caption. The curated text describes the national Level 8 view only.
  const curatedCaption = isCuratedScope(nfqLabel, institutionName);
  const linkedInPostText = curatedCaption
    ? `What do Irish graduates earn 1, 3, 5 and 10 years after graduating, by field of study?

I built a salary chart from CSO open data (tables HEO12 & HEO16), which links graduation records to Revenue PAYE records. National figures, NFQ Level 8 (honours degree):

• Year 1: Education (€36.2k) and Health (€34.4k) have the highest medians, in line with public-sector pay scales. ICT is #3 (€31.5k).
• Year 3: ICT moves to #1 (€40.3k).
• Year 5: Engineering & Construction moves up to #2 (€45.0k); ICT leads at €49.2k.
• Year 8: Natural Sciences (€52.3k) and Business (€52.1k) pass Education and Health.
• Year 10: ICT is highest at €70.2k. Business is #3 (€58.6k). Education, #1 at Year 1, is #5.

ICT pays most, but it doesn't grow fastest: Arts & Humanities grows +146% from Year 1 to Year 10 and Business +137%, against +123% for ICT.

How to read it: each year pools every graduating cohort the CSO has published for that horizon. Year 1 covers 2010–2022 graduates; Year 10 only 2010–2013 graduates (latest earnings data: 2023). Figures are the average of cohort median weekly pay × 52, in nominal euro, for graduates in substantial employment in Ireland.

#HigherEducation #Ireland #CSO #OpenData #DataAnalytics #Graduates`
    : `What do Irish graduates earn 1 to 10 years after graduating?

I built a salary chart from CSO open data (tables HEO12 & HEO16, Revenue PAYE records).
Selection: ${institutionName} • ${nfqLabel}.

Each year pools every graduating cohort the CSO has published for that horizon (Year 1: 2010–2022 graduates; Year 10: 2010–2013). Fields the CSO did not publish are left out. Figures are the average of cohort median weekly pay × 52, in nominal euro.

#HigherEducation #Ireland #CSO #OpenData #DataAnalytics #Graduates`;

  const handleCopyPost = () => {
    navigator.clipboard.writeText(linkedInPostText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400">
                <Share2 className="w-5 h-5" />
                <h3 className="text-lg font-black text-white">
                  LinkedIn Graphic Studio: 10-Year Salary Trajectory
                </h3>
                <span className="text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full uppercase">
                  10-Year Horizon
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                High-resolution graphic of median earnings by field, 1 to 10 years after graduation
              </p>
            </div>

          {/* Aspect Ratio Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 self-start sm:self-center mr-8">
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                aspectRatio === '16:9'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              16:9 Landscape
            </button>
            <button
              onClick={() => setAspectRatio('1:1')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                aspectRatio === '1:1'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1:1 Square
            </button>
          </div>
        </div>

        {/* Center: Live Canvas Preview Container */}
        <div className="flex-1 my-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 p-3 flex flex-col items-center justify-center overflow-hidden min-h-[320px] relative">
          <canvas
            ref={canvasRef}
            className="w-full max-h-[460px] object-contain rounded-xl shadow-2xl border border-slate-800/60"
          />

          {/* Video Recording Overlay */}
          {isRecording && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 space-y-4 rounded-2xl backdrop-blur-sm z-20">
              <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
              <div className="text-center">
                <h4 className="text-base font-bold text-white">
                  Recording Bar Chart Race Video...
                </h4>
                <p className="text-xs text-cyan-400 mt-1">
                  Capturing Year 1 → Year 10 at 60fps ({recordProgress}%)
                </p>
              </div>
              <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${recordProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Timeline Scrubber & Animation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isRecording}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Preview Race</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentYear(1);
              }}
              title="Reset to Year 1"
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Year Buttons with Calendar Years */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            {availableYears.map((yr) => {
              const isActive = currentYear === yr;
              return (
                <button
                  key={yr}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentYear(yr);
                  }}
                  title={`Year ${yr}: ${COHORT_LABELS[yr]}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono-numbers transition flex flex-col items-center ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Y{yr}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 text-right truncate">
            <span>Current: </span>
            <strong className="text-white">Year {currentYear} of 10</strong>
            <span className="text-slate-500"> • {COHORT_LABELS[currentYear]}</span>
          </div>
        </div>

        {/* Action Buttons: Download PNG, Carousel, Record Video, Copy Text */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Download PNG */}
            <button
              onClick={handleDownloadPng}
              disabled={isRecording}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Slide (PNG)</span>
            </button>

            {/* Download Carousel */}
            <button
              onClick={handleDownloadAllCarousel}
              disabled={isDownloadingCarousel || isRecording}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition active:scale-95"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>
                {isDownloadingCarousel ? 'Exporting Carousel...' : 'Download 6-Slide Carousel'}
              </span>
            </button>

            {/* Record Video */}
            <button
              onClick={handleRecordVideo}
              disabled={isRecording}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition active:scale-95"
            >
              <Video className="w-4 h-4 text-white" />
              <span>Record LinkedIn Video (60fps • 4× Y10 Hold)</span>
            </button>
          </div>

          {/* Copy Post Text */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyPost}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs transition active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Post Copy!' : 'Copy LinkedIn Post'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
