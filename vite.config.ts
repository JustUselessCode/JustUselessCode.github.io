import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  // Use a relative base so the build works when served from GitHub Pages
  // (or set to '/REPO_NAME/' if you host at username.github.io/REPO_NAME)
  base: './',
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});