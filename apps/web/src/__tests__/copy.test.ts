import { describe, expect, it } from "vitest";

import { copy } from "@/lib/copy";

/** Every section the app is contractually required to ship. */
const REQUIRED_SECTIONS = [
  "common",
  "topBar",
  "login",
  "onboarding",
  "leftPanel",
  "canvas",
  "filters",
  "ranking",
  "nodeDetail",
  "edgeDetail",
  "projects",
  "settings",
  "states",
  "modals",
] as const;

type Leaf = { path: string; value: unknown };

/** Depth-first walk that yields every non-object value with its dotted path. */
function leaves(value: unknown, path = ""): Leaf[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => leaves(item, `${path}[${index}]`));
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(
      ([key, child]) => leaves(child, path ? `${path}.${key}` : key),
    );
  }
  return [{ path, value }];
}

const ALL_LEAVES = leaves(copy);

describe("copy dictionary — structure", () => {
  it("exposes every required section as a non-empty object", () => {
    for (const section of REQUIRED_SECTIONS) {
      expect(copy, `missing section: ${section}`).toHaveProperty(section);
      const value = copy[section] as unknown;
      expect(typeof value).toBe("object");
      expect(Object.keys(value as object).length).toBeGreaterThan(0);
    }
  });

  it("has no sections beyond the contract", () => {
    expect(Object.keys(copy).sort()).toEqual([...REQUIRED_SECTIONS].sort());
  });

  it("actually contains strings to check", () => {
    expect(ALL_LEAVES.length).toBeGreaterThan(150);
  });
});

describe("copy dictionary — completeness", () => {
  it("every leaf is a string", () => {
    const nonStrings = ALL_LEAVES.filter(
      (leaf) => typeof leaf.value !== "string",
    ).map((leaf) => `${leaf.path} = ${String(leaf.value)}`);
    expect(nonStrings).toEqual([]);
  });

  it("no leaf is empty or whitespace-only", () => {
    const empty = ALL_LEAVES.filter(
      (leaf) => typeof leaf.value === "string" && leaf.value.trim() === "",
    ).map((leaf) => leaf.path);
    expect(empty).toEqual([]);
  });

  it("no leaf carries accidental padding", () => {
    /**
     * Affixes are concatenated onto a value at render time
     * ("2026-08-12" + " 公開"), so their leading space is intentional.
     */
    const INTENTIONAL_AFFIXES = ["nodeDetail.kindLabels.publishedSuffix"];

    const padded = ALL_LEAVES.filter(
      (leaf) =>
        typeof leaf.value === "string" &&
        leaf.value !== leaf.value.trim() &&
        !INTENTIONAL_AFFIXES.includes(leaf.path),
    ).map((leaf) => leaf.path);
    expect(padded).toEqual([]);
  });

  it("no placeholder text was left behind", () => {
    const placeholder = /TODO|FIXME|Lorem ipsum|xxx|ダミー/i;
    const offenders = ALL_LEAVES.filter(
      (leaf) => typeof leaf.value === "string" && placeholder.test(leaf.value),
    ).map((leaf) => leaf.path);
    expect(offenders).toEqual([]);
  });

  it("carries no emoji (design system forbids them)", () => {
    const emoji = /\p{Extended_Pictographic}/u;
    const offenders = ALL_LEAVES.filter(
      (leaf) => typeof leaf.value === "string" && emoji.test(leaf.value),
    ).map((leaf) => leaf.path);
    expect(offenders).toEqual([]);
  });
});

describe("copy dictionary — option lists", () => {
  it("every {value,label} option pair is populated", () => {
    const lists: { path: string; items: readonly unknown[] }[] = [
      { path: "topBar.periods", items: copy.topBar.periods },
      { path: "ranking.directions", items: copy.ranking.directions },
      {
        path: "modals.addUrl.destinations",
        items: copy.modals.addUrl.destinations,
      },
    ];

    for (const { path, items } of lists) {
      expect(items.length, `${path} is empty`).toBeGreaterThan(0);
      for (const [index, item] of items.entries()) {
        const option = item as { value?: string; label?: string };
        expect(typeof option.value, `${path}[${index}].value`).toBe("string");
        expect(typeof option.label, `${path}[${index}].label`).toBe("string");
        expect(option.value).not.toBe("");
        expect(option.label).not.toBe("");
      }
    }
  });

  it("topBar.defaultPeriod points at a real period option", () => {
    const values = copy.topBar.periods.map((p) => p.value);
    expect(values).toContain(copy.topBar.defaultPeriod);
  });

  it("onboarding ships three fully-populated cards", () => {
    expect(copy.onboarding.cards).toHaveLength(3);
    for (const card of copy.onboarding.cards) {
      expect(card.id).not.toBe("");
      expect(card.title).not.toBe("");
      expect(card.body).not.toBe("");
    }
  });

  it("leftPanel ships four filter templates", () => {
    expect(copy.leftPanel.templates).toHaveLength(4);
    expect(new Set(copy.leftPanel.templates).size).toBe(4);
  });

  it("login headline is a two-line tuple", () => {
    expect(copy.login.headline).toHaveLength(2);
  });
});
