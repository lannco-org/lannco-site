# HANDOFF — LANNCO build (written 2026-07-29)

Context for continuing the build in a fresh session. Plan/phases/decisions: [PLAN.md](PLAN.md). Copy: [COPY.md](COPY.md). Assets: [ASSETS.md](ASSETS.md). This file adds only what those don't carry.

## Current state (verified working)

- Project scaffolded, `npm run build` passes, all 7 routes serve 200, compiled bundle contains Lenis/ScrollTrigger/SplitText (verified via `npm run preview` + curl).
- **Done:** design tokens (`src/styles/global.css`), base layout + nav + footer, homepage (hero + capabilities section) with first animations, stub pages for about/capabilities/sectors/journal/contact/private-circle.
- **Everything visual is on placeholder gradients** — no real imagery exists yet (client supplied only screenshots). Generation list + priority: ASSETS.md.
- **Vercel project `lannco-site` exists and the local dir is linked** (session 2) — but nothing has been deployed and there is no git repo, so no auto-deploys. Details + open tier/git questions in PLAN.md decision log. Never commit/push/deploy without Ryan's ask.

## Conventions (established, keep them)

- Animation opt-in via data attributes, all handled in `src/scripts/motion.ts`:
  `data-anim="split-lines"` (masked line reveal, waits for `document.fonts.ready`) · `data-anim="rise"` · `data-anim="fade"` · `data-anim-stagger` (container; direct children stagger) · `data-parallax="0.12"` (speed).
- Pre-reveal hidden states are CSS rules gated on `html.motion-ok` (set by motion.ts only when `prefers-reduced-motion` allows). Add new hidden states the same way.
- Placeholder imagery pattern: `.hero-img` gradient; capability cards use `data-texture="stone|silk|ink|marble"`. Swap these for real assets in Phase 5.
- Section rhythm: `.section` (+ `.section-alt` for the darker paper band), `.section-head` two-column header (display H2 + red `.rule` left, intro + `.cta` right).
- Footer phone numbers/email are mockup placeholders — flagged in COPY.md open questions.
- Mobile nav is intentionally absent (`.nav-links` hidden < 56rem); hamburger menu is a Phase 4 task.

## Layout notes per page (transcribed from client mockups — images NOT in repo)

**Two of the three boards are now in the repo** (added session 2, 2026-07-29) — Read them before building; they beat these notes:
- `assets/mockups/board-b-desktop-9-panel.png`
- `assets/mockups/board-c-desktop-mobile-12-panel.png`

Boards, in ascending fidelity/recency:
- **Board A** — single full-size homepage render (~1280w), highest fidelity for hero spacing, type scale and colour. **NOT in the repo** — only ever a pasted screenshot in chat. Notes below are all that survives of it; ask Ryan for the file.
- **Board B** — 9 labelled desktop panels (1 Homepage … 9 Contact). *In repo.*
- **Board C** — 12 labelled panels incl. 3 mobile boards and Private Circle. **Latest iteration; when B and C disagree, C wins** (divergences called out below). *In repo.*

Copy is in COPY.md — not repeated here. These notes cover structure only.

- **Global chrome:** black announcement bar (centred text + red "Read Now →" + `×` dismiss, far right). Nav row: LANNCO wordmark (letterspaced display serif) with the red 嵐 seal block immediately right of it; centred small-caps links; far right a red bullet + "PRIVATE CIRCLE" in red, then a **3-line hamburger that is present at desktop width too** (Board A at 1280) — it isn't mobile-only, so the Phase 4 menu is a global element, not a breakpoint fallback.
- **Home** (partially built): hero on paper bg — copy left (H1 on 4 lines, red "People.", short red rule, 3-line grey sans sub, red CTA); visual right is the misty mountain with a red silk ribbon swirling across its base, the huge low-opacity 嵐 watermark bleeding off the right edge and overlapping the peak, and a small red seal stamp low-right. Region index sits at the **bottom of the hero, right-aligned under the image only** (not full page width): 4 labels over one hairline rule, with a short thicker **red segment under the active label** — a progress bar, not an underline. Then the Capabilities band on the alt paper background: display H2 + red rule left, intro mid, "View All Capabilities →" far right, then 4 portrait texture cards (stone / red silk / black ink / white marble) with title + number **set over the image**. Board C's mobile home continues into a condensed **Global Presence section** (map + location bullets + 2 stats) — see the standalone-vs-section note below.
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

1. **Phase 2 — full page layouts** (biggest chunk): replace the six `page-stub` pages with real layouts per the notes above; add Global Presence and Our Process **as standalone pages** (both boards number them as their own panels) plus a **condensed Global Presence section on home** (Board C's mobile home scrolls hero → capabilities → global presence; Our Process does not appear on home); add a 404. Reuse existing section primitives.
2. **Phase 3 — content:** Journal → Astro content collections, article template, 5 seeded articles.
3. **Phase 4 — remaining animations:** preloader (seal stamp), stat count-ups, map dot pulses + SVG arc draws (`stroke-dashoffset`), process line draw, mobile menu, page transitions (Astro view transitions).
4. **Phases 5–8:** assets in → QA → Vercel launch → handover. Per PLAN.md.

## Inputs needed from Ryan (blockers, current)

1. **Board A** (the full-size homepage render) into `assets/mockups/` — Boards B and C landed in session 2, Board A did not (the 12-panel board got pasted twice instead). It's the highest-fidelity reference for hero spacing/type scale, so it's a polish input, not a blocker.
2. Generated imagery per ASSETS.md (hero mountain first) — or Midjourney access / approval to write style prompts.
3. Client copy gaps: capability-detail pillars ×3, journal bodies, real contact details (COPY.md § open questions).
4. Font licensing call: Canela-class serif vs staying on free Cormorant.
5. When launch nears: GitHub repo + Vercel Pro account + client domain DNS.
