"use client";

import { FlowCanvas } from "@/components/canvas/flow-canvas";
import { Modals } from "@/components/modals";
import { LeftPanel } from "@/components/panels/left-panel";
import { RightPanel } from "@/components/panels/right-panel";

export interface AppFrameProps {
  projectId: string;
}

/** Three-pane analysis surface: sources | canvas | insight. */
export function AppFrame({ projectId }: AppFrameProps) {
  return (
    <div className="flex min-h-0 flex-1" data-project-id={projectId}>
      <LeftPanel />
      <FlowCanvas />
      <RightPanel />
      <Modals />
    </div>
  );
}
