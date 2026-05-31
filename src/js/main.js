import { gsap } from 'gsap';
import { components } from '../data/components.js';
const grid = document.getElementById('componentsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
let currentFilter = 'all';
function renderComponents(animate = true) {
  const searchVal = searchInput.value.toLowerCase().trim();
  const currentCards = document.querySelectorAll('.component-card');
  const injectAndAnimateIn = () => {
    grid.innerHTML = ''; 
    let filtered = currentFilter === 'all' 
      ? components 
      : components.filter(c => c.tags.includes(currentFilter));
    if (searchVal) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchVal) || 
        c.description.toLowerCase().includes(searchVal)
      );
    }
    filtered.forEach(comp => {
      const card = document.createElement('a');
      card.href = comp.path;
      card.className = 'component-card';
      if (animate) {
        card.style.opacity = '0'; 
        card.style.transform = 'translateY(120px) rotate(-10deg) scale(0.8)';
        card.style.transformOrigin = 'center bottom';
      }
      card.innerHTML = `
        <div class="card-preview">
          ${comp.demo 
            ? `<video src="${comp.demo}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;"></video>` 
            : `<iframe src="${comp.path}preview.html" scrolling="no" tabindex="-1"></iframe>`
          }
        </div>
        <div class="card-info">
          <h2>${comp.name}</h2>
          <p>${comp.description}</p>
        </div>
      `;
      grid.appendChild(card);
    });
    attachAudioHoverListeners();
    if (filtered.length > 0 && animate) {
      gsap.to('.component-card', {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out", 
        clearProps: "all" 
      });
    }
  };
  if (currentCards.length > 0 && animate) {
    gsap.to(currentCards, {
      opacity: 0,
      y: 40,
      rotation: 5,
      scale: 0.9,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: injectAndAnimateIn
    });
  } else {
    injectAndAnimateIn();
  }
}
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) {
      activeBtn.classList.remove('active');
    }
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderComponents(true);
  });
});
searchInput.addEventListener('input', () => {
  renderComponents(true);
});
function initCardTilt() {
  grid.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.component-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(card, {
      rotateY: x * 0.08,
      rotateX: -y * 0.08,
      transformPerspective: 1000,
      boxShadow: `${14 - x * 0.15}px ${16 - y * 0.15}px 0px rgba(0,0,0,0.85)`,
      ease: "power3.out",
      duration: 0.6
    });
  });
  grid.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.component-card');
    if (!card) return;
    const related = e.relatedTarget;
    if (related && card.contains(related)) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      boxShadow: "6px 8px 0px rgba(0,0,0,0.85)",
      ease: "elastic.out(1.2, 0.5)",
      duration: 1.0,
      clearProps: "transform"
    });
  });
}
const swatchBtns = document.querySelectorAll('.swatch-btn');
swatchBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const activeSwatch = document.querySelector('.swatch-btn.active');
    if (activeSwatch) {
      activeSwatch.classList.remove('active');
    }
    btn.classList.add('active');
    document.body.classList.remove('ruled-paper', 'graph-paper', 'blank-paper');
    document.body.classList.add(`${btn.dataset.paper}-paper`);
    playPencilScratch(500, 0.25, 0.035);
  });
});
const canvas = document.getElementById('doodleCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let isDrawMode = false;
const btnDraw = document.getElementById('btnDraw');
const btnClear = document.getElementById('btnClear');
const btnMute = document.getElementById('btnMute');
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(17, 17, 17, 0.65)';
  ctx.lineWidth = 2.0;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
btnDraw.addEventListener('click', () => {
  isDrawMode = !isDrawMode;
  btnDraw.classList.toggle('active', isDrawMode);
  document.body.classList.toggle('doodle-mode', isDrawMode);
  initAudio();
  playPencilScratch(1200, 0.15, 0.02);
});
btnClear.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  initAudio();
  playPencilScratch(600, 0.3, 0.03);
});
let isMuted = true;
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}
function playPencilScratch(frequency = 1200, duration = 0.08, volume = 0.015) {
  if (isMuted) return;
  initAudio();
  if (!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  filter.Q.setValueAtTime(4.0, audioCtx.currentTime);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noiseSource.start();
}
btnMute.addEventListener('click', () => {
  isMuted = !isMuted;
  btnMute.classList.toggle('muted', isMuted);
  btnMute.textContent = isMuted ? '🔇' : '🔊';
  initAudio();
  if (!isMuted) {
    playPencilScratch(1500, 0.1, 0.02);
  }
});
canvas.addEventListener('mousedown', (e) => {
  if (!isDrawMode) return;
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
  playPencilScratch(1600, 0.04, 0.015);
});
canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing || !isDrawMode) return;
  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
  if (Math.random() < 0.18) {
    playPencilScratch(1500 + Math.random() * 400, 0.04, 0.008);
  }
});
canvas.addEventListener('mouseup', () => { isDrawing = false; });
canvas.addEventListener('mouseleave', () => { isDrawing = false; });
canvas.addEventListener('touchstart', (e) => {
  if (!isDrawMode) return;
  isDrawing = true;
  const touch = e.touches[0];
  ctx.beginPath();
  ctx.moveTo(touch.clientX, touch.clientY);
  playPencilScratch(1600, 0.04, 0.015);
});
canvas.addEventListener('touchmove', (e) => {
  if (!isDrawing || !isDrawMode) return;
  const touch = e.touches[0];
  ctx.lineTo(touch.clientX, touch.clientY);
  ctx.stroke();
  if (Math.random() < 0.18) {
    playPencilScratch(1500 + Math.random() * 400, 0.04, 0.008);
  }
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('touchend', () => { isDrawing = false; });
function attachAudioHoverListeners() {
  const hoverables = document.querySelectorAll('.filter-btn, .swatch-btn, .sponsor-btn, .component-card, .tool-btn, .suggest-btn');
  hoverables.forEach(el => {
    if (el.__hasHoverAudio) return;
    el.__hasHoverAudio = true;
    el.addEventListener('mouseenter', () => {
      playPencilScratch(1400, 0.05, 0.01);
    });
  });
}
renderComponents(false);
initCardTilt();
attachAudioHoverListeners();
gsap.from('.notebook-margin-line', {
  scaleY: 0,
  transformOrigin: "top center",
  duration: 1.2,
  ease: "power3.inOut",
  delay: 0.1
});
gsap.from('.sidebar-content > *', {
  opacity: 0,
  y: -40,
  rotation: () => -10 + Math.random() * 20,
  duration: 0.8,
  stagger: 0.12,
  ease: "back.out(1.4)",
  delay: 0.5,
  clearProps: "all"
});
const sponsorBtn = document.querySelector('.sponsor-btn');
if (sponsorBtn) {
  sponsorBtn.addEventListener('mouseenter', () => {
    gsap.to(sponsorBtn, { 
      rotateX: 15, 
      rotateY: -15, 
      rotation: 0,
      scale: 1.08, 
      transformPerspective: 500,
      duration: 0.4, 
      ease: "power2.out",
      boxShadow: "8px 8px 0px var(--text-ink)"
    });
  });
  sponsorBtn.addEventListener('mouseleave', () => {
    gsap.to(sponsorBtn, { 
      rotateX: 0, 
      rotateY: 0, 
      rotation: 2,
      scale: 1, 
      duration: 0.6, 
      ease: "elastic.out(1, 0.4)",
      boxShadow: "4px 4px 0px var(--text-ink)"
    });
  });
}
