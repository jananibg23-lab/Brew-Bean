import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          menu: path.resolve(__dirname, 'menu.html'),
          coffee: path.resolve(__dirname, 'coffee.html'),
          food: path.resolve(__dirname, 'food.html'),
          desserts: path.resolve(__dirname, 'desserts.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          offers: path.resolve(__dirname, 'offers.html'),
          events: path.resolve(__dirname, 'events.html'),
          reservation: path.resolve(__dirname, 'reservation.html'),
          reviews: path.resolve(__dirname, 'reviews.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
