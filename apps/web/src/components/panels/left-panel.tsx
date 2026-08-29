"use client";

import { ChevronDown, ChevronUp, Link2, X as XGlyph } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import {
  Button,
  Chip,
  Field,
  fieldInputClass,
  SectionLabel,
} from "@/components/ui";
import { copy } from "@/lib/copy";
import {
  CONNECT_X_LABEL,
  MOCK_CONNECTIONS,
  MOCK_NODES,
  MOCK_PLACED_COUNT,
  MOCK_PLACED_PREVIEW,
  MOCK_STAGED_COUNT,
  MOCK_STAGED_NODES,
} from "@/lib/mock/data";
import type {
  Connection,
  ConnectionStatus,
  GraphNode,
  Platform,
  SwatchToken,
} from "@/lib/types";
import { cn, PLATFORM_SWATCH, SWATCH_BG, SWATCH_TINT } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvas-store";

/* -------------------------------------------------------------------------- */
/* platform glyphs                                                             */
/* lucide v1 no longer ships brand marks, so YT/IG/TT reuse the mockup's own    */
/* 24x24 stroke paths; X is lucide's cross, identical to the mockup glyph.      */
/* -------------------------------------------------------------------------- */

const GLYPH_CLASS = "size-4";

/** Shared lucide-shaped SVG wrapper: 24-box, 1.6 stroke, round joins. */
function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={GLYPH_CLASS}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const PLATFORM_PATHS: Record<Platform, ReactNode> = {
  youtube: (
    <>
      <path d="m10 9 5 3-5 3V9z" fill="currentColor" stroke="none" />
      <rect x="3" y="6" width="18" height="12" rx="3" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: <path d="M14 4v9.5a4.5 4.5 0 1 1-3-4.24M14 4c.5 2.5 2 4 4.5 4.5" />,
  x: null,
};

function PlatformGlyph({ platform }: { platform: Platform }) {
  if (platform === "x") {
    return <XGlyph className={GLYPH_CLASS} strokeWidth={1.6} aria-hidden="true" />;
  }
  return <Glyph>{PLATFORM_PATHS[platform]}</Glyph>;
}

/* -------------------------------------------------------------------------- */
/* row helpers                                                                 */
/* -------------------------------------------------------------------------- */

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connected: copy.leftPanel.connected,
  reauth: copy.leftPanel.reauth,
  disconnected: copy.leftPanel.connect,
};

/** dot colour utility per status — disconnected shows an accent call-to-action */
const STATUS_DOT: Record<ConnectionStatus, string | null> = {
  connected: "bg-ok",
  reauth: "bg-warn",
  disconnected: null,
};

const rowBase =
  "flex w-full items-center gap-[9px] rounded-ctl px-2 py-[7px] text-left " +
  "transition-colors duration-150 ease-out-custom hover:bg-s2";

function nodeSwatch(node: GraphNode): SwatchToken {
  if (node.kind === "url") return node.category === "commerce" ? "com" : "gen";
  return node.platform ? PLATFORM_SWATCH[node.platform] : "gen";
}

function Swatch({ color }: { color: SwatchToken }) {
  return (
    <span
      className={cn("size-[9px] flex-none rounded-[3px]", SWATCH_BG[color])}
      aria-hidden="true"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* sections                                                                    */
/* -------------------------------------------------------------------------- */

function ConnectionRow({ connection }: { connection: Connection }) {
  const setModal = useCanvasStore((s) => s.setModal);
  const swatch = PLATFORM_SWATCH[connection.platform];
  const label =
    connection.status === "disconnected"
      ? CONNECT_X_LABEL
      : connection.accountName;
  const dot = STATUS_DOT[connection.status];

  return (
    <li>
      <button
        type="button"
        onClick={() => setModal("connect")}
        className={cn(rowBase, "text-[13px] text-t1")}
      >
        <span
          className={cn(
            "flex size-[26px] flex-none items-center justify-center rounded-[7px]",
            SWATCH_TINT[swatch],
          )}
        >
          <PlatformGlyph platform={connection.platform} />
        </span>
        <span className="min-w-0 truncate">{label}</span>
        <span
          className={cn(
            "ml-auto flex flex-none items-center gap-[5px] text-[11px]",
            connection.status === "disconnected" ? "text-accent" : "text-t3",
          )}
        >
          {dot ? (
            <span
              className={cn("size-1.5 rounded-full", dot)}
              aria-hidden="true"
            />
          ) : null}
          {STATUS_LABEL[connection.status]}
        </span>
      </button>
    </li>
  );
}

function ConnectionsSection() {
  return (
    <section>
      <SectionLabel className="mb-2">{copy.leftPanel.connections}</SectionLabel>
      <ul>
        {MOCK_CONNECTIONS.map((connection) => (
          <ConnectionRow key={connection.platform} connection={connection} />
        ))}
      </ul>
    </section>
  );
}

function AddUrlSection() {
  const setModal = useCanvasStore((s) => s.setModal);
  const open = () => setModal("add-url");

  return (
    <section>
      <SectionLabel className="mb-2">{copy.leftPanel.addUrl}</SectionLabel>
      <Field
        className="cursor-pointer"
        icon={<Link2 className="size-4" strokeWidth={1.6} />}
        onClick={open}
      >
        <input
          className={cn(fieldInputClass, "cursor-pointer")}
          placeholder={copy.leftPanel.urlPlaceholder}
          aria-label={copy.leftPanel.urlLabel}
          readOnly
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              open();
            }
          }}
        />
      </Field>
    </section>
  );
}

