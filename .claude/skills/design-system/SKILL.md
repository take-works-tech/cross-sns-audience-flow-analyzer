---
name: design-system
description: "264SF pinned design system: exact tokens, type, node/edge/particle visual language, anti-AI-slop bans. Triggers: UI, component, screen, style, theme, color, font, canvas, node, edge, animation, Tailwind, shadcn."
metadata:
  verified_date: 2026-08-29
  stability: stable
---

# 264SF Design System — "Calm Instrument"

The ONE aesthetic direction for Cross-SNS Audience Flow Analyzer. Every screen must read as the
same precision instrument: dense, dark, quiet chrome; the flowing graph is the only living thing.
Concrete values below are FROZEN — never re-theme, never substitute. Canonical spec: `specs/11_ui.md`.
Tokens ship in [references/tokens.css](references/tokens.css) — import, never redefine.

**Visual reference of record: `docs/mockups/ui-mockup.html`** — the approved, browser-verified
prototype of all 11 screens (login, onboarding, main canvas, node/edge detail, filter drawer,
connect and add-url modals, projects, settings, states catalog). When implementing or changing a
screen, open it and match layout, spacing, copy and data presentation. It is the arbiter for
anything this file leaves unstated; where the two disagree, this file's frozen values win.

## Composition pipeline (per UI task)
frontend-design plugin (direction) → build with these tokens → `web-design-guidelines` audit →
webapp-testing screenshot loop (never style blind) → `react-best-practices` perf pass.

## Typography
- Faces: **Geist Sans** + **Noto Sans JP** (UI), **Geist Mono** (all metrics/ids/timestamps).
  Never Inter, Roboto, Open Sans, Lato, Arial, Poppins.
- Every numeric datum: `font-variant-numeric: tabular-nums` — numbers never jitter.
- Scale (px): 11 (dense meta), 12.5 (body-sm), 14 (body), 16 (panel title), 20 (page title),
  28 (KPI). Weights: 400 / 500 / 600 only in chrome; 700+ reserved for KPI numerals.

## Color (all values in tokens.css)
- Dark-first; light + high-contrast themes via the same token names (`[data-theme]`).
- Neutrals: cool zinc ramp (`--surface-0..3`, `--border-subtle/default`, `--text-1..3`).
- ONE accent: cyan (`--accent`) = interactivity + Observed flow. Nothing else is cyan.
- Estimated flow: `--flow-estimated` (desaturated slate) + dashed. Kind is never color-only.
- Platform brand colors (`--plat-youtube/instagram/tiktok/x`) appear ONLY on node identity
  (icon chip / border tint) — never on buttons, text, or edges.
- Confidence → opacity ramp (`--conf-*`); status: `--ok / --warn / --err` used sparingly.

## Space, shape, depth
- 4px spacing grid, no exceptions. Radii: 8px cards/panels, 6px controls, 9999 badges.
- Depth = surface tone + 1px border (`--border-*`); shadows only for overlays (menu, dialog, drag).
- Backgrounds are layered, not flat: canvas gets `--surface-0` + 4% dot-grid + subtle radial
  vignette; panels sit on `--surface-1`. No pure #000 / #fff anywhere.

## Motion
- Micro-transitions 150–250ms, always `--ease-out-custom: cubic-bezier(0.32, 0.72, 0, 1)`;
  never default `ease-in`, never >300ms for UI feedback.
- One orchestrated staggered reveal on canvas load (nodes 20ms apart); no scattered idle animation.
- Never animate high-frequency actions (drag position, hover in lists, pan/zoom).
- Flow particles are the ONLY continuous animation: canvas/WebGL overlay, density=volume,
  speed+brightness=intensity, opacity=confidence; FPS monitor degrades particles → static dashed
  direction marks; `prefers-reduced-motion` ⇒ static marks, always.

## Node / edge visual language (binds spec §4.3, §7.3)
- Node kind = shape + icon + size tier, color last: account (L, brand-tinted border, avatar,
  follower count), post/video (M, thumbnail, play glyph for video), URL/product (S rect card,
  favicon + domain). Lucide icons only, 1.5px stroke, 16/20px.
- Edge: width 1.5–6px by volume; Observed = solid `--accent`, Estimated = dashed
  `--flow-estimated`; arrowhead shows direction; selected edge gets `--accent` glow ring.
- Every state designed: loading (skeleton, no spinners in canvas), empty (guided, no illustration
  clichés), error (reason + retry), stale (dot badge + tooltip).

## Banned (reads as AI-generated)
Purple→pink gradients · glassmorphism/backdrop-blur chrome · emoji in UI · cards nested in cards ·
centered marketing hero + three feature columns · decorative drop-shadow soup · default shadcn
zinc-on-white look with untouched radius/spacing · spinners where skeletons belong · title-case
labels (sentence case everywhere) · more than one accent hue.
