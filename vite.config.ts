import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  base: '/JustUselessCode.github.io/', // MUST match your GitHub repo name exactly
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});