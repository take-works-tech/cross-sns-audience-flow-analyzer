"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import {
  Button,
  Chip,
  RangeSlider,
  SectionLabel,
  Toggle,
} from "@/components/ui";
import { copy } from "@/lib/copy";
import {
  cn,
  formatConfidence,
  formatNumber,
  formatPercent,
} from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvas-store";

/**
 * Comparison operator, not translatable copy — the same class of glyph as the
 * ▲/▼ marks that live in `formatDelta`.
 */
const GTE = "≥";

export function FilterDrawer() {
  const open = useCanvasStore((s) => s.drawerOpen);
  const setDrawerOpen = useCanvasStore((s) => s.setDrawerOpen);
  const filters = useCanvasStore((s) => s.filters);
  const setFilter = useCanvasStore((s) => s.setFilter);
  const resetFilters = useCanvasStore((s) => s.resetFilters);

  const panelRef = useRef<HTMLElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  /* focus moves into the drawer on open... */
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    /* next frame: the panel has been painted visible by then */
    const frame = requestAnimationFrame(() => {
      /* first focusable in DOM order is the close button */
      panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  /* ...and back to whatever opened it on close */
  useEffect(() => {
    if (open) return;
    const target = restoreRef.current;
    restoreRef.current = null;
    target?.focus?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setDrawerOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setDrawerOpen]);

  return (
    /* Positioned against the frozen frame geometry (top bar 52px, right panel
       320px) so the panel hugs the canvas' right edge. The negative-left inset
       clip lets the drawer shadow bleed left while hiding the slide travel
       behind the right panel. `visibility` transitions alongside the transform,
       so the panel stays paintable while sliding out and then drops out of the
       tab order and the a11y tree entirely. */
    <div className="pointer-events-none fixed top-[52px] right-[320px] bottom-0 z-20 w-[300px] [clip-path:inset(0_0_0_-40px)]">
      <aside
        ref={panelRef}
        aria-label={copy.filters.title}
        className={cn(
          "pointer-events-auto absolute inset-0 flex flex-col gap-4 overflow-y-auto",
          "border-l border-line-2 bg-s1 p-4 shadow-drawer",
          /* Tailwind v4 translate utilities set the `translate` property,
             not `transform` — transition that, plus visibility. */
          "transition-[translate,visibility] duration-200 ease-out-custom",
          open ? "visible translate-x-0" : "invisible translate-x-full",
        )}
      >
        <div className="flex flex-none items-center">
          <h2 className="text-sm font-semibold text-t1">
            {copy.filters.title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            aria-label={copy.common.close}
            onClick={() => setDrawerOpen(false)}
          >
            <X className="size-4" strokeWidth={1.6} />
          </Button>
        </div>

        <ThresholdRow
          label={copy.filters.minVolume}
          value={`${GTE} ${formatNumber(filters.minVolume)}${copy.common.people}`}
        >
          <RangeSlider
            min={0}
            max={500}
            step={10}
            value={filters.minVolume}
            label={copy.filters.minVolumeLabel}
            onChange={(v) => setFilter({ minVolume: v })}
          />
        </ThresholdRow>

        <ThresholdRow
          label={copy.filters.minRate}
          value={
            filters.minRate === 0
              ? copy.filters.noLimit
              : `${GTE} ${formatPercent(filters.minRate)}`
          }
        >
          <RangeSlider
            min={0}
            max={100}
            step={1}
            value={Math.round(filters.minRate * 10)}
            label={copy.filters.minRateLabel}
            onChange={(v) => setFilter({ minRate: v / 10 })}
          />
        </ThresholdRow>

        <ThresholdRow
          label={copy.filters.minConf}
          value={`${GTE} ${formatConfidence(filters.minConf)}`}
        >
          <RangeSlider
            min={0}
            max={100}
            step={1}
            value={Math.round(filters.minConf * 100)}
            label={copy.filters.minConfLabel}
            onChange={(v) => setFilter({ minConf: v / 100 })}
          />
        </ThresholdRow>

        <Divider />
        <SectionLabel className="flex-none">
          {copy.filters.flowKindSection}
        </SectionLabel>

        <CheckRow
          pressed={filters.showObserved}
          label={copy.filters.observedLabel}
          onToggle={() => setFilter({ showObserved: !filters.showObserved })}
        >
          <Chip tone="obs">{copy.common.observed}</Chip>
          {copy.filters.observedDesc}
        </CheckRow>

        <CheckRow
          pressed={filters.showEstimated}
          label={copy.filters.estimatedLabel}
          onToggle={() => setFilter({ showEstimated: !filters.showEstimated })}
        >
          <Chip tone="est">{copy.common.estimated}</Chip>
          {copy.filters.estimatedDesc}
        </CheckRow>

        <Divider />
        <SectionLabel className="flex-none">
          {copy.filters.nodeKindSection}
        </SectionLabel>

        <CheckRow
          pressed={filters.showAccounts}
          label={copy.filters.accountsLabel}
          onToggle={() => setFilter({ showAccounts: !filters.showAccounts })}
        >
          {copy.filters.accounts}
        </CheckRow>

        <CheckRow
          pressed={filters.showPosts}
          label={copy.filters.postsLabel}
          onToggle={() => setFilter({ showPosts: !filters.showPosts })}
        >
          {copy.filters.posts}
        </CheckRow>

        <CheckRow
          pressed={filters.showUrls}
          label={copy.filters.urlsLabel}
          onToggle={() => setFilter({ showUrls: !filters.showUrls })}
        >
          {copy.filters.urls}
        </CheckRow>

        <div className="mt-auto flex flex-none gap-2 pt-2">
          <Button size="sm" className="flex-1" onClick={resetFilters}>
            {copy.common.reset}
          </Button>
          <Button variant="primary" size="sm" className="flex-1">
            {copy.filters.saveTemplate}
          </Button>
        </div>
      </aside>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Divider() {
  return <div className="my-0.5 h-px flex-none bg-line-1" aria-hidden="true" />;
}

function ThresholdRow({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-none flex-col gap-[7px]">
      <div className="flex items-baseline justify-between text-[12.5px]">
        <span className="text-t1">{label}</span>
        <span className="num text-accent">{value}</span>
      </div>
      {children}
    </div>
  );
}

function CheckRow({
  pressed,
  onToggle,
  label,
  children,
}: {
  pressed: boolean;
  onToggle: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-none items-center gap-[9px] py-1.5 text-[13px] text-t1">
      {children}
      <Toggle
        className="ml-auto"
        pressed={pressed}
        onToggle={onToggle}
        label={label}
      />
    </div>
  );
}
