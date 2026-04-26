import { useMemo } from "react";
import type { ArticleDAGResultDTO } from "../../api";

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

export function DagVisualizer({ dag, width = 600, height = 400 }: { dag: ArticleDAGResultDTO; width?: number; height?: number }) {
  const nodes = dag.nodes;
  const links = dag.links;

  const positions = useMemo(() => {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) / 2 - 60;
    const map = new Map<string, { x: number; y: number }>();
    nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / Math.max(nodes.length, 1) - Math.PI / 2;
      map.set(node, polarToCartesian(cx, cy, r, angle));
    });
    return map;
  }, [nodes, width, height]);

  return (
    <svg width={width} height={height} style={{ border: "1px solid #ccc", borderRadius: 8, background: "#fafafa" }}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
        </marker>
      </defs>
      {links.map((link, idx) => {
        const start = positions.get(link.parent);
        const end = positions.get(link.child);
        if (!start || !end) return null;
        return (
          <line
            key={`link-${idx}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#888"
            strokeWidth={1.5}
            markerEnd="url(#arrowhead)"
          />
        );
      })}
      {nodes.map((node, idx) => {
        const pos = positions.get(node);
        if (!pos) return null;
        return (
          <g key={`node-${idx}`}>
            <circle cx={pos.x} cy={pos.y} r={20} fill="#1976d2" stroke="#fff" strokeWidth={2} />
            <text
              x={pos.x}
              y={pos.y + 4}
              textAnchor="middle"
              fill="#fff"
              fontSize={10}
              fontFamily="sans-serif"
            >
              {node.slice(0, 4)}
            </text>
            <text
              x={pos.x}
              y={pos.y + 36}
              textAnchor="middle"
              fill="#333"
              fontSize={10}
              fontFamily="sans-serif"
            >
              {node.length > 12 ? `${node.slice(0, 12)}...` : node}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

