import { playPencilScratch, initAudio } from './audio.js';

let isDrawing = false;
export let isDrawMode = false;
let canvas, ctx;

export function initDoodle() {
  canvas = document.getElementById('doodleCanvas');
  ctx = canvas.getContext('2d');
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const btnDraw = document.getElementById('btnDraw');
  const btnClear = document.getElementById('btnClear');

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

  // Mouse events
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

  // Touch events
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
}

function resizeCanvas() {
  if (!canvas || !ctx) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(17, 17, 17, 0.65)';
  ctx.lineWidth = 2.0;
}
