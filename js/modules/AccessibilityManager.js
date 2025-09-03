/**
 * Accessibility Manager - Clean, Modular Implementation
 * Handles all accessibility features and UI state management
 */

class AccessibilityManager {
  constructor() {
    this.storageKey = 'accessibility-settings-v1';
    this.defaultSettings = {
      fontScale: 100,
      contrastHigh: false,
      invertColors: false,
      readableFont: false,
      underlineLinks: false,
      grayscale: false,
      noAnimations: false,
      direction: 'ltr'
    };
    
    this.elements = {};
    this.isInitialized = false;
    this.currentSettings = { ...this.defaultSettings };
  }

  /**
   * Initialize the accessibility manager
   */
  init() {
    if (this.isInitialized) return;
    
    this.cacheElements();
    this.loadSettings();
    this.applySettings();
    this.bindEvents();
    
    this.isInitialized = true;
    console.log('Accessibility Manager initialized');
  }

  /**
   * Cache all DOM elements
   */
  cacheElements() {
    this.elements = {
      openButton: document.getElementById('accessibility-toggle'),
      panel: document.getElementById('a11y-panel'),
      closeButton: document.getElementById('a11y-close'),
      liveRegion: document.getElementById('a11y-live'),
      actionButtons: document.querySelectorAll('[data-a11y]')
    };

    // Validate required elements
    const required = ['openButton', 'panel', 'closeButton'];
    for (const elementName of required) {
      if (!this.elements[elementName]) {
        console.warn(`Required accessibility element not found: ${elementName}`);
      }
    }
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.currentSettings = { ...this.defaultSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Could not load accessibility settings:', error);
      this.currentSettings = { ...this.defaultSettings };
    }
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.currentSettings));
    } catch (error) {
      console.warn('Could not save accessibility settings:', error);
    }
  }

  /**
   * Apply all current settings to the document
   */
  applySettings() {
    const { documentElement: html, body } = document;

    // Font scaling
    html.style.setProperty('--base-font-size', `${this.currentSettings.fontScale}%`);

    // Apply CSS classes based on settings
    const classMap = {
      'contrast-high': this.currentSettings.contrastHigh,
      'invert-colors': this.currentSettings.invertColors,
      'font-readable': this.currentSettings.readableFont,
      'underline-links': this.currentSettings.underlineLinks,
      'grayscale-images': this.currentSettings.grayscale,
      'no-animations': this.currentSettings.noAnimations
    };

    Object.entries(classMap).forEach(([className, enabled]) => {
      body.classList.toggle(className, enabled);
    });

    // Text direction
    html.setAttribute('dir', this.currentSettings.direction);
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Panel toggle
    this.elements.openButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePanel();
    });

    // Panel close
    this.elements.closeButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closePanel();
    });

    // Backdrop click to close
    this.elements.panel?.addEventListener('click', (e) => {
      if (e.target === this.elements.panel) {
        this.closePanel();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isPanelOpen()) {
        this.closePanel();
        this.elements.openButton?.focus();
      }
    });

    // Action buttons
    this.elements.panel?.addEventListener('click', (e) => {
      const button = e.target.closest('[data-a11y]');
      if (button) {
        e.preventDefault();
        e.stopPropagation();
        this.handleAction(button.getAttribute('data-a11y'));
      }
    });
  }

  /**
   * Check if panel is currently open
   */
  isPanelOpen() {
    return this.elements.panel && 
           !this.elements.panel.hasAttribute('hidden') && 
           this.elements.panel.getAttribute('aria-hidden') === 'false';
  }

  /**
   * Toggle panel open/closed
   */
  togglePanel() {
    if (this.isPanelOpen()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  /**
   * Open the accessibility panel
   */
  openPanel() {
    if (!this.elements.panel) return;

    this.elements.panel.removeAttribute('hidden');
    this.elements.panel.setAttribute('aria-hidden', 'false');
    this.elements.openButton?.setAttribute('aria-expanded', 'true');
    this.announce('Accessibility panel opened');
  }

  /**
   * Close the accessibility panel
   */
  closePanel() {
    if (!this.elements.panel) return;

    this.elements.panel.setAttribute('hidden', '');
    this.elements.panel.setAttribute('aria-hidden', 'true');
    this.elements.openButton?.setAttribute('aria-expanded', 'false');
    this.announce('Accessibility panel closed');
  }

  /**
   * Handle accessibility action
   */
  handleAction(action) {
    const actions = {
      increaseFont: () => {
        this.currentSettings.fontScale = Math.min(200, this.currentSettings.fontScale + 10);
      },
      decreaseFont: () => {
        this.currentSettings.fontScale = Math.max(70, this.currentSettings.fontScale - 10);
      },
      toggleContrast: () => {
        this.currentSettings.contrastHigh = !this.currentSettings.contrastHigh;
      },
      toggleInvertColors: () => {
        this.currentSettings.invertColors = !this.currentSettings.invertColors;
      },
      toggleReadableFont: () => {
        this.currentSettings.readableFont = !this.currentSettings.readableFont;
      },
      toggleUnderlineLinks: () => {
        this.currentSettings.underlineLinks = !this.currentSettings.underlineLinks;
      },
      toggleGrayscale: () => {
        this.currentSettings.grayscale = !this.currentSettings.grayscale;
      },
      toggleAnimations: () => {
        this.currentSettings.noAnimations = !this.currentSettings.noAnimations;
      },
      toggleRTL: () => {
        this.currentSettings.direction = this.currentSettings.direction === 'rtl' ? 'ltr' : 'rtl';
      },
      reset: () => {
        this.currentSettings = { ...this.defaultSettings };
      }
    };

    if (actions[action]) {
      actions[action]();
      this.applySettings();
      this.saveSettings();
      this.announce('Accessibility settings updated');
    } else {
      console.warn(`Unknown accessibility action: ${action}`);
    }
  }

  /**
   * Announce message to screen readers
   */
  announce(message) {
    if (!this.elements.liveRegion) return;

    this.elements.liveRegion.textContent = '';
    setTimeout(() => {
      this.elements.liveRegion.textContent = message;
    }, 100);
  }

  /**
   * Get current settings (for debugging)
   */
  getSettings() {
    return { ...this.currentSettings };
  }

  /**
   * Update specific setting
   */
  updateSetting(key, value) {
    if (key in this.currentSettings) {
      this.currentSettings[key] = value;
      this.applySettings();
      this.saveSettings();
    }
  }
}

// Export for use in main.js
export { AccessibilityManager };
