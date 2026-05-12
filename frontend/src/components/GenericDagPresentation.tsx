/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { JSX, useMemo, useState } from "react"
import { DAG } from "../domain/DAG/entity"
import { Box, Stack } from "@mui/material"
import { applyNodeChanges, Handle, NodeTypes, Position, ReactFlow } from '@xyflow/react';
import { layoutDAG } from "./layoutDAG";
import { f } from "../lib";
export type GenericDagPresentationProps<T extends Record<string, unknown>> = {
  dag: DAG<T>
  getKey: (node: T) => string
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ComponentFactory: (node: T) => React.FC<{}>
}


const VisualizeDagBase = <T extends Record<string, any>>({
  dag,
  ComponentFactory,
  getKey,
}: GenericDagPresentationProps<T>) => {
  const { nodes, edges } = useMemo(
    () => layoutDAG(dag, getKey),
    [dag, getKey]
  );
  console.log("render")
  const [nodesState, setNodesState] = useState(nodes);

  // Синхронизируем состояние при изменении dag
  useMemo(() => {
    // eslint-disable-next-line react-hooks/set-state-in-render
    setNodesState(nodes);
  }, [nodes]);

  const nodeTypes = useMemo(
    () => ({
      custom: ({ data }: { data: T }) => (
        <div>
          <Handle type="target" position={Position.Top} id="t" />
          {React.createElement(ComponentFactory(data))}
          <Handle type="source" position={Position.Bottom} id="s" />
        </div>
      ),
    }),
    [ComponentFactory]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodesState}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) => {
          // Разрешаем изменения позиций
          setNodesState((nds) => applyNodeChanges(changes, nds));
        }}
        fitView
        attributionPosition="bottom-right"
        // Явно указываем, что перетаскивание разрешено
        nodesDraggable={true}
      />
    </div>
  );
};

export const VisualizeDag = f.observer(VisualizeDagBase)