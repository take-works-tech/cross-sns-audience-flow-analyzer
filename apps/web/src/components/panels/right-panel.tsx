"use client";

import { ArrowRight, Play, X } from "lucide-react";
import { type ReactNode, useState } from "react";

import {
  Button,
  Chip,
  ConfidenceBar,
  MetricCard,
  SectionLabel,
  Segmented,
  Sparkline,
} from "@/components/ui";
import { copy } from "@/lib/copy";
import {
  DEFAULT_NODE_ID,
  DEFAULT_NODE_TITLE,
  MOCK_EDGES,
  MOCK_EDGES_BY_ID,
  MOCK_NODES_BY_ID,
  MOCK_NODE_CONNECTIONS,
  MOCK_RANKING,
  SPARK_EDGE,
  SPARK_NODE,
  SPARK_TREND,
} from "@/lib/mock/data";
import type {
  ConnectedNodeRow,
  GraphEdge,
  GraphNode,
  Platform,
  SwatchToken,
} from "@/lib/types";
import {
  PLATFORM_SWATCH,
  SWATCH_BG,
  cn,
  confidenceBand,
  formatCompact,
  formatConfidence,
  formatDelta,
  formatLag,
  formatNumber,
} from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvas-store";

/* -------------------------------------------------------------------------- */
/* copy fragments — wording still lives in copy.ts, values stay dynamic        */
/* -------------------------------------------------------------------------- */

/** "ラグ中央値 2.1h" -> "ラグ中央値 " */
const LAG_PREFIX = copy.edgeDetail.lagChip.replace(/[\d.]+h$/u, "");
/** "0.86 — 高" -> " — " */
const CONFIDENCE_SEPARATOR = copy.edgeDetail.confidenceHigh
  .replace(/^[\d.]+/u, "")
  .replace(/\S+$/u, "");
/** placeholder glyph for a metric this node does not carry */
const DASH = "—";
/** approximation marker in front of an estimated volume */
const APPROX = "~";

const CONFIDENCE_BAND_LABEL = {
  high: copy.common.high,
  mid: copy.common.mid,
  low: copy.common.low,
} as const;

/** index into copy.states.nodeTypes.labels: YouTube / Instagram / TikTok / X */
const PLATFORM_LABEL_INDEX: Record<Platform, number> = {
  youtube: 0,
  instagram: 1,
  tiktok: 2,
  x: 3,
};
const COMMERCE_LABEL_INDEX = 4;
const GENERIC_LABEL_INDEX = 5;

/* -------------------------------------------------------------------------- */
/* derivations                                                                 */
/* -------------------------------------------------------------------------- */

function swatchOf(node: GraphNode | undefined): SwatchToken {
  if (!node) return "gen";
  if (node.platform) return PLATFORM_SWATCH[node.platform];
  return node.category === "commerce" ? "com" : "gen";
}

function nodeTitle(node: GraphNode): string {
  return node.id === DEFAULT_NODE_ID ? DEFAULT_NODE_TITLE : node.label;
}

function nodeKindLabel(node: GraphNode): string {
  if (node.kind === "post" && node.platform === "youtube") {
    return copy.nodeDetail.kindLabels.youtubeVideo;
  }
  if (node.platform) {
    return copy.states.nodeTypes.labels[PLATFORM_LABEL_INDEX[node.platform]];
  }
  return node.category === "commerce"
    ? copy.states.nodeTypes.labels[COMMERCE_LABEL_INDEX]
    : copy.states.nodeTypes.labels[GENERIC_LABEL_INDEX];
}

/** Mockup fixture for yt-v1; every other node derives its list from the edges. */
function connectionsOf(node: GraphNode): ConnectedNodeRow[] {
  if (node.id === DEFAULT_NODE_ID) return MOCK_NODE_CONNECTIONS;
  return MOCK_EDGES.filter((edge) => edge.source === node.id).map((edge) => {
    const target = MOCK_NODES_BY_ID[edge.target];
    return {
      nodeId: edge.target,
      label: target?.label ?? edge.target,
      color: swatchOf(target),
      kind: edge.kind,
      value: `${edge.kind === "estimated" ? APPROX : ""}${formatNumber(
        edge.volume,
      )}${copy.common.people}`,
    };
  });
}

/* -------------------------------------------------------------------------- */
/* shell                                                                       */
/* -------------------------------------------------------------------------- */

function PanelHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-none items-center gap-2 border-b border-line-1 px-4 py-[13px]">
      {children}
    </div>
  );
}

function PanelTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="truncate text-[13.5px] font-semibold text-t1">{children}</h2>
  );
}

function PanelBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-3.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PanelFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-none gap-2 border-t border-line-1 px-4 py-3">
      {children}
    </div>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="ml-auto -mr-1 flex-none px-1.5"
      aria-label={copy.common.close}
      onClick={onClick}
    >
      <X className="size-4" strokeWidth={1.6} />
    </Button>
  );
}

