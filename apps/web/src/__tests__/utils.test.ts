import { describe, expect, it } from "vitest";

import {
  PLATFORM_SWATCH,
  SWATCH_BG,
  SWATCH_HEX,
  SWATCH_TINT,
  clamp,
  cn,
  confidenceBand,
  edgeOpacity,
  flowTone,
  formatCompact,
  formatConfidence,
  formatDelta,
  formatLag,
  formatNumber,
  formatPercent,
} from "@/lib/utils";
import type { SwatchToken } from "@/lib/types";

const SWATCHES: SwatchToken[] = ["yt", "ig", "tt", "x", "com", "gen"];

describe("formatNumber", () => {
  it("groups thousands with a comma", () => {
    expect(formatNumber(1284)).toBe("1,284");
  });

  it("leaves values under 1000 ungrouped", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(7)).toBe("7");
    expect(formatNumber(946)).toBe("946");
  });

  it("groups every 3 digits", () => {
    expect(formatNumber(21400)).toBe("21,400");
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("keeps the sign on negative values", () => {
    expect(formatNumber(-1284)).toBe("-1,284");
  });
});

describe("formatCompact", () => {
  it("abbreviates thousands and millions, trimming a trailing .0", () => {
    expect(formatCompact(21400)).toBe("21.4K");
    expect(formatCompact(96000)).toBe("96K");
    expect(formatCompact(1_200_000)).toBe("1.2M");
  });

  it("falls back to formatNumber below 1000", () => {
    expect(formatCompact(946)).toBe("946");
  });
});

describe("percent / delta / confidence / lag", () => {
  it("formatPercent honours the digit count", () => {
    expect(formatPercent(12.4)).toBe("12.4%");
    expect(formatPercent(12.4, 0)).toBe("12%");
  });

  it("formatDelta marks direction and drops the sign", () => {
    expect(formatDelta(12.4)).toBe("▲12.4%");
    expect(formatDelta(-2.3)).toBe("▼2.3%");
    expect(formatDelta(0)).toBe("▲0.0%");
  });

  it("formatConfidence always shows 2 decimals", () => {
    expect(formatConfidence(0.86)).toBe("0.86");
    expect(formatConfidence(0.9)).toBe("0.90");
  });

  it("formatLag appends h with 1 decimal", () => {
    expect(formatLag(2.1)).toBe("2.1h");
    expect(formatLag(6)).toBe("6.0h");
  });
});

describe("derivations", () => {
  it("confidenceBand splits at 0.7 / 0.45", () => {
    expect(confidenceBand(0.86)).toBe("high");
    expect(confidenceBand(0.7)).toBe("high");
    expect(confidenceBand(0.69)).toBe("mid");
    expect(confidenceBand(0.45)).toBe("mid");
    expect(confidenceBand(0.44)).toBe("low");
  });

  it("edgeOpacity never falls below 0.45", () => {
    expect(edgeOpacity(0.3)).toBe(0.45);
    expect(edgeOpacity(0.86)).toBe(0.86);
  });

  it("flowTone maps the flow kind to a chip tone", () => {
    expect(flowTone("observed")).toBe("obs");
    expect(flowTone("estimated")).toBe("est");
  });

  it("clamp bounds on both ends", () => {
    expect(clamp(5, 0, 100)).toBe(5);
    expect(clamp(-5, 0, 100)).toBe(0);
    expect(clamp(500, 0, 100)).toBe(100);
  });
});

describe("cn", () => {
  it("joins and de-duplicates conflicting tailwind classes", () => {
    expect(cn("px-2", "px-3")).toBe("px-3");
    expect(cn("text-t1", false && "text-t2", undefined)).toBe("text-t1");
  });
});

describe("token lookup tables", () => {
  it("covers every swatch token", () => {
    for (const token of SWATCHES) {
      expect(SWATCH_BG[token]).toBe(`bg-${token}`);
      expect(SWATCH_TINT[token]).toContain(`bg-${token}-tint`);
      expect(SWATCH_HEX[token]).toBe(`var(--color-${token})`);
    }
  });

  it("maps every platform to a swatch token", () => {
    expect(PLATFORM_SWATCH).toEqual({
      youtube: "yt",
      instagram: "ig",
      tiktok: "tt",
      x: "x",
    });
  });
});
