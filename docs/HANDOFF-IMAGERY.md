# Handoff — wire the generated imagery into the site

Written 2026-07-29. Scope: **the 21 non-hero images only.** Everything needed is
already generated and staged. This is a wiring task, not a generation task.

Read [HANDOFF.md](HANDOFF.md) for the build's conventions first. This file adds
only what that one doesn't carry.

---

## 1. Do not touch the hero

Ryan is doing the hero himself and has **uncommitted work in the tree right now.**
Leave all of it alone:

| Off limits | Why |
|---|---|
| `public/assets/lannco-hero-film.mp4` | 8.4MB hero video Ryan produced |
| `src/scripts/motion.ts` | +86 uncommitted lines, his video/motion wiring |
| The hero block in `src/pages/index.astro` | `<picture>` + `.hero-media`, his |
| Every `.hero-*` rule in `src/styles/global.css` | his, plus stale edits of mine |
| `src/assets/hero-desktop.png`, `hero-mobile.png` | committed hero masters |

`git status` will show `src/pages/index.astro`, `src/scripts/motion.ts` and
`src/styles/global.css` modified. **Do not commit, revert, stash or reformat
those three.** Stage only the files you add yourself. `global.css` also contains
leftover uncommitted hero CSS of mine that Ryan may discard — not your call.

`src/assets/hero-mountain.png` is orphaned (nothing imports it) but leave it;
it's hero-adjacent.

---

## 2. What is already done

All 21 images are generated and sitting in `src/assets/` with final names. They
are **untracked** — that is expected, they are yours to commit.

They were generated from the **client boards** (`assets/mockups/board-c-*.png`),
not from ASSETS.md's prose. That matters — see §5.

---

## 3. The one thing to do before committing: convert to JPEG

`src/assets/` currently holds **243MB of PNG**. Committing that puts a quarter of
a gigabyte in git history permanently.

Measured: q92 JPEG is **0.136×** the size — 243MB → **~33MB**. None of these
images need alpha, and Astro re-encodes everything to AVIF/WebP at build time
anyway, so the *served* output is unchanged. Verified sample:

```
about-bonsai.png       21M  ->  2.2M
sector-commodities.png 6.5M ->  832K
journal-gcc.png        7.7M ->  1.7M
```

Convert with `sips -s format jpeg -s formatOptions 92 <in>.png --out <out>.jpg`,
delete the PNGs, and update the import extensions. Do this **before** the first
commit, not after.

---

## 4. The wiring, and why it is small

Don't edit ten pages by hand. The asset reference is **already single-sourced**:
`src/data/capabilities.ts`, `src/data/site.ts` and journal frontmatter each carry
an `asset` string, and every call site already declares its own ratio.

`src/components/Placeholder.astro` takes `{ asset, variant, class, ratio,
parallax }` and emits `data-asset` so that
`document.querySelectorAll('[data-asset]')` lists what is still outstanding.

**Recommended approach — add `Art.astro` alongside it, same props:**

1. `src/data/art.ts` — a registry mapping asset key → imported image.
2. `Art.astro` — takes `Placeholder.astro`'s exact props, renders
   `<Picture fallbackFormat="jpeg" />`, and **falls back to rendering
   `Placeholder` when the key isn't in the registry.**
3. Swap the import at each call site.

The fallback is the important part: partial wiring stays safe, nothing 500s on a
missing key, and the `[data-asset]` audit trick keeps working for whatever is
left. `fallbackFormat="jpeg"` is required — see [ASSETS.md](ASSETS.md) §
"Where delivered art lives".

Call sites — 4 inline, 7 via data:

| File | Line | Ratio |
|---|---|---|
| `src/pages/about.astro` | 50 | `.lead` grid |
| `src/pages/our-process.astro` | 39 | wide |
| `src/pages/private-circle.astro` | 24 | `.lead` grid |
| `src/pages/contact.astro` | 27 | `.lead` grid |
| `src/pages/sectors.astro` | 25 | `1 / 1` |
| `src/pages/capabilities/index.astro` | 30 | `3 / 4` |
| `src/pages/capabilities/[slug].astro` | 45 | `4 / 3` |
| `src/pages/journal/index.astro` | 27, 40 | `16 / 9`, `4 / 3` |
| `src/pages/journal/all.astro` | 31 | `1 / 1` |
| `src/pages/journal/[slug].astro` | 43 | `16 / 9` |

---

## 5. The mapping — and a trap in it

**Read this table rather than matching on the key text.** The `asset` strings in
the data layer describe the *original* ASSETS.md brief, which diverges from the
boards on four of the eight sector objects. The generated files follow the
**boards** (correct). Map by **row**, never by what the string says.

### Sector tiles — `src/data/site.ts`

| Sector label | `asset` key (misleading) | File — what was actually generated |
|---|---|---|
| Private Capital | `#10 stone` | `sector-private-capital.png` — angular dark rock |
| Family Offices | `#10 red lacquer sphere` | `sector-family-offices.png` — glossy red sphere |
| Venture Capital | `#10 wire ring sculpture` ⚠️ | `sector-venture-capital.png` — **pale architectural portal** |
| Commodities | `#10 gold bar` | `sector-commodities.png` — brushed gold bar |
| Real Estate | `#10 stone arch/interior` | `sector-real-estate.png` — pale arched niche |
| Digital Assets | `#10 black vessel` ⚠️ | `sector-digital-assets.png` — **chrome twisted torus** |
| Luxury & Lifestyle | `#10 designer chair` ⚠️ | `sector-luxury-lifestyle.png` — **charcoal upholstered armchair** |
| Art & Collectibles | `#10 classical torso` ⚠️ | `sector-art-collectibles.png` — **rough tan sandstone** |

