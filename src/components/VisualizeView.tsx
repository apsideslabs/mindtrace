import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow, Controls, Background, useNodesState, useEdgesState, Panel,
  ReactFlowProvider, useReactFlow, type Node, type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Download, Check, Waypoints } from 'lucide-react';
import { toPng } from 'html-to-image';
import dagre from 'dagre';
import { getAllCategories, getTopicsByCategory, getAllTopics, getCategoryById } from '../content/content-index';
import { TopicId } from '../types';

const INK = '#14120f';
const ACCENT = '#b23a2a';
const LINE = '#d6cec0';

const NODE_W = 186;
const NODE_H = 44;

const nodeBase: React.CSSProperties = {
  borderRadius: '10px',
  border: `1px solid ${LINE}`,
  background: '#ffffff',
  color: INK,
  padding: '10px 14px',
  fontSize: '12.5px',
  fontWeight: 500,
  textAlign: 'center',
  width: NODE_W,
  boxSizing: 'border-box',
};

interface Bounds { minX: number; minY: number; maxX: number; maxY: number; }

function boundsOf(nodes: Node[]): Bounds {
  const b: Bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  nodes.forEach((n) => {
    const w = (n.style?.width as number) ?? NODE_W;
    const h = NODE_H;
    b.minX = Math.min(b.minX, n.position.x);
    b.minY = Math.min(b.minY, n.position.y);
    b.maxX = Math.max(b.maxX, n.position.x + w);
    b.maxY = Math.max(b.maxY, n.position.y + h);
  });
  return b;
}

function dagreLayout(nodes: Node[], edges: Edge[], dir: 'TB' | 'LR' = 'LR') {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: dir, ranksep: 100, nodesep: 36 });
  nodes.forEach((n) => g.setNode(n.id, { width: (n.style?.width as number) ?? NODE_W, height: NODE_H }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  nodes.forEach((n) => {
    const p = g.node(n.id);
    const w = (n.style?.width as number) ?? NODE_W;
    n.position = { x: p.x - w / 2, y: p.y - NODE_H / 2 };
  });
  return { nodes, edges, bounds: boundsOf(nodes) };
}

/** Grid cluster: root on the left, topics in a compact grid to its right. */
function clusterLayout(rootLabel: string, topics: { id: string; title: string }[]) {
  const cols = Math.min(4, Math.max(2, Math.round(Math.sqrt(topics.length))));
  const colW = NODE_W + 38;
  const rowH = NODE_H + 26;
  const rows = Math.ceil(topics.length / cols);
  const gridH = (rows - 1) * rowH + NODE_H;
  const offsetX = NODE_W + 120;

  const nodes: Node[] = [
    { id: 'root', data: { label: rootLabel }, position: { x: 0, y: Math.max(0, gridH / 2 - NODE_H / 2) }, style: { ...nodeBase, background: INK, color: '#fbfaf7', border: 'none', fontWeight: 600 } },
  ];
  const edges: Edge[] = [];
  topics.forEach((t, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    nodes.push({ id: `t-${t.id}`, data: { label: t.title }, position: { x: offsetX + c * colW, y: r * rowH }, style: nodeBase });
    edges.push({ id: `e-${t.id}`, source: 'root', target: `t-${t.id}`, style: { stroke: LINE, strokeWidth: 1.1, opacity: 0.5 } });
  });
  return { nodes, edges, bounds: boundsOf(nodes) };
}

type Mode = 'mindmap' | 'web' | 'relationships';

function Inner({ onOpenTopic }: { onOpenTopic?: (id: TopicId) => void }) {
  const categories = getAllCategories();
  const [mode, setMode] = useState<Mode>('mindmap');
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [done, setDone] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { setViewport } = useReactFlow();

  const build = useMemo(() => {
    if (mode === 'mindmap') {
      const cat = getCategoryById(categoryId)!;
      return clusterLayout(cat.title, getTopicsByCategory(categoryId).map((t) => ({ id: t.id, title: t.title })));
    }
    if (mode === 'web') {
      const topics = getTopicsByCategory(categoryId);
      const ids = new Set(topics.map((t) => t.id));
      const nodes: Node[] = topics.map((t) => ({ id: `t-${t.id}`, data: { label: t.title }, position: { x: 0, y: 0 }, style: { ...nodeBase, border: `1px solid ${ACCENT}55` } }));
      const edges: Edge[] = [];
      const seen = new Set<string>();
      topics.forEach((t) => (t.relatedTopics ?? []).forEach((r) => {
        if (!ids.has(r)) return;
        const key = [t.id, r].sort().join('|');
        if (seen.has(key)) return;
        seen.add(key);
        edges.push({ id: key, source: `t-${t.id}`, target: `t-${r}`, style: { stroke: LINE, strokeWidth: 1 } });
      }));
      return dagreLayout(nodes, edges, 'LR');
    }
    const topics = getAllTopics().filter((t) => (t.relatedTopics ?? []).length > 0).slice(0, 40);
    const ids = new Set(topics.map((t) => t.id));
    const nodes: Node[] = topics.map((t) => ({ id: `t-${t.id}`, data: { label: t.title }, position: { x: 0, y: 0 }, style: { ...nodeBase, width: 160, fontSize: '11.5px' } }));
    const edges: Edge[] = [];
    const seen = new Set<string>();
    topics.forEach((t) => (t.relatedTopics ?? []).forEach((r) => {
      if (!ids.has(r)) return;
      const key = [t.id, r].sort().join('|');
      if (seen.has(key)) return;
      seen.add(key);
      edges.push({ id: key, source: `t-${t.id}`, target: `t-${r}`, style: { stroke: LINE, strokeWidth: 0.8, opacity: 0.7 } });
    }));
    return dagreLayout(nodes, edges, 'LR');
  }, [mode, categoryId]);

  useEffect(() => {
    setNodes(build.nodes);
    setEdges(build.edges);
  }, [build, setNodes, setEdges]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const t = setTimeout(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const { minX, minY, maxX, maxY } = build.bounds;
      const gw = maxX - minX || 1;
      const gh = maxY - minY || 1;
      const pad = 44;
      const z = Math.max(Math.min((w - pad * 2) / gw, (h - pad * 2) / gh, 1.1), 0.15);
      setViewport({ x: (w - gw * z) / 2 - minX * z, y: (h - gh * z) / 2 - minY * z, zoom: z });
    }, 60);
    return () => clearTimeout(t);
  }, [build, setViewport]);

  const download = useCallback(() => {
    if (!wrapRef.current) return;
    toPng(wrapRef.current, { backgroundColor: '#fbfaf7', pixelRatio: 2 })
      .then((url) => {
        const a = document.createElement('a');
        a.download = `mindtrace-map-${mode}.png`;
        a.href = url;
        a.click();
        setDone(true);
        setTimeout(() => setDone(false), 2500);
      })
      .catch(() => {});
  }, [mode]);

  const modes: { key: Mode; label: string }[] = [
    { key: 'mindmap', label: 'Category map' },
    { key: 'web', label: 'Concept web' },
    { key: 'relationships', label: 'Relationship graph' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <header className="mb-6">
        <div className="kicker mb-3 flex items-center gap-2"><Waypoints className="w-3.5 h-3.5 text-accent" /> Visualise</div>
        <h1 className="font-display text-[34px] sm:text-[40px] font-semibold text-ink">The map</h1>
        <p className="mt-3 text-[15.5px] text-ink-soft max-w-2xl leading-relaxed">
          See how concepts connect. Click any node to open the topic.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${
              mode === m.key ? 'bg-ink text-paper border-ink' : 'border-line text-ink-soft hover:border-line-strong'
            }`}
          >
            {m.label}
          </button>
        ))}
        {mode !== 'relationships' && (
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="ml-auto bg-surface border hairline rounded-full px-3.5 py-1.5 text-[12.5px] text-ink outline-none focus:border-line-strong"
          >
            {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        )}
      </div>

      <div ref={wrapRef} className="h-[68vh] rounded-2xl border hairline bg-surface overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => {
            const id = node.id.startsWith('t-') ? node.id.slice(2) : '';
            if (id && onOpenTopic) onOpenTopic(id);
          }}
          minZoom={0.15}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background color={LINE} gap={20} size={1} />
          <Controls showInteractive={false} />
          <Panel position="top-right">
            <button onClick={download} className="btn btn-primary shadow-lg">
              <Download className="w-4 h-4" /> Export
            </button>
            {done && (
              <div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-good bg-surface border hairline rounded-full px-3 py-1.5">
                <Check className="w-3.5 h-3.5" /> Exported
              </div>
            )}
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export function VisualizeView({ onOpenTopic }: { onOpenTopic?: (id: TopicId) => void }) {
  return (
    <ReactFlowProvider>
      <Inner onOpenTopic={onOpenTopic} />
    </ReactFlowProvider>
  );
}
