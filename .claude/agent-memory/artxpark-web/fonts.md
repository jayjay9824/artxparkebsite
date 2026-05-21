---
name: fonts
description: Site-wide typography stack — Inter (Latin) + Pretendard (Korean) self-hosted via next/font. Where files live and why.
metadata:
  type: project
---

## Stack

- **Inter** — loaded via `next/font/google` as a variable font. CSS var `--font-inter`.
- **Pretendard** — variable woff2 self-hosted from `app/fonts/PretendardVariable.woff2`, loaded via `next/font/local` with `weight: "45 920"`. CSS var `--font-pretendard`.
- Package `pretendard@^1.3.9` (SIL OFL-1.1) is installed as a dep. The woff2 is **copied** into `app/fonts/` rather than referenced via `node_modules/pretendard/...`.

## Why copy into `app/fonts/` instead of referencing `node_modules`

Next.js 16 + Turbopack file watching + `next/font/local` `src` pointing into `node_modules` is fragile across npm reinstalls and CI. The canonical Next.js docs example co-locates fonts under `app/fonts/`. Copying is one-time and the version is pinned via the npm package; updating Pretendard = `npm update pretendard` + re-copy.

## CSS variable stack (in `globals.css`)

```css
--font-sans: var(--font-inter), var(--font-pretendard), -apple-system,
  BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Segoe UI",
  sans-serif;
```

`html, body { font-family: var(--font-sans); }`. Browser glyph fallback handles Latin→Inter, Hangul→Pretendard automatically. Korean-mixed sentences render naturally.

## License

SIL OFL-1.1 — license file is co-located at `app/fonts/Pretendard-OFL.txt`. No attribution required in UI per OFL; keeping the license file shipped is sufficient.

## Headline weights

NOT changed. `app/page.tsx` already has explicit `fontWeight: 300/500/600` hierarchy. Variable font weight range (45–920 for Pretendard, Inter variable) covers all in-use values. Do not bulk-adjust weights without founder approval — current hierarchy is intentional dark-luxury tone.

Related: [[design-tokens]] [[project-structure]]
