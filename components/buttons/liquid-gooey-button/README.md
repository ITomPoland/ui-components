# Liquid Gooey Button

An organic liquid-morphing button effect powered by CSS Variables, GSAP, and an SVG gooey filter. When hovered, fluid background blobs swell and merge dynamically, following the cursor's path for a natural liquid attraction effect.

## 🚀 Features
- **SVG Gooey Filter:** Blurs and joins shapes seamlessly using `feGaussianBlur` and `feColorMatrix`.
- **GSAP Physics:** Handles staggered scaling and smooth cursor coordinates interpolation.
- **Copy-Paste Design:** Strictly Vanilla HTML, CSS, and JS.
- **Micro-interactions:** Text parallax shift responding to cursor proximity.

## 📦 Usage
This component is designed to be fully copy-pasteable. Check out the source files in the `src` directory.

1. **HTML**: Grab the markup from `src/button.html` (be sure to copy the inline SVG filter).
2. **CSS**: Grab the variables and layout from `src/style.css`.
3. **JS**: Grab the animation controller from `src/main.js` and include GSAP in your project.

## 🎨 Customization
- Adjust the standard deviation on the SVG filter to make the gooey merge tighter or looser.
- Modify CSS variable `--t-blob-color` to change the liquid color.
- Adjust `speed` in `main.js` to change how quickly the liquid swells on hover.
