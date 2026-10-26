/**
 * SmoothScroll.js
 * Desplazamiento suave nativo (scroll-behavior + scrollIntoView).
 * Sin librerías: respeta prefers-reduced-motion automáticamente vía CSS.
 */
export class SmoothScroll {
  init() {}

  scrollTo(target) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${el.id}`);
  }
}
