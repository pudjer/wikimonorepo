/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX, useMemo, useState } from "react"
import { DAG } from "../domain/DAG/entity"
import { Box, Stack } from "@mui/material"
import { Handle, NodeTypes, Position, ReactFlow } from '@xyflow/react';
import { layoutDAG } from "./layoutDAG";
export type GenericDagPresentationProps<T extends Record<string, any>> = {
  dag: DAG<T>
  getKey: (node: T) => string
  NodeComponent: ({ node }: { node: T }) => JSX.Element
}


export const VisualizeDag = <T extends Record<string, any>>({
  dag,
  NodeComponent,
  getKey,
}: GenericDagPresentationProps<T>) => {
  // Compute layout only when `dag` changes
  const { nodes, edges } = useMemo(
    () => layoutDAG(dag, getKey),
    [dag, getKey]
  );

  // React Flow requires a mapping of node types → components

// Inside VisualizeDag, update the nodeTypes definition:
  const nodeTypes = useMemo(
    () => ({
      custom: ({ data }: { data: T }) => (
        <div>
          {/* Invisible handles for automatic connection */}
          <Handle type="target" position={Position.Top} id="t" />
          <NodeComponent node={data} />
          <Handle type="source" position={Position.Bottom} id="s" />
        </div>
      ),
    }),
    [NodeComponent]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      />
    </div>
  );
};