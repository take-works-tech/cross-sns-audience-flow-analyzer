import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { copy } from "@/lib/copy";
import { MOCK_RANKING } from "@/lib/mock/data";
import { formatDelta, formatNumber } from "@/lib/utils";
import type { CanvasState, Selection } from "@/stores/canvas-store";

/* -------------------------------------------------------------------------- */
/* mocked store — the panel is exercised in isolation from zustand             */
/* -------------------------------------------------------------------------- */

const { setSelection, state } = vi.hoisted(() => ({
  setSelection: vi.fn(),
  state: { selection: null as Selection },
}));

vi.mock("@/stores/canvas-store", () => {
  const noop = () => {};
  const base: CanvasState = {
    selection: null,
    setSelection,
    filters: {
      minVolume: 50,
      minRate: 1,
      minConf: 0.4,
      showObserved: true,
      showEstimated: true,
      showAccounts: true,
      showPosts: true,
      showUrls: true,
    },
    setFilter: noop,
    resetFilters: noop,
    particlesOn: true,
    toggleParticles: noop,
    modal: null,
    setModal: noop,
    drawerOpen: false,
    setDrawerOpen: noop,
    recalculating: false,
    triggerRecalc: noop,
  };

  return {
    useCanvasStore: <T,>(selector: (s: CanvasState) => T): T =>
      selector({ ...base, selection: state.selection }),
  };
});

// vi.mock is hoisted above this import, so the panel receives the mock
const { RightPanel } = await import("@/components/panels/right-panel");

/** The 7 ranking rows are the buttons that are not part of the Segmented. */
function rankingRows(): HTMLElement[] {
  return screen
    .getAllByRole("button")
    .filter((el) => !el.hasAttribute("aria-pressed"));
}

beforeEach(() => {
  state.selection = null;
  setSelection.mockClear();
});

describe("RankingPanel (RightPanel with no selection)", () => {
  it("renders the ranking heading and the direction segmented control", () => {
    render(<RightPanel />);

    expect(screen.getByText(copy.ranking.title)).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: copy.ranking.title }),
    ).toBeInTheDocument();
    for (const direction of copy.ranking.directions) {
      expect(
        screen.getByRole("button", { name: direction.label }),
      ).toBeInTheDocument();
    }
  });

  it("renders exactly 7 ranking rows", () => {
    render(<RightPanel />);
    expect(rankingRows()).toHaveLength(7);
    expect(rankingRows()).toHaveLength(MOCK_RANKING.length);
  });

  it("renders each row's rank, label, value and delta", () => {
    render(<RightPanel />);
    const rows = rankingRows();

    MOCK_RANKING.forEach((row, index) => {
      const text = rows[index].textContent ?? "";
      expect(text).toContain(String(index + 1));
      expect(text).toContain(row.label);
      expect(text).toContain(formatNumber(row.value));
      expect(text).toContain(formatDelta(row.delta));
    });
  });

  it("marks rising rows with ▲ and falling rows with ▼", () => {
    render(<RightPanel />);
    const rows = rankingRows();

    const up = MOCK_RANKING.findIndex((r) => r.delta >= 0);
    const down = MOCK_RANKING.findIndex((r) => r.delta < 0);
    expect(up).toBeGreaterThanOrEqual(0);
    expect(down).toBeGreaterThanOrEqual(0);

    expect(rows[up].textContent).toContain("▲");
    expect(rows[down].textContent).toContain("▼");
  });

  it("fires setSelection with the row's node id on click", () => {
    render(<RightPanel />);

    fireEvent.click(rankingRows()[0]);

    expect(setSelection).toHaveBeenCalledTimes(1);
    expect(setSelection).toHaveBeenCalledWith({
      type: "node",
      id: MOCK_RANKING[0].nodeId,
    });
  });

  it("selects the matching node for every row", () => {
    render(<RightPanel />);
    const rows = rankingRows();

    MOCK_RANKING.forEach((row, index) => {
      setSelection.mockClear();
      fireEvent.click(rows[index]);
      expect(setSelection).toHaveBeenCalledWith({
        type: "node",
        id: row.nodeId,
      });
    });
  });

  it("renders the trend section with a sparkline", () => {
    const { container } = render(<RightPanel />);

    expect(screen.getByText(copy.ranking.trendSection)).toBeInTheDocument();
    expect(screen.getByText(copy.ranking.legendEc)).toBeInTheDocument();
    expect(screen.getByText(copy.ranking.legendAll)).toBeInTheDocument();
    expect(container.querySelector("svg polyline")).not.toBeNull();
  });

  it("falls back to the ranking view when the selection points at nothing", () => {
    state.selection = { type: "node", id: "does-not-exist" };
    render(<RightPanel />);
    expect(rankingRows()).toHaveLength(7);
  });
});
