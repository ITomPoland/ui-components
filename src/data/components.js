import magneticButtonDemo from '../../components/magnetic-button/demo.mp4';
import splitTextPreloaderDemo from '../../components/split-text-preloader/demo.mp4';

export const components = [
  {
    id: 'split-text-preloader',
    name: 'Split Text Preloader',
    description: 'A preloader animation that splits text and transitions into a hero section with a photo montage.',
    tags: ['hero', 'animation', 'preloader'],
    path: './components/split-text-preloader/',
    demo: splitTextPreloaderDemo
  },
  {
    id: 'magnetic-button',
    name: 'Magnetic Button',
    description: 'GSAP powered magnetic hover effect. Pure physics.',
    tags: ['button'],
    path: './components/magnetic-button/',
    demo: magneticButtonDemo
  }
];
