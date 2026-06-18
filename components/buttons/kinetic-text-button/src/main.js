import { gsap } from 'gsap';

export class KineticButton {
  constructor(element) {
    this.element = element;
    
    this.stagger = 0.02;
    this.duration = 0.45;
    
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.initDOM();
    this.initEvents();
  }

  initDOM() {
    const text = this.element.textContent.trim();
    this.element.innerHTML = '';
    
    const wrapper = document.createElement('span');
    wrapper.className = 't-char-wrapper';
    
    [...text].forEach(char => {
      if (char === ' ') {
        const space = document.createElement('span');
        space.className = 't-char-space';
        wrapper.appendChild(space);
      } else {
        const charContainer = document.createElement('span');
        charContainer.className = 't-char';
        
        const primary = document.createElement('span');
        primary.className = 't-char-primary';
        primary.textContent = char;
        
        const secondary = document.createElement('span');
        secondary.className = 't-char-secondary';
        secondary.textContent = char;
        
        charContainer.appendChild(primary);
        charContainer.appendChild(secondary);
        wrapper.appendChild(charContainer);
      }
    });
    
    this.element.appendChild(wrapper);
    this.primaries = wrapper.querySelectorAll('.t-char-primary');
    this.secondaries = wrapper.querySelectorAll('.t-char-secondary');
  }

  initEvents() {
    this.element.addEventListener('mouseenter', () => this.onMouseEnter());
    this.element.addEventListener('mouseleave', () => this.onMouseLeave());
  }

  onMouseEnter() {
    if (this.prefersReducedMotion) return;
    gsap.killTweensOf([this.primaries, this.secondaries]);
    
    gsap.to(this.primaries, {
      y: '-100%',
      rotation: -8,
      opacity: 0,
      stagger: this.stagger,
      duration: this.duration,
      ease: "power2.out"
    });
    
    gsap.fromTo(this.secondaries, 
      { y: '100%', rotation: 8, opacity: 0 },
      {
        y: '0%',
        rotation: 0,
        opacity: 1,
        stagger: this.stagger,
        duration: this.duration,
        ease: "power2.out"
      }
    );
  }

  onMouseLeave() {
    if (this.prefersReducedMotion) return;
    gsap.killTweensOf([this.primaries, this.secondaries]);
    
    gsap.to(this.primaries, {
      y: '0%',
      rotation: 0,
      opacity: 1,
      stagger: this.stagger,
      duration: this.duration,
      ease: "power2.out"
    });
    
    gsap.to(this.secondaries, {
      y: '100%',
      rotation: 8,
      opacity: 0,
      stagger: this.stagger,
      duration: this.duration,
      ease: "power2.out"
    });
  }
}
