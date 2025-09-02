export function createServiceCard(service) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <span class="tag">${service.tag ?? 'Service'}</span>
    <h3>${service.title}</h3>
    <p>${service.desc}</p>
    <div style="margin-top:auto">
      <a class="btn btn-outline" href="#contact" aria-label="Contact about ${service.title}">Inquire</a>
    </div>
  `;
  return card;
}

export function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <span class="tag">Product</span>
    <h3>${product.title}</h3>
    <p>${product.desc}</p>
    <p><strong>${product.price ?? ''}</strong></p>
    <div style="margin-top:auto">
      <a class="btn btn-outline" href="#contact" aria-label="Ask about ${product.title}">Ask</a>
    </div>
  `;
  return card;
}

export function createArticleItem(article) {
  const li = document.createElement('article');
  li.className = 'list-item';
  li.innerHTML = `
    <a href="${article.href}" aria-label="Read: ${article.title}">${article.title}</a>
    <p>${article.desc}</p>
    <small>${new Date(article.date).toLocaleDateString()}</small>
  `;
  return li;
}
