/**
 * Content Manager - Handles dynamic content rendering
 */

class ContentManager {
  constructor() {
    this.elements = {};
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.cacheElements();
    this.renderContent();
    this.updateYear();
    
    this.isInitialized = true;
    console.log('Content Manager initialized');
  }

  cacheElements() {
    this.elements = {
      servicesGrid: document.getElementById('services-grid'),
      servicesList: document.getElementById('services-list'),
      servicesAllList: document.getElementById('services-all-list'),
      productsGrid: document.getElementById('products-grid'),
      articlesList: document.getElementById('articles-list'),
      yearElement: document.getElementById('year')
    };
  }

  renderContent() {
    // Import data dynamically
    import('../data.js').then(({ services, products, articles }) => {
      // Render full services grid (services page)
      this.renderServices(services);
      // Render homepage services teaser list (first N)
      this.renderServicesTeaser(services);
      // Render expanded list of all services (links to exact anchors on services page)
      this.renderAllServiceLinks(services);

      // Ensure deep-link scrolling works after dynamic render (services page)
      this.scrollToHashIfNeeded();

      // Render other content
      this.renderProducts(products);
      this.renderArticles(articles);
    }).catch(error => {
      console.error('Could not load content data:', error);
    });
  }

  renderServices(services) {
    if (!this.elements.servicesGrid || !services) return;
    const limit = parseInt(this.elements.servicesGrid.dataset.limit || services.length, 10);
    services.slice(0, limit).forEach(service => {
      const cardWrapper = this.createServiceCard(service);
      this.elements.servicesGrid.appendChild(cardWrapper);
    });
  }

  // New: Render homepage teaser list (links only)
  renderServicesTeaser(services) {
    const list = this.elements.servicesList;
    if (!list || !services) return;
    const previewCount = parseInt(list.dataset.previewCount || '4', 10);

    // Ensure empty before rendering (avoid duplicates on SPA-like nav)
    list.innerHTML = '';

    services.slice(0, previewCount).forEach(svc => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      const slug = this.slugify(svc.title);
      const target = `services.html#service-${slug}`;
      const href = (typeof window !== 'undefined' && typeof window.buildURL === 'function')
        ? window.buildURL(target)
        : target;
      a.href = href;
      a.textContent = svc.title;
      a.className = 'service-link';
      a.setAttribute('aria-label', `Jump to ${svc.title} on services page`);
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  // New: Render full list of all services as title links to exact anchors on services page
  renderAllServiceLinks(services) {
    const list = this.elements.servicesAllList;
    if (!list || !services) return;
    list.innerHTML = '';
    services.forEach(svc => {
      const li = document.createElement('li');
      const slug = this.slugify(svc.title);
      const href = (typeof window !== 'undefined' && typeof window.buildURL === 'function')
        ? window.buildURL(`services.html#service-${slug}`)
        : `services.html#service-${slug}`;
      const a = document.createElement('a');
      a.href = href;
      a.textContent = svc.title;
      a.className = 'service-link';
      a.setAttribute('aria-label', `Jump to ${svc.title} on services page`);
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  createServiceCard(service) {
    const card = document.createElement('article');
    card.className = 'card';
    // expose category for filtering on services page
    if (service.category) {
      card.dataset.category = service.category;
    }
    // Build wrapper <section> with a stable id for deep-linking
    const slug = this.slugify(service.title);
    const wrapper = document.createElement('section');
    wrapper.className = 'service-section';
    wrapper.id = `service-${slug}`;

    const grid = this.elements?.servicesGrid;
    const showTags = !(grid && grid.dataset && grid.dataset.showTags === 'false');
    const tagText = this.escapeHtml(service.category || service.tag || 'Service');

    card.innerHTML = `
      ${showTags ? `<span class="tag">${tagText}</span>` : ''}
      <h3>${this.escapeHtml(service.title)}</h3>
      <p>${this.escapeHtml(service.desc)}</p>
      <div style="margin-top: auto">
        <a class="btn btn-outline" href="#contact" aria-label="Contact about ${this.escapeHtml(service.title)}">
          Inquire
        </a>
      </div>
    `;

    wrapper.appendChild(card);
    return wrapper;
  }

  createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <span class="tag">Product</span>
      <h3>${this.escapeHtml(product.title)}</h3>
      <p>${this.escapeHtml(product.desc)}</p>
      <div style="margin-top: auto">
        <span class="price">${this.escapeHtml(product.price)}</span>
        <a class="btn btn-outline" href="#contact" aria-label="Inquire about ${this.escapeHtml(product.title)}">
          Buy
        </a>
      </div>
    `;
    return card;
  }

  createArticleItem(article) {
    const item = document.createElement('article');
    item.className = 'article-item';
    
    const date = new Date(article.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Use a single stable id for aria-describedby <-> description association
    const descId = `article-${this.generateId()}`;

    item.innerHTML = `
      <h3>
        <a href="${this.escapeHtml(article.href)}" aria-describedby="${descId}">
          ${this.escapeHtml(article.title)}
        </a>
      </h3>
      <p id="${descId}">${this.escapeHtml(article.desc)}</p>
      <time datetime="${article.date}">${date}</time>
    `;
    return item;
  }

  updateYear() {
    if (this.elements.yearElement) {
      this.elements.yearElement.textContent = new Date().getFullYear();
    }
  }

  // After services are injected, honor URL hash anchors like #service-xyz
  scrollToHashIfNeeded() {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    // Only act for service sections or existing ids
    const target = document.getElementById(id);
    if (!target) return;

    // Defer a tick to ensure layout is ready
    requestAnimationFrame(() => {
      // Use native scroll with CSS scroll-margin-top in styles
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      // Optional: move focus to heading for accessibility if present
      const heading = target.querySelector('h3, h2, h1, [tabindex]');
      if (heading && typeof heading.focus === 'function') {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    });
  }

  // Utility methods
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // New: slugify titles for stable anchor ids
  slugify(text) {
    return String(text)
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export { ContentManager };
