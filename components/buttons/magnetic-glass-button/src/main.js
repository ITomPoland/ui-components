import { gsap } from 'gsap';

export class MagneticGlassButton {
  constructor(element) {
    this.element = element;
    this.textElement = this.element.querySelector('.t-text');
    this.borderRect = this.element.querySelector('.t-border-rect');
    
    this.magnetStrength = 0.45;
    this.textStrength = 0.20;
    
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
    this.syncBorderRadius();
  }

  init() {
    this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.element.addEventListener('mouseleave', () => this.onMouseLeave());
    this.element.addEventListener('mouseenter', () => this.onMouseEnter());
  }

  syncBorderRadius() {
    if (!this.borderRect) return;
    const style = window.getComputedStyle(this.element);
    const radius = style.borderRadius;
    if (radius) {
      const radiusVal = parseInt(radius);
      this.borderRect.setAttribute('rx', radiusVal);
      this.borderRect.setAttribute('ry', radiusVal);
    }

    const rectWidth = this.element.offsetWidth;
    const rectHeight = this.element.offsetHeight;
    const perimeter = (rectWidth + rectHeight) * 2;
    this.borderRect.style.strokeDasharray = perimeter;
    
    // Set dashoffset only if element is not currently hovered
    if (!this.element.matches(':hover')) {
      this.borderRect.style.strokeDashoffset = perimeter;
    }
  }

  onMouseEnter() {
    this.syncBorderRadius();
  }

  onMouseMove(e) {
    const bounding = this.element.getBoundingClientRect();
    const x = e.clientX - bounding.left;
    const y = e.clientY - bounding.top;

    this.element.style.setProperty('--mx', `${x}px`);
    this.element.style.setProperty('--my', `${y}px`);

    if (this.prefersReducedMotion) return;

    const centerX = x - bounding.width / 2;
    const centerY = y - bounding.height / 2;

    gsap.to(this.element, {
      x: centerX * this.magnetStrength,
      y: centerY * this.magnetStrength,
      duration: 0.8,
      ease: "power3.out"
    });

    if (this.textElement) {
      gsap.to(this.textElement, {
        x: centerX * this.textStrength,
        y: centerY * this.textStrength,
        duration: 0.8,
        ease: "power3.out"
      });
    }
  }

  onMouseLeave() {
    if (this.borderRect) {
      const perimeter = parseFloat(this.borderRect.style.strokeDasharray);
      if (!isNaN(perimeter)) {
        this.borderRect.style.strokeDashoffset = perimeter;
      }
    }

    if (this.prefersReducedMotion) return;

    gsap.to(this.element, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.4)"
    });

    if (this.textElement) {
      gsap.to(this.textElement, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.4)"
      });
    }
  }
}
