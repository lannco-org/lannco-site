# LANNCO — Asset Audit

Status: all listed production imagery is delivered and wired from the board-approved Higgsfield set. Future generations must match the final photoreal direction below.

**Style anchor:** photoreal luxury-materials photography. Flat warm ivory ground, charcoal/ink blacks, one deep seal-red accent, crisp granite and restrained mist. No painted-paper texture.

## Photographic / generated imagery

| # | Asset | Used on | Notes |
|---|-------|---------|-------|
| 1 | Mountain in mist with red silk ribbon wrapping the peak | Home hero | ◐ **Delivered** 2026-07-29 (GPT, from the prompt below) → `src/assets/hero-mountain.png`, 1254×1254. Composition and art direction are right. **Needs a ≥2400px version before launch** — see the resolution note below. Superseded the SVG stand-in `HeroArt.astro` (recoverable at commit `ee6905a`). |
| 2 | Bonsai/red-maple tree on rock in still water | About | Reflection, heavy negative space |
| 3 | Layered ridgelines dissolving into mist | Our Process | Horizontal, monochrome, no red |
| 4 | Red maple arrangement in a dark stone interior | Contact | Board C's contact scene |
| 5 | Slatted doorway opening onto warm light and maple branches | Private Circle | Board C's private-circle scene |
| 6 | Rough grey stone monolith on ivory | Capability card 01 + Strategic Advisory hero | Studio-lit object series begins here |
| 7 | Red silk/velvet fabric folds, macro | Capability card 02 | |
| 8 | Black liquid-marble/ink swirl | Capability card 03 | |
| 9 | White marble geometric block | Capability card 04 | |
| 10 | Sector objects ×8: dark stone, red lacquer sphere, pale portal, gold bar, pale niche, chrome torus, charcoal armchair, tan sandstone sculpture | Sectors grid | One object per sector, same ivory backdrop and lighting |
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

Everything the site needs, ready to paste. **22 images across 11 entries.** Written for Higgsfield but portable — nothing here depends on a specific tool except the settings section at the end.

### First: how many versions of each?

This is the question that decides the whole workflow, so decide it before generating anything.

| Route | What to make | When |
|---|---|---|
| **Video** *(recommended for the hero)* | **1 still + 1 short video generated from it.** No extra versions. | The motion is baked into the video, so no layers are needed. |
| **Code-driven layers** | **2 stills**: the full image, plus the same image with the red ribbon removed. | Only if you are *not* doing a video. |

**If you are using Higgsfield for video, ignore the two-file "plate" request from earlier — it is obsolete.** It existed only to let code animate the ribbon separately. A video does that better, and a plate that is one pixel out of alignment is worthless.

You still need a still for every video, but **not a separate generation** — the video's first frame is the still. It becomes the `poster`, and the entire fallback for reduced-motion, no-JS, and slow connections.

**Only the hero should be video.** Eight sector tiles as video would be tens of megabytes for images the user sees at 90px. Everything except #1 is a still. If you want one more, #4 (Contact) is the candidate — a slow push into a dark doorway.

### Aspect ratios — read from the built layout, not guessed

Several assets are used at more than one ratio, so the master has to survive every crop. These are the ratios to generate at:

| # | Generate at | Used in the layout at | Why that master |
|---|---|---|---|
| 1 | **16:9 desktop + portrait mobile master** | Full-bleed hero | Separately art-directed masters preserve the copy-safe area at each breakpoint. |
| 2 | **16:9** | 16:7 | Crops to a letterbox — keep the subject dead centre vertically. |
| 3 | **16:9** | 16:6 | Ultra-wide crop; all content in the middle third. |
| 4, 5 | **4:3** | 4:3 | Exact. |
| 6–9 | **1:1** | 3:4 portrait (home + overview cards), 4:3 landscape (detail page) | Same asset at both orientations — only a square survives both. |
| 10 (×8) | **1:1** | 1:1 | Exact. |
| 11 (×5) | **3:2** | 16:9 featured, 4:3 cards, 1:1 list thumb | Three ratios off one file; 3:2 is the only master that keeps the subject in all three. |

**Resolution:** ≥2400px on the long edge for #1–#5, ≥1600px for #6–#11. Current Higgsfield models support native high-resolution output.

### The three locked style suffixes

Append the matching one to every prompt in its family. This is what makes 22 separately-generated images look like one commission.

