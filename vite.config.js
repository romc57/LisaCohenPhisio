import { defineConfig } from 'vite';
import inject from 'vite-plugin-html-inject';
import { resolve } from 'path';

export default defineConfig({
  // Use relative paths to work both locally and on GitHub Pages
  base: './',
  plugins: [
    inject()
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        products: resolve(__dirname, 'products.html'),
        services: resolve(__dirname, 'services.html'),
        articles: resolve(__dirname, 'articles.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
