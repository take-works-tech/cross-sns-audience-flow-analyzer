"use client";

import "@xyflow/react/dist/style.css";
import "./canvas.css";

import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ConnectionMode,
  ReactFlow,
  ReactFlowProvider,
  type Connection,
  type EdgeChange,
  type EdgeTypes,
  type NodeChange,
  type NodeMouseHandler,
  type NodeTypes,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvas-store";

import { EdgeMarkers } from "./edges/edge-markers";
import { FlowEdge } from "./edges/flow-edge";
import {
  INITIAL_EDGES,
  INITIAL_NODES,
  makeManualEdge,
  type AppEdge,
  type AppNode,
} from "./graph-model";
import { CircleNode } from "./nodes/circle-node";
import { UrlNode } from "./nodes/url-node";
import { CanvasTools } from "./overlays/canvas-tools";
import { CanvasLegend } from "./overlays/legend";
import { RecalcPill } from "./overlays/recalc-pill";
import { Timeline } from "./overlays/timeline";

const NODE_TYPES: NodeTypes = {
  account: CircleNode,
  post: CircleNode,
  url: UrlNode,
};

const EDGE_TYPES: EdgeTypes = {
  flow: FlowEdge,
};

const FIT_VIEW_OPTIONS = { padding: 0.14, maxZoom: 1 } as const;
const PRO_OPTIONS = { hideAttribution: true } as const;
/** middle + right mouse button still pan while the lasso owns the left button */
const LASSO_PAN_BUTTONS = [1, 2];
const EDITABLE_TAGS = /^(INPUT|TEXTAREA|SELECT)$/;

/** Clone a node with a new `hidden` flag while keeping the discriminated union. */
function withHidden(node: AppNode, hidden: boolean): AppNode {
  return node.type === "url" ? { ...node, hidden } : { ...node, hidden };
}

