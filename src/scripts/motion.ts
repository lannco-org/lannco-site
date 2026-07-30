/**
 * LANNCO motion layer — GSAP + ScrollTrigger + SplitText + Lenis.
 *
 * The vocabulary mirrors the reference site (tresmarescapital.com), which was
 * read in the browser rather than guessed at: Lenis smooth scroll, per-*word*
 * masked reveals on display headings (translate + clip), a scroll-scrubbed
 * character fade on body copy, a "Scroll" label in the hero, and a preloader
 * that holds scroll until the first screen is ready to play.
 *
 * Elements opt in via data attributes so markup stays declarative — never
 * animate by class name:
 *   data-anim="split-lines"  — per-word masked reveal (display headings)
 *   data-anim="char-fade"    — copy fills in char by char, scrubbed to scroll
 *   data-anim="mask-up"      — image/box wipes up into view
 *   data-anim="rise"         — fade + translate up on enter
 *   data-anim="fade"         — plain fade on enter
 *   data-anim="count"        — number counts up to its own text value
 *   data-anim="arc-draw"     — SVG path draws itself (needs pathLength="1")
 *   data-anim="dot-pulse"    — map markers breathe
 *   data-anim-stagger        — container; direct children rise, staggered
 *   data-parallax="0.12"     — scroll-linked parallax, value = speed
 *   data-intro               — container whose reveals play as one load-in
 *                              timeline instead of on scroll
 *
 * Pre-reveal hidden states are CSS, gated on `html.motion-ok`, which is set by
 * a blocking inline script in Base.astro so nothing flashes before this module
 * loads. That script also arms a failsafe that un-hides everything if this
 * module never runs; clearing it is the first thing we do.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Character opacity floor for the scrubbed copy fade — matches the reference. */
const CHAR_FLOOR = 0.08;

