/**
 * Fixtures lifted from docs/mockups/ui-mockup.html <script> data section.
 * Coordinates live in the 1200x800 design viewBox.
 */
import type {
  Connection,
  ConnectedNodeRow,
  GraphEdge,
  GraphNode,
  PlacedNodeRow,
  Project,
  RankingRow,
  StagedNode,
} from "@/lib/types";

/* -------------------------------------------------------------------------- */
/* nodes — 4 accounts, 8 posts, 4 url cards                                    */
/* -------------------------------------------------------------------------- */

export const MOCK_NODES: GraphNode[] = [
  // accounts
  {
    id: "yt",
    kind: "account",
    platform: "youtube",
    label: "Yuki Films",
    sub: "21.4K",
    x: 480,
    y: 300,
    size: 30,
    metrics: { followers: 21400, inflow: 388, outflow: 1016 },
  },
  {
    id: "ig",
    kind: "account",
    platform: "instagram",
    label: "yuki.films",
    sub: "12.9K",
    x: 790,
    y: 430,
    size: 25,
    metrics: { followers: 12900, inflow: 154, outflow: 236 },
  },
  {
    id: "tt",
    kind: "account",
    platform: "tiktok",
    label: "@yukifilms",
    sub: "8.1K",
    x: 295,
    y: 525,
    size: 23,
    metrics: { followers: 8100, inflow: 0, outflow: 198 },
  },
  {
    id: "x",
    kind: "account",
    platform: "x",
    label: "@yuki_films",
    sub: "3.2K",
    x: 645,
    y: 165,
    size: 20,
    metrics: { followers: 3200, inflow: 64, outflow: 142 },
  },

  // posts
  {
    id: "yt-v1",
    kind: "post",
    platform: "youtube",
    label: "Vlog #42 京都",
    sub: "48.2K",
    x: 565,
    y: 435,
    size: 16,
    metrics: {
      views: 48200,
      avgWatch: "4:12",
      inflow: 1832,
      outflow: 1284,
      publishedAt: "2026-08-12",
      updatedAt: "12:04",
      source: "YouTube Analytics API",
    },
  },
  {
    id: "yt-v2",
    kind: "post",
    platform: "youtube",
    label: "機材紹介 2026",
    sub: "12.6K",
    x: 365,
    y: 180,
    size: 14,
    metrics: { views: 12600, avgWatch: "6:38", inflow: 210, outflow: 96 },
  },
  {
    id: "yt-s1",
    kind: "post",
    platform: "youtube",
    label: "ショート",
    sub: "96K",
    x: 610,
    y: 305,
    size: 11,
    metrics: { views: 96000, avgWatch: "0:22", inflow: 0, outflow: 402 },
  },
  {
    id: "ig-r1",
    kind: "post",
    platform: "instagram",
    label: "リール 8/18",
    sub: "22K",
    x: 885,
    y: 300,
    size: 13,
    metrics: { views: 22000, inflow: 236, outflow: 214 },
  },
  {
    id: "ig-p1",
    kind: "post",
    platform: "instagram",
    label: "投稿 8/25",
    sub: "3.4K",
    x: 865,
    y: 555,
    size: 11,
    metrics: { views: 3400, inflow: 0, outflow: 84 },
  },
  {
    id: "tt-v1",
    kind: "post",
    platform: "tiktok",
    label: "TikTok 8/15",
    sub: "31K",
    x: 175,
    y: 405,
    size: 13,
    metrics: { views: 31000, inflow: 198, outflow: 176 },
  },
  {
    id: "tt-v2",
    kind: "post",
    platform: "tiktok",
    label: "TikTok 8/22",
    sub: "12K",
    x: 245,
    y: 655,
    size: 11,
    metrics: { views: 12000, inflow: 0, outflow: 104 },
  },
  {
    id: "x-p1",
    kind: "post",
    platform: "x",
    label: "ポスト 8/27",
    sub: "41K",
    x: 500,
    y: 85,
    size: 10,
    metrics: { views: 41000, inflow: 142, outflow: 128 },
  },

  // url cards
  {
    id: "shop",
    kind: "url",
    category: "commerce",
    label: "ショップTop",
    domain: "yukifilms.shop",
    x: 990,
    y: 480,
    size: 120,
    height: 40,
    metrics: { inflow: 946, outflow: 402 },
  },
  {
    id: "prod1",
    kind: "url",
    category: "commerce",
    label: "Lens Filter Kit",
    domain: "yukifilms.shop",
    x: 1040,
    y: 300,
    size: 132,
    height: 40,
    metrics: { inflow: 1284, price: "¥8,900" },
  },
  {
    id: "blog",
    kind: "url",
    category: "generic",
    label: "機材まとめ記事",
    domain: "blog.yukifilms.jp",
    x: 150,
    y: 225,
    size: 118,
    height: 40,
    metrics: { inflow: 412 },
  },
  {
    id: "discord",
    kind: "url",
    category: "generic",
    label: "コミュニティ",
    domain: "discord.gg",
    x: 895,
    y: 665,
    size: 108,
    height: 40,
    metrics: { inflow: 189 },
  },
];

export const MOCK_NODES_BY_ID: Record<string, GraphNode> = Object.fromEntries(
  MOCK_NODES.map((n) => [n.id, n]),
);

/* -------------------------------------------------------------------------- */
/* edges — 14                                                                  */
/* -------------------------------------------------------------------------- */

export const MOCK_EDGES: GraphEdge[] = [
  {
    id: "e-yt-v1-prod1",
    source: "yt-v1",
    target: "prod1",
    kind: "observed",
    volume: 1284,
    rate: 12.4,
    confidence: 0.86,
    width: 5,
    lagHours: 2.1,
  },
  {
    id: "e-yt-shop",
    source: "yt",
    target: "shop",
    kind: "observed",
    volume: 628,
    rate: 2.9,
    confidence: 0.8,
    width: 3.5,
    lagHours: 6.4,
  },
  {
    id: "e-yt-s1-yt-v1",
    source: "yt-s1",
    target: "yt-v1",
    kind: "observed",
    volume: 402,
    rate: 0.4,
    confidence: 0.9,
    width: 2.5,
    lagHours: 0.8,
  },
  {
    id: "e-ig-ig-r1",
    source: "ig",
    target: "ig-r1",
    kind: "observed",
    volume: 236,
    rate: 1.8,
    confidence: 0.85,
    width: 2,
    lagHours: 3.2,
  },
  {
    id: "e-ig-r1-shop",
    source: "ig-r1",
    target: "shop",
    kind: "estimated",
    volume: 214,
    rate: 1,
    confidence: 0.55,
    width: 3,
    lagHours: 5.5,
  },
  {
    id: "e-tt-tt-v1",
    source: "tt",
    target: "tt-v1",
    kind: "observed",
    volume: 198,
    rate: 2.4,
    confidence: 0.85,
    width: 2,
    lagHours: 1.6,
  },
  {
    id: "e-tt-v1-yt",
    source: "tt-v1",
    target: "yt",
    kind: "estimated",
    volume: 176,
    rate: 0.6,
    confidence: 0.5,
    width: 2.5,
    lagHours: 9,
  },
  {
    id: "e-x-x-p1",
    source: "x",
    target: "x-p1",
    kind: "observed",
    volume: 142,
    rate: 4.4,
    confidence: 0.85,
    width: 1.5,
    lagHours: 1.1,
  },
  {
    id: "e-x-p1-blog",
    source: "x-p1",
    target: "blog",
    kind: "observed",
    volume: 128,
    rate: 0.3,
    confidence: 0.75,
    width: 2,
    lagHours: 2.8,
  },
  {
    id: "e-yt-v2-blog",
    source: "yt-v2",
    target: "blog",
    kind: "estimated",
    volume: 96,
    rate: 0.8,
    confidence: 0.45,
    width: 1.5,
    lagHours: 12.5,
  },
  {
    id: "e-ig-p1-discord",
    source: "ig-p1",
    target: "discord",
    kind: "estimated",
    volume: 84,
    rate: 2.5,
    confidence: 0.4,
    width: 1.5,
    lagHours: 8.2,
  },
  {
    id: "e-tt-v2-shop",
    source: "tt-v2",
    target: "shop",
    kind: "estimated",
    volume: 104,
    rate: 0.9,
    confidence: 0.45,
    width: 2,
    lagHours: 7.4,
  },
  {
    id: "e-yt-x",
    source: "yt",
    target: "x",
    kind: "estimated",
    volume: 64,
    rate: 0.3,
    confidence: 0.35,
    width: 1.5,
    lagHours: 18,
  },
  {
    id: "e-shop-prod1",
    source: "shop",
    target: "prod1",
    kind: "observed",
    volume: 402,
    rate: 42.5,
    confidence: 0.9,
    width: 2.5,
    lagHours: 0.4,
  },
];

export const MOCK_EDGES_BY_ID: Record<string, GraphEdge> = Object.fromEntries(
  MOCK_EDGES.map((e) => [e.id, e]),
);

/* -------------------------------------------------------------------------- */
/* ranking — 7 rows                                                            */
/* -------------------------------------------------------------------------- */

export const MOCK_RANKING: RankingRow[] = [
  { nodeId: "prod1", label: "Lens Filter Kit", color: "com", value: 1284, delta: 12.4 },
  { nodeId: "shop", label: "yukifilms.shop", color: "com", value: 946, delta: 8.1 },
  { nodeId: "yt-v1", label: "Vlog #42 京都", color: "yt", value: 812, delta: 21.9 },
  { nodeId: "blog", label: "ブログ: 機材まとめ", color: "gen", value: 412, delta: -2.3 },
  { nodeId: "yt", label: "Yuki Films", color: "yt", value: 388, delta: 4.6 },
  { nodeId: "discord", label: "Discord コミュニティ", color: "gen", value: 189, delta: 4 },
  { nodeId: "ig", label: "yuki.films", color: "ig", value: 154, delta: -1.1 },
];

/* -------------------------------------------------------------------------- */
/* spark series — 30 points each                                               */
/* -------------------------------------------------------------------------- */

/** "トピック別トレンド" — also drives the timeline histogram bars. */
export const SPARK_TREND: number[] = [
  12, 14, 11, 16, 22, 19, 24, 28, 26, 34, 31, 38, 45, 42, 58, 52, 61, 72, 68,
  84, 90, 86, 102, 96, 110, 118, 112, 124, 131, 128,
];

/** node-detail "流入の推移（30日）" */
export const SPARK_NODE: number[] = [
  4, 6, 5, 9, 8, 14, 12, 18, 26, 22, 38, 64, 58, 49, 42, 36, 31, 28, 24, 26, 22,
  19, 18, 16, 15, 14, 12, 13, 11, 12,
];

/** edge-detail "流入の推移" */
export const SPARK_EDGE: number[] = [
  2, 3, 2, 5, 4, 8, 7, 12, 22, 18, 34, 58, 52, 44, 38, 31, 26, 24, 20, 22, 18,
  16, 15, 13, 12, 11, 10, 11, 9, 10,
];

/** Timeline histogram heights (same series as SPARK_TREND). */
export const TIMELINE_BARS: number[] = SPARK_TREND;

/* -------------------------------------------------------------------------- */
/* connections                                                                 */
/* -------------------------------------------------------------------------- */

export const MOCK_CONNECTIONS: Connection[] = [
  {
    platform: "youtube",
    accountName: "Yuki Films",
    status: "connected",
    description: "YouTube ・ 読み取り + アナリティクス",
    scopeLabel: "Yuki Films ・ Data + Analytics API",
  },
  {
    platform: "instagram",
    accountName: "yuki.films",
    status: "connected",
    description: "Instagram ・ インサイト",
    scopeLabel: "yuki.films ・ プロアカウントが必要",
  },
  {
    platform: "tiktok",
    accountName: "@yukifilms",
    status: "reauth",
    description: "TikTok ・ トークン期限切れ",
    scopeLabel: "@yukifilms ・ トークン期限切れ",
  },
  {
    platform: "x",
    accountName: "X",
    status: "disconnected",
    description: "未接続",
    scopeLabel: "読み取り権限のみ ・ APIプラン準拠",
  },
];

/** Left-panel row label for the not-yet-connected X account. */
export const CONNECT_X_LABEL = "X を連携";

/* -------------------------------------------------------------------------- */
/* left panel lists                                                            */
/* -------------------------------------------------------------------------- */

export const MOCK_STAGED_NODES: StagedNode[] = [
  { id: "staged-tripod", label: "Tripod Pro 商品ページ", color: "com", meta: "EC" },
  { id: "staged-lighting", label: "動画「照明の基礎」", color: "yt", meta: "YT" },
];

export const MOCK_PLACED_PREVIEW: PlacedNodeRow[] = [
  { nodeId: "yt", label: "Yuki Films", color: "yt", meta: "21.4K", metaIsNumeric: true },
  { nodeId: "yt-v1", label: "Vlog #42 京都", color: "yt", meta: "48.2K", metaIsNumeric: true },
  { nodeId: "ig", label: "yuki.films", color: "ig", meta: "12.9K", metaIsNumeric: true },
  { nodeId: "shop", label: "yukifilms.shop", color: "com", meta: "EC", metaIsNumeric: false },
];

export const MOCK_PLACED_COUNT = MOCK_NODES.length; // 16
export const MOCK_STAGED_COUNT = MOCK_STAGED_NODES.length; // 2

/* -------------------------------------------------------------------------- */
/* node-detail mini list ("主な接続先" for yt-v1)                               */
/* -------------------------------------------------------------------------- */

export const MOCK_NODE_CONNECTIONS: ConnectedNodeRow[] = [
  { nodeId: "prod1", label: "Lens Filter Kit", color: "com", kind: "observed", value: "1,284人" },
  { nodeId: "shop", label: "yukifilms.shop", color: "com", kind: "observed", value: "318人" },
  { nodeId: "blog", label: "ブログ: 機材まとめ", color: "gen", kind: "estimated", value: "~96人" },
];

/** Default node shown when the node-detail panel opens with no selection. */
export const DEFAULT_NODE_ID = "yt-v1";
/** Default edge shown when the edge-detail panel opens with no selection. */
export const DEFAULT_EDGE_ID = "e-yt-v1-prod1";
/** Node-detail header title in the mockup ("Vlog #42 京都で撮る"). */
export const DEFAULT_NODE_TITLE = "Vlog #42 京都で撮る";

/* -------------------------------------------------------------------------- */
/* projects                                                                    */
/* -------------------------------------------------------------------------- */

export const MOCK_PROJECTS: Project[] = [
  { id: "main", name: "メインSNS分析", nodes: 16, edges: 14, updatedLabel: "2分前に更新" },
  { id: "product-a", name: "商品A 導線分析", nodes: 9, edges: 7, updatedLabel: "昨日" },
  { id: "summer-campaign", name: "夏キャンペーン比較", nodes: 21, edges: 26, updatedLabel: "8/20" },
];

export const DEFAULT_PROJECT_ID = "main";
