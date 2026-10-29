/**
 * ====================================================================
 * WHITE NEBULA SHADER — LÍNEAS Y PUNTOS RADIANTES SAGRADOS (SIN NUBOSIDAD)
 * Autor: Maria Uzcategui (Marigabi94)
 * Rayos estelares finos, filamentos concéntricos y micro-puntos en
 * blanco puro, perfectamente centrados detrás de la imagen de Cristo.
 * ====================================================================
 */

(function () {
  'use strict';

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;

    uniform float u_time;
    uniform float u_scroll;
    uniform vec2 u_resolution;
    uniform vec2 u_origin;
    uniform vec2 u_mouse;
    uniform float u_aspect;

    // Control cinemático
    uniform float u_contraction;
    uniform float u_fadeOut;
    uniform float u_coreIntensity;

    varying vec2 vUv;

    void main() {
      // Coordenadas normalizadas [0, 1] directas de la pantalla
      vec2 uv = vUv;

      // Centrado exacto detrás del corazón/pecho de Cristo
      vec2 delta = uv - u_origin;
      vec2 deltaAspect = vec2(delta.x * u_aspect, delta.y);
      float dist = length(deltaAspect);
      float angle = atan(deltaAspect.y, deltaAspect.x);

      // Progreso de contracción hacia adentro
      float s = clamp(max(u_scroll, u_contraction), 0.0, 1.0);

      // Desvanecimiento a pantalla negra total cuando s avanza
      float masterFade = 1.0 - smoothstep(0.20, 0.48, s);
      masterFade *= (1.0 - u_fadeOut);

      if (masterFade <= 0.001) {
        gl_FragColor = vec4(0.0);
        return;
      }

      // El radio del resplandor se contrae hacia adentro al centro
      float shrink = max(0.015, 1.0 - pow(s, 0.8) * 0.96);

      // -------------------------------------------------------------
      // 1. ROTACIÓN CONTINUA Y SUTIL DE LOS RAYOS ALREDEDOR DE LA IMAGEN
      // -------------------------------------------------------------
      // Velocidad suave, majestuosa y contemplativa (~45 segundos por vuelta completa)
      float rotSpeed = 0.14;
      float rotAngle = angle - u_time * rotSpeed;

      // Haces de rayos limpios y sutiles que giran alrededor del icono
      float beam1 = pow(max(0.0, cos(rotAngle * 6.0)), 14.0);
      float beam2 = pow(max(0.0, sin(rotAngle * 9.0 + sin(rotAngle * 2.0) * 0.2)), 16.0);
      float beam3 = pow(max(0.0, cos(rotAngle * 3.0 - 0.5)), 8.0);
      float rays = (beam1 * 0.70 + beam2 * 0.50 + beam3 * 0.40);

      // Caída radial suave y natural desde el icono hacia afuera (sutil, no invasivo)
      float falloff = smoothstep(0.04 * shrink, 0.14 * shrink, dist) * exp(-dist * 2.0 / shrink);
      float beamIntensity = rays * falloff;

      // Resplandor sutil del Sagrado Corazón detrás de la imagen con suave latido
      float corePulse = 0.75 + 0.05 * sin(u_time * 1.5);
      float coreGlow = exp(-dist * 11.0 / shrink) * corePulse * u_coreIntensity;

      // -------------------------------------------------------------
      // 2. PALETA DIVINA MISERICORDIA (ROJO Y AZUL GIRANDO EN ARMONÍA)
      // -------------------------------------------------------------
      // Rayo Rojo: Sangre y Vida
      vec3 colRed = vec3(0.92, 0.14, 0.20);
      vec3 colCrimson = vec3(0.70, 0.06, 0.10);

      // Rayo Azul y Celeste: Agua y Gracia
      vec3 colBlue = vec3(0.22, 0.56, 0.96);
      vec3 colPaleBlue = vec3(0.68, 0.85, 1.0);

      // Tonos Blancos luminosos
      vec3 colWhite = vec3(1.0, 1.0, 1.0);

      // El eje cromático (Rojo y Azul) gira suavemente acompañando a los rayos
      float rotSide = cos(rotAngle);
      float side = smoothstep(-0.25, 0.25, rotSide);
      vec3 leftColor = mix(colCrimson, colRed, 0.75);
      vec3 rightColor = mix(colBlue, colPaleBlue, 0.55);
      vec3 sideColor = mix(leftColor, rightColor, side);

      // Resaltes en blanco luminoso en el eje de los rayos principales
      float whiteSpine = pow(rays, 2.5) * 0.85 * falloff;
      vec3 rayColor = mix(sideColor * beamIntensity, colWhite * beamIntensity, whiteSpine);

      // Aura central sagrada suave (blanca en el núcleo, transicionando a rojo/azul giratorio)
      vec3 auraColor = mix(colWhite, sideColor, clamp(dist * 2.8, 0.0, 0.8)) * coreGlow;

      // Composición final sutil y reverente
      vec3 finalColor = (rayColor * 1.85 + auraColor) * masterFade;

      float alpha = clamp(length(finalColor) * 1.05, 0.0, 1.0);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  window.WhiteNebulaShader = {
    vertexShader,
    fragmentShader,
    createUniforms: () => ({
      u_time: { value: 0 },
      u_scroll: { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_origin: { value: new THREE.Vector2(0.5, 0.5) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_aspect: { value: window.innerWidth / window.innerHeight },
      u_contraction: { value: 0 },
      u_fadeOut: { value: 0 },
      u_coreIntensity: { value: 1.0 }
    })
  };
})();
