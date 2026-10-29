/**
 * ====================================================================
 * THEATRE DIRECTOR — DIRECTOR DE ESCENA THEATRE.JS
 * Autor: Maria Uzcategui (Marigabi94)
 * Orquesta la línea de tiempo cinemática, cámaras 3D, propiedades de
 * shaders y transformaciones DOM en sincronía con Lenis.
 * ====================================================================
 */

(function () {
  'use strict';

  class TheatreDirector {
    constructor(stage3D, scrollEngine) {
      this.stage3D = stage3D;
      this.scrollEngine = scrollEngine;
      this.project = null;
      this.sheet = null;
      this.sequenceLength = 3.0; // Longitud de la secuencia en segundos

      // Objetos Theatre
      this.theatreCamera = null;
      this.theatreNebula = null;
      this.theatreHeroDom = null;

      // Elementos del DOM a manipular
      this.heroWrap = null;
      this.scrollCue = null;
      this.altarHeading = null;
    }

    init() {
      this.heroWrap = document.querySelector('.hero-editorial-wrap');
      this.scrollCue = document.querySelector('.editorial-scroll-cue');
      this.altarHeading = document.getElementById('altar-heading');

      const isTheatreLoaded = typeof window.Theatre !== 'undefined' && window.Theatre.core;

      if (isTheatreLoaded) {
        this.initTheatre();
      } else {
        console.warn('[TheatreDirector] Theatre.js no encontrado. Activando cinemática paramétrica de respaldo.');
        this.initParametricFallback();
      }
    }

    initTheatre() {
      const core = window.Theatre && window.Theatre.core;
      const studio = window.Theatre && window.Theatre.studio;

      // Inicialización de Theatre Studio: si no se activa explícitamente con ?studio, se oculta la UI
      const isDevStudio = window.location.search.includes('studio');
      if (studio && typeof studio.initialize === 'function') {
        try {
          studio.initialize();
          if (!isDevStudio && studio.ui && typeof studio.ui.hide === 'function') {
            studio.ui.hide();
          }
        } catch (e) {
          console.log('[Theatre Studio Info]:', e.message);
        }
      }

      this.project = core.getProject('OracionInmersiva');
      this.sheet = this.project.sheet('Recorrido Sagrado');

      // 1. Objeto de Cámara 3D (Zoom-out z-axis)
      this.theatreCamera = this.sheet.object('Camara 3D', {
        positionZ: 5.0,
        positionY: 0.0,
        fov: 75.0
      });

      this.theatreCamera.onValuesChange((vals) => {
        if (this.stage3D && this.stage3D.camera) {
          this.stage3D.camera.position.z = vals.positionZ;
          this.stage3D.camera.position.y = vals.positionY;
          if (this.stage3D.camera.fov !== vals.fov) {
            this.stage3D.camera.fov = vals.fov;
            this.stage3D.camera.updateProjectionMatrix();
          }
        }
      });

      // 2. Objeto de Shader Volumétrico de Destellos Blancos
      this.theatreNebula = this.sheet.object('Nebulosa Blanca', {
        contraction: 0.0,
        fadeOut: 0.0,
        coreIntensity: 1.0
      });

      this.theatreNebula.onValuesChange((vals) => {
        if (this.stage3D && this.stage3D.uniforms) {
          this.stage3D.uniforms.u_contraction.value = vals.contraction;
          this.stage3D.uniforms.u_fadeOut.value = vals.fadeOut;
          this.stage3D.uniforms.u_coreIntensity.value = vals.coreIntensity;
        }
      });

      // 3. Objeto DOM de Hero (Jesús + Título que se cierra y desaparece)
      this.theatreHeroDom = this.sheet.object('Hero DOM', {
        scale: 1.0,
        opacity: 1.0,
        translateY: 0.0
      });

      // 4. Objeto DOM de Altar (Zoom-in que viene de lejos y crece hasta su tamaño)
      this.theatreAltarDom = this.sheet.object('Altar DOM', {
        scale: 0.12,
        opacity: 0.0
      });

      // Sincronización bidireccional con Theatre.js Studio en entorno de previsualización:
      const isStudioActive = Boolean(studio && isDevStudio);
      if (isStudioActive) {
        if (this.theatreHeroDom) {
          this.theatreHeroDom.onValuesChange((vals) => {
            if (this.isStudioInteracting && this.heroWrap) {
              this.heroWrap.style.transform = `translate3d(0, ${vals.translateY}px, 0) scale(${vals.scale})`;
              this.heroWrap.style.opacity = vals.opacity;
            }
          });
        }

        if (this.theatreAltarDom) {
          this.theatreAltarDom.onValuesChange((vals) => {
            const altarWrap = document.querySelector('.altar-editorial-wrap');
            if (this.isStudioInteracting && altarWrap) {
              altarWrap.style.transform = `scale(${vals.scale})`;
              altarWrap.style.opacity = vals.opacity;
            }
          });
        }
      }
    }

    /**
     * Sincroniza la secuencia de Theatre.js con el progreso cinemático de ScrollTrigger (0.0 a 1.0)
     */
    syncProgress(p) {
      if (this.sheet && this.sheet.sequence) {
        this.sheet.sequence.position = p * this.sequenceLength;
      }
      if (this.stage3D) {
        this.stage3D.setScrollProgress(p);
      }
    }

    /**
     * Cinemática paramétrica con físicas suaves en caso de que Theatre.js
     * no haya cargado o antes de que el usuario grabe keyframes en Studio.
     */
    initParametricFallback() {
      if (this.scrollEngine) {
        this.scrollEngine.onScroll((e) => {
          const heroProgress = Math.min(1.0, Math.max(0.0, e.scroll / (window.innerHeight * 0.85)));

          // Zoom-out cinemático de cámara hacia el fondo
          if (this.stage3D && this.stage3D.camera) {
            this.stage3D.camera.position.z = 5.0 + heroProgress * 12.0;
          }

          // Desvanecimiento y contracción de la nebulosa blanca hacia el Corazón
          if (this.stage3D && this.stage3D.uniforms) {
            this.stage3D.uniforms.u_contraction.value = heroProgress;
            this.stage3D.uniforms.u_fadeOut.value = Math.max(0, (heroProgress - 0.4) / 0.5);
          }

          // Escala hacia adentro y desvanecimiento de la figura de Jesús
          if (this.heroWrap) {
            const sc = Math.max(0.04, 1.0 - Math.pow(heroProgress, 0.85) * 0.96);
            const op = Math.max(0.0, 1.0 - Math.pow(heroProgress, 1.2) * 1.3);
            const ty = heroProgress * 50;
            this.heroWrap.style.transform = `translate3d(0, ${ty}px, 0) scale(${sc})`;
            this.heroWrap.style.opacity = op;
          }

          if (this.scrollCue) {
            this.scrollCue.style.opacity = Math.max(0, 1 - heroProgress * 3.0);
          }
        });
      }
    }

    update() {
      // Método disponible para sincronización frame a frame si se requiere
    }
  }

  window.TheatreDirector = TheatreDirector;
})();
