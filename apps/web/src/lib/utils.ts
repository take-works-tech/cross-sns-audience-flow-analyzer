import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { FlowKind, SwatchToken } from "./types";

/** Tailwind-aware class joiner. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/* -------------------------------------------------------------------------- */
/* numerals — always render inside a `num` element                             */
/* -------------------------------------------------------------------------- */

const jaNumber = new Intl.NumberFormat("ja-JP");

/** 1284 -> "1,284" */
export function formatNumber(value: number): string {
  return jaNumber.format(value);
}

/** 21400 -> "21.4K", 96000 -> "96K", 1_200_000 -> "1.2M" */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return trimZero(value / 1_000_000) + "M";
  if (abs >= 1_000) return trimZero(value / 1_000) + "K";
  return formatNumber(value);
}

function trimZero(n: number): string {
  const s = n.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}

/** 12.4 -> "12.4%" */
export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/** 12.4 -> "▲12.4%", -2.3 -> "▼2.3%" */
export function formatDelta(value: number, digits = 1): string {
  const mark = value >= 0 ? "▲" : "▼";
  return `${mark}${Math.abs(value).toFixed(digits)}%`;
}

/** 0.86 -> "0.86" */
export function formatConfidence(value: number): string {
  return value.toFixed(2);
}

/** 2.1 -> "2.1h" */
export function formatLag(hours: number): string {
  return `${hours.toFixed(1)}h`;
}

/* -------------------------------------------------------------------------- */
/* token lookups — keeps hex out of components                                 */
/* -------------------------------------------------------------------------- */

/** Identity swatch background classes, keyed by SwatchToken. */
export const SWATCH_BG: Record<SwatchToken, string> = {
  yt: "bg-yt",
  ig: "bg-ig",
  tt: "bg-tt",
  x: "bg-x",
  com: "bg-com",
  gen: "bg-gen",
};

/** Soft platform tint used behind platform glyphs. */
export const SWATCH_TINT: Record<SwatchToken, string> = {
  yt: "bg-yt-tint text-yt",
  ig: "bg-ig-tint text-ig",
  tt: "bg-tt-tint text-tt",
  x: "bg-x-tint text-x",
  com: "bg-com-tint text-com",
  gen: "bg-gen-tint text-gen",
};

/** Platform -> swatch token. */
export const PLATFORM_SWATCH = {
  youtube: "yt",
  instagram: "ig",
  tiktok: "tt",
  x: "x",
} as const satisfies Record<string, SwatchToken>;

/** Raw hex, for canvas/SVG paint where a CSS class cannot be applied. */
export const SWATCH_HEX: Record<SwatchToken, string> = {
  yt: "var(--color-yt)",
  ig: "var(--color-ig)",
  tt: "var(--color-tt)",
  x: "var(--color-x)",
  com: "var(--color-com)",
  gen: "var(--color-gen)",
};

/** Confidence -> qualitative band. */
export function confidenceBand(value: number): "high" | "mid" | "low" {
  if (value >= 0.7) return "high";
  if (value >= 0.45) return "mid";
  return "low";
}

/** Edge opacity ramp used on the canvas: never fully transparent. */
export function edgeOpacity(confidence: number): number {
  return Math.max(0.45, confidence);
}

/** Flow kind -> chip tone. */
export function flowTone(kind: FlowKind): "obs" | "est" {
  return kind === "observed" ? "obs" : "est";
}

/** Clamp helper for sliders / normalised values. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
