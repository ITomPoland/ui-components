# 🚀 Senior Developer Component Release Checklist

This is the **Ultimate Pre-Flight Protocol** for releasing any new UI component to the live domain. Whether you are a human developer or an AI Agent, you **MUST** verify every single step before calling a component "done".

## 1. 📂 Architecture & Files (The Copy-Paste Philosophy)
- [ ] **Modularity**: The component code is split into three clean files inside `src/`: `[name].html`, `[name].css`, and `[name].js`.
- [ ] **No Inline Junk**: There are no heavy inline styles or scripts inside the HTML that should belong in CSS/JS files.
- [ ] **CSS Variables**: The component uses custom properties (e.g. `var(--bg-color)`) so it is easily themeable.

## 2. 🎨 Sketchbook UI Integration
- [ ] **Wrapper Setup**: The component folder contains an `index.html` that uses the Sketchbook layout (Left side: Live Preview, Right side: Code Viewer).
- [ ] **Isolated Preview**: The actual component code is loaded inside an isolated `preview.html` via an `<iframe>` to prevent CSS bleeding.
- [ ] **GitHub & Copy Buttons**: The viewer UI contains the functional "Copy Code" buttons for each tab and the GitHub repository link.
- [ ] **Interactive Sliders**: If the component is an animation, sliders/controls have been added to the UI to let the user tweak it (via `postMessage` to the iframe).

## 3. 📚 Documentation
- [ ] **Tutorial (`README.md`)**: A detailed, beginner-friendly tutorial is written and loads into the Sketchbook's Tutorial tab.
- [ ] **Step-by-Step Instructions**: The tutorial explains exactly how to integrate the component (HTML, then CSS, then JS).
- [ ] **Senior Pro-Tips**: The tutorial includes advanced tips (like Barba.js script re-initialization or Vite integration) if applicable.

## 4. ♿ Accessibility (A11y) - WCAG Standards
- [ ] **Reduced Motion (`prefers-reduced-motion`)**: Heavy animations (GSAP/Three.js) have a fallback for users with vestibular disorders.
- [ ] **Screen Reader Focus**: SPAs or page transitions programmatically move focus (`tabindex="-1"`, `.focus()`) after DOM updates.
- [ ] **Semantic HTML**: Proper tags (`<main>`, `<nav>`, `<button>`) are used instead of random `<div>` soup.

## 5. 🚀 Deployment & Live Verification
- [ ] **Showcase Registration**: The component is prepended (added to the TOP) of the array in `src/data/components.js`.
- [ ] **Demo Video**: A `demo.mp4` file is recorded and linked in `components.js` so it auto-plays on the main page grid.
- [ ] **Vite Production Test**: You have run `npm run build && npm run preview` locally to simulate the Vercel production server. You have verified that all files (e.g., `page2.html`) are bundled properly without 404 errors.
