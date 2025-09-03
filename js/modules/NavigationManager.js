/**
 * Navigation Manager - Handles responsive navigation
 */

class NavigationManager {
  constructor() {
    this.elements = {};
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.cacheElements();
    this.bindEvents();
    
    this.isInitialized = true;
    console.log('Navigation Manager initialized');
  }

  cacheElements() {
    this.elements = {
      toggle: document.getElementById('nav-toggle'),
      list: document.getElementById('nav-list')
    };
  }

  bindEvents() {
    if (!this.elements.toggle || !this.elements.list) return;

    this.elements.toggle.addEventListener('click', () => {
      this.toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.elements.toggle.contains(e.target) && !this.elements.list.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen()) {
        this.closeMenu();
        this.elements.toggle.focus();
      }
    });
  }

  isMenuOpen() {
    return this.elements.list?.classList.contains('open');
  }

  toggleMenu() {
    const isOpen = this.elements.list.classList.toggle('open');
    this.elements.toggle.setAttribute('aria-expanded', String(isOpen));
  }

  closeMenu() {
    this.elements.list?.classList.remove('open');
    this.elements.toggle?.setAttribute('aria-expanded', 'false');
  }

  openMenu() {
    this.elements.list?.classList.add('open');
    this.elements.toggle?.setAttribute('aria-expanded', 'true');
  }
}

export { NavigationManager };
