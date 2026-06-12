import { gsap } from 'gsap';
import { playPencilScratch } from './audio.js';

let bookOpened = false;
const componentCache = new Map();

// Global animation lock — prevents overlapping page-flip animations
let isAnimating = false;
export function getIsAnimating() { return isAnimating; }

// Pre-scan all viewer.js modules so Vite can bundle them for dynamic loading
const viewerModules = import.meta.glob('../../components/**/viewer.js');

// Reference to the current flip-page GSAP tween so we can kill it if needed
let currentFlipTween = null;

export function initAnimations() {
  const cover = document.querySelector('.cover');
  const book = document.querySelector('.book');

  cover.addEventListener('click', () => {
    if (bookOpened || isAnimating) return;
    bookOpened = true;
    isAnimating = true;
    
    playPencilScratch(800, 0.4, 0.05);

    const tl = gsap.timeline({
      onComplete: () => { isAnimating = false; }
    });
    
    tl.to(cover, {
      rotateY: -180,
      duration: 1.5,
      ease: "power3.inOut"
    }, 0)
    .to('.base-left-page', {
      rotateY: 0,
      duration: 1.5,
      ease: "power3.inOut"
    }, 0)
    .to(book, {
      x: "0%",
      duration: 1.5,
      ease: "power3.inOut"
    }, 0)
    .to(['#leftBookmarks .bookmark', '#gridBookmarks .slider-arrow', '.bookmarks-page[data-page="0"] .bookmark'], {
      y: '0rem',
      opacity: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: "back.out(1.5)",
      clearProps: "transform"
    }, 1.0)
    .set('.sticky-notes-container', {
      opacity: 1,
      pointerEvents: 'auto'
    }, 1.0)
    .fromTo('.sticky-note-tab', 
      { x: '-1.25rem', opacity: 0 },
      {
        x: '0rem',
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(1.5)",
        clearProps: "transform"
      }, 1.1);
  });

  // Categories Slider Navigation
  let currentPage = 0;
  const totalPages = 2;
  const track = document.getElementById('bookmarksTrack');
  const btnPrev = document.getElementById('btnPrevCategory');
  const btnNext = document.getElementById('btnNextCategory');

  function updateSliderButtons() {
    if (btnPrev) btnPrev.disabled = currentPage === 0;
    if (btnNext) btnNext.disabled = currentPage === totalPages - 1;
  }

  function slideToPage(targetPage) {
    if (isAnimating || targetPage < 0 || targetPage >= totalPages) return;
    isAnimating = true;

    const currentBookmarks = document.querySelectorAll(`.bookmarks-page[data-page="${currentPage}"] .bookmark`);
    
    gsap.to(currentBookmarks, {
      y: '1.25rem',
      opacity: 0,
      duration: 0.25,
      stagger: 0.03,
      ease: "power2.in",
      onComplete: () => {
        document.querySelectorAll('.bookmarks-page').forEach(p => p.classList.remove('active-page'));
        const targetPageEl = document.querySelector(`.bookmarks-page[data-page="${targetPage}"]`);
        if (targetPageEl) targetPageEl.classList.add('active-page');
        
        if (track) track.style.transform = `translateX(-${targetPage * 100}%)`;
        
        currentPage = targetPage;
        updateSliderButtons();

        const nextBookmarks = document.querySelectorAll(`.bookmarks-page[data-page="${currentPage}"] .bookmark`);
        
        nextBookmarks.forEach((btn, index) => {
          const isTargetActive = btn.classList.contains('active');
          gsap.fromTo(btn,
            { y: '1.25rem', opacity: 0 },
            { 
              y: isTargetActive ? '0rem' : '0.5rem', 
              opacity: 1, 
              duration: 0.35, 
              delay: index * 0.03,
              ease: "back.out(1.5)", 
              clearProps: "transform"
            }
          );
        });

        gsap.delayedCall(0.35 + (nextBookmarks.length * 0.03), () => {
          isAnimating = false;
        });
      }
    });
  }

  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      slideToPage(currentPage - 1);
    });
    btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      slideToPage(currentPage + 1);
    });
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.component-card');
    if (!card) return;
    e.preventDefault();
    if (isAnimating) return; // Block if animation in progress
    card.classList.add('is-clicked');
    const componentPath = card.getAttribute('href');
    flipToComponent(componentPath).then(() => {
      card.classList.remove('is-clicked');
    });
  });

  document.getElementById('btnBackToGrid').addEventListener('click', () => {
    if (isAnimating) return; // Block if animation in progress

    const activeBtn = document.querySelector('.bookmark.active:not(#btnBackToGrid)');
    const currentFilter = activeBtn ? activeBtn.dataset.filter : 'all';
    
    gsap.to('#componentBookmarks .bookmark', {
      y: '1.25rem',
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        document.getElementById('componentBookmarks').style.display = 'none';
        document.getElementById('gridBookmarks').style.display = 'flex';
        document.getElementById('leftBookmarks').style.display = 'flex';
        
        gsap.to('.sticky-notes-container', {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.5
        });

        gsap.fromTo('#leftBookmarks .bookmark',
          { y: '1.25rem', opacity: 0 },
          { y: '0rem', opacity: 1, duration: 0.5, ease: "back.out(1.5)", clearProps: "transform" }
        );

        const activePageNum = currentPage;
        const visibleBookmarks = document.querySelectorAll(`.bookmarks-page[data-page="${activePageNum}"] .bookmark, #gridBookmarks .slider-arrow`);
        
        visibleBookmarks.forEach((btn, index) => {
          const isTargetActive = btn.classList.contains('active');
          gsap.fromTo(btn, 
            { y: '1.25rem', opacity: 0 }, 
            { 
              y: isTargetActive ? '0rem' : '0.5rem', 
              opacity: 1, 
              duration: 0.5, 
              delay: index * 0.04, 
              ease: "back.out(1.5)", 
              clearProps: "transform" 
            }
          );
        });
      }
    });

    import('./grid.js').then(module => {
      module.loadCategory(currentFilter, false, true);
    });
  });

  const successPopup = document.getElementById('successPopup');
  const successCloseBtn = document.getElementById('successCloseBtn');
  if (successCloseBtn && successPopup) {
    successCloseBtn.addEventListener('click', () => {
      successPopup.classList.remove('show');
    });
  }
}