### Capability cards — `src/data/capabilities.ts`

| `asset` key | File |
|---|---|
| `#6 rough grey stone monolith on ivory` | `cap-strategic-advisory.png` |
| `#7 red silk/velvet fabric folds, macro` | `cap-private-introductions.png` |
| `#8 black liquid-marble/ink swirl` | `cap-institutional-markets.png` |
| `#9 white marble geometric block` | `cap-opportunities.png` |

### Journal — frontmatter in `src/content/journal/*.md`

| `asset` key | File |
|---|---|
| `#11 abstract architecture` | `journal-gcc.png` |
| `#11 misty mountain valley` | `journal-asia-europe.png` |
| `#11 dark sea stack` | `journal-commodities.png` |
| `#11 golf-estate landscape` | `journal-golf.png` |
| `#11 brutalist building` | `journal-tokenization.png` |

### Page scenes — inline `asset=`

| Page | `asset` key | File | Note |
|---|---|---|---|
| about | `#2 bonsai/red-maple tree on rock in still water` | `about-bonsai.png` | matches |
| our-process | `#3 stepping stones through misty water` ⚠️ | `process-ridges.png` | **board panel 07 is layered misty ridgelines, not stepping stones, and has no red** |
| contact | `#4 dark cave/stone interior opening onto red maple` ⚠️ | `contact-maple.png` | **board panel 09 is maple in a dark vessel on stone** |
| private-circle | `#5 red maple branch against dark interior wall + shoji light` ⚠️ | `private-circle-doorway.png` | **board panel 08 is the slatted doorway with warm light — #4 and #5 are effectively swapped vs the doc** |

---

## 6. ASSETS.md is wrong — fix it in the same change

[HANDOFF.md](HANDOFF.md) says the boards beat the written notes. They do, and
following the prose instead cost a wasted generation round. Correct these so the
next person doesn't repeat it:

1. **Style suffix A** (`ASSETS.md` ~line 75) specifies *"Japanese sumi-e
   ink-wash painting… visible brush texture and wet-edge ink bleed"* on *"warm
   ivory rice paper"*. Board C is **photoreal** — sharp granite, flat off-white,
   no paper texture. This is the root error.
2. **#3** is written as stepping stones; board panel 07 is layered ridgelines,
   monochrome, no red.
3. **#4 / #5** are swapped relative to Board C (doorway belongs to Private
   Circle).
4. **#10** object list is wrong on 4 of 8 — see the ⚠️ rows above.
5. **#1's 1:1 ratio** is stale; it derived from the old 58vw column layout.

Also stale: line ~69 references a *"Getting to 2400px"* section that does not
exist, and says generators cap below 2400px. They don't — Higgsfield's
`nano_banana_pro` and `gpt_image_2` both expose a native `4k` tier.

---

## 7. Known quality gaps in the delivered set

- `journal-golf.png` and `journal-commodities.png` carry more colour saturation
  than style suffix C's *"no saturated colour"*. Cheap to re-run if Ryan wants
  them stricter.
- The 12-object series (4 capability + 8 sector) was generated **without** image
  references. It reads as one shoot, but if any tile drifts, `nano_banana_pro`
  accepts up to 14 `image_references` — pass an approved tile to lock backdrop
  and lighting.

Regenerating needs the Higgsfield CLI (`higgsfield generate create
nano_banana_pro …`), already installed and authenticated as
`vbd72gh62p@privaterelay.appleid.com` with ~1050 credits. 2k costs 2 credits,
4k costs 4–6 depending on aspect. Board-derived prompts are in the session
scratchpad scripts if they survive; otherwise re-derive from
`assets/mockups/board-c-desktop-mobile-12-panel.png`.

---

## 8. Verify like this, not with a build alone

A green build proves nothing about rendering. What caught real problems here:

```bash
npm run build && npm run preview   # note the port it picks, often not 4321
```

Then drive **system Chrome** via Playwright (`chromium.launch({ channel:
'chrome' })`). Playwright is not a project dependency — install it in a temp
directory, not into `package.json`.

Check per route, at 390 and 1440: status 200, no console errors, and
`documentElement.scrollWidth <= clientWidth + 1`.

Two traps that cost time:

- **Chrome's legacy `--headless` ignores `--window-size` for layout.** It renders
  at ~800px and crops the screenshot, which fabricates convincing "overflow"
  bugs. Use a real Playwright viewport.
- **Wait ~7s before screenshotting.** The `data-intro` timeline plus preloader
  runs ~3.5s; shoot earlier and you capture half-revealed text inside its
  `overflow: clip` mask and will think the layout is broken.

Sanity check that motion is alive: with normal motion, `documentElement.className`
is `motion-ok lenis` and ~15 `[data-anim]` elements carry transforms. Under
`prefers-reduced-motion` the class is empty and nothing animates — that is
**by design**, per the hard rule in `CLAUDE.md` that reduced-motion users always
see content. Don't "fix" it.

---

## 9. Definition of done

- [ ] Masters converted to q92 JPEG (~33MB total, down from 243MB)
- [ ] `src/data/art.ts` + `Art.astro` added, falling back to `Placeholder`
- [ ] All 21 slots resolve; `[data-asset]` audit returns empty for wired pages
- [ ] `fallbackFormat="jpeg"` everywhere
- [ ] ASSETS.md corrected per §6
- [ ] 11 routes 200 at 390 and 1440, no overflow, no console errors
- [ ] Only your own files staged — hero and `motion.ts` untouched
- [ ] Do **not** push without asking Ryan. Production
      (`lannco-site.vercel.app`) is publicly reachable and on the Hobby plan,
      which he is upgrading before launch.
