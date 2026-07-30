# LANNCO — Client Handover

## Current state

The site is complete as a polished static marketing site and builds successfully with Node 24. It includes the full page set, responsive navigation, an animated home hero, a video fallback strategy, and all approved imagery.

The project has no runtime API, CMS, database, or required environment variables. It is intentionally straightforward to maintain: content and assets live in the repository and Vercel deploys updates pushed to `main`.

## How to run it

```bash
npm install
npm run dev
```

For a release check, run `npm run build` followed by `npm run preview`. Use Node 24 (`.nvmrc`) for local work so the local environment matches Vercel.

## Where to make changes

| Change | Location |
|---|---|
| Page copy | `src/data/site.ts`, `src/data/capabilities.ts`, and `src/content/journal/*.md` |
| Article order and date formatting | `src/data/journal.ts` |
| Site pages | `src/pages/` |
| Shared navigation and footer | `src/components/Nav.astro`, `src/components/Footer.astro` |
| Styles and responsive layout | `src/styles/global.css` |
| Motion | `src/scripts/motion.ts`; navigation behavior is in `src/scripts/nav.ts` |
| Images and image registration | `src/assets/` and `src/data/art.ts` |
| Hero film | `public/assets/lannco-hero-film.mp4` |
| Brand marks | `src/components/Kanji.astro`, `src/components/Seal.astro`, `public/favicon.svg` |

## Content workflow

Journal articles are Markdown files in `src/content/journal/`. Add a new file there, include the frontmatter shape used by the existing articles, and add a matching entry to the `articleAssets` map in `src/data/art.ts` if it needs a thumbnail.

The capability cards and sector tiles are single-sourced in the data files. Do not hard-code a duplicate name or description in a page component.

The visible placeholder sentences in unfinished capability pillars and journal articles are deliberate. Replace them with client-approved copy rather than inventing text.

## Images and hero

All 21 supporting images are optimized JPEG masters in `src/assets/`; Astro automatically produces responsive AVIF/WebP output at build time. `Art.astro` looks up the correct master through `src/data/art.ts` and falls back safely if a new asset has not yet been registered.

The home hero uses separate desktop and mobile still masters plus the MP4 film. Keep all three when changing the hero. The stills are the no-JavaScript and reduced-motion fallback; the film is continuous autoplay rather than scroll-seeked, which avoids visible video glitches.

For visual reference, use `assets/mockups/board-c-desktop-mobile-12-panel.png` first. It supersedes Board B where the two differ.

## Animation guardrails

- Respect `prefers-reduced-motion`; content must remain visible with motion off.
- Add animation hooks through `data-anim*` attributes and handle them in `src/scripts/motion.ts`.
- Keep display-heading widths in `rem`, not `ch`, and retain the explicit hero line breaks. This prevents SplitText masks from clipping words.
- Build and review the affected page after animation or layout changes.

## Launch checklist

- Replace temporary phone numbers, email, addresses, capability pillars and journal body copy listed in [COPY.md](COPY.md).
- Confirm journal categories that were inferred for the final two articles.
- Review at 390px and 1440px after the intro animation has settled.
- Confirm Vercel's project settings, client domain and DNS before public launch.
- Run `npm run build` before publishing.

## Source material retained

The copy deck, delivered-asset inventory, and reference boards are all retained in this repository. Historical implementation notes are in `PLAN.md`; use this document as the current source of truth for future work.
