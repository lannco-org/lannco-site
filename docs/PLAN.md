# LANNCO — Execution Plan (custom code on Vercel)

Copy: see [COPY.md](COPY.md). Assets: see [ASSETS.md](ASSETS.md). Decisions log at bottom.

## Reference-site findings (tresmarescapital.com)

Custom WordPress theme, **not** Webflow. Animation stack: **GSAP 3 + ScrollTrigger + SplitText + Lenis** (+ Three.js for hero WebGL). All of GSAP incl. SplitText is free since the Webflow acquisition. We use the identical stack.

## Stack

Astro 5 (static output) · GSAP 3.13 (ScrollTrigger, SplitText) · Lenis · Cormorant Variable + Inter Variable (fontsource, free fallbacks pending font-license decision) · deploy to **Vercel Pro** (Hobby tier prohibits client work; Cloudflare Pages is the $0 alternative).

Animation hooks are declarative data attributes (`data-anim`, `data-anim-stagger`, `data-parallax`) handled in `src/scripts/motion.ts`, with `prefers-reduced-motion` fully honored (hidden states gated on `html.motion-ok`).

## Phases

1. ✅ **Scaffold** (2026-07-29) — project builds and serves; tokens, base layout, nav/footer, homepage hero + capabilities with first animations (SplitText line-mask reveal, rise/fade/stagger reveals, parallax, auto-cycling region index, hide/reveal header); stub pages for About, Capabilities, Sectors, Journal, Contact, Private Circle.
2. ✅ **Full page builds** (2026-07-29) — 14 routes: About w/ timeline, Capabilities overview + 4 detail pages (dynamic route off `src/data/capabilities.ts`), Sectors 2×4 grid, Global Presence standalone + condensed home section, Our Process, Journal index, Contact, Private Circle, 404. All on placeholder imagery via `Placeholder.astro`, each instance naming its ASSETS.md entry (`[data-asset]` lists the 25 outstanding). Verified: every route 200, no sheared text, no horizontal overflow, no console errors.
   - **Carried forward:** 3 of the 4 capability detail pages render a "being finalised" line instead of pillars (client copy outstanding, COPY.md Q1). Journal cards don't link — articles have no routes until Phase 3, which also owns the "All Articles" list view. Capability 04 is "Opportunities" as a working default. Global Presence uses COPY.md's **v1** stat set, not v2, so the Phase 4 count-up has four numbers to animate.
3. ✅ **Content** (2026-07-29) — Journal is an Astro content collection (`src/content.config.ts` + `src/content/journal/*.md`, read through `src/data/journal.ts`). 5 articles, 6 new routes: `/journal/` index, `/journal/all/` list view, `/journal/<slug>/` article template. Bodies still outstanding (COPY.md Q2) so entries carry `bodyPending` and the template says so rather than inventing copy. CMS decision still deferred: if client wants self-serve edits, add Sanity free tier w/ visual editing; otherwise edits go through Ryan.
4. **Animation completion** — ◐ *homepage done* (2026-07-29, session 3): preloader, orchestrated hero load-in, per-word masked heading reveals, scroll-scrubbed char fade, stat count-ups, map arc draws + dot pulses, scroll cue. **Outstanding:** journal image parallax, process line draw, page transitions (Astro view transitions), and rolling the intro choreography onto the interior pages. Stretch: WebGL mist on hero.
5. **Assets in** — generated imagery per ASSETS.md replaces placeholder gradients; AVIF/WebP pipeline.
6. **QA & polish** — Lighthouse, a11y, cross-browser/real-mobile, SEO/OG, forms (Resend/Formspree).
7. **Launch** — GitHub repo → Vercel project → client domain + DNS + SSL → GA4 → live form test. *(Outward-facing: confirm with Ryan before production deploy.)*
8. **Handover** — walkthrough doc; retainer model for edits (or Sanity, per Phase 3 decision).

## Run it

```sh
npm run dev      # local dev
npm run build    # static build to dist/
npm run preview  # serve the build
```

## Decisions

