import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import fs from 'fs';

// Scan the components directory to automatically include all index.html and preview.html files
const componentsDir = resolve(__dirname, 'components');
const componentFolders = fs.readdirSync(componentsDir).filter(f => fs.statSync(join(componentsDir, f)).isDirectory());

const input = {
  main: resolve(__dirname, 'index.html'),
};

componentFolders.forEach(folder => {
  const indexFile = join(componentsDir, folder, 'index.html');
  const previewFile = join(componentsDir, folder, 'preview.html');
  
  if (fs.existsSync(indexFile)) {
    // e.g. 'magnetic-button-index'
    input[`${folder}-index`] = indexFile;
  }
  if (fs.existsSync(previewFile)) {
    // e.g. 'magnetic-button-preview'
    input[`${folder}-preview`] = previewFile;
  }
});

export default defineConfig({
  base: '/ui-components/',
  build: {
    rollupOptions: {
      input
    }
  }
});
