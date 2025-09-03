/**
 * Site Manager - Main application controller
 * Coordinates all managers and handles initialization
 */

import { AccessibilityManager } from './modules/AccessibilityManager.js';
import { NavigationManager } from './modules/NavigationManager.js';
import { ContentManager } from './modules/ContentManager.js';
import { FormManager } from './modules/FormManager.js';

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

      // Set up global error handling
      this.setupErrorHandling();

      this.isInitialized = true;
      console.log('🚀 Site initialized successfully');

    } catch (error) {
      console.error('❌ Site initialization failed:', error);
    }
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
