# Kinetic Text Button

A typography-focused button interaction. On hover, a bottom-up sliding colored background fills the button, while individual characters are dynamically split and rolled vertically with an adjustable GSAP stagger and delay.

## 🚀 Features
- **Dynamic DOM Splitting:** Parses text content automatically and builds multi-layered character containers without cluttering the initial HTML markup.
- **Staggered Animations:** Employs GSAP staggers for a smooth, rolling typography effect.
- **Sleek Transition Curves:** Utilizes custom cubic-bezier curves for organic slide reveals.
- **Vanilla Setup:** Strictly Vanilla HTML, CSS, and JS (GSAP dependency).

## 📦 Usage
This component is designed to be copy-pasteable. Check out the source files in the `src` directory.

1. **HTML**: Grab the markup from `src/button.html`.
2. **CSS**: Grab the layout styles from `src/style.css`.
3. **JS**: Grab the splitter and hover classes from `src/main.js` and make sure you have GSAP registered.

## 🎨 Customization
- Adjust `--t-hover-bg` to define the slider color on hover.
- Adjust `stagger` in `main.js` to change the letter-by-letter delay.
- Modify `duration` in `main.js` to speed up or slow down the rolls.
