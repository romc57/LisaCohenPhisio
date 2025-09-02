export function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    // Simple front-end validation and mock submit
    if (!data.name || !data.email || !data.message) {
      updateStatus('Please complete all required fields.');
      return;
    }

    // Simulate async submit
    updateStatus('Sending…');
    setTimeout(() => {
      form.reset();
      updateStatus('Thanks! Your message has been sent.');
    }, 800);
  });

  function updateStatus(msg) {
    if (status) {
      status.classList.remove('sr-only');
      status.textContent = msg;
      setTimeout(() => { status.classList.add('sr-only'); }, 4000);
    }
  }
}
