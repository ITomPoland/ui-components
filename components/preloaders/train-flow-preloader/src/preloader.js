/**
 * Train Flow Preloader
 * --------------------
 * Animation phases:
 *   1. Fade-in  — ITOM text appears on the right
 *   2. Train    — text + images slide left as one unit
 *   3. Zoom     — hero image expands to fill viewport (covers trailing images via z-index)
 *   4. Handoff  — pixel-perfect swap to hero section (same image underneath)
 *
 * The hero image is identified by the [data-hero] attribute. If not present,
 * falls back to the last image. Trailing images after the hero keep sliding
 * but are naturally covered by the expanding hero.
 */

let activePreloaderTl = null;

function runPreloaderAnimation() {
  return new Promise(resolve => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (activePreloaderTl) {
      activePreloaderTl.kill();
      activePreloaderTl = null;
    }
    gsap.killTweensOf('*');

    const container = document.querySelector('.train-preloader-container');
    const marqueeContent = document.querySelector('.train-marquee-content');
    const images = Array.from(document.querySelectorAll('.train-img'))
      .filter(img => img.style.display !== 'none');

    if (!container || !marqueeContent || images.length === 0) {
      return resolve();
    }

    if (prefersReducedMotion) {
      gsap.set(container, { display: 'none' });
      return resolve();
    }

    document.fonts.ready.then(() => {
      // ── Identify the hero image ──
      const heroImage = images.find(img => img.hasAttribute('data-hero')) || images[images.length - 1];
      const heroIndex = images.indexOf(heroImage);
      const otherImages = images.filter((_, i) => i !== heroIndex);

      // Mark hero for z-index stacking (sits above all other train images)
      images.forEach(img => img.classList.remove('train-img-final'));
      heroImage.classList.add('train-img-final');

      // ── Layout calculations ──
      const isMobile = window.innerWidth <= 768;
      const cardSize = isMobile ? 200 : 300;
      const gap = isMobile ? 30 : 60;
      const edgePadding = isMobile ? 15 : 40;

      const vpW = document.documentElement.clientWidth;
      const vpH = document.documentElement.clientHeight;

      const textWidth = marqueeContent.getBoundingClientRect().width || (isMobile ? 150 : 350);

      // Position text so its RIGHT edge is flush with the RIGHT edge of the viewport.
      // All images start completely off-screen to the right.
      const startX = vpW / 2 - textWidth - edgePadding;
      const textCenterStart = startX + textWidth / 2;

      // Calculate travel so the HERO image (not necessarily the last) lands at center
      const heroCenterOffset = textWidth + gap + heroIndex * (cardSize + gap) + cardSize / 2;
      const totalTravel = startX + heroCenterOffset;

      // ── Reset all elements ──
      gsap.set(container, {
        visibility: 'visible',
        backgroundColor: 'var(--preloader-bg)',
        zIndex: 100
      });

      gsap.set(marqueeContent, {
        x: textCenterStart,
        xPercent: -50,
        yPercent: -50,
        opacity: 0
      });

      images.forEach((img, index) => {
        const offset = textWidth + gap + index * (cardSize + gap) + cardSize / 2;
        gsap.set(img, {
          x: startX + offset,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          rotation: 0,
          skewX: 0,
          opacity: 1,
          width: cardSize,
          height: cardSize,
          top: '50%',
          left: '50%',
          borderRadius: '0px'
        });
      });

      // ── Build master timeline ──
      activePreloaderTl = gsap.timeline();
      const tl = activePreloaderTl;

      // Timing constants (seconds)
      const FADE_DELAY = 0.2;
      const SLIDE_START = 0.7;
      const SLIDE_DUR = 4.5;
      const SLIDE_EASE = 'power3.inOut';
      const ZOOM_DUR = 2.0;
      const ZOOM_START = SLIDE_START + SLIDE_DUR - ZOOM_DUR;
      const SLIDE_END = SLIDE_START + SLIDE_DUR;

      // ── Phase 1: Fade in ITOM text ──
      tl.to(marqueeContent, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      }, FADE_DELAY);

      // ── Phase 2: Train lockstep slide ──
      // Text slides
      tl.to(marqueeContent, {
        x: textCenterStart - totalTravel,
        duration: SLIDE_DUR,
        ease: SLIDE_EASE
      }, SLIDE_START);

      // ALL images slide in sync (including trailing ones after hero)
      images.forEach((img, index) => {
        const offset = textWidth + gap + index * (cardSize + gap) + cardSize / 2;
        const endX = (startX + offset) - totalTravel;

        tl.to(img, {
          x: endX,
          duration: SLIDE_DUR,
          ease: SLIDE_EASE
        }, SLIDE_START);
      });

      // ── Phase 3: Hero image zoom to fullscreen ──
      // Hero z-index is highest, so it naturally covers trailing images as it expands
      tl.to(heroImage, {
        width: vpW,
        height: vpH,
        duration: ZOOM_DUR,
        ease: 'power2.inOut'
      }, ZOOM_START);

      // Fade out text and all non-hero images (including trailing ones behind the hero)
      tl.to([marqueeContent, ...otherImages], {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, ZOOM_START + 0.4);

      // NOTE: Container background stays OPAQUE until zoom is fully complete.

      // ── Phase 4: Pixel-perfect handoff ──
      tl.set(heroImage, {
        top: 0,
        left: 0,
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        width: '100%',
        height: '100%'
      }, SLIDE_END);

      // One render frame later: hide container + dispatch event + resolve
      tl.call(() => {
        gsap.set(container, { visibility: 'hidden', zIndex: 0 });
        document.dispatchEvent(new Event('preloaderComplete'));
        resolve();
      }, null, SLIDE_END + 0.016);
    });
  });
}

// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', () => {
  const hasRun = sessionStorage.getItem('trainFlowPreloaderHasRun');

  if (!hasRun) {
    runPreloaderAnimation().then(() => {
      sessionStorage.setItem('trainFlowPreloaderHasRun', 'true');
    });
  } else {
    const container = document.querySelector('.train-preloader-container');
    if (container) gsap.set(container, { display: 'none' });
    document.dispatchEvent(new Event('preloaderSkipped'));
  }
});

// Expose for live-demo replay
window.runPreloaderAnimation = runPreloaderAnimation;
