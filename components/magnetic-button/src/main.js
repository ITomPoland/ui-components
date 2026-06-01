import gsap from 'gsap';
export class MagneticButton {
  constructor(element) {
    this.element = element;
    this.element.__magneticButton = this;
    this.textElement = this.element.querySelector('.t-text');
    this.hoverCircle = this.element.querySelector('.t-hover-circle');
    this.magnetStrength = 0.5;
    this.textStrength = 0.2;  
    this.init();
  }
  init() {
    this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.element.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
    this.element.addEventListener('mouseenter', (e) => this.onMouseEnter(e));
  }
  onMouseEnter(e) {
    if (!this.hoverCircle) return;
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.hoverCircle.style.left = `${x}px`;
    this.hoverCircle.style.top = `${y}px`;
    gsap.to(this.hoverCircle, {
      width: rect.width * 2.5,
      height: rect.width * 2.5,
      duration: 0.5,
      ease: "power2.out"
    });
  }
  onMouseMove(e) {
    const bounding = this.element.getBoundingClientRect();
    const x = e.clientX - bounding.left - bounding.width / 2;
    const y = e.clientY - bounding.top - bounding.height / 2;
    gsap.to(this.element, {
      x: x * this.magnetStrength,
      y: y * this.magnetStrength,
      duration: 1,
      ease: "power3.out"
    });
    if (this.textElement) {
      gsap.to(this.textElement, {
        x: x * this.textStrength,
        y: y * this.textStrength,
        duration: 1,
        ease: "power3.out"
      });
    }
  }
  onMouseLeave(e) {
    gsap.to(this.element, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.3)"
    });
    if (this.textElement) {
      gsap.to(this.textElement, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      });
    }
    if (this.hoverCircle) {
      const rect = this.element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(this.hoverCircle, {
        width: 0,
        height: 0,
        left: `${x}px`,
        top: `${y}px`,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.t-magnetic-btn').forEach(btn => {
    new MagneticButton(btn);
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
