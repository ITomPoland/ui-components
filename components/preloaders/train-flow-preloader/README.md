# Train Flow Preloader

This component is a cinematic, fullscreen preloader inspired by Awwwards-winning sites. It is powered by the **GSAP (GreenSock)** animation engine and is based on three key phases:
1. A giant marquee text slides in from the right edge and moves left across the screen.
2. A train of images follows the text, sliding in lockstep.
3. The train decelerates, and the designated hero image expands to fill the entire screen, seamlessly becoming the background of the Hero section.

---

## 1. HTML Structure

Copy the relevant code sections to your project.

### Preloader HTML (`src/preloader.html`)
Place it at the very beginning of your `<body>` tag (above the main page container) to overlay the rest of the layout during the loading phase.
The hero image that expands is identified by the `data-hero` attribute. Trailing images after the hero will be naturally covered by the expanding hero.

### Hero HTML (`src/hero.html`)
This represents the Hero section of your page. Notice that it contains a background element with the exact same image as the hero image in the preloader, which guarantees a seamless handoff without any color flashes or jumps.

---

## 2. Critical Implementation Rules

To successfully implement this preloader without breaking the transition, you **must** follow these three rules:

### Rule #1: The Duplicate Image ("Pixel-Perfect Handoff")
The hero image is loaded twice: once inside the preloader (`<img data-hero ...>`) and once as the background of your actual Hero section (`.hero-bg-img`). They **must match exactly** in aspect ratio and `object-fit`. The preloader expands its own image to full screen, hides itself, and reveals your identical hero section underneath.

### Rule #2: The Full Screen Rule
Because the preloader expands the image to exactly `100vw` and `100vh`, your actual Hero section underneath must also be exactly `100vh` tall and start at the very top of the page. If you have a relative navbar pushing the Hero section down, the image will instantly jump down when the preloader finishes. 

### Rule #3: Event-Driven Additions (Adding Buttons / Navbars)
If you add your own elements to the Hero section (e.g., a "Buy Now" button or a navbar), do **not** let them sit there statically. They will instantly pop onto the screen when the preloader vanishes, looking broken. 
Instead, hide them by default (e.g., `opacity: 0` or `transform: translateY(20px)`) and use the custom event to animate them in smoothly:
```javascript
document.addEventListener('preloaderComplete', () => {
  // Use GSAP or CSS classes here to animate in your buttons, navbars, and text!
});
```

---

## 2. CSS Architecture

Styles are divided into two modular files:
*   **`src/preloader.css`** – Handles the fullscreen container, marquee layout, and positioning of the image train.
*   **`src/hero.css`** – Handles the positioning of the hero text underneath, as well as the text mask reveal effect (`overflow: hidden`).

---

## 3. JavaScript Logic (Decoupled Architecture)

The components are completely independent and communicate using native **Custom Events**:

### 1. Preloader JS (`src/preloader.js`)
Controls the animation flow and saves the completion state to `sessionStorage`.
*   **First visit:** The preloader runs the full animation and dispatches the `preloaderComplete` event upon finishing.
*   **Subsequent visits:** The preloader hides immediately and dispatches the `preloaderSkipped` event.

This ensures that returning users do not have to watch the entire sequence again.

### 2. Hero JS (`src/hero.js`)
Listens for the above events and triggers the text entrance animation at the right moment:

```javascript
document.addEventListener('preloaderComplete', () => {
  // Animate the Hero section text with a slight delay
});

document.addEventListener('preloaderSkipped', () => {
  // Preloader was skipped - show Hero immediately
});
```
