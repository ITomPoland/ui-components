# Magnetic Glass Button

A premium, dark-themed skeuomorphic glassmorphic button. Features backdrop blur layers, a mouse-reactive radial gradient glow overlay, a dynamic SVG border drawing interaction, and physical magnetic coordinate interpolation using GSAP.

## 🚀 Features
- **Skeuomorphic Glow:** Radial gradient overlay follows cursor coordinates using pure CSS Custom Properties.
- **SVG Border Tracing:** Draws a neat border outline around the shape starting from the cursor entry point, with automatic boundary/perimeter calculation in JavaScript.
- **Backdrop Filters:** Uses CSS blur filters for realistic frosted-glass panels.
- **GSAP Magnetic Pull:** Attracts the button element and the text layer independently to create parallax depth.

## 📦 Usage
This component is designed to be copy-pasteable. Check out the source files in the `src` directory.

1. **HTML**: Grab the markup from `src/button.html`.
2. **CSS**: Grab the variables and style classes from `src/style.css`.
3. **JS**: Grab the animation class from `src/main.js` and include GSAP in your project.

## 🎨 Customization
- Modify CSS variable `--t-glow-color` to change the radial neon color.
- Adjust `magnetStrength` and `textStrength` in `main.js` to change the intensity of magnetic attraction.
