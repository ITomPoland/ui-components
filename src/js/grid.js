import { gsap } from 'gsap';
import { components } from '../data/components.js';
import { attachAudioHoverListeners } from './audio.js';

const grid = document.getElementById('componentsGrid');
const searchInput = document.getElementById('searchInput');
let currentFilter = 'all';

// Intersection Observer for lazy loading iframes and videos
const observerOptions = {
  root: null, // Use the viewport as the root for safe intersection detection
  rootMargin: '100px',
  threshold: 0.1
};

const lazyLoadObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const card = entry.target;
    const mediaContainer = card.querySelector('.card-preview');
    if (!mediaContainer) return;
    
    const type = mediaContainer.dataset.type;
    const src = mediaContainer.dataset.src;

    if (entry.isIntersecting) {
      if (!mediaContainer.dataset.loaded) {
        mediaContainer.dataset.loaded = 'true';
        
        if (type === 'video') {
          mediaContainer.innerHTML = `<video src="${src}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;"></video>`;
        } else if (type === 'iframe') {
          mediaContainer.innerHTML = `<iframe src="${src}" scrolling="no" tabindex="-1" loading="lazy"></iframe>`;
        }
      }
    } else {
      // Element is out of view! Unload from memory
      if (mediaContainer.dataset.loaded) {
        delete mediaContainer.dataset.loaded;
        // Revert to placeholder to clear memory and rendering context
        mediaContainer.innerHTML = `<div style="font-family: var(--font-sketch); color: var(--text-light-ink); font-size: 1.2rem; animation: squiggle 0.3s infinite linear;">Loading Preview...</div>`;
      }
    }
  });
}, observerOptions);

export function renderComponents(animate = true) {
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
      
      const mediaType = comp.demo ? 'video' : 'iframe';
      const mediaSrc = comp.demo ? comp.demo : `${comp.path}preview.html`;
      
      card.innerHTML = `
        <div class="card-preview" data-type="${mediaType}" data-src="${mediaSrc}">
          <!-- Lazy loaded content will go here -->
          <div style="font-family: var(--font-sketch); color: var(--text-light-ink); font-size: 1.2rem; animation: squiggle 0.3s infinite linear;">Loading Preview...</div>
        </div>
        <div class="card-info">
          <h2>${comp.name}</h2>
          <p>${comp.description}</p>
        </div>
      `;
      
      grid.appendChild(card);
      lazyLoadObserver.observe(card);
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

export function initGridFilters() {
  const filterBtns = document.querySelectorAll('.bookmark');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      const activeBtn = document.querySelector('.bookmark.active');
      if (activeBtn) activeBtn.classList.remove('active');
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderComponents(true);
    });
  });

  searchInput.addEventListener('input', () => {
    renderComponents(true);
  });
}


