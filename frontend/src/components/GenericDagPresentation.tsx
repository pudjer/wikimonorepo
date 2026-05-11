import { JSX, useState } from "react"
import { DAG } from "../domain/DAG/entity"

export type GenericDagPresentationProps<T> = {
  dag: DAG<T>
  nodeComponent: (props: {node: T}) => JSX.Element
  onNodeClick?: (node: T) => void
}

type VisualizationMode = "full" | "focused" | "subgraph"

interface VisualizationState<T> {
  mode: VisualizationMode
  dag: DAG<T>
  focusedNodes: ReadonlySet<T> | null
}

export const VisualizeDag = <T,>({
  dag: initialDag,
  nodeComponent,
  onNodeClick
}: GenericDagPresentationProps<T>): JSX.Element => {
  const [state, setState] = useState<VisualizationState<T>>({
    mode: "full",
    dag: initialDag,
    focusedNodes: null
  })

  const handleZoomIn = (node: T) => {
    // getChildren - приблизиться к дочерним узлам
    const children = state.dag.getChildren(node)
    if (children.size > 0) {
      setState(prev => ({
        ...prev,
        mode: "focused",
        focusedNodes: children
      }))
    }
    onNodeClick?.(node)
  }

  const handleFocus = (nodes: Set<T>) => {
    // getNodesLayers - фокусировка на подмножестве
    setState(prev => ({
      ...prev,
      mode: "focused",
      focusedNodes: nodes
    }))
  }

  const handleSubGraph = (nodes: Set<T>) => {
    // getSubGraph - полный переход к субграфу
    const subGraph = state.dag.getSubGraph(nodes)
    setState(prev => ({
      ...prev,
      mode: "subgraph",
      dag: subGraph,
      focusedNodes: null
    }))
  }

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      mode: "full",
      dag: initialDag,
      focusedNodes: null
    }))
  }

  // getLayers - структурировать отображение по слоям (листья внизу)
  const layers =
    state.mode === "focused" && state.focusedNodes
      ? state.dag.getNodesLayers(state.focusedNodes)
      : state.dag.getLayers()

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {/* Навигационная панель */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={handleReset} style={{ padding: "8px 12px" }}>
          Сбросить
        </button>
        {state.mode !== "full" && (
          <span style={{ alignSelf: "center", color: "#666" }}>
            Режим: {state.mode === "focused" ? "Фокусировка" : "Субграф"}
          </span>
        )}
      </div>

      {/* Визуализация слоев */}
      <div
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          gap: "16px"
        }}
      >
        {layers.map((layer, layerIndex) => (
          <div
            key={layerIndex}
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              minHeight: "60px",
              alignItems: "center"
            }}
          >
            {Array.from(layer).map(node => {
              const nodeKey = String(node)
              const children = state.dag.getChildren(node)
              const hasChildren = children.size > 0

              return (
                <div
                  key={nodeKey}
                  style={{
                    position: "relative",
                    display: "inline-block"
                  }}
                >
                  <div
                    onClick={() => handleZoomIn(node)}
                    style={{
                      cursor: hasChildren ? "pointer" : "default",
                      opacity: 1,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      borderRadius: "4px",
                      padding: "4px"
                    }}
                    onMouseEnter={e => {
                      if (hasChildren) {
                        (e.currentTarget as HTMLElement).style.transform =
                          "scale(1.05)"
                        ;(e.currentTarget as HTMLElement).style.boxShadow =
                          "0 4px 8px rgba(0,0,0,0.2)"
                      }
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.transform =
                        "scale(1)"
                      ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
                    }}
                  >
                    {nodeComponent({ node })}
                  </div>

                  {/* Индикатор наличия детей */}
                  {hasChildren && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-4px",
                        width: "12px",
                        height: "12px",
                        backgroundColor: "#2196F3",
                        borderRadius: "50%",
                        fontSize: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold"
                      }}
                      title={`${children.size} дочерних узлов`}
                    >
                      {children.size > 9 ? "9+" : children.size}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Контекстная информация */}
      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          backgroundColor: "#f0f7ff",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#666"
        }}
      >
        <p>
          Узлов: {state.dag.nodes.size} | Слоев:{" "}
          {Array.from(state.dag.nodes).length === 0 ? 0 : layers.length}
        </p>
        <p style={{ fontSize: "11px", marginTop: "8px" }}>
          💡 Подсказка: нажимайте на узлы для приближения
        </p>
      </div>
    </div>
  )
}