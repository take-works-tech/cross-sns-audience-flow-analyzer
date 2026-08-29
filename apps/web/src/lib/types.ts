/**
 * Shared domain types for the Cross-SNS Audience Flow Analyzer.
 * FROZEN CONTRACT — other agents import these without modification.
 */

/* -------------------------------------------------------------------------- */
/* primitives                                                                  */
/* -------------------------------------------------------------------------- */

export type Platform = "youtube" | "instagram" | "tiktok" | "x";

export type NodeKind = "account" | "post" | "url";

export type FlowKind = "observed" | "estimated";

export type UrlCategory = "commerce" | "generic";

/**
 * Token key for the identity swatch of a node / ranking row.
 * Maps 1:1 to the @theme colours: yt / ig / tt / x / com / gen.
 */
export type SwatchToken = "yt" | "ig" | "tt" | "x" | "com" | "gen";

export type ConnectionStatus = "connected" | "reauth" | "disconnected";

/* -------------------------------------------------------------------------- */
/* graph                                                                       */
/* -------------------------------------------------------------------------- */

export interface NodeMetrics {
  /** account follower count */
  followers?: number;
  /** post / video view count */
  views?: number;
  /** average watch time, pre-formatted ("4:12") */
  avgWatch?: string;
  /** total inbound audience over the active period (people) */
  inflow?: number;
  /** total outbound audience over the active period (people) */
  outflow?: number;
  /** ISO-ish publish date, pre-formatted ("2026-08-12") */
  publishedAt?: string;
  /** price label for commerce URL nodes ("¥8,900") */
  price?: string;
  /** last data refresh label ("12:04") */
  updatedAt?: string;
  /** data provenance label ("YouTube Analytics API") */
  source?: string;
}

export interface GraphNode {
  id: string;
  kind: NodeKind;
  /** set for kind 'account' | 'post' */
  platform?: Platform;
  /** set for kind 'url' */
  category?: UrlCategory;
  label: string;
  /** dense meta line under the label ("21.4K") */
  sub?: string;
  /** set for kind 'url' */
  domain?: string;
  /** canvas coordinates in the 1200x800 design viewBox */
  x: number;
  y: number;
  /** circle radius for account/post; card WIDTH for url nodes */
  size: number;
  /** card height for url nodes only */
  height?: number;
  metrics?: NodeMetrics;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: FlowKind;
  /** audience count over the active period (people) */
  volume: number;
  /** conversion share, percent (12.4 === 12.4%) */
  rate?: number;
  /** 0..1 */
  confidence: number;
  /** stroke width in px, 1.5 – 6 by volume */
  width: number;
  /** median lag between source event and target arrival */
  lagHours?: number;
}

/* -------------------------------------------------------------------------- */
/* panels                                                                      */
/* -------------------------------------------------------------------------- */

export interface RankingRow {
  nodeId: string;
  label: string;
  color: SwatchToken;
  value: number;
  /** signed percentage change; positive = ▲, negative = ▼ */
  delta: number;
}

export interface Project {
  id: string;
  name: string;
  /** node count */
  nodes: number;
  /** connection count */
  edges: number;
  updatedLabel: string;
}

/* -------------------------------------------------------------------------- */
/* connections / staging                                                       */
/* -------------------------------------------------------------------------- */

export interface Connection {
  platform: Platform;
  /** display name of the linked account */
  accountName: string;
  status: ConnectionStatus;
  /** settings-screen description line */
  description: string;
  /** connect-modal description line */
  scopeLabel: string;
}

/** A node sitting in the left panel, not yet placed on the canvas. */
export interface StagedNode {
  id: string;
  label: string;
  color: SwatchToken;
  /** short badge, e.g. "EC" / "YT" */
  meta: string;
}

/** One row of the left panel's "placed nodes" preview list. */
export interface PlacedNodeRow {
  nodeId: string;
  label: string;
  color: SwatchToken;
  meta: string;
  /** true when `meta` is a numeral and needs tabular figures */
  metaIsNumeric: boolean;
}

/** A named connection shown in the node-detail panel's mini list. */
export interface ConnectedNodeRow {
  nodeId: string;
  label: string;
  color: SwatchToken;
  kind: FlowKind;
  /** pre-formatted, may carry a "~" approximation prefix */
  value: string;
}
