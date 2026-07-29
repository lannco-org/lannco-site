/**
 * LANNCO motion layer — GSAP + ScrollTrigger + SplitText + Lenis.
 * Same vocabulary as the reference site (tresmarescapital.com).
 *
 * Elements opt in via data attributes so markup stays declarative:
 *   data-anim="split-lines"  — masked line-by-line heading reveal
 *   data-anim="rise"         — fade + translate up on enter
 *   data-anim="fade"         — plain fade on enter
 *   data-anim-stagger        — container; direct children rise with stagger
 *   data-parallax="0.15"     — scroll-linked parallax, value = speed
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initMotion(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return; // CSS hidden-states are gated on html.motion-ok

  document.documentElement.classList.add('motion-ok');

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

  // Text splitting waits for webfonts so line breaks are final.
  document.fonts.ready.then(() => {
    // --- Masked line reveals on display headings ----------------------------
    document.querySelectorAll<HTMLElement>('[data-anim="split-lines"]').forEach((el) => {
      const split = SplitText.create(el, { type: 'lines', mask: 'lines' });
      gsap.from(split.lines, {
        yPercent: 115,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    // --- Rise / fade reveals ------------------------------------------------
    document.querySelectorAll<HTMLElement>('[data-anim="rise"]').forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    document.querySelectorAll<HTMLElement>('[data-anim="fade"]').forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
    });

    // --- Staggered child reveals (card grids, lists) ------------------------
    document.querySelectorAll<HTMLElement>('[data-anim-stagger]').forEach((group) => {
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

    // --- Scroll-linked parallax ---------------------------------------------
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax ?? '0.15');
      gsap.to(el, {
        yPercent: speed * -100,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    ScrollTrigger.refresh();
  });
}