function FlowCanvasInner() {
  const [nodes, setNodes] = useState<AppNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<AppEdge[]>(INITIAL_EDGES);
  const [lasso, setLasso] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const filters = useCanvasStore((s) => s.filters);
  const setSelection = useCanvasStore((s) => s.setSelection);

  const edgesRef = useRef(edges);
  const manualSeq = useRef(0);
  const lastFlowSelection = useRef<string | null>(null);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  /* ------------------------------------------------------------ changes -- */

  const onNodesChange = useCallback((changes: NodeChange<AppNode>[]) => {
    setNodes((current) => applyNodeChanges(changes, current));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange<AppEdge>[]) => {
    setEdges((current) => applyEdgeChanges(changes, current));
  }, []);

  /* ------------------------------------------------------------- filters -- */

  const hiddenNodeIds = useMemo(() => {
    const hidden = new Set<string>();
    for (const node of nodes) {
      const visible =
        node.type === "account"
          ? filters.showAccounts
          : node.type === "post"
            ? filters.showPosts
            : filters.showUrls;
      if (!visible) hidden.add(node.id);
    }
    return hidden;
  }, [nodes, filters]);

  const displayNodes = useMemo(
    () =>
      nodes.map((node) => {
        const hidden = hiddenNodeIds.has(node.id);
        return hidden === Boolean(node.hidden) ? node : withHidden(node, hidden);
      }),
    [nodes, hiddenNodeIds],
  );

  const displayEdges = useMemo(
    () =>
      edges.map((edge) => {
        const data = edge.data;
        let hidden =
          hiddenNodeIds.has(edge.source) || hiddenNodeIds.has(edge.target);

        if (!hidden && data && !data.manual) {
          const kindOff =
            data.kind === "observed"
              ? !filters.showObserved
              : !filters.showEstimated;
          hidden =
            kindOff ||
            data.volume < filters.minVolume ||
            (data.rate !== null && data.rate < filters.minRate) ||
            data.confidence < filters.minConf;
        }

        return hidden === Boolean(edge.hidden) ? edge : { ...edge, hidden };
      }),
    [edges, hiddenNodeIds, filters],
  );

  /* ---------------------------------------------------------- interaction -- */

  const onConnect = useCallback((connection: Connection) => {
    const { source, target } = connection;
    if (!source || !target || source === target) return;
    setEdges((current) => {
      if (current.some((e) => e.source === source && e.target === target)) {
        return current;
      }
      manualSeq.current += 1;
      return [
        ...current,
        makeManualEdge(`e-manual-${manualSeq.current}`, source, target),
      ];
    });
  }, []);

  /**
   * Mirrors React Flow's own selection into the store so keyboard selection
   * and drag-to-select land in the right panel. React Flow fires this once on
   * mount with an empty selection, so an empty payload only clears the store
   * when React Flow actually had something selected a moment ago — a selection
   * made from the left / right panel is never stomped.
   */
  const onSelectionChange = useCallback(
    ({
      nodes: selectedNodes,
      edges: selectedEdges,
    }: OnSelectionChangeParams<AppNode, AppEdge>) => {
      const single =
        selectedNodes.length === 1 && selectedEdges.length === 0
          ? ({ type: "node", id: selectedNodes[0].id } as const)
          : selectedEdges.length === 1 && selectedNodes.length === 0
            ? ({ type: "edge", id: selectedEdges[0].id } as const)
            : null;

      const key = single ? `${single.type}:${single.id}` : null;
      if (key === lastFlowSelection.current) return;

      const hadSelection = lastFlowSelection.current !== null;
      lastFlowSelection.current = key;

      if (single) {
        setSelection(single);
      } else if (hadSelection) {
        setSelection(null);
      }
    },
    [setSelection],
  );

  const onNodeClick = useCallback<NodeMouseHandler<AppNode>>(
    (_event, node) => setSelection({ type: "node", id: node.id }),
    [setSelection],
  );

  const onEdgeClick = useCallback(
    (_event: ReactMouseEvent, edge: AppEdge) =>
      setSelection({ type: "edge", id: edge.id }),
    [setSelection],
  );

  const onPaneClick = useCallback(() => setSelection(null), [setSelection]);
  const onConnectStart = useCallback(() => setConnecting(true), []);
  const onConnectEnd = useCallback(() => setConnecting(false), []);

  /* ---------------------------------------------- delete a manual edge -- */

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable || EDITABLE_TAGS.test(target.tagName))
      ) {
        return;
      }

      const selection = useCanvasStore.getState().selection;
      if (!selection || selection.type !== "edge") return;

      const edge = edgesRef.current.find((e) => e.id === selection.id);
      if (!edge?.data?.manual) return;

      event.preventDefault();
      setEdges((current) => current.filter((e) => e.id !== edge.id));
      useCanvasStore.getState().setSelection(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* ------------------------------------------------------------- render -- */

  return (
    <div
      className={cn(
        "canvas-ground flow-canvas relative min-w-0 flex-1",
        connecting && "is-connecting",
      )}
    >
      <ReactFlow<AppNode, AppEdge>
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onSelectionChange={onSelectionChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        connectionMode={ConnectionMode.Loose}
        connectionRadius={26}
        nodeDragThreshold={2}
        deleteKeyCode={null}
        selectionOnDrag={lasso}
        panOnDrag={lasso ? LASSO_PAN_BUTTONS : true}
        zoomOnDoubleClick={false}
        minZoom={0.4}
        maxZoom={2}
        fitView
        fitViewOptions={FIT_VIEW_OPTIONS}
        proOptions={PRO_OPTIONS}
        aria-label={copy.canvas.ariaLabel}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={26}
          size={2}
          color="var(--canvas-dot)"
        />
      </ReactFlow>

      <EdgeMarkers />
      <CanvasTools lasso={lasso} onLassoChange={setLasso} />
      <CanvasLegend />
      <RecalcPill />
      <Timeline />
    </div>
  );
}

/** Network canvas: the core analysis surface. */
export function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
