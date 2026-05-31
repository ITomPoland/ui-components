import htmlCode from './preview.html?raw';
import cssCode from './style.css?raw';
import jsCode from './main.js?raw';

const files = {
  html: { lang: 'language-html', content: htmlCode },
  css: { lang: 'language-css', content: cssCode },
  js: { lang: 'language-javascript', content: jsCode }
};

let activeTab = 'html';
const codeBlock = document.getElementById('codeBlock');
const copyBtn = document.getElementById('copyBtn');

function renderCode() {
  codeBlock.className = files[activeTab].lang;
  
  // Clean up HTML wrapper to only show the body content
  let text = files[activeTab].content;
  if (activeTab === 'html') {
    const bodyMatch = text.match(/<body>([\s\S]*?)<script/);
    if (bodyMatch) text = bodyMatch[1].trim();
  }
  
  codeBlock.textContent = text;
  // Prism is loaded globally in index.html
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
  navigator.clipboard.writeText(files[activeTab].content);
  const originalText = copyBtn.textContent;
  copyBtn.textContent = 'Copied! ✨';
  setTimeout(() => copyBtn.textContent = originalText, 2000);
});

renderCode();
