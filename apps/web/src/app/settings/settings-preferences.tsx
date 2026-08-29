"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import {
  Field,
  fieldInputClass,
  RangeSlider,
  Segmented,
  Toggle,
} from "@/components/ui";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvas-store";

/**
 * Theme swatches depict OTHER themes, so their colours are literal previews —
 * the one intentional exception to the "tokens only" rule.
 */
const THEME_SWATCHES: Record<
  string,
  { frame: string; panel: string; dot: string | null }
> = {
  dark: {
    frame: "bg-[#14161f]",
    panel: "bg-[#1c1f29]",
    dot: "bg-accent shadow-[0_0_8px_var(--color-accent)]",
  },
  light: {
    frame: "bg-[#f4f5f8]",
    panel: "bg-white",
    dot: "bg-[#2b8fc7]",
  },
  contrast: {
    frame: "bg-black",
    panel: "border border-[#666] bg-[#111]",
    dot: null,
  },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-4 rounded-modal border border-line-1 bg-s1 px-[22px] py-5">
      <h2 className="mb-3.5 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Row({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line-1 py-[9px] text-[13px] last:border-b-0">
      <div className="min-w-0">
        <div className="text-t1">{label}</div>
        {desc ? <div className="text-[11.5px] text-t3">{desc}</div> : null}
      </div>
      <div className="ml-auto flex flex-none items-center gap-2.5">
        {children}
      </div>
    </div>
  );
}

export function SettingsPreferences() {
  const [theme, setTheme] = useState<string>(
    copy.settings.theme.options[0].value,
  );
  const particlesOn = useCanvasStore((s) => s.particlesOn);
  const toggleParticles = useCanvasStore((s) => s.toggleParticles);
  const [intensity, setIntensity] = useState(70);
  const [followReducedMotion, setFollowReducedMotion] = useState(true);
  const [minVolume, setMinVolume] = useState("50");
  const [minConf, setMinConf] = useState("0.40");
  const [refresh, setRefresh] = useState<string>(
    copy.settings.defaults.refreshOptions[1].value,
  );

  return (
    <>
      <Section title={copy.settings.theme.title}>
        <div className="flex flex-wrap gap-4">
          {copy.settings.theme.options.map((option) => {
            const swatch = THEME_SWATCHES[option.value];
            const pressed = option.value === theme;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={pressed}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex flex-col gap-[7px] text-xs transition-colors duration-150 ease-out-custom",
                  pressed ? "text-accent" : "text-t2 hover:text-t1",
                )}
              >
                <span
                  className={cn(
                    "relative h-16 w-[104px] overflow-hidden rounded-card border-2",
                    "transition-colors duration-150 ease-out-custom",
                    pressed ? "border-accent" : "border-line-2",
                    swatch.frame,
                  )}
                  aria-hidden="true"
                >
                  <span
                    className={cn(
                      "absolute top-2 right-10 bottom-2 left-2 rounded-[4px]",
                      swatch.panel,
                    )}
                  />
                  <span
                    className={cn(
                      "absolute top-2 right-2 bottom-2 w-[26px] rounded-[4px]",
                      swatch.panel,
                    )}
                  />
                  {swatch.dot ? (
                    <span
                      className={cn(
                        "absolute top-[45%] left-[30%] size-2 rounded-full",
                        swatch.dot,
                      )}
                    />
                  ) : null}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title={copy.settings.animation.title}>
        <Row label={copy.settings.animation.particles}>
          <Toggle
            pressed={particlesOn}
            onToggle={toggleParticles}
            label={copy.settings.animation.particles}
          />
        </Row>
        <Row
          label={copy.settings.animation.intensity}
          desc={copy.settings.animation.intensityDesc}
        >
          <span className="flex w-[180px] items-center">
            <RangeSlider
              value={intensity}
              onChange={setIntensity}
              label={copy.settings.animation.intensityLabel}
            />
          </span>
        </Row>
        <Row
          label={copy.settings.animation.reducedMotion}
          desc={copy.settings.animation.reducedMotionDesc}
        >
          <Toggle
            pressed={followReducedMotion}
            onToggle={() => setFollowReducedMotion((v) => !v)}
            label={copy.settings.animation.reducedMotionLabel}
          />
        </Row>
      </Section>

      <Section title={copy.settings.defaults.title}>
        <Row label={copy.settings.defaults.minVolume}>
          <Field
            className="w-[110px]"
            trailing={
              <span className="text-xs text-t3">{copy.common.people}</span>
            }
          >
            <input
              className={cn(fieldInputClass, "num")}
              value={minVolume}
              onChange={(event) => setMinVolume(event.target.value)}
              inputMode="numeric"
              aria-label={copy.settings.defaults.minVolume}
            />
          </Field>
        </Row>
        <Row label={copy.settings.defaults.minConf}>
          <Field className="w-[110px]">
            <input
              className={cn(fieldInputClass, "num")}
              value={minConf}
              onChange={(event) => setMinConf(event.target.value)}
              inputMode="decimal"
              aria-label={copy.settings.defaults.minConf}
            />
          </Field>
        </Row>
        <Row label={copy.settings.defaults.refresh}>
          <Segmented
            options={copy.settings.defaults.refreshOptions}
            value={refresh}
            onChange={setRefresh}
            label={copy.settings.defaults.refresh}
          />
        </Row>
      </Section>
    </>
  );
}
