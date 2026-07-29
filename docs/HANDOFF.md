# HANDOFF — LANNCO build (written 2026-07-29)

Context for continuing the build in a fresh session. Plan/phases/decisions: [PLAN.md](PLAN.md). Copy: [COPY.md](COPY.md). Assets: [ASSETS.md](ASSETS.md). This file adds only what those don't carry.

**First moves in a new session:** read this file, then `assets/mockups/*.png` (they beat the written notes), then `npm run dev`. Next work item is **Phase 3** — see "Next work" below. Two decisions are waiting on Ryan and are worth asking about up front: the **capability 04 name** and whether the Vercel account is on **Pro**.

## Current state (verified working, end of session 2 — 2026-07-29)

**Phases 1 and 2 are complete.** 14 routes build and all serve 200. Node 24.

- Every page layout is built: home (hero + capabilities + condensed global presence), about, capabilities overview, 4 capability detail pages, sectors, global-presence, our-process, journal, contact, private-circle, 404.
- Global nav: hamburger at every width → full-screen panel; announcement bar with dismiss; footer nav index.
- Vector assets done as Astro components: `Kanji`, `Seal`, `WorldMap`, `ProcessIcon`, `Arrow` (ASSETS.md #12, #13-square, #15, #16, #17) — all placed and in use.
- **Everything visual is on placeholders** — no real imagery exists (client supplied only screenshots). `Placeholder.astro` holds each slot and names its ASSETS.md entry; `document.querySelectorAll('[data-asset]')` lists the outstanding images. Generation list + priority: ASSETS.md. **Exception:** the hero is now drawn art (`HeroArt.astro` — SVG ink-wash mountain, mist, red silk ribbon) rather than a grey gradient. It still carries `data-asset` because it is still standing in for ASSETS.md #1.
- **Git + deploy pipeline is live:** private repo `R4HC/lannco-site` → Vercel project `lannco-site`, pushes to `main` auto-deploy. Production green at `https://lannco-site.vercel.app`, gated behind Vercel Deployment Protection (SSO) so it is not public. Build config in `vercel.json`. **Repo-local `user.email` is set to the GitHub noreply address on purpose — don't remove it, or Vercel blocks builds.** Details in the PLAN.md decision log. Still never commit/push without Ryan's ask.
- **Not built yet:** all of Phase 4's new motion (count-ups, map arc draw / dot pulses, process line draw, preloader, page transitions). `WorldMap` already carries `data-anim="arc-draw"` and `"dot-pulse"` hooks with `pathLength="1"` on the arcs, but `motion.ts` has no handlers for them, so those attributes are inert today.

### How this was verified (reproduce it, don't trust it)

Playwright driving **system Chrome** — `chromium.launch({ channel: 'chrome' })`, because the cached Playwright chromium build is version-mismatched. Two suites, written in the session scratchpad and **not committed** (worth re-creating under `tests/` if this grows):

1. 45 assertions on the menu across desktop / mobile / reduced-motion — open and close by click and by Escape, focus enters the panel and returns to the toggle, scroll lock, announcement dismiss.
2. All 13 routes: status, console errors, horizontal overflow, and **`clientWidth` vs `scrollWidth` on every `[data-anim="split-lines"]` child** — the fastest way to catch text sheared by a SplitText mask.

## Conventions (established, keep them)

- Animation opt-in via data attributes, all handled in `src/scripts/motion.ts`:
  `data-anim="split-lines"` (per-**word** masked reveal, waits for `document.fonts.ready`) · `data-anim="char-fade"` (copy fills in char by char, scrubbed to scroll) · `data-anim="mask-up"` (image wipes up) · `data-anim="rise"` · `data-anim="fade"` · `data-anim="count"` (counts up to the element's own text) · `data-anim="arc-draw"` · `data-anim="dot-pulse"` · `data-anim-stagger` (container; direct children stagger) · `data-parallax="0.12"` (speed) · `data-intro` (container whose reveals play as one load-in timeline instead of on scroll).
- Pre-reveal hidden states are CSS rules gated on `html.motion-ok`. **`motion-ok` is set by a blocking inline script in `Base.astro`'s `<head>`**, not by motion.ts — it has to land before first paint or the hidden states flash. That script also arms a 4s failsafe that swaps in `html.motion-failed` (which force-un-hides every `[data-anim]`) if motion.ts never runs, so a broken bundle degrades to a plain page rather than a blank one. Add new hidden states gated on `motion-ok` the same way.
- **Splitting text to `chars` alone breaks lines *inside* words** ("a deep under standing"): each char becomes its own inline-block, so the line breaker no longer sees words. Always split `'words,chars'` and animate the chars. Same family of bug as the `ch`-width one below — check any new split effect by measuring, not by eye.
- **Never size a display-type container in `ch`.** `ch` resolves against the *element's own* font — on `.hero-copy` (body font, 0.98rem) `max-width: 26ch` computed to 257px while the H1 rendered at 96px needing 430px, and SplitText's `overflow: clip` line masks sheared every word ("Connecting" → "Conne"). Fixed 2026-07-29 by switching to `rem`. The failure mode is nasty because the animation is working correctly — it's the mask that clips, so it reads as a broken animation. Use `rem` for anything a display heading lives inside.
- **Hero H1 line breaks are explicit `<br>`**, not natural wrapping: every board shows four lines at every width, so line count must not drift with column width. SplitText respects the breaks.
- Hero type scale is calibrated to Board A (~55px at a 1280 viewport) → `--text-hero: clamp(2.75rem, 4.3vw, 4.5rem)`. The original 7.5vw/6rem was ~75% oversized.
- Placeholder imagery goes through `Placeholder.astro` with an `asset` prop naming its ASSETS.md entry — always pass it, it is how Phase 5 finds the slots. (Two older patterns predate it and still exist: the hero's `.hero-img` gradient and the home capability cards' `data-texture`.)
- Section rhythm: `.section` (+ `.section-alt` for the darker paper band), `.section-head` two-column header via `SectionHead.astro` (display heading + red `.rule` left, intro + `.cta` right) — top-aligned, do not set `align-items: end`, it drops the heading when the right column runs tall.
- `.lead` grid = copy left / visual right; used by About, capability detail, Global Presence, Contact and Private Circle. Reach for it before inventing a new two-column shape.
- Page copy/data lives in `src/data/capabilities.ts` and `src/data/site.ts`, single-sourced so e.g. the capability sub-nav cannot drift from the cards. Copy strings are verbatim from COPY.md.
- Footer phone numbers/email are mockup placeholders — flagged in COPY.md open questions.
- **Nav/menu is built** (session 2): hamburger at every width → full-screen `.nav-panel`. Lives in `src/scripts/nav.ts`, **deliberately separate from motion.ts** because that module returns early under `prefers-reduced-motion` and the menu is navigation, not decoration. It emits `lannco:menu` so motion.ts can `lenis.stop()/start()`. Header/announce sit at `z-index: 70` above the panel's `60` so the toggle stays clickable as the close button. Announcement bar has a dismiss (sessionStorage). Footer carries a nav row — not in the boards, it's the no-JS fallback.
  - Gotcha worth keeping: do **not** put `visibility` in the panel's transition. Interpolated visibility means the panel is still `hidden` when `focus()` fires, so focus silently goes nowhere — it passed under reduced-motion and failed everywhere else. Uses `visibility 0s linear 0.5s` plus a `requestAnimationFrame` before focusing.

## Layout notes per page (transcribed from client mockups — images NOT in repo)

**Two of the three boards are now in the repo** (added session 2, 2026-07-29) — Read them before building; they beat these notes:
- `assets/mockups/board-b-desktop-9-panel.png`
- `assets/mockups/board-c-desktop-mobile-12-panel.png`

Boards, in ascending fidelity/recency:
- **Board A** — single full-size homepage render (~1280w), highest fidelity for hero spacing, type scale and colour. **NOT in the repo** — only ever a pasted screenshot in chat. Notes below are all that survives of it; ask Ryan for the file.
- **Board B** — 9 labelled desktop panels (1 Homepage … 9 Contact). *In repo.*
- **Board C** — 12 labelled panels incl. 3 mobile boards and Private Circle. **Latest iteration; when B and C disagree, C wins** (divergences called out below). *In repo.*

Copy is in COPY.md — not repeated here. These notes cover structure only.

- **Global chrome:** black announcement bar (centred text + red "Read Now →" + `×` dismiss, far right). Nav row: LANNCO wordmark (letterspaced display serif) with the red 嵐 seal block immediately right of it; centred small-caps links; far right a red bullet + "PRIVATE CIRCLE" in red, then a **3-line hamburger that is present at desktop width too** (Board A at 1280) — it is a global element, not a breakpoint fallback. Built.
- **Home:** hero on paper bg — copy left (H1 on 4 lines, red "People.", short red rule, 3-line grey sans sub, red CTA); visual right is the misty mountain with a red silk ribbon swirling across its base, the huge low-opacity 嵐 watermark bleeding off the right edge and overlapping the peak, and a small red seal stamp low-right. Region index sits at the **bottom of the hero, right-aligned under the image only** (not full page width): 4 labels over one hairline rule, with a short thicker **red segment under the active label** — a progress bar, not an underline. Then the Capabilities band on the alt paper background: display H2 + red rule left, intro mid, "View All Capabilities →" far right, then 4 portrait texture cards (stone / red silk / black ink / white marble) with title + number **set over the image**. Board C's mobile home continues into a condensed **Global Presence section** (map + location bullets + 2 stats) — see the standalone-vs-section note below.
- **About:** copy left, kanji watermark behind, bonsai-on-rock-in-water image. **Board B** adds a vertical reverse-chron timeline right (red dots, 2024→2004, year + place + line). **Board C drops the timeline** and runs two body paragraphs instead. Build the timeline version — it's more substantial and the copy exists — unless Ryan says otherwise.
- **Capabilities overview:** section head + intro + "Explore Capabilities →" right. 4 portrait cards, numbered 01–04, with **slightly staggered vertical offsets** (the marble card sits lowest). Card anatomy diverges: **B** sets title/blurb over the image (as on home); **C** puts the image on top with title + blurb + a red `→` below it. Use C's for this page and keep the over-image treatment on home — that reads as intentional and matches Board A.
- **Capability detail (template):** the 01–04 sub-nav **replaces the main nav links** in the header row (active item red + underlined). H1 + red rule + sub + "Contact Us →" left; large studio object on ivory right. Below, 3 numbered pillars in a row.
- **Global Presence / "A Global Network Built on Trust":** heading + red rule + sub + "View Our Network →" left, plus (Board C) a **red-bulleted location list** under the copy. Dotted-halftone world map right, red dots + small caps labels, thin red connection arcs between hubs (C shows the arcs clearly). Stat row across the bottom, 4 columns **separated by thin vertical rules**.
- **Sectors:** section head; ivory-backdrop studio-object tiles. **B lays out one row of 8; C uses 2 rows of 4** — build C's 2×4. Red tagline bottom right, "Impactful." in red.
- **Our Process:** heading + sub; 5 steps in a row, each a red circled line icon over number + title + blurb, connected by a hairline that should draw across on scroll. Misty stepping-stones / mountain + bonsai imagery below. Step 05 is "Build" in B, "Long-Term Relationships" in C (same blurb).
- **Journal:** heading + sub + "View All Articles →" left. **B:** 3 equal cards. **C:** one large **featured** card (image + title + date) plus a row of **4** smaller cards below. Build C's. Cards carry a small-caps category label (Insights / Perspectives / Outlook), title, date.
- **Contact:** heading + sub + CTA left; large dark image right (B: cave arch with red seal; C: red maple in a vase on dark stone). Board C adds a **4-column footer contact block** — Singapore / Dubai / Email / Location.
- **Private Circle:** "Access by Invitation" + sub + "Request Access →" left; dark doorway interior with red maple branches right; tagline bottom left.
- **Mobile (Board C, 3 boards):** single column, hamburger, hero copy above the image, a **"SCROLL" indicator at the bottom of the hero**, card grids stacked full-width (the Private Introductions card stays red), region/location lists vertical, stats in a 2-up row. Journal mobile has a distinct **"All Articles" list view** — rows of title + date + right-hand thumbnail — so the index needs a list mode, not just cards.

## Next work, in order

1. ✅ **Phase 2 — full page layouts** done 2026-07-29. Structure worth knowing: page copy/data lives in `src/data/capabilities.ts` and `src/data/site.ts` (single source, so the capability sub-nav cannot drift from the cards); shared shapes are `SectionHead.astro`, `Placeholder.astro` and the `.lead` grid CSS (copy left / visual right — About, capability detail, Global Presence, Contact, Private Circle all use it). Capability detail is one dynamic route, `capabilities/[slug].astro`.
2. ✅ **Phase 3 — content** done 2026-07-29 (session 3). Journal is a content collection: `src/content.config.ts` (zod schema) + `src/content/journal/*.md` (file name = slug), all reads through `src/data/journal.ts` so ordering, slugs and the `"June 2024"` date format cannot drift between views. 20 routes now. `/journal/` (featured + 4 cards, all linking), `/journal/all/` (Board C's list view), `/journal/<slug>/` (article template with prev/next). The announcement bar's headline and link are derived from the featured entry. Article bodies are still outstanding, so entries set `bodyPending` and the template prints "This article is being finalised." — the same treatment as the capability pillars.
3. ◐ **Phase 4 — animations: the homepage is done**, interior pages are not. Done: preloader (seal + wordmark, holds Lenis), orchestrated hero load-in via `data-intro`, per-word masked heading reveals, scroll-scrubbed char fade, `mask-up` image wipe, stat count-ups, map arc draws + dot pulses, scroll cue. **Left:** journal image parallax (the `.journal-media` wrapper is already in place for it), process line draw, page transitions (Astro view transitions), and extending the `data-intro` choreography to interior pages — today they still reveal purely on scroll.
4. **Phases 5–8:** assets in → QA → Vercel launch → handover. Per PLAN.md.

## Known defects found reading across the docs (2026-07-29, session 2)

1. ~~**The kanji is live CJK text**~~ — **fixed session 2.** All three usages (hero watermark, nav seal, favicon) now render vector outlines from `Kanji.astro`; no CJK font is shipped or depended on. See ASSETS.md #12 for how the outline was sourced.
2. **Capability 04 is named inconsistently.** COPY.md has "Opportunities" for the home/overview cards but "Alternative Assets" in the capability-detail sub-nav, and both appear across the boards. Pick one before building the detail pages, or the sub-nav won't match the card the user clicked. **Still open.**
3. **`.section-head` never stacks on mobile.** It is `grid-template-columns: 1fr auto` at every width with no breakpoint, so at 390px the display heading is squeezed into a narrow column beside the intro copy ("Insights / Beyond / Borders" on three lines). Board C's mobile boards stack the heading above the copy. Affects every page using `SectionHead.astro` — home capabilities band, capabilities overview, sectors, our-process, journal, global-presence. Fix is a `@media (max-width: 44rem) { .section-head { grid-template-columns: 1fr; } }`. Found session 3, **left unapplied on purpose** — it restyles six pages that were signed off in Phase 2, so it belongs to the Phase 6 polish pass or Ryan's call.
4. **Two journal categories were inferred, not supplied.** COPY.md lists categories for only the first three articles; "Luxury Golf Estates" (Insights) and "Tokenization of Real Assets" (Outlook) were assigned in Phase 2 and now live in the content collection frontmatter. Worth confirming with the client.
5. **Dev-server gotcha, not a code bug:** editing `package.json` invalidates Vite's dep cache, and a long-running `astro dev` then serves `504 (Outdated Optimize Dep)` for gsap/lenis. The whole client module fails and every interaction looks broken. Restart dev (and `rm -rf node_modules/.vite`) before debugging anything that smells like "the JS stopped running".

## Inputs needed from Ryan (blockers, current)

1. **Board A** (the full-size homepage render) into `assets/mockups/` — Boards B and C landed in session 2, Board A did not (the 12-panel board got pasted twice instead). It's the highest-fidelity reference for hero spacing/type scale, so it's a polish input, not a blocker.
2. Generated imagery per ASSETS.md (hero mountain first) — or Midjourney access / approval to write style prompts.
3. Client copy gaps: capability-detail pillars ×3, journal bodies, real contact details (COPY.md § open questions).
4. Font licensing call: Canela-class serif vs staying on free Cormorant.
5. **Confirm the Vercel account is on Pro.** The project sits on a personal-scope team; PLAN.md records that Hobby's terms prohibit client work. Creating/deploying cost nothing, but this must be settled before a client domain is attached.
6. **Decide capability 04's name** — "Opportunities" (current working default) vs "Alternative Assets". See known defects below.
7. When launch nears: client domain + DNS. GitHub repo and Vercel project already exist.
8. Optional: install Node 24 locally. `engines`/`.nvmrc` say 24 and Vercel builds on 24, but this machine is on 22.17.0 with no nvm/fnm, so local and CI differ.
