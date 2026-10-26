/**
 * CanvasScene.js
 * Módulo responsable exclusivamente de la renderización del lienzo de partículas vivas,
 * polvo estelar y orbe sagrado reactivo al cursor y scroll.
 * Sigue SRP (Single Responsibility Principle) y Graceful Degradation.
 */

export class CanvasScene {
  constructor(canvasId = 'celestial-canvas') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = null;
    this.particles = [];
    this.burstParticles = [];
    this.maxParticles = 80;
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 };
    this.animationFrameId = null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isRunning = false;
  }

  init() {
    if (!this.canvas) return;

    try {
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) return;

      this.resize();
      this.initParticles();
      this.bindEvents();
      this.start();
    } catch (e) {
      console.warn('CanvasScene: Error al inicializar el lienzo, degradando de forma elegante.', e);
    }
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    if (this.ctx) {
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  initParticles() {
    this.particles = [];
    const count = this.isReducedMotion ? 25 : (this.width < 768 ? 40 : this.maxParticles);
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        speedX: (Math.random() - 0.5) * (this.isReducedMotion ? 0.05 : 0.25),
        speedY: (Math.random() - 0.5) * (this.isReducedMotion ? 0.05 : 0.25) - 0.1,
        color: Math.random() > 0.3 ? '#e5c378' : '#84b4ff',
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseVal: Math.random() * Math.PI
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initParticles();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    }, { passive: true });

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      this.initParticles();
    });

    // Pausa el renderizado cuando la pestaña no es visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });
  }

  /**
   * Genera una eclosión celestial de partículas áureas (ej. al sellar una gracia en el altar)
   */
  triggerGraceBurst(originX, originY) {
    const x = originX || this.width / 2;
    const y = originY || this.height / 2;
    const burstCount = this.isReducedMotion ? 20 : 60;

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.burstParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        radius: Math.random() * 3 + 1,
        color: Math.random() > 0.2 ? '#f7ebd0' : '#e5c378',
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  }

  render() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Movimiento suave del mouse hacia la posición objetivo
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Resplandor áureo central sutil vinculado al mouse
    if (!this.isReducedMotion) {
      const gradient = this.ctx.createRadialGradient(
        this.mouse.x, this.mouse.y, 10,
        this.mouse.x, this.mouse.y, 250
      );
      gradient.addColorStop(0, 'rgba(229, 195, 120, 0.05)');
      gradient.addColorStop(1, 'transparent');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Dibujar y actualizar partículas ambiente
    for (let p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulseVal += p.pulseSpeed;

      // Wrap around screen edges
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulseVal));
      this.ctx.save();
      this.ctx.globalAlpha = currentAlpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Sutil brillo difuso para las partículas más grandes
      if (p.radius > 1.8 && !this.isReducedMotion) {
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    // Dibujar y actualizar partículas de eclosión / burst
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const bp = this.burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.alpha -= bp.decay;
      bp.vy += 0.04; // Sutil gravedad celestial

      if (bp.alpha <= 0) {
        this.burstParticles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, bp.alpha);
      this.ctx.fillStyle = bp.color;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = bp.color;
      this.ctx.beginPath();
      this.ctx.arc(bp.x, bp.y, bp.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(() => this.render());
    }
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.render();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
