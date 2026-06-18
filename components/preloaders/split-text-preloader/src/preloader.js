let activePreloaderTl = null;

function runPreloaderAnimation() {
  return new Promise(resolve => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Kill any existing GSAP timelines and tweens if we are restarting
    if (activePreloaderTl) {
      activePreloaderTl.kill();
    }
    gsap.killTweensOf('*');
    
    const container = document.querySelector('.split-hero-container');
    const fullText = document.querySelector('.split-word-full');
    const topText = document.querySelector('.split-word-top');
    const bottomText = document.querySelector('.split-word-bottom');
    const montageContainer = document.querySelector('.montage-container');
    // Only select images that are actually active/visible
    const images = Array.from(document.querySelectorAll('.montage-img')).filter(img => img.style.display !== 'none');

    if(!container || !topText) return resolve();

    if (prefersReducedMotion) {
      gsap.set(container, { display: 'none' });
      return resolve();
    }

    // Initialization (Reset states for replayability)
    gsap.set(container, { visibility: "visible", backgroundColor: "var(--preloader-bg)", zIndex: 9999 });
    gsap.set([fullText, topText, bottomText], { scale: 0.9, opacity: 0, y: "0vh" });
    gsap.set(montageContainer, { width: "0vw", height: "0vh", opacity: 0, xPercent: -50, yPercent: -50, force3D: true });
    gsap.set(images, { opacity: 0 });

    activePreloaderTl = gsap.timeline({ defaults: { ease: "power4.inOut" }, onComplete: resolve });
    const tl = activePreloaderTl;

    // Fade in FULL text first (it doesn't have the clip-path subpixel gap)
    tl.to(fullText, { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.5);
    
    // Scale top/bottom text invisibly in the background so they are ready
    tl.to([topText, bottomText], { scale: 1, duration: 1.2, ease: "power3.out" }, 0.5);

    // At the exact moment they split, swap the full text for the clipped halves
    tl.set(fullText, { opacity: 0 }, 2.0);
    tl.set([topText, bottomText], { opacity: 1 }, 2.0);

    tl.to(topText, { y: "-15vh", duration: 1.4 }, 2.0);
    tl.to(bottomText, { y: "15vh", duration: 1.4 }, 2.0);
    tl.to(montageContainer, { opacity: 1, width: "40vw", height: "22vh", duration: 1.4, force3D: true }, 2.0);

    const totalImages = images.length;
    images.forEach((img, index) => {
      if (index === 0) tl.set(img, { opacity: 1 }, 2.0);
      else tl.to(img, { opacity: 1, duration: 0 }, 2.4 + (index * 0.12));
    });

    const scaleUpStart = 2.4 + (totalImages * 0.12) + 0.3;

    tl.to(montageContainer, { width: "100vw", height: "100vh", borderRadius: "0px", duration: 1.5, force3D: true }, scaleUpStart);
    tl.to(topText, { y: "-38vh", duration: 1.5 }, scaleUpStart);
    tl.to(bottomText, { y: "38vh", duration: 1.5 }, scaleUpStart);

    // Drop z-index early so the Hero text can appear ON TOP of the expanding image
    tl.set(container, { zIndex: 0 }, scaleUpStart);
    
    // Resolve the promise early (0.9s after expansion starts) to trigger the Hero text animation
    tl.add(resolve, scaleUpStart + 0.9);

    // Fade out preloader background AFTER the image finishes expanding (prevents black background flashing on edges)
    tl.to(container, { backgroundColor: "transparent", duration: 0.5 }, scaleUpStart + 1.5);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const hasRun = sessionStorage.getItem('splitHeroPreloaderHasRun');
  
  if (!hasRun) {
    // First visit: run animation, then dispatch custom event
    runPreloaderAnimation().then(() => {
      sessionStorage.setItem('splitHeroPreloaderHasRun', 'true');
      document.dispatchEvent(new Event('preloaderComplete'));
    });
  } else {
    // Subsequent visits: hide preloader instantly, dispatch skip event
    const container = document.querySelector('.split-hero-container');
    if (container) {
      gsap.set(container, { display: 'none' });
    }
    document.dispatchEvent(new Event('preloaderSkipped'));
  }
});

// Expose for live demo config updates
window.runPreloaderAnimation = runPreloaderAnimation;
