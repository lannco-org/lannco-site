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

| # | Asset | Status | Notes |
|---|-------|--------|-------|
| 12 | 嵐 kanji calligraphy watermark | ✅ `src/components/Kanji.astro` | Outline extracted from **Noto Serif JP (SIL OFL 1.1)** with fontTools, not traced — so it is Mincho, not brushed calligraphy. If the client wants the brush-stroke look from the boards it needs tracing from Board A or a generated asset. Single source of the path; `public/favicon.svg` holds a copy. |
| 13 | Red seal stamps (2 variants: square 嵐 seal, column seal) | ◐ square done: `Seal.astro` | Square variant = Kanji in a CSS border box; used in nav and on the hero image. **Column variant not built** — the only board legible enough to trace it (Board A) is not in the repo. |
| 14 | LANNCO wordmark lockup | ⬚ not started | Type + seal; confirm actual logo files exist with client |
| 15 | Dotted world map with 7 location markers + connection arcs | ✅ `src/components/WorldMap.astro` | **Generated, not drawn:** 2,290 land dots from a 2.6° grid tested against Natural Earth 110m land polygons (public domain), equirectangular, Antarctica cropped to −56..84 lat. Regenerate rather than hand-edit dots. Arcs carry `pathLength="1"` and `data-anim="arc-draw"`; markers carry `data-anim="dot-pulse"` ready for Phase 4. ~91KB of markup — gzips well, but if it ever matters the dots could become one `<use>`-referenced symbol. |
| 16 | Process step icons ×5 (line icons in red circles) | ✅ `ProcessIcon.astro` | Interpretations, not traces — the icons sit at ~20px on Boards B/C, too small to read the line work. Worth client review when Our Process is built. |
| 17 | Arrow/CTA glyph (long arrow →) | ✅ `Arrow.astro` | Replaced the `&#10230;` entity, which rendered at inconsistent widths per platform. |

**Open issue on #15:** the SVG `<text>` labels scale with the viewBox, so they shrink to unreadable at mobile widths. Board C's mobile board shows a bulleted location list next to the map instead of labels — hide the labels under ~56rem and render that list.

## Generation prompts

Portable across Firefly, GPT image and Midjourney. **Claude has no image model** — for Claude, the equivalent task is the vector version (`src/components/HeroArt.astro`), not raster art.

**Aspect ratio matters and the table above is out of date on it.** #1 is described there as "vertical drama", written before the layout existed. The built hero column is *landscape-ish* — ~1.23:1 at desktop, ~1.1:1 at mobile — and the SVG slice-crops. So generate **1:1 at ≥2400px**, which crops safely to both. A 4:5 portrait will lose the summit or the ribbon.

### #1 — hero mountain (master prompt)

> Japanese sumi-e ink-wash painting of a single towering mountain peak emerging from dense mist, brushed in charcoal ink on warm ivory rice paper. One broad asymmetric summit, dark and sharply defined at the crest, dissolving downward into soft grey wash and then into bare paper — no ground line, no horizon. A single vivid vermilion silk ribbon sweeps across the lower third of the frame in one continuous curve, folding once so light catches the fold, both ends dissolving into the mist. Vast negative space: upper corners and lower third almost empty paper. Entirely monochrome except that one red accent. Visible brush texture, wet-edge ink bleed, paper grain. Serene, austere, expensive. No text, no signature, no seal, no border, no frame, no people, no buildings, no birds.

Composition constraints that come from the build, not from taste — keep them:
- **Peak centred or slightly right of centre.** The layout slice-crops the sides; a peak against an edge gets cut.
- **Lower third must fall away to near-white.** The page hazes the image into the paper background, so a hard bottom edge or a dark base will show as a seam.
- **The ribbon is the only saturated thing on the entire site.** One accent, deep seal red (`#a02a20`), not orange, not pink, not scarlet.

Per-tool:
- **Midjourney:** append `--ar 1:1 --style raw --s 150`. Omit `--v` so it uses your default version.
- **Firefly:** Content type *Art*, aspect *Square*, and put this in Exclude: `text, watermark, signature, border, frame, people, buildings, birds, boats, saturated colours, orange, pink, blue sky, photorealistic, HDR`.
- **GPT image:** paste the prompt as-is and ask for the largest square size available. It tends to add a signature or seal — if it does, say "remove all marks and signatures" rather than regenerating.

### Locked style suffix (the object series, #6–#10)

Append verbatim to every one of the studio-object prompts, so the twelve objects read as one shoot:

> — single object centred on a seamless warm ivory backdrop (#f5f2ec), one soft key light from upper left, long soft shadow to lower right, charcoal blacks, no props, no text, no reflections on the backdrop, sumi-e restraint, museum-catalogue stillness

## Generation plan

- Tool: Midjourney (or Firefly) with a locked style prompt suffix for consistency across the object series; upscale to 2×.
- Deliver to `assets/source/` as source PNG (`assets/mockups/` holds the client design boards — keep them separate). Astro's build handles the AVIF/WebP responsive sets; nothing compresses them for us, so the pipeline is ours to write. *(Superseded reference: this line used to say "before Webflow upload" — platform is custom code on Vercel, see PLAN.md.)*
- Priority order: #1 (hero) → #6–9 (capability cards) → #2, #4 → #10 → #11.

## Typography

- Mockup display serif resembles **Canela/Saol** (paid). Free fallbacks: **Cormorant** or **Instrument Serif**, both on fontsource so they self-host. Decision needed: license budget vs free.
- Labels/nav: letterspaced small-caps sans — **Inter** or **Archivo** (free) works.
- Kanji rendered as SVG artwork (asset #12), not live text — avoids shipping a CJK font.
