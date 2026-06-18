import { LiquidButton } from './main.js';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.t-liquid-btn').forEach(btn => {
    btn.__liquidButton = new LiquidButton(btn);
  });
});

window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'update-config') {
    const config = e.data.config;
    document.querySelectorAll('.t-liquid-btn').forEach(btn => {
      if (btn.__liquidButton) {
        btn.__liquidButton.gooeyStrength = config.gooeyStrength;
        btn.__liquidButton.speed = config.speed;
      }
    });

    const filter = document.querySelector('#t-gooey-effect feColorMatrix');
    if (filter) {
      filter.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${config.gooeyStrength} -9`);
    }

    document.documentElement.style.setProperty('--t-btn-radius', config.borderRadius + 'px');
    document.documentElement.style.setProperty('--t-btn-bg', config.bgColor);
    document.documentElement.style.setProperty('--t-btn-color', config.textColor);
    document.documentElement.style.setProperty('--t-blob-color', config.blobColor);
  }
});
