import magneticButtonDemo from '../../components/buttons/magnetic-button/demo.mp4';
import splitTextPreloaderDemo from '../../components/preloaders/split-text-preloader/demo.mp4';
import liquidGooeyButtonDemo from '../../components/buttons/liquid-gooey-button/demo.mp4';
import kineticTextButtonDemo from '../../components/buttons/kinetic-text-button/demo.mp4';
import magneticGlassButtonDemo from '../../components/buttons/magnetic-glass-button/demo.mp4';

export const components = [
  {
    id: 'split-text-preloader',
    name: 'Split Text Preloader',
    description: 'A preloader animation that splits text and transitions into a hero section with a photo montage.',
    tags: ['hero', 'animation', 'preloader'],
    path: './components/preloaders/split-text-preloader/',
    demo: splitTextPreloaderDemo
  },
  {
    id: 'magnetic-button',
    name: 'Magnetic Button',
    description: 'GSAP powered magnetic hover effect. Pure physics.',
    tags: ['button'],
    path: './components/buttons/magnetic-button/',
    demo: magneticButtonDemo
  },
  {
    id: 'liquid-gooey-button',
    name: 'Liquid Gooey Button',
    description: 'An organic liquid morphing effect utilizing SVG gooey filters.',
    tags: ['button'],
    path: './components/buttons/liquid-gooey-button/',
    demo: liquidGooeyButtonDemo
  },
  {
    id: 'kinetic-text-button',
    name: 'Kinetic Text Button',
    description: 'A typographic hover interaction shifting staggered character layers.',
    tags: ['button'],
    path: './components/buttons/kinetic-text-button/',
    demo: kineticTextButtonDemo
  },
  {
    id: 'magnetic-glass-button',
    name: 'Magnetic Glass Button',
    description: 'Reflective glassmorphic button with magnetic cursor pull and SVG border drawing.',
    tags: ['button'],
    path: './components/buttons/magnetic-glass-button/',
    demo: magneticGlassButtonDemo
  }
];