// Stop and remove all playing media (videos/iframes) inside a container
function stopAllMedia(container) {
  container.querySelectorAll('video').forEach(v => {
    v.pause();
    v.removeAttribute('src');
    v.load(); // release the media resource
  });
  container.querySelectorAll('iframe').forEach(f => {
    f.removeAttribute('src');
  });
}

export function turnPage(newLeftHTML, newRightHTML, forward = true, isLeftCover = false, stayFlipped = false) {
  return new Promise(resolve => {
    // Kill any in-progress flip animation to prevent overlap
    if (currentFlipTween) {
      currentFlipTween.progress(1); // Jump to end to finalize DOM state
      currentFlipTween = null;
    }

    isAnimating = true;
    playPencilScratch(900, 0.4, 0.05);

    const leftContainer = document.getElementById('leftPageContainer');
    const rightContainer = document.getElementById('rightPageContainer');
    const flipPage = document.querySelector('.flip-page');
    const flipFront = document.getElementById('flipFrontContainer');
    const flipBack = document.getElementById('flipBackContainer');
    const baseLeftPage = document.querySelector('.base-left-page');
    const flipBackFace = document.querySelector('.flip-page .back');
    const wasAlreadyFlipped = flipPage.style.display !== 'none';

    flipPage.style.display = 'block';
    flipPage.style.pointerEvents = 'none';

    if (forward) {
      const rightScrollTop = rightContainer.scrollTop;
      flipFront.innerHTML = '';
      while(rightContainer.firstChild) flipFront.appendChild(rightContainer.firstChild);
      flipFront.scrollTop = rightScrollTop;

      flipBack.innerHTML = newLeftHTML;
      rightContainer.innerHTML = newRightHTML; 
      
      // The back face will show the new left page
      if (isLeftCover) flipBackFace.classList.add('is-cover-back');
      else flipBackFace.classList.remove('is-cover-back');
      
      currentFlipTween = gsap.fromTo(flipPage, 
        { rotateY: 0 }, 
        { 
          rotateY: -180, 
          duration: 1.5, 
          ease: "power3.inOut",
          onComplete: () => {
            currentFlipTween = null;
            if (isLeftCover) baseLeftPage.classList.add('is-cover-back');
            else baseLeftPage.classList.remove('is-cover-back');
            
            if (!stayFlipped) {
              leftContainer.innerHTML = '';
              while(flipBack.firstChild) leftContainer.appendChild(flipBack.firstChild);
              flipPage.style.display = 'none';
              flipFront.innerHTML = '';
            } else {
              // Stop all media in the old grid content before clearing
              stopAllMedia(flipFront);
              stopAllMedia(leftContainer);
              flipFront.innerHTML = '';
              leftContainer.innerHTML = '';
              flipPage.style.pointerEvents = 'auto';
            }
            isAnimating = false;
            resolve();
          }
        }
      );
    } else {
      // The back face will show the CURRENT left page
      const currentIsCover = baseLeftPage.classList.contains('is-cover-back');
      if (currentIsCover) flipBackFace.classList.add('is-cover-back');
      else flipBackFace.classList.remove('is-cover-back');
      
      if (wasAlreadyFlipped) {
        // flipBack already contains the component preview! No need to move anything.
      } else {
        const leftScrollTop = leftContainer.scrollTop;
        flipBack.innerHTML = '';
        while(leftContainer.firstChild) flipBack.appendChild(leftContainer.firstChild);
        flipBack.scrollTop = leftScrollTop;
      }

      flipFront.innerHTML = newRightHTML;
      
      // We are updating the left container to the NEW left page immediately
      if (isLeftCover) baseLeftPage.classList.add('is-cover-back');
      else baseLeftPage.classList.remove('is-cover-back');
      
      leftContainer.innerHTML = newLeftHTML;
      
      currentFlipTween = gsap.fromTo(flipPage, 
        { rotateY: -180 }, 
        { 
          rotateY: 0, 
          duration: 1.5, 
          ease: "power3.inOut",
          onComplete: () => {
            currentFlipTween = null;
            if (!stayFlipped) {
              rightContainer.innerHTML = '';
              while(flipFront.firstChild) rightContainer.appendChild(flipFront.firstChild);
              flipPage.style.display = 'none';
              flipBack.innerHTML = '';
            }
            isAnimating = false;
            resolve();
          }
        }
      );
    }
  });
}

