import React, { useMemo, useState } from 'react';
import { sankey, sankeyLinkHorizontal, SankeyNode } from 'd3-sankey';
import { FlowItem } from '../types';

export interface SankeyChartProps {
  flows: FlowItem[];
  selectedSourceId: string | null;
  selectedTargetId: string | null;
  onSelectSource: (id: string | null) => void;
  onSelectTarget: (id: string | null) => void;
  isPlaying?: boolean;
  width?: number;
  height?: number;
}

interface CustomNode {
  id: string;
  name: string;
  isSource: boolean;
  color: string;
}

interface CustomLink {
  source: number;
  target: number;
  value: number;
  original: FlowItem;
}

export const SankeyChart: React.FC<SankeyChartProps> = ({
  flows,
  selectedSourceId,
  selectedTargetId,
  onSelectSource,
  onSelectTarget,
  isPlaying = false,
  width = 1040,
  height = 580,
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<FlowItem | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const FIELD_COLORS: Record<string, string> = {
    '01': '#3b82f6', // Education (Blue)
    '02': '#ec4899', // Arts & Humanities (Rose/Pink)
    '03': '#a855f7', // Social Sciences (Purple)
    '04': '#f59e0b', // Business & Law (Amber)
    '05': '#10b981', // Natural Sciences & Math (Emerald)
    '06': '#06b6d4', // ICT (Cyan)
    '07': '#f97316', // Engineering (Orange)
    '08': '#84cc16', // Agriculture (Lime)
    '09': '#e11d48', // Health & Welfare (Crimson)
    '10': '#64748b', // Services (Slate)
  };

  const SECTOR_COLORS: Record<string, string> = {
    'J': '#06b6d4', // Tech
    'Y0900': '#f97316', // Industry / Manufacturing
    'M': '#6366f1', // Professional & Scientific
    'Y3500': '#10b981', // Finance & Real Estate
    'P': '#3b82f6', // Education
    'Q': '#e11d48', // Health
    'O': '#8b5cf6', // Public Admin
    'G': '#f59e0b', // Retail
    'I': '#eab308', // Hospitality
    'F': '#d97706', // Construction
    'A': '#84cc16', // Agriculture
    'H': '#0284c7', // Transport
    'N': '#64748b', // Administrative
    'Y7500': '#94a3b8', // Other
  };

  const graph = useMemo(() => {
    const sourceNodeMap = new Map<string, string>();
    const targetNodeMap = new Map<string, string>();

    flows.forEach(f => {
      sourceNodeMap.set(f.sourceId, f.sourceName);
      targetNodeMap.set(f.targetId, f.targetName);
    });

    const nodes: CustomNode[] = [
      ...Array.from(sourceNodeMap.entries()).map(([id, name]) => ({
        id: `src_${id}`,
        name,
        isSource: true,
        color: FIELD_COLORS[id] || '#6366f1',
      })),
      ...Array.from(targetNodeMap.entries()).map(([id, name]) => ({
        id: `tgt_${id}`,
        name,
        isSource: false,
        color: SECTOR_COLORS[id] || '#64748b',
      })),
    ];

    const nodeIndexMap = new Map(nodes.map((n, i) => [n.id, i]));

    const links = flows
      .filter(f => f.count > 0)
      .map(f => ({
        source: nodeIndexMap.get(`src_${f.sourceId}`)!,
        target: nodeIndexMap.get(`tgt_${f.targetId}`)!,
        value: f.count,
        original: f,
      }))
      .filter(l => l.source !== undefined && l.target !== undefined);

    const sankeyGenerator = sankey<CustomNode, CustomLink>()
      .nodeWidth(18)
      .nodePadding(14)
      .extent([
        [190, 24],
        [width - 250, height - 24],
      ]);

    try {
      return sankeyGenerator({
        nodes: nodes.map(d => ({ ...d })),
        links: links.map(d => ({ ...d })),
      });
    } catch (e) {
      console.error('Error generating sankey:', e);
      return { nodes: [], links: [] };
    }
  }, [flows, width, height]);

  const activeSourceId = selectedSourceId || (hoveredNode?.startsWith('src_') ? hoveredNode.replace('src_', '') : null);
  const activeTargetId = selectedTargetId || (hoveredNode?.startsWith('tgt_') ? hoveredNode.replace('tgt_', '') : null);

  const linkPathGenerator = sankeyLinkHorizontal();

  return (
    <div className="relative w-full overflow-x-auto rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-md">
      {/* Dynamic Animated CSS for particle flow */}
      <style>{`
        @keyframes pulseRibbon {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        .flow-particle-stream {
          animation: pulseRibbon 1.8s linear infinite;
        }
        .flow-particle-fast {
          animation: pulseRibbon 0.9s linear infinite;
        }
      `}</style>

      {/* Header labels */}
      <div className="flex justify-between items-center px-4 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span>University Major / Field of Study (Origin)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Economic Sector of Employment (Destination)</span>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto select-none overflow-visible"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseLeave={() => {
          setHoveredNode(null);
          setHoveredLink(null);
          setMousePos(null);
        }}
      >
        <defs>
          {/* Gradient definitions */}
          {graph.links.map((link, idx) => {
            const src = link.source as SankeyNode<CustomNode, CustomLink>;
            const tgt = link.target as SankeyNode<CustomNode, CustomLink>;
            return (
              <linearGradient
                key={idx}
                id={`flowGrad-${idx}`}
                gradientUnits="userSpaceOnUse"
                x1={src.x1}
                x2={tgt.x0}
              >
                <stop offset="0%" stopColor={src.color} />
                <stop offset="100%" stopColor={tgt.color} />
              </linearGradient>
            );
          })}
        </defs>

        {/* Base Flow Ribbons */}
        <g fill="none">
          {graph.links.map((link, idx) => {
            const f = (link as any).original as FlowItem;
            const isLinkActive =
              (!activeSourceId && !activeTargetId) ||
              (activeSourceId && f.sourceId === activeSourceId) ||
              (activeTargetId && f.targetId === activeTargetId);

            const isHovered = hoveredLink === f;
            const pathData = linkPathGenerator(link as any) || undefined;

            return (
              <path
                key={idx}
                d={pathData}
                stroke={`url(#flowGrad-${idx})`}
                strokeWidth={Math.max(1.5, link.width || 1)}
                strokeOpacity={isHovered ? 0.95 : isLinkActive ? 0.45 : 0.04}
                className="transition-all duration-500 cursor-pointer"
                onMouseEnter={() => setHoveredLink(f)}
                onClick={() => {
                  if (selectedSourceId === f.sourceId && selectedTargetId === f.targetId) {
                    onSelectSource(null);
                    onSelectTarget(null);
                  } else {
                    onSelectSource(f.sourceId);
                    onSelectTarget(f.targetId);
                  }
                }}
              />
            );
          })}
        </g>

        {/* Animated Flow Stream Overlays (Particle Streams when active or timelapse playing) */}
        <g fill="none" className="pointer-events-none">
          {graph.links.map((link, idx) => {
            const f = (link as any).original as FlowItem;
            const isLinkActive =
              (activeSourceId && f.sourceId === activeSourceId) ||
              (activeTargetId && f.targetId === activeTargetId) ||
              (hoveredLink === f) ||
              (isPlaying && f.count > 2500); // Highlight major arteries during timelapse!

            if (!isLinkActive) return null;

            const pathData = linkPathGenerator(link as any) || undefined;

            return (
              <path
                key={`pulse-${idx}`}
                d={pathData}
                stroke="white"
                strokeWidth={Math.max(2, (link.width || 2) * 0.4)}
                strokeOpacity={0.4}
                strokeDasharray="8 16"
                className={`transition-all duration-300 ${isPlaying ? 'flow-particle-fast' : 'flow-particle-stream'}`}
              />
            );
          })}
        </g>

        {/* Sankey Nodes */}
        <g>
          {graph.nodes.map((node, idx) => {
            const rawId = node.id.replace(/^(src_|tgt_)/, '');
            const isSource = node.isSource;
            const isNodeActive =
              (!activeSourceId && !activeTargetId) ||
              (isSource && activeSourceId === rawId) ||
              (!isSource && activeTargetId === rawId);

            const isHovered = hoveredNode === node.id;

            return (
              <g
                key={idx}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredNode(node.id)}
                onClick={() => {
                  if (isSource) {
                    onSelectSource(selectedSourceId === rawId ? null : rawId);
                  } else {
                    onSelectTarget(selectedTargetId === rawId ? null : rawId);
                  }
                }}
              >
                {/* Node Pill Background */}
                <rect
                  x={node.x0}
                  y={node.y0}
                  width={(node.x1 || 0) - (node.x0 || 0)}
                  height={Math.max(4, (node.y1 || 0) - (node.y0 || 0))}
                  fill={node.color}
                  fillOpacity={isNodeActive ? 1 : 0.25}
                  rx={4}
                  className="transition-all duration-500 shadow-lg"
                />

                {/* Node Label Text */}
                <text
                  x={isSource ? (node.x0 || 0) - 12 : (node.x1 || 0) + 12}
                  y={((node.y0 || 0) + (node.y1 || 0)) / 2}
                  dy="0.35em"
                  textAnchor={isSource ? 'end' : 'start'}
                  className={`text-[11.5px] transition-all select-none ${
                    isNodeActive ? 'fill-slate-100 font-bold' : 'fill-slate-500 font-normal'
                  } ${isHovered ? 'fill-cyan-300 font-extrabold' : ''}`}
                >
                  {node.name}
                </text>

                {/* Volume Counter Sub-text */}
                <text
                  x={isSource ? (node.x0 || 0) - 12 : (node.x1 || 0) + 12}
                  y={((node.y0 || 0) + (node.y1 || 0)) / 2 + 14}
                  textAnchor={isSource ? 'end' : 'start'}
                  className="text-[9.5px] fill-slate-400 font-mono-numbers select-none font-semibold"
                >
                  {Math.round(node.value || 0).toLocaleString()} grads
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Tooltip */}
      {hoveredLink && mousePos && (
        <div
          className="absolute z-40 pointer-events-none bg-slate-950/95 border border-slate-700 rounded-2xl p-3.5 shadow-2xl text-xs max-w-xs animate-fadeIn backdrop-blur-md ring-1 ring-cyan-500/20"
          style={{
            left: Math.min(mousePos.x + 15, width - 260),
            top: mousePos.y - 20,
          }}
        >
          <div className="font-bold text-white mb-1.5 flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
            <span className="text-indigo-300">{hoveredLink.sourceName}</span>
            <span className="text-slate-500">→</span>
            <span className="text-cyan-400">{hoveredLink.targetName}</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Graduates Employed:</span>
              <strong className="text-white font-mono-numbers">{hoveredLink.count.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Share of {hoveredLink.sourceName}:</span>
              <strong className="text-indigo-400 font-mono-numbers">{hoveredLink.percentOfField}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Share of {hoveredLink.targetName} workforce:</span>
              <strong className="text-cyan-400 font-mono-numbers">{hoveredLink.percentOfSector}%</strong>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 italic">
            Click to isolate this path
          </p>
        </div>
      )}
    </div>
  );
};
