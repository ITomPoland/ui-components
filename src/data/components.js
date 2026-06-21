import trainFlowPreloaderDemo from '../../components/preloaders/train-flow-preloader/demo.mp4';
import magneticButtonDemo from '../../components/buttons/magnetic-button/demo.mp4';
import splitTextPreloaderDemo from '../../components/preloaders/split-text-preloader/demo.mp4';
import liquidGooeyButtonDemo from '../../components/buttons/liquid-gooey-button/demo.mp4';
import kineticTextButtonDemo from '../../components/buttons/kinetic-text-button/demo.mp4';
import magneticGlassButtonDemo from '../../components/buttons/magnetic-glass-button/demo.mp4';
import transitionShrinkSlideDemo from '../../components/page-transitions/transition-shrink-slide/demo.mp4';

export const components = [
  {
    id: 'transition-shrink-slide',
    name: 'Shrink & Slide',
    description: 'Smooth page transition using Barba.js where the current page shrinks and blurs while the new page slides up from the bottom.',
    tags: ['page-transition', 'animation'],
    path: './components/page-transitions/transition-shrink-slide/',
    demo: transitionShrinkSlideDemo
  },
  {
    id: 'train-flow-preloader',
    name: 'Train Flow Preloader',
    description: 'A cinema-inspired preloader with running marquee text and a trailing train of images that decelerate and zoom into the hero view.',
    tags: ['hero', 'animation', 'preloader'],
    path: './components/preloaders/train-flow-preloader/',
    demo: trainFlowPreloaderDemo
  },
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
