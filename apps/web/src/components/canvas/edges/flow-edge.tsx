"use client";

import { useInternalNode, type EdgeProps, type InternalNode } from "@xyflow/react";

import { cn, edgeOpacity } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvas-store";

import { quadPath, type AppEdge, type AppNode } from "../graph-model";
import { usePrefersReducedMotion } from "../use-reduced-motion";
import { ESTIMATED_MARKER_ID, OBSERVED_MARKER_ID } from "./edge-markers";

/** Slowest / fastest particle traversal, in seconds. */
const BASE_DURATION = 6.5;
const MIN_DURATION = 1.4;

type Point = { x: number; y: number };

function centreOf(node: InternalNode<AppNode> | undefined): Point | null {
  if (!node) return null;
  const width = node.measured.width ?? node.width ?? 0;
  const height = node.measured.height ?? node.height ?? 0;
  return {
    x: node.internals.positionAbsolute.x + width / 2,
    y: node.internals.positionAbsolute.y + height / 2,
  };
}

/**
 * Flow edge — the mockup's offset quadratic bezier drawn centre-to-centre, so
 * the curve emerges from behind each node exactly as in the design.
 *
 * Thickness reads volume, opacity reads confidence, dash reads "estimated".
 * The travelling particles are SMIL `<animateMotion>` along the same path.
 */
export function FlowEdge({ id, source, target, data }: EdgeProps<AppEdge>) {
  const sourceNode = useInternalNode<AppNode>(source);
  const targetNode = useInternalNode<AppNode>(target);
  const selected = useCanvasStore(
    (s) => s.selection?.type === "edge" && s.selection.id === id,
  );
  const particlesOn = useCanvasStore((s) => s.particlesOn);
  const reducedMotion = usePrefersReducedMotion();

  const from = centreOf(sourceNode);
  const to = centreOf(targetNode);
  if (!from || !to || !data) return null;

  const path = quadPath(from.x, from.y, to.x, to.y);
  const observed = data.kind === "observed";
  const strokeWidth = data.strokeWidth;
  const dragging = Boolean(sourceNode?.dragging || targetNode?.dragging);

  const duration = Math.max(
    MIN_DURATION,
    BASE_DURATION - strokeWidth * 0.7,
  );
  const count = observed ? Math.max(2, Math.round(strokeWidth)) : 1;
  const showParticles = particlesOn && !reducedMotion && !dragging;

  return (
    <g className="flow-edge-group">
      <path className="flow-edge-hit" d={path} />
      <path
        className={cn(
          "flow-edge",
          observed ? "flow-edge--observed" : "flow-edge--estimated",
          selected && "flow-edge--selected",
        )}
        d={path}
        strokeWidth={strokeWidth}
        opacity={edgeOpacity(data.confidence)}
        markerEnd={`url(#${observed ? OBSERVED_MARKER_ID : ESTIMATED_MARKER_ID})`}
      />
      {showParticles ? (
        <g key={path} className="flow-particles" aria-hidden="true">
          {Array.from({ length: count }, (_, index) => (
            <circle
              key={index}
              r={observed ? 2.1 : 1.6}
              fill={
                observed
                  ? "var(--color-particle-obs)"
                  : "var(--color-particle-est)"
              }
              opacity={observed ? 0.9 : 0.4}
            >
              <animateMotion
                dur={`${duration}s`}
                repeatCount="indefinite"
                path={path}
                begin={`${((index * duration) / count).toFixed(2)}s`}
              />
            </circle>
          ))}
        </g>
      ) : null}
    </g>
  );
}
