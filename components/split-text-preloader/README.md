# Split Text Preloader

This component demonstrates an enterprise-grade, completely decoupled architecture. The **Preloader** is entirely separated from the **Hero** content. They communicate purely through native JavaScript Custom Events, preventing spaghetti code and ensuring they can be dropped into large codebases independently.

## 1. HTML Structure

Copy the HTML into their respective layout locations.

**Preloader HTML (`src/preloader.html`)**
This should be placed at the very top of your DOM (e.g. just inside `<body>`), so it sits above your website.

**Hero HTML (`src/hero.html`)**
This represents your actual website's hero section.

## 2. CSS Architecture

The styles are fully modular. 
- **`src/preloader.css`** handles the fixed overlay, blending modes, and image montage.
- **`src/hero.css`** handles the typography and layout of the page underneath.

*Note: Be sure to set `body { margin: 0; overflow: hidden; }` globally if you want a true full-screen experience.*

## 3. JavaScript Logic (Decoupled)

We use a Custom Event architecture. The preloader runs its animation and then "announces" to the rest of the application that it's done.

**1. `src/preloader.js`:**
Handles the GSAP animation and Session Storage. It checks if the user has visited already.
- If it's a first visit, it plays the animation and dispatches a `preloaderComplete` event.
- If it's a subsequent visit, it hides itself instantly and dispatches a `preloaderSkipped` event.

**2. `src/hero.js`:**
Your hero section (or any other component on your page) simply listens for these events. It knows exactly *when* to animate in, but it has zero knowledge of *how* the preloader works.

```javascript
// Inside your hero or page logic
document.addEventListener('preloaderComplete', () => {
   // Animate hero text in smoothly
});

document.addEventListener('preloaderSkipped', () => {
   // Preloader was bypassed, animate hero text immediately
});
```

### Why this architecture?
If you are building a massive application, you do not want your Hero component to be tightly coupled to your Preloader. By splitting them into `preloader.css`/`preloader.js` and `hero.css`/`hero.js`, you achieve perfect modularity.
