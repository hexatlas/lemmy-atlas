import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/.netlify/functions/': {
        target: 'http://localhost:8888', // Update with your Netlify Dev server port
        changeOrigin: true,
        rewrite: (path) => path.replace('/.netlify/functions/', ''),
      },
    },
  },
  plugins: [TanStackRouterVite(), react()],
});
