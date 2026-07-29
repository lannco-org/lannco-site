# LANNCO — Asset Audit

Status: client has **screenshots only** (no Figma, no exports). Every hero-grade image below must be regenerated at production resolution (≥2400px wide for heroes, ≥1200px for cards) in a consistent style before build Phase 2 completes.

**Style anchor:** Japanese ink-wash (sumi-e) meets luxury-materials photography. Ivory paper ground, charcoal/ink blacks, one deep seal-red accent. Soft mist, hard subject.

## Photographic / generated imagery

| # | Asset | Used on | Notes |
|---|-------|---------|-------|
| 1 | Mountain in mist with red silk ribbon wrapping the peak | Home hero | The signature image. Vertical drama, white sky for text overlay left |
| 2 | Bonsai/red-maple tree on rock in still water | About | Reflection, heavy negative space |
| 3 | Stepping stones through misty water | Our Process | Horizontal, leads the eye left→right |
| 4 | Dark cave/stone interior opening onto red maple | Contact / Private Circle | Doorway metaphor, mostly black |
| 5 | Red maple branch against dark interior wall + shoji light | Private Circle | Alt to #4 |
| 6 | Rough grey stone monolith on ivory | Capability card 01 + Strategic Advisory hero | Studio-lit object series begins here |
| 7 | Red silk/velvet fabric folds, macro | Capability card 02 | |
| 8 | Black liquid-marble/ink swirl | Capability card 03 | |
| 9 | White marble geometric block | Capability card 04 | |
| 10 | Sector objects ×8: stone, red lacquer sphere, wire ring sculpture, stone arch/interior, designer chair, gold bar, black vessel, classical torso | Sectors grid | One object per sector, same ivory backdrop and lighting |
| 11 | Journal thumbnails ×5: dark sea stack, misty mountain valley, brutalist building, golf-estate landscape, abstract architecture | Journal | Moodier, photographic |

## Vector / drawn assets (I build these — no generation needed)

| # | Asset | Notes |
|---|-------|-------|
| 12 | 嵐 kanji calligraphy watermark | SVG, large, low-opacity hero/section backdrop |
| 13 | Red seal stamps (2 variants: square 嵐 seal, column seal) | SVG, trace from screenshots |
| 14 | LANNCO wordmark lockup | Type + seal; confirm actual logo files exist with client |
| 15 | Dotted world map with 7 location markers + connection arcs | SVG, animated via GSAP |
| 16 | Process step icons ×5 (line icons in red circles) | SVG |
| 17 | Arrow/CTA glyph (long arrow →) | SVG |

## Generation plan

- Tool: Midjourney (or Firefly) with a locked style prompt suffix for consistency across the object series; upscale to 2×.
- Deliver to `assets/source/` as source PNG (`assets/mockups/` holds the client design boards — keep them separate). Astro's build handles the AVIF/WebP responsive sets; nothing compresses them for us, so the pipeline is ours to write. *(Superseded reference: this line used to say "before Webflow upload" — platform is custom code on Vercel, see PLAN.md.)*
- Priority order: #1 (hero) → #6–9 (capability cards) → #2, #4 → #10 → #11.

## Typography

- Mockup display serif resembles **Canela/Saol** (paid). Free fallbacks: **Cormorant** or **Instrument Serif**, both on fontsource so they self-host. Decision needed: license budget vs free.
- Labels/nav: letterspaced small-caps sans — **Inter** or **Archivo** (free) works.
- Kanji rendered as SVG artwork (asset #12), not live text — avoids shipping a CJK font.
