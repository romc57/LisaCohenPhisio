const LS_KEY = 'a11y-settings-v1';

function save(settings) {
  localStorage.setItem(LS_KEY, JSON.stringify(settings));
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch { return {}; }
}

function apply(settings) {
  const html = document.documentElement;
  const body = document.body;

  // Font size (as percentage of root)
  if (settings.fontScale) {
    html.style.setProperty('--base-font-size', settings.fontScale + '%');
    const out = document.getElementById('font-size-output');
    if (out) out.value = settings.fontScale + '%';
  }

  // Contrast
  body.classList.toggle('contrast-high', !!settings.contrastHigh);

  // Readable font
  body.classList.toggle('font-readable', !!settings.readableFont);

  // Underline links
  body.classList.toggle('underline-links', !!settings.underlineLinks);

  // Grayscale images
  body.classList.toggle('grayscale-images', !!settings.grayscale);

  // Direction
  if (settings.dir === 'rtl') {
    html.setAttribute('dir', 'rtl');
  } else {
    html.setAttribute('dir', 'ltr');
  }
}

export function initAccessibility() {
  const state = Object.assign({ fontScale: 100, dir: 'ltr' }, load());
  apply(state);

  const panel = document.getElementById('a11y-panel');
  const openBtn = document.getElementById('accessibility-toggle');
  const closeBtn = document.getElementById('a11y-close');
  const live = document.getElementById('a11y-live');

  function announce(msg) {
    if (live) {
      live.textContent = '';
      setTimeout(() => (live.textContent = msg), 30);
    }
  }

  openBtn?.addEventListener('click', () => {
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) {
      panel.removeAttribute('hidden');
      openBtn.setAttribute('aria-expanded', 'true');
      announce('Accessibility panel opened');
    } else {
      panel.setAttribute('hidden', '');
      openBtn.setAttribute('aria-expanded', 'false');
      announce('Accessibility panel closed');
    }
  });

  closeBtn?.addEventListener('click', () => {
    panel.setAttribute('hidden', '');
    openBtn.setAttribute('aria-expanded', 'false');
    announce('Accessibility panel closed');
  });

  panel?.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const action = t.getAttribute('data-a11y') || (t.closest('[data-a11y]')?.getAttribute('data-a11y'));
    if (!action) return;
    e.preventDefault();

    switch (action) {
      case 'increaseFont':
        state.fontScale = Math.min(200, (state.fontScale || 100) + 10);
        break;
      case 'decreaseFont':
        state.fontScale = Math.max(70, (state.fontScale || 100) - 10);
        break;
      case 'toggleContrast':
        state.contrastHigh = !state.contrastHigh; break;
      case 'toggleReadableFont':
        state.readableFont = !state.readableFont; break;
      case 'toggleUnderlineLinks':
        state.underlineLinks = !state.underlineLinks; break;
      case 'toggleGrayscale':
        state.grayscale = !state.grayscale; break;
      case 'setLTR':
        state.dir = 'ltr'; break;
      case 'setRTL':
        state.dir = 'rtl'; break;
      case 'reset':
        state.fontScale = 100;
        state.contrastHigh = false;
        state.readableFont = false;
        state.underlineLinks = false;
        state.grayscale = false;
        state.dir = 'ltr';
        break;
    }

    save(state);
    apply(state);
    announce('Accessibility settings updated');
  });
}
