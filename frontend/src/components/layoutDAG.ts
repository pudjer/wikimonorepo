import dagre from 'dagre';
import { Node, Edge } from '@xyflow/react';
import { DAG } from '../domain/DAG/entity';
import "@xyflow/react/dist/style.css"

interface LayoutResult<T extends Record<string, unknown>> {
  nodes: Node<T>[];
  edges: Edge[];
}

export function layoutDAG<T extends Record<string, unknown>>(
  dag: DAG<T>,
  getKey: (node: T) => string,
  options?: {
    nodeWidth?: number;
    nodeHeight?: number;
    direction?: 'TB' | 'LR'; // top→bottom or left→right
  }
): LayoutResult<T> {
  const {
    nodeWidth = 300,
    nodeHeight = 200,
    direction = 'TB',
  } = options ?? {};

  // 1. Collect all unique nodes (you might have a dedicated method; here we gather from layers)
  const allNodes = dag.nodes

  // 2. Build the dagre graph
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    nodesep: 200,
    ranksep: 200,
    edgesep: 20,
  });

  // 3. Add nodes with dimensions
  for (const node of allNodes) {
    const id = getKey(node);
    g.setNode(id, { width: nodeWidth, height: nodeHeight });
  }

  // 4. Add edges (using getChildren to avoid duplicates)
  for (const node of allNodes) {
    const parentId = getKey(node);
    const children = dag.getChildren(node);
    for (const child of children) {
      const childId = getKey(child);
      g.setEdge(parentId, childId);
    }
  }

  // 5. Run layout
  dagre.layout(g);

  // 6. Extract node positions
  const rfNodes: Node<T>[] = [];
  for (const node of allNodes) {
    const id = getKey(node);
    const dagreNode = g.node(id);
    rfNodes.push({
      id,
      type: 'custom',      // we'll register a custom node type
      position: {
        x: dagreNode.x - nodeWidth / 2,
        y: dagreNode.y - nodeHeight / 2,
      },
      data: node,          // pass the whole T object as data
    });
  }

  // 7. Build React Flow edges
  const rfEdges: Edge[] = [];
  for (const node of allNodes) {
    const source = getKey(node);
    const children = dag.getChildren(node);
    for (const child of children) {
      const target = getKey(child);
      rfEdges.push({
        id: `${source}->${target}`,
        source,
        target,
        type: 'default'
      });
    }
  }

  return { nodes: rfNodes, edges: rfEdges };
}