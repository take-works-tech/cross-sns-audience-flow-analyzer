"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";

import { copy } from "@/lib/copy";
import { TIMELINE_BARS } from "@/lib/mock/data";

const PEAK = Math.max(...TIMELINE_BARS);

/** Bottom-centre scrubber: 30-day histogram with the active window brushed. */
export function Timeline() {
  const [playing, setPlaying] = useState(false);
  const timeline = copy.canvas.timeline;

  return (
    <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-[11px] rounded-full border border-line-2 bg-panel-float-strong px-3.5 py-2">
      <button
        type="button"
        className="flex size-[18px] items-center justify-center rounded-[4px] text-t2 transition-colors duration-150 ease-out-custom hover:text-t1"
        aria-label={timeline.play}
        aria-pressed={playing}
        onClick={() => setPlaying((on) => !on)}
      >
        {playing ? (
          <Pause className="size-3.5" strokeWidth={1.6} fill="currentColor" />
        ) : (
          <Play className="size-3.5" strokeWidth={1.6} fill="currentColor" />
        )}
      </button>

      <div className="relative h-[22px] w-[320px]">
        <div
          className="absolute inset-0 flex items-end gap-[2px]"
          aria-hidden="true"
        >
          {TIMELINE_BARS.map((value, index) => (
            <span
              key={index}
              className="block flex-1 rounded-[1px]"
              style={{
                height: `${(value / PEAK) * 100}%`,
                background: "var(--canvas-timeline-bar)",
              }}
            />
          ))}
        </div>
        <div
          className="absolute top-[-2px] bottom-[-2px] left-[58%] w-[30%] rounded-[4px] border border-accent bg-accent/10"
          aria-hidden="true"
        />
      </div>

      <span className="num text-[11px] text-t3">{timeline.range}</span>
    </div>
  );
}
