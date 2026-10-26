/**
 * AnimationEngine.js
 * Las animaciones de scroll son CSS nativo (scroll-driven animations).
 * Este módulo solo aporta un fallback con IntersectionObserver
 * para navegadores sin soporte (p. ej. Firefox).
 */
export class AnimationEngine {
  init() {
    const supportsNative = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (supportsNative || reducedMotion) return;

    document.documentElement.classList.add('sda-fallback');

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    document.querySelectorAll('.reveal, .prayer-continuous-text .line').forEach((el) => observer.observe(el));
  }
}
