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
      header: document.querySelector('.site-header'),
      nav: document.querySelector('.site-nav')
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

    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    links.forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;

      const linkPage = href.split('#')[0] || 'index.html';
      const isHomePage = (currentPage === '' || currentPage === 'index.html');
      const linkIsHome = (linkPage === '' || linkPage === 'index.html');

      let isActive = false;

      if (isHomePage && linkIsHome) {
        isActive = true;
      } else if (currentPage === linkPage) {
        isActive = true;
      }

      a.classList.toggle('active', isActive);
    });
  }

  isMenuOpen() {
    return this.elements.list?.classList.contains('open');
  }

  toggleMenu() {
    const isOpen = this.elements.list.classList.toggle('open');
    this.elements.nav?.classList.toggle('is-open', isOpen);
    this.elements.toggle.setAttribute('aria-expanded', String(isOpen));
  }

  closeMenu() {
    this.elements.list?.classList.remove('open');
    this.elements.nav?.classList.remove('is-open');
    this.elements.toggle?.setAttribute('aria-expanded', 'false');
  }

  openMenu() {
    this.elements.list?.classList.add('open');
    this.elements.nav?.classList.add('is-open');
    this.elements.toggle?.setAttribute('aria-expanded', 'true');
  }
}

export { NavigationManager };
