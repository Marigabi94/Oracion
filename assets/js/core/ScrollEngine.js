/**
 * ====================================================================
 * SCROLL ENGINE — WRAPPER INERCIAL LENIS
 * Autor: Maria Uzcategui (Marigabi94)
 * Gestiona el desplazamiento suave, inercia y emisión del progreso
 * para gobernar Theatre.js y Three.js.
 * ====================================================================
 */

(function () {
  'use strict';

  class ScrollEngine {
    constructor() {
      this.lenis = null;
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.callbacks = [];
      this.progress = 0;
      this.scroll = 0;
      this.limit = 0;
    }

    init() {
      if (typeof window.Lenis === 'undefined') {
        console.warn('[ScrollEngine] Lenis no está cargado. Se usará scroll nativo.');
        window.addEventListener('scroll', () => this.handleNativeScroll(), { passive: true });
        return;
      }

      this.lenis = new window.Lenis({
        duration: this.isReducedMotion ? 0 : 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: !this.isReducedMotion,
        smoothTouch: false,
        touchMultiplier: 1.5
      });

      this.lenis.on('scroll', (e) => {
        if (typeof window.ScrollTrigger !== 'undefined') {
          window.ScrollTrigger.update();
        }
        this.scroll = e.scroll;
        this.limit = e.limit || (document.documentElement.scrollHeight - window.innerHeight);
        this.progress = this.limit > 0 ? Math.min(1, Math.max(0, this.scroll / this.limit)) : 0;

        for (let i = 0; i < this.callbacks.length; i++) {
          this.callbacks[i]({
            scroll: this.scroll,
            limit: this.limit,
            progress: this.progress,
            velocity: e.velocity || 0
          });
        }
      });

      window.addEventListener('resize', () => {
        if (this.lenis) this.lenis.resize();
      });
      window.addEventListener('load', () => {
        if (this.lenis) this.lenis.resize();
      });
    }

    resize() {
      if (this.lenis) this.lenis.resize();
    }

    update(time) {
      if (this.lenis) {
        this.lenis.raf(time);
      }
    }

    onScroll(callback) {
      if (typeof callback === 'function') {
        this.callbacks.push(callback);
      }
    }

    scrollTo(target, options = {}) {
      if (this.lenis) {
        this.lenis.scrollTo(target, options);
      } else {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    handleNativeScroll() {
      const scroll = window.scrollY;
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      const progress = limit > 0 ? Math.min(1, Math.max(0, scroll / limit)) : 0;
      for (let i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i]({ scroll, limit, progress, velocity: 0 });
      }
    }
  }

  window.ScrollEngine = ScrollEngine;
})();
