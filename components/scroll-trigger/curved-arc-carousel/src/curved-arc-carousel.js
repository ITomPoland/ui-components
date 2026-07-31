/**
 * Curved Arc Carousel - Javascript Logic
 * 
 * Uses parametric circular math to arrange and rotate cards along a virtual circle,
 * ensuring they never overlap by dynamically calculating the required angle gap.
 */

export function initCurvedArcCarousel() {
  // Check if GSAP and ScrollTrigger are loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger is missing. Please ensure they are loaded.');
    return;
  }

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  const DOM = {
    section: document.getElementById('arcCarouselSection'),
    pinWrapper: document.getElementById('arcCarouselPinWrapper'),
    svg: document.getElementById('arcSvg'),
    pathBg: document.getElementById('arcPathBg'),
    pathTicks: document.getElementById('arcPathTicks'),
    cardsContainer: document.getElementById('arcCardsContainer'),
    cards: gsap.utils.toArray('.arc-card')
  };

  if (!DOM.section || DOM.cards.length === 0) return;

  /* ========================================================
     EASY CONFIGURATION
     Change these values to customize the carousel.
     ======================================================== */
  const USER_SETTINGS = {
    // Gap between cards in pixels. 
    // Increase this value to push cards further apart.
    cardGapDesktop: 220, 
    cardGapMobile: 100,
    
    // Arc radius (controls how flat or curved the trajectory is)
    baseRadiusDesktop: 1800,
    baseRadiusMobile: 600,
  };

  // System Configuration state (internal)
  let config = {
    radius: 800,       // dynamically calculated
    angleStepRad: 0.3, // dynamically calculated
    scrollDistance: 3000,
    totalCards: DOM.cards.length
  };

  let scrollTriggerInstance = null;

  /**
   * Recalculates the system geometry based on the current viewport and actual card width.
   * This guarantees cards will physically separate and the SVG arc will perfectly match.
   */
  function calculateGeometry() {
    const w = window.innerWidth;
    
    // 1. Calculate dynamic fluid radius based on window width
    const radiusProgress = Math.max(0, Math.min(1, (w - 400) / (1920 - 400)));
    config.radius = USER_SETTINGS.baseRadiusMobile + (USER_SETTINGS.baseRadiusDesktop - USER_SETTINGS.baseRadiusMobile) * radiusProgress;

    // 2. Measure actual card width to guarantee no overlap
    const sampleCard = DOM.cards[0];
    const cardWidth = sampleCard.offsetWidth || (w < 768 ? 260 : 360);
    
    // We want physical arc length between cards = cardWidth + gap
    // Fluid gap calculation based on screen width
    const gapProgress = Math.max(0, Math.min(1, (w - 400) / (1440 - 400)));
    const gap = USER_SETTINGS.cardGapMobile + (USER_SETTINGS.cardGapDesktop - USER_SETTINGS.cardGapMobile) * gapProgress;
    const minArcLength = cardWidth + gap;
    
    // arc_length = radius * theta(radians) -> theta = arc_length / radius
    config.angleStepRad = minArcLength / config.radius;

    // 3. Setup the perfect SVG Full Circle
    const svgWidth = DOM.svg.clientWidth || w;
    const cx = svgWidth / 2;
    const cy = config.radius; // The geometric center of the circle is 'radius' down from the apex

    // Set circle attributes
    DOM.pathBg.setAttribute('cx', cx);
    DOM.pathBg.setAttribute('cy', cy);
    DOM.pathBg.setAttribute('r', config.radius);

    DOM.pathTicks.setAttribute('cx', cx);
    DOM.pathTicks.setAttribute('cy', cy);
    DOM.pathTicks.setAttribute('r', config.radius);

    // Apply pivot for SVG rotation so it matches the cards
    DOM.svg.style.transformOrigin = `${cx}px ${cy}px`;
  }

  /**
   * Positions a single card based on a specific angle (in radians)
   * Angle 0 = apex of the curve (top center)
   * Positive angle = Right side, Negative angle = Left side
   */
  function positionCard(card, angleRad, progress) {
    // Math: circle with center at (0, R)
    // x = R * sin(theta)
    // y = R - R * cos(theta) 
    const x = config.radius * Math.sin(angleRad);
    const y = config.radius - (config.radius * Math.cos(angleRad));
    
    // Rotate card to match tangent. Since circle tangent is parallel to the radius, 
    // rotation in degrees is simply angle in degrees.
    const rotationDeg = angleRad * (180 / Math.PI);

    // Apply slightly randomized tilt that resolves when centered
    // This gives the sketchbook paper a messy feel
    const randomTilt = parseFloat(card.dataset.tilt || 0);
    const finalRot = rotationDeg + (randomTilt * (1 - progress)); // tilt goes away at center

    // Visibility: fade out cards that go too far around the bend earlier so they don't get clipped by screen edges
    const absoluteAngleDeg = Math.abs(rotationDeg);
    let opacity = 1;
    if (absoluteAngleDeg > 55) opacity = 0;
    else if (absoluteAngleDeg > 35) opacity = 1 - ((absoluteAngleDeg - 35) / 20);

    gsap.set(card, {
      x: x - (card.offsetWidth / 2), // center horizontally
      y: y,
      rotation: finalRot,
      opacity: opacity
    });
  }

  /**
   * Initial Setup
   */
  function renderAtProgress(progress) {
    const maxSweep = (config.totalCards - 1) * config.angleStepRad;
    const currentCenterAngle = progress * maxSweep;

    DOM.cards.forEach((card, i) => {
      const angleRad = (i * config.angleStepRad) - currentCenterAngle;
      const localizedProgress = Math.max(0, 1 - (Math.abs(angleRad) / config.angleStepRad));
      positionCard(card, angleRad, localizedProgress);
    });

    // Rotate the entire SVG track to sync with the cards
    // Cards move left (negative angle) as progress increases, so the track should rotate left
    const rotationDeg = -currentCenterAngle * (180 / Math.PI);
    DOM.svg.style.transform = `rotate(${rotationDeg}deg)`;
  }

  function init() {
    DOM.cards.forEach(card => {
      card.dataset.tilt = (Math.random() * 8 - 4).toFixed(2);
    });

    calculateGeometry();

    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    config.scrollDistance = window.innerHeight * (config.totalCards * 0.8);
    
    // Force initial render before scroll trigger attaches
    renderAtProgress(0);

    let snapTimeout;
    let lastProgress = 0;
    let macroDirection = 1;

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: DOM.pinWrapper,
      start: 'top top',
      // Less scroll distance on mobile devices
      end: () => window.innerWidth < 1024 ? "+=1500" : "+=3000",
      pin: DOM.section, 
      pinSpacing: true,
      scrub: window.innerWidth < 1024 ? 0.3 : 0.5,
      // Custom magnetic snap system, compatible with smooth scrolling
      onUpdate: (self) => {
        // Track macro scroll direction, ignoring micro bounces
        if (Math.abs(self.progress - lastProgress) > 0.002) {
           macroDirection = self.progress > lastProgress ? 1 : -1;
        }
        lastProgress = self.progress;

        renderAtProgress(self.progress);

        clearTimeout(snapTimeout);
        snapTimeout = setTimeout(() => {
           // Don't snap if user is at the absolute start or end
           if (self.progress <= 0 || self.progress >= 1) return;

           const step = 1 / (config.totalCards - 1);
           const currentStepIndex = self.progress / step;
           const decimal = currentStepIndex % 1; // Decimal remainder
           
           let targetIndex;
           if (macroDirection === 1) {
              // Scroll down: if passed 15% of the way to the next card, snap to it
              // 
              targetIndex = decimal > 0.15 ? Math.ceil(currentStepIndex) : Math.floor(currentStepIndex);
           } else {
              // Scroll up: if scrolled back by 15%, snap to previous card
              targetIndex = decimal < 0.85 ? Math.floor(currentStepIndex) : Math.ceil(currentStepIndex);
           }
           
           targetIndex = Math.max(0, Math.min(config.totalCards - 1, targetIndex));
           const targetProgress = targetIndex * step;
           
           if (Math.abs(self.progress - targetProgress) < 0.005) return;

           const targetScroll = self.start + (targetProgress * (self.end - self.start));
           
           // Use native Lenis scrollTo if available to avoid fighting its render engine 
           // 
           if (window.lenis) {
              window.lenis.scrollTo(targetScroll, { 
                 duration: 1.2, 
                 easing: (t) => 1 - Math.pow(1 - t, 4) // Smooth easeOutQuart
              });
           } else {
              // Manual scroll animation fallback (no ScrollToPlugin required)
              const scrollProxy = { y: window.scrollY || document.documentElement.scrollTop };
              gsap.to(scrollProxy, {
                 y: targetScroll,
                 duration: 0.8,
                 ease: "power3.out",
                 onUpdate: () => window.scrollTo(0, scrollProxy.y)
              });
           }
        }, 150); // Wait a moment for scroll momentum to settle
      }
    });
  }

  let mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Debounced resize
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Save progress
        const p = scrollTriggerInstance ? scrollTriggerInstance.progress : 0;
        init();
        if (scrollTriggerInstance) {
           // Restore progress smoothly
           gsap.to(window, {
             scrollTo: scrollTriggerInstance.start + (p * config.scrollDistance),
             duration: 0
           });
        }
      }, 200);
    };

    window.addEventListener('resize', onResize);

    // Initialize
    init();

    return () => {
      window.removeEventListener('resize', onResize);
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      clearTimeout(resizeTimer);
    };
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    // Provide a static, accessible layout without heavy animations
    gsap.set(DOM.svg, { display: 'none' });
    gsap.set(DOM.cardsContainer, { position: 'relative', left: 0, width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '2rem 0' });
    gsap.set(DOM.cards, { position: 'relative', opacity: 1, width: '90%', maxWidth: '600px', transform: 'none' });
    const arcSystem = document.getElementById('arcSystem');
    if(arcSystem) gsap.set(arcSystem, { position: 'relative', height: 'auto', top: 0 });
    gsap.set(DOM.section, { height: 'auto', minHeight: '100vh' });
  });

  // Return a clean API to allow external configurators to update settings
  // without polluting this file with postMessage listeners
  return {
    updateConfig: (newConfig) => {
      let shouldReinit = false;
      
      if (newConfig.radius) {
         USER_SETTINGS.baseRadiusDesktop = newConfig.radius;
         USER_SETTINGS.baseRadiusMobile = newConfig.radius * (600 / 1800);
         shouldReinit = true;
      }
      if (newConfig.gap) {
         USER_SETTINGS.cardGapDesktop = newConfig.gap;
         USER_SETTINGS.cardGapMobile = newConfig.gap * (100 / 220);
         shouldReinit = true;
      }
      
      if (shouldReinit) {
         init();
      }
    }
  };
}
