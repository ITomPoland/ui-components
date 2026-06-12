import { gsap } from 'gsap';
import { components } from '../data/components.js';
import { fetchShowcaseProjects } from './sanity.js';
import { attachAudioHoverListeners } from './audio.js';
import { turnPage, getIsAnimating } from './animations.js';

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
          mediaContainer.innerHTML = `<video src="${src}" autoplay loop muted playsinline></video>`;
        } else if (type === 'iframe') {
          mediaContainer.innerHTML = `<iframe src="${src}" scrolling="no" tabindex="-1" loading="lazy"></iframe>`;
        }
        
        // Add class for smooth fade-in without keyframes
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            mediaContainer.classList.add('is-loaded');
          });
        });
      } else {
        const video = mediaContainer.querySelector('video');
        if (video) video.play().catch(e => console.warn("Auto-play prevented", e));
      }
    } else {
      if (mediaContainer.dataset.loaded) {
        const video = mediaContainer.querySelector('video');
        if (video) video.pause();
      }
    }
  });
}, observerOptions);

function createShowcaseCardElement(site) {
  const card = document.createElement('div');
  card.className = 'showcase-card';
  card.style.transform = `rotate(${site.rotation || 0}deg)`;

  // Build social icons HTML
  let socialsHTML = '';
  if (site.socials) {
    if (site.socials.linkedin) {
      socialsHTML += `<a href="${site.socials.linkedin}" target="_blank" rel="noopener noreferrer nofollow" class="showcase-social" aria-label="LinkedIn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>`;
    }
    if (site.socials.x) {
      socialsHTML += `<a href="${site.socials.x}" target="_blank" rel="noopener noreferrer nofollow" class="showcase-social" aria-label="X">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>`;
    }
  }

  // Author: link to portfolio if available
  const authorHTML = site.authorUrl
    ? `<a href="${site.authorUrl}" target="_blank" rel="noopener noreferrer nofollow" class="showcase-author-link">by ${site.author}</a>`
    : `<span class="showcase-author">by ${site.author}</span>`;

  card.innerHTML = `
    <div class="showcase-img-container">
      <img src="${site.image}" alt="${site.name}" class="showcase-img" loading="lazy" />
    </div>
    <div class="showcase-info">
      <h2>${site.name}</h2>
      <div class="showcase-meta">
        <div class="showcase-author-row">
          ${authorHTML}
          ${socialsHTML ? `<div class="showcase-socials">${socialsHTML}</div>` : ''}
        </div>
        <div class="showcase-tags">
          ${site.componentsUsed.map(compName => `<span class="showcase-tag">${compName}</span>`).join('')}
        </div>
      </div>
      <a href="${site.url}" target="_blank" rel="noopener noreferrer" class="showcase-link">Visit Site ↗</a>
    </div>
  `;
  
  return card;
}