- 2026-07-29 — **Platform: custom code on Vercel** (supersedes same-day Webflow decision). Rationale: Ryan prioritized ease of management; client visual editing not contractually required — if needed later, Sanity visual editing covers content-level edits. Webflow rejected: 4–8h+ of hands-on Designer time, subscription, no git. Lovable rejected: no fine animation control. **Railway rejected:** container host for backends, single-region, paid idle server — wrong category for a static site needing global edge CDN (audience: Asia/ME/Europe/Africa).
- 2026-07-29 — Hosting tier: Vercel Pro ($20/mo) for commercial use; Cloudflare Pages as $0 fallback.
- 2026-07-29 (session 2) — **Vercel project created:** `lannco-site`, scope `ryans-projects-ecaa36e6` (personal account of `r4hc-v`), project id `prj_lIyZpoyPKyRtrF7KG3XnDaQ2MqLn`. Local dir linked via `vercel link` (`.vercel/`, gitignored). **Nothing deployed yet** — no preview, no production. Still open: confirm the account is on **Pro**, since it's a personal scope and Hobby prohibits client work.
- 2026-07-29 (session 2) — **Git repo:** `R4HC/lannco-site` on GitHub, **private**, default branch `main`, initial commit `db80e97` (24 files, verified against the remote tree). GitHub account `R4HC` chosen because its token is valid and it matches the Vercel login (the other local account, `RyanMelaverde`, has an invalid token).
- 2026-07-29 (session 2) — **Vercel↔GitHub connected** (Ryan authorized the Vercel GitHub App in the browser after `vercel git connect` failed for lack of app access). Pushes to `main` now auto-deploy to production.
- 2026-07-29 (session 2) — **`vercel.json` added.** The project was created with `vercel project add`, which leaves Framework Preset "Other" and output directory `public`-or-`.`; Astro builds to `dist/`, so a deploy would have published the repo root. `vercel.json` pins `framework: astro` / `buildCommand` / `outputDirectory: dist` so the setting lives in the repo rather than only in dashboard state. Node version: see the 24.x decision below.
- 2026-07-29 (session 2) — **Node 24.x** (`engines.node` + `.nvmrc`), superseding the same-day 22.x pin. Ryan's call; it also matches the Vercel project default so there's no override warning. **Local machine is still on Node 22.17.0 with no nvm/fnm/volta installed**, so local dev and the Vercel build now differ — install Node 24 locally (`brew install node@24`) to close that gap.
- 2026-07-29 (session 2) — **Git commit email must match a GitHub account or Vercel blocks the build.** The first production deploy was *Blocked* (status UNKNOWN, 0ms build) with *"the commit email ryan.a.harris10@pm.me could not be matched to a GitHub account"* — the global git email isn't verified on `R4HC`. Fixed by setting a **repo-local** `user.email` to `153361009+R4HC@users.noreply.github.com` (GitHub always attributes its noreply address to the account) and rewriting the three existing commits' authorship. Global git identity was deliberately left alone. **Keep the repo-local config** — deleting it reintroduces the block.
- 2026-07-29 (session 2) — **First production deploy is live and green:** 12s build, `output: "static"`, `directory: /vercel/path0/dist/`, 7 pages. Aliased at `https://lannco-site.vercel.app`. **It is not publicly reachable** — Vercel Deployment Protection (Vercel Authentication) is on by default, so all 7 routes 302 to the Vercel SSO gate and only Ryan's Vercel login can view it. Convenient for WIP; to open it up, Project → Settings → Deployment Protection.
- 2026-07-29 (session 3) — **Motion vocabulary taken from the reference site by reading it, not guessing.** Drove `tresmarescapital.com` in Chrome and inspected the live DOM: Lenis (`html.lenis lenis-stopped` at load — a preloader gates scroll), headings split to **lines→words with the mask on the *words*** (each word carries `translate(0,0%)` + `clip-path: inset(0%)`), body copy split to **chars animated from ~0.05 opacity, scrubbed to scroll**, a `Scroll` label at ~0.5 opacity, 1 canvas (hero WebGL, not copied). Our `motion.ts` now mirrors all of that. GSAP is not on `window` there, so it is bundled — the stack claim in this plan is unchanged.
- 2026-07-29 (session 3) — **`motion-ok` moved to a blocking inline script in `Base.astro` `<head>`.** It was set by `motion.ts` after the module loaded, so pre-reveal hidden states could not exist without risking a flash of unstyled content; now they can, which is what the preloader and the word-mask reveals need. The same script arms a 4s failsafe that swaps `motion-ok` for `motion-failed` (a rule un-hides everything) so a module that never loads — e.g. the dev-server dep-504 gotcha — degrades to a plain visible page instead of a blank one.
- 2026-07-29 (session 3) — **Hero visual is now drawn art, not a grey gradient** (`src/components/HeroArt.astro`): SVG ink-wash mountain, mist bands, red silk ribbon. Still a **stand-in** for ASSETS.md #1 and still tagged `data-asset`, but it reads as art-directed instead of as a missing image. The real photographic hero is unchanged as a blocker.
- 2026-07-29 — Assets: client has screenshots only → full regeneration per ASSETS.md.
- 2026-07-29 — Fonts: Cormorant + Inter (free) until client decides on licensing Canela-class display serif.