function StagedSection() {
  return (
    <section>
      <SectionLabel className="mb-2">
        {copy.leftPanel.unplaced}{" "}
        <span className="num text-t3">{MOCK_STAGED_COUNT}</span>
      </SectionLabel>
      <ul>
        {MOCK_STAGED_NODES.map((node) => (
          <li
            key={node.id}
            draggable
            className={cn(
              rowBase,
              "cursor-grab border border-dashed border-transparent text-[12.5px]",
              "text-t1 hover:border-line-2 active:cursor-grabbing",
            )}
          >
            <Swatch color={node.color} />
            <span className="min-w-0 truncate">{node.label}</span>
            <span className="ml-auto flex-none text-[11px] text-t3">
              {node.meta}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-1.5 text-[11px] text-t3">{copy.leftPanel.unplacedHint}</p>
    </section>
  );
}

function PlacedRow({
  nodeId,
  label,
  color,
  meta,
  metaIsNumeric,
}: {
  nodeId: string;
  label: string;
  color: SwatchToken;
  meta: string;
  metaIsNumeric: boolean;
}) {
  const selection = useCanvasStore((s) => s.selection);
  const setSelection = useCanvasStore((s) => s.setSelection);
  const selected = selection?.type === "node" && selection.id === nodeId;

  return (
    <li>
      <button
        type="button"
        aria-current={selected ? "true" : undefined}
        onClick={() => setSelection({ type: "node", id: nodeId })}
        className={cn(
          rowBase,
          "border border-dashed border-transparent text-[12.5px] text-t1 hover:border-line-2",
          selected && "border-line-2 bg-s2",
        )}
      >
        <Swatch color={color} />
        <span className="min-w-0 truncate">{label}</span>
        <span
          className={cn(
            "ml-auto flex-none text-[11px] text-t3",
            metaIsNumeric && "num",
          )}
        >
          {meta}
        </span>
      </button>
    </li>
  );
}

function PlacedSection() {
  const [expanded, setExpanded] = useState(false);

  const rows = expanded
    ? MOCK_NODES.map((node) => ({
        nodeId: node.id,
        label: node.label,
        color: nodeSwatch(node),
        meta: node.sub ?? node.domain ?? "",
        metaIsNumeric: Boolean(node.sub),
      }))
    : MOCK_PLACED_PREVIEW;

  return (
    <section>
      <SectionLabel className="mb-2">
        {copy.leftPanel.placed}{" "}
        <span className="num text-t3">{MOCK_PLACED_COUNT}</span>
      </SectionLabel>
      <ul>
        {rows.map((row) => (
          <PlacedRow key={row.nodeId} {...row} />
        ))}
      </ul>
      <Button
        variant="ghost"
        size="sm"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
        className="mt-1 text-t3"
      >
        {copy.common.showAll}
        {expanded ? (
          <ChevronUp className="size-3" strokeWidth={1.6} aria-hidden="true" />
        ) : (
          <ChevronDown className="size-3" strokeWidth={1.6} aria-hidden="true" />
        )}
      </Button>
    </section>
  );
}

function TemplatesSection() {
  const setDrawerOpen = useCanvasStore((s) => s.setDrawerOpen);

  return (
    <section>
      <SectionLabel className="mb-2">
        {copy.leftPanel.filterTemplates}
      </SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {copy.leftPanel.templates.map((template) => (
          <button
            key={template}
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="group rounded-full"
          >
            <Chip className="transition-colors duration-150 ease-out-custom group-hover:border-accent group-hover:text-accent">
              {template}
            </Chip>
          </button>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export function LeftPanel() {
  return (
    <aside className="flex w-[272px] flex-none flex-col gap-4 overflow-y-auto border-r border-line-1 bg-s1 p-3.5">
      <ConnectionsSection />
      <AddUrlSection />
      <StagedSection />
      <PlacedSection />
      <TemplatesSection />
    </aside>
  );
}
