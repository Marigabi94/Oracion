/**
 * ====================================================================
 * ORACIÓN A JESÚS DE LA DIVINA MISERICORDIA — APP.JS
 * Santuario Devocional Editorial y Motor Cinético Maestro
 * Autor: Maria Uzcategui (Marigabi94)
 * · Three.js WebGL Halo Sagrado & Partículas PBR Shaders Reactivas a Cursor
 * · Scrollytelling Pinned Master Portal: Vuelo Físico Real entre Bahías
 * · Físicas de Resorte (Spring Physics) en Cursor & Botones Magnéticos
 * · Smooth Scroll Inercial (Lenis) + GSAP ScrollTrigger (60 FPS)
 * · Persistencia Local de la Novena
 * ====================================================================
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * 1. ITINERARIO DE LAS 9 ESTACIONES DE LA NOVENA
   * ------------------------------------------------------------------ */
  const NOVENA_DAYS = [
    {
      day: 1,
      numeral: "I",
      keyword: "Confianza",
      title: "Día I: Entrega y Confianza Absoluta",
      intention: "Mi Jesús, en ti deposité toda mi confianza. Tú sabes de todo, Padre y Señor del universo.",
      reflection: "Comienza este recorrido abriendo tu corazón sin reservas, soltando las cargas que no puedes llevar por tus propias fuerzas. El primer paso del milagro es dejar de luchar en soledad y reposar en sus manos divinas."
    },
    {
      day: 2,
      numeral: "II",
      keyword: "Soberanía",
      title: "Día II: El Rey de Reyes y Señor de lo Imposible",
      intention: "Eres el Rey de Reyes, tú que hiciste al paralítico andar y al muerto vivir.",
      reflection: "Medita en la omnipotencia divina: para Jesús no existen imposibles ni distancias que su gracia no pueda alcanzar. Aquello que la lógica humana declara perdido, su voz lo levanta con vida nueva."
    },
    {
      day: 3,
      numeral: "III",
      keyword: "Consuelo",
      title: "Día III: El Amigo que Conoce tus Lágrimas",
      intention: "Tú que conoces mis angustias y ves mis lágrimas. Bien sabes, Divino Amigo, cuánto preciso de ti.",
      reflection: "Jesús camina a tu lado en el silencio del dolor. Cada una de tus lágrimas ha sido contada y acogida con ternura infinita. En la conversación íntima con Él, el llanto se convierte en bálsamo."
    },
    {
      day: 4,
      numeral: "IV",
      keyword: "Sanación",
      title: "Día IV: Sanación de Alma y Cuerpo",
      intention: "Tú que hiciste al leproso sanar, limpia mis dudas y renueva mi espíritu abatido.",
      reflection: "Pide la sanación interior de cualquier herida, rencor o desesperanza para que tu corazón sea tierra fértil para la gracia. La fe purifica la mirada antes de transformar la realidad."
    },
    {
      day: 5,
      numeral: "V",
      keyword: "Súplica",
      title: "Día V: La Súplica Fiel de la Gracia",
      intention: "Haz, Divino Jesús, que antes de que termine esta conversación de nueve días, alcance de ti esta gracia.",
      reflection: "Renueva tu petición con paz solemne, recordando que la verdadera fe no exige tiempos caprichosos, sino que aguarda con paciencia invencible en el designio supremo de la misericordia."
    },
    {
      day: 6,
      numeral: "VI",
      keyword: "Esperanza",
      title: "Día VI: La Esperanza Inquebrantable",
      intention: "Alcance esta gracia que te pido con mucha fe y esperanza inquebrantable.",
      reflection: "La esperanza cristiana no es un simple deseo pasivo, sino la certeza viva anclada en el corazón de Cristo. Cuando arrecia la tormenta, la confianza en su palabra es el faro inamovible."
    },
    {
      day: 7,
      numeral: "VII",
      keyword: "Gratitud",
      title: "Día VII: Promesa de Testimonio y Gratitud",
      intention: "Con gratitud mandaré a imprimir mil oraciones para que otros aprendan a tener fe en tu misericordia.",
      reflection: "Agradece de antemano el fruto de la oración. El corazón noble no busca favores egoístas, sino que se compromete a ser testigo de luz y anunciar a los afligidos que el Señor nunca falla."
    },
    {
      day: 8,
      numeral: "VIII",
      keyword: "Luz",
      title: "Día VIII: La Aurora de la Misericordia",
      intention: "Ilumina mis pasos, así como el sol ilumina cada mañana el amanecer.",
      reflection: "Deja que el resplandor de la divina misericordia disipe las sombras de la incertidumbre. Cada nuevo día es una confirmación de su pacto eterno de amor contigo."
    },
    {
      day: 9,
      numeral: "IX",
      keyword: "Plenitud",
      title: "Día IX: El Sello Solemne de la Fe",
      intention: "Jesucristo, tengo confianza en ti. Cada día crece más mi fe en ti.",
      reflection: "Culmina la novena con un acto solemne de entrega y adoración. Has dialogado con el Maestro; su gracia ya está obrando en lo visible y en lo invisible. Vive en su paz."
    }
  ];

  /* ------------------------------------------------------------------
   * 2. ALMACENAMIENTO LOCAL PERSISTENTE (NovenaStore)
   * ------------------------------------------------------------------ */
  class NovenaStore {
    constructor() {
      this.STORAGE_KEY = 'oracion_editorial_v5';
      this.state = this.loadState();
    }

    loadState() {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return {
        activeDay: 1,
        completedDays: [1],
        userGraceText: '',
        sealedDate: null
      };
    }

    saveState() {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {}
    }

    setActiveDay(day) {
      if (day >= 1 && day <= 9) {
        this.state.activeDay = day;
        if (!this.state.completedDays.includes(day)) {
          this.state.completedDays.push(day);
        }
        this.saveState();
      }
    }

    getActiveDayData() {
      return NOVENA_DAYS[this.state.activeDay - 1] || NOVENA_DAYS[0];
    }

    sealGrace(text) {
      this.state.userGraceText = text;
      this.state.sealedDate = new Date().toISOString();
      this.saveState();
    }
  }

  /* ------------------------------------------------------------------
   * 3. MOTOR CINEMÁTICO THREE.JS: RAYOS VOLUMÉTRICOS & SCROLLING CINEMATICS
   * ------------------------------------------------------------------ */
  class SacredCanvasStage {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.renderer = null;
      this.scene = null;
      this.camera = null;
      this.material = null;
      this.uniforms = null;
      this.particles = null;

      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.time = 0;
      this.targetScroll = 0;
      this.currentScroll = 0;
      this.targetX = 0;
      this.targetY = 0;
      this.currentX = 0;
      this.currentY = 0;
      this.originPixel = { x: this.width * 0.5, y: this.height * 0.45 };
      this.isRunning = false;
    }

    init() {
      if (!this.canvas) return;

      if (typeof window.THREE === 'undefined') {
        setTimeout(() => this.init(), 80);
        return;
      }

      this.initThree();
      this.bindEvents();
      this.bindScrollCinematic();
      this.start();
    }

    initThree() {
      const THREE = window.THREE;
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      try {
        this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
      } catch (e) {
        console.warn('Three.js no soportado o WebGL deshabilitado.', e);
        return;
      }

      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      this.updateOrigin();

      const dpr = Math.min(window.devicePixelRatio, 2);
      this.uniforms = {
        u_resolution: { value: new THREE.Vector2(this.width * dpr, this.height * dpr) },
        u_time: { value: 0.0 },
        u_origin: { value: new THREE.Vector2(0.5, 0.5) },
        u_aspect: { value: this.width / this.height },
        u_scroll: { value: 0.0 },
        u_mouse: { value: new THREE.Vector2(0, 0) }
      };

      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `;

      const fragmentShader = `
        precision highp float;

        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_origin;
        uniform float u_aspect;
        uniform float u_scroll;
        uniform vec2 u_mouse;

        varying vec2 vUv;

        // --- Algoritmo Simplex Noise 2D (Samsy Nebula / Gaseous Smoke Star) ---
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187,
                              0.366025403784439,
                             -0.577350269189626,
                              0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m * m;
          m = m * m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        // FBM (Fractal Brownian Motion) para niebla volumetrica y vapor etereo
        float fbm(vec2 p) {
          float f = 0.0;
          float amp = 0.5;
          mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
          for (int i = 0; i < 4; i++) {
            f += amp * snoise(p);
            p = rot * p * 2.02 + vec2(17.2, 43.1);
            amp *= 0.5;
          }
          return f;
        }

        // Curl Noise para torsion y turbulencia de humo estilo Samsy
        vec2 curlNoise(vec2 p, float t) {
          float eps = 0.015;
          float n1 = snoise(p + vec2(eps, 0.0) + t);
          float n2 = snoise(p - vec2(eps, 0.0) + t);
          float n3 = snoise(p + vec2(0.0, eps) + t);
          float n4 = snoise(p - vec2(0.0, eps) + t);
          return vec2((n3 - n4), -(n1 - n2)) / (2.0 * eps);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          vec2 delta = uv - (u_origin + u_mouse * 0.015);
          vec2 deltaAspect = vec2(delta.x * u_aspect, delta.y);
          float dist = length(deltaAspect);
          float angle = atan(deltaAspect.y, deltaAspect.x);

          float s = clamp(u_scroll, 0.0, 1.0);

          // -------------------------------------------------------------
          // CINEMATICA INMERSIVA HACIA ADENTRO:
          // En reposo (s=0), el aro de humo volumetrico abraza a Jesus.
          // Al hacer scroll, la nebulosa se contrae hacia el Sagrado Corazon
          // acelerando su rotacion angular y disolviendose suavemente
          // hacia adentro antes de dar paso al Altar de la Gracia.
          // -------------------------------------------------------------
          float ringRadius = mix(0.185, 0.015, pow(s, 0.75));
          float ringThickness = mix(0.046, 0.012, s);

          // Aceleracion del remolino sagrado al hacer scroll
          float swirl = angle + u_time * 0.32 + s * 4.2 * (0.12 / (dist + 0.04));

          // 1. CASCAJON BASE DE HUMO VOLUMETRICO (Anillo concentrico multi-capa continuo)
          float rDist = abs(dist - ringRadius);
          float shellCore = exp(-rDist * rDist / (2.0 * ringThickness * ringThickness));
          float shellSoft = exp(-rDist * rDist / (5.5 * ringThickness * ringThickness)) * 0.45;
          float shellGlow = shellCore + shellSoft;

          // 2. HEBRAS Y FILAMENTOS ELECTRICOS (Estilo Samsy Nebula)
          // Ondas que recorren la circunferencia del aro con micro-turbulencia
          vec2 ringCoord = vec2(cos(swirl), sin(swirl)) * 3.0;
          float noiseA = snoise(ringCoord + vec2(u_time * 0.35, u_time * 0.20));
          float noiseB = snoise(ringCoord * 2.2 - vec2(u_time * 0.45, -u_time * 0.30));

          float wave1 = sin(swirl * 4.0 + noiseA * 2.6);
          float wave2 = cos(swirl * 7.0 - noiseB * 2.8);
          float fil1 = pow(max(0.0, 1.0 - abs(wave1)), 4.2);
          float fil2 = pow(max(0.0, 1.0 - abs(wave2)), 3.8);
          float filaments = (fil1 * 0.75 + fil2 * 0.55) * shellCore;

          // 3. TURBULENCIA DE HUMO VOLUMETRICO (Curl Noise + FBM)
          vec2 warpedCoords = deltaAspect + curlNoise(deltaAspect * 3.8, u_time * 0.22 + s * 0.8) * 0.055;
          float warpedDist = length(warpedCoords);
          float warpedShell = exp(-pow(abs(warpedDist - ringRadius) / (ringThickness * 1.6), 2.0));
          float smokeFbm = fbm(warpedCoords * 5.8 - vec2(u_time * 0.16, u_time * 0.12));
          float smokeGas = warpedShell * (0.45 + 0.85 * smoothstep(-0.25, 0.75, smokeFbm));

          // Neblina eterea de fondo
          float ambientMist = exp(-dist * 3.0) * 0.28;

          // Polvo estelar destellante (particulas cosmicas)
          float sparks = pow(fract(sin(dot(deltaAspect, vec2(12.9898, 78.233))) * 43758.5453), 32.0) * shellGlow * 3.0;

          // 4. DESTELLOS BLANCOS PUROS Y HUMO ETEREO (Sin azul, sin violeta)
          vec3 colWhiteHot   = vec3(1.0, 1.0, 1.0);       // Blanco estelar puro brillante
          vec3 colWhiteSoft  = vec3(0.92, 0.94, 0.98);    // Blanco celestial suave
          vec3 colWhiteHaze  = vec3(0.42, 0.45, 0.52);    // Bruma eterea sutil

          // Composicion del cuerpo de humo en blanco etereo
          vec3 color = colWhiteHaze * (smokeGas + ambientMist) * 0.45;
          color += colWhiteSoft * smokeGas * 1.4;

          // Resplandor de filamentos electricos en blanco resplandeciente
          color += colWhiteHot * filaments * 3.6;

          // Destellos estelares (sparks) en blanco puro ultrabrillante
          color += colWhiteHot * sparks * 2.8;

          // Resplandor intimo en el Sagrado Corazon (destello blanco central)
          float coreDecay = mix(16.0, 36.0, s);
          float coreIntensity = mix(1.8, 3.2, smoothstep(0.0, 0.45, s));
          float coreGlow = exp(-dist * coreDecay) * coreIntensity;
          color += colWhiteHot * coreGlow;

          // 5. CONDENSACION Y DESVANECIMIENTO SUAVE HACIA EL ALTAR (Zoom-out sincrono)
          float condensation = mix(1.0, 1.6, smoothstep(0.0, 0.40, s));
          color *= condensation;

          // Se disuelve gradualmente hacia adentro entre s=0.35 y s=0.75
          float fadeOut = 1.0 - smoothstep(0.35, 0.75, s);
          color *= fadeOut;

          float alpha = clamp(length(color) * 0.95, 0.0, 1.0);
          gl_FragColor = vec4(color, alpha);
        }
      `;

      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: this.uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false
      });

      const quadGeo = new THREE.PlaneGeometry(2, 2);
      this.mesh = new THREE.Mesh(quadGeo, this.material);
      this.scene.add(this.mesh);
    }

    updateOrigin() {
      const frame = document.getElementById('hero-art-frame');
      if (frame) {
        const rect = frame.getBoundingClientRect();
        // Exactamente al centro X y a la mitad del alto de la imagen (nivel del Sagrado Corazon)
        const ox = rect.left + rect.width * 0.5;
        const oy = rect.top + rect.height * 0.48;
        this.originPixel.x = ox;
        this.originPixel.y = oy;

        if (this.uniforms) {
          const normX = ox / window.innerWidth;
          const normY = 1.0 - (oy / window.innerHeight);
          this.uniforms.u_origin.value.set(normX, normY);
          this.uniforms.u_aspect.value = window.innerWidth / window.innerHeight;
        }
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => this.resize(), { passive: true });

      window.addEventListener('mousemove', (e) => {
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        this.targetX = (e.clientX - halfW) / halfW;
        this.targetY = (e.clientY - halfH) / halfH;
      }, { passive: true });
    }

    bindScrollCinematic() {
      if (typeof window.ScrollTrigger !== 'undefined' && typeof window.gsap !== 'undefined') {
        const gsap = window.gsap;

        // Cinematica: al hacer scroll la vista se aleja, se hace mas pequena hasta desaparecer
        // y revela fluidamente la siguiente seccion (Altar de la Gracia)
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '#sec-hero',
            start: 'top top',
            end: 'bottom 20%',
            scrub: 0.6,
            onUpdate: (self) => {
              this.targetScroll = self.progress;
            }
          }
        });

        heroTimeline
          .to('.hero-editorial-wrap', {
            scale: 0.04,
            opacity: 0,
            y: 50,
            ease: 'power2.inOut',
            duration: 1
          }, 0)
          .to('.editorial-scroll-cue', {
            opacity: 0,
            duration: 0.25,
            ease: 'power1.out'
          }, 0);
      } else {
        window.addEventListener('scroll', () => {
          const hero = document.getElementById('sec-hero');
          if (hero) {
            const h = hero.offsetHeight || window.innerHeight;
            const progress = Math.min(1, Math.max(0, window.scrollY / (h * 0.75)));
            this.targetScroll = progress;

            const wrap = document.querySelector('.hero-editorial-wrap');
            if (wrap) {
              const sc = Math.max(0.05, 1 - progress * 0.95);
              wrap.style.transform = `scale(${sc})`;
              wrap.style.opacity = Math.max(0, 1 - progress * 1.25);
            }
          }
        }, { passive: true });
      }
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio, 2);
      if (this.renderer) {
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(dpr);
      }

      if (this.uniforms) {
        this.uniforms.u_resolution.value.set(this.width * dpr, this.height * dpr);
        this.uniforms.u_aspect.value = this.width / this.height;
      }

      this.updateOrigin();
    }

    render() {
      if (!this.renderer || !this.scene || !this.camera) return;

      this.updateOrigin(); // Mantiene el aro matematicamente anclado al corazon de Jesus durante el scroll

      this.time += 0.016;

      this.currentX += (this.targetX - this.currentX) * 0.06;
      this.currentY += (this.targetY - this.currentY) * 0.06;
      this.currentScroll += (this.targetScroll - this.currentScroll) * 0.10;

      if (this.uniforms) {
        this.uniforms.u_time.value = this.time;
        this.uniforms.u_scroll.value = this.currentScroll;
        this.uniforms.u_mouse.value.set(this.currentX, this.currentY);
      }

      this.renderer.render(this.scene, this.camera);

      if (this.isRunning) {
        requestAnimationFrame(() => this.render());
      }
    }

    start() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.render();
      }
    }
  }

  /* ------------------------------------------------------------------
   * 4. MOTOR DE FÍSICAS DE RESORTE: BOTONES MAGNÉTICOS HÁPTICOS
   * ------------------------------------------------------------------ */
  class MagneticCursorEngine {
    constructor() {
      this.isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    init() {
      if (this.isTouch) return;

      const buttons = document.querySelectorAll('.magnetic-btn');
      buttons.forEach((btn) => {
        let isHovered = false;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let velX = 0;
        let velY = 0;
        let animId = null;

        const updateSpring = () => {
          if (!isHovered && Math.abs(currentX) < 0.1 && Math.abs(currentY) < 0.1) {
            btn.style.transform = 'translate(0px, 0px)';
            const span = btn.querySelector('span');
            if (span) span.style.transform = 'translate(0px, 0px)';
            return;
          }

          const dx = targetX - currentX;
          const dy = targetY - currentY;
          velX = (velX + dx * 0.12) * 0.78;
          velY = (velY + dy * 0.12) * 0.78;
          currentX += velX;
          currentY += velY;

          btn.style.transform = `translate(${currentX * 0.32}px, ${currentY * 0.32}px)`;
          const span = btn.querySelector('span');
          if (span) {
            span.style.transform = `translate(${currentX * 0.18}px, ${currentY * 0.18}px)`;
          }

          animId = requestAnimationFrame(updateSpring);
        };

        btn.addEventListener('mouseenter', () => {
          isHovered = true;
          cancelAnimationFrame(animId);
          animId = requestAnimationFrame(updateSpring);
        });

        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          targetX = e.clientX - rect.left - rect.width / 2;
          targetY = e.clientY - rect.top - rect.height / 2;
        });

        btn.addEventListener('mouseleave', () => {
          isHovered = false;
          targetX = 0;
          targetY = 0;
        });
      });
    }
  }

  /* ------------------------------------------------------------------
   * 5. ORQUESTADOR MAESTRO EDITORIAL (EditorialApp)
   * ------------------------------------------------------------------ */
  class EditorialApp {
    constructor() {
      this.store = new NovenaStore();
      this.stage = new SacredCanvasStage('sacred-canvas-stage');
      this.magnetic = new MagneticCursorEngine();
      this.lenis = null;
    }

    init() {
      this.stage.init();
      this.initLenis();
      this.magnetic.init();
      this.initGeneralScrollReveals();
      this.bindNovenaStations();
      this.updateNovenaDisplay();
      this.bindAltar();
      this.bindCopyPrayer();
      this.bindDialog();
      this.bindNavLinks();
    }

    initLenis() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      if (typeof window.Lenis !== 'undefined') {
        this.lenis = new window.Lenis({
          duration: 1.25,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 1.8
        });

        const raf = (time) => {
          this.lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
          this.lenis.on('scroll', window.ScrollTrigger.update);
          window.gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
          });
          window.gsap.ticker.lagSmoothing(0);
        }
      }
    }

    initGeneralScrollReveals() {
      if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

      const gsap = window.gsap;

      // Titulares de sección posteriores (el hero h1 hace zoom out con el bloque)
      document.querySelectorAll('.editorial-display-h2').forEach((heading) => {
        gsap.fromTo(heading, 
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // Manuscrito Sagrado
      const manuscript = document.querySelector('.editorial-manuscript-card');
      if (manuscript) {
        gsap.fromTo(manuscript,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: manuscript,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }

    bindNavLinks() {
      document.querySelectorAll('[data-scroll-to]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const target = btn.getAttribute('data-scroll-to');
          if (this.lenis) {
            this.lenis.scrollTo(target);
          } else {
            document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });

      const sections = Array.from(document.querySelectorAll('.editorial-section'));
      const navLinks = Array.from(document.querySelectorAll('.footer-kinetic-link'));

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      }, { threshold: 0.35 });

      sections.forEach((sec) => observer.observe(sec));
    }

    bindNovenaStations() {
      const container = document.getElementById('bento-stations-container');
      if (!container) return;

      container.replaceChildren();
      NOVENA_DAYS.forEach((item) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bento-station-item';
        if (item.day === this.store.state.activeDay) btn.classList.add('active');

        btn.innerHTML = `
          <span class="bento-station-num">DÍA ${item.numeral}</span>
          <span class="bento-station-keyword">${item.keyword}</span>
        `;

        btn.addEventListener('click', () => {
          this.store.setActiveDay(item.day);
          this.updateNovenaDisplay();
        });

        container.appendChild(btn);
      });
    }

    updateNovenaDisplay() {
      const data = this.store.getActiveDayData();
      const badge = document.getElementById('station-badge');
      const title = document.getElementById('station-title');
      const intention = document.getElementById('station-intention');
      const reflection = document.getElementById('station-reflection');

      if (badge) badge.textContent = `Estación ${data.numeral} · ${data.keyword}`;
      if (title) title.textContent = data.title;
      if (intention) intention.textContent = `«${data.intention}»`;
      if (reflection) reflection.textContent = data.reflection;

      document.querySelectorAll('.bento-station-item').forEach((item, i) => {
        item.classList.toggle('active', (i + 1) === this.store.state.activeDay);
      });
    }

    bindAltar() {
      const sealBtn = document.getElementById('editorial-seal-btn');
      const textarea = document.getElementById('editorial-textarea');
      const notice = document.getElementById('editorial-sealed-notice');
      const candle = document.getElementById('editorial-candle');

      candle?.addEventListener('click', () => {
        candle.classList.add('lit-pulse');
        setTimeout(() => candle.classList.remove('lit-pulse'), 800);
        if (notice && !notice.textContent) {
          notice.textContent = `✦ Has avivado la llama del cirio en el altar.`;
          setTimeout(() => {
            if (notice.textContent === `✦ Has avivado la llama del cirio en el altar.`) notice.textContent = '';
          }, 3500);
        }
      });
      candle?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          candle.click();
        }
      });

      sealBtn?.addEventListener('click', () => {
        const val = textarea?.value.trim();
        if (!val) {
          textarea?.focus();
          return;
        }

        this.store.sealGrace(val);

        if (notice) {
          notice.textContent = `✦ Tu súplica ha sido sellada en el altar del santuario. Conserva tu fe inquebrantable a lo largo de los nueve días.`;
        }
      });

      if (this.store.state.userGraceText && textarea) {
        textarea.value = this.store.state.userGraceText;
        if (notice) {
          notice.textContent = `✦ Súplica activa en tu novena.`;
        }
      }
    }

    bindCopyPrayer() {
      const btn = document.getElementById('copy-prayer-btn');
      btn?.addEventListener('click', async () => {
        const text = `Conversación con JESÚS durante 9 días\n\nMI JESÚS en ti deposité toda mi confianza. Tú sabes de todo, Padre y Señor del universo. Eres el Rey de Reyes, tú que hiciste al paralítico andar, al muerto vivir, al leproso sanar.\n\nTú que conoces mis angustias y ves mis lágrimas, bien sabes, Divino amigo, cómo preciso alcanzar de ti la gracia.\n\nHaz, Divino JESÚS, que antes de que termine esta conversación que tendré contigo durante nueve días, pueda alcanzar esta gracia que te pido con mucha fe y esperanza.\n\nCon gratitud mandaré a imprimir mil oraciones para que otros que precisen de ti, aprendan a tener fe en tu misericordia. Dejaré las oraciones en la iglesia para divulgar.\n\nIlumina mis pasos, así como el sol ilumina cada mañana el amanecer y testifica nuestra conversación íntima.\n\nJESUCRISTO, TENGO CONFIANZA EN TI. CADA DÍA CRECE MÁS MI FE EN TI. Amén.`;
        try {
          await navigator.clipboard.writeText(text);
          const orig = btn.innerHTML;
          btn.innerHTML = '<span>Oración Copiada ✦</span>';
          setTimeout(() => { btn.innerHTML = orig; }, 2400);
        } catch (e) {}
      });
    }

    bindDialog() {
      const openBtn = document.getElementById('open-dialog-btn');
      const closeBtn = document.getElementById('close-dialog-btn');
      const dialog = document.getElementById('editorial-dialog');
      const printBtn = document.getElementById('print-dialog-btn');

      openBtn?.addEventListener('click', () => dialog?.showModal());
      closeBtn?.addEventListener('click', () => dialog?.close());
      printBtn?.addEventListener('click', () => window.print());
    }
  }

  // Inicialización
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new EditorialApp().init());
  } else {
    new EditorialApp().init();
  }

})();
