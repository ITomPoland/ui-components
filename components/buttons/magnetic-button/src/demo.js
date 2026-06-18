import { MagneticButton } from './main.js';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.t-magnetic-btn').forEach(btn => {
    btn.__magneticButton = new MagneticButton(btn);
  });
});

window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'update-config') {
    const config = e.data.config;
    document.querySelectorAll('.t-magnetic-btn').forEach(btn => {
      if (btn.__magneticButton) {
        btn.__magneticButton.magnetStrength = config.magnetStrength;
        btn.__magneticButton.textStrength = config.textStrength;
      }
    });
    document.documentElement.style.setProperty('--t-btn-radius', config.borderRadius + 'px');
    document.documentElement.style.setProperty('--t-btn-bg', config.bgColor);
    document.documentElement.style.setProperty('--t-btn-color', config.textColor);
    document.documentElement.style.setProperty('--t-btn-hover-bg', config.hoverColor);
  }
});
