import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_FILTERS,
  RECALC_MS,
  useCanvasStore,
} from "@/stores/canvas-store";

/** Put the singleton store back to its documented initial shape. */
function resetStore() {
  useCanvasStore.setState({
    selection: null,
    filters: DEFAULT_FILTERS,
    particlesOn: true,
    modal: null,
    drawerOpen: false,
    recalculating: false,
  });
}

beforeEach(resetStore);

describe("canvas-store — initial state", () => {
  it("starts with no selection, no modal, closed drawer and particles on", () => {
    const s = useCanvasStore.getState();
    expect(s.selection).toBeNull();
    expect(s.modal).toBeNull();
    expect(s.drawerOpen).toBe(false);
    expect(s.recalculating).toBe(false);
    expect(s.particlesOn).toBe(true);
  });

  it("exposes the frozen default filter thresholds", () => {
    expect(DEFAULT_FILTERS).toEqual({
      minVolume: 50,
      minRate: 0,
      minConf: 0.4,
      showObserved: true,
      showEstimated: true,
      showAccounts: true,
      showPosts: true,
      showUrls: true,
    });
    expect(useCanvasStore.getState().filters).toEqual(DEFAULT_FILTERS);
  });
});

describe("canvas-store — selection", () => {
  it("sets a node selection", () => {
    useCanvasStore.getState().setSelection({ type: "node", id: "yt-v1" });
    expect(useCanvasStore.getState().selection).toEqual({
      type: "node",
      id: "yt-v1",
    });
  });

  it("replaces a node selection with an edge selection", () => {
    const { setSelection } = useCanvasStore.getState();
    setSelection({ type: "node", id: "yt-v1" });
    setSelection({ type: "edge", id: "e-yt-v1-prod1" });
    expect(useCanvasStore.getState().selection).toEqual({
      type: "edge",
      id: "e-yt-v1-prod1",
    });
  });

  it("clears the selection with null", () => {
    const { setSelection } = useCanvasStore.getState();
    setSelection({ type: "node", id: "yt-v1" });
    setSelection(null);
    expect(useCanvasStore.getState().selection).toBeNull();
  });
});

describe("canvas-store — filters", () => {
  it("merges a partial update without dropping the other keys", () => {
    useCanvasStore.getState().setFilter({ minVolume: 200 });
    const { filters } = useCanvasStore.getState();
    expect(filters.minVolume).toBe(200);
    expect(filters.minRate).toBe(DEFAULT_FILTERS.minRate);
    expect(filters.minConf).toBe(DEFAULT_FILTERS.minConf);
    expect(filters.showObserved).toBe(true);
  });

  it("toggles the flow-kind and node-kind flags independently", () => {
    const { setFilter } = useCanvasStore.getState();
    setFilter({ showEstimated: false });
    setFilter({ showUrls: false });
    const { filters } = useCanvasStore.getState();
    expect(filters.showEstimated).toBe(false);
    expect(filters.showUrls).toBe(false);
    expect(filters.showObserved).toBe(true);
    expect(filters.showAccounts).toBe(true);
    expect(filters.showPosts).toBe(true);
  });

  it("resetFilters restores every threshold and flag", () => {
    const { setFilter, resetFilters } = useCanvasStore.getState();
    setFilter({ minVolume: 480, minRate: 9.5, minConf: 0.95, showPosts: false });
    resetFilters();
    expect(useCanvasStore.getState().filters).toEqual(DEFAULT_FILTERS);
  });

  it("does not mutate the DEFAULT_FILTERS object", () => {
    useCanvasStore.getState().setFilter({ minConf: 0.9 });
    expect(DEFAULT_FILTERS.minConf).toBe(0.4);
  });
});

describe("canvas-store — particles / modal / drawer", () => {
  it("toggleParticles flips the flag both ways", () => {
    const { toggleParticles } = useCanvasStore.getState();
    toggleParticles();
    expect(useCanvasStore.getState().particlesOn).toBe(false);
    toggleParticles();
    expect(useCanvasStore.getState().particlesOn).toBe(true);
  });

  it("setModal opens and closes each modal kind", () => {
    const { setModal } = useCanvasStore.getState();
    setModal("connect");
    expect(useCanvasStore.getState().modal).toBe("connect");
    setModal("add-url");
    expect(useCanvasStore.getState().modal).toBe("add-url");
    setModal(null);
    expect(useCanvasStore.getState().modal).toBeNull();
  });

  it("setDrawerOpen controls the filter drawer", () => {
    const { setDrawerOpen } = useCanvasStore.getState();
    setDrawerOpen(true);
    expect(useCanvasStore.getState().drawerOpen).toBe(true);
    setDrawerOpen(false);
    expect(useCanvasStore.getState().drawerOpen).toBe(false);
  });
});

describe("canvas-store — recalc timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("goes busy immediately and clears itself after RECALC_MS", () => {
    useCanvasStore.getState().triggerRecalc();
    expect(useCanvasStore.getState().recalculating).toBe(true);

    vi.advanceTimersByTime(RECALC_MS - 1);
    expect(useCanvasStore.getState().recalculating).toBe(true);

    vi.advanceTimersByTime(1);
    expect(useCanvasStore.getState().recalculating).toBe(false);
  });

  it("restarts the window when triggered again mid-flight", () => {
    const { triggerRecalc } = useCanvasStore.getState();

    triggerRecalc();
    vi.advanceTimersByTime(RECALC_MS - 200);
    triggerRecalc();

    // the first timer must have been cleared, not just ignored
    vi.advanceTimersByTime(200);
    expect(useCanvasStore.getState().recalculating).toBe(true);

    vi.advanceTimersByTime(RECALC_MS - 200);
    expect(useCanvasStore.getState().recalculating).toBe(false);
  });

  it("uses the 1800ms window from the spec", () => {
    expect(RECALC_MS).toBe(1800);
  });
});
