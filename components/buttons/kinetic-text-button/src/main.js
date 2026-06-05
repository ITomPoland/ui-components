import { gsap } from 'gsap';

export class KineticButton {
  constructor(element) {
    this.element = element;
    this.element.__kineticButton = this;
    
    this.stagger = 0.02;
    this.duration = 0.45;
    
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

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.t-kinetic-btn').forEach(btn => {
    new KineticButton(btn);
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
