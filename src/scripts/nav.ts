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

export function initNav(): void {
  initMenu();
  initAnnounce();
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
    return;
  }

  close.addEventListener('click', () => {
    bar.hidden = true;
    sessionStorage.setItem('lannco:announce-dismissed', '1');
  });
}
