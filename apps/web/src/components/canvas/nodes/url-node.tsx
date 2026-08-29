"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

import { SWATCH_HEX } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvas-store";

import {
  SOURCE_HANDLE_ID,
  TARGET_HANDLE_ID,
  type UrlFlowNode,
} from "../graph-model";

/**
 * URL node — a rounded-rect card (7px radius) on s2, a 7px identity dot, the
 * page title and its mono domain. Commerce destinations carry an amber-tinted
 * border; everything else a quiet slate one.
 */
export function UrlNode({ id, data }: NodeProps<UrlFlowNode>) {
  const selected = useCanvasStore(
    (s) => s.selection?.type === "node" && s.selection.id === id,
  );

  const color = SWATCH_HEX[data.swatch];
  const borderColor = data.commerce
    ? "color-mix(in srgb, var(--color-com) 55%, transparent)"
    : "color-mix(in srgb, var(--color-gen) 40%, transparent)";

  return (
    <div
      className="relative"
      style={{ width: data.cardWidth, height: data.cardHeight }}
      data-node-kind="url"
    >
      {selected ? (
        <span
          className="pointer-events-none absolute -inset-[4px] rounded-[10px] border-[1.5px] border-dashed border-accent"
          aria-hidden="true"
        />
      ) : null}

      <div
        className="flow-node-core flex h-full w-full items-center gap-[7.5px] rounded-[7px] border bg-s2 pr-2.5 pl-[9.5px]"
        style={{ borderColor }}
      >
        <span
          className="size-[7px] flex-none rounded-full"
          style={{ background: color }}
          aria-hidden="true"
        />
        <span className="min-w-0">
          <span className="block truncate text-[10.5px] leading-[13px] font-medium text-t1">
            {data.label}
          </span>
          <span className="num block truncate text-[8.5px] leading-[11px] text-t3">
            {data.domain}
          </span>
        </span>
      </div>

      <Handle type="target" id={TARGET_HANDLE_ID} position={Position.Left} />
      <Handle type="source" id={SOURCE_HANDLE_ID} position={Position.Right} />
    </div>
  );
}
