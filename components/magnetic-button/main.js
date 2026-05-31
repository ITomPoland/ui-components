import gsap from 'gsap';

export class MagneticButton {
  constructor(element) {
    this.element = element;
    this.textElement = this.element.querySelector('.t-text');
    
    // Config
    this.magnetStrength = 0.5; // How strongly it follows cursor
    this.textStrength = 0.2;   // How strongly text moves
    
    this.init();
  }

  init() {
    this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.element.addEventListener('mouseleave', () => this.onMouseLeave());
  }

  onMouseMove(e) {
    const bounding = this.element.getBoundingClientRect();
    
    // Calculate distance from center of the button
    const x = e.clientX - bounding.left - bounding.width / 2;
    const y = e.clientY - bounding.top - bounding.height / 2;

    // Animate button
    gsap.to(this.element, {
      x: x * this.magnetStrength,
      y: y * this.magnetStrength,
      duration: 1,
      ease: "power3.out"
    });

    // Animate inner text slightly for parallax
    if (this.textElement) {
      gsap.to(this.textElement, {
        x: x * this.textStrength,
        y: y * this.textStrength,
        duration: 1,
        ease: "power3.out"
      });
    }
  }

  onMouseLeave() {
    // Reset to original position
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
  }
}

// Auto-initialize for demo preview purposes
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.t-magnetic-btn').forEach(btn => {
    new MagneticButton(btn);
  });
});
