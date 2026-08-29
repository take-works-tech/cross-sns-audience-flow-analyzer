import { Check, CircleAlert, Link as LinkIcon, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Button, Chip, ConfidenceBar, Field, fieldInputClass, SkeletonRow } from "@/components/ui";
import { copy } from "@/lib/copy";
import type { SwatchToken } from "@/lib/types";
import { cn, formatConfidence, SWATCH_BG } from "@/lib/utils";

export const metadata: Metadata = { title: copy.states.title };

/** Node-type legend chips, in mockup order. */
const NODE_TYPE_SWATCHES: SwatchToken[] = ["yt", "ig", "tt", "x", "com", "gen"];

/** Confidence demo rows: label + value + value colour. */
const CONFIDENCE_ROWS: { label: string; value: number; tone: string }[] = [
  { label: copy.common.high, value: 0.86, tone: "text-accent" },
  { label: copy.common.mid, value: 0.58, tone: "text-t2" },
  { label: copy.common.low, value: 0.31, tone: "text-t3" },
];

function StateCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-modal border border-line-1 bg-s1 p-[18px]">
      <h3 className="mb-3.5 text-xs font-semibold tracking-[0.07em] text-t3 uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Toast({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-card border border-line-2 bg-s3 px-4 py-2.5 text-[13px] text-t1 shadow-overlay">
      {children}
    </span>
  );
}

export default function StatesPage() {
  return (
    <main className="h-full overflow-y-auto bg-s0">
      <div className="mx-auto max-w-[960px] px-8 pt-9 pb-[120px]">
        <h1 className="mb-1 text-xl font-semibold tracking-[-0.01em]">
          {copy.states.title}
        </h1>
        <p className="mb-[26px] text-[13px] text-t2">{copy.states.sub}</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 1 — skeletons ------------------------------------------------ */}
          <StateCard title={copy.states.loading.title}>
            <div className="flex flex-col gap-2.5">
              <SkeletonRow />
              <SkeletonRow />
              <p className="text-[11.5px] text-t3">{copy.states.loading.note}</p>
            </div>
          </StateCard>

          {/* 2 — empty canvas --------------------------------------------- */}
          <StateCard title={copy.states.emptyCanvas.title}>
            <div className="rounded-card border border-dashed border-line-2 p-[22px] text-center text-[12.5px] leading-[1.7] text-t3">
              {copy.canvas.empty.title}
              <br />
              <span className="text-[11.5px]">{copy.canvas.empty.body}</span>
              <br />
              <Button variant="primary" size="sm" className="mt-2.5">
                {copy.canvas.empty.cta}
              </Button>
            </div>
          </StateCard>

          {/* 3 — url input error ------------------------------------------ */}
          <StateCard title={copy.states.urlError.title}>
            <div className="flex flex-col gap-2">
              <Field invalid>
                <input
                  className={fieldInputClass}
                  defaultValue={copy.states.urlError.value}
                  aria-label={copy.leftPanel.urlLabel}
                  aria-invalid="true"
                />
              </Field>
              <p className="flex items-center gap-1.5 text-xs text-err">
                <CircleAlert
                  className="size-[13px] flex-none"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                {copy.states.urlError.message}
              </p>
            </div>
          </StateCard>

          {/* 4 — stale connection banner ---------------------------------- */}
          <StateCard title={copy.states.staleBanner.title}>
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-card border border-warn-line bg-warn-bg px-[13px] py-[11px] text-[12.5px] leading-[1.55] text-warn-ink"
            >
              <TriangleAlert
                className="mt-px size-[15px] flex-none"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <div>
                {copy.states.staleBanner.message}
                <button
                  type="button"
                  className="ml-1 text-warn underline underline-offset-2"
                >
                  {copy.states.staleBanner.action}
                </button>
              </div>
            </div>
          </StateCard>

          {/* 5 — toasts ---------------------------------------------------- */}
          <StateCard title={copy.states.toast.title}>
            <div className="flex flex-col items-start gap-2.5">
              <Toast>
                <Check
                  className="size-3.5 flex-none text-ok"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                {copy.states.toast.saved}
              </Toast>
              <Toast>
                <span
                  className="size-3 flex-none animate-spin rounded-full border-2 border-line-2 border-t-accent"
                  aria-hidden="true"
                />
                {copy.states.toast.recalcing}
                <span className="text-t3">
                  {copy.states.toast.recalcingDetail}
                </span>
              </Toast>
            </div>
          </StateCard>

          {/* 6 — metadata fetch failure ------------------------------------ */}
          <StateCard title={copy.states.metaFail.title}>
            <div className="flex gap-3 rounded-card border border-line-2 bg-s2 p-[13px]">
              <span className="flex h-[54px] w-[72px] flex-none items-center justify-center rounded-[6px] border border-line-2 bg-[linear-gradient(135deg,var(--color-s3),var(--color-s2))] text-t3">
                <LinkIcon className="size-4" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="font-medium text-t2">
                  {copy.states.metaFail.placeholderTitle}
                </div>
                <div className="num truncate text-[11px] text-t3">
                  {copy.states.metaFail.placeholderUrl}
                </div>
                <Button size="sm" className="mt-[7px]">
                  {copy.common.retry}
                </Button>
              </div>
            </div>
          </StateCard>

          {/* 7 — node type legend ------------------------------------------ */}
          <StateCard title={copy.states.nodeTypes.title}>
            <div className="flex flex-wrap gap-2">
              {copy.states.nodeTypes.labels.map((label, index) => (
                <Chip key={label} dot={SWATCH_BG[NODE_TYPE_SWATCHES[index]]}>
                  {label}
                </Chip>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] text-t3">
              {copy.states.nodeTypes.note}
            </p>
          </StateCard>

          {/* 8 — confidence display ---------------------------------------- */}
          <StateCard title={copy.states.confidence.title}>
            <div className="flex flex-col gap-[9px]">
              {CONFIDENCE_ROWS.map((row) => (
                <div key={row.label} className="flex flex-col gap-[7px]">
                  <div className="flex justify-between text-[12.5px]">
                    <span>{row.label}</span>
                    <span className={cn("num", row.tone)}>
                      {formatConfidence(row.value)}
                    </span>
                  </div>
                  <ConfidenceBar value={row.value} />
                </div>
              ))}
            </div>
          </StateCard>
        </div>
      </div>
    </main>
  );
}
