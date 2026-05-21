---
name: feedback-image-quality
description: When mockup/diagram PNGs render blurry via next/image, prefer unoptimized + quality 95 over WebP/AVIF re-encoding
metadata:
  type: feedback
---

For mockup screens, dashboards, and dense diagrams (phone UI, dashboards with text, workflow maps), the default `next/image` AVIF/WebP re-encoding visibly softens text and UI detail — even at `quality={90}`. Founder repeatedly flagged this as a credibility issue ("원본은 선명한데 렌더되면 흐려").

**Why:** AVIF/WebP lossy re-encoding + retina 2x device pixel requests vs. modest source pixel count (e.g., 1535-px-wide source asked to fill a 2400-px retina viewport) produces upscale + lossy compression compounded. For IR-grade pages, image crispness is a trust signal, not decoration.

**How to apply:**
- For detail-heavy mockups/diagrams (phone UI, dashboards, workflow maps): use `unoptimized` on `<Image>` so the original PNG is served as-is. Always pair with `quality={95}` as a fallback (ignored when unoptimized but kept for consistency).
- For photographic content (gallery photos, portraits, environment shots): keep optimization — re-encoding loss is invisible on continuous-tone imagery and bandwidth matters.
- Always check that `sizes` × retina 2x does not exceed the source's native pixel width; if it does, either lower `sizes` to match the container, or go `unoptimized` to avoid Next.js silently upscaling to a larger deviceSize variant (default deviceSizes: 640/750/828/1080/1200/1920/2048/3840).
- `next.config.ts` is currently bare (no `images` config) → defaults apply. If detail-heavy assets ever need optimization back on, add `formats: ['image/webp']` only (skip AVIF, which is more aggressive) and bump `images.qualities` allowlist.
- Trade-off to flag to founder when applying unoptimized: full PNG file size downloads on every visit (mobile data). Acceptable for hero/proof images where credibility > bytes; not acceptable to bulk-apply across all images.

Currently applied to (as of 2026-05-21): `gallery-system.png`, `axvela-ai.png`, `axvela-scan.png`, `scan-flow-2.png` in the Thesis section's product-proof block + 04 workflow card.
