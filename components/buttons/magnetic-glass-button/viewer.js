import { gsap } from 'gsap';
import htmlCode from './src/button.html?raw';
import cssCode from './src/style.css?raw';
import jsCode from './src/main.js?raw';

export function init() {
  const files = {
    html: { lang: 'language-html', content: htmlCode },
    css: { lang: 'language-css', content: cssCode },
    js: { lang: 'language-javascript', content: jsCode }
  };
  let activeTab = 'html';
  const codeBlock = document.getElementById('codeBlock');
  const copyBtn = document.getElementById('copyBtn');

  function getModifiedCode(tab) {
    let content = files[tab].content;
    const magnetVal = parseFloat(slideMagnet.value);
    const textVal = parseFloat(slideText.value);
    const radiusVal = parseInt(slideRadius.value);
    const bgVal = colorBg.value;
    const textColor = colorText.value;
    const glowColor = colorGlow.value;

    if (tab === 'css') {
      content = content.replace(/--t-btn-bg:\s*[^;]+;/, `--t-btn-bg: rgba(${hexToRgb(bgVal)}, 0.7);`);
      content = content.replace(/--t-btn-color:\s*[^;]+;/, `--t-btn-color: ${textColor};`);
      content = content.replace(/--t-glow-color:\s*[^;]+;/, `--t-glow-color: ${glowColor};`);
      content = content.replace(/--t-border-draw-color:\s*[^;]+;/, `--t-border-draw-color: ${glowColor};`);
      content = content.replace(/--t-btn-radius:\s*[^;]+;/, `--t-btn-radius: ${radiusVal}px;`);
    } else if (tab === 'js') {
      content = content.replace(/this\.magnetStrength\s*=\s*[^;]+;/, `this.magnetStrength = ${magnetVal.toFixed(2)};`);
      content = content.replace(/this\.textStrength\s*=\s*[^;]+;/, `this.textStrength = ${textVal.toFixed(2)};`);
    }
    return content;
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '17, 17, 17';
  }

  function renderCode() {
    codeBlock.className = files[activeTab].lang;
    codeBlock.textContent = getModifiedCode(activeTab);
    if (window.Prism) {
      window.Prism.highlightElement(codeBlock);
    }
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
    const modifiedCode = getModifiedCode(activeTab);
    navigator.clipboard.writeText(modifiedCode);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied! ✨';
    setTimeout(() => copyBtn.textContent = originalText, 2000);
  });

  const iframe = document.querySelector('.preview-iframe');
  const slideMagnet = document.getElementById('slideMagnet');
  const slideText = document.getElementById('slideText');
  const slideRadius = document.getElementById('slideRadius');
  const valMagnet = document.getElementById('valMagnet');
  const valText = document.getElementById('valText');
  const valRadius = document.getElementById('valRadius');
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  const colorBg = document.getElementById('colorBg');
  const colorText = document.getElementById('colorText');
  const colorGlow = document.getElementById('colorGlow');

  function updateConfig() {
    const magnetVal = parseFloat(slideMagnet.value);
    const textVal = parseFloat(slideText.value);
    const radiusVal = parseInt(slideRadius.value);
    const bgVal = colorBg.value;
    const textColorVal = colorText.value;
    const glowColorVal = colorGlow.value;

    valMagnet.textContent = magnetVal.toFixed(2);
    valText.textContent = textVal.toFixed(2);
    valRadius.textContent = radiusVal + 'px';

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'update-config',
        config: {
          magnetStrength: magnetVal,
          textStrength: textVal,
          borderRadius: radiusVal,
          btnBg: `rgba(${hexToRgb(bgVal)}, 0.7)`,
          borderColor: `rgba(${hexToRgb(textColorVal)}, 0.1)`,
          textColor: textColorVal,
          glowColor: glowColorVal,
          borderDrawColor: glowColorVal
        }
      }, '*');
    }
    renderCode();
  }

  [slideMagnet, slideText, slideRadius, colorBg, colorText, colorGlow].forEach(el => {
    el.addEventListener('input', updateConfig);
  });

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeBtn = document.querySelector('.theme-toggle-btn.active');
      if (activeBtn) {
        activeBtn.classList.remove('active');
      }
      btn.classList.add('active');
      const theme = btn.dataset.theme;
      if (theme === 'dark') {
        colorBg.value = '#111111';
        colorText.value = '#ffffff';
        colorGlow.value = '#ea4aaa';
      } else if (theme === 'light') {
        colorBg.value = '#ffffff';
        colorText.value = '#111111';
        colorGlow.value = '#ea4aaa';
      } else {
        colorBg.value = '#ea4aaa';
        colorText.value = '#ffffff';
        colorGlow.value = '#111111';
      }
      updateConfig();
    });
  });

  iframe.addEventListener('load', () => {
    updateConfig();
  });

  renderCode();

  const inBook = !!document.querySelector('.book');
  
  if (!inBook) {
    gsap.from('.preview-section', {
      opacity: 0,
      x: -150,
      y: -80,
      rotation: -15,
      scale: 0.85,
      duration: 1.4,
      ease: "expo.out",
      delay: 0.1,
      clearProps: "all"
    });
    gsap.from('.code-section', {
      opacity: 0,
      x: 150,
      y: 80,
      rotation: 15,
      scale: 0.85,
      duration: 1.4,
      ease: "expo.out",
      delay: 0.3,
      clearProps: "all"
    });
    
    if(document.querySelector('.back-btn')) {
      gsap.from('.back-btn', {
        opacity: 0,
        x: -30,
        rotation: -10,
        duration: 1.0,
        ease: "back.out(1.5)",
        delay: 0.6
      });
    }
  }
}

// Auto-init only for standalone viewer page (book view calls init() explicitly)
if (!document.querySelector('.book')) {
  init();
}
