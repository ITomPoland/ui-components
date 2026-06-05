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
    const blurVal = parseInt(slideBlur.value);
    const speedVal = parseFloat(slideSpeed.value);
    const radiusVal = parseInt(slideRadius.value);
    const borderColor = colorBorder.value;
    const textColor = colorText.value;
    const blobColor = colorBlob.value;
    const bgVal = checkTransparentBg.checked ? 'transparent' : colorBg.value;

    if (tab === 'html') {
      content = content.replace(/stdDeviation="[^"]+"/, `stdDeviation="${blurVal}"`);
    } else if (tab === 'css') {
      content = content.replace(/--t-btn-bg:\s*[^;]+;/, `--t-btn-bg: ${bgVal};`);
      content = content.replace(/--t-btn-border-color:\s*[^;]+;/, `--t-btn-border-color: ${borderColor};`);
      content = content.replace(/--t-btn-color:\s*[^;]+;/, `--t-btn-color: ${textColor};`);
      content = content.replace(/--t-blob-color:\s*[^;]+;/, `--t-blob-color: ${blobColor};`);
      content = content.replace(/--t-btn-radius:\s*[^;]+;/, `--t-btn-radius: ${radiusVal}px;`);
    } else if (tab === 'js') {
      content = content.replace(/this\.speed\s*=\s*[^;]+;/, `this.speed = ${speedVal.toFixed(2)};`);
    }
    return content;
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
  const slideBlur = document.getElementById('slideBlur');
  const slideSpeed = document.getElementById('slideSpeed');
  const slideRadius = document.getElementById('slideRadius');
  const valBlur = document.getElementById('valBlur');
  const valSpeed = document.getElementById('valSpeed');
  const valRadius = document.getElementById('valRadius');
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  const colorBorder = document.getElementById('colorBorder');
  const colorText = document.getElementById('colorText');
  const colorBlob = document.getElementById('colorBlob');
  const colorBg = document.getElementById('colorBg');
  const checkTransparentBg = document.getElementById('checkTransparentBg');

  function updateConfig() {
    const blurVal = parseInt(slideBlur.value);
    const speedVal = parseFloat(slideSpeed.value);
    const radiusVal = parseInt(slideRadius.value);
    const borderColorVal = colorBorder.value;
    const textColorVal = colorText.value;
    const blobColorVal = colorBlob.value;
    const bgVal = checkTransparentBg.checked ? 'transparent' : colorBg.value;

    valBlur.textContent = blurVal;
    valSpeed.textContent = speedVal.toFixed(2) + 's';
    valRadius.textContent = radiusVal + 'px';

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'update-config',
        config: {
          gooeyStrength: blurVal,
          speed: speedVal,
          borderRadius: radiusVal,
          borderColor: borderColorVal,
          textColor: textColorVal,
          blobColor: blobColorVal,
          btnBg: bgVal
        }
      }, '*');
    }
    renderCode();
  }

  [slideBlur, slideSpeed, slideRadius, colorBorder, colorText, colorBlob, colorBg, checkTransparentBg].forEach(el => {
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
      checkTransparentBg.checked = true;
      if (theme === 'dark') {
        colorBorder.value = '#111111';
        colorText.value = '#111111';
        colorBlob.value = '#ea4aaa';
      } else if (theme === 'light') {
        colorBorder.value = '#ffffff';
        colorText.value = '#ffffff';
        colorBlob.value = '#ea4aaa';
      } else {
        colorBorder.value = '#ea4aaa';
        colorText.value = '#ea4aaa';
        colorBlob.value = '#111111';
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
