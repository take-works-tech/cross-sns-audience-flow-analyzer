import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Sparkline } from "@/components/ui";
import { SPARK_TREND } from "@/lib/mock/data";

const W = 280;
const H = 56;

/** "0,50 9.65,48 ..." -> [[0,50],[9.65,48], ...] */
function parsePoints(polyline: SVGPolylineElement): [number, number][] {
  const raw = polyline.getAttribute("points") ?? "";
  return raw
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return [x, y] as [number, number];
    });
}

function renderSparkline(points: number[]) {
  const { container } = render(<Sparkline points={points} />);
  return container;
}

describe("Sparkline", () => {
  it("renders an svg with the 280x56 viewBox", () => {
    const svg = renderSparkline(SPARK_TREND).querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("viewBox")).toBe(`0 0 ${W} ${H}`);
  });

  it("renders a polyline with one vertex per input point", () => {
    const polyline = renderSparkline(SPARK_TREND).querySelector("polyline");
    expect(polyline).not.toBeNull();

    const vertices = parsePoints(polyline as SVGPolylineElement);
    expect(vertices).toHaveLength(SPARK_TREND.length);
    for (const [x, y] of vertices) {
      expect(Number.isFinite(x)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
    }
  });

  it("spans the full width with monotonically increasing x", () => {
    const polyline = renderSparkline(SPARK_TREND).querySelector("polyline");
    const vertices = parsePoints(polyline as SVGPolylineElement);

    expect(vertices[0][0]).toBe(0);
    expect(vertices[vertices.length - 1][0]).toBeCloseTo(W, 5);
    for (let i = 1; i < vertices.length; i += 1) {
      expect(vertices[i][0]).toBeGreaterThan(vertices[i - 1][0]);
    }
  });

  it("inverts the y axis — the largest value sits highest", () => {
    const points = [10, 90, 50];
    const vertices = parsePoints(
      renderSparkline(points).querySelector("polyline") as SVGPolylineElement,
    );

    const maxIndex = points.indexOf(Math.max(...points));
    const minIndex = points.indexOf(Math.min(...points));
    expect(vertices[maxIndex][1]).toBeLessThan(vertices[minIndex][1]);

    for (const [, y] of vertices) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(H);
    }
  });

  it("draws the gradient area and the endpoint dot", () => {
    const container = renderSparkline(SPARK_TREND);

    const polygon = container.querySelector("polygon");
    expect(polygon).not.toBeNull();
    expect(polygon?.getAttribute("fill")).toMatch(/^url\(#.+\)$/);

    const gradient = container.querySelector("linearGradient");
    expect(gradient).not.toBeNull();
    expect(polygon?.getAttribute("fill")).toBe(`url(#${gradient?.id})`);

    const dot = container.querySelector("circle");
    expect(dot).not.toBeNull();

    const vertices = parsePoints(
      container.querySelector("polyline") as SVGPolylineElement,
    );
    const last = vertices[vertices.length - 1];
    expect(Number(dot?.getAttribute("cx"))).toBeCloseTo(last[0], 5);
    expect(Number(dot?.getAttribute("cy"))).toBeCloseTo(last[1], 5);
  });

  it("paints from tokens, never a literal hex", () => {
    const container = renderSparkline(SPARK_TREND);
    const polyline = container.querySelector("polyline");

    expect(polyline?.getAttribute("stroke")).toBe("var(--color-accent)");
    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  it("is decorative — hidden from assistive tech", () => {
    const svg = renderSparkline(SPARK_TREND).querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("focusable")).toBe("false");
  });

  it("renders nothing for fewer than two points", () => {
    expect(renderSparkline([]).querySelector("svg")).toBeNull();
    expect(renderSparkline([42]).querySelector("svg")).toBeNull();
  });
});
