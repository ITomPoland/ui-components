// Hero Logic
function initHeroAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroTitle = document.querySelector('.hero-title');
  
  if (heroTitle) {
    if (prefersReducedMotion) {
      gsap.set(heroTitle, { y: 0, opacity: 1 });
    } else {
      gsap.fromTo(heroTitle, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: "power4.out" });
    }
  }
}

// Decoupled architecture: Wait for the preloader to announce it has finished or been skipped
document.addEventListener('preloaderComplete', initHeroAnimations);
document.addEventListener('preloaderSkipped', initHeroAnimations);
