// Ensure dependencies are loaded
if (typeof barba === 'undefined' || typeof gsap === 'undefined') {
  console.error('Barba.js or GSAP is not loaded. Please include them before this script.');
} else {

  // Prevent reloading when clicking links to the current page
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href === window.location.href) {
      e.preventDefault(); // Stop browser from reloading
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Just scroll to top
    }
  });

  barba.init({
    preventRunning: true,
    
    transitions: [{
      name: 'shrink-slide-transition',
      sync: true,
      
      before() {
        document.body.style.overflow = 'hidden';
      },
      
      after(data) {
        document.body.style.overflow = '';
        
        // A11y: Move focus to the new container for screen readers
        if (data.next && data.next.container) {
          data.next.container.focus();
        }
      },
      
      leave(data) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (reduceMotion) {
          return gsap.to(data.current.container, { opacity: 0, duration: 0.4 });
        }
        
        return gsap.to(data.current.container, {
          scale: window.tsConfig.scale,
          filter: `blur(${window.tsConfig.blur}px)`,
          opacity: 0.5,
          duration: window.tsConfig.duration,
          ease: 'power2.inOut'
        });
      },
      
      enter(data) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (reduceMotion) {
          gsap.set(data.next.container, { opacity: 0, yPercent: 0, scale: 1 });
          return gsap.to(data.next.container, { opacity: 1, duration: 0.4 });
        }
        
        gsap.set(data.next.container, {
          yPercent: 100,
          scale: 0.85,
          zIndex: 2
        });
        
        if (data.current.container) {
          gsap.set(data.current.container, { zIndex: 1 });
        }
        
        return gsap.to(data.next.container, {
          yPercent: 0,
          scale: 1,
          duration: window.tsConfig.duration,
          ease: 'power2.inOut'
        });
      }
    }]
  });
}

/* --- Sketchbook Live Preview Config --- */
window.tsConfig = {
  duration: 1.0,
  scale: 0.85,
  blur: 15,
  overlayColor: '#0f4c75'
};

window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'update-config') {
    window.tsConfig = event.data.config;
    document.documentElement.style.setProperty('--ts-overlay-bg', window.tsConfig.overlayColor);
  }
});
