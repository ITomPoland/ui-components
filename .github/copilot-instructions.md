# GitHub Copilot Instructions for ITom UI Sketchbook

If you are an AI assistant helping a contributor write code for this repository, you MUST follow these absolute rules:

1. **Framework Ban**: DO NOT generate React, Vue, Svelte, or Angular code. This repository uses ONLY Vanilla HTML, CSS, and JS.
2. **Animations**: Default to GSAP for animations. Do not suggest Framer Motion or Anime.js unless the user explicitly overrides this.
3. **Component Structure**: Every new component must be isolated inside its own folder in `components/`, containing exactly: `index.html`, `preview.html`, `src/style.css`, `src/main.js`, `src/button.html`.
4. **Copy-Paste Philosophy**: Ensure all CSS is scoped to the component, using CSS Variables. Do NOT use Tailwind CSS or any utility classes from external libraries.
5. **No Bloat**: Keep code clean, performant, and heavily commented for educational purposes.
