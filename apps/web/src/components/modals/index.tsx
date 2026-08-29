"use client";

import { useCallback } from "react";

import { AddUrlModal } from "@/components/modals/add-url-modal";
import { ConnectModal } from "@/components/modals/connect-modal";
import { FilterDrawer } from "@/components/modals/filter-drawer";
import { useCanvasStore } from "@/stores/canvas-store";

export { AddUrlModal } from "@/components/modals/add-url-modal";
export { ConnectModal } from "@/components/modals/connect-modal";
export { FilterDrawer } from "@/components/modals/filter-drawer";
export { ModalShell } from "@/components/modals/modal-shell";
export { PlatformGlyph } from "@/components/modals/platform-glyph";

/**
 * Every overlay surface of the analysis screen, driven by the canvas store:
 * `modal` selects a dialog, `drawerOpen` reveals the filter drawer.
 * Rendered last inside AppFrame; all children are fixed-positioned, so this
 * contributes nothing to the three-pane flex layout.
 */
export function Modals() {
  const modal = useCanvasStore((s) => s.modal);
  const setModal = useCanvasStore((s) => s.setModal);
  const closeModal = useCallback(() => setModal(null), [setModal]);

  return (
    <>
      {modal === "connect" ? <ConnectModal onClose={closeModal} /> : null}
      {modal === "add-url" ? <AddUrlModal onClose={closeModal} /> : null}
      <FilterDrawer />
    </>
  );
}
