import { MagneticGlassButton } from './main.js';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.t-glass-btn').forEach(btn => {
    btn.__magneticGlass = new MagneticGlassButton(btn);
  });
});

window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'update-config') {
    const config = e.data.config;
    document.documentElement.style.setProperty('--t-btn-bg', config.btnBg);
    document.documentElement.style.setProperty('--t-btn-border-color', config.borderColor);
    document.documentElement.style.setProperty('--t-btn-color', config.textColor);
    document.documentElement.style.setProperty('--t-glow-color', config.glowColor);
    document.documentElement.style.setProperty('--t-border-draw-color', config.borderDrawColor);
    document.documentElement.style.setProperty('--t-btn-radius', config.borderRadius + 'px');

    document.querySelectorAll('.t-glass-btn').forEach(btn => {
      if (btn.__magneticGlass) {
        btn.__magneticGlass.magnetStrength = config.magnetStrength;
        btn.__magneticGlass.textStrength = config.textStrength;
        btn.__magneticGlass.syncBorderRadius();
      }
    });
  }
});
