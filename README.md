# LANNCO website

Client-ready Astro website for LANNCO. It is a static site with an animated mountain-film homepage hero and responsive editorial imagery throughout.

## Start here

- [Client handover](docs/HANDOFF.md) — current status, editing map and launch checklist.
- [Copy deck](docs/COPY.md) — approved site copy and outstanding client inputs.
- [Asset library](docs/ASSETS.md) — delivered imagery and how it is wired.
- `assets/mockups/` — the supplied visual reference boards. Board C is the most current.

## Local development

Use Node 24 (see `.nvmrc`), then run:

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run check
npm run preview
```

There are no environment variables or external API keys required to run the site. Local `.env*` files remain ignored so any future private settings cannot be committed accidentally.

## Publishing

The project is connected to Vercel. Pushing an approved change to `main` triggers the production deployment. Review a local production build before publishing any material change.
