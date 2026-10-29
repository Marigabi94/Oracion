# Oración a Jesús de la Divina Misericordia

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Firebase](https://img.shields.io/badge/Firebase_Hosting-deploy-FFCA28?logo=firebase&logoColor=black)](https://oracion-8ef29.web.app/)
[![GitHub last commit](https://img.shields.io/github/last-commit/marigabi94/Oracion?style=flat&logo=github&logoColor=white&color=c5a059)](https://github.com/marigabi94/Oracion)

Experiencia espiritual, devocional e inmersiva de 9 días de conversación íntima con Jesús de la Divina Misericordia. Diseñada con dirección de arte editorial de autor, modo oscuro profundo (*Dark Mode* litúrgico), efectos 3D WebGL volumétricos y un altar interactivo para encender el cirio pascual y sellar súplicas en el santuario digital.

🔗 **Demo / Producción:** [https://oracion-8ef29.web.app/](https://oracion-8ef29.web.app/)  
📦 **Repositorio:** [https://github.com/Marigabi94/Oracion](https://github.com/Marigabi94/Oracion)

---

## 📖 Descripción

Este proyecto es un santuario devocional interactivo de alta gama que fusiona la devoción católica consagrada con tecnologías web modernas y cinemáticas. Permite a los fieles recorrer una novena de nueve jornadas de diálogo íntimo, meditación y petición de gracia ante la presencia del Señor, con persistencia local del progreso y un paisaje sonoro etéreo.

**Funcionalidades principales:**
- **Altar de la Gracia Interactivo:** Encendido táctil y por teclado de la llama del cirio pascual en video litúrgico continuo, acompañado de repique sacro de campana sintetizado a 432 Hz.
- **Sellado y Persistencia de Súplicas:** Registro seguro y privado de peticiones o agradecimientos en el navegador (`localStorage`) con seguimiento automático del ciclo de 9 días.
- **Texto Consagrado Invariable:** Plegaria tradicional litúrgica con letra capitular, formato editorial y cuadro de interludio sincronizado en tiempo real con la intención sellada en el altar.
- **Bento Grid de las 9 Estaciones:** Cuadrícula interactiva con selector diario de estaciones, intenciones temáticas (Confianza, Soberanía, Consuelo, Sanación, etc.) y reflexiones devocionales.
- **Scrollytelling Cinemático en Portal:** Transición fluida multi-etapa gobernada por GSAP ScrollTrigger y Theatre.js (contracción Hero hacia el centro, micro-pausa en negro puro y aproximación volumétrica hacia el Altar).
- **Lienzo 3D WebGL con Shaders de Autor:** Rayos áureos y partículas volumétricas mediante Three.js y shaders GLSL personalizados, perfectamente centrados tras el Sagrado Corazón de Jesús.
- **Estampa Devocional Imprimible:** Diálogo modal accesible para previsualizar e imprimir la estampa de la novena o compartirla en redes sociales.
- **Accesibilidad Universal (WCAG 2.2 AA):** Contraste litúrgico verificado (4.5:1 / 3:1), enlaces de salto (`skip-link`), navegación completa por teclado, foco visible y respeto estricto a la preferencia de movimiento reducido (`prefers-reduced-motion: reduce`).
- **Indexación y GEO para IA:** Metadatos completos OpenGraph, Twitter Cards, `robots.txt` multi-rastreador y Schema.org JSON-LD estructurado (`WebSite`, `WebApplication`, `CreativeWork`, `FAQPage`).

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| **Framework / Core** | Vanilla Web Architecture (HTML5 semántico, sin dependencias pesadas de framework) |
| **Lenguaje** | JavaScript (ES6+ Modular) |
| **Estilos** | Vanilla CSS (Variables CSS / Design Tokens, Dark Glassmorphism, Bordes de luz 1px) |
| **Gráficos 3D / WebGL** | Three.js (r128) + Shaders GLSL personalizados (`WhiteNebulaShader`) |
| **Timeline Cinemático** | Theatre.js (Core & Studio v0.7.2) |
| **Scroll Inercial & Animación** | Lenis Smooth Scroll (v1.1.18) + GSAP 3 & ScrollTrigger (v3.12.5) |
| **Motor de Audio** | Web Audio API nativo (Síntesis de frecuencia armónica a 432 Hz sin audio externo) |
| **Estado / Persistencia** | LocalStorage API (`NovenaStore` con validación y reinicio tras 9 días) |
| **Validación & Sanitización** | Validación nativa de formularios y sanitización contextual anti-XSS |
| **Tipografías de Autor** | Cinzel, Cormorant Garamond, Plus Jakarta Sans, Syne, JetBrains Mono, Playfair Display, Lora, Beau Rivage |
| **SEO & Metadatos Semánticos** | Schema.org JSON-LD, OpenGraph, Twitter Cards, Sitemap XML e indexación GEO |
| **Hosting / Despliegue** | Firebase Hosting (`oracion-8ef29.web.app`) |

---

## 📋 Requisitos previos

- Un navegador web moderno con soporte para **WebGL** y **Web Audio API** (Chrome, Firefox, Edge, Safari u Opera).
- Un servidor web estático local (opciones recomendadas):
  - **Laragon**, **Apache**, **Nginx**, o **XAMPP**.
  - O **Node.js** (v18+) con CLI como `serve` o `live-server`.
  - O la extensión **Live Server** de Visual Studio Code.
- Opcional para despliegue: **Firebase CLI** (`firebase-tools`).

---

## 🚀 Instalación y ejecución en local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Marigabi94/Oracion.git
cd Oracion

# 2. Configurar variables de entorno (opcional)
cp .env.example .env

# 3. Iniciar un servidor web estático
# Opción A: Usando npx (Node.js)
npx serve .

# Opción B: Si utilizas Laragon o XAMPP
# Colocar la carpeta en c:\laragon\www\Proyectos\Oracion y acceder desde:
# http://localhost/Proyectos/Oracion/
```

### Comandos disponibles

Al ser una arquitectura web nativa y modular en JavaScript vainilla (Vanilla JS), no se requiere paso de compilación (`build`) obligatorio para desarrollo:

```bash
# Servir en local mediante npx
npx serve -l 3000 .

# Validar / desplegar en Firebase Hosting (si se tiene configurado Firebase CLI)
firebase deploy --only hosting
```

---

## 🔐 Variables de entorno

| Variable | Descripción | Obligatoria |
|---|---|---|
| `FIREBASE_PROJECT_ID` | Identificador del proyecto de Firebase para despliegue (`oracion-8ef29`) | No (solo para CI/CD) |
| `FIREBASE_SITE_URL` | URL canónica de producción (`https://oracion-8ef29.web.app/`) | No (informativa) |

> **Nota:** La aplicación es 100% estática en el cliente (*client-side*). Toda la persistencia de datos (súplicas y progreso de la novena) reside de forma privada en el almacenamiento local (`localStorage`) del dispositivo del devoto, sin transmitir credenciales ni datos personales a servidores externos.

---

## 📁 Estructura del proyecto

```text
Oracion/
├── .env.example                # Plantilla documentada de variables de entorno
├── .gitignore                  # Reglas de exclusión para Git y Firebase
├── index.html                  # Documento principal HTML5 semántico con metadatos y Schema.org
├── robots.txt                  # Reglas de rastreo SEO y motores de inteligencia artificial
├── sitemap.xml                 # Mapa del sitio XML con indexación de imágenes sagradas
├── README.md                   # Documentación técnica integral del proyecto
└── assets/
    ├── css/
    │   ├── main.css            # Hoja de estilos principal e importaciones
    │   ├── variables.css       # Tokens de diseño, paleta obsidiana/oro y jerarquía tipográfica
    │   ├── reset.css           # Reseteo CSS moderno y box-sizing universal
    │   ├── components.css      # Sistema de componentes editoriales (Dark Glassmorphism, Bento Grid)
    │   ├── fonts.css           # Carga de tipografías locales
    │   └── fonts/              # Archivos de fuentes tipográficas (Playfair Display, Lora, Beau Rivage)
    ├── js/
    │   ├── main.js             # Orquestador general, bucle RAF unificado y controladores de eventos
    │   ├── app.js              # Módulo de respaldo y definiciones de las 9 estaciones
    │   ├── core/
    │   │   ├── RafHub.js       # Bucle maestro requestAnimationFrame unificado (60 FPS estricto)
    │   │   └── ScrollEngine.js # Wrapper inercial de Lenis con soporte de movimiento reducido
    │   ├── webgl/
    │   │   ├── Stage3D.js      # Escena Three.js, cámara de perspectiva y control de canvas
    │   │   └── shaders/
    │   │       └── WhiteNebulaShader.js # Shaders GLSL de radiación estelar y filamentos de luz
    │   ├── timeline/
    │   │   └── TheatreDirector.js  # Director de línea de tiempo cinemática con Theatre.js
    │   ├── app/
    │   │   ├── NovenaStore.js  # Gestión de estado, ciclo de 9 días y persistencia en LocalStorage
    │   │   └── AudioAmbiance.js # Síntesis armónica de campana sacra con Web Audio API
    │   └── modules/            # Módulos auxiliares SOLID de animación, audio y scroll
    ├── vid/
    │   ├── jesus.mp4           # Video devocional en bucle de Jesús de la Divina Misericordia
    │   └── candle-flame.mp4    # Video en bucle continuo de la llama del cirio pascual
    └── images/
        ├── jesus-sacred.jpg    # Icono sagrado de Jesús de la Divina Misericordia (Poster / OG)
        └── candle-altar.jpg    # Imagen de respaldo del cirio en el altar
```

---

## 🚢 Despliegue

El sitio está optimizado para su alojamiento inmediato en cualquier proveedor de CDN o hosting estático:

1. **Firebase Hosting (Producción actual):**
   ```bash
   # Iniciar sesión en Firebase
   firebase login

   # Desplegar a producción
   firebase deploy --only hosting
   ```
2. **Alternativas compatibles sin configuración adicional:**
   - **Vercel:** `vercel --prod`
   - **Netlify:** `netlify deploy --prod --dir=.`
   - **GitHub Pages:** Habilitar desde la pestaña de *Settings -> Pages* apuntando a la rama `main` en la raíz `/`.

---

## 👤 Autoría

- **Desarrollo y Dirección de Arte:** Maria Uzcategui ([@Marigabi94](https://github.com/Marigabi94))
- **Repositorio:** [github.com/Marigabi94/Oracion](https://github.com/Marigabi94/Oracion)
- **Licencia:** Esta obra se distribuye bajo una [Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).
