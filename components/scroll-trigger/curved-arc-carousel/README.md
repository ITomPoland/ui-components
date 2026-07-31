# Curved Arc Carousel

A scroll-driven curved carousel component built with Vanilla JavaScript, GSAP, and ScrollTrigger. It places cards along a large circular arc, avoiding overlapping and adjusting dynamically based on screen width.

## Features

- **Math-driven positioning**: Cards are placed using trigonometry so they perfectly align along a circle.
- **Responsive**: Adjusts radius and spacing automatically for mobile devices.
- **Magnetic snap**: Smoothly snaps to the nearest card when you stop scrolling.
- **No dependencies**: Only requires GSAP and ScrollTrigger. No React/Vue/etc.
- **Accessible**: Respects user's `prefers-reduced-motion` settings.

## How to use

### 1. Installation

This component depends on **GSAP** and its **ScrollTrigger** plugin.

**Option A: Via NPM/Yarn (for bundlers like Vite/Webpack)**
```bash
npm install gsap
```

**Option B: Via CDN (for plain HTML files)**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

*(Optional)* The component automatically integrates with [Lenis](https://github.com/darkroomengineering/lenis) for incredibly smooth scrolling if `window.lenis` is detected on the page.

### 2. HTML Structure
Copy the HTML from `src/curved-arc-carousel.html`. The main structure looks like this:
```html
<section class="arc-carousel-section" id="arcCarouselSection">
  <div class="arc-system" id="arcSystem">
    <!-- SVG Track -->
    <svg class="arc-svg" id="arcSvg" preserveAspectRatio="none">
      <circle class="arc-path-bg" id="arcPathBg" />
      <circle class="arc-path-ticks" id="arcPathTicks" />
    </svg>
    <!-- Cards Container -->
    <div class="arc-cards-container" id="arcCardsContainer">
      <!-- Cards go here -->
    </div>
  </div>
</section>
```

### 3. CSS
Include `src/curved-arc-carousel.css`. You can customize the look using the variables at the top of the file, such as `--sk-bg` for background color or `--font-number-size` for the large background numbers.

### 4. JavaScript
Initialize the carousel in your main script:
```javascript
import { initCurvedArcCarousel } from './curved-arc-carousel.js';

document.addEventListener('DOMContentLoaded', () => {
  initCurvedArcCarousel();
});
```

You can tweak the core settings (like the gap between cards and the arc radius) directly inside the `USER_SETTINGS` object at the top of `curved-arc-carousel.js`.
