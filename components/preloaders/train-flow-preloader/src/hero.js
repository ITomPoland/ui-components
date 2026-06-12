/**
 * Hero Text Reveal
 * ----------------
 * Animates ONLY the "HERO" text. The background image is already visible —
 * it's the preloader's final image that expanded to fullscreen.
 *
 * Triggered by:
 *   'preloaderComplete' → cinematic mask-reveal entrance
 *   'preloaderSkipped'  → instant final state, no animation
 */

function initHeroAnimations(isSkipped = false) {
  const title = document.querySelector('.hero-title');
  const titleInner = document.querySelector('.hero-title-inner');

  if (!title || !titleInner) return;

  if (isSkipped) {
    gsap.set(title, { opacity: 1, letterSpacing: '0.02em' });
    gsap.set(titleInner, { y: '0%' });
    return;
  }

  // Hidden state — title is clipped below the mask
  gsap.set(title, { opacity: 1, letterSpacing: '0.35em' });
  gsap.set(titleInner, { y: '110%' });

  // Fast, snappy entrance — no noticeable delay after preloader ends
  const tl = gsap.timeline({ delay: 0.05 });

  // Mask-reveal: text slides up into view
  tl.to(titleInner, {
    y: '0%',
    duration: 0.9,
    ease: 'power4.out'
  }, 0);

  // Letter-spacing settles for premium typographic feel
  tl.to(title, {
    letterSpacing: '0.02em',
    duration: 1.2,
    ease: 'power3.out'
  }, 0);
}

// ── Event listeners ──
document.addEventListener('preloaderComplete', () => initHeroAnimations(false));
document.addEventListener('preloaderSkipped', () => initHeroAnimations(true));
