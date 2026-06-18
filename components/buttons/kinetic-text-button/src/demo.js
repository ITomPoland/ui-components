import { KineticButton } from './main.js';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.t-kinetic-btn').forEach(btn => {
    btn.__kineticButton = new KineticButton(btn);
  });
});

window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'update-config') {
    const config = e.data.config;
    document.documentElement.style.setProperty('--t-btn-bg', config.btnBg);
    document.documentElement.style.setProperty('--t-btn-border-color', config.borderColor);
    document.documentElement.style.setProperty('--t-btn-color', config.textColor);
    document.documentElement.style.setProperty('--t-hover-bg', config.hoverBg);
    document.documentElement.style.setProperty('--t-hover-color', config.hoverColor);
    document.documentElement.style.setProperty('--t-btn-radius', config.borderRadius + 'px');

    document.querySelectorAll('.t-kinetic-btn').forEach(btn => {
      if (btn.__kineticButton) {
        btn.__kineticButton.stagger = config.stagger;
        btn.__kineticButton.duration = config.duration;
      }
    });
  }
});
