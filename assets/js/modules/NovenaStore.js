/**
 * NovenaStore.js
 * Gestión de estado del itinerario devocional de los 9 días, persistencia en localStorage,
 * peticiones de gracia selladas y generación de estampas compartibles.
 */

export const NOVENA_DAYS = [
  {
    day: 1,
    title: "Día 1: Entrega y Confianza Absoluta",
    intention: "Mi Jesús, en ti deposito toda mi confianza. Tú sabes de todo, Padre y Señor del universo.",
    reflection: "Comienza este recorrido abriendo tu corazón sin reservas, soltando las cargas que no puedes llevar por tus propias fuerzas."
  },
  {
    day: 2,
    title: "Día 2: El Rey de Reyes y Señor de lo Imposible",
    intention: "Eres el Rey de Reyes, tú que hiciste al paralítico andar y al muerto vivir.",
    reflection: "Medita en la omnipotencia divina: para Jesús no existen imposibles ni distancias que su gracia no pueda alcanzar."
  },
  {
    day: 3,
    title: "Día 3: El Amigo que Conoce tus Lágrimas",
    intention: "Tú que conoces mis angustias y ves mis lágrimas. Bien sabes, Divino Amigo, cuánto preciso de ti.",
    reflection: "Jesús camina a tu lado en el silencio del dolor. Tus lágrimas son escuchadas y acogidas con infinita ternura."
  },
  {
    day: 4,
    title: "Día 4: Sanación de Alma y Cuerpo",
    intention: "Tú que hiciste al leproso sanar, limpia mis dudas y renueva mi espíritu abatido.",
    reflection: "Pide la sanación interior de cualquier herida o rencor para que tu corazón sea tierra fértil para el milagro."
  },
  {
    day: 5,
    title: "Día 5: La Súplica Fiel de la Gracia",
    intention: "Haz, Divino Jesús, que antes de que termine esta conversación de nueve días, alcance de ti esta gracia.",
    reflection: "Renueva tu petición con paz profunda, recordando que la fe no exige tiempos, sino que confía en el designio supremo."
  },
  {
    day: 6,
    title: "Día 6: La Esperanza Inquebrantable",
    intention: "Te pido con mucha fe y esperanza; ilumina mis pasos como el sol ilumina cada amanecer.",
    reflection: "Visualiza la luz de Cristo disipando la incertidumbre en tu vida, trayendo claridad a cada decisión."
  },
  {
    day: 7,
    title: "Día 7: Promesa de Gratitud y Caridad",
    intention: "Con gratitud compartiré tu misericordia para que otros aprendan a tener fe en tu infinito amor.",
    reflection: "El milagro recibido es una semilla para ser compartida. Transforma tu gratitud en obras de bien hacia el prójimo."
  },
  {
    day: 8,
    title: "Día 8: Testimonio de Nuestra Conversación",
    intention: "Cada mañana testifica nuestra conversación íntima; tú guías mis caminos y fortaleces mi paso.",
    reflection: "La oración constante no es un monólogo, es una presencia viva que te acompaña a cada instante del día."
  },
  {
    day: 9,
    title: "Día 9: Clímax de Fe y Victoria Espiritual",
    intention: "Jesucristo, tengo confianza en ti. Cada día crece más mi fe en ti.",
    reflection: "Culmina la novena no con incertidumbre, sino con la serena certeza de que has sido escuchado y bendecido."
  }
];

export class NovenaStore {
  constructor() {
    this.storageKey = 'oracion_novena_state_v1';
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('NovenaStore: Error al leer localStorage', e);
    }

    return {
      activeDay: 1,
      completedDays: [1],
      userGraceText: '',
      graceSealedDate: null
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('NovenaStore: Error al guardar en localStorage', e);
    }
  }

  getActiveDayData() {
    return NOVENA_DAYS.find(d => d.day === this.state.activeDay) || NOVENA_DAYS[0];
  }

  setActiveDay(dayNumber) {
    if (dayNumber >= 1 && dayNumber <= 9) {
      this.state.activeDay = dayNumber;
      if (!this.state.completedDays.includes(dayNumber)) {
        this.state.completedDays.push(dayNumber);
      }
      this.saveState();
      return this.getActiveDayData();
    }
    return null;
  }

  sealGrace(graceText) {
    this.state.userGraceText = graceText;
    this.state.graceSealedDate = new Date().toISOString();
    this.saveState();
  }

  getSavedGrace() {
    return this.state.userGraceText;
  }
}
