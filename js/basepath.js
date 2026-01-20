(function() {
  const REPO = 'LisaCohenPhisio';
  const host = location.hostname;
  const parts = location.pathname.split('/').filter(Boolean);
  const isGitHub = host.endsWith('.github.io');
  const isProjectPath = isGitHub && parts[0] === REPO;

  // Expose base path ('' for custom domain root, '/REPO' for project site)
  window.__BASE_PATH__ = isProjectPath ? '/' + REPO : '';

  // Redirect if on github.io and missing repo segment for known entry pages
  if (isGitHub && !isProjectPath) {
    const first = parts[0] || '';
    const known = ['', 'index.html', 'about.html', 'services.html', 'products.html', 'articles.html'];
    if (known.includes(first)) {
      const remainder = parts.slice(1).join('/');
      const target = '/' + REPO + '/' + (first || '') + (remainder ? '/' + remainder : '');
      const hash = location.hash || '';
      location.replace(target + hash);
      return; // stop further execution on this page
    }
  }

  // Helper for future scripts to build absolute internal URLs
  window.buildURL = function(path) {
    path = String(path || '').replace(/^\/+/, '');
    return (window.__BASE_PATH__ ? window.__BASE_PATH__ + '/' : '/') + path;
  };

  // Fix all image src attributes to use the base path
  function fixImagePaths() {
    if (!window.__BASE_PATH__) return; // No base path needed

    const images = document.querySelectorAll('img[src], source[srcset], picture source');
    images.forEach(img => {
      // Fix src attribute
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('//') && !src.startsWith(window.__BASE_PATH__)) {
        const newSrc = window.__BASE_PATH__ + '/' + src.replace(/^\/+/, '');
        img.setAttribute('src', newSrc);
      }

      // Fix srcset attribute (for <source> elements)
      const srcset = img.getAttribute('srcset');
      if (srcset && !srcset.startsWith('http') && !srcset.startsWith('//') && !srcset.startsWith(window.__BASE_PATH__)) {
        const newSrcset = window.__BASE_PATH__ + '/' + srcset.replace(/^\/+/, '');
        img.setAttribute('srcset', newSrcset);
      }
    });
  }

  // Optional: highlight active nav by URL path
  window.addEventListener('DOMContentLoaded', () => {
    // Fix image paths on load
    fixImagePaths();

    // Also observe for dynamically added images
    if ('MutationObserver' in window) {
      const observer = new MutationObserver(() => {
        fixImagePaths();
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    const path = location.pathname.split('/').pop();
    const links = document.querySelectorAll('.site-nav a, .site-footer a');
    links.forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      const hrefPath = href.split('#')[0];
      if (hrefPath === path || (path === '' && hrefPath === 'index.html')) {
        a.classList.add('active');
      }
    });
  });
})();
