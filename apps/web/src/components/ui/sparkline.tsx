"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

export interface SparklineProps {
  points: number[];
  className?: string;
}

const W = 280;
const H = 56;

export function Sparkline({ points, className }: SparklineProps) {
  const gradientId = useId();

  if (points.length < 2) return null;

  const max = Math.max(...points) || 1;
  const xy = points.map<[number, number]>((v, i) => [
    (i * W) / (points.length - 1),
    H - 6 - (v / max) * (H - 14),
  ]);
  const line = xy.map((p) => p.join(",")).join(" ");
  const last = xy[xy.length - 1];

  const grid: number[] = [];
  for (let gy = 12; gy < H; gy += 16) grid.push(gy);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("h-14 w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((gy) => (
        <line
          key={gy}
          x1={0}
          y1={gy}
          x2={W}
          y2={gy}
          stroke="var(--color-line-1)"
          strokeWidth={1}
        />
      ))}
      <polygon
        points={`0,${H} ${line} ${W},${H}`}
        fill={`url(#${gradientId})`}
      />
      <polyline
        points={line}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={2.6} fill="var(--color-accent)" />
    </svg>
  );
}
