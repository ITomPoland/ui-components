# Shrink & Slide Page Transition

A modern, fluid page transition built with [Barba.js](https://barba.js.org/) and [GSAP](https://gsap.com/). When navigating, the current page shrinks and blurs into the background, while the new page slides up smoothly from the bottom of the screen.

## How It Works (For Beginners)

When you use traditional links (`<a href="...">`), the browser completely reloads the page. You see a white flash, and all animations reset. 

**Barba.js** prevents this. Instead of a full reload, Barba intercepts your link clicks, fetches the next page in the background, and seamlessly swaps only the content you specify. 

To make this work, **every page on your website** needs a specific HTML structure. Barba needs a persistent "wrapper" that never leaves the screen, and a "container" inside it that gets replaced.

## Step-by-Step Implementation

### 1. The HTML Structure

You need at least two pages to see a transition (e.g., `index.html` and `about.html`). Wrap your main content in both files using Barba's `data-barba` attributes.

**`index.html` (Home)**
```html
<!-- The wrapper stays on the screen forever -->
<div data-barba="wrapper" class="ts-wrapper">
  
  <!-- Navigation can go outside the container if you don't want it to animate -->
  <header class="ts-header">
    <nav>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
    </nav>
  </header>

  <!-- The container gets swapped out -->
  <main data-barba="container" data-barba-namespace="home" class="ts-container" style="background-color: #1a1a1a;">
    <h1>Home Page</h1>
  </main>
</div>
```

**`about.html` (About)**
Make sure this file has the exact same `wrapper` structure, but change the `namespace` and content!
```html
<div data-barba="wrapper" class="ts-wrapper">
  <!-- Same header -->
  <header class="ts-header">...</header>

  <!-- New container! Notice the namespace is 'about' -->
  <main data-barba="container" data-barba-namespace="about" class="ts-container" style="background-color: #0f4c75;">
    <h1>About Page</h1>
  </main>
</div>
```

### 2. The CSS

Copy the code from the **CSS** tab into your stylesheet. 

The secret to this effect is CSS Grid. By setting `display: grid` on the wrapper and `grid-area: 1 / 1` on the containers, we force the old page and the new page to perfectly overlap each other during the transition!

### 3. Include Dependencies

Before your main JavaScript file, include Barba.js and GSAP via CDN before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/@barba/core"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
```

### 4. The JavaScript Logic

Finally, copy the code from the **JS** tab into your main script file. 

This script tells Barba to use GSAP to animate the `leave` hook (the old page shrinking) and the `enter` hook (the new page sliding up) simultaneously (`sync: true`).

## Senior Dev Pro-Tips (Accessibility & Architecture)

To make this transition truly professional and production-ready, we included two crucial features:

1. **Accessibility (`prefers-reduced-motion`)**: Large swiping animations can trigger motion sickness. The JS code uses `window.matchMedia('(prefers-reduced-motion: reduce)')` to detect if the user has disabled OS animations. If so, it gracefully falls back to a simple, fast cross-fade.
2. **Screen Reader Focus**: When a page transitions without reloading, screen readers don't announce the change. By adding `tabindex="-1"` to our `<main>` container and calling `data.next.container.focus()` in the `after()` hook, we ensure visually impaired users know the page has updated.
3. **Script Re-initialization**: Remember, Barba.js only swaps the DOM container. It does **not** re-run `<script>` tags on the new page. If your new page has a slider or interactive element, you must manually re-initialize its logic inside the Barba `after` hook or using Barba Views!
