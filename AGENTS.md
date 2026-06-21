# Instructions for AI Agents 🤖

Welcome to the `ui-components` repository. If you are an AI coding assistant, autonomous agent, or IDE extension (e.g., Devin, GitHub Copilot, Cursor) modifying this codebase on behalf of a user, **you MUST adhere to the following architectural constraints and guidelines**. Read this entire document before writing any code.

## 1. Architectural Mandates
- **No Frameworks:** Do NOT introduce React, Vue, Svelte, Next.js, or any other heavy framework. This repository is strictly **Vanilla JavaScript, HTML, and CSS**.
- **Visual & Animation Libraries:** You are ENCOURAGED to use awesome visual, transition, or animation libraries (e.g., `GSAP`, `Barba.js`, `Three.js`, `Lenis`, `WebGL`, etc.) for impressive effects.
- **Copy-Paste Philosophy:** The primary goal of these components is to be instantly copy-pasteable by beginners. You MUST keep the HTML, CSS, and JS logic in entirely separate files. Do NOT dump all styles and scripts into a single HTML file using `<style>` and `<script>`.

## 2. The Component Creation Protocol (Strict Guidelines)
When asked to create a new component, you must build the following base structure at minimum (complex components like preloaders with hero sections can have additional split files in `src/` as long as you add corresponding tabs in the Viewer):
- `/components/[name]/src/[name].html` - The raw HTML of the component itself.
- `/components/[name]/src/[name].css` - The CSS specific to the component (use CSS variables).
- `/components/[name]/src/[name].js` - The animation/logic for the component.
- `/components/[name]/preview.html` - The isolated live preview. It must import the CSS/JS from the `src/` folder via `<link>` and `<script src="...">`.
- `/components/[name]/index.html` - The Code Viewer wrapper for the Sketchbook UI. It must contain the left-side iframe (pointing to `preview.html`) and the right-side tabs (HTML/CSS/JS/Tutorial) with functional "Copy Code" buttons and a GitHub link. If you added extra files in `src/`, create extra tabs for them here.
- `/components/[name]/README.md` - A beginner-friendly tutorial loaded into the "Tutorial" tab of the Viewer.

## 3. UI, Accessibility, and Registry Requirements
- **Showcase Registration:** When a component is built, you MUST immediately prepend it (add it as the first item) to the `components` array in `src/data/components.js`.
- **A11y (WCAG):** Any heavy animations must be wrapped in `gsap.matchMedia()` to respect the OS `prefers-reduced-motion` setting. Page transitions must manage screen reader focus (`tabindex="-1"` and `.focus()`).
- **Interactive Controls:** If possible, add interactive sliders/inputs in the Sketchbook UI (`index.html`) that communicate with the `preview.html` via `window.postMessage` to let users tweak the animation live.

## 4. Production Build Verification (MANDATORY)
Do NOT assume your code works just because it works on the local dev server. Vercel uses Vite to build the project, which strips out unreferenced files.
1. Run `npm run dev` to test locally during development.
2. **BEFORE COMPLETING YOUR TASK**, you MUST simulate the Vercel production build by running:
   ```bash
   npm run build && npm run preview
   ```
3. Test your component on the production preview server (usually port 4173). If a file returns a 404 error, you must fix `vite.config.js` to ensure the file is bundled properly.
4. Review `CHECKLIST.md` at the root of the project to ensure you haven't missed any UI/UX or architectural standards.

Thank you for maintaining the pristine nature of this repository!
