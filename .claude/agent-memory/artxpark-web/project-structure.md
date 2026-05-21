---
name: project-structure
description: Repo layout — where the single-page site lives, where content lives, and what stack is in use.
metadata:
  type: project
---

## Stack

- Next.js **16.2.4** (App Router) — note: AGENTS.md explicitly warns this version has breaking changes vs. older Next.js. Read `node_modules/next/dist/docs/` before using unfamiliar APIs.
- React 19.2.4, TypeScript, Tailwind v4 (`@tailwindcss/postcss`), framer-motion 12.
- No `lint` or `typecheck` scripts in `package.json`. Only `dev` / `build` / `start`. Quality gate = `pnpm build` (or `npm run build`).

## Layout

- `app/layout.tsx` — root metadata (OG/Twitter/canonical), `<html lang="ko">`. Update copy here when product naming or hero positioning changes.
- `app/page.tsx` — the entire single-page site (~2060 lines). All sections live here as colocated React functions:
  - `Nav` (sticky, links via hash anchors)
  - `Hero` + `HeroChatPanel` (chat-style assistant demo)
  - `AxvelaOverview` (`#axvela`)
  - `WhyAxvela`
  - `AIGlass` (`#ai-glass`, dark section)
  - `Ecosystem` (`#ecosystem`)
  - `About` (`#about`, dark section)
  - `Team` (`#team`)
  - `Footer`
- `app/globals.css` — tokens, keyframes (`typingPulse`, `cursorBlink`, `messageIn`, `responseIn`).
- `app/sitemap.ts` — sitemap.
- `public/images/` — all images (logo.jpg, axvela_logo_wh.png, axvela_glass_pov.png, axvela_glass_experience.png, simon_fujiwara_hq.png, van_*.jpg, drone.jpg, bot.jpg, gallery-system.png, axvela-ai.png, axvela-scan.png, passport.png, phase-devices.png [unplaced — conflicts with no-device-showcase policy]).
- `content/source-of-truth.md` and `content/axvela-website-copy.md` — copy source of truth.

## Conventions observed

- Single-file colocated sections in `page.tsx`. Do NOT split into a components/ directory unless asked — the project's current convention is one file.
- All styling is **inline** via `style={{}}` (with Tailwind only for responsive grid utilities and a few class helpers like `hidden sm:flex`).
- Hash-anchor navigation. New section IDs go in both the section element and the `Nav.links` + `Footer` nav arrays.
- `Fade` wraps every reveal block; framer-motion is used only where stagger is needed.

Related: [[design-tokens]]
