import { defineConfig } from 'vite';
import inject from 'vite-plugin-html-inject';

export default defineConfig({
  // For GitHub Pages: set base to '/<repo-name>/' or '/' for custom domain
  base: process.env.GITHUB_ACTIONS ? '/LisaCohenPhisio/' : '/',
  plugins: [
    inject()
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true
  }
});
