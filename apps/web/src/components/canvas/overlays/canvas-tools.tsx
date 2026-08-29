"use client";

import { useReactFlow } from "@xyflow/react";
import {
  Activity,
  Maximize,
  Minus,
  Network,
  Plus,
  SquareDashed,
} from "lucide-react";
import { useState } from "react";

import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvas-store";

const TOOL_BUTTON =
  "flex size-[30px] items-center justify-center rounded-[5px] text-t2 transition-colors duration-150 ease-out-custom hover:bg-s3 hover:text-t1";
const TOOL_BUTTON_ON = "bg-accent-dim text-accent hover:bg-accent-dim hover:text-accent";

export interface CanvasToolsProps {
  /** lasso / marquee selection — drives React Flow's selectionOnDrag */
  lasso: boolean;
  onLassoChange: (next: boolean) => void;
}

/** Floating tool rail, top-left of the canvas. */
export function CanvasTools({ lasso, onLassoChange }: CanvasToolsProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const particlesOn = useCanvasStore((s) => s.particlesOn);
  const toggleParticles = useCanvasStore((s) => s.toggleParticles);
  const [autoLayout, setAutoLayout] = useState(true);

  const tools = copy.canvas.tools;

  return (
    <div className="absolute top-3.5 left-3.5 flex flex-col gap-0.5 rounded-card border border-line-2 bg-panel-float p-1">
      <button
        type="button"
        className={TOOL_BUTTON}
        aria-label={tools.zoomIn}
        onClick={() => void zoomIn({ duration: 200 })}
      >
        <Plus className="size-4" strokeWidth={1.6} />
      </button>
      <button
        type="button"
        className={TOOL_BUTTON}
        aria-label={tools.zoomOut}
        onClick={() => void zoomOut({ duration: 200 })}
      >
        <Minus className="size-4" strokeWidth={1.6} />
      </button>
      <button
        type="button"
        className={TOOL_BUTTON}
        aria-label={tools.fit}
        onClick={() => void fitView({ padding: 0.14, duration: 250 })}
      >
        <Maximize className="size-4" strokeWidth={1.6} />
      </button>

      <div className="mx-1 my-[3px] h-px bg-line-2" aria-hidden="true" />

      <button
        type="button"
        className={cn(TOOL_BUTTON, autoLayout && TOOL_BUTTON_ON)}
        aria-label={tools.autoLayout}
        aria-pressed={autoLayout}
        onClick={() => setAutoLayout((on) => !on)}
      >
        <Network className="size-4" strokeWidth={1.6} />
      </button>
      <button
        type="button"
        className={cn(TOOL_BUTTON, lasso && TOOL_BUTTON_ON)}
        aria-label={tools.multiSelect}
        aria-pressed={lasso}
        onClick={() => onLassoChange(!lasso)}
      >
        <SquareDashed className="size-4" strokeWidth={1.6} />
      </button>
      <button
        type="button"
        className={cn(TOOL_BUTTON, particlesOn && TOOL_BUTTON_ON)}
        aria-label={tools.particles}
        aria-pressed={particlesOn}
        onClick={toggleParticles}
      >
        <Activity className="size-4" strokeWidth={1.6} />
      </button>
    </div>
  );
}
