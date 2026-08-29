/**
 * Bridge between the frozen domain model (`@/lib/types` + `@/lib/mock/data`)
 * and the shapes @xyflow/react needs.
 *
 * Domain coordinates are node CENTRES inside the 1200x800 design viewBox
 * (that is how the mockup's SVG places them). React Flow positions a node by
 * its top-left corner, so every conversion subtracts half the box.
 */
import type { Edge, Node } from "@xyflow/react";

import { MOCK_EDGES, MOCK_NODES } from "@/lib/mock/data";
import type { FlowKind, GraphEdge, GraphNode, SwatchToken } from "@/lib/types";
import { PLATFORM_SWATCH } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* handles                                                                     */
/* -------------------------------------------------------------------------- */

/** Every node exposes exactly one outgoing and one incoming handle. */
export const SOURCE_HANDLE_ID = "out";
export const TARGET_HANDLE_ID = "in";

/* -------------------------------------------------------------------------- */
/* node / edge shapes                                                          */
/* -------------------------------------------------------------------------- */

/** account + post nodes: a ringed circle with a label and a mono sub-metric. */
export type CircleNodeData = {
  label: string;
  sub: string;
  /** circle radius in flow units (== GraphNode.size) */
  radius: number;
  swatch: SwatchToken;
  /** accounts get a thicker ring and a larger core */
  account: boolean;
};

/** url nodes: a rounded-rect card with a colour dot, label and mono domain. */
export type UrlNodeData = {
  label: string;
  domain: string;
  swatch: SwatchToken;
  commerce: boolean;
  cardWidth: number;
  cardHeight: number;
};

export type CircleFlowNode = Node<CircleNodeData, "account" | "post">;
export type UrlFlowNode = Node<UrlNodeData, "url">;
export type AppNode = CircleFlowNode | UrlFlowNode;

export type FlowEdgeData = {
  kind: FlowKind;
  /** stroke width in px */
  strokeWidth: number;
  /** 0..1 */
  confidence: number;
  volume: number;
  /** percent, or null when the edge carries no rate */
  rate: number | null;
  /** drawn by the user with a connect drag — exempt from threshold filters */
  manual: boolean;
};

export type AppEdge = Edge<FlowEdgeData, "flow">;

/* -------------------------------------------------------------------------- */
/* geometry                                                                    */
/* -------------------------------------------------------------------------- */

/** Fallback card height when a url node omits `height`. */
export const URL_CARD_HEIGHT = 40;

/**
 * The mockup's edge geometry: a quadratic bezier whose control point is pushed
 * perpendicular to the chord so parallel runs never overlap.
 */
export function quadPath(
  ax: number,
  ay: number,
  bx: number,
  by: number,
): string {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const off = Math.min(46, len * 0.18);
  const nx = (-dy / len) * off;
  const ny = (dx / len) * off;
  return `M${round(ax)},${round(ay)} Q${round(mx + nx)},${round(my + ny)} ${round(bx)},${round(by)}`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/* -------------------------------------------------------------------------- */
/* conversion                                                                  */
/* -------------------------------------------------------------------------- */

function swatchOf(node: GraphNode): SwatchToken {
  if (node.kind === "url") {
    return node.category === "commerce" ? "com" : "gen";
  }
  return node.platform ? PLATFORM_SWATCH[node.platform] : "gen";
}

export function toFlowNode(node: GraphNode): AppNode {
  if (node.kind === "url") {
    const cardWidth = node.size;
    const cardHeight = node.height ?? URL_CARD_HEIGHT;
    return {
      id: node.id,
      type: "url",
      position: { x: node.x - cardWidth / 2, y: node.y - cardHeight / 2 },
      width: cardWidth,
      height: cardHeight,
      ariaLabel: node.label,
      data: {
        label: node.label,
        domain: node.domain ?? "",
        swatch: swatchOf(node),
        commerce: node.category === "commerce",
        cardWidth,
        cardHeight,
      },
    };
  }

  const account = node.kind === "account";
  const type = account ? ("account" as const) : ("post" as const);
  const diameter = node.size * 2;
  return {
    id: node.id,
    type,
    position: { x: node.x - node.size, y: node.y - node.size },
    width: diameter,
    height: diameter,
    ariaLabel: node.label,
    data: {
      label: node.label,
      sub: node.sub ?? "",
      radius: node.size,
      swatch: swatchOf(node),
      account,
    },
  };
}

export function toFlowEdge(edge: GraphEdge): AppEdge {
  return {
    id: edge.id,
    type: "flow",
    source: edge.source,
    target: edge.target,
    sourceHandle: SOURCE_HANDLE_ID,
    targetHandle: TARGET_HANDLE_ID,
    data: {
      kind: edge.kind,
      strokeWidth: edge.width,
      confidence: edge.confidence,
      volume: edge.volume,
      rate: edge.rate ?? null,
      manual: false,
    },
  };
}

/** A connection the user drew: estimated, unmeasured, low confidence. */
export function makeManualEdge(
  id: string,
  source: string,
  target: string,
): AppEdge {
  return {
    id,
    type: "flow",
    source,
    target,
    sourceHandle: SOURCE_HANDLE_ID,
    targetHandle: TARGET_HANDLE_ID,
    data: {
      kind: "estimated",
      strokeWidth: 1.5,
      confidence: 0.3,
      volume: 0,
      rate: null,
      manual: true,
    },
  };
}

export const INITIAL_NODES: AppNode[] = MOCK_NODES.map(toFlowNode);
export const INITIAL_EDGES: AppEdge[] = MOCK_EDGES.map(toFlowEdge);
