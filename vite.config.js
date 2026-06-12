import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import fs from 'fs';

// Scan the components directory recursively to automatically include all index.html and preview.html files
const componentsDir = resolve(__dirname, 'components');
const input = {
  main: resolve(__dirname, 'index.html'),
};

function scanComponents(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      const indexFile = join(fullPath, 'index.html');
      const previewFile = join(fullPath, 'preview.html');
      
      if (fs.existsSync(indexFile) || fs.existsSync(previewFile)) {
        const relativeFolder = fullPath
          .replace(componentsDir + '\\', '')
          .replace(componentsDir + '/', '')
          .replace(/\\/g, '/');
        
        const keyBase = relativeFolder.replace(/\//g, '-');
        
        if (fs.existsSync(indexFile)) {
          input[`${keyBase}-index`] = indexFile;
        }
        if (fs.existsSync(previewFile)) {
          input[`${keyBase}-preview`] = previewFile;
        }
        // Include fullscreen preview pages if they exist
        const fullscreenFile = join(fullPath, 'fullscreen.html');
        if (fs.existsSync(fullscreenFile)) {
          input[`${keyBase}-fullscreen`] = fullscreenFile;
        }
      } else {
        scanComponents(fullPath);
      }
    }
  });
}

scanComponents(componentsDir);

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input
    }
  }
});