export function initMotion(): void {
  const html = document.documentElement;

  // The inline script in Base.astro hides pre-reveal states and arms a failsafe
  // in case this module never loads. It did load, so stand the failsafe down.
  clearTimeout((window as unknown as { __lanncoMotionFailsafe?: number }).__lanncoMotionFailsafe);

  // Reduced motion: the inline script never added motion-ok, so nothing is
  // hidden and there is nothing to reveal. Leave the page alone.
  if (!html.classList.contains('motion-ok')) return;

  // --- Lenis smooth scroll, driven by GSAP's ticker -------------------------
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // The menu panel lives in nav.ts (it must work under reduced-motion, which
  // returns above). It tells us when to stop scrolling the page behind it.
  document.addEventListener('lannco:menu', (event) => {
    const { open } = (event as CustomEvent<{ open: boolean }>).detail;
    if (open) lenis.stop();
    else lenis.start();
  });

  // --- Header: hide on scroll down, reveal on scroll up ---------------------
  const header = document.querySelector<HTMLElement>('.site-header');
  if (header) {
    ScrollTrigger.create({
      start: 'top -120',
      onUpdate: (self) => header.classList.toggle('is-hidden', self.direction === 1),
    });
  }

  // --- Hero region index: auto-cycling underline ----------------------------
  const regions = gsap.utils.toArray<HTMLElement>('.hero-regions li');
  if (regions.length) {
    let active = 0;
    regions[active].classList.add('is-active');
    gsap.timeline({ repeat: -1, repeatDelay: 3.2, delay: 3.2 }).call(() => {
      regions[active].classList.remove('is-active');
      active = (active + 1) % regions.length;
      regions[active].classList.add('is-active');
    });
  }

  // Nothing is allowed to scroll while the preloader is up, or the first screen
  // plays to an empty room.
  const preloader = document.querySelector<HTMLElement>('[data-preloader]');
  if (preloader) lenis.stop();

  /** Split a heading into masked words and hand back the word elements. */
  function splitWords(el: HTMLElement): HTMLElement[] {
    // Split to lines first so the mask wraps whole words on their own baseline;
    // masking words (not lines) is what the reference does, and it is also the
    // safer half of the `ch`-width shearing bug in docs/HANDOFF.md — each mask
    // is sized to its own word rather than to the column.
    const split = SplitText.create(el, { type: 'lines,words', mask: 'words' });
    return split.words as HTMLElement[];
  }

  /** Copy fills in character by character as it crosses the viewport. */
  function charFade(el: HTMLElement): void {
    // 'words,chars', not 'chars': splitting to characters alone makes every
    // character its own inline-block, so the line breaks land *inside* words
    // ("a deep under standing"). Wrapping the chars in word elements keeps the
    // word as the unit the line breaker sees.
    const split = SplitText.create(el, { type: 'words,chars' });
    gsap.set(el, { opacity: 1 });
    gsap.from(split.chars, {
      opacity: CHAR_FLOOR,
      ease: 'none',
      stagger: 0.4,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 40%', scrub: 0.6 },
    });
  }

  // Text splitting waits for webfonts so line breaks are final.
  document.fonts.ready.then(() => {
    // Anything inside a [data-intro] block is choreographed on load instead of
    // on scroll, so the first screen arrives as one gesture.
    const intro = document.querySelector<HTMLElement>('[data-intro]');
    const isIntro = (el: Element) => !!intro && intro.contains(el);

    // Words per heading, kept so the intro timeline animates exactly the
    // elements the split produced rather than re-querying the DOM for them.
    const headingWords = new Map<HTMLElement, HTMLElement[]>();

    // --- Masked word reveals on display headings ----------------------------
    document.querySelectorAll<HTMLElement>('[data-anim="split-lines"]').forEach((el) => {
      const words = splitWords(el);
      headingWords.set(el, words);
      gsap.set(el, { opacity: 1 });
      gsap.set(words, { yPercent: 115 });
      if (isIntro(el)) return; // the intro timeline plays these
      gsap.to(words, {
        yPercent: 0,
        duration: 1.15,
        ease: 'power4.out',
        stagger: 0.045,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    // --- Scroll-scrubbed character fade on copy -----------------------------
    document.querySelectorAll<HTMLElement>('[data-anim="char-fade"]').forEach((el) => {
      if (isIntro(el)) return; // handled by the intro timeline, un-scrubbed
      charFade(el);
    });

    // --- Image / box wipes --------------------------------------------------
    document.querySelectorAll<HTMLElement>('[data-anim="mask-up"]').forEach((el) => {
      if (isIntro(el)) return;
      gsap.to(el, {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    // --- Rise / fade reveals ------------------------------------------------
    document.querySelectorAll<HTMLElement>('[data-anim="rise"]').forEach((el) => {
      if (isIntro(el)) return;
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    document.querySelectorAll<HTMLElement>('[data-anim="fade"]').forEach((el) => {
      if (isIntro(el)) return;
      gsap.to(el, {
        opacity: 1,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
    });

    // --- Staggered child reveals (card grids, lists) ------------------------
    document.querySelectorAll<HTMLElement>('[data-anim-stagger]').forEach((group) => {
      if (isIntro(group)) return;
      const children = Array.from(group.children) as HTMLElement[];
      gsap.from(children, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      });
    });

    // --- Stat count-ups -----------------------------------------------------
    // The number is read from the element's own text so the markup stays the
    // single source: "50+" counts to 50 and keeps the "+", "∞" has no number
    // and is left alone.
    document.querySelectorAll<HTMLElement>('[data-anim="count"]').forEach((el) => {
      const raw = el.textContent?.trim() ?? '';
      const match = raw.match(/^(\D*)(\d[\d.,]*)(.*)$/);
      if (!match) return;
      const [, prefix, digits, suffix] = match;
      const target = parseFloat(digits.replace(/,/g, ''));
      const counter = { value: 0 };
      gsap.to(counter, {
        value: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
        },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    // --- World map: connection arcs draw, markers breathe -------------------
    // Arcs carry pathLength="1" (see docs/ASSETS.md #15), so dash maths is 0..1
    // regardless of the path's real length.
    const arcs = gsap.utils.toArray<SVGPathElement>('[data-anim="arc-draw"]');
    if (arcs.length) {
      gsap.set(arcs, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 1 });
      gsap.to(arcs, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: 'power2.inOut',
        stagger: 0.18,
        scrollTrigger: { trigger: arcs[0].ownerSVGElement ?? arcs[0], start: 'top 80%', once: true },
      });
    }

    const dots = gsap.utils.toArray<SVGElement>('[data-anim="dot-pulse"]');
    if (dots.length) {
      dots.forEach((dot, i) => {
        gsap.to(dot, {
          scale: 1.6,
          opacity: 0.55,
          transformOrigin: 'center',
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.22,
        });
      });
    }

    // --- Hero mist (WebGL2) -------------------------------------------------
    // Loaded lazily so the shader never enters the bundle for pages without a
    // hero, and so a WebGL failure cannot take the rest of the motion with it.
    const mistCanvas = document.querySelector<HTMLCanvasElement>('[data-mist]');
    if (mistCanvas) {
      import('./mist')
        .then(({ initMist }) => {
          if (!initMist(mistCanvas)) mistCanvas.remove(); // no WebGL2 → still image
        })
        .catch(() => mistCanvas.remove());
    }

    // --- Hero cinema --------------------------------------------------------
    // The generated film owns the moving image. Seeking an inter-frame encoded
    // MP4 on every scroll tick causes visible jumps, so scroll only adds a
    // restrained composited camera drift around the continuously playing film.
    const hero = document.querySelector<HTMLElement>('[data-hero-cinema]');
    const heroStage = hero?.querySelector<HTMLElement>('.hero-stage');
    const heroMedia = hero?.querySelector<HTMLElement>('.hero-media');
    const heroPhoto = hero?.querySelector<HTMLElement>('.hero-photo');
    const heroCopy = hero?.querySelector<HTMLElement>('.hero-copy');
    const heroVisual = hero?.querySelector<HTMLElement>('.hero-visual');
    const heroRegions = hero?.querySelector<HTMLElement>('.hero-regions');
    const heroFilm = hero?.querySelector<HTMLVideoElement>('[data-hero-film]');

    if (hero && heroStage && heroMedia && heroPhoto) {
      if (heroFilm) {
        const revealFilm = () => {
          heroFilm.classList.add('is-ready');
          heroFilm.play().catch(() => undefined);
        };
        heroFilm.addEventListener('loadeddata', revealFilm, { once: true });
        if (heroFilm.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) revealFilm();
      }

      const cinema = gsap.timeline({
        scrollTrigger: {
          trigger: heroStage,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.55,
        },
      });

      cinema
        .to(heroStage, { '--hero-progress': 1, ease: 'none', duration: 1 }, 0)
        .to(heroMedia, {
          // Keep the summit protected in a wide full-screen crop. The generated
          // film already provides the movement; this is just a quiet camera
          // settle as the visitor leaves the hero.
          scale: 1.025,
          yPercent: 1.2,
          ease: 'none',
          duration: 1,
        }, 0);

      if (heroCopy) cinema.to(heroCopy, {
          yPercent: -8,
          opacity: 0.72,
          ease: 'none',
          duration: 1,
        }, 0);

      if (heroVisual) cinema.to(heroVisual, {
          yPercent: -5,
          ease: 'none',
          duration: 1,
        }, 0);

      if (heroRegions) cinema.to(heroRegions, {
          yPercent: 8,
          ease: 'none',
          duration: 1,
        }, 0);
    }

    // --- Ambient drift ------------------------------------------------------
    // The reference site's hero is a live WebGL mist. This is the cheap analogue
    // for a still image: a very slow scale breath so the frame is never frozen.
    // Deliberately long and small — at 18s and 3% it reads as air, not as a
    // zoom, and it costs one composited transform.
    document.querySelectorAll<HTMLElement>('[data-anim="drift"]').forEach((el) => {
      gsap.to(el, {
        scale: 1.03,
        duration: 18,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    // --- Scroll-linked parallax ---------------------------------------------
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax ?? '0.15');
      gsap.to(el, {
        yPercent: speed * -100,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // --- The load-in: preloader out, then the first screen plays -------------
    const tl = gsap.timeline({
      onComplete: () => {
        lenis.start();
        ScrollTrigger.refresh();
      },
    });

    if (preloader) {
      tl.to(preloader.querySelector('[data-preloader-mark]'), {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
      })
        .to(preloader.querySelector('[data-preloader-mark]'), {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
        }, '+=0.25')
        .to(preloader, {
          yPercent: -100,
          duration: 1.1,
          ease: 'power4.inOut',
          onComplete: () => preloader.remove(),
        }, '-=0.15');
    }

    if (intro) {
      // Order is DOM order, so the choreography is readable from the markup.
      const heroMask = intro.querySelectorAll<HTMLElement>('[data-anim="mask-up"]');
      const heroHeads = intro.querySelectorAll<HTMLElement>('[data-anim="split-lines"]');
      const heroCopy = intro.querySelectorAll<HTMLElement>(
        '[data-anim="rise"], [data-anim="fade"], [data-anim="char-fade"]',
      );
      const heroGroups = intro.querySelectorAll<HTMLElement>('[data-anim-stagger]');

      if (heroMask.length) {
        tl.to(heroMask, {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: 1.6,
          ease: 'power3.inOut',
        }, preloader ? '-=0.9' : 0);
      }
      heroHeads.forEach((el, i) => {
        const words = headingWords.get(el);
        if (!words?.length) return;
        tl.to(words, {
          yPercent: 0,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.05,
        }, i === 0 ? '-=1.25' : '-=1');
      });
      if (heroCopy.length) {
        tl.to(heroCopy, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
        }, '-=0.85');
      }
      heroGroups.forEach((group) => {
        tl.from(Array.from(group.children) as HTMLElement[], {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
        }, '-=0.7');
      });
    }

    ScrollTrigger.refresh();
  });
}
