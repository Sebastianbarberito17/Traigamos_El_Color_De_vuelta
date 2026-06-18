/**
 * main.js — Lógica principal de la aplicación
 * Proyecto: Traigamos el Color de Vuelta
 *
 * Responsabilidades de este módulo:
 * - Menú de navegación móvil (hamburguesa)
 * - Animaciones de entrada al hacer scroll (Intersection Observer)
 * - Inicialización de módulos
 *
 * Patrón: IIFE (Immediately Invoked Function Expression)
 * Encapsula el código para evitar contaminar el scope global.
 */

(function () {
  'use strict';

  // =========================================================================
  // MÓDULO: Menú de navegación móvil
  // =========================================================================

  /**
   * Inicializa el comportamiento del menú hamburguesa en móvil.
   * Gestiona: apertura/cierre, aria-expanded, y cierre al hacer clic fuera.
   */
  function initMobileNav() {
    const toggle = document.querySelector('.nav__toggle');
    const menu   = document.querySelector('.nav__links');

    // Salida temprana si los elementos no existen (página sin nav)
    if (!toggle || !menu) return;

    /**
     * Abre o cierra el menú y actualiza los atributos ARIA.
     * @param {boolean} isOpen - Estado deseado del menú
     */
    function setMenuState(isOpen) {
      menu.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    }

    // Clic en el botón hamburguesa: alternar estado
    toggle.addEventListener('click', () => {
      const isCurrentlyOpen = menu.classList.contains('is-open');
      setMenuState(!isCurrentlyOpen);
    });

    // Clic fuera del menú: cerrar
    document.addEventListener('click', (event) => {
      const clickedInsideNav = toggle.contains(event.target) || menu.contains(event.target);
      if (!clickedInsideNav && menu.classList.contains('is-open')) {
        setMenuState(false);
      }
    });

    // Tecla Escape: cerrar menú (accesibilidad de teclado)
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenuState(false);
        toggle.focus(); // Devolver foco al botón que abrió el menú
      }
    });
  }

  // =========================================================================
  // MÓDULO: Animaciones de entrada al hacer scroll
  // =========================================================================

  /**
   * Anima elementos cuando entran al viewport usando IntersectionObserver.
   * Los elementos con clase "fade-in" comienzan invisibles y aparecen suavemente.
   *
   * Patrón CSS requerido en components.css:
   *   .fade-in { opacity: 0; transform: translateY(20px); transition: ... }
   *   .fade-in.is-visible { opacity: 1; transform: translateY(0); }
   */
  function initScrollAnimations() {
    // Verificar soporte (todos los navegadores modernos lo soportan)
    if (!('IntersectionObserver' in window)) {
      // Fallback: mostrar todos los elementos si no hay soporte
      document.querySelectorAll('.fade-in').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observerOptions = {
      threshold: 0.15,       // Activar cuando el 15% del elemento es visible
      rootMargin: '0px 0px -40px 0px', // Activar un poco antes de llegar al borde
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Dejar de observar el elemento — ya no necesita animarse
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observar todos los elementos animables
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
  }

  // =========================================================================
  // MÓDULO: Navegación activa según scroll
  // =========================================================================

  /**
   * Marca como activo el enlace de navegación correspondiente a la
   * sección actualmente visible en el viewport.
   */
  function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');

            // Quitar clase activa de todos los links
            navLinks.forEach((link) => {
              link.classList.remove('is-active');
              link.removeAttribute('aria-current');
            });

            // Activar el link correspondiente a la sección visible
            const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
            if (activeLink) {
              activeLink.classList.add('is-active');
              activeLink.setAttribute('aria-current', 'true');
            }
          }
        });
      },
      { threshold: 0.5 } // Activar cuando el 50% de la sección es visible
    );

    sections.forEach((section) => observer.observe(section));
  }

  // =========================================================================
  // INICIALIZACIÓN
  // Ejecutar cuando el DOM esté completamente cargado
  // =========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initScrollAnimations();
    initActiveNavOnScroll();

    console.info('🎨 Traigamos el Color de Vuelta — Scripts inicializados');
  });

})();