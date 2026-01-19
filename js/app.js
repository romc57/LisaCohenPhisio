/**
 * Site Manager - Main application controller
 * Coordinates all managers and handles initialization
 */

import './basepath.js';
import './map.js';
import { AccessibilityManager } from './modules/AccessibilityManager.js';
import { NavigationManager } from './modules/NavigationManager.js';
import { ContentManager } from './modules/ContentManager.js';
import { FormManager } from './modules/FormManager.js';

class SlideshowManager {
  constructor(selector) {
    this.root = document.querySelector(selector);
    if (!this.root) return;
    this.track = this.root.querySelector('.slideshow-track');
    this.slides = Array.from(this.root.querySelectorAll('.slide'));
    this.prevBtn = this.root.querySelector('[data-slide-prev]');
    this.nextBtn = this.root.querySelector('[data-slide-next]');
    this.dotsContainer = this.root.querySelector('.slide-dots');
    this.index = 0;
    this.interval = null;
    this.autoDelay = 4000;
    this.isAutoPlaying = false;
    this.visibilityObserver = null;
  }

  init() {
    if (!this.root || !this.track || !this.slides.length) return;
    // ARIA base attributes
    this.root.setAttribute('role', 'region');
    this.root.setAttribute('aria-roledescription', 'carousel');
    this.root.setAttribute('aria-label', this.root.getAttribute('aria-label') || 'Image slideshow');
    if (!this.root.hasAttribute('tabindex')) this.root.setAttribute('tabindex', '0');

    this.setupLayout();
    this.buildDots();
    this.bind();
    this.update();
    this.startAutoplay();
  }

  setupLayout() {
    const count = this.slides.length;
    // Dynamic width & basis (instead of hard-coded CSS 400% / 25%)
    if (this.track) {
      this.track.style.width = `${count * 100}%`;
    }
    const basis = (100 / count) + '%';
    this.slides.forEach((slide, i) => {
      slide.style.flex = `0 0 ${basis}`;
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${i + 1} of ${count}`);
    });
    this.root.dataset.slides = String(count);
  }

  buildDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    this.slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(btn);
    });
  }

  bind() {
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    this.root.addEventListener('mouseenter', () => {
      this.root.classList.add('show-nav');
      this.stopAutoplay();
    });

    this.root.addEventListener('mouseleave', () => {
      this.root.classList.remove('show-nav');
      this.startAutoplay();
    });

    // Accessibility: Pause on keyboard focus
    this.root.addEventListener('focusin', () => this.stopAutoplay());
    this.root.addEventListener('focusout', () => this.startAutoplay());

    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        this.goTo(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        this.goTo(this.slides.length - 1);
      }
    });

    window.addEventListener('resize', () => this.setupLayout());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stopAutoplay(); else this.startAutoplay();
    });

    // Pause when scrolled fully out of view
    if ('IntersectionObserver' in window) {
      this.visibilityObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startAutoplay();
          } else {
            this.stopAutoplay();
          }
        });
      }, { threshold: 0.1 });
      this.visibilityObserver.observe(this.root);
    }
  }

  goTo(index) {
    this.index = Math.max(0, Math.min(index, this.slides.length - 1));
    this.update();
    this.stopAutoplay();
    setTimeout(() => this.startAutoplay(), 5000);
  }

  prev() { this.goTo(this.index === 0 ? this.slides.length - 1 : this.index - 1); }
  next() { this.goTo(this.index === this.slides.length - 1 ? 0 : this.index + 1); }

  startAutoplay() {
    if (this.isAutoPlaying || this.slides.length <= 1) return;
    if (document.body.classList.contains('no-animations')) return;
    this.stopAutoplay();
    this.isAutoPlaying = true;
    this.interval = setInterval(() => {
      if (this.isAutoPlaying && !this.root.classList.contains('show-nav')) {
        this.next();
      }
    }, this.autoDelay);
  }

  stopAutoplay() {
    this.isAutoPlaying = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  update() {
    if (!this.track) return;
    const offset = -this.index * (100 / this.slides.length);
    this.track.style.transform = `translateX(${offset}%)`;

    // Mark current slide
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('current', i === this.index);
      slide.setAttribute('aria-hidden', i === this.index ? 'false' : 'true');
    });

    // Update dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('button');
      dots.forEach((dot, i) => {
        dot.setAttribute('aria-selected', i === this.index ? 'true' : 'false');
      });
    }

    // Update nav buttons
    const disabled = this.slides.length <= 1;
    this.prevBtn?.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.nextBtn?.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  }
}

class SiteManager {
  constructor() {
    this.managers = {};
    this.isInitialized = false;
  }

  /**
   * Initialize the entire site
   */
  async init() {
    if (this.isInitialized) {
      console.warn('Site already initialized');
      return;
    }

    try {
      // Wait for DOM to be ready
      await this.waitForDOM();

      // Initialize all managers
      this.initializeManagers();

      // Initialize animations
      this.setupAnimations();

      // Set up global error handling
      this.setupErrorHandling();

      this.isInitialized = true;
      console.log('🚀 Site initialized successfully');

    } catch (error) {
      console.error('❌ Site initialization failed:', error);
    }
  }

  /**
   * Setup IntersectionObserver for scroll animations
   */
  setupAnimations() {
    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // Only animate once
        }
      });
    }, observerOptions);

    // Observe immediate elements
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    // Expose observer for dynamic content (like ContentManager)
    this.observer = observer;
  }

  /**
   * Wait for DOM to be fully loaded
   */
  waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  /**
   * Initialize all feature managers
   */
  initializeManagers() {
    // Create manager instances
    this.managers = {
      accessibility: new AccessibilityManager(),
      navigation: new NavigationManager(),
      content: new ContentManager(),
      form: new FormManager()
    };

    // Initialize each manager
    Object.entries(this.managers).forEach(([name, manager]) => {
      try {
        manager.init();
        console.log(`✅ ${name} manager initialized`);
      } catch (error) {
        console.error(`❌ Failed to initialize ${name} manager:`, error);
      }
    });

    new SlideshowManager('#showcase').init();
  }

  /**
   * Set up global error handling
   */
  setupErrorHandling() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  /**
   * Get a specific manager instance
   */
  getManager(name) {
    return this.managers[name] || null;
  }

  /**
   * Check if site is initialized
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Cleanup method for when page unloads
   */
  cleanup() {
    // Perform any necessary cleanup
    console.log('Site cleanup performed');
  }


}

// Create and initialize site manager
const siteManager = new SiteManager();

// Initialize when script loads
siteManager.init();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  siteManager.cleanup();
});

// Export for global access
window.SiteManager = siteManager;

export default siteManager;
