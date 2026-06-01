<div align="center">
  <img src="./avatar.jpg" alt="ITom Avatar" width="120" style="border-radius: 50%; border: 4px solid #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.2);" />
  <br/>
  <h1 style="font-family: 'Comic Sans MS', cursive, sans-serif;">ITOM UI : Sketchbook Vol. 1</h1>
  <p><strong>A beautifully interactive, copy-pasteable UI component library built without frameworks.</strong></p>
  <p>
    <a href="https://ITomPoland.github.io/ui-components/">View Live Notebook</a> • 
    <a href="#-components">Explore Components</a> • 
    <a href="#-architectural-mandates">Read Mandates</a>
  </p>
</div>

---

## 📖 What is this?
Welcome to my interactive sketchbook! This repository is a collection of high-quality, modern UI components and micro-interactions built entirely from scratch using **Vanilla JavaScript, HTML, CSS, and GSAP**.

> [!NOTE]
> **No React. No Vue. No Heavy Frameworks.** Just pure, easily extractable front-end code that you can drop into any project.

## 🚀 Quick Start
To run the interactive notebook locally:

```bash
npm install
npm run dev
```

## 🎨 Components
The components are designed to be extremely modular. Here are some of the sketches inside:

| Component | Description | Technologies |
| :--- | :--- | :--- |
| **Split Text Preloader** | A cinematic text-splitting preloader with an image montage transition. | GSAP, Vanilla JS |
| **Magnetic Button** | A physics-based button that pulls towards the user's cursor. | GSAP, Vanilla JS |
| *...more coming soon!* | | |

## 🏗 Directory Structure
The root folder is kept completely minimal and clean. All the magic happens inside `components/`!

```text
📁 ui-components/
├── 📁 components/        # The actual UI components
│   ├── 📁 magnetic-button/
│   └── 📁 split-text-preloader/
├── 📁 src/               # The interactive Notebook Viewer engine
├── 📄 index.html         # Main entry point for the Sketchbook
├── 📄 vite.config.js     # Bundler configuration
└── 📄 AGENTS.md          # Strict rules for AI assistants!
```

## 🤖 Architectural Mandates
If you are an AI assistant or human contributing to this repo, please read `AGENTS.md`. We strictly enforce the "Copy-Paste Philosophy". Everything must be cleanly separated into `src/*.html`, `src/*.css`, and `src/*.js`.

---
<div align="center">
  <i>"Copy, paste, experiment, and let's learn together! 🚀"</i>
</div>