**A — atmospheric photography** (#1–#5):

> — photoreal luxury editorial image on a flat warm ivory ground, charcoal and grey only with one single deep seal-red accent, crisp natural materials, soft atmospheric mist, generous negative space, serene and austere. No text, no signature, no seal, no border, no frame, no people.

**B — studio object on ivory** (#6–#10):

> — single object centred on a seamless warm ivory backdrop, one soft key light from upper left, long soft shadow falling to lower right, charcoal blacks, muted and desaturated, museum-catalogue stillness, no props, no text, no visible reflections on the backdrop, generous empty space around the object.

**C — journal photography** (#11):

> — moody desaturated photograph, warm ivory and charcoal palette, soft overcast light, fine grain, quiet and editorial, no people, no text, no logos, no saturated colour.

---

### #1 — Home hero: mountain and red ribbon ✅ delivered, wants a re-run at higher resolution

> A single towering mountain peak emerging from dense mist. One broad asymmetric summit, dark and sharply defined at the crest, dissolving downward into soft grey wash and then into bare paper — no ground line, no horizon. A single vivid vermilion silk ribbon sweeps across the lower third of the frame in one continuous curve, folding once so light catches the fold, both ends dissolving into the mist. Leave the top 15% and the bottom 12% of the frame as empty paper. Keep the peak centred or slightly right of centre. Square.

Those numbers are layout arithmetic: `cover` crops ~9.4% off the top and bottom, so ink outside that band is cut. Peak centred because the sides crop at narrow widths.

### #2 — About: bonsai on rock in still water

> A single windswept bonsai or red-maple tree growing from a dark rock that rises out of perfectly still water. A clean mirror reflection below it. The tree is small in the frame and sits dead centre; mist erases the horizon so the rock appears to float. Two or three leaves are seal red — the only colour present. Vast empty paper above and to both sides. 16:9.

**Centre it vertically** — this crops to 16:7, so anything in the top or bottom eighth is lost.

### #3 — Our Process: layered ridgelines

> Layered charcoal mountain ridges receding through pale mist. No horizon, no red, no people. Ultra-wide composition with the forms held through the middle horizontal third. 16:9.

The ridges should create a calm horizontal progression beneath the five process steps.

### #4 — Contact: red maple in a dark stone interior

> A red maple arrangement in a dark stone interior, with the maple as the only colour. Strong contrast between near-black stone and the red leaves. 4:3.

### #5 — Private Circle: slatted doorway with warm light and maple branches

> A dark slatted doorway opening onto warm light and maple branches. Deep shadow occupies most of the image, with warm light and red maple beyond the opening. Intimate, quiet and almost nocturnal. 4:3.

### #6 — Capability 01, Strategic Advisory: stone monolith

> A single rough grey granite monolith standing upright, irregular and unpolished, like a fragment of a mountain. Matte, dry, heavy. No pedestal. Square.

### #7 — Capability 02, Private Introductions: red silk folds

> Deep crimson silk fabric in soft folds, photographed close. Two or three broad folds catching light, the rest falling into shadow. Fabric fills the frame. This is the one asset where the red *is* the subject — deep seal red, never orange or pink. Square.

*(Drop the "muted and desaturated" clause from suffix B for this one only.)*

### #8 — Capability 03, Institutional Markets: black ink swirl

> A swirl of glossy black liquid, like ink poured into water, caught mid-motion. Deep blacks with sharp specular highlights along the curl edges. Fills the frame. Square.

### #9 — Capability 04: white marble block

> A single geometric block of white marble with fine grey veining, softly lit so the edges are just distinguishable from the ivory backdrop. Very low contrast, almost monochrome, quiet. Square.

### #10 — Sectors, eight objects

One prompt each, **all eight with suffix B and nothing else varied** — identical backdrop, lighting and framing is the entire point. Square, ≥1600px.

1. **Private Capital** — > A single rough dark grey stone, rounded and river-worn, resting on its side.
2. **Family Offices** — > A single polished deep-red lacquer sphere, mirror-finish, one soft highlight.
3. **Venture Capital** — > A single thin brushed-steel ring standing upright, a perfect circle seen slightly off-axis.
4. **Real Estate** — > A small architectural model of a pale stone arch, clean geometry, sharp shadow through the opening.
5. **Digital Assets** — > A single matte black ceramic vessel with a narrow neck, minimal and modern.
6. **Luxury & Lifestyle** — > A single mid-century leather lounge chair in dark tan, seen three-quarter on.
7. **Commodities** — > A single cast gold bar, brushed not shiny, resting flat.
8. **Art & Collectibles** — > A fragment of a classical marble torso on a low plinth, weathered, one arm missing.

### #11 — Journal, five thumbnails

All with suffix C. **3:2, ≥1600px, subject centred** — these get cropped to three different ratios.

1. **The Rise of Private Capital in the GCC** — > A minimal modern concrete-and-glass facade seen from below at an angle, strong diagonal lines, overcast sky, no signage.
2. **Why Asia is Investing in Europe** — > A misty mountain valley at dawn, layered ridgelines fading into haze, no buildings.
3. **Institutional Commodities Outlook** — > A dark sea stack rising from calm grey water under flat overcast light, long exposure, glassy sea.
4. **Luxury Golf Estates: A New Asset Class** — > A manicured green landscape with soft rolling contours and a line of distant trees in low mist, early morning, empty.
5. **Tokenization of Real Assets** — > A brutalist concrete building corner, raw board-marked concrete, hard geometry against a pale flat sky.

---

## Higgsfield: what to use and how to set it

**Caveat worth reading:** Higgsfield ships fast and renames things. Model names below are what I know as of early 2026 and may have moved — **pick by capability, not by name**, and the capability you want is described in each case. I could not check the current roster from here: the Higgsfield connector needs an interactive login this session cannot do.

### For the 21 still images

- Use their **photoreal image model** (the "Soul" family) for #6–#11. Those are photographs of objects and places, and photoreal is exactly right.
- **Do not use a photoreal model for #1–#5.** They are ink-wash *paintings*; a photoreal model fights the brief and gives you a photograph of a mountain rather than a painting of one. If Higgsfield has no painterly/illustration mode, generate #1–#5 in GPT image or Firefly instead — the delivered hero came from GPT and the style is right.
- Turn **off** any "enhance prompt" / auto-rewrite option. It will add colour, drama and sky to prompts whose whole point is restraint.
- Aspect ratio per the table above. Highest resolution offered.
- Generate **4 variations of each and pick one**, rather than iterating on one. These prompts are tightly constrained, so the variance between draws is mostly what you want to choose from.

### For the hero video

- Mode: **image-to-video**, with the finished #1 still as the **start frame**. Not text-to-video — you already have the composition and you do not want it reinvented.
- Model: their **camera-control / "DoP" style video family**, because it lets you specify almost no camera movement. If a start-*and*-end-frame option exists, use it with the *same image* at both ends — that is the cleanest way to get a seamless loop.
- **Duration: 5 seconds.** Longer costs payload for motion nobody notices on a hero.
- Camera preset: **static, or the slowest push-in available.** Explicitly avoid crash zoom, bullet time, orbit, whip pan, dolly-out — anything dramatic. This is a serene brand; the motion should be barely perceptible.
- Motion prompt, roughly: > Static camera. Only the mist drifts slowly across the mountain's base and the red silk ribbon undulates gently. The mountain itself does not move or change shape. Extremely slow, subtle, continuous.
- **Watch for morphing.** Ink-wash texture and rock edges are exactly what video models re-draw frame to frame; if the peak breathes or the ribbon changes shape, reject the take. This is the most likely failure and it is very visible.

### Then hand me

- The **video** (MP4 is fine, highest quality — I will transcode to WebM/VP9 plus an MP4 fallback and target under ~3MB).
- Nothing else. I extract the poster frame from the video, so there is no separate still to supply.

Delivered as a video, the hero becomes `<video autoplay muted loop playsinline poster="…">` with the poster shown for reduced-motion, no-JS and while the video loads. **It replaces the WebGL fog** currently in `src/scripts/mist.ts` — real generated mist beats a procedural approximation of it, and deleting the shader removes ~150 lines.

### Where delivered art lives, and why

Generated masters go in **`src/assets/`**, not `assets/source/` as this doc used to say — Astro's `astro:assets` only builds responsive AVIF/WebP sets for images under `src/`. `assets/mockups/` stays what it was: client design boards only. Import with `<Picture>` and **set `fallbackFormat="jpeg"`** — the masters are PNGs and Astro will otherwise emit a multi-MB PNG fallback (the hero's was 2.3MB; as JPEG it is 167KB, and the AVIF actually served is 41KB).

### Resolution: measure it, don't eyeball it

The hero's `sizes` is `58vw`, so on a 1440 viewport it lays out at ~743 CSS px. At DPR 2 that needs **1486 device px** and the master supplies 1254 → **0.84×, mildly soft**; on a 2560-wide display it is worse. Mobile is fine (350 CSS px × DPR 3 = 1050 needed, covered). So a **≥2400px master** clears every case with headroom.

Careful with `naturalWidth` when checking this: with `w` descriptors in a srcset it returns the *density-corrected* intrinsic width, not the file's pixels. It reported 835 for a 1254px file and made the shortfall look twice as bad as it was. Read the chosen filename out of `img.currentSrc` instead.

### For animated parity with the reference site

The reference hero is a live WebGL mist. Against a flat raster we currently do: the `mask-up` wipe on load, scroll parallax, and `data-anim="drift"` (an 18s / 3% scale breath, so the frame is never frozen). To go further the image has to come apart into layers that can move at different rates. In order of value:

1. **≥2400px master** — the only actual blocker.
2. **The same composition with the red ribbon removed** (a clean plate). Then the ribbon becomes its own layer over the mountain and can drift on its own, which is the most legible motion in the frame. Ask for an *edit* of this exact image, not a regeneration, or the mountain will not match.
3. **A mist/fog-only pass on transparency** — enables a genuinely crawling fog and gets closest to the reference.

The ribbon can also be isolated from the existing image by red-hue masking without any new generation, but that leaves a hole where it sat, which is why the clean plate in (2) is worth asking for.

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
