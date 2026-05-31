# Contributing to UI Components 🚀

First off, thank you for considering contributing to `ui-components`! It's people like you that make this project a great resource for everyone.

## 🧠 Core Philosophy
We build **Awwwards-winning level components** without heavy frameworks. 
**Before you start**, please read our [AGENTS.md](./AGENTS.md) file carefully. It contains the strict architectural mandates for this project.

- **No React, No Vue, No Svelte.** Pure Vanilla HTML, CSS, and JS.
- **GSAP for Animations.** Do not use Anime.js, Framer Motion, or complex CSS animations.
- **Copy-Paste Ready.** Components must be entirely self-contained.

## 🛠️ Local Development

1. Fork the repo and clone it locally.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 📦 Adding a New Component

If you want to add a new component, please follow the standard directory structure:

1. Create a new folder in `/components/[your-component-name]`.
2. Ensure it contains the following files:
   - `preview.html` (The raw HTML structure)
   - `style.css` (The Vanilla CSS, using CSS variables)
   - `main.js` (The GSAP animation logic)

## 💬 Pull Requests
- Keep your PRs small and focused on a single component or bug fix.
- Ensure your code doesn't generate console errors.
- Test responsiveness on mobile.
- Fill out the PR template completely when submitting.

Thank you for contributing! 💖
