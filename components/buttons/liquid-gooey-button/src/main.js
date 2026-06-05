import { gsap } from 'gsap';

export class LiquidButton {
  constructor(element) {
    this.element = element;
    this.element.__liquidButton = this;
    this.blobs = this.element.querySelectorAll('.t-blob');
    this.baseBlob = this.element.querySelector('.t-blob-base');
    this.floatingBlobs = this.element.querySelectorAll('.t-blob:not(.t-blob-base)');
    
    this.gooeyStrength = 10;
    this.speed = 0.5;
    
    this.init();
  }

  init() {
    this.element.addEventListener('mouseenter', () => this.onMouseEnter());
    this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.element.addEventListener('mouseleave', () => this.onMouseLeave());
  }

  onMouseEnter() {
    gsap.killTweensOf(this.blobs);
    
    // Scale up base blob to cover the main center area
    gsap.to(this.baseBlob, {
      scale: 2.2,
      duration: this.speed,
      ease: "power2.out"
    });
    
    // Stagger scaling for the external blobs to flow into place
    gsap.to(this.floatingBlobs, {
      scale: 1.8,
      stagger: 0.04,
      duration: this.speed + 0.1,
      ease: "power2.out"
    });
  }

  onMouseMove(e) {
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Apply minor parallax pull to text
    const text = this.element.querySelector('.t-text');
    if (text) {
      gsap.to(text, {
        x: x * 0.12,
        y: y * 0.12,
        duration: 0.3,
        ease: "power2.out"
      });
    }

    // Distort floating blobs based on cursor distance to create dynamic liquid stretch
    this.floatingBlobs.forEach((blob, index) => {
      const depth = (index + 1) * 0.08;
      gsap.to(blob, {
        x: x * depth,
        y: y * depth,
        duration: 0.4,
        ease: "power2.out"
      });
    });
  }

  onMouseLeave() {
    gsap.killTweensOf(this.blobs);
    
    // Reset all blobs to scale(0)
    gsap.to(this.blobs, {
      scale: 0,
      x: 0,
      y: 0,
      duration: this.speed,
      ease: "power3.inOut"
    });

    const text = this.element.querySelector('.t-text');
    if (text) {
      gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)"
      });
    }
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.t-liquid-btn').forEach(btn => {
    new LiquidButton(btn);
  });
});

// Connect code configuration overrides with Sketchbook UI preview controls
window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'update-config') {
    const config = e.data.config;
    document.documentElement.style.setProperty('--t-btn-bg', config.btnBg);
    document.documentElement.style.setProperty('--t-btn-radius', config.borderRadius + 'px');
    document.documentElement.style.setProperty('--t-btn-border-color', config.borderColor);
    document.documentElement.style.setProperty('--t-btn-color', config.textColor);
    document.documentElement.style.setProperty('--t-blob-color', config.blobColor);
    document.querySelectorAll('.t-liquid-btn').forEach(btn => {
      if (btn.__liquidButton) {
        btn.__liquidButton.speed = config.speed;
        
        // Update SVG filter standard deviation in real time
        const gaussianBlur = document.querySelector('#t-gooey-effect feGaussianBlur');
        if (gaussianBlur) {
          gaussianBlur.setAttribute('stdDeviation', config.gooeyStrength);
        }
      }
    });
  }
});
