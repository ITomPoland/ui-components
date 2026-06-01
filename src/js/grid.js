import { gsap } from 'gsap';
import { components } from '../data/components.js';
import { attachAudioHoverListeners } from './audio.js';
import { turnPage } from './animations.js';

let currentFilter = 'all';
let isFirstLoad = true;

// Intersection Observer for lazy loading iframes and videos
const observerOptions = {
  root: null,
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
      if (mediaContainer.dataset.loaded) {
        delete mediaContainer.dataset.loaded;
        mediaContainer.innerHTML = `<div style="font-family: var(--font-sketch); color: var(--text-light-ink); font-size: 1.2rem; animation: squiggle 0.3s infinite linear;">Loading Preview...</div>`;
      }
    }
  });
}, observerOptions);

function createCardElement(comp) {
  const card = document.createElement('a');
  card.href = comp.path;
  card.className = 'component-card';
  
  const mediaType = comp.demo ? 'video' : 'iframe';
  const mediaSrc = comp.demo ? comp.demo : `${comp.path}preview.html`;
  
  card.innerHTML = `
    <div class="card-preview" data-type="${mediaType}" data-src="${mediaSrc}">
      <div style="font-family: var(--font-sketch); color: var(--text-light-ink); font-size: 1.2rem; animation: squiggle 0.3s infinite linear;">Loading Preview...</div>
    </div>
    <div class="card-info">
      <h2>${comp.name}</h2>
      <p>${comp.description}</p>
    </div>
  `;
  
  lazyLoadObserver.observe(card);
  return card;
}

export function loadCategory(filter, forward = true) {
  const searchInput = document.getElementById('searchInput');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
  let filtered = filter === 'all' 
    ? components 
    : components.filter(c => c.tags.includes(filter));
    
  if (searchVal) {
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(searchVal) || 
      c.description.toLowerCase().includes(searchVal)
    );
  }

  let leftContent = document.createElement('div');
  leftContent.style.height = '100%';
  
  let rightContent = document.createElement('div');
  rightContent.style.height = '100%';

  if (filter === 'all' && !searchVal) {
    // Home layout: About on left, All components on right
    const aboutTemplate = document.getElementById('about-page-template');
    leftContent.appendChild(aboutTemplate.content.cloneNode(true));
    
    const rightGridTemplate = document.getElementById('grid-page-template').content.cloneNode(true);
    rightGridTemplate.querySelector('.page-title').textContent = 'All Components';
    
    const rightGrid = rightGridTemplate.querySelector('.components-grid');
    filtered.forEach(comp => rightGrid.appendChild(createCardElement(comp)));
    rightContent.appendChild(rightGridTemplate);
  } else {
    // Category layout: Split components evenly between left and right pages
    const leftGridTemplate = document.getElementById('grid-page-template').content.cloneNode(true);
    const rightGridTemplate = document.getElementById('grid-page-template').content.cloneNode(true);
    
    let leftTitle = '';
    if (filter === 'button') leftTitle = 'BUTTONS';
    else if (filter === 'preloader') leftTitle = 'PRELOADERS';
    else leftTitle = filter.toUpperCase();

    leftGridTemplate.querySelector('.page-title').textContent = leftTitle;
    rightGridTemplate.querySelector('.page-title').textContent = 'COMPONENTS';

    const leftGrid = leftGridTemplate.querySelector('.components-grid');
    const rightGrid = rightGridTemplate.querySelector('.components-grid');

    const half = Math.ceil(filtered.length / 2);
    const leftComps = filtered.slice(0, half);
    const rightComps = filtered.slice(half);

    leftComps.forEach(comp => leftGrid.appendChild(createCardElement(comp)));
    rightComps.forEach(comp => rightGrid.appendChild(createCardElement(comp)));

    leftContent.appendChild(leftGridTemplate);
    rightContent.appendChild(rightGridTemplate);
  }

  const baseLeftPage = document.querySelector('.base-left-page');
  const isHome = filter === 'all' && !searchVal;

  if (isFirstLoad) {
    if (isHome) baseLeftPage.classList.add('is-cover-back');
    else baseLeftPage.classList.remove('is-cover-back');

    document.getElementById('leftPageContainer').innerHTML = '';
    document.getElementById('leftPageContainer').appendChild(leftContent);
    document.getElementById('rightPageContainer').innerHTML = '';
    document.getElementById('rightPageContainer').appendChild(rightContent);
    isFirstLoad = false;
    
    // Re-observe cards after injection
    document.querySelectorAll('.component-card').forEach(c => lazyLoadObserver.observe(c));
    attachAudioHoverListeners();
  } else {
    turnPage(leftContent.innerHTML, rightContent.innerHTML, forward, isHome).then(() => {
      document.querySelectorAll('.component-card').forEach(c => lazyLoadObserver.observe(c));
      attachAudioHoverListeners();
    });
  }
}

export function renderComponents() {
  loadCategory(currentFilter, true);
}

export function initGridFilters() {
  const filterBtns = document.querySelectorAll('#gridBookmarks .bookmark');
  const filtersOrder = ['all', 'button', 'preloader'];
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      const activeBtn = document.querySelector('#gridBookmarks .bookmark.active');
      const oldFilter = activeBtn ? activeBtn.dataset.filter : 'all';
      
      if (activeBtn) activeBtn.classList.remove('active');
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      
      const oldIndex = filtersOrder.indexOf(oldFilter);
      const newIndex = filtersOrder.indexOf(currentFilter);
      const forward = newIndex > oldIndex;

      loadCategory(currentFilter, forward);
    });
  });

  document.addEventListener('input', (e) => {
    if (e.target && e.target.id === 'searchInput') {
      isFirstLoad = true; // force instant reload on search without page flip
      loadCategory(currentFilter, true);
    }
  });
}
