/**
 * Content Manager - Handles dynamic content rendering
 */

class ContentManager {
  constructor() {
    this.elements = {};
    this.isInitialized = false;
    // Ensure we don't attach duplicate listeners if called twice
    this._expandersSetupDone = false;
  }

  init() {
    if (this.isInitialized) return;

    this.cacheElements();
    // Setup JS fallback for hiding teasers before any async work
    this.setupExpandersToggle();
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
      // New: product teaser and full list on homepage
      productsList: document.getElementById('products-list'),
      productsAllList: document.getElementById('products-all-list'),
      // Articles teaser and expanded list
      articlesList: document.getElementById('articles-list'),
      articlesAllList: document.getElementById('articles-all-list'),
      // New: full articles grid on articles page
      articlesGrid: document.getElementById('articles-grid'),
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

      // New: products rendering similar to services
      this.renderProductsGrid(products);
      this.renderProductsTeaser(products);
      this.renderAllProductLinks(products);

      // Articles: full grid on Articles page, plus homepage teaser and full list links
      this.renderArticlesGrid(articles);
      this.renderArticlesTeaser(articles);
      this.renderAllArticleLinks(articles);

      // Ensure deep-link scrolling works after dynamic render (services/products/articles pages)
      this.scrollToHashIfNeeded();

      // Removed call to undefined legacy renderer to avoid runtime error
      // this.renderArticles(articles);
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

  // New: full products grid (on products page). Uses same grid element but ensures cards render with product details
  renderProductsGrid(products) {
    if (!this.elements.productsGrid || !products) return;
    const limitAttr = this.elements.productsGrid.dataset.limit;
    const limit = limitAttr ? parseInt(limitAttr, 10) : products.length;
    this.elements.productsGrid.innerHTML = '';
    products.slice(0, limit).forEach(product => {
      const card = this.createProductCard(product);
      this.elements.productsGrid.appendChild(card);
    });
  }

  // New: Render homepage product teaser list (links only)
  renderProductsTeaser(products) {
    const list = this.elements.productsList;
    if (!list || !products) return;
    const previewCount = parseInt(list.dataset.previewCount || '4', 10);
    list.innerHTML = '';

    products.slice(0, previewCount).forEach(prod => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      const slug = this.slugify(prod.title);
      const target = `products.html#product-${slug}`;
      const href = (typeof window !== 'undefined' && typeof window.buildURL === 'function')
        ? window.buildURL(target)
        : target;
      a.href = href;
      a.textContent = prod.title;
      a.className = 'service-link';
      a.setAttribute('aria-label', `Jump to ${prod.title} on orthopedic insoles page`);
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  // New: Render full list of all products as title links to exact anchors on products page
  renderAllProductLinks(products) {
    const list = this.elements.productsAllList;
    if (!list || !products) return;
    list.innerHTML = '';
    products.forEach(prod => {
      const li = document.createElement('li');
      const slug = this.slugify(prod.title);
      const href = (typeof window !== 'undefined' && typeof window.buildURL === 'function')
        ? window.buildURL(`products.html#product-${slug}`)
        : `products.html#product-${slug}`;
      const a = document.createElement('a');
      a.href = href;
      a.textContent = prod.title;
      a.className = 'service-link';
      a.setAttribute('aria-label', `Jump to ${prod.title} on orthopedic insoles page`);
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  // Articles: full grid on the Articles page
  renderArticlesGrid(articles) {
    const container = this.elements.articlesGrid;
    if (!container || !articles) return;
    container.innerHTML = '';
    articles.forEach(article => {
      const slug = (article.slug || String(article.title))
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const section = document.createElement('section');
      section.className = 'service-section';
      section.id = `article-${slug}`;
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <span class="tag">Article</span>
        <h3>${this.escapeHtml(article.title)}</h3>
        <div class="prose">${article.contentHtml || ''}</div>
      `;
      section.appendChild(card);
      container.appendChild(section);
    });
  }

  // Articles teaser
  renderArticlesTeaser(articles) {
    const list = this.elements.articlesList;
    if (!list || !articles) return;
    const previewCount = parseInt(list.dataset.previewCount || '4', 10);
    list.innerHTML = '';
    articles.slice(0, previewCount).forEach(a => {
      const li = document.createElement('li');
      const slug = this.slugify(a.slug || a.title);
      const href = (typeof window !== 'undefined' && typeof window.buildURL === 'function')
        ? window.buildURL(`articles.html#article-${slug}`)
        : `articles.html#article-${slug}`;
      const link = document.createElement('a');
      link.href = href;
      link.textContent = a.title;
      link.className = 'service-link';
      link.setAttribute('aria-label', `Jump to ${a.title} on articles page`);
      li.appendChild(link);
      list.appendChild(li);
    });
  }

  // All article links list
  renderAllArticleLinks(articles) {
    const list = this.elements.articlesAllList;
    if (!list || !articles) return;
    list.innerHTML = '';
    articles.forEach(a => {
      const li = document.createElement('li');
      const slug = this.slugify(a.slug || a.title);
      const href = (typeof window !== 'undefined' && typeof window.buildURL === 'function')
        ? window.buildURL(`articles.html#article-${slug}`)
        : `articles.html#article-${slug}`;
      const link = document.createElement('a');
      link.href = href;
      link.textContent = a.title;
      link.className = 'service-link';
      link.setAttribute('aria-label', `Jump to ${a.title} on articles page`);
      li.appendChild(link);
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
    const slug = this.slugify(product.title);
    // Wrap card in a section with stable id similar to services
    const wrapper = document.createElement('section');
    wrapper.className = 'service-section';
    wrapper.id = `product-${slug}`;

    // Support multiple images
    const sources = Array.isArray(product.images)
      ? product.images
      : (product.image ? [product.image] : []);
    const alts = Array.isArray(product.imagesAlt)
      ? product.imagesAlt
      : (product.imageAlt ? [product.imageAlt] : []);

    const hasMedia = sources.length > 0;

    const mediaHtml = hasMedia ? `
      <div class="product-media-grid" role="group" aria-label="${this.escapeHtml(product.title)} images">
        ${sources.map((src, idx) => `
          <figure class="product-media">
            <img src="${this.escapeHtml(src)}" alt="${this.escapeHtml(alts[idx] || product.title)}" />
          </figure>
        `).join('')}
      </div>
    ` : '';

    card.innerHTML = `
      <span class="tag">Orthopedic Insoles</span>
      <h3>${this.escapeHtml(product.title)}</h3>
      <div class="product-card ${hasMedia ? 'media-right' : ''}">
        <div class="product-text">
          <p>${this.escapeHtml(product.desc)}</p>
        </div>
        ${mediaHtml}
      </div>
      <div style="margin-top: auto">
        ${product.price ? `<span class="price">${this.escapeHtml(product.price)}</span>` : ''}
        <a class="btn btn-outline" href="#contact" aria-label="Inquire about ${this.escapeHtml(product.title)}">
          Inquire
        </a>
      </div>
    `;

    wrapper.appendChild(card);
    return wrapper;
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

  // JS fallback: hide teaser lists when corresponding <details> is open
  setupExpandersToggle() {
    if (this._expandersSetupDone) return;

    const setup = (sectionId, detailsSelector, teaserId, collapsedBtnSelector) => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      const details = section.querySelector(detailsSelector);
      const teaser = section.querySelector(`#${teaserId}`);
      const collapsedBtn = section.querySelector(collapsedBtnSelector);
      if (!details || !teaser) return;

      const apply = () => {
        const isOpen = details.open === true;
        teaser.hidden = !!isOpen; // hide teaser when open
        if (collapsedBtn) {
          if (isOpen) collapsedBtn.style.display = 'none';
          else collapsedBtn.style.removeProperty('display');
        }
      };

      apply();
      details.addEventListener('toggle', apply);
    };

    setup('services', '.services-expand', 'services-list', '.open-all-collapsed');
    setup('products', '.products-expand', 'products-list', '.open-all-products-collapsed');
    setup('articles', '.articles-expand', 'articles-list', '.open-all-articles-collapsed');

    this._expandersSetupDone = true;
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
