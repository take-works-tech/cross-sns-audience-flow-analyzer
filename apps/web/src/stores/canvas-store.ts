import { create } from "zustand";

/** What the right panel is currently describing. */
export type Selection = { type: "node" | "edge"; id: string } | null;

export type ModalKind = "connect" | "add-url" | null;

export interface Filters {
  /** minimum audience count on an edge (people) */
  minVolume: number;
  /** minimum conversion share, percent (1 === 1.0%) */
  minRate: number;
  /** minimum edge confidence, 0..1 */
  minConf: number;
  showObserved: boolean;
  showEstimated: boolean;
  showAccounts: boolean;
  showPosts: boolean;
  showUrls: boolean;
}

// Volume and confidence defaults come from the project defaults in Settings
// (specs/11_ui.md). Rate has no documented default and is off by default: an
// opening view that hides a third of the graph reads as missing data.
export const DEFAULT_FILTERS: Filters = {
  minVolume: 50,
  minRate: 0,
  minConf: 0.4,
  showObserved: true,
  showEstimated: true,
  showAccounts: true,
  showPosts: true,
  showUrls: true,
};

/** How long the "再計算中…" pill stays up. */
export const RECALC_MS = 1800;

export interface CanvasState {
  selection: Selection;
  setSelection: (sel: Selection) => void;

  filters: Filters;
  setFilter: (partial: Partial<Filters>) => void;
  resetFilters: () => void;

  particlesOn: boolean;
  toggleParticles: () => void;

  modal: ModalKind;
  setModal: (m: ModalKind) => void;

  drawerOpen: boolean;
  setDrawerOpen: (b: boolean) => void;

  recalculating: boolean;
  triggerRecalc: () => void;
}

let recalcTimer: ReturnType<typeof setTimeout> | null = null;

export const useCanvasStore = create<CanvasState>((set) => ({
  selection: null,
  setSelection: (sel) => set({ selection: sel }),

  filters: DEFAULT_FILTERS,
  setFilter: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  particlesOn: true,
  toggleParticles: () => set((state) => ({ particlesOn: !state.particlesOn })),

  modal: null,
  setModal: (m) => set({ modal: m }),

  drawerOpen: false,
  setDrawerOpen: (b) => set({ drawerOpen: b }),

  recalculating: false,
  triggerRecalc: () => {
    set({ recalculating: true });
    if (recalcTimer) clearTimeout(recalcTimer);
    recalcTimer = setTimeout(() => {
      recalcTimer = null;
      set({ recalculating: false });
    }, RECALC_MS);
  },
}));
