import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Split heading text into individual <span class="char"> elements.
 */
function splitTextIntoChars(el) {
  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text);

  const words = text.split(' ');

  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.classList.add('word');

    for (const char of word) {
      const charSpan = document.createElement('span');
      charSpan.classList.add('char');
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
    }

    el.appendChild(wordSpan);

    if (wordIndex < words.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.classList.add('char', 'space');
      spaceSpan.innerHTML = '&nbsp;';
      el.appendChild(spaceSpan);
    }
  });
}

/**
 * Build a paused timeline for section content animations.
 */
function buildContentTimeline(section) {
  const chars = section.querySelectorAll('.messy-heading .char');
  const paragraph = section.querySelector('.messy-paragraph');
  const label = section.querySelector('.messy-label');
  const doodles = section.querySelectorAll('.doodle');
  const doodlePaths = section.querySelectorAll('.doodle path, .doodle ellipse');

  const tl = gsap.timeline({ paused: true });

  if (label) {
    tl.fromTo(label,
      { opacity: 0, scale: 0.8 },
      { opacity: 0.06, scale: 1, duration: 0.6, ease: 'power2.out' },
      0
    );
  }

  if (chars.length) {
    tl.fromTo(chars,
      { opacity: 0, y: 40, rotateX: -90, scale: 0.6 },
      {
        opacity: 1, y: 0, rotateX: 0, scale: 1,
        duration: 0.7,
        ease: 'back.out(1.7)',
        stagger: { amount: 0.5, from: 'start' }
      },
      0.1
    );
  }

  if (paragraph) {
    tl.fromTo(paragraph,
      { opacity: 0, y: 30 },
      { opacity: 0.8, y: 0, duration: 0.8, ease: 'power3.out' },
      0.4
    );
  }

  if (doodles.length) {
    tl.fromTo(doodles,
      { opacity: 0 },
      { opacity: 0.5, duration: 0.6, ease: 'power2.out', stagger: 0.1 },
      0.5
    );
  }

  if (doodlePaths.length) {
    tl.to(doodlePaths,
      { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.1 },
      0.5
    );
  }

  return tl;
}

export function initMessyStackingSections(options = {}) {
  const rotationIntensity = options.rotationIntensity !== undefined ? options.rotationIntensity : 1;
  const sections = gsap.utils.toArray('.messy-section');
  
  if (sections.length === 0) return;

  // ── Lenis smooth scroll ──
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5
  });

  // Sync Lenis → ScrollTrigger (single source of truth)
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ── Split headings into chars ──
  sections.forEach(section => {
    const heading = section.querySelector('[data-split]');
    if (heading) splitTextIntoChars(heading);
  });

  // Deterministic rotations (consistent across refreshes)
  const rotations = sections.map((_, index) => {
    if (index === 0) return 0;
    const isEven = index % 2 === 0;
    const angle = 4 + (index * 3.7 % 8);
    return angle * (isEven ? 1 : -1) * rotationIntensity;
  });

  // Build content timelines
  const contentTimelines = sections.map(section => buildContentTimeline(section));

  // Track current viewport height (updated on resize)
  let vh = window.innerHeight;
  const resizeHandler = () => { vh = window.innerHeight; };
  window.addEventListener('resize', resizeHandler);

  sections.forEach((section, index) => {

    // ── PIN ──
    ScrollTrigger.create({
      trigger: section,
      start: () => section.offsetHeight > vh ? 'bottom bottom' : 'top top',
      endTrigger: '.messy-stack-container',
      end: 'bottom bottom',
      pin: true,
      pinSpacing: false
    });

    // Section 0: no entrance animation, just play content
    if (index === 0) {
      gsap.delayedCall(0.3, () => contentTimelines[index].play());
      return;
    }

    // ── ENTRANCE ──
    // Set initial off-screen state
    gsap.set(section, { y: vh, rotation: rotations[index] });

    let contentPlayed = false;

    // Use scrub: true (NOT 0.6) — Lenis already handles smoothing.
    // Double-smoothing causes desync and jumping.
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        // Direct set — no tween interpolation, no invalidation issues
        gsap.set(section, {
          y: (1 - p) * vh,
          rotation: rotations[index] * (1 - p)
        });

        // Fire content animations when section is almost fully in
        if (p > 0.85 && !contentPlayed) {
          contentPlayed = true;
          contentTimelines[index].play();
        } else if (p < 0.2 && contentPlayed) {
          contentPlayed = false;
          contentTimelines[index].pause(0);
        }
      },
      onRefresh: () => {
        // Recalculate vh and reset position if not yet scrolled
        vh = window.innerHeight;
      }
    });
  });

  // ── a11y ──
  gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
    lenis.destroy();
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.set('.messy-section', { clearProps: 'all' });
    contentTimelines.forEach(tl => tl.progress(1));
  });

  // ── Viewer UI: dynamic height changes ──
  const messageHandler = (e) => {
    if (e.data && e.data.type === 'updateHeight') {
      const section = sections[e.data.index];
      if (section) {
        lenis.stop();
        lenis.scrollTo(0, { immediate: true });
        section.style.minHeight = e.data.height;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            lenis.start();
          });
        });
      }
    }
  };
  window.addEventListener('message', messageHandler);

  // Return cleanup method
  return {
    destroy: () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.set('.messy-section', { clearProps: 'transform,y,rotation' });
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('message', messageHandler);
    }
  };
}