export async function flipToComponent(path) {
  if (isAnimating) return; // Block if animation in progress
  try {
    let html;
    if (componentCache.has(path)) {
      html = componentCache.get(path);
    } else {
      const res = await fetch(path + 'index.html');
      html = await res.text();
      componentCache.set(path, html);
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const previewSection = doc.querySelector('.preview-section');
    const codeSection = doc.querySelector('.code-section');
    
    let leftHTML = previewSection ? previewSection.outerHTML : '';
    let rightHTML = codeSection ? codeSection.outerHTML : '';

    // Adjust iframe sources
    if (previewSection) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = leftHTML;
      const iframe = tempDiv.querySelector('iframe');
      if (iframe && iframe.getAttribute('src').startsWith('./')) {
        iframe.src = path + iframe.getAttribute('src').replace('./', '');
        leftHTML = tempDiv.innerHTML;
      }
    }

    gsap.to(['#gridBookmarks .bookmark', '#leftBookmarks .bookmark'], {
      y: '1.25rem', 
      opacity: 0, 
      duration: 0.3, 
      stagger: 0.02
    });
    
    gsap.to('.sticky-notes-container', {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.3
    });

    gsap.to('#gridBookmarks .bookmark', {
      duration: 0.3,
      onComplete: () => {
        document.getElementById('gridBookmarks').style.display = 'none';
        document.getElementById('leftBookmarks').style.display = 'none';
        document.getElementById('componentBookmarks').style.display = 'flex';
        gsap.fromTo('#componentBookmarks .bookmark', 
          {y: '1.25rem', opacity: 0}, 
          {y: '0rem', opacity: 1, duration: 0.5, ease: "back.out(1.5)", clearProps: "transform"}
        );
      }
    });

    const turnPromise = turnPage(leftHTML, rightHTML, true, false, true);
    
    // Bind iframe scroll AFTER it is in DOM
    const iframe = document.querySelector('iframe.preview-iframe') || document.querySelector('.base-left-page iframe');
    if (iframe) {
      iframe.onload = () => {
        try {
          iframe.contentDocument.documentElement.style.overflow = 'hidden';
          iframe.contentDocument.body.style.overflow = 'hidden';
          const scrollContainer = document.getElementById('leftPageContainer');
          
          iframe.contentWindow.addEventListener('wheel', (e) => {
            e.preventDefault();
            // Handle different scroll modes (pixels vs lines)
            const multiplier = e.deltaMode === 1 ? 16 : 1;
            scrollContainer.scrollBy({ top: e.deltaY * multiplier, behavior: 'auto' });
          }, { passive: false });

          // Forward touch events for mobile scrolling
          let lastTouchY = 0;
          iframe.contentWindow.addEventListener('touchstart', (e) => {
            lastTouchY = e.touches[0].clientY;
          }, { passive: true });
          
          iframe.contentWindow.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const deltaY = lastTouchY - currentY;
            lastTouchY = currentY;
            scrollContainer.scrollBy({ top: deltaY, behavior: 'auto' });
          }, { passive: true });
          
        } catch(err) {
          console.warn("Could not bind iframe scroll:", err);
        }
      };
    }

    try {
      // Build the glob key from the component path
      const componentsIndex = path.indexOf('components/');
      const relativePath = componentsIndex !== -1
        ? path.substring(componentsIndex + 'components/'.length).replace(/\/$/, '')
        : path.split('/').filter(Boolean).pop();
        
      // Update GitHub Button URL for Book View
      const gitBtn = document.getElementById('gitRepoBtn');
      if (gitBtn && relativePath) {
        gitBtn.href = `https://github.com/ITomPoland/ui-components/blob/master/components/${relativePath}/README.md`;
      }

      const globKey = `../../components/${relativePath}/viewer.js`;
      if (viewerModules[globKey]) {
        const mod = await viewerModules[globKey]();
        if (mod && mod.init) {
          mod.init();
        }
      }
    } catch (err) {
      console.warn("No viewer.js found or failed to load:", err);
    }

    await turnPromise;

  } catch(e) {
    console.error("Failed to load component:", e);
  }
}

export function triggerSubmitSuccess() {
  // Odtwórz dźwięk ołówka
  playPencilScratch(600, 0.4, 0.05);
  
  // Pokaż popup
  const successPopup = document.getElementById('successPopup');
  if (successPopup) {
    successPopup.classList.add('show');
  }
}
