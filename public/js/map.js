(function () {
  let initialized = false;

  function getMapTarget() {
    return document.getElementById('leaflet-map');
  }

  function initLeafletMap() {
    if (initialized) return;
    const target = getMapTarget();
    if (!target || typeof L === 'undefined') return;

    const lat = parseFloat(target.dataset.lat || '31.773194');
    const lon = parseFloat(target.dataset.lon || '35.298222');
    const zoom = parseInt(target.dataset.zoom || '16', 10);

    const map = L.map(target, { scrollWheelZoom: false, attributionControl: true }).setView([lat, lon], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
      .bindPopup("Kikar Yahalom 29<br>Ma'ale Adumim")
      .openPopup();

    initialized = true;
  }

  function tryInit() {
    if (initialized) return;
    initLeafletMap();
    if (initialized) return;

    // Observe DOM changes (partials are injected dynamically)
    const observer = new MutationObserver(() => {
      if (!initialized && getMapTarget() && typeof L !== 'undefined') {
        initLeafletMap();
        if (initialized) observer.disconnect();
      }
    });
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // Fallback retry shortly after
    setTimeout(() => { if (!initialized) initLeafletMap(); }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
  window.addEventListener('load', tryInit);
})();
