/**
 * ====================================================================
 * NOVENA STORE — ALMACENAMIENTO Y GESTIÓN DE LAS 9 ESTACIONES
 * Autor: Maria Uzcategui (Marigabi94)
 * Persistencia en LocalStorage, progresión de días y sellado de gracia.
 * ====================================================================
 */

(function () {
  'use strict';

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

  class NovenaStore {
    constructor() {
      this.STORAGE_KEY = 'oracion_editorial_v5';
      this.state = this.loadState();
      this.checkCycle();
    }

    loadState() {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            activeDay: parsed.activeDay || 1,
            completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays : [1],
            userGraceText: parsed.userGraceText || '',
            draftGraceText: parsed.draftGraceText || '',
            sealedDate: parsed.sealedDate || null,
            novenaCompleted: Boolean(parsed.novenaCompleted)
          };
        }
      } catch (e) {
        console.warn('NovenaStore: Error al cargar localStorage', e);
      }
      return {
        activeDay: 1,
        completedDays: [1],
        userGraceText: '',
        draftGraceText: '',
        sealedDate: null,
        novenaCompleted: false
      };
    }

    saveState() {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('NovenaStore: Error al guardar en localStorage', e);
      }
    }

    /**
     * Comprueba el estado temporal de la novena en local.
     * Si han transcurrido más de 9 días (día 10 en adelante), limpia el cache/almacenamiento
     * y reinicia desde 0. Si está activa, actualiza el día correspondiente (1 al 9).
     */
    checkCycle() {
      if (!this.state.sealedDate) {
        return {
          status: 'unsealed',
          activeDay: this.state.activeDay || 1,
          novenaCompleted: this.state.novenaCompleted
        };
      }

      const sealed = new Date(this.state.sealedDate);
      const now = new Date();

      // Días calendario transcurridos a medianoche local
      const sealedDayStart = new Date(sealed.getFullYear(), sealed.getMonth(), sealed.getDate()).getTime();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const diffDays = Math.floor((todayStart - sealedDayStart) / (1000 * 60 * 60 * 24));
      const calculatedDay = diffDays + 1; // Día 1 el día del sellado

      // Si han pasado 9 días completos (diffDays >= 9, día 10 o posterior)
      // Se cumplió la novena: limpiar almacenamiento local y reiniciar de 0
      if (diffDays >= 9) {
        this.resetNovena(true);
        return {
          status: 'completed_and_cleared',
          activeDay: 1,
          diffDays,
          novenaCompleted: true
        };
      }

      // Novena en curso (Día 1 al 9)
      const currentDay = Math.max(1, Math.min(9, calculatedDay));
      this.state.activeDay = currentDay;
      if (!this.state.completedDays.includes(currentDay)) {
        this.state.completedDays.push(currentDay);
      }
      this.state.novenaCompleted = false;
      this.saveState();

      return {
        status: 'in_progress',
        activeDay: currentDay,
        currentDay: currentDay,
        diffDays,
        daysLeft: 9 - currentDay
      };
    }

    /**
     * Limpia la novena y reinicia el estado local a 0.
     */
    resetNovena(wasCompleted = false) {
      this.state = {
        activeDay: 1,
        completedDays: [1],
        userGraceText: '',
        draftGraceText: '',
        sealedDate: null,
        novenaCompleted: wasCompleted
      };
      this.saveState();
    }

    /**
     * Guarda el borrador del input del usuario en tiempo real en localStorage.
     */
    saveDraft(text) {
      this.state.draftGraceText = text || '';
      // Si la novena no ha sido sellada, sincronizamos también userGraceText
      if (!this.state.sealedDate) {
        this.state.userGraceText = text || '';
      }
      this.saveState();
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

    getAllDays() {
      return NOVENA_DAYS;
    }

    sealGrace(text) {
      const cleanText = (text || '').trim();
      this.state.userGraceText = cleanText;
      this.state.draftGraceText = cleanText;
      this.state.sealedDate = new Date().toISOString();
      this.state.activeDay = 1;
      this.state.completedDays = [1];
      this.state.novenaCompleted = false;
      this.saveState();
    }
  }

  window.NovenaStore = NovenaStore;
  window.NOVENA_DAYS = NOVENA_DAYS;
})();
