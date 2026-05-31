import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/ui-components/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        magneticButton: resolve(__dirname, 'components/magnetic-button/index.html')
        // Add future components here for production builds
      }
    }
  }
});