function bindSubmitForm() {
  const form = document.getElementById('submitWebsiteForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Anti-spam: if honeypot is filled, silently ignore
    const honeypot = form.querySelector('input[name="_honeypot"]');
    if (honeypot && honeypot.value.trim() !== '') {
      form.reset();
      return;
    }
    
    // Validate at least one component is selected
    const checkedComponents = Array.from(form.querySelectorAll('input[name="components"]:checked')).map(cb => cb.value);
    if (checkedComponents.length === 0) {
      alert('Please select at least one component used.');
      return;
    }
    
    // UI Loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'SUBMITTING... ⏳';
    submitBtn.disabled = true;

    try {
      // Gather form data
      const formData = {
        siteName: form.querySelector('#siteName').value.trim(),
        siteUrl: form.querySelector('#siteUrl').value.trim(),
        authorName: form.querySelector('#authorName').value.trim(),
        authorPortfolio: form.querySelector('#authorPortfolio').value.trim(),
        socialLinkedin: form.querySelector('#socialLinkedin').value.trim(),
        socialX: form.querySelector('#socialX').value.trim(),
        contactEmail: form.querySelector('#contactEmail').value.trim(),
        componentsUsed: checkedComponents
      };

      // Send to Vercel Serverless Function
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit via API');

      // Play sound and display success popup
      const anim = await import('./animations.js');
      anim.triggerSubmitSuccess();
      form.reset();
    } catch (error) {
      console.error('Submission error:', error);
      alert('Oops! Something went wrong while communicating with the server. Please try again later.');
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

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

  if (filter === 'showcase') {
    const leftGridTemplate = document.getElementById('showcase-page-template').content.cloneNode(true);
    const rightGridTemplate = document.getElementById('showcase-page-template').content.cloneNode(true);
    
    leftGridTemplate.querySelector('.page-title').textContent = 'SHOWCASE';
    rightGridTemplate.querySelector('.page-title').textContent = 'YOUR WEBSITES';
    
    const rightGrid = rightGridTemplate.querySelector('.components-grid');
    // Give it a unique ID so we can target it after the DOM is rendered by turnPage
    rightGrid.id = 'dynamic-showcase-grid';
    
    // Render loading state synchronously so the animation can start instantly
    rightGrid.innerHTML = `
      <div class="empty-category-message" style="opacity: 0.7;">
        <div class="empty-doodle" style="animation: squiggle 0.3s infinite linear;">🔄</div>
        <h3>Loading projects...</h3>
        <p>Fetching the latest awesomeness from Sanity.</p>
      </div>
    `;
    
    // Asynchronously fetch from Sanity and populate the real DOM grid
    fetchShowcaseProjects().then(projects => {
      const activeGrid = document.getElementById('dynamic-showcase-grid');
      if (!activeGrid) return; // User navigated away before fetch completed
      
      activeGrid.innerHTML = ''; // Clear loading state
      if (projects && projects.length > 0) {
        projects.forEach(site => activeGrid.appendChild(createShowcaseCardElement(site)));
      } else {
        activeGrid.innerHTML = `
          <div class="empty-category-message">
            <div class="empty-doodle">✏️</div>
            <h3>Coming soon!</h3>
            <p>No projects in the showcase yet. Be the first to submit!</p>
          </div>
        `;
      }
    });
    
    leftContent.appendChild(leftGridTemplate);
    rightContent.appendChild(rightGridTemplate);
  } else if (filter === 'submit') {
    const instructionsTemplate = document.getElementById('submit-instructions-template');
    leftContent.appendChild(instructionsTemplate.content.cloneNode(true));
    
    const formTemplate = document.getElementById('submit-form-template');
    rightContent.appendChild(formTemplate.content.cloneNode(true));
  } else if (filter === 'all' && !searchVal) {
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
    else if (filter === 'page-transition') leftTitle = 'PAGE TRANSITIONS';
    else if (filter === 'scroll-transition') leftTitle = 'SCROLL TRANSITIONS';
    else if (filter === 'scroll-trigger') leftTitle = 'SCROLL TRIGGER';
    else if (filter === 'navbar') leftTitle = 'NAVBARS';
    else leftTitle = filter.toUpperCase().replace('-', ' ');

    leftGridTemplate.querySelector('.page-title').textContent = leftTitle;
    rightGridTemplate.querySelector('.page-title').textContent = 'COMPONENTS';

    const leftGrid = leftGridTemplate.querySelector('.components-grid');
    const rightGrid = rightGridTemplate.querySelector('.components-grid');

    if (filtered.length === 0) {
      leftContent.appendChild(leftGridTemplate);
      
      rightGrid.style.display = 'block';
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'empty-category-message';
      emptyMsg.innerHTML = `
        <div class="empty-doodle">✏️</div>
        <h3>Coming soon!</h3>
        <p>New components for this category are on the way. Check back regularly! 🚀</p>
      `;
      rightGrid.appendChild(emptyMsg);
      rightContent.appendChild(rightGridTemplate);
    } else {
      const half = Math.ceil(filtered.length / 2);
      const leftComps = filtered.slice(0, half);
      const rightComps = filtered.slice(half);

      leftComps.forEach(comp => leftGrid.appendChild(createCardElement(comp)));
      rightComps.forEach(comp => rightGrid.appendChild(createCardElement(comp)));

      leftContent.appendChild(leftGridTemplate);
      rightContent.appendChild(rightGridTemplate);
    }
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

    if (filter === 'submit') {
      bindSubmitForm();
    }
  } else {
    if (getIsAnimating()) return; // Skip if a page turn is already in progress
    turnPage(leftContent.innerHTML, rightContent.innerHTML, forward, isHome).then(() => {
      document.querySelectorAll('.component-card').forEach(c => lazyLoadObserver.observe(c));
      attachAudioHoverListeners();

      if (filter === 'submit') {
        bindSubmitForm();
      }
    });
  }
}

export function renderComponents() {
  loadCategory(currentFilter, true);
}

export function initGridFilters() {
  const filterBtns = document.querySelectorAll('#gridBookmarks .bookmark:not(.slider-arrow), #leftBookmarks .bookmark');
  const stickyTabs = document.querySelectorAll('.sticky-note-tab[data-action]');
  const filtersOrder = ['all', 'button', 'preloader', 'page-transition', 'scroll-transition', 'scroll-trigger', 'navbar', 'showcase', 'submit'];
  
  function changeFilter(newFilter) {
    if (getIsAnimating()) return;
    
    const oldFilter = currentFilter;
    if (newFilter === oldFilter) return;

    // Update active class on bookmarks
    filterBtns.forEach(b => {
      if (b.dataset.filter === newFilter) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // Update active class on sticky note tabs
    stickyTabs.forEach(tab => {
      if (tab.dataset.action === newFilter) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    currentFilter = newFilter;

    const oldIndex = filtersOrder.indexOf(oldFilter);
    const newIndex = filtersOrder.indexOf(newFilter);
    const forward = newIndex > oldIndex;

    loadCategory(currentFilter, forward);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active') || getIsAnimating()) return;
      changeFilter(btn.dataset.filter);
    });
  });

  stickyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active') || getIsAnimating()) return;
      changeFilter(tab.dataset.action);
    });
  });

  document.addEventListener('input', (e) => {
    if (e.target && e.target.id === 'searchInput') {
      isFirstLoad = true; // force instant reload on search without page flip
      loadCategory(currentFilter, true);
    }
  });
}
