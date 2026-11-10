import React, { useState, useEffect } from 'react';
import { Dataset, NfqKey } from './types';
import { Header } from './components/Header';
import { SankeyChart } from './components/SankeyChart';
import { TimelapseController } from './components/TimelapseController';
import { InsightsPanel } from './components/InsightsPanel';
import { SalaryTrajectory } from './components/SalaryTrajectory';
import { ShareModal } from './components/ShareModal';
import { MethodologyModal } from './components/MethodologyModal';
import { Database, Sparkles, ExternalLink, RefreshCw, Film } from 'lucide-react';

export const App: React.FC = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const availableYears = [1, 2, 3, 5, 8, 10];
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [selectedNfq, setSelectedNfq] = useState<NfqKey>('level_8');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('-');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  
  // Timelapse state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);

  useEffect(() => {
    fetch('/data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load data`);
        return res.json();
      })
      .then((data: Dataset) => {
        setDataset(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Timelapse Auto-advance effect
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setSelectedYear((prev) => {
        const idx = availableYears.indexOf(prev);
        if (idx === -1 || idx === availableYears.length - 1) {
          return availableYears[0]; // Loop back to Year 1
        }
        return availableYears[idx + 1];
      });
    }, 2800); // 2.8s per year beat

    return () => clearInterval(timer);
  }, [isPlaying, availableYears]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
        <p className="text-sm font-semibold text-slate-300">
          Loading CSO Higher Education Outcomes data...
        </p>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 max-w-md">
          <p className="font-bold mb-1">Failed to load dataset</p>
          <p className="text-xs text-rose-400">{error || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  const currentTimelineGroup = dataset.timelines[selectedNfq] || dataset.timelines.level_8;
  const currentTimeline = currentTimelineGroup[String(selectedYear)] || currentTimelineGroup['1'];

  const isSpecificInstitution = selectedInstitution !== '-';
  const institutionName = dataset.metadata.institutions[selectedInstitution] || 'All Institutions';
  const activeEarnings = isSpecificInstitution
    ? dataset.institutionEarnings[selectedInstitution]?.[selectedNfq]?.[String(selectedYear)] || currentTimeline.earnings
    : currentTimeline.earnings;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 transition-all ${isCinemaMode ? 'p-2 sm:p-6' : ''}`}>
      {/* Top Header & Global Controls (hidden in cinema mode for clean video recording) */}
      {!isCinemaMode && (
        <Header
          selectedYear={selectedYear}
          onSelectYear={(yr) => setSelectedYear(yr)}
          selectedNfq={selectedNfq}
          onSelectNfq={(nfq) => setSelectedNfq(nfq)}
          selectedInstitution={selectedInstitution}
          onSelectInstitution={(inst) => setSelectedInstitution(inst)}
          institutions={dataset.metadata.institutions}
          onOpenShare={() => setIsShareModalOpen(true)}
          onOpenMethodology={() => setIsMethodologyModalOpen(true)}
          availableYears={availableYears}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto space-y-6 ${isCinemaMode ? 'max-w-6xl' : 'max-w-7xl px-4 lg:px-8 py-6'}`}>
        
        {/* Cinema Mode Top Header Bar */}
        {isCinemaMode && (
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-black text-white flex items-center space-x-2">
                <span>Degree Drift: 10-Year Career Migration</span>
                <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded-full uppercase">
                  CSO Ireland
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tracking Irish higher education graduates across actual economic sectors and Revenue tax records
              </p>
            </div>
            <button
              onClick={() => setIsCinemaMode(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
            >
              Exit Capture View
            </button>
          </div>
        )}

        {/* 10-Year Timelapse Controller Bar */}
        <section>
          <TimelapseController
            currentYear={selectedYear}
            availableYears={availableYears}
            onSelectYear={(yr) => setSelectedYear(yr)}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onReset={() => {
              setIsPlaying(false);
              setSelectedYear(1);
            }}
            isCinemaMode={isCinemaMode}
            onToggleCinema={() => setIsCinemaMode(!isCinemaMode)}
          />
        </section>

        {/* The Core Sankey Visualization */}
        <section>
          <SankeyChart
            flows={currentTimeline.flows}
            selectedSourceId={selectedSourceId}
            selectedTargetId={selectedTargetId}
            onSelectSource={setSelectedSourceId}
            onSelectTarget={setSelectedTargetId}
            isPlaying={isPlaying}
            width={1040}
            height={580}
          />
        </section>

        {/* Median Earnings Bar */}
        <section>
          <SalaryTrajectory
            earnings={activeEarnings}
            nationalEarnings={currentTimeline.earnings}
            selectedInstitutionName={institutionName}
            isSpecificInstitution={isSpecificInstitution}
            selectedYear={selectedYear}
          />
        </section>

        {/* Insights & Inflow/Outflow Breakdown Panel */}
        {!isCinemaMode && (
          <section>
            <InsightsPanel
              timeline={currentTimeline}
              selectedSourceId={selectedSourceId}
              selectedTargetId={selectedTargetId}
              onClearSelection={() => {
                setSelectedSourceId(null);
                setSelectedTargetId(null);
              }}
              selectedYear={selectedYear}
            />
          </section>
        )}

      </main>

      {/* Footer with Data Provenance & Attribution */}
      {!isCinemaMode && (
        <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-cyan-500" />
              <span>
                Official Open Data: <strong>CSO Ireland Tables HEO08, HEO12 & HEO16</strong> (Higher Education Outcomes linked with Revenue tax returns).
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://data.cso.ie"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-300 transition flex items-center space-x-1"
              >
                <span>data.cso.ie</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <span className="text-slate-400">Built by Barry Sisk</span>
            </div>
          </div>
        </footer>
      )}

      {/* Share to LinkedIn Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        selectedYear={selectedYear}
      />

      {/* Methodology & Academic Provenance Modal */}
      <MethodologyModal
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
      />
    </div>
  );
};
