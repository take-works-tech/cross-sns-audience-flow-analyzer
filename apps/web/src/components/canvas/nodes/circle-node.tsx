"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

import { SWATCH_HEX } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvas-store";

import {
  SOURCE_HANDLE_ID,
  TARGET_HANDLE_ID,
  type CircleFlowNode,
} from "../graph-model";

/**
 * Account / post node — the mockup's circular glyph:
 * soft platform halo, dark core with a coloured ring, a filled inner core,
 * then the label and mono sub-metric stacked underneath.
 */
export function CircleNode({ id, data }: NodeProps<CircleFlowNode>) {
  const selected = useCanvasStore(
    (s) => s.selection?.type === "node" && s.selection.id === id,
  );

  const r = data.radius;
  const color = SWATCH_HEX[data.swatch];
  const halo = r * 1.9;
  const box = halo * 2;
  const c = halo;
  const glow = `drop-shadow(0 0 ${r * 0.55}px color-mix(in srgb, ${color} 40%, transparent))`;

  return (
    <div
      className="relative"
      style={{ width: r * 2, height: r * 2 }}
      data-node-kind={data.account ? "account" : "post"}
    >
      <svg
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
        width={box}
        height={box}
        viewBox={`0 0 ${box} ${box}`}
        aria-hidden="true"
        focusable="false"
      >
        {selected ? (
          <circle className="flow-node-ring" cx={c} cy={c} r={r + 5} />
        ) : null}
        <circle cx={c} cy={c} r={halo} fill={color} opacity={0.07} />
        <g style={{ filter: glow }}>
          <circle
            className="flow-node-core"
            cx={c}
            cy={c}
            r={r}
            fill="var(--color-s1)"
            stroke={color}
            strokeWidth={data.account ? 2 : 1.5}
          />
          <circle
            cx={c}
            cy={c}
            r={data.account ? r * 0.55 : r * 0.4}
            fill={color}
            opacity={data.account ? 0.85 : 0.7}
          />
        </g>
      </svg>

      <div className="pointer-events-none absolute top-full left-1/2 w-max -translate-x-1/2 pt-[7px] text-center whitespace-nowrap">
        <span className="block text-[10.5px] leading-[12px] text-t2">
          {data.label}
        </span>
        <span className="num block text-[9px] leading-[12px] text-t3">
          {data.sub}
        </span>
      </div>

      <Handle type="target" id={TARGET_HANDLE_ID} position={Position.Left} />
      <Handle type="source" id={SOURCE_HANDLE_ID} position={Position.Right} />
    </div>
  );
}
