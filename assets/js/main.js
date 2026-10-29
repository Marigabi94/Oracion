/**
 * ====================================================================
 * ORACIÓN A JESÚS DE LA DIVINA MISERICORDIA — MAIN.JS
 * Motor Cinético Editorial y Orquestador General
 * Autor: Maria Uzcategui (Marigabi94)
 * Inicializa Lenis, Three.js y Theatre.js en un bucle RAF unificado.
 * ====================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Instanciar Bucle Maestro RAF
    const rafHub = new window.RafHub();

    // 2. Instanciar Motor Inercial Lenis
    const scrollEngine = new window.ScrollEngine();
    scrollEngine.init();
    window.scrollEngine = scrollEngine;
    window.lenis = scrollEngine.lenis;

    // 3. Instanciar Escena 3D Three.js
    const stage3D = new window.Stage3D('sacred-canvas-stage');
    stage3D.init();

    // 4. Instanciar Director Cinemático Theatre.js
    const theatreDirector = new window.TheatreDirector(stage3D, scrollEngine);
    theatreDirector.init();

    // 5. Instanciar Almacén de la Novena y Audio
    const novenaStore = new window.NovenaStore();
    const audioAmbiance = new window.AudioAmbiance();
    audioAmbiance.init();

    // 6. Conectar todo en el Bucle Maestro RAF Unificado (60 FPS)
    rafHub.add('lenis', (time) => scrollEngine.update(time), 1);
    rafHub.add('theatre', () => theatreDirector.update(), 2);
    rafHub.add('webgl', (time) => stage3D.render(time), 3);

    // 7. Interacciones del Altar de la Gracia (Cirio Pascual)
    initAltarInteractions(audioAmbiance, novenaStore);

    // 8. Interacciones de la Novena de 9 Días
    initNovenaInteractions(novenaStore);

    // 9. Navegación y Enlaces de Desplazamiento Fluido (data-scroll-to y copiar oración)
    initNavigation(scrollEngine);

    // 10. Botones Magnéticos Hápticos
    initMagneticButtons();

    // 10. Cinemática de Portal (Contracción Hero a Negro + Zoom-in Altar)
    initPortalCinematics(stage3D, theatreDirector);

    // 11. Transición de Salida del Altar y Entrada Cinemática de la Oración Sagrada
    initPrayerCinematicEntrance();

    // 12. Transición de Salida de la Oración y Entrada Cinemática de las Estaciones de la Novena
    initNovenaCinematicEntrance();

    // 13. Revelaciones de Contenido en Scroll (GSAP ScrollTrigger en secciones restantes)
    initScrollTriggers();

    // 14. Animación Cinemática de Entrada del Texto al Cargar la Página
    initHeroEntranceAnimation();

    if (typeof window.ScrollTrigger !== 'undefined') {
      window.ScrollTrigger.refresh();
    }

    if (scrollEngine && typeof scrollEngine.resize === 'function') {
      scrollEngine.resize();
      setTimeout(() => {
        scrollEngine.resize();
        if (typeof window.ScrollTrigger !== 'undefined') window.ScrollTrigger.refresh();
      }, 400);
    }

    console.log('✦ Santuario Editorial inicializado con Lenis, Three.js y Theatre.js ✦');
  });

  /**
   * Sincroniza el contenido dinámico del cuadro de interludio en la sección de la oración.
   * Si existe una súplica sellada en el estado local, la formatea y la inyecta sanitizada;
   * de lo contrario, preserva el mensaje litúrgico predeterminado de contemplación.
   *
   * @param {NovenaStore} novenaStore - Instancia del gestor de persistencia de la novena.
   */
  function updatePrayerInterlude(novenaStore) {
    const interludeElements = document.querySelectorAll('.prayer-interlude-content, #prayer-interlude-content');
    if (!interludeElements.length) return;

    const savedGrace = (novenaStore && novenaStore.state && novenaStore.state.userGraceText)
      ? novenaStore.state.userGraceText.trim()
      : '';

    interludeElements.forEach((el) => {
      if (savedGrace) {
        // Sanitización contra inyección HTML en contenido provisto por el usuario
        const safeText = savedGrace.replace(/[&<>'"]/g, tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag));

        el.innerHTML = `<span class="interlude-sacred-label">✦ Súplica encomendada:</span><span class="interlude-grace-text">«${safeText}»</span>`;
      } else {
        // Estado por defecto de recogimiento litúrgico
        el.textContent = '✦ (Momento de recogimiento: contempla la súplica que sellaste en el Altar)';
      }
    });
  }

  /**
   * Gestiona el comportamiento interactivo del Altar de la Gracia.
   * Controla la interacción con el cirio pascual, la persistencia en tiempo real
   * del borrador de súplica y la validación/sellado del ciclo devocional.
   *
   * @param {AudioAmbiance} audioAmbiance - Controlador de efectos sonoros y campana litúrgica.
   * @param {NovenaStore} novenaStore - Gestor del estado y progreso de la novena.
   */
  function initAltarInteractions(audioAmbiance, novenaStore) {
    const candle = document.getElementById('editorial-candle') || document.getElementById('altar-candle-container');
    const sealBtn = document.getElementById('editorial-seal-btn') || document.getElementById('altar-seal-button');
    const textarea = document.getElementById('editorial-textarea') || document.getElementById('altar-petition-text');
    const notice = document.getElementById('editorial-sealed-notice');

    // Verificación del ciclo activo de 9 días y restablecimiento si ha concluido
    const cycle = (novenaStore && typeof novenaStore.checkCycle === 'function')
      ? novenaStore.checkCycle()
      : { status: 'unsealed', activeDay: 1 };

    // Sincronización del texto de súplica en la sección de oración
    updatePrayerInterlude(novenaStore);

    if (candle) {
      const candleVideo = candle.querySelector('video');
      if (candleVideo) {
        candleVideo.muted = true;
        const playPromise = candleVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            document.addEventListener('click', () => candleVideo.play(), { once: true });
            document.addEventListener('touchstart', () => candleVideo.play(), { once: true });
          });
        }
      }

      candle.addEventListener('click', () => {
        candle.classList.toggle('lit-pulse');
        if (audioAmbiance) audioAmbiance.playSacredBell();
      });
      candle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          candle.classList.toggle('lit-pulse');
          if (audioAmbiance) audioAmbiance.playSacredBell();
        }
      });
    }

    // Persistencia asíncrona de borrador en almacenamiento local
    if (textarea && novenaStore) {
      textarea.addEventListener('input', () => {
        novenaStore.saveDraft(textarea.value);
      });
    }

    // Restauración de estado según el ciclo devocional persistido
    if (textarea && novenaStore && novenaStore.state) {
      if (cycle.status === 'completed_and_cleared') {
        // Ciclo completado: reinicialización del formulario para nueva novena
        textarea.value = '';
        if (notice) {
          notice.innerHTML = '✦ <strong>Novena completada en gracia:</strong> Se cumplieron los 9 días de tu conversación con Jesús. Tu súplica previa ha culminado y tu altar ha iniciado de 0 para una nueva petición.';
        }
      } else if (novenaStore.state.userGraceText && novenaStore.state.sealedDate) {
        // Novena activa en progreso
        textarea.value = novenaStore.state.userGraceText;
        if (notice) {
          notice.innerHTML = `✦ Súplica activa sellada en tu altar &middot; <strong>Día ${cycle.currentDay || novenaStore.state.activeDay} de 9</strong>.`;
        }
      } else if (novenaStore.state.draftGraceText) {
        // Recuperación de borrador no sellado
        textarea.value = novenaStore.state.draftGraceText;
        if (notice) {
          notice.textContent = '✦ Petición recuperada del navegador. Pulsa «Sellar Súplica» para iniciar tus 9 días.';
        }
      }
    }

    if (sealBtn && textarea) {
      sealBtn.addEventListener('click', () => {
        const text = textarea.value.trim();
        if (!text) {
          textarea.focus();
          textarea.style.borderColor = 'rgba(239, 68, 68, 0.7)';
          setTimeout(() => { textarea.style.borderColor = ''; }, 2000);
          return;
        }

        if (novenaStore) {
          novenaStore.sealGrace(text);
        }
        if (audioAmbiance) {
          audioAmbiance.playSacredBell();
        }

        if (candle) {
          candle.classList.add('lit-pulse');
          setTimeout(() => candle.classList.remove('lit-pulse'), 1200);
        }

        if (notice) {
          notice.innerHTML = '✦ Tu súplica ha sido sellada en el altar del santuario &middot; <strong>Día 1 de 9</strong>. Conserva tu fe inquebrantable a lo largo de los nueve días.';
        }

        // Actualización reactiva del texto sellado en la sección de oración
        updatePrayerInterlude(novenaStore);

        // Sincronización del visor hacia la estación I
        if (typeof window.updateNovenaDayView === 'function') {
          window.updateNovenaDayView(1, true);
        }
      });
    }
  }

  /**
   * Calcula el número de estación activo (1-9) correlacionado con la fecha de sellado.
   *
   * @param {NovenaStore} novenaStore - Almacén del estado y persistencia de la novena.
   * @returns {number} Número de día activo calculado entre 1 y 9.
   */
  function getCalculatedCalendarDay(novenaStore) {
    if (!novenaStore) return 1;
    if (typeof novenaStore.checkCycle === 'function') {
      const cycle = novenaStore.checkCycle();
      return cycle.activeDay || 1;
    }
    return (novenaStore.state && novenaStore.state.activeDay) || 1;
  }

  /**
   * Inicializa las interacciones de las 9 estaciones de la novena.
   * Genera dinámicamente los botones del Bento Grid y enlaza la renderización
   * animada del visor de contemplación (título, intención y reflexión).
   *
   * @param {NovenaStore} novenaStore - Instancia del almacén de estado persistente.
   */
  function initNovenaInteractions(novenaStore) {
    const container = document.getElementById('bento-stations-container');
    const badgeEl = document.getElementById('station-badge');
    const titleEl = document.getElementById('station-title');
    const intentionEl = document.getElementById('station-intention');
    const reflectionEl = document.getElementById('station-reflection');
    const viewerCard = document.querySelector('.editorial-station-viewer');

    const days = (novenaStore && typeof novenaStore.getAllDays === 'function')
      ? novenaStore.getAllDays()
      : (window.NOVENA_DAYS || []);

    if (!days.length) return;

    // Obtención del día predeterminado correlacionado con la fecha de sellado
    const initialDay = getCalculatedCalendarDay(novenaStore);

    function renderDay(dayNumber, animate = true) {
      if (novenaStore) novenaStore.setActiveDay(dayNumber);
      const data = days[dayNumber - 1] || days[0];
      if (!data) return;

      // Actualización del estado visual y accesibilidad ARIA en botones de la cuadrícula
      const allButtons = document.querySelectorAll('.bento-station-item');
      allButtons.forEach((btn) => {
        const d = parseInt(btn.getAttribute('data-day'), 10);
        if (d === dayNumber) {
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        }
      });

      // Transición animada de opacidad y desplazamiento en la tarjeta de contemplación
      if (animate && viewerCard && typeof window.gsap !== 'undefined') {
        window.gsap.fromTo(viewerCard, 
          { opacity: 0.65, y: 6 }, 
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      }

      // Verificación de coincidencia con la jornada actual del ciclo sellado
      const isCurrentSealedDay = novenaStore && novenaStore.state && novenaStore.state.sealedDate &&
        (dayNumber === getCalculatedCalendarDay(novenaStore));

      if (badgeEl) {
        badgeEl.textContent = isCurrentSealedDay
          ? `Estación ${data.numeral} · ${data.keyword} (Tu Jornada de Hoy)`
          : `Estación ${data.numeral} · ${data.keyword}`;
      }
      if (titleEl) {
        titleEl.innerHTML = (function (str) {
          if (!str) return '';
          // Formateo tipográfico de autor: inicial caligráfica y numeral romano litúrgico
          const match = str.match(/^(D[ií]a\s+)([IVXLCDM]+)(:\s*)(.*)$/i);
          if (match) {
            const diaPrefix = `<span class="title-initial">D</span>ía`;
            const romanPart = `<span class="title-roman">${match[2].toUpperCase()}</span>:`;
            const restOfTitle = match[4].split(/(\s+)/).map(word => {
              if (/^\s+$/.test(word) || !word) return word;
              return word.replace(/^([^a-zA-ZáéíóúÁÉÍÓÚñÑ]*)([a-zA-ZáéíóúÁÉÍÓÚñÑ])(.*)$/u, (m, prefix, firstChar, rest) => {
                return `${prefix}<span class="title-initial">${firstChar.toUpperCase()}</span>${rest.toLowerCase()}`;
              });
            }).join('');
            return `${diaPrefix} ${romanPart} ${restOfTitle}`;
          }
          return str.split(/(\s+)/).map(word => {
            if (/^\s+$/.test(word) || !word) return word;
            return word.replace(/^([^a-zA-ZáéíóúÁÉÍÓÚñÑ]*)([a-zA-ZáéíóúÁÉÍÓÚñÑ])(.*)$/u, (m, prefix, firstChar, rest) => {
              return `${prefix}<span class="title-initial">${firstChar.toUpperCase()}</span>${rest.toLowerCase()}`;
            });
          }).join('');
        })(data.title);
      }
      if (intentionEl) intentionEl.textContent = `«${data.intention}»`;
      if (reflectionEl) reflectionEl.textContent = data.reflection;
    }

    // Exposición de la función en ámbito global para sincronización desde el altar
    window.updateNovenaDayView = renderDay;

    // Construcción dinámica de los 9 elementos interactivos de la cuadrícula
    if (container) {
      container.replaceChildren();
      days.forEach((item) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bento-station-item';
        btn.setAttribute('data-day', item.day);
        btn.setAttribute('aria-label', `Día ${item.numeral}: ${item.keyword}`);
        if (item.day === initialDay) {
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
        }

        btn.innerHTML = `
          <span class="bento-station-num">DÍA ${item.numeral}</span>
          <span class="bento-station-keyword">${item.keyword}</span>
        `;

        btn.addEventListener('click', () => {
          renderDay(item.day, true);
        });

        container.appendChild(btn);
      });
    }

    // Renderizado del estado inicial
    renderDay(initialDay, false);
  }

  /**
   * Configura la navegación interna con scroll inercial, el copiado de la oración
   * al portapapeles y el modal de estampa devocional imprimible.
   *
   * @param {ScrollEngine} scrollEngine - Motor inercial de scroll gobernado por Lenis.
   */
  function initNavigation(scrollEngine) {
    document.querySelectorAll('[data-scroll-to]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-scroll-to');
        if (!target) return;

        if (scrollEngine && typeof scrollEngine.scrollTo === 'function') {
          scrollEngine.scrollTo(target);
        } else {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Delegación del evento de copiado del texto sagrado con retroalimentación visual
    const copyBtn = document.getElementById('copy-prayer-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const text = `Conversación con JESÚS durante 9 días\n\nMI JESÚS, en ti deposité toda mi confianza. Tú sabes de todo, Padre y Señor del universo. Eres el Rey de Reyes, tú que hiciste al paralítico andar, al muerto vivir, al leproso sanar.\n\nTú que conoces mis angustias y ves mis lágrimas, bien sabes, Divino amigo, cómo preciso alcanzar de ti la gracia:\n\nHaz, Divino JESÚS, que antes de que termine esta conversación que tendré contigo durante nueve días, pueda alcanzar esta gracia que te pido con mucha fe y esperanza.\n\nCon gratitud mandaré a imprimir mil oraciones para que otros que precisen de ti, aprendan a tener fe en tu misericordia. Dejaré las oraciones en la iglesia para divulgar.\n\nIlumina mis pasos, así como el sol ilumina cada mañana el amanecer y testifica nuestra conversación íntima.\n\nJESUCRISTO, TENGO CONFIANZA EN TI. CADA DÍA CRECE MÁS MI FE EN TI. Amén.`;
        try {
          await navigator.clipboard.writeText(text);
          const original = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span>✦ Oración Copiada</span>';
          setTimeout(() => { copyBtn.innerHTML = original; }, 2500);
        } catch (err) {
          console.warn('Error al copiar oración:', err);
        }
      });
    }

    // Controladores del diálogo litúrgico imprimible
    const openPrintBtn = document.getElementById('print-dialog-btn');
    const closePrintBtn = document.getElementById('close-dialog-btn');
    const printDialog = document.getElementById('editorial-dialog');
    if (openPrintBtn && printDialog) {
      openPrintBtn.addEventListener('click', () => {
        window.print();
      });
    }
    if (closePrintBtn && printDialog) {
      closePrintBtn.addEventListener('click', () => {
        printDialog.close();
      });
    }

    // Sincronización automática del año en curso en el footer
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /**
   * Aplica física de desplazamiento relativo basada en la posición del puntero
   * sobre los botones de interacción principal.
   * Se deshabilita en interfaces táctiles para optimizar el rendimiento.
   */
  function initMagneticButtons() {
    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) return;

    const buttons = document.querySelectorAll('.magnetic-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  /**
   * Orquesta la secuencia cinemática multi-fase controlada por scroll (GSAP ScrollTrigger).
   * Controla la contracción centrada del Hero, la transición en negro puro y
   * la aproximación volumétrica (zoom-in) hacia el Altar de la Gracia.
   *
   * @param {Stage3D} stage3D - Escena 3D WebGL con shaders de radiación.
   * @param {TheatreDirector} theatreDirector - Orquestador de la línea de tiempo Theatre.js.
   */
  function initPortalCinematics(stage3D, theatreDirector) {
    if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

    const ScrollTrigger = window.ScrollTrigger;
    const portalStage = document.getElementById('portal-cinematic-stage');
    const heroWrap = document.querySelector('.hero-editorial-wrap');
    const scrollCue = document.querySelector('.editorial-scroll-cue');
    const altarWrap = document.querySelector('.altar-editorial-wrap');
    const altarSec = document.getElementById('sec-altar');

    if (!portalStage || !heroWrap || !altarWrap) return;

    // Estado inicial en reposo (scroll = 0):
    // Hero al 100%, Altar en el fondo lejano (escala 0.12, opacidad 0)
    heroWrap.style.transform = 'scale(1)';
    heroWrap.style.opacity = '1';
    heroWrap.style.visibility = 'visible';

    altarWrap.style.transform = 'scale(0.12)';
    altarWrap.style.opacity = '0';
    altarWrap.style.visibility = 'hidden';
    if (altarSec) altarSec.classList.remove('is-interactive');

    ScrollTrigger.create({
      trigger: portalStage,
      start: 'top top',
      end: '+=1200', // Generoso recorrido para que el Altar permanezca firme, legible e interactivo
      pin: true,
      scrub: 0.35, // Respuesta ágil y suave sin latencia
      onLeaveBack: () => {
        heroWrap.style.visibility = 'visible';
        heroWrap.style.transform = 'scale(1)';
        heroWrap.style.opacity = '1';
        if (scrollCue) scrollCue.style.opacity = '1';
        if (stage3D && stage3D.uniforms) {
          stage3D.uniforms.u_contraction.value = 0.0;
          stage3D.uniforms.u_fadeOut.value = 0.0;
        }
        altarWrap.style.visibility = 'hidden';
        altarWrap.style.transform = 'scale(0.12)';
        altarWrap.style.opacity = '0';
        altarWrap.style.filter = 'none';
        if (altarSec) altarSec.classList.remove('is-interactive');
      },
      onEnterBack: () => {
        heroWrap.style.visibility = 'hidden';
        heroWrap.style.opacity = '0';
        altarWrap.style.visibility = 'visible';
        altarWrap.style.transform = 'scale(1.0)';
        altarWrap.style.opacity = '1.0';
        altarWrap.style.filter = 'none';
        if (altarSec) altarSec.classList.add('is-interactive');
      },
      onUpdate: (self) => {
        const p = self.progress; // Progreso normalizado de 0.0 a 1.0

        // Sincronizar Theatre.js si está presente
        if (theatreDirector && typeof theatreDirector.syncProgress === 'function') {
          theatreDirector.syncProgress(p);
        }

        // ============================================================
        // FASE 1: De 0.0 a 0.28 — CONTRACCIÓN DE HERO AL CENTRO
        // ============================================================
        if (p <= 0.28) {
          const closeP = p / 0.28; // 0.0 -> 1.0
          const heroScale = Math.max(0.0, 1.0 - Math.pow(closeP, 0.85));
          const heroOpacity = Math.max(0.0, 1.0 - Math.pow(closeP, 1.15));

          heroWrap.style.visibility = 'visible';
          heroWrap.style.transform = `scale(${heroScale})`;
          heroWrap.style.opacity = heroOpacity;

          if (stage3D && stage3D.uniforms) {
            stage3D.uniforms.u_contraction.value = closeP;
            stage3D.uniforms.u_fadeOut.value = closeP;
          }

          if (scrollCue) {
            scrollCue.style.opacity = Math.max(0, 1.0 - closeP * 3.0);
          }

          // Altar permanece oculto
          altarWrap.style.visibility = 'hidden';
          altarWrap.style.transform = 'scale(0.12)';
          altarWrap.style.opacity = '0';
          if (altarSec) altarSec.classList.remove('is-interactive');
        }

        // ============================================================
        // FASE 2: De 0.28 a 0.30 — MICRO-PAUSA EN NEGRO PURO
        // ============================================================
        else if (p > 0.28 && p <= 0.30) {
          heroWrap.style.visibility = 'hidden';
          heroWrap.style.transform = 'scale(0)';
          heroWrap.style.opacity = '0';

          if (stage3D && stage3D.uniforms) {
            stage3D.uniforms.u_contraction.value = 1.0;
            stage3D.uniforms.u_fadeOut.value = 1.0;
          }

          if (scrollCue) scrollCue.style.opacity = '0';

          altarWrap.style.visibility = 'hidden';
          altarWrap.style.transform = 'scale(0.12)';
          altarWrap.style.opacity = '0';
          if (altarSec) altarSec.classList.remove('is-interactive');
        }

        // ============================================================
        // FASE 3: De 0.30 a 0.50 — ENTRADA FLUIDA Y ZOOM-IN DEL ALTAR
        // ============================================================
        else if (p > 0.30 && p <= 0.50) {
          heroWrap.style.visibility = 'hidden';
          heroWrap.style.opacity = '0';

          if (stage3D && stage3D.uniforms) {
            stage3D.uniforms.u_fadeOut.value = 1.0;
          }

          const zoomP = (p - 0.30) / (0.50 - 0.30); // 0.0 -> 1.0
          const altarScale = 0.15 + Math.pow(zoomP, 0.75) * (1.0 - 0.15);
          const altarOpacity = Math.min(1.0, zoomP * 1.4);

          altarWrap.style.visibility = 'visible';
          altarWrap.style.transform = `scale(${altarScale})`;
          altarWrap.style.opacity = altarOpacity;

          if (zoomP >= 0.85) {
            if (altarSec) altarSec.classList.add('is-interactive');
          } else {
            if (altarSec) altarSec.classList.remove('is-interactive');
          }
        }

        // ============================================================
        // FASE 4: De 0.50 a 1.0 — ALTAR EN TAMAÑO COMPLETO Y TOTALMENTE ESTABLE (600px de reposo)
        // Escala 1.0 exacta, 100% interactivo para escribir y leer la súplica sin parpadeos ni pérdidas
        // ============================================================
        else {
          heroWrap.style.visibility = 'hidden';
          heroWrap.style.opacity = '0';

          altarWrap.style.visibility = 'visible';
          altarWrap.style.transform = 'scale(1.0)';
          altarWrap.style.opacity = '1.0';
          altarWrap.style.filter = 'none';
          if (altarSec) altarSec.classList.add('is-interactive');
        }
      }
    });
  }

  /**
   * Configura las animaciones cinemáticas de entrada para la sección de La Oración Sagrada.
   * Maneja la transición de salida suave del Altar de la Gracia y orquesta la revelación
   * bidireccional de la ceja litúrgica, título solemne, retablo de Cristo y cuerpo del manuscrito.
   */
  function initPrayerCinematicEntrance() {
    if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

    const ScrollTrigger = window.ScrollTrigger;
    const altarWrap = document.querySelector('.altar-editorial-wrap');
    const altarSec = document.getElementById('sec-altar');
    const prayerSec = document.getElementById('sec-prayer');

    if (!prayerSec) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Transición de Salida Suave para el Altar de Gracia
    // Solo cuando La Oración sube visiblemente por la pantalla
    if (altarWrap && !isReducedMotion) {
      ScrollTrigger.create({
        trigger: prayerSec,
        start: 'top 85%',
        end: 'top 25%',
        scrub: 0.35,
        onLeaveBack: () => {
          altarWrap.style.transform = 'scale(1.0)';
          altarWrap.style.opacity = '1.0';
          altarWrap.style.filter = 'none';
          if (altarSec) altarSec.classList.add('is-interactive');
        },
        onUpdate: (self) => {
          const p = self.progress; // 0.0 -> 1.0 a medida que entra la oración
          const exitScale = 1.0 - p * 0.06;
          const exitOpacity = Math.max(0, 1.0 - p * 1.15);
          const exitY = -p * 45;

          altarWrap.style.transform = `translate3d(0, ${exitY}px, 0) scale(${exitScale})`;
          altarWrap.style.opacity = exitOpacity;
          altarWrap.style.filter = 'none'; // Sin desenfoques que destruyan la visibilidad antes de tiempo

          if (altarSec) {
            if (p > 0.4) {
              altarSec.classList.remove('is-interactive');
            } else {
              altarSec.classList.add('is-interactive');
            }
          }
        }
      });
    }

    // 2. Animaciones individuales e interactivas bidireccionales en La Oración Sagrada
    if (isReducedMotion) return;

    const eyebrowEl = prayerSec.querySelector('.prayer-editorial-header .editorial-eyebrow');
    const eyebrowLines = prayerSec.querySelectorAll('.prayer-editorial-header .editorial-eyebrow-line');
    const eyebrowText = prayerSec.querySelector('.prayer-editorial-header .editorial-eyebrow span:not(.editorial-eyebrow-line)');
    const prayerTitle = prayerSec.querySelector('#prayer-heading');
    const prayerLead = prayerSec.querySelector('.prayer-editorial-header .editorial-lead');
    const prayerSplitGrid = prayerSec.querySelector('.editorial-split-grid');
    const retabloFrame = prayerSec.querySelector('.editorial-master-frame');
    const manuscriptHeader = prayerSec.querySelector('.editorial-manuscript-header');

    // A. Ceja Litúrgica (Líneas áureas y texto sagrado)
    if (eyebrowEl) {
      if (eyebrowLines.length) {
        window.gsap.fromTo(eyebrowLines,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: eyebrowEl,
              start: 'top 88%',
              end: 'bottom top',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
      if (eyebrowText) {
        window.gsap.fromTo(eyebrowText,
          { y: 16, opacity: 0, letterSpacing: '0.36em' },
          {
            y: 0,
            opacity: 1,
            letterSpacing: '0.24em',
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: eyebrowEl,
              start: 'top 88%',
              end: 'bottom top',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    }

    // B. Título Solemne de la Oración Consagrada
    if (prayerTitle) {
      window.gsap.fromTo(prayerTitle,
        { y: 36, opacity: 0, filter: 'blur(10px)', scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1.0,
          duration: 0.95,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: prayerTitle,
            start: 'top 88%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // C. Párrafo Lead Editorial
    if (prayerLead) {
      window.gsap.fromTo(prayerLead,
        { y: 22, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: prayerLead,
            start: 'top 88%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // D. Retablo Sagrado de Jesús (Columna Izquierda Sticky)
    if (retabloFrame && prayerSplitGrid) {
      window.gsap.fromTo(retabloFrame,
        { y: 45, opacity: 0, scale: 0.9, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          scale: 1.0,
          filter: 'blur(0px)',
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: prayerSplitGrid,
            start: 'top 85%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // E. Cabecera del Manuscrito (Etiqueta + Botón Copiar Oración)
    if (manuscriptHeader) {
      window.gsap.fromTo(manuscriptHeader,
        { y: 25, opacity: 0, filter: 'blur(4px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: manuscriptHeader,
            start: 'top 88%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // F. Elementos Individuales del Cuerpo de la Oración (Párrafos, Recuadros de Recogimiento y Proclamación)
    const prayerBlocks = prayerSec.querySelectorAll(
      '.editorial-prayer-body > p, .editorial-prayer-body .editorial-interlude-box, .editorial-proclamation-box'
    );

    prayerBlocks.forEach((block) => {
      const isProclamation = block.classList.contains('editorial-proclamation-box');
      const isInterlude = block.classList.contains('editorial-interlude-box');
      const dropCapEl = block.querySelector('.editorial-drop-cap');

      window.gsap.fromTo(block,
        {
          opacity: 0,
          y: isProclamation ? 30 : (isInterlude ? 20 : 24),
          scale: (isProclamation || isInterlude) ? 0.96 : 1.0,
          filter: 'blur(6px)'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1.0,
          filter: 'blur(0px)',
          duration: isProclamation ? 1.0 : (isInterlude ? 0.85 : 0.8),
          ease: 'power2.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 88%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse'
          }
        }
      );

      // Si tiene la letra capitular «M», animarla individualmente con resplandor
      if (dropCapEl) {
        window.gsap.fromTo(dropCapEl,
          { opacity: 0, scale: 0.65, filter: 'blur(8px)' },
          {
            opacity: 1,
            scale: 1.0,
            filter: 'blur(0px)',
            duration: 0.95,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: block,
              start: 'top 88%',
              end: 'bottom top',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    });
  }

  /**
   * Configura las animaciones de entrada bidireccionales y la interactividad de la Novena.
   * Orquesta la emergencia escalonada de los botones del Bento Grid, el retablo de Cristo
   * y la tarjeta activa de contemplación con soporte para 'prefers-reduced-motion'.
   */
  function initNovenaCinematicEntrance() {
    if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

    const novenaSec = document.getElementById('sec-novena');
    if (!novenaSec) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const eyebrowEl = novenaSec.querySelector('.editorial-eyebrow');
    const eyebrowLines = novenaSec.querySelectorAll('.editorial-eyebrow-line');
    const eyebrowText = novenaSec.querySelector('.editorial-eyebrow span:not(.editorial-eyebrow-line)');
    const novenaHeading = novenaSec.querySelector('#novena-heading');
    const novenaLead = novenaSec.querySelector('.editorial-lead');
    const novenaSplitGrid = novenaSec.querySelector('.editorial-split-grid');
    const retabloFrame = novenaSec.querySelector('.editorial-master-frame');
    const bentoContainer = novenaSec.querySelector('#bento-stations-container');
    const bentoItems = novenaSec.querySelectorAll('.bento-station-item');
    const stationViewer = novenaSec.querySelector('.editorial-station-viewer');

    // A. Ceja Editorial (Líneas áureas y texto sagrado de las Estaciones)
    if (eyebrowEl) {
      if (eyebrowLines.length) {
        window.gsap.fromTo(eyebrowLines,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: eyebrowEl,
              start: 'top 88%',
              end: 'bottom top',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
      if (eyebrowText) {
        window.gsap.fromTo(eyebrowText,
          { y: 16, opacity: 0, letterSpacing: '0.36em' },
          {
            y: 0,
            opacity: 1,
            letterSpacing: '0.24em',
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: eyebrowEl,
              start: 'top 88%',
              end: 'bottom top',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    }

    // B. Título Solemne de las Estaciones
    if (novenaHeading) {
      window.gsap.fromTo(novenaHeading,
        { y: 36, opacity: 0, filter: 'blur(10px)', scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1.0,
          duration: 0.95,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: novenaHeading,
            start: 'top 88%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // C. Párrafo Lead Editorial
    if (novenaLead) {
      window.gsap.fromTo(novenaLead,
        { y: 22, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: novenaLead,
            start: 'top 88%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // D. Retablo Sagrado de Jesús en la Columna Derecha Sticky
    if (retabloFrame && novenaSplitGrid) {
      window.gsap.fromTo(retabloFrame,
        { y: 45, opacity: 0, scale: 0.9, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          scale: 1.0,
          filter: 'blur(0px)',
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: novenaSplitGrid,
            start: 'top 85%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // E. Los 9 Botones del Bento Grid de Estaciones (Animados individualmente con onda escalonada)
    if (bentoItems.length && bentoContainer) {
      window.gsap.fromTo(bentoItems,
        { y: 24, opacity: 0, scale: 0.92, filter: 'blur(4px)' },
        {
          y: 0,
          opacity: 1,
          scale: 1.0,
          filter: 'blur(0px)',
          stagger: 0.05,
          duration: 0.65,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: bentoContainer,
            start: 'top 88%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    } else if (bentoContainer) {
      window.gsap.fromTo(bentoContainer,
        { y: 28, opacity: 0, filter: 'blur(5px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bentoContainer,
            start: 'top 88%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // F. Tarjeta Activa de Contemplación de la Estación (Contenedor + Elementos Interiores Individuales)
    if (stationViewer) {
      // Contenedor de la tarjeta
      window.gsap.fromTo(stationViewer,
        { y: 30, opacity: 0, filter: 'blur(6px)', scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1.0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stationViewer,
            start: 'top 88%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse'
          }
        }
      );

      // Elementos internos individuales: Badge, Título, Intención y Reflexión
      const viewerInnerItems = stationViewer.querySelectorAll(
        '#station-badge, #station-title, #station-intention, #station-reflection'
      );
      if (viewerInnerItems.length) {
        window.gsap.fromTo(viewerInnerItems,
          { y: 18, opacity: 0, filter: 'blur(4px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.07,
            duration: 0.75,
            ease: 'power2.out',
            delay: 0.12,
            scrollTrigger: {
              trigger: stationViewer,
              start: 'top 88%',
              end: 'bottom top',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    }
  }

  /**
   * Configura las revelaciones de contenido estándar con GSAP ScrollTrigger
   * para secciones secundarias o informativas del documento.
   */
  function initScrollTriggers() {
    if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

    const sections = document.querySelectorAll('.editorial-section:not(#sec-hero):not(#sec-altar):not(#sec-prayer):not(#sec-novena)');
    sections.forEach((sec) => {
      window.gsap.from(sec.querySelectorAll('.editorial-eyebrow, .editorial-display-h2, .editorial-lead, .editorial-manuscript-card, .editorial-novena-triptych'), {
        scrollTrigger: {
          trigger: sec,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true
        },
        y: 35,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power2.out'
      });
    });
  }

  /**
   * Ejecuta la secuencia cinemática de carga inicial (Hero Entrance).
   * Despierta la reproducción silenciada de videos devocionales e inicializa
   * la línea de tiempo de entrada con resplandor del título principal y marco de Jesús.
   */
  function initHeroEntranceAnimation() {
    // Garantizar reproducción silenciosa y sin fricciones de los videos devocionales
    const allSacredVideos = document.querySelectorAll('.hero-art-video, .editorial-master-video');
    allSacredVideos.forEach((vid) => {
      vid.muted = true;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay continuo asegurado tras interacción
          document.addEventListener('click', () => vid.play(), { once: true });
          document.addEventListener('touchstart', () => vid.play(), { once: true });
        });
      }
    });

    if (typeof window.gsap === 'undefined') return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const titleEl = document.querySelector('.editorial-display-h1');
    const heroFrame = document.getElementById('hero-art-frame');
    const scrollCue = document.querySelector('.editorial-scroll-cue');

    if (!titleEl) return;

    if (isReducedMotion) {
      if (heroFrame) heroFrame.style.opacity = '1';
      titleEl.style.opacity = '1';
      if (scrollCue) scrollCue.style.opacity = '1';
      return;
    }

    const tl = window.gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    // 1. Imagen Sagrada emerge suavemente
    if (heroFrame) {
      tl.fromTo(heroFrame,
        { opacity: 0, scale: 0.94, filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' },
        { opacity: 1, scale: 1.0, duration: 1.4, ease: 'expo.out' }
      );
    }

    // 2. Animación cinematográfica del título al abrir/cargar la página
    tl.fromTo(titleEl,
      {
        opacity: 0,
        y: 28,
        letterSpacing: '0.06em',
        filter: 'blur(8px)',
        textShadow: '0 0 35px rgba(255, 255, 255, 0.8)'
      },
      {
        opacity: 1,
        y: 0,
        letterSpacing: '0.025em',
        filter: 'blur(0px)',
        textShadow: '0 4px 25px rgba(0, 0, 0, 0.9)',
        duration: 1.5,
        ease: 'power2.out'
      },
      '-=0.9'
    );

    // 3. Indicador de scroll aparece sutilmente
    if (scrollCue) {
      tl.fromTo(scrollCue,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.6'
      );
    }
  }
})();
