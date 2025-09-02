import { services, products, articles } from './data.js';
import { createServiceCard, createProductCard, createArticleItem } from './modules/components.js';
import { initAccessibility } from './modules/accessibility.js';
import { initContactForm } from './modules/form.js';

// Render dynamic content
const servicesGrid = document.getElementById('services-grid');
const productsGrid = document.getElementById('products-grid');
const articlesList = document.getElementById('articles-list');

services.forEach(s => servicesGrid.appendChild(createServiceCard(s)));
products.forEach(p => productsGrid.appendChild(createProductCard(p)));
articles.forEach(a => articlesList.appendChild(createArticleItem(a)));

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Responsive nav
const navToggle = document.getElementById('nav-toggle');
const navList = document.getElementById('nav-list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Modules
initAccessibility();
initContactForm();
