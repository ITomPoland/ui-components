import { gsap } from 'gsap';
import { marked } from 'marked';
import readmeCode from './README.md?raw';
import preloaderHtmlCode from './src/preloader.html?raw';
import heroHtmlCode from './src/hero.html?raw';
import preloaderCssCode from './src/preloader.css?raw';
import heroCssCode from './src/hero.css?raw';
import preloaderJsCode from './src/preloader.js?raw';
import heroJsCode from './src/hero.js?raw';

export function init() {
  // Clear sessionStorage so the preloader animation always plays for the demo
  sessionStorage.removeItem('splitHeroPreloaderHasRun');
  const iframe = document.querySelector('.preview-iframe');
  if (iframe) {
    iframe.src = iframe.src; // Force reload to guarantee preloader runs
  }

  const files = {
    readme: { lang: 'language-markdown', content: readmeCode, isMarkdown: true },
    preloaderHtml: { lang: 'language-html', content: preloaderHtmlCode },
    heroHtml: { lang: 'language-html', content: heroHtmlCode },
    preloaderCss: { lang: 'language-css', content: preloaderCssCode },
    heroCss: { lang: 'language-css', content: heroCssCode },
    preloaderJs: { lang: 'language-javascript', content: preloaderJsCode },
    heroJs: { lang: 'language-javascript', content: heroJsCode }
  };
  
  let activeTab = 'preloaderHtml';
  const codeBlock = document.getElementById('codeBlock');
  const codeContainer = document.getElementById('codeContainer');
  const markdownContainer = document.getElementById('markdownContainer');
  const copyBtn = document.getElementById('copyBtn');

  const slideImages = document.getElementById('slideImages');
  const valImages = document.getElementById('valImages');
  const inputPreloaderText = document.getElementById('inputPreloaderText');
  const inputHeroText = document.getElementById('inputHeroText');
  const colorBg = document.getElementById('colorBg');

  function getModifiedCode(tab) {
    let content = files[tab].content;
    const imagesCount = parseInt(slideImages.value);
    const preloaderText = inputPreloaderText.value;
    const heroText = inputHeroText.value;
    const bgColor = colorBg.value;

    if (tab === 'preloaderHtml') {
      content = content.replace(/>ITOM</g, `>${preloaderText}<`);
      content = content.replace(/text-ITOM/g, `text-${preloaderText.replace(/\s+/g, '-')}`);
      
      let imgCount = 0;
      content = content.replace(/<img class="montage-img[^>]+>/g, (match) => {
        imgCount++;
        return imgCount <= imagesCount ? match : '';
      });
      // Cleanup empty lines left by removed images
      content = content.replace(/^\s*[\r\n]/gm, '');
    } else if (tab === 'heroHtml') {
      content = content.replace(/>HERO</g, `>${heroText}<`);
    } else if (tab === 'preloaderCss') {
      content = content.replace(/--preloader-bg:\s*[^;]+;/, `--preloader-bg: ${bgColor};`);
      
      const length = preloaderText.length;
      let fontSize = 20;
      if (length > 4) {
        fontSize = Math.max(5, 80 / length);
        // Round to 1 decimal place
        fontSize = Math.round(fontSize * 10) / 10;
      }
      content = content.replace(/font-size:\s*\d+(\.\d+)?vw;/, `font-size: ${fontSize}vw;`);
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
    const imagesCount = parseInt(slideImages.value);
    const preloaderText = inputPreloaderText.value;
    const heroText = inputHeroText.value;
    const bgColor = colorBg.value;

    valImages.textContent = imagesCount;

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'update-config',
        config: { imagesCount, preloaderText, heroText, bgColor }
      }, '*');
    }
    renderCode();
  }

  [slideImages, inputPreloaderText, inputHeroText, colorBg].forEach(el => {
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
    const content = files[activeTab].content;
    navigator.clipboard.writeText(content);
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
