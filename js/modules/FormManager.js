/**
 * Form Manager - Handles contact form functionality
 */

class FormManager {
  constructor() {
    this.elements = {};
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.cacheElements();
    this.bindEvents();
    
    this.isInitialized = true;
    console.log('Form Manager initialized');
  }

  cacheElements() {
    this.elements = {
      form: document.getElementById('contact-form'),
      status: document.getElementById('form-status')
    };
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
      this.showStatus('Thank you! Your message has been sent successfully.', 'success');
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
