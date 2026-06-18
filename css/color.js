/**
 * colorTimeline.js — Componente de Línea de Tiempo Interactiva
 * Proyecto: Traigamos el Color de Vuelta
 *
 * Responsabilidad: Gestionar la interactividad de la línea de tiempo
 * histórica de colores — hover, foco y estado activo de cada hito.
 *
 * Principio de diseño: Este módulo NO modifica el HTML ni el CSS base.
 * Solo añade comportamiento encima de la estructura semántica existente.
 */

(function () {
  'use strict';

  // =========================================================================
  // DATOS: Información adicional de cada pigmento
  // En una app real, esto podría venir de una API o un archivo JSON.
  // =========================================================================

  /**
   * @typedef {Object} PigmentData
   * @property {string} id       - Identificador único
   * @property {string} color    - Color hexadecimal del pigmento
   * @property {string} name     - Nombre del pigmento
   * @property {string} era      - Época histórica
   * @property {string} origin   - Origen geográfico/químico
   * @property {string} curiosity - Dato curioso sobre el pigmento
   */

  /** @type {PigmentData[]} */
  const PIGMENTS_DATA = [
    {
      id: 'ochre-red',
      color: '#B5410D',
      name: 'Ocre Rojo',
      era: '40,000 a.C.',
      origin: 'Óxido de hierro natural — África y Europa',
      curiosity: 'Se encontraron lápices de ocre en Sudáfrica con 73,000 años de antigüedad.',
    },
    {
      id: 'egyptian-blue',
      color: '#1A3E9E',
      name: 'Azul Egipcio',
      era: '3,000 a.C.',
      origin: 'Cuprorivaita — silicato de calcio y cobre',
      curiosity: 'Fue "redescubierto" por científicos en 2009: emite luz infrarroja y podría usarse en comunicaciones.',
    },
    {
      id: 'tyrian-purple',
      color: '#7D2181',
      name: 'Púrpura de Tiro',
      era: '1,500 a.C.',
      origin: 'Secreción glandular del caracol Murex trunculus',
      curiosity: 'Para teñir un manto imperial se necesitaban más de 10,000 caracoles. Solo los emperadores podían usarlo.',
    },
    {
      id: 'ultramarine',
      color: '#2B4AC4',
      name: 'Azul Ultramarino',
      era: 'Siglo XV',
      origin: 'Lapislázuli molido — minas de Sar-e-Sang, Afganistán',
      curiosity: '"Ultramarino" significa "más allá del mar": venía de tan lejos que su precio reflejaba el viaje.',
    },
    {
      id: 'mauve',
      color: '#E84393',
      name: 'Malva',
      era: '1856',
      origin: 'Residuo de alquitrán de hulla — síntesis química accidental',
      curiosity: 'William Perkin tenía 18 años cuando lo descubrió tratando de sintetizar quinina contra la malaria.',
    },
  ];

  // =========================================================================
  // COMPONENTE: Línea de Tiempo
  // =========================================================================

  /**
   * Controla el estado y comportamiento de la línea de tiempo.
   */
  const ColorTimeline = {

    /** @type {HTMLElement|null} Contenedor principal de la timeline */
    container: null,

    /** @type {NodeListOf<HTMLElement>} Elementos individuales de la timeline */
    items: null,

    /** @type {string|null} ID del pigmento actualmente activo */
    activeId: null,

    /**
     * Inicializa el componente.
     * Busca el DOM, añade listeners y configura el estado inicial.
     */
    init() {
      this.container = document.getElementById('color-timeline');

      // Salida temprana si la timeline no existe en esta página
      if (!this.container) return;

      this.items = this.container.querySelectorAll('.timeline__item');

      this.attachEventListeners();
      console.info(`🕰️ Timeline inicializada con ${this.items.length} hitos`);
    },

    /**
     * Adjunta todos los event listeners a los elementos de la timeline.
     * Usa delegación de eventos en el contenedor para mayor eficiencia.
     */
    attachEventListeners() {
      // Delegación de eventos: un solo listener en el contenedor
      this.container.addEventListener('click', (event) => {
        const item = event.target.closest('.timeline__item');
        if (item) {
          const index = Array.from(this.items).indexOf(item);
          this.activateItem(index);
        }
      });

      // Accesibilidad: activar con teclado (Enter y Space)
      this.container.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          const item = event.target.closest('.timeline__item');
          if (item) {
            event.preventDefault(); // Evitar scroll con Space
            const index = Array.from(this.items).indexOf(item);
            this.activateItem(index);
          }
        }
      });

      // Hacer los items enfocables con teclado
      this.items.forEach((item) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
      });
    },

    /**
     * Activa un elemento de la timeline y muestra su información.
     * @param {number} index - Índice del elemento a activar (0-based)
     */
    activateItem(index) {
      const pigment = PIGMENTS_DATA[index];
      if (!pigment) return;

      // Desactivar el elemento previamente activo
      this.items.forEach((item) => {
        item.classList.remove('is-active');
        item.setAttribute('aria-pressed', 'false');
      });

      // Activar el nuevo elemento
      const activeItem = this.items[index];
      activeItem.classList.add('is-active');
      activeItem.setAttribute('aria-pressed', 'true');

      this.activeId = pigment.id;
      this.showDetail(pigment);
    },

    /**
     * Muestra el panel de detalle con información del pigmento.
     * Si ya existe un panel, lo actualiza en lugar de recrearlo.
     * @param {PigmentData} pigment - Datos del pigmento a mostrar
     */
    showDetail(pigment) {
      // Buscar panel existente o crear uno nuevo
      let panel = this.container.querySelector('.timeline__detail');

      if (!panel) {
        panel = document.createElement('div');
        panel.className = 'timeline__detail';
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-live', 'polite'); // Anuncia cambios a lectores de pantalla
        panel.setAttribute('aria-label', 'Detalle del pigmento seleccionado');
        this.container.appendChild(panel);
      }

      // Actualizar contenido del panel
      panel.innerHTML = `
        <div class="timeline__detail-inner" style="
          margin-top: 2rem;
          padding: 1.25rem 1.5rem;
          border-left: 3px solid ${pigment.color};
          background-color: rgba(247, 243, 236, 0.06);
        ">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div style="
              width: 16px; height: 16px;
              border-radius: 50%;
              background-color: ${pigment.color};
              flex-shrink: 0;
            " aria-hidden="true"></div>
            <h4 style="
              font-family: var(--font-display);
              font-size: 1.1rem;
              color: var(--color-parchment);
            ">${pigment.name} <span style="
              font-family: var(--font-mono);
              font-size: 0.65rem;
              letter-spacing: 0.1em;
              opacity: 0.5;
              font-style: normal;
            ">${pigment.era}</span></h4>
          </div>
          <p style="
            font-size: 0.8rem;
            color: var(--color-mist);
            margin-bottom: 0.5rem;
          "><strong style="font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.1em; opacity: 0.5;">ORIGEN</strong><br />${pigment.origin}</p>
          <p style="
            font-size: 0.8rem;
            line-height: 1.6;
            color: var(--color-mist);
            opacity: 0.8;
            border-top: 1px solid rgba(247,243,236,0.1);
            padding-top: 0.5rem;
            margin-top: 0.5rem;
          ">💡 ${pigment.curiosity}</p>
        </div>
      `;
    },
  };

  // =========================================================================
  // INICIALIZACIÓN
  // =========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    ColorTimeline.init();
  });

})();