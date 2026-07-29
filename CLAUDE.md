# LANNCO site (client project)

Astro 5 + GSAP 3.13 (ScrollTrigger/SplitText) + Lenis. Static output, deploys to Vercel Pro. Node 24 (`.nvmrc` + `engines`).

- **Start here:** [docs/HANDOFF.md](docs/HANDOFF.md) — current state, conventions, per-page layout notes.
- Plan + decision log: [docs/PLAN.md](docs/PLAN.md). Copy deck: [docs/COPY.md](docs/COPY.md). Asset audit: [docs/ASSETS.md](docs/ASSETS.md).
- `npm run dev` / `npm run build` / `npm run preview`.

Hard rules:
- All animation targets use `data-anim*` attributes handled in `src/scripts/motion.ts` — never animate by class name.
- Pre-reveal hidden states live in CSS gated on `html.motion-ok` (reduced-motion/no-JS users must always see content).
- Copy comes from docs/COPY.md verbatim; don't invent client copy.
- Verify changes by building and loading the affected page, not just typecheck.
