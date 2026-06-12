import { gsap } from 'gsap';
import { renderComponents, initGridFilters } from './grid.js';
import { initAnimations } from './animations.js';

// Setup GSAP initial states
gsap.set(['#gridBookmarks .bookmark', '#leftBookmarks .bookmark'], { y: '1.25rem', opacity: 0 });



// Init Sponsor Button Animation
const sponsorBtn = document.querySelector('.sponsor-btn');
if (sponsorBtn) {
  sponsorBtn.addEventListener('mouseenter', () => {
    gsap.to(sponsorBtn, { 
      rotateX: 15, rotateY: -15, rotation: 0, scale: 1.08, 
      transformPerspective: 500, duration: 0.4, ease: "power2.out",
      boxShadow: "8px 8px 0px var(--text-ink)"
    });
  });
  sponsorBtn.addEventListener('mouseleave', () => {
    gsap.to(sponsorBtn, { 
      rotateX: 0, rotateY: 0, rotation: 2, scale: 1, 
      duration: 0.6, ease: "elastic.out(1, 0.4)",
      boxShadow: "4px 4px 0px var(--text-ink)"
    });
  });
}

// Initialize modules
initGridFilters();
renderComponents(false);
initAnimations();
