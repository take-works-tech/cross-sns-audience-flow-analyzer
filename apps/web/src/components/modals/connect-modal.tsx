"use client";

import { TriangleAlert } from "lucide-react";

import { ModalShell } from "@/components/modals/modal-shell";
import { PlatformGlyph } from "@/components/modals/platform-glyph";
import { Button, Chip } from "@/components/ui";
import { copy } from "@/lib/copy";
import { MOCK_CONNECTIONS } from "@/lib/mock/data";
import type { Connection, Platform } from "@/lib/types";
import { cn, PLATFORM_SWATCH, SWATCH_TINT } from "@/lib/utils";

/**
 * Platform display names. The dictionary already carries them as the first four
 * entries of the node-type legend, so they are re-read from there rather than
 * duplicated. (Promote to `copy.common.platforms` if the dictionary grows one.)
 */
const PLATFORM_NAME: Record<Platform, string> = {
  youtube: copy.states.nodeTypes.labels[0],
  instagram: copy.states.nodeTypes.labels[1],
  tiktok: copy.states.nodeTypes.labels[2],
  x: copy.states.nodeTypes.labels[3],
};

export interface ConnectModalProps {
  onClose: () => void;
}

export function ConnectModal({ onClose }: ConnectModalProps) {
  return (
    <ModalShell title={copy.modals.connect.title} onClose={onClose}>
      <p className="flex items-start gap-2.5 rounded-card border border-warn-line bg-warn-bg px-3.5 py-[11px] text-[12.5px] leading-[1.55] text-warn-ink">
        <TriangleAlert
          className="mt-px size-[15px] flex-none"
          strokeWidth={1.6}
          aria-hidden="true"
        />
        {copy.modals.connect.warning}
      </p>

      {MOCK_CONNECTIONS.map((connection) => (
        <PlatformCard key={connection.platform} connection={connection} />
      ))}

      <p className="text-[11.5px] leading-[1.7] text-t3">
        {copy.modals.connect.note}
      </p>
    </ModalShell>
  );
}

function PlatformCard({ connection }: { connection: Connection }) {
  const { platform, status, scopeLabel } = connection;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-card border bg-s2 px-3.5 py-[13px]",
        status === "reauth" ? "border-warn-line" : "border-line-2",
      )}
    >
      <span
        className={cn(
          "flex size-[34px] flex-none items-center justify-center rounded-[9px]",
          SWATCH_TINT[PLATFORM_SWATCH[platform]],
        )}
      >
        <PlatformGlyph platform={platform} />
      </span>

      <span className="min-w-0">
        <span className="block font-medium text-t1">
          {PLATFORM_NAME[platform]}
        </span>
        <span className="block text-[11.5px] text-t3">{scopeLabel}</span>
      </span>

      <span className="ml-auto flex-none">
        {status === "connected" ? (
          <Chip tone="ok">{copy.modals.connect.connected}</Chip>
        ) : status === "reauth" ? (
          <Button variant="primary" size="sm">
            {copy.modals.connect.reauth}
          </Button>
        ) : (
          <Button size="sm">{copy.modals.connect.connect}</Button>
        )}
      </span>
    </div>
  );
}
