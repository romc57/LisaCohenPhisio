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
    this.setHeaderHeight();
    this.handleScroll();
    window.addEventListener('resize', () => this.setHeaderHeight());
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    this.isInitialized = true;
    console.log('Navigation Manager initialized');
  }

  cacheElements() {
    this.elements = {
      toggle: document.getElementById('nav-toggle'),
      list: document.getElementById('nav-list'),
      header: document.querySelector('.site-header')
    };
  }

  setHeaderHeight() {
    if (!this.elements.header) return;
    const h = this.elements.header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height', h + 'px');
    document.body.classList.add('has-fixed-header');
  }

  handleScroll() {
    if (!this.elements.header) return;
    const scrolled = window.scrollY > 8;
    this.elements.header.classList.toggle('is-scrolled', scrolled);
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

    this.highlightActive();
    window.addEventListener('hashchange', () => this.highlightActive());
  }

  highlightActive() {
    const links = this.elements.list?.querySelectorAll('a');
    if (!links) return;
    const loc = window.location.pathname + window.location.hash;
    links.forEach(a => {
      const href = a.getAttribute('href');
      const isActive = href && (loc.endsWith(href) || loc.includes(href.split('#')[0]) && href.includes('#') && loc.includes(href.split('#')[1]||''));
      a.classList.toggle('active', !!isActive);
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
