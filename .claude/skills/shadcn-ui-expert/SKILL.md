---
name: shadcn-ui-expert
description: shadcn/ui, Radix UI, copy-in components, class-variance-authority, cva, Tailwind theming, dark mode, registry
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# shadcn/ui Guardrail

> verified: 2026-08-09. stability=stable. Re-verify quarterly via `cckit verify-skills`.

## Use when
- Building React UI with shadcn/ui copy-in components.
- Customizing Radix UI primitives via cva variants.
- Configuring Tailwind theme tokens / dark mode for shadcn.

## Anti-patterns to refuse
- Do NOT install shadcn components as an npm package — copy-in ownership is the entire point; packaging defeats source-level edits.
- Do NOT hand-roll variant prop logic — use `class-variance-authority` (cva); ad-hoc `className` ternaries lose type safety and compound classes.
- Do NOT mix `darkMode: 'media'` with the shadcn theme — shadcn assumes `darkMode: 'class'` (or `'selector'`) so the CSS variables swap correctly.
- Do NOT inline raw hex colors — go through the CSS variable tokens (`hsl(var(--primary))`) so theming and dark mode stay coherent.
- Do NOT bypass Radix primitives with custom divs (e.g. fake Dialog) — you lose focus trap, ESC handling, aria, portal correctness.
- Do NOT forget `cn()` (clsx + tailwind-merge) when composing classNames — duplicated utilities will fight precedence.

## Common pitfalls
- Watch for Tailwind v4 migration: `tailwind.config.js` is largely replaced by CSS `@theme`; many shadcn snippets still assume v3.
- Watch for theme variable mode: CSS-variable mode (HSL channels) vs direct class mode — mixing them breaks dark mode.
- Watch for Radix Portal under SSR / Next.js — hydration mismatches if portal target differs; gate with mounted state when needed.
- Watch for `data-[state=...]` selectors — they require Tailwind's arbitrary variant syntax to be enabled (default in v3+).
- Watch for `forwardRef` in React 19 — newer shadcn copies use plain refs; older copied components may still wrap in `forwardRef`.
- Watch for registry drift — `npx shadcn@latest add` may overwrite local edits; review the diff before accepting.
- Watch for tailwind-merge version mismatch with Tailwind major version — wrong pairing silently keeps duplicate classes.

## When in doubt
> Read official docs FIRST: https://ui.shadcn.com/docs
> Verify current API before implementing. Do not rely on this skill's specifics.

## Authoritative references
- https://ui.shadcn.com/docs
- https://ui.shadcn.com/docs/theming
- https://www.radix-ui.com/primitives/docs/overview/introduction
- https://cva.style/docs
- https://tailwindcss.com/docs

## cross-sns-audience-flow-analyzer project notes
TODO: fill in
