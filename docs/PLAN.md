# LANNCO — Execution Plan (custom code on Vercel)

Copy: see [COPY.md](COPY.md). Assets: see [ASSETS.md](ASSETS.md). Decisions log at bottom.

## Reference-site findings (tresmarescapital.com)

Custom WordPress theme, **not** Webflow. Animation stack: **GSAP 3 + ScrollTrigger + SplitText + Lenis** (+ Three.js for hero WebGL). All of GSAP incl. SplitText is free since the Webflow acquisition. We use the identical stack.

## Stack

Astro 5 (static output) · GSAP 3.13 (ScrollTrigger, SplitText) · Lenis · Cormorant Variable + Inter Variable (fontsource, free fallbacks pending font-license decision) · deploy to **Vercel Pro** (Hobby tier prohibits client work; Cloudflare Pages is the $0 alternative).

Animation hooks are declarative data attributes (`data-anim`, `data-anim-stagger`, `data-parallax`) handled in `src/scripts/motion.ts`, with `prefers-reduced-motion` fully honored (hidden states gated on `html.motion-ok`).

## Phases

1. ✅ **Scaffold** (2026-07-29) — project builds and serves; tokens, base layout, nav/footer, homepage hero + capabilities with first animations (SplitText line-mask reveal, rise/fade/stagger reveals, parallax, auto-cycling region index, hide/reveal header); stub pages for About, Capabilities, Sectors, Journal, Contact, Private Circle.
2. **Full page builds** — all mockup layouts: About (2004–2024 timeline), Capabilities overview + 4 detail pages, Sectors 8-object grid, Global Presence (animated map), Our Process (line-draw steps), Journal index, Contact, Private Circle, 404. Mobile per mobile mockups.
3. **Content** — Journal as Astro content collections (5 articles); all copy from COPY.md. CMS decision deferred: if client wants self-serve edits, add Sanity free tier w/ visual editing; otherwise edits go through Ryan.
4. **Animation completion** — preloader seal-stamp reveal, stat count-ups, map dot pulses + arc draws, journal image parallax, mobile menu, page transitions. Stretch: WebGL mist on hero.
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
- 2026-07-29 (session 2) — **Vercel↔GitHub connect is NOT done.** `vercel git connect` fails with *"Failed to connect R4HC/lannco-site to project"* — the repo pushes fine over HTTPS, so this is the Vercel GitHub App lacking access to the repo (not installed on `R4HC`, or installed with "only select repositories"). Fix needs a browser: install/grant at `https://github.com/apps/vercel/installations/new` (or Project → Settings → Git in the dashboard), then re-run `vercel git connect --yes`. **Note:** once connected, pushes to `main` auto-deploy to production — the site is still WIP with placeholder imagery and placeholder client phone numbers, so turn on Deployment Protection (Vercel Authentication) or keep production off until Phase 6 QA.
- 2026-07-29 — Assets: client has screenshots only → full regeneration per ASSETS.md.
- 2026-07-29 — Fonts: Cormorant + Inter (free) until client decides on licensing Canela-class display serif.
