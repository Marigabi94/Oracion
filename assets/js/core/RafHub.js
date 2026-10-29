/**
 * ====================================================================
 * RAF HUB — BUCLE MAESTRO REQUESTANIMATIONFRAME
 * Autor: Maria Uzcategui (Marigabi94)
 * Coordina Lenis (Scroll), Theatre.js (Timeline) y Three.js (WebGL)
 * en un único ciclo de refresco a 60/120 FPS sin jank.
 * ====================================================================
 */

(function () {
  'use strict';

  class RafHub {
    constructor() {
      this.tasks = new Map();
      this.isRunning = false;
      this.lastTime = 0;
      this.rafId = null;
    }

    /**
     * Registra una función en el bucle RAF
     * @param {string} id - Identificador único de la tarea
     * @param {Function} callback - Función a ejecutar: (time, delta) => void
     * @param {number} priority - Prioridad de ejecución (menor = primero)
     */
    add(id, callback, priority = 10) {
      this.tasks.set(id, { callback, priority });
      if (!this.isRunning) {
        this.start();
      }
    }

    remove(id) {
      this.tasks.delete(id);
      if (this.tasks.size === 0) {
        this.stop();
      }
    }

    tick(currentTime) {
      if (!this.isRunning) return;

      const delta = this.lastTime ? (currentTime - this.lastTime) / 1000 : 0.016;
      this.lastTime = currentTime;

      // Ordenar por prioridad
      const sorted = Array.from(this.tasks.values()).sort((a, b) => a.priority - b.priority);
      for (let i = 0; i < sorted.length; i++) {
        try {
          sorted[i].callback(currentTime, delta);
        } catch (err) {
          console.error(`[RafHub Error]:`, err);
        }
      }

      this.rafId = requestAnimationFrame((t) => this.tick(t));
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.lastTime = performance.now();
      this.rafId = requestAnimationFrame((t) => this.tick(t));
    }

    stop() {
      this.isRunning = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }

  window.RafHub = RafHub;
})();
