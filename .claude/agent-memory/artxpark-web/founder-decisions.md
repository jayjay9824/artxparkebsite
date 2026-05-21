---
name: founder-decisions
description: Settled choices from 지니 about product taxonomy, naming, and what stays off the public site.
metadata:
  type: project
---

Settled (from `content/axvela-website-copy.md` header):
1. All products are branded **AXVELA …** in the copy guide. **Live site rename approved on 2026-05-21** — applied across `app/page.tsx`:
   - `AI Glass` / `AXVELA AI Glass` → **AXVELA VIEW** (nav, footer, section label, image alt, body copy)
   - `ArtXscan` → **AXVELA SCAN**
   - `ArtXdrone` → **AXVELA DRONE**
   - `ArtXbot` → **AXVELA ROBOT**
   - Do NOT touch: mockup PNG file contents (text baked into images), and the Hero right-side AXVELA AI chat assistant mockup code text (`What is this artwork?`, TITLE / ARTIST / YEAR / MEDIUM / STYLE / INTERPRETATION).
   - Why: product naming consistency with deck / source-of-truth.
2. Phase 3 is a single restrained, future-labeled vision statement — no device showcase, no five-product lineup.
3. Confidential signals stay off the public site: fundraising status / "Anchor Discussions"; named auction houses (Sotheby's / Christie's / Phillips) → soften to "Auction" or "major auction houses".

**Bilingual pattern (settled 2026-05-21):** sections that previously had only English h2 or only Korean lead now use the Hero pattern — **English headline as the dominant element, one short Korean sub-line directly under it** (smaller, lighter color, `wordBreak: keep-all`). Apply the same pattern to any new section. Korean sub uses ~`clamp(15px, 1.6vw, 18px)` for h2 subs and ~`clamp(14px, 1.4vw, 16px)` for h3 subs, color `#8a8a8a` on dark backgrounds and `var(--muted)` on light, font-weight 300.

Why: this is how the founder draws the public-vs-VC audience line. Apply this filter to every new section.
How to apply: if a fact is flagged 🔒 DECK-ONLY or ⚠️ CONFIRM in `content/source-of-truth.md`, default to omitting/softening unless 지니 has explicitly approved it in conversation.

Related: [[content-source-of-truth]]
