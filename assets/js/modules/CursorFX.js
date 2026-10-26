/**
 * CursorFX.js
 * Módulo para el cursor magnético personalizado con halo de luz y detección de hover.
 * Cumple con accesibilidad y desactivación en dispositivos móviles o movimiento reducido.
 */

export class CursorFX {
  constructor() {
    this.dot = null;
    this.halo = null;
    this.isEnabled = true;
    this.pos = { x: -100, y: -100 };
    this.haloPos = { x: -100, y: -100 };
    this.target = { x: -100, y: -100 };
    this.isHovering = false;
    this.isTouch = window.matchMedia('(pointer: coarse)').matches;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  init() {
    if (this.isTouch || this.isReducedMotion) {
      this.isEnabled = false;
      return;
    }

    this.createCursorElements();
    this.bindEvents();
    this.render();
  }

  createCursorElements() {
    if (document.querySelector('.custom-cursor-dot')) return;

    this.dot = document.createElement('div');
    this.dot.className = 'custom-cursor-dot';
    this.dot.setAttribute('aria-hidden', 'true');

    this.halo = document.createElement('div');
    this.halo.className = 'custom-cursor-halo';
    this.halo.setAttribute('aria-hidden', 'true');

    document.body.appendChild(this.dot);
    document.body.appendChild(this.halo);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
    }, { passive: true });

    // Detectar elementos interactivos para expandir el halo magnético
    const updateInteractiveElements = () => {
      const targets = document.querySelectorAll('a, button, input, textarea, .bento-card, .day-chip, .altar-candle-flame');
      targets.forEach((el) => {
        el.addEventListener('mouseenter', () => this.setHover(true));
        el.addEventListener('mouseleave', () => this.setHover(false));
      });
    };

    updateInteractiveElements();
    
    // Observer para elementos dinámicos que se agreguen después
    const observer = new MutationObserver(() => updateInteractiveElements());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  setHover(hoverState) {
    this.isHovering = hoverState;
    if (this.halo) {
      if (hoverState) {
        this.halo.classList.add('hovering');
      } else {
        this.halo.classList.remove('hovering');
      }
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    if (this.dot && this.halo) {
      const displayVal = this.isEnabled ? 'block' : 'none';
      this.dot.style.display = displayVal;
      this.halo.style.display = displayVal;
    }
    return this.isEnabled;
  }

  render() {
    if (this.isEnabled && this.dot && this.halo) {
      // Movimiento instantáneo para el punto central
      this.pos.x = this.target.x;
      this.pos.y = this.target.y;
      this.dot.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) translate(-50%, -50%)`;

      // Interpolación suave (lerp) para el halo
      this.haloPos.x += (this.target.x - this.haloPos.x) * 0.18;
      this.haloPos.y += (this.target.y - this.haloPos.y) * 0.18;
      this.halo.style.transform = `translate3d(${this.haloPos.x}px, ${this.haloPos.y}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(() => this.render());
  }
}
