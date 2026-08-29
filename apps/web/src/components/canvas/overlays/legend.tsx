import { copy } from "@/lib/copy";

/** Reads the edge grammar: solid = observed, dashed = estimated. */
export function CanvasLegend() {
  const legend = copy.canvas.legend;

  return (
    <div className="absolute bottom-3.5 left-3.5 flex flex-col gap-[7px] rounded-card border border-line-1 bg-panel-float px-[13px] py-[11px] text-[11.5px] text-t2">
      <div className="flex items-center gap-2">
        <span
          className="w-[26px] border-t-[2.5px] border-accent"
          aria-hidden="true"
        />
        {legend.observed}
      </div>
      <div className="flex items-center gap-2">
        <span
          className="w-[26px] border-t-2 border-dashed border-est"
          aria-hidden="true"
        />
        {legend.estimated}
      </div>
      <div className="text-t3">{legend.scale}</div>
    </div>
  );
}
