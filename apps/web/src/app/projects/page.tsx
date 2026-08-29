import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { linkButtonClass } from "@/components/chrome/link-button";
import { PageHeader } from "@/components/chrome/page-header";
import { copy } from "@/lib/copy";
import { MOCK_PROJECTS } from "@/lib/mock/data";
import { SWATCH_HEX } from "@/lib/utils";

export const metadata: Metadata = { title: copy.projects.title };

/* -------------------------------------------------------------------------- */
/* deterministic mini-network preview (same LCG + draw order as the mockup)     */
/* -------------------------------------------------------------------------- */

const PREVIEW_COLORS = [
  "var(--color-accent)",
  SWATCH_HEX.yt,
  SWATCH_HEX.ig,
  SWATCH_HEX.tt,
  SWATCH_HEX.com,
  SWATCH_HEX.gen,
];

interface PreviewLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
interface PreviewDot {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}

const round = (n: number) => Math.round(n * 100) / 100;

function buildPreview(seed: number): { lines: PreviewLine[]; dots: PreviewDot[] } {
  let state = seed * 97;
  const rnd = () => (state = (state * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;

  const points: [number, number][] = Array.from(
    { length: 7 + seed * 2 },
    () => [20 + rnd() * 240, 16 + rnd() * 88],
  );

  const lines: PreviewLine[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    if (rnd() > 0.4) {
      lines.push({
        x1: round(points[i][0]),
        y1: round(points[i][1]),
        x2: round(points[i + 1][0]),
        y2: round(points[i + 1][1]),
      });
    }
  }

  const dots: PreviewDot[] = points.map((p, i) => ({
    cx: round(p[0]),
    cy: round(p[1]),
    r: round(2 + rnd() * 3.4),
    fill: PREVIEW_COLORS[i % 6],
  }));

  return { lines, dots };
}

function ProjectPreview({ seed }: { seed: number }) {
  const { lines, dots } = buildPreview(seed);
  return (
    <svg
      viewBox="0 0 280 120"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      {lines.map((l, i) => (
        <line
          key={`l${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="var(--color-line-2)"
          strokeWidth={1}
        />
      ))}
      {dots.map((d, i) => (
        <circle
          key={`d${i}`}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill={d.fill}
          opacity={0.85}
        />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

export default function ProjectsPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        action={
          <Link href="/settings" className={linkButtonClass("ghost", "sm")}>
            {copy.topBar.settings}
          </Link>
        }
      />

      <main className="flex-1 overflow-y-auto bg-s0">
        <div className="mx-auto max-w-[960px] px-8 pt-9 pb-[120px]">
          <h1 className="mb-1 text-xl font-semibold tracking-[-0.01em]">
            {copy.projects.title}
          </h1>
          <p className="mb-[26px] text-[13px] text-t2">{copy.projects.sub}</p>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {MOCK_PROJECTS.map((project, index) => (
              <Link
                key={project.id}
                href={`/p/${project.id}`}
                className="overflow-hidden rounded-modal border border-line-2 bg-s1 transition duration-200 ease-out-custom hover:-translate-y-0.5 hover:border-accent"
              >
                <div className="h-[120px] border-b border-line-1 bg-[radial-gradient(400px_200px_at_50%_50%,var(--color-s2),var(--color-s0))]">
                  <ProjectPreview seed={index + 1} />
                </div>
                <div className="px-4 py-3.5">
                  <h3 className="mb-[3px] text-sm font-semibold text-t1">
                    {project.name}
                  </h3>
                  <div className="flex gap-2.5 text-[11.5px] text-t3">
                    <span className="num">
                      {project.nodes}
                      {copy.projects.nodesUnit} ・ {project.edges}
                      {copy.projects.edgesUnit}
                    </span>
                    <span>{project.updatedLabel}</span>
                  </div>
                </div>
              </Link>
            ))}

            <button
              type="button"
              className="flex min-h-[196px] flex-col items-center justify-center gap-2 rounded-modal border border-dashed border-line-2 bg-s1 text-[13px] text-t3 transition duration-200 ease-out-custom hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <Plus className="size-[22px]" strokeWidth={1.6} aria-hidden="true" />
              {copy.projects.newProject}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
