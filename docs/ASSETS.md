# LANNCO — Delivered Asset Library

## Visual direction

Photoreal luxury-materials photography: warm ivory ground, charcoal/ink blacks, one deep seal-red accent, crisp natural materials and restrained mist. Avoid painted-paper texture, saturated colour, text, logos and decorative frames.

The supplied boards in `assets/mockups/` are the visual source of truth. Board C is the latest reference.

## Hero

| Asset | Location | Purpose |
|---|---|---|
| Desktop still | `src/assets/hero-desktop.png` | Desktop fallback and loading poster |
| Mobile still | `src/assets/hero-mobile.png` | Mobile fallback |
| Film | `public/assets/lannco-hero-film.mp4` | Continuous animated desktop hero |

Keep the three hero files together. The stills are required for reduced-motion, no-JavaScript and slow-network visitors. The hero is full-screen on desktop; its focal crop intentionally preserves the mountain summit.

## Supporting imagery

All supporting artwork is a JPEG master in `src/assets/`. It is registered in `src/data/art.ts` and rendered with `src/components/Art.astro`, which provides responsive AVIF/WebP output through Astro.

| Area | Delivered files |
|---|---|
| About / process / private circle / contact | `about-bonsai.jpg`, `process-ridges.jpg`, `private-circle-doorway.jpg`, `contact-maple.jpg` |
| Capabilities | `cap-strategic-advisory.jpg`, `cap-private-introductions.jpg`, `cap-institutional-markets.jpg`, `cap-opportunities.jpg` |
| Sectors | `sector-private-capital.jpg`, `sector-family-offices.jpg`, `sector-venture-capital.jpg`, `sector-commodities.jpg`, `sector-real-estate.jpg`, `sector-digital-assets.jpg`, `sector-luxury-lifestyle.jpg`, `sector-art-collectibles.jpg` |
| Journal | `journal-gcc.jpg`, `journal-asia-europe.jpg`, `journal-commodities.jpg`, `journal-golf.jpg`, `journal-tokenization.jpg` |

### Replacing or adding an image

1. Add the approved master to `src/assets/` as a high-quality JPEG.
2. Import and register it in `src/data/art.ts` using the existing asset key.
3. Keep the existing `<Art>` component at call sites; it handles responsive output and safe fallback automatically.
4. Run `npm run build` and check the affected desktop and mobile crops.

Important: sector asset-key strings in the data layer are legacy labels. Follow the registrations in `src/data/art.ts`, not the descriptive key text, when replacing a sector image.

## Vector assets

| Asset | Location |
|---|---|
| Kanji watermark and seal source | `src/components/Kanji.astro`, `src/components/Seal.astro` |
| Global network map | `src/components/WorldMap.astro` |
| Process icons | `src/components/ProcessIcon.astro` |
| Arrow glyph | `src/components/Arrow.astro` |
| Browser favicon | `public/favicon.svg` |

## Optimisation notes

The supporting masters were converted from PNG to JPEG before committing, reducing repository weight from roughly 243 MB to 33 MB with no transparency loss. Do not add duplicate PNG equivalents unless a future asset genuinely requires alpha.
