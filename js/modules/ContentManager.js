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
      productsGrid: document.getElementById('products-grid'),
      articlesList: document.getElementById('articles-list'),
      yearElement: document.getElementById('year')
    };
  }

  renderContent() {
    // Import data dynamically
    import('../data.js').then(({ services, products, articles }) => {
      this.renderServices(services);
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
      const card = this.createServiceCard(service);
      this.elements.servicesGrid.appendChild(card);
    });
  }

  renderProducts(products) {
    if (!this.elements.productsGrid || !products) return;
    const limit = parseInt(this.elements.productsGrid.dataset.limit || products.length, 10);
    products.slice(0, limit).forEach(product => {
      const card = this.createProductCard(product);
      this.elements.productsGrid.appendChild(card);
    });
  }

  renderArticles(articles) {
    if (!this.elements.articlesList || !articles) return;
    const limit = parseInt(this.elements.articlesList.dataset.limit || articles.length, 10);
    articles.slice(0, limit).forEach(article => {
      const item = this.createArticleItem(article);
      this.elements.articlesList.appendChild(item);
    });
  }

  createServiceCard(service) {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <span class="tag">${this.escapeHtml(service.tag || 'Service')}</span>
      <h3>${this.escapeHtml(service.title)}</h3>
      <p>${this.escapeHtml(service.desc)}</p>
      <div style="margin-top: auto">
        <a class="btn btn-outline" href="#contact" aria-label="Contact about ${this.escapeHtml(service.title)}">
          Inquire
        </a>
      </div>
    `;
    return card;
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

    item.innerHTML = `
      <h3>
        <a href="${this.escapeHtml(article.href)}" aria-describedby="article-${this.generateId()}">
          ${this.escapeHtml(article.title)}
        </a>
      </h3>
      <p id="article-${this.generateId()}">${this.escapeHtml(article.desc)}</p>
      <time datetime="${article.date}">${date}</time>
    `;
    return item;
  }

  updateYear() {
    if (this.elements.yearElement) {
      this.elements.yearElement.textContent = new Date().getFullYear();
    }
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
}

export { ContentManager };
