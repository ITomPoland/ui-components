# Messy Stacking Sections

A scroll-driven transition where full-screen sections stack on top of each other like carelessly tossed sheets of paper. Each incoming section slides in from below at a slight random angle, straightens out, and pins in place while the next one arrives.

**Built with:** GSAP ScrollTrigger + Lenis smooth scroll. Zero frameworks, pure vanilla JS.

---

## How It Works

### 1. HTML Structure

Wrap your sections inside a `.messy-stack-container`. Each section gets the `.messy-section` class and custom colors via CSS variables:

```html
<div class="messy-stack-container">
  <section class="messy-section" style="--bg-color: #0f0f0f; --text-color: #f8f9fa;">
    <div class="messy-content">
      <h2 class="messy-heading" data-split>Your Title</h2>
      <p class="messy-paragraph">Your content here.</p>
    </div>
  </section>
  <!-- Add as many sections as you want -->
</div>
```

- `--bg-color` and `--text-color` let you theme each section individually.
- `data-split` on a heading enables the kinetic letter-by-letter entrance animation.
- Sections can be any height — the engine adapts automatically.

### 2. CSS Essentials

- **`.messy-stack-container`** — clips horizontal overflow (rotated sections would cause scrollbars otherwise) and adds bottom padding so the last section stays pinned.
- **`.messy-section`** — `min-height: 100vh` ensures each section covers at least the full viewport. GPU-accelerated with `will-change: transform` and `backface-visibility: hidden`.
- **Fluid typography** — all font sizes, paddings, and doodle positions use `clamp()` for smooth scaling from 320px to any screen size. No breakpoints needed.

### 3. JavaScript Engine

The JS does three things:

1. **Lenis smooth scroll** — normalizes scroll speed across all browsers and devices. Connected to GSAP's ticker for frame-perfect sync.

2. **Pinning** — each section gets pinned via `ScrollTrigger.create()` with `pin: true` and `pinSpacing: false`. Short sections (≤100vh) pin at `top top`. Tall sections (>100vh) let you scroll their content first, then pin at `bottom bottom`.

3. **Entrance animation** — sections start positioned one viewport height below (`y: window.innerHeight`) with a random rotation. As you scroll, `onUpdate` maps scroll progress to position and rotation, bringing the section to `y: 0, rotation: 0`. Content animations (text, doodles) fire at 85% progress.

### 4. Content Animations (Optional)

These are demo extras — not required for the stacking engine:

- **Text splitting** — headings with `data-split` get split into `<span class="char">` elements and animate in with a staggered cascade (`back.out` easing).
- **SVG doodles** — decorative hand-drawn elements with `stroke-dashoffset` draw-in animation.
- **Section labels** — big semi-transparent numbers in the background.

You can remove all of these and just use the stacking engine with your own content.

---

## Installation

### 1. Install dependencies

```bash
npm install gsap lenis
```

### 2. Copy the files

Copy these three files into your project:

- `messy-stacking-sections.html` — the HTML structure
- `messy-stacking-sections.css` — styles and fluid responsive layout
- `messy-stacking-sections.js` — the stacking engine + Lenis + animations

### 3. Initialize

```js
import { initMessyStackingSections } from './messy-stacking-sections.js';

document.addEventListener('DOMContentLoaded', () => {
  initMessyStackingSections();
});
```

That's it. The function finds all `.messy-section` elements inside `.messy-stack-container` and sets everything up automatically.

---

## Customization

### Adding/removing sections
Just add or remove `<section class="messy-section">` elements. The engine loops through all of them automatically.

### Changing colors
Set `--bg-color` and `--text-color` as inline styles on each section:
```html
<section class="messy-section" style="--bg-color: #ff6b6b; --text-color: #fff;">
```

### Tall sections
Sections grow with their content. If a section is taller than the viewport (e.g., lots of text on mobile), the user scrolls through it normally. The next section only appears after reaching the bottom.

### Disabling content animations
Remove `data-split` from headings and `.doodle` SVGs. The stacking engine works independently.

---

## Accessibility

- **Reduced motion** — automatically detected via `prefers-reduced-motion: reduce`. All animations are killed, Lenis is destroyed, and content is shown immediately in its final state.
- **Screen readers** — split headings preserve the full text via `aria-label`.
- **Keyboard navigation** — native scroll behavior is preserved by Lenis.

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires ES modules support.
