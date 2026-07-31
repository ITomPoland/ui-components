import { gsap } from 'gsap';
import { marked } from 'marked';
import readmeCode from './README.md?raw';
import htmlCode from './src/curved-arc-carousel.html?raw';
import cssCode from './src/curved-arc-carousel.css?raw';
import jsCode from './src/curved-arc-carousel.js?raw';

export function init() {
  const iframe = document.querySelector('.preview-iframe');
  if (iframe) {
    iframe.src = iframe.src;
  }

  const files = {
    readme: { lang: 'language-markdown', content: readmeCode, isMarkdown: true },
    html: { lang: 'language-html', content: htmlCode },
    css: { lang: 'language-css', content: cssCode },
    js: { lang: 'language-javascript', content: jsCode }
  };
  
  let activeTab = 'readme';
  const codeBlock = document.getElementById('codeBlock');
  const codeContainer = document.getElementById('codeContainer');
  const markdownContainer = document.getElementById('markdownContainer');
  const copyBtn = document.getElementById('copyBtn');

  function getModifiedCode(tab) {
    let content = files[tab].content;
    
    if (tab === 'js') {
      const slideArcRadius = document.getElementById('slideArcRadius');
      const slideCardGap = document.getElementById('slideCardGap');
      
      if (slideArcRadius) {
        const radius = parseInt(slideArcRadius.value, 10);
        content = content.replace(/baseRadiusDesktop:\s*\d+/, `baseRadiusDesktop: ${radius}`);
        content = content.replace(/baseRadiusMobile:\s*\d+/, `baseRadiusMobile: ${Math.round(radius * (600/1800))}`);
      }
      
      if (slideCardGap) {
        const gap = parseInt(slideCardGap.value, 10);
        content = content.replace(/cardGapDesktop:\s*\d+/, `cardGapDesktop: ${gap}`);
        content = content.replace(/cardGapMobile:\s*\d+/, `cardGapMobile: ${Math.round(gap * (100/220))}`);
      }
    } else if (tab === 'css') {
      const checkShowGrid = document.getElementById('checkShowGrid');
      if (checkShowGrid && !checkShowGrid.checked) {
         content = content.replace(/--sk-grid:\s*[^;]+;/, '--sk-grid: transparent;');
      }
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

  document.querySelectorAll('.code-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelector('.code-tab.active')?.classList.remove('active');
      e.target.classList.add('active');
      activeTab = e.target.dataset.target;
      renderCode();
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(getModifiedCode(activeTab));
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied! ✨';
      setTimeout(() => copyBtn.textContent = originalText, 2000);
    });
  }

  // Dynamic Settings Controls for Arc Carousel
  const slideArcRadius = document.getElementById('slideArcRadius');
  const valArcRadius = document.getElementById('valArcRadius');
  const slideCardGap = document.getElementById('slideCardGap');
  const valCardGap = document.getElementById('valCardGap');
  const checkShowGrid = document.getElementById('checkShowGrid');

  function updateConfig() {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'updateArcConfig',
        radius: slideArcRadius ? parseInt(slideArcRadius.value, 10) : null,
        gap: slideCardGap ? parseInt(slideCardGap.value, 10) : null,
        grid: checkShowGrid ? checkShowGrid.checked : null
      }, '*');
    }
    if (activeTab === 'js' || activeTab === 'css') {
      renderCode();
    }
  }

  if (slideArcRadius && valArcRadius) {
    slideArcRadius.addEventListener('input', (e) => {
      valArcRadius.innerText = `${e.target.value}px`;
      updateConfig();
    });
  }

  if (slideCardGap && valCardGap) {
    slideCardGap.addEventListener('input', (e) => {
      valCardGap.innerText = `${e.target.value}px`;
      updateConfig();
    });
  }

  if (checkShowGrid) {
    checkShowGrid.addEventListener('change', updateConfig);
  }

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
