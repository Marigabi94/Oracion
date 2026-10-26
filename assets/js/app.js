/**
 * app.js — orquestador de la experiencia (módulos desacoplados, SOLID).
 */
import { CanvasScene } from './modules/CanvasScene.js';
import { CursorFX } from './modules/CursorFX.js';
import { AudioFX } from './modules/AudioFX.js';
import { NovenaStore, NOVENA_DAYS } from './modules/NovenaStore.js';
import { AnimationEngine } from './modules/AnimationEngine.js';
import { SmoothScroll } from './modules/SmoothScroll.js';

const escapeHTML = (str) => str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

class PrayerExperienceApp {
  constructor() {
    this.canvasScene = new CanvasScene('celestial-canvas');
    this.cursorFX = new CursorFX();
    this.audioFX = new AudioFX();
    this.novenaStore = new NovenaStore();
    this.animationEngine = new AnimationEngine();
    this.smoothScroll = new SmoothScroll();
  }

  init() {
    this.canvasScene.init();
    this.cursorFX.init();
    this.animationEngine.init();
    this.smoothScroll.init();

    this.renderDaysChips();
    this.updateActiveDayUI();
    this.bindNavControls();
    this.bindScrollLinks();
    this.bindAltar();
    this.bindDialog();
    this.bindSharing();
    this.loadSavedGrace();
  }

  /* ---------- Controles superiores ---------- */
  bindNavControls() {
    const audioBtn = document.getElementById('toggle-audio-btn');
    audioBtn?.addEventListener('click', () => {
      const on = this.audioFX.toggleSound();
      audioBtn.setAttribute('aria-pressed', String(on));
      audioBtn.textContent = on ? 'Sonido activo' : 'Sonido';
    });

    const cursorBtn = document.getElementById('toggle-cursor-btn');
    cursorBtn?.addEventListener('click', () => {
      const on = this.cursorFX.toggle();
      cursorBtn.setAttribute('aria-pressed', String(on));
    });
  }

  bindScrollLinks() {
    document.querySelectorAll('[data-scroll-to]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.smoothScroll.scrollTo(link.dataset.scrollTo);
      });
    });
  }

  /* ---------- Altar ---------- */
  bindAltar() {
    const sealBtn = document.getElementById('seal-grace-btn');
    const input = document.getElementById('grace-textarea');
    const notice = document.getElementById('grace-sealed-notice');
    const flame = document.getElementById('altar-flame');

    const burstFrom = (el, freq) => {
      const r = el.getBoundingClientRect();
      this.canvasScene.triggerGraceBurst(r.left + r.width / 2, r.top + r.height / 2);
      this.audioFX.playSacredBell(freq);
    };

    sealBtn?.addEventListener('click', () => {
      const text = input?.value.trim();
      if (!text) { input?.focus(); return; }

      this.novenaStore.sealGrace(text);
      burstFrom(sealBtn, 528);

      if (notice) {
        notice.classList.add('visible');
        notice.innerHTML = `✧ <strong>Tu súplica ha sido sellada:</strong> «${escapeHTML(text)}» — <em>ten fe y persevera durante los 9 días.</em>`;
      }
    });

    const igniteFlame = () => burstFrom(flame, 639);
    flame?.addEventListener('click', igniteFlame);
    flame?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); igniteFlame(); }
    });
  }

  /* ---------- <dialog> nativo ---------- */
  bindDialog() {
    // Los invoker commands (commandfor/command) funcionan sin JS en navegadores modernos.
    // Este fallback solo actúa si no están soportados.
    const supportsInvokers = 'commandForElement' in HTMLButtonElement.prototype;

    document.querySelectorAll('[data-open-dialog]').forEach((btn) => {
      const dialog = document.getElementById(btn.dataset.openDialog);
      if (!dialog) return;
      if (!supportsInvokers) btn.addEventListener('click', () => dialog.showModal());
    });

    document.querySelectorAll('[data-close-dialog]').forEach((btn) => {
      const dialog = document.getElementById(btn.dataset.closeDialog);
      if (!dialog) return;
      if (!supportsInvokers) btn.addEventListener('click', () => dialog.close());
    });

    // Fallback de light-dismiss si no existe soporte para closedby
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      document.querySelectorAll('dialog[closedby="any"]').forEach((dialog) => {
        dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
      });
    }

    document.getElementById('trigger-print-btn')?.addEventListener('click', () => window.print());
  }

  /* ---------- Compartir ---------- */
  bindSharing() {
    const btn = document.getElementById('copy-prayer-btn');
    btn?.addEventListener('click', async () => {
      const text = `Conversación con JESÚS durante 9 días\n\nMI JESÚS en ti deposité toda mi confianza. Tú sabes de todo, Padre y Señor del universo. Eres el Rey de Reyes, tú que hiciste al paralítico andar, al muerto vivir, al leproso sanar.\n\nJESUCRISTO TENGO CONFIANZA EN TI. CADA DÍA CRECE MÁS MI FE EN TI.\n\n${location.href}`;
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = '✓ Oración copiada';
        setTimeout(() => { btn.textContent = original; }, 2500);
      } catch (err) {
        console.warn('No se pudo copiar', err);
      }
    });
  }

  /* ---------- Novena ---------- */
  renderDaysChips() {
    const container = document.getElementById('days-nav');
    if (!container) return;
    container.replaceChildren();

    NOVENA_DAYS.forEach((item) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'day-chip';
      chip.setAttribute('aria-label', `Día ${item.day}: ${item.title}`);
      chip.innerHTML = `<span class="day-number">Día ${item.day}</span><span class="day-label">Paso</span><span class="day-status" aria-hidden="true"></span>`;
      chip.addEventListener('click', () => {
        this.novenaStore.setActiveDay(item.day);
        this.updateActiveDayUI();
        this.audioFX.playSacredBell(432 + item.day * 15);
      });
      container.appendChild(chip);
    });
  }

  updateActiveDayUI() {
    const data = this.novenaStore.getActiveDayData();
    document.getElementById('current-day-title').textContent = data.title;
    document.getElementById('current-day-intention').textContent = `«${data.intention}»`;
    document.getElementById('current-day-reflection').textContent = data.reflection;

    document.querySelectorAll('.day-chip').forEach((chip, i) => {
      const day = i + 1;
      const active = day === this.novenaStore.state.activeDay;
      chip.classList.toggle('active', active);
      chip.classList.toggle('completed', this.novenaStore.state.completedDays.includes(day));
      chip.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  loadSavedGrace() {
    const saved = this.novenaStore.getSavedGrace();
    const input = document.getElementById('grace-textarea');
    const notice = document.getElementById('grace-sealed-notice');
    if (!saved || !input) return;
    input.value = saved;
    if (notice) {
      notice.classList.add('visible');
      notice.innerHTML = `✧ <strong>Tu súplica sellada:</strong> «${escapeHTML(saved)}»`;
    }
  }
}

new PrayerExperienceApp().init();
