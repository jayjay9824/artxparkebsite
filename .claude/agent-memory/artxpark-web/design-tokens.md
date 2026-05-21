---
name: design-tokens
description: Color, type scale, spacing, border, and motion tokens used consistently across artxpark.com. Required reading before styling anything.
metadata:
  type: project
---

## Color (from `globals.css` + inline usage in `app/page.tsx`)

CSS variables (light surfaces):
- `--bg: #ffffff` · `--fg: #0a0a0a` · `--body: #4a4a4a` · `--muted: #9a9a9a`
- `--border: #e5e5e5` · `--surface: #f7f7f7`
- `--dark-bg: #0a0a0a` · `--dark-fg: #ffffff`

Dark-section body text greys (inline, used in `AIGlass`/`About`):
- Headline: `#fff`
- Body strong: `#b8b8b8`, body soft: `#7a7a7a` ~ `#a8a8a8`
- Borders: `#1a1a1a` (solid divider) or `rgba(255,255,255,0.08)` (card)
- Mono caption: `#6a6a6a`

Accent (the only accent — gold):
- `#c4a96e` (mono labels in dark sections, hover state)
- `#C6A86A` / `#C4A96E` / `#B5963A` (hover border progression on light cards)

## Type scale

- Section eyebrow (`Label` component): 11px, `letter-spacing: 0.18em`, uppercase, weight 500, `var(--muted)` (or `#555` when `light` prop)
- Mono numbered eyebrow (e.g., AI Glass cards): monospace, 11px, `letter-spacing: 0.20em`, `#c4a96e`
- H1 (hero): `clamp(48px, 6.5vw, 76px)`, weight 600, `letter-spacing: -0.035em`, `line-height: 1.06`
- H2 (section): `clamp(28-30px, 3.5-4vw, 46-52px)`, weight 600, `letter-spacing: -0.028 to -0.032em`, `line-height: 1.1-1.13`
- H3 (subsection): `clamp(22-24px, 2.6-3vw, 32-36px)`, weight 500, `letter-spacing: -0.022 to -0.024em`
- Body: 14-17px, `line-height: 1.65-1.85`, weight 300-400, max-width 460-720

## Spacing

- Section vertical padding: `clamp(64px, 10vw, 120px)` (light) / `clamp(80px, 12vw, 140px)` (dark hero sections)
- Section horizontal padding: `clamp(20px, 4vw, 32px)`
- Container: `max-width: 1200px; margin: 0 auto`
- Grid gaps: `clamp(40px, 6vw, 88px)` (two-column hero), `16-20px` (card grids)

## Cards

- Light section card: `background: #fff`, `border: 1px solid var(--border)`, `border-radius: 14px`
- Dark section card: `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 14-20px`, optional `boxShadow: 0 30px 80px -30px rgba(0,0,0,0.8)`
- Hover: borderColor shifts toward gold (`#B5963A`), `translateY(-3px)`, slight shadow lift
- Top accent line (2px gold) is a recurring motif on hover/selected

## Motion

- All scroll-reveal uses the local `Fade` component (IntersectionObserver, `threshold 0.12`, 0.75s ease, `translateY(20px → 0)`)
- For staggered grids: framer-motion `cardsContainerVariants` with `delayChildren 0.1`, `staggerChildren 0.13`, and `cardVariants` ease `[0.22, 1, 0.36, 1]`
- `prefers-reduced-motion` is already honored globally in `globals.css`
- Never add bouncy/playful motion. Keep easing `[0.22, 1, 0.36, 1]` or equivalent.

## Helpers in `app/page.tsx`

- `useFadeIn(threshold)` → `{ref, visible}`
- `<Fade delay={ms}>` → wraps reveal
- `<Label light={bool}>` → 11px uppercase eyebrow
- `fadeUp`, `cardVariants`, `cardsContainerVariants` → framer-motion variants

Related: [[project-structure]] [[content-source-of-truth]]
