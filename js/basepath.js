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
    const known = ['', 'index.html', 'services.html', 'products.html', 'articles.html'];
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
})();
