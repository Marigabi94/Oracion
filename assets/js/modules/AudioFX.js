/**
 * AudioFX.js
 * Módulo de síntesis de sonido etéreo mediante Web Audio API puro (sin dependencias de archivos externos).
 * Genera campanillas armónicas (chimes) y paisaje sonoro sutil de meditación.
 */

export class AudioFX {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientOscillators = [];
    this.ambientGain = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.ensureContext();
    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startAmbientDrone();
      this.playSacredBell(528); // 528Hz: Frecuencia de transformación y amor
    } else {
      this.stopAmbientDrone();
    }

    return !this.isMuted;
  }

  /**
   * Campana o campánula armónica litúrgica generada proceduralmente
   */
  playSacredBell(freq = 432) {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();

    const now = this.ctx.currentTime;
    
    // Armónicos de la campana
    const harmonics = [1, 2.76, 5.4, 8.93];
    const gains = [0.4, 0.2, 0.1, 0.05];

    harmonics.forEach((ratio, idx) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratio, now);

      gainNode.gain.setValueAtTime(gains[idx] * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.6);
    });
  }

  /**
   * Paisaje sonoro etéreo continuo muy sutil (Drone de meditación)
   */
  startAmbientDrone() {
    if (!this.ctx || this.ambientOscillators.length > 0) return;

    const freqs = [108, 162, 216, 324]; // Acorde sagrado armónico
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);
    this.ambientGain.connect(this.ctx.destination);

    freqs.forEach((f) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);
      osc.connect(this.ambientGain);
      osc.start();
      this.ambientOscillators.push(osc);
    });
  }

  stopAmbientDrone() {
    if (!this.ctx || !this.ambientGain) return;

    this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
    setTimeout(() => {
      this.ambientOscillators.forEach((osc) => {
        try { osc.stop(); } catch(e) {}
      });
      this.ambientOscillators = [];
      this.ambientGain = null;
    }, 1100);
  }
}
