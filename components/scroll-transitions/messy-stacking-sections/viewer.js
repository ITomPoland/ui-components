import { gsap } from 'gsap';
import { marked } from 'marked';
import readmeCode from './README.md?raw';
import htmlCode from './src/messy-stacking-sections.html?raw';
import cssCode from './src/messy-stacking-sections.css?raw';
import jsCode from './src/messy-stacking-sections.js?raw';

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
    return files[tab].content;
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

  // Handle Dynamic Settings Controls
  const inputSecCount = document.getElementById('inputSecCount');
  const valSecCount = document.getElementById('valSecCount');
  const slideRotInt = document.getElementById('slideRotInt');
  const valRotInt = document.getElementById('valRotInt');

  function updateConfig() {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'updateConfig',
        count: parseInt(inputSecCount.value, 10) || 4,
        intensity: parseFloat(slideRotInt.value) || 1
      }, '*');
    }
  }

  if (inputSecCount && valSecCount) {
    inputSecCount.addEventListener('input', (e) => {
      valSecCount.innerText = e.target.value;
      updateConfig();
    });
  }

  if (slideRotInt && valRotInt) {
    slideRotInt.addEventListener('input', (e) => {
      valRotInt.innerText = `${e.target.value}x`;
      updateConfig();
    });
  }

  ['Sec1', 'Sec2', 'Sec3', 'Sec4'].forEach((sec, i) => {
    const slider = document.getElementById(`slide${sec}`);
    const val = document.getElementById(`val${sec}`);
    
    if (slider && val) {
      slider.addEventListener('input', (e) => {
        val.innerText = `${e.target.value}vh`;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'updateHeight',
            index: i,
            height: `${e.target.value}vh`
          }, '*');
        }
      });
    }
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
