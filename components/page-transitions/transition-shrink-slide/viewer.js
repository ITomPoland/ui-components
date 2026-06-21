import { gsap } from 'gsap';
import { marked } from 'marked';
import readmeCode from './README.md?raw';
import homeHtmlCode from './preview.html?raw';
import aboutHtmlCode from './page2.html?raw';
import cssCode from './src/transition-shrink-slide.css?raw';
import jsCode from './src/transition-shrink-slide.js?raw';

export function init() {
  const iframe = document.querySelector('.preview-iframe');
  if (iframe) {
    iframe.src = iframe.src;
  }

  const files = {
    readme: { lang: 'language-markdown', content: readmeCode, isMarkdown: true },
    homeHtml: { lang: 'language-html', content: homeHtmlCode },
    aboutHtml: { lang: 'language-html', content: aboutHtmlCode },
    css: { lang: 'language-css', content: cssCode },
    js: { lang: 'language-javascript', content: jsCode }
  };
  
  let activeTab = 'readme';
  const codeBlock = document.getElementById('codeBlock');
  const codeContainer = document.getElementById('codeContainer');
  const markdownContainer = document.getElementById('markdownContainer');
  const copyBtn = document.getElementById('copyBtn');

  // Interactive UI elements
  const slideDuration = document.getElementById('slideDuration');
  const valDuration = document.getElementById('valDuration');
  const slideScale = document.getElementById('slideScale');
  const valScale = document.getElementById('valScale');
  const slideBlur = document.getElementById('slideBlur');
  const valBlur = document.getElementById('valBlur');
  const colorOverlay = document.getElementById('colorOverlay');

  function getModifiedCode(tab) {
    let content = files[tab].content;
    const duration = parseFloat(slideDuration.value);
    const scale = parseFloat(slideScale.value);
    const blur = parseInt(slideBlur.value);
    const overlayColor = colorOverlay.value;

    if (tab === 'js') {
      content = content.replace(/duration:\s*[\d.]+/g, `duration: ${duration}`);
      content = content.replace(/scale:\s*[\d.]+/g, `scale: ${scale}`);
      content = content.replace(/blur\(\d+px\)/g, `blur(${blur}px)`);
    } else if (tab === 'css') {
      content = content.replace(/--ts-overlay-bg:\s*[^;]+;/, `--ts-overlay-bg: ${overlayColor};`);
    }

    return content;
  }

  function renderCode() {
    const file = files[activeTab];
    
    if (file.isMarkdown) {
      codeContainer.style.display = 'none';
      copyBtn.style.display = 'none';
      markdownContainer.style.display = 'block';
      markdownContainer.innerHTML = marked.parse(file.content);
    } else {
      markdownContainer.style.display = 'none';
      codeContainer.style.display = 'block';
      copyBtn.style.display = 'block';
      
      codeBlock.className = file.lang;
      codeBlock.textContent = getModifiedCode(activeTab);
      if (window.Prism) {
        window.Prism.highlightElement(codeBlock);
      }
    }
  }

  function updateConfig() {
    const duration = parseFloat(slideDuration.value);
    const scale = parseFloat(slideScale.value);
    const blur = parseInt(slideBlur.value);
    const overlayColor = colorOverlay.value;

    valDuration.textContent = duration.toFixed(1);
    valScale.textContent = scale.toFixed(2);
    valBlur.textContent = blur;

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'update-config',
        config: { duration, scale, blur, overlayColor }
      }, '*');
    }
    renderCode();
  }

  [slideDuration, slideScale, slideBlur, colorOverlay].forEach(el => {
    if(el) el.addEventListener('input', updateConfig);
  });

  if (iframe) {
    iframe.addEventListener('load', () => {
      updateConfig();
    });
  }

  document.querySelectorAll('.code-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelector('.code-tab.active').classList.remove('active');
      e.target.classList.add('active');
      activeTab = e.target.dataset.target;
      renderCode();
    });
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(getModifiedCode(activeTab));
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied! ✨';
    setTimeout(() => copyBtn.textContent = originalText, 2000);
  });

  // Entry animations
  const inBook = !!document.querySelector('.book');
  if (!inBook) {
    gsap.from('.preview-section', {
      opacity: 0, x: -150, y: -80, rotation: -15, scale: 0.85,
      duration: 1.4, ease: "expo.out", delay: 0.1, clearProps: "all"
    });
    gsap.from('.code-section', {
      opacity: 0, x: 150, y: 80, rotation: 15, scale: 0.85,
      duration: 1.4, ease: "expo.out", delay: 0.3, clearProps: "all"
    });
    if(document.querySelector('.back-btn')) {
      gsap.from('.back-btn', {
        opacity: 0, x: -30, rotation: -10, duration: 1.0, ease: "back.out(1.5)", delay: 0.6
      });
    }
  }

  // Initial render
  renderCode();
}

if (!document.querySelector('.book')) {
  init();
}
