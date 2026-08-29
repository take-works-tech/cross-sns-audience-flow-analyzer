"use client";

import { copy } from "@/lib/copy";
import { useCanvasStore } from "@/stores/canvas-store";

/** Top-centre status pill, shown only while the graph is recomputing. */
export function RecalcPill() {
  const recalculating = useCanvasStore((s) => s.recalculating);
  if (!recalculating) return null;

  return (
    <div
      className="absolute top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line-2 bg-panel-float-strong px-3.5 py-1.5 text-xs text-t2"
      role="status"
      aria-live="polite"
    >
      <span className="flow-spinner" aria-hidden="true" />
      {copy.canvas.recalcPill}
    </div>
  );
}
