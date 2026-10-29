/**
 * ====================================================================
 * AUDIO AMBIANCE — EXPERIENCIA SONORA Y CAMPANA SAGRADA ACCESIBLE
 * Autor: Maria Uzcategui (Marigabi94)
 * Síntesis de armónicos con Web Audio API y respeto estricto a a11y.
 * ====================================================================
 */

(function () {
  'use strict';

  class AudioAmbiance {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.toggleBtn = document.getElementById('audio-toggle-btn');
      this.toggleText = document.getElementById('audio-status-text');
    }

    init() {
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.toggleBtn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle();
          }
        });
      }
    }

    initAudioContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playSacredBell() {
      try {
        this.initAudioContext();
        const now = this.ctx.currentTime;

        // Frecuencia armónica sagrada 432Hz
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now);
        osc.frequency.exponentialRampToValueAtTime(216, now + 3.5);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 4.0);
      } catch (e) {
        console.log('[AudioAmbiance Info]:', e.message);
      }
    }

    toggle() {
      this.initAudioContext();
      this.isPlaying = !this.isPlaying;

      if (this.isPlaying) {
        this.playSacredBell();
        if (this.toggleText) this.toggleText.textContent = 'MÚSICA SAGRADA: ON';
        if (this.toggleBtn) {
          this.toggleBtn.setAttribute('aria-pressed', 'true');
          this.toggleBtn.classList.add('active');
        }
      } else {
        if (this.toggleText) this.toggleText.textContent = 'MÚSICA SAGRADA: OFF';
        if (this.toggleBtn) {
          this.toggleBtn.setAttribute('aria-pressed', 'false');
          this.toggleBtn.classList.remove('active');
        }
      }
    }
  }

  window.AudioAmbiance = AudioAmbiance;
})();
