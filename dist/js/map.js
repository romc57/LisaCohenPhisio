(function () {
  let initialized = false;
  let observer = null;

  function getMapTarget() {
    return document.getElementById('leaflet-map');
  }

  function showMapFallback(target) {
    if (!target) return;
    target.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:200px;background:#f5f5f5;border-radius:8px;padding:1rem;text-align:center;">
        <p style="margin:0 0 0.5rem;color:#666;">Map unavailable</p>
        <a href="https://www.openstreetmap.org/?mlat=31.773194&mlon=35.298222#map=16/31.773194/35.298222"
           target="_blank" rel="noopener" style="color:#7c3aed;">
          View on OpenStreetMap
        </a>
      </div>
    `;
  }

  function initLeafletMap() {
    if (initialized) return;
    const target = getMapTarget();
    if (!target) return;

    // Check if map is already initialized on this element
    if (target._leaflet_id) {
      initialized = true;
      return;
    }

    if (typeof L === 'undefined') {
      showMapFallback(target);
      return;
    }

    try {
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
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    } catch (error) {
      showMapFallback(target);
      initialized = true;
    }
  }

  function tryInit() {
    if (initialized) return;
    initLeafletMap();
    if (initialized) return;

    // Observe DOM changes (partials are injected dynamically)
    if (!observer) {
      observer = new MutationObserver(() => {
        if (!initialized && getMapTarget() && typeof L !== 'undefined') {
          initLeafletMap();
        }
      });
      observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }

    // Fallback retry shortly after
    setTimeout(() => { if (!initialized) initLeafletMap(); }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit, { once: true });
  } else {
    tryInit();
  }
  window.addEventListener('load', tryInit, { once: true });
})();
