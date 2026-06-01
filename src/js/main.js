import { gsap } from 'gsap';
import { initAudio, playPencilScratch, toggleMute } from './audio.js';
import { initDoodle } from './doodle.js';
import { renderComponents, initGridFilters } from './grid.js';
import { initAnimations } from './animations.js';

// Setup GSAP initial states
gsap.set('.base-left-page .page-content > *', { opacity: 0, y: 20 });
gsap.set('.flip-page .front .page-content > *', { opacity: 0, y: 20 });
gsap.set('#gridBookmarks .bookmark', { y: 20, opacity: 0 });

// Init Doodle Canvas
initDoodle();

// Init Swatches (Paper type)
const swatchBtns = document.querySelectorAll('.swatch-btn');
swatchBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const activeSwatch = document.querySelector('.swatch-btn.active');
    if (activeSwatch) activeSwatch.classList.remove('active');
    btn.classList.add('active');
    document.body.classList.remove('ruled-paper', 'graph-paper', 'blank-paper');
    document.body.classList.add(`${btn.dataset.paper}-paper`);
    playPencilScratch(500, 0.25, 0.035);
  });
});

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

// Init Audio toggle
const btnMute = document.getElementById('btnMute');
btnMute.addEventListener('click', () => {
  const isNowMuted = toggleMute();
  btnMute.classList.toggle('muted', isNowMuted);
  btnMute.textContent = isNowMuted ? '🔇' : '🔊';
  initAudio();
  if (!isNowMuted) {
    playPencilScratch(1500, 0.1, 0.02);
  }
});

// Initialize modules
initGridFilters();
renderComponents(false);
initAnimations();
