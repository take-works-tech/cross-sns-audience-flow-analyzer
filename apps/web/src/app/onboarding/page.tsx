import { Link2, Play, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { copy } from "@/lib/copy";
import { DEFAULT_PROJECT_ID } from "@/lib/mock/data";

export const metadata: Metadata = { title: copy.onboarding.title };

/** Card id (copy.onboarding.cards[].id) -> glyph. */
const CARD_ICONS: Record<string, LucideIcon> = {
  connect: Link2,
  "add-url": Plus,
  sample: Play,
};

const CANVAS_HREF = `/p/${DEFAULT_PROJECT_ID}`;

export default function OnboardingPage() {
  return (
    <main className="stage-ground relative flex h-full flex-col items-center justify-center gap-[34px] overflow-y-auto p-6">
      <div
        className="dot-grid pointer-events-none absolute inset-0 opacity-75"
        aria-hidden="true"
      />

      <div className="relative text-center">
        <h1 className="text-[22px] font-semibold tracking-[-0.01em]">
          {copy.onboarding.title}
        </h1>
        <p className="mt-1.5 text-t2">{copy.onboarding.sub}</p>
      </div>

      <div className="relative flex max-w-full flex-wrap justify-center gap-3.5">
        {copy.onboarding.cards.map((card) => {
          const Icon = CARD_ICONS[card.id] ?? Plus;
          return (
            <Link
              key={card.id}
              href={CANVAS_HREF}
              className="flex w-[220px] flex-col gap-2.5 rounded-modal border border-line-2 bg-s1 p-5 transition duration-200 ease-out-custom hover:-translate-y-0.5 hover:border-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-[9px] bg-accent-dim text-accent">
                <Icon className="size-4" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3 className="text-sm font-semibold text-t1">{card.title}</h3>
              <p className="text-xs leading-[1.6] text-t2">{card.body}</p>
            </Link>
          );
        })}
      </div>

      <p className="relative text-xs text-t3">{copy.onboarding.footnote}</p>
    </main>
  );
}
