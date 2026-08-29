import type { ReactNode } from "react";

import type { Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface PlatformGlyphProps {
  platform: Platform;
  className?: string;
}

/**
 * Platform marks for the tinted identity chips.
 *
 * lucide 1.x ships no brand icons, so these are the mockup's own stroke paths,
 * drawn on the same 24 grid at the same 1.6 weight / round joins as every other
 * icon in the product. Nothing here is a vendor logo lockup — they are generic
 * shape cues, kept consistent with docs/mockups/ui-mockup.html.
 */
const PATHS: Record<Platform, ReactNode> = {
  youtube: (
    <>
      <path d="m10 9 5 3-5 3V9z" fill="currentColor" stroke="none" />
      <rect x="3" y="6" width="18" height="12" rx="3" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: <path d="M14 4v9.5a4.5 4.5 0 1 1-3-4.24M14 4c.5 2.5 2 4 4.5 4.5" />,
  x: <path d="M5 5l14 14M19 5 5 19" />,
};

export function PlatformGlyph({
  platform,
  className = "size-4",
}: PlatformGlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("flex-none", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[platform]}
    </svg>
  );
}
