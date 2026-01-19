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

  // Function to fix all URLs (runs on DOMContentLoaded and after partials load)
  function fixUrls() {
    const basePath = window.__BASE_PATH__ || '';

    // Only run URL fixing if we have a base path (GitHub Pages project site)
    if (basePath) {
      // Fix all internal links
      document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        // Only fix relative links (not external, not absolute, not already prefixed)
        if (href &&
            !href.startsWith('http') &&
            !href.startsWith('//') &&
            !href.startsWith(basePath) &&
            !href.startsWith('#')) {
          // Handle index.html#anchor format
          const hashIndex = href.indexOf('#');
          if (hashIndex > 0) {
            const pathPart = href.substring(0, hashIndex);
            const hashPart = href.substring(hashIndex);
            a.setAttribute('href', buildURL(pathPart) + hashPart);
          } else {
            a.setAttribute('href', buildURL(href));
          }
        }
      });

      // Fix all images
      document.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src');
        if (src &&
            !src.startsWith('http') &&
            !src.startsWith('//') &&
            !src.startsWith('data:') &&
            !src.startsWith(basePath)) {
          img.setAttribute('src', buildURL(src));
        }
      });

      // Fix all source elements (for picture/srcset)
      document.querySelectorAll('source[srcset]').forEach(source => {
        const srcset = source.getAttribute('srcset');
        if (srcset &&
            !srcset.startsWith('http') &&
            !srcset.startsWith('//')) {
          // Handle srcset format: "path1.jpg 1x, path2.jpg 2x" or just "path.jpg"
          const fixed = srcset.split(',').map(s => {
            const parts = s.trim().split(/\s+/);
            if (parts[0] && !parts[0].startsWith('http') && !parts[0].startsWith(basePath)) {
              parts[0] = buildURL(parts[0]);
            }
            return parts.join(' ');
          }).join(', ');
          source.setAttribute('srcset', fixed);
        }
      });
    }

    // Highlight active nav by URL path
    const path = location.pathname.split('/').pop();
    const links = document.querySelectorAll('.site-nav a, .site-footer a');
    links.forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      const hrefPath = href.split('#')[0].split('/').pop(); // Get filename only
      if (hrefPath === path || (path === '' && hrefPath === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  // Run on DOMContentLoaded
  window.addEventListener('DOMContentLoaded', fixUrls);

  // Run again after partials are loaded (from app.js)
  window.addEventListener('partialsLoaded', fixUrls);
})();
