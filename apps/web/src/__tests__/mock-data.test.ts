import { describe, expect, it } from "vitest";

import {
  DEFAULT_EDGE_ID,
  DEFAULT_NODE_ID,
  DEFAULT_PROJECT_ID,
  MOCK_CONNECTIONS,
  MOCK_EDGES,
  MOCK_EDGES_BY_ID,
  MOCK_NODES,
  MOCK_NODES_BY_ID,
  MOCK_NODE_CONNECTIONS,
  MOCK_PLACED_COUNT,
  MOCK_PLACED_PREVIEW,
  MOCK_PROJECTS,
  MOCK_RANKING,
  MOCK_STAGED_COUNT,
  MOCK_STAGED_NODES,
  SPARK_EDGE,
  SPARK_NODE,
  SPARK_TREND,
  TIMELINE_BARS,
} from "@/lib/mock/data";
import type { NodeKind, SwatchToken } from "@/lib/types";

const SWATCHES: SwatchToken[] = ["yt", "ig", "tt", "x", "com", "gen"];

function countKind(kind: NodeKind): number {
  return MOCK_NODES.filter((n) => n.kind === kind).length;
}

describe("mock nodes", () => {
  it("ships 16 nodes: 4 accounts, 8 posts, 4 url cards", () => {
    expect(MOCK_NODES).toHaveLength(16);
    expect(countKind("account")).toBe(4);
    expect(countKind("post")).toBe(8);
    expect(countKind("url")).toBe(4);
    expect(MOCK_PLACED_COUNT).toBe(16);
  });

  it("has unique ids", () => {
    const ids = MOCK_NODES.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("indexes every node by id", () => {
    expect(Object.keys(MOCK_NODES_BY_ID)).toHaveLength(MOCK_NODES.length);
    for (const node of MOCK_NODES) {
      expect(MOCK_NODES_BY_ID[node.id]).toBe(node);
    }
  });

  it("gives every node a label and finite geometry inside the 1200x800 space", () => {
    for (const node of MOCK_NODES) {
      expect(node.label.trim(), `${node.id} label`).not.toBe("");
      expect(Number.isFinite(node.x), `${node.id} x`).toBe(true);
      expect(Number.isFinite(node.y), `${node.id} y`).toBe(true);
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.x).toBeLessThanOrEqual(1200);
      expect(node.y).toBeGreaterThanOrEqual(0);
      expect(node.y).toBeLessThanOrEqual(800);
      expect(node.size, `${node.id} size`).toBeGreaterThan(0);
    }
  });

  it("carries a platform on account/post nodes and a category+domain on url nodes", () => {
    for (const node of MOCK_NODES) {
      if (node.kind === "url") {
        expect(node.category, `${node.id} category`).toBeDefined();
        expect(["commerce", "generic"]).toContain(node.category);
        expect(node.domain?.trim(), `${node.id} domain`).toBeTruthy();
        expect(node.height, `${node.id} height`).toBeGreaterThan(0);
        expect(node.platform).toBeUndefined();
      } else {
        expect(node.platform, `${node.id} platform`).toBeDefined();
        expect(["youtube", "instagram", "tiktok", "x"]).toContain(
          node.platform,
        );
        expect(node.category).toBeUndefined();
      }
    }
  });

  it("exposes the mockup's default node", () => {
    expect(DEFAULT_NODE_ID).toBe("yt-v1");
    expect(MOCK_NODES_BY_ID[DEFAULT_NODE_ID]).toBeDefined();
  });
});

describe("mock edges", () => {
  it("ships 14 edges with unique ids", () => {
    expect(MOCK_EDGES).toHaveLength(14);
    const ids = MOCK_EDGES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("indexes every edge by id", () => {
    expect(Object.keys(MOCK_EDGES_BY_ID)).toHaveLength(MOCK_EDGES.length);
    for (const edge of MOCK_EDGES) {
      expect(MOCK_EDGES_BY_ID[edge.id]).toBe(edge);
    }
  });

  it("resolves both endpoints to a real node, and never self-links", () => {
    for (const edge of MOCK_EDGES) {
      expect(MOCK_NODES_BY_ID[edge.source], `${edge.id} source`).toBeDefined();
      expect(MOCK_NODES_BY_ID[edge.target], `${edge.id} target`).toBeDefined();
      expect(edge.source, `${edge.id} is a self-loop`).not.toBe(edge.target);
    }
  });

  it("uses the e-<source>-<target> id convention", () => {
    for (const edge of MOCK_EDGES) {
      expect(edge.id).toBe(`e-${edge.source}-${edge.target}`);
    }
  });

  it("keeps confidence inside 0..1", () => {
    for (const edge of MOCK_EDGES) {
      expect(edge.confidence, `${edge.id} confidence`).toBeGreaterThanOrEqual(0);
      expect(edge.confidence, `${edge.id} confidence`).toBeLessThanOrEqual(1);
    }
  });

  it("carries a positive volume, a sane rate and a 1.5–6px stroke", () => {
    for (const edge of MOCK_EDGES) {
      expect(edge.volume, `${edge.id} volume`).toBeGreaterThan(0);
      expect(edge.width, `${edge.id} width`).toBeGreaterThanOrEqual(1.5);
      expect(edge.width, `${edge.id} width`).toBeLessThanOrEqual(6);
      if (edge.rate !== undefined) {
        expect(edge.rate, `${edge.id} rate`).toBeGreaterThanOrEqual(0);
        expect(edge.rate, `${edge.id} rate`).toBeLessThanOrEqual(100);
      }
      if (edge.lagHours !== undefined) {
        expect(edge.lagHours, `${edge.id} lagHours`).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("only uses the two known flow kinds", () => {
    for (const edge of MOCK_EDGES) {
      expect(["observed", "estimated"]).toContain(edge.kind);
    }
    expect(MOCK_EDGES.some((e) => e.kind === "observed")).toBe(true);
    expect(MOCK_EDGES.some((e) => e.kind === "estimated")).toBe(true);
  });

  it("reproduces the mockup's headline edge exactly", () => {
    expect(DEFAULT_EDGE_ID).toBe("e-yt-v1-prod1");
    const edge = MOCK_EDGES_BY_ID[DEFAULT_EDGE_ID];
    expect(edge).toMatchObject({
      source: "yt-v1",
      target: "prod1",
      kind: "observed",
      volume: 1284,
      rate: 12.4,
      confidence: 0.86,
      lagHours: 2.1,
    });
  });
});

describe("mock ranking", () => {
  it("ships 7 rows", () => {
    expect(MOCK_RANKING).toHaveLength(7);
  });

  it("points every row at a real node and a known swatch", () => {
    for (const row of MOCK_RANKING) {
      expect(MOCK_NODES_BY_ID[row.nodeId], `${row.nodeId}`).toBeDefined();
      expect(SWATCHES).toContain(row.color);
      expect(row.label.trim()).not.toBe("");
      expect(Number.isFinite(row.value)).toBe(true);
      expect(Number.isFinite(row.delta)).toBe(true);
    }
  });

  it("is sorted by descending value", () => {
    const values = MOCK_RANKING.map((r) => r.value);
    expect(values).toEqual([...values].sort((a, b) => b - a));
  });
});

describe("spark series", () => {
  it("all carry 30 finite non-negative points", () => {
    const series = {
      SPARK_TREND,
      SPARK_NODE,
      SPARK_EDGE,
      TIMELINE_BARS,
    };
    for (const [name, points] of Object.entries(series)) {
      expect(points, name).toHaveLength(30);
      for (const value of points) {
        expect(Number.isFinite(value), name).toBe(true);
        expect(value, name).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("panel fixtures", () => {
  it("ships 4 connections, one per platform, with known statuses", () => {
    expect(MOCK_CONNECTIONS).toHaveLength(4);
    expect(MOCK_CONNECTIONS.map((c) => c.platform)).toEqual([
      "youtube",
      "instagram",
      "tiktok",
      "x",
    ]);
    for (const connection of MOCK_CONNECTIONS) {
      expect(["connected", "reauth", "disconnected"]).toContain(
        connection.status,
      );
      expect(connection.accountName.trim()).not.toBe("");
      expect(connection.description.trim()).not.toBe("");
      expect(connection.scopeLabel.trim()).not.toBe("");
    }
  });

  it("ships 2 staged nodes that are NOT on the canvas", () => {
    expect(MOCK_STAGED_NODES).toHaveLength(2);
    expect(MOCK_STAGED_COUNT).toBe(2);
    for (const staged of MOCK_STAGED_NODES) {
      expect(MOCK_NODES_BY_ID[staged.id]).toBeUndefined();
      expect(SWATCHES).toContain(staged.color);
    }
  });

  it("placed-preview rows all reference real nodes", () => {
    expect(MOCK_PLACED_PREVIEW.length).toBeGreaterThan(0);
    for (const row of MOCK_PLACED_PREVIEW) {
      expect(MOCK_NODES_BY_ID[row.nodeId], row.nodeId).toBeDefined();
      expect(SWATCHES).toContain(row.color);
      expect(typeof row.metaIsNumeric).toBe("boolean");
    }
  });

  it("node-detail connections reference real nodes with a known flow kind", () => {
    expect(MOCK_NODE_CONNECTIONS.length).toBeGreaterThan(0);
    for (const row of MOCK_NODE_CONNECTIONS) {
      expect(MOCK_NODES_BY_ID[row.nodeId], row.nodeId).toBeDefined();
      expect(SWATCHES).toContain(row.color);
      expect(["observed", "estimated"]).toContain(row.kind);
      expect(row.value.trim()).not.toBe("");
      // estimated rows carry the "~" approximation prefix
      expect(row.value.startsWith("~")).toBe(row.kind === "estimated");
    }
  });
});

describe("projects", () => {
  it("ships 3 projects with unique ids, and the default resolves", () => {
    expect(MOCK_PROJECTS).toHaveLength(3);
    const ids = MOCK_PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids).toContain(DEFAULT_PROJECT_ID);
  });

  it("the default project's counts match the canvas fixture", () => {
    const main = MOCK_PROJECTS.find((p) => p.id === DEFAULT_PROJECT_ID);
    expect(main).toBeDefined();
    expect(main?.nodes).toBe(MOCK_NODES.length);
    expect(main?.edges).toBe(MOCK_EDGES.length);
    expect(main?.updatedLabel.trim()).not.toBe("");
  });
});
