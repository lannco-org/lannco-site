/**
 * LANNCO nav behaviour — menu panel + announcement dismiss.
 *
 * Deliberately separate from motion.ts: that module returns early for
 * `prefers-reduced-motion`, and the menu is navigation, not decoration. It has
 * to work for reduced-motion users, so it must not sit behind that guard.
 *
 * Emits `lannco:menu` (detail.open) so motion.ts can pause Lenis while the
 * panel is open without this module needing a reference to it.
 */

const MENU_EVENT = 'lannco:menu';
/** Fired when the chrome above the hero changes height. */
const CHROME_EVENT = 'lannco:chrome';

export function initNav(): void {
  initMenu();
  initAnnounce();
  initChromeHeight();
}

/**
 * Publishes the height of everything stacked above the hero as `--chrome-h`.
 *
 * The hero wants to be exactly one viewport tall, but the announcement bar and
 * the header sit above it *in flow*, so a plain `100svh` pushed its bottom
 * 105px (desktop) to 232px (mobile, where the announcement wraps to two lines)
 * below the fold and cut off the scroll cue and the region strip.
 *
 * Lives here rather than in motion.ts on purpose: motion.ts returns early under
 * reduced motion, and the hero still has to be the right height for those
 * visitors. Re-measured on resize and after the announcement is dismissed.
 */
function initChromeHeight(): void {
  const announce = document.querySelector<HTMLElement>('[data-announce]');
  const header = document.querySelector<HTMLElement>('.site-header');

  const sync = () => {
    const h = (announce && !announce.hidden ? announce.offsetHeight : 0)
      + (header ? header.offsetHeight : 0);
    document.documentElement.style.setProperty('--chrome-h', `${h}px`);
  };

  sync();
  window.addEventListener('resize', sync);
  document.addEventListener(CHROME_EVENT, sync);
}

function initMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-nav-panel]');
  if (!toggle || !panel) return;

  // JS is present, so the panel can join the tab order once opened.
  panel.removeAttribute('inert');
  panel.inert = true;

  let open = false;

  const setOpen = (next: boolean): void => {
    open = next;
    toggle.setAttribute('aria-expanded', String(next));
    toggle.setAttribute('aria-label', next ? 'Close menu' : 'Open menu');
    toggle.classList.toggle('is-open', next);
    panel.classList.toggle('is-open', next);
    panel.inert = !next;
    // Locks native scrolling; the event below handles Lenis.
    document.documentElement.classList.toggle('nav-open', next);
    document.dispatchEvent(new CustomEvent(MENU_EVENT, { detail: { open: next } }));

    if (next) {
      // Wait a frame so the class above is applied and the panel is actually
      // visible — focus() on a still-hidden element is a no-op.
      requestAnimationFrame(() => panel.querySelector<HTMLAnchorElement>('a')?.focus());
    } else {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) setOpen(false);
  });

  // Following a link should close the panel — with view transitions later on,
  // the panel would otherwise persist across the navigation.
  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });
}

function initAnnounce(): void {
  const bar = document.querySelector<HTMLElement>('[data-announce]');
  const close = document.querySelector<HTMLButtonElement>('[data-announce-close]');
  if (!bar || !close) return;

  if (sessionStorage.getItem('lannco:announce-dismissed') === '1') {
    bar.hidden = true;
    document.dispatchEvent(new CustomEvent(CHROME_EVENT));
    return;
  }

  close.addEventListener('click', () => {
    bar.hidden = true;
    sessionStorage.setItem('lannco:announce-dismissed', '1');
    // The hero is sized against the chrome above it — tell it to re-measure.
    document.dispatchEvent(new CustomEvent(CHROME_EVENT));
  });
}
