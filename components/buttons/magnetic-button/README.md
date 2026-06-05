# Magnetic Button

A simple, physics-based magnetic button hover effect powered by Vanilla JS, CSS, and GreenSock (GSAP). 
When you hover near the button, it gently pulls towards your cursor, creating an organic, fluid interaction that feels responsive and alive.

## 🚀 Features
- **GSAP Powered:** Uses GSAP `quickTo` for extremely performant, sub-pixel cursor tracking.
- **Physics Based:** Emulates a magnetic field with a specific range and pull strength.
- **Vanilla Setup:** No React or heavy frameworks. Pure HTML, CSS and JS.
- **Micro-interactions:** Includes subtle scaling and text floating within the button.

## 📦 Usage
This component is designed to be copy-pasteable. Check out the source files in the `src` directory or view the live component in the Sketchbook.

1. **HTML**: Grab the markup from `src/button.html`.
2. **CSS**: Grab the variables and styles from `src/style.css`.
3. **JS**: Grab the animation logic from `src/main.js` and ensure you have GSAP included in your project.

## 🎨 Customization
You can easily adjust the "magnetic strength" and range by modifying the parameters in `main.js`:
- `magneticRange` - How far the cursor needs to be to start pulling the button.
- `magneticStrength` - How strong the pull is.
