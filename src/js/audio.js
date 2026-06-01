let isMuted = true;
let audioCtx = null;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function playPencilScratch(frequency = 1200, duration = 0.08, volume = 0.015) {
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

export function toggleMute() {
  isMuted = !isMuted;
  return isMuted;
}

export function getIsMuted() {
  return isMuted;
}

export function attachAudioHoverListeners() {
  const hoverables = document.querySelectorAll('.bookmark, .swatch-btn, .sponsor-btn, .component-card, .tool-btn, .suggest-btn, .cover');
  hoverables.forEach(el => {
    if (el.__hasHoverAudio) return;
    el.__hasHoverAudio = true;
    el.addEventListener('mouseenter', () => {
      playPencilScratch(1400, 0.05, 0.01);
    });
  });
}
