/**
 * ====================================================================
 * STAGE 3D — ESCENA THREE.JS CON SHADER VOLUMÉTRICO Y CÁMARA 3D
 * Autor: Maria Uzcategui (Marigabi94)
 * Gestiona el canvas WebGL, redimensionamiento adaptativo,
 * y coordenadas espaciales gobernadas por Theatre.js.
 * ====================================================================
 */

(function () {
  'use strict';

  class Stage3D {
    constructor(canvasId = 'sacred-canvas-stage') {
      this.canvas = document.getElementById(canvasId);
      this.renderer = null;
      this.scene = null;
      this.camera = null;
      this.material = null;
      this.uniforms = null;
      this.mesh = null;

      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.originPixel = { x: this.width * 0.5, y: this.height * 0.48 };
      this.currentX = 0;
      this.currentY = 0;
      this.targetX = 0;
      this.targetY = 0;

      this.currentScroll = 0;
      this.targetScroll = 0;
      this.time = 0;
    }

    init() {
      if (!this.canvas || typeof window.THREE === 'undefined') {
        console.warn('[Stage3D] Three.js o canvas no disponibles.');
        return;
      }

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
      this.camera.position.z = 5;

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
      });

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(dpr);

      // Material del remolino sagrado
      if (window.WhiteNebulaShader) {
        this.uniforms = window.WhiteNebulaShader.createUniforms();
        this.material = new THREE.ShaderMaterial({
          vertexShader: window.WhiteNebulaShader.vertexShader,
          fragmentShader: window.WhiteNebulaShader.fragmentShader,
          uniforms: this.uniforms,
          transparent: true,
          depthWrite: false,
          depthTest: false
        });

        const quadGeo = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(quadGeo, this.material);
        this.scene.add(this.mesh);
      }

      this.bindEvents();
      this.updateOrigin();
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

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (this.renderer) {
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(dpr);
      }

      if (this.camera) {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
      }

      if (this.uniforms) {
        this.uniforms.u_resolution.value.set(this.width * dpr, this.height * dpr);
        this.uniforms.u_aspect.value = this.width / this.height;
      }

      this.updateOrigin();
    }

    updateOrigin() {
      const frame = document.getElementById('hero-art-frame');
      if (frame) {
        const rect = frame.getBoundingClientRect();
        const ox = rect.left + rect.width * 0.5;
        const oy = rect.top + rect.height * 0.40; // Nivel del Sagrado Corazón de Jesús
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

    setScrollProgress(progress) {
      this.targetScroll = progress;
    }

    // Método para ser invocado por RafHub en cada frame
    render(time) {
      if (!this.renderer || !this.scene || !this.camera) return;

      this.updateOrigin();

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
    }
  }

  window.Stage3D = Stage3D;
})();
