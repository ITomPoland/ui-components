# Instructions for AI Agents 🤖

Welcome to the `ui-components` repository. If you are an AI coding assistant, autonomous agent, or IDE extension (e.g., Devin, GitHub Copilot, Cursor) modifying this codebase on behalf of a user, **you MUST adhere to the following architectural constraints and guidelines**.

## 1. Architectural Mandates
- **No Frameworks:** Do NOT introduce React, Vue, Svelte, Next.js, or any other heavy framework. This repository is strictly **Vanilla JavaScript, HTML, and CSS**.
- **Visual & Animation Libraries:** You are ENCOURAGED to use any awesome visual, transition, or animation libraries (e.g., `GSAP`, `Barba.js`, `Three.js`, `Lenis`, `WebGL`, etc.) for impressive effects. Do NOT use heavy UI frameworks (React/Vue/etc.) for general DOM manipulation.
- **Copy-Paste Philosophy:** The primary goal of these components is to be copy-pasteable. Keep the HTML, CSS, and JS logic separated but extremely easy to extract. Do not create convoluted build processes for individual components.

## 2. Directory Structure & Registration
- `/components/[name]/src/[name].html` - The raw HTML of the component.
- `/components/[name]/src/[name].css` - The CSS specific to the component (use CSS variables).
- `/components/[name]/src/[name].js` - The animation/logic.
- `/components/[name]/preview.html` - The isolated live preview of the component.
- `/components/[name]/index.html` - The Code Viewer wrapper for the Sketchbook UI. **Do not modify this unless changing the viewer infrastructure.**
- **Registration:** When adding a new component to `src/data/components.js`, **ALWAYS PREPEND** it (add it as the first item in the array) so it appears first in the Sketchbook UI.

## 3. Styling Guidelines
- Use modern CSS variables (e.g., `--bg-color`) defined in `:root`.
- Do NOT use TailwindCSS unless explicitly instructed by the user overriding this file. Stick to Vanilla CSS.
- Ensure all components are fully responsive and work on mobile.

## 4. Workflows & Verification
- To test the repository, run `npm run dev`.
- Ensure there are no console errors.
- Never commit broken code or placeholder comments.

Thank you for maintaining the pristine nature of this repository!
