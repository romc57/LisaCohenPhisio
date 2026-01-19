/**
 * Form Manager - Handles contact form functionality
 */

class FormManager {
  constructor() {
    this.elements = {};
    this.isInitialized = false;
    this.modal = null;
  }

  init() {
    if (this.isInitialized) return;

    this.cacheElements();
    this.bindEvents();
    this.createSuccessModal();

    this.isInitialized = true;
    console.log('Form Manager initialized');
  }

  cacheElements() {
    this.elements = {
      form: document.getElementById('contact-form'),
      status: document.getElementById('form-status')
    };
  }

  createSuccessModal() {
    // Create modal HTML
    const modalHTML = `
      <div class="modal-overlay" id="success-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-content">
          <div class="modal-icon" aria-hidden="true">✓</div>
          <h2 id="modal-title">Thank You!</h2>
          <p>Your message has been sent successfully. We'll get back to you within 1 business day.</p>
          <button class="btn btn-primary" id="modal-close-btn">Close</button>
          <div class="modal-links">
            In the meantime, explore our <a href="articles.html">articles</a> or <a href="services.html">services</a>.
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('success-modal');

    // Bind modal close events
    const closeBtn = document.getElementById('modal-close-btn');
    closeBtn?.addEventListener('click', () => this.hideModal());

    // Close on backdrop click
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hideModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('is-visible')) {
        this.hideModal();
      }
    });
  }

  showModal() {
    if (!this.modal) return;
    this.modal.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    // Focus the close button for accessibility
    setTimeout(() => {
      document.getElementById('modal-close-btn')?.focus();
    }, 100);
  }

  hideModal() {
    if (!this.modal) return;
    this.modal.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  bindEvents() {
    if (!this.elements.form) return;

    this.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(e);
    });
  }

  handleSubmit(event) {
    const formData = new FormData(this.elements.form);
    const data = Object.fromEntries(formData.entries());

    // Validate required fields
    const requiredFields = ['name', 'email', 'message'];
    const missingFields = requiredFields.filter(field => !data[field]?.trim());

    if (missingFields.length > 0) {
      this.showStatus('Please complete all required fields.', 'error');
      this.focusFirstMissingField(missingFields);
      return;
    }

    // Validate email format
    if (!this.isValidEmail(data.email)) {
      this.showStatus('Please enter a valid email address.', 'error');
      this.elements.form.querySelector('[name="email"]')?.focus();
      return;
    }

    this.submitForm(data);
  }

  async submitForm(data) {
    this.showStatus('Sending message...', 'loading');

    try {
      // Simulate API call
      await this.simulateSubmission();

      this.elements.form.reset();
      this.elements.status?.classList.add('sr-only');
      this.showModal();
    } catch (error) {
      console.error('Form submission error:', error);
      this.showStatus('Sorry, there was an error sending your message. Please try again.', 'error');
    }
  }

  simulateSubmission() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  showStatus(message, type = 'info') {
    if (!this.elements.status) return;

    this.elements.status.textContent = message;
    this.elements.status.className = `form-status ${type}`;
    this.elements.status.classList.remove('sr-only');
    
    // Auto-hide success/error messages after 5 seconds
    if (type !== 'loading') {
      setTimeout(() => {
        this.elements.status.classList.add('sr-only');
      }, 5000);
    }
  }

  focusFirstMissingField(missingFields) {
    const firstMissingField = this.elements.form.querySelector(`[name="${missingFields[0]}"]`);
    if (firstMissingField) {
      firstMissingField.focus();
      firstMissingField.setAttribute('aria-invalid', 'true');
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export { FormManager };