function Swatch({
  color,
  className,
}: {
  color: SwatchToken;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-2.5 flex-none rounded-[3px]",
        SWATCH_BG[color],
        className,
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* 1 — ranking (no selection)                                                  */
/* -------------------------------------------------------------------------- */

function RankingPanel() {
  const setSelection = useCanvasStore((s) => s.setSelection);
  const [direction, setDirection] = useState<string>(
    copy.ranking.directions[0].value,
  );

  return (
    <>
      <PanelHeader>
        <PanelTitle>{copy.ranking.title}</PanelTitle>
        <Segmented
          className="ml-auto"
          options={copy.ranking.directions}
          value={direction}
          onChange={setDirection}
          label={copy.ranking.title}
        />
      </PanelHeader>

      <PanelBody className="gap-0.5">
        {MOCK_RANKING.map((row, index) => (
          <button
            key={row.nodeId}
            type="button"
            onClick={() => setSelection({ type: "node", id: row.nodeId })}
            className="flex items-center gap-2.5 rounded-ctl px-[9px] py-2 text-left text-[12.5px] transition-colors duration-150 ease-out-custom hover:bg-s2"
          >
            <span className="num w-4 flex-none text-[11px] text-t3">
              {index + 1}
            </span>
            <Swatch color={row.color} />
            <span className="min-w-0 flex-1 truncate text-t1">{row.label}</span>
            <span className="num flex-none text-t1">
              {formatNumber(row.value)}
            </span>
            <span
              className={cn(
                "num w-[52px] flex-none text-right text-[11px]",
                row.delta >= 0 ? "text-ok" : "text-err",
              )}
            >
              {formatDelta(row.delta)}
            </span>
          </button>
        ))}

        <div className="my-3.5 h-px flex-none bg-line-1" aria-hidden="true" />

        <SectionLabel className="mb-2.5">
          {copy.ranking.trendSection}
        </SectionLabel>
        <Sparkline points={SPARK_TREND} />
        <div className="mt-1 flex gap-3 text-[11px] text-t3">
          <span className="text-accent">{copy.ranking.legendEc}</span>
          <span>{copy.ranking.legendAll}</span>
        </div>
      </PanelBody>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 2 — node detail                                                             */
/* -------------------------------------------------------------------------- */

function NodeDetail({ node }: { node: GraphNode }) {
  const setSelection = useCanvasStore((s) => s.setSelection);
  const color = swatchOf(node);
  const metrics = node.metrics;
  const connections = connectionsOf(node);

  return (
    <>
      <PanelHeader>
        <Swatch color={color} />
        <PanelTitle>{nodeTitle(node)}</PanelTitle>
        <CloseButton onClick={() => setSelection(null)} />
      </PanelHeader>

      <PanelBody>
        {node.kind === "post" ? (
          <div className="relative h-24 flex-none rounded-card border border-line-2 bg-s0 bg-[linear-gradient(120deg,var(--color-ig-tint)_0%,var(--color-yt-tint)_45%,var(--color-accent-dim)_100%)]">
            <span
              aria-hidden="true"
              className="absolute inset-0 m-auto flex size-[34px] items-center justify-center rounded-full bg-page/70"
            >
              <Play className="size-3.5 translate-x-px fill-t1 text-t1" strokeWidth={0} />
            </span>
          </div>
        ) : null}

        <div className="flex flex-none flex-wrap gap-1.5">
          <Chip dot={SWATCH_BG[color]}>{nodeKindLabel(node)}</Chip>
          {metrics?.publishedAt ? (
            <Chip className="num">
              {metrics.publishedAt}
              {copy.nodeDetail.kindLabels.publishedSuffix}
            </Chip>
          ) : null}
        </div>

        <div className="grid flex-none grid-cols-2 gap-2">
          <MetricCard
            label={copy.nodeDetail.metrics.views}
            value={
              metrics?.views !== undefined ? formatCompact(metrics.views) : DASH
            }
          />
          <MetricCard
            label={copy.nodeDetail.metrics.avgWatch}
            value={metrics?.avgWatch ?? DASH}
          />
          <MetricCard
            label={copy.nodeDetail.metrics.inflow}
            value={
              metrics?.inflow !== undefined ? formatNumber(metrics.inflow) : DASH
            }
            unit={metrics?.inflow !== undefined ? copy.common.people : undefined}
          />
          <MetricCard
            label={copy.nodeDetail.metrics.outflow}
            value={
              metrics?.outflow !== undefined
                ? formatNumber(metrics.outflow)
                : DASH
            }
            unit={
              metrics?.outflow !== undefined ? copy.common.people : undefined
            }
          />
        </div>

        {connections.length > 0 ? (
          <div className="flex-none">
            <SectionLabel className="mb-2">
              {copy.nodeDetail.connectionsSection}
            </SectionLabel>
            <div className="flex flex-col">
              {connections.map((row) => (
                <button
                  key={`${row.nodeId}-${row.kind}`}
                  type="button"
                  onClick={() => setSelection({ type: "node", id: row.nodeId })}
                  className="flex items-center gap-2 border-b border-line-1 px-0.5 py-[7px] text-left text-[12.5px] text-t1 transition-colors duration-150 ease-out-custom last:border-b-0 hover:text-accent"
                >
                  <Swatch color={row.color} className="size-2 rounded-[2px]" />
                  <span className="min-w-0 truncate">{row.label}</span>
                  <Chip
                    tone={row.kind === "observed" ? "obs" : "est"}
                    className="flex-none text-[10px]"
                  >
                    {row.kind === "observed"
                      ? copy.common.observed
                      : copy.common.estimated}
                  </Chip>
                  <span className="num ml-auto flex-none text-xs text-t2">
                    {row.value}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex-none">
          <SectionLabel className="mb-2">
            {copy.nodeDetail.trendSection}
          </SectionLabel>
          <Sparkline points={SPARK_NODE} />
        </div>

        <div className="flex-none text-[11px] text-t3">
          {copy.nodeDetail.provenance}
        </div>
      </PanelBody>

      <PanelFooter>
        <Button size="sm" className="flex-1">
          {copy.nodeDetail.openOriginal}
        </Button>
        <Button size="sm" variant="danger">
          {copy.nodeDetail.hide}
        </Button>
      </PanelFooter>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 3 — edge detail                                                             */
/* -------------------------------------------------------------------------- */

function EdgeDetail({ edge }: { edge: GraphEdge }) {
  const setSelection = useCanvasStore((s) => s.setSelection);
  const source = MOCK_NODES_BY_ID[edge.source];
  const target = MOCK_NODES_BY_ID[edge.target];
  const band = confidenceBand(edge.confidence);

  return (
    <>
      <PanelHeader>
        <PanelTitle>{copy.edgeDetail.title}</PanelTitle>
        <CloseButton onClick={() => setSelection(null)} />
      </PanelHeader>

      <PanelBody>
        <div className="flex flex-none items-center gap-2 text-[12.5px]">
          <Chip dot={SWATCH_BG[swatchOf(source)]} className="min-w-0">
            <span className="truncate">{source?.label ?? edge.source}</span>
          </Chip>
          <ArrowRight
            className="size-4 flex-none text-accent"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          <Chip dot={SWATCH_BG[swatchOf(target)]} className="min-w-0">
            <span className="truncate">{target?.label ?? edge.target}</span>
          </Chip>
        </div>

        <div className="flex flex-none flex-wrap gap-1.5">
          <Chip tone={edge.kind === "observed" ? "obs" : "est"}>
            {edge.kind === "observed"
              ? copy.common.observed
              : copy.common.estimated}
          </Chip>
          <Chip className="num">{copy.edgeDetail.periodChip}</Chip>
          {edge.lagHours !== undefined ? (
            <Chip className="num">
              {LAG_PREFIX}
              {formatLag(edge.lagHours)}
            </Chip>
          ) : null}
        </div>

        <div className="grid flex-none grid-cols-2 gap-2">
          <MetricCard
            label={copy.edgeDetail.metrics.volume}
            value={formatNumber(edge.volume)}
            unit={copy.common.people}
          />
          <MetricCard
            label={copy.edgeDetail.metrics.rate}
            value={edge.rate !== undefined ? edge.rate.toFixed(1) : DASH}
            unit={edge.rate !== undefined ? copy.common.percent : undefined}
          />
        </div>

        <div className="flex flex-none flex-col gap-[7px]">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-t1">{copy.common.confidence}</span>
            <span className="num text-accent">
              {formatConfidence(edge.confidence)}
              {CONFIDENCE_SEPARATOR}
              {CONFIDENCE_BAND_LABEL[band]}
            </span>
          </div>
          <ConfidenceBar value={edge.confidence} />
          <div className="text-[11px] text-t3">
            {copy.edgeDetail.confidenceSources}
          </div>
        </div>

        <div className="flex-none">
          <SectionLabel className="mb-2">
            {copy.edgeDetail.trendSection}
          </SectionLabel>
          <Sparkline points={SPARK_EDGE} />
        </div>

        <p className="flex-none rounded-ctl border border-line-1 border-l-2 border-l-accent bg-s0 px-[11px] py-[9px] text-xs leading-[1.6] text-t2">
          {copy.edgeDetail.why}
        </p>
      </PanelBody>

      <PanelFooter>
        <Button size="sm" className="flex-1">
          {copy.edgeDetail.pin}
        </Button>
        <Button size="sm" variant="danger">
          {copy.edgeDetail.cut}
        </Button>
      </PanelFooter>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* entry                                                                       */
/* -------------------------------------------------------------------------- */

export function RightPanel() {
  const selection = useCanvasStore((s) => s.selection);

  const node =
    selection?.type === "node" ? MOCK_NODES_BY_ID[selection.id] : undefined;
  const edge =
    selection?.type === "edge" ? MOCK_EDGES_BY_ID[selection.id] : undefined;

  return (
    <aside className="flex min-h-0 w-[320px] flex-none flex-col border-l border-line-1 bg-s1">
      {node ? (
        <NodeDetail node={node} />
      ) : edge ? (
        <EdgeDetail edge={edge} />
      ) : (
        <RankingPanel />
      )}
    </aside>
  );
}
