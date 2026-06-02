import { gsap } from 'gsap';
import { playPencilScratch } from './audio.js';

let bookOpened = false;
const componentCache = new Map();

export function initAnimations() {
  const cover = document.querySelector('.cover');
  const book = document.querySelector('.book');

  cover.addEventListener('click', () => {
    if (bookOpened) return;
    bookOpened = true;
    
    playPencilScratch(800, 0.4, 0.05);

    const tl = gsap.timeline();
    
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
    .to('.cover-content', {
      opacity: 0,
      duration: 0.5
    }, 0.2)
    .to('#gridBookmarks .bookmark', {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "back.out(1.5)"
    }, 1.0);
  });

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.component-card');
    if (!card) return;
    e.preventDefault();
    card.classList.add('is-clicked');
    const componentPath = card.getAttribute('href');
    flipToComponent(componentPath).then(() => {
      card.classList.remove('is-clicked');
    });
  });

  document.getElementById('btnBackToGrid').addEventListener('click', () => {
    // Back to grid -> trigger searchInput reload or loadCategory
    // which handles the backward flip
    const activeBtn = document.querySelector('#gridBookmarks .bookmark.active');
    const currentFilter = activeBtn ? activeBtn.dataset.filter : 'all';
    
    gsap.to('#componentBookmarks .bookmark', {
      y: 20,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        document.getElementById('componentBookmarks').style.display = 'none';
        document.getElementById('gridBookmarks').style.display = 'flex';
        gsap.fromTo('#gridBookmarks .bookmark', 
          {y: 20, opacity: 0}, 
          {y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.5)"}
        );
      }
    });

    // Instead of relying on a global loadCategory, we can just trigger a click on the active tab 
    // to reload it and flip backward. But wait, we need a generic backward flip.
    // Let's import loadCategory and call it.
    import('./grid.js').then(module => {
      module.loadCategory(currentFilter, false, true);
    });
  });
}

export function turnPage(newLeftHTML, newRightHTML, forward = true, isLeftCover = false, stayFlipped = false) {
  return new Promise(resolve => {
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
      
      gsap.fromTo(flipPage, 
        { rotateY: 0 }, 
        { 
          rotateY: -180, 
          duration: 1.5, 
          ease: "power3.inOut",
          onComplete: () => {
            if (isLeftCover) baseLeftPage.classList.add('is-cover-back');
            else baseLeftPage.classList.remove('is-cover-back');
            
            if (!stayFlipped) {
              leftContainer.innerHTML = '';
              while(flipBack.firstChild) leftContainer.appendChild(flipBack.firstChild);
              flipPage.style.display = 'none';
              flipFront.innerHTML = '';
            } else {
              flipFront.innerHTML = '';
              flipPage.style.pointerEvents = 'auto';
            }
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
      
      gsap.fromTo(flipPage, 
        { rotateY: -180 }, 
        { 
          rotateY: 0, 
          duration: 1.5, 
          ease: "power3.inOut",
          onComplete: () => {
            if (!stayFlipped) {
              rightContainer.innerHTML = '';
              while(flipFront.firstChild) rightContainer.appendChild(flipFront.firstChild);
              flipPage.style.display = 'none';
              flipBack.innerHTML = '';
            }
            resolve();
          }
        }
      );
    }
  });
}

export async function flipToComponent(path) {
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

    gsap.to('#gridBookmarks .bookmark', {
      y: 20, 
      opacity: 0, 
      duration: 0.3, 
      stagger: 0.05,
      onComplete: () => {
        document.getElementById('gridBookmarks').style.display = 'none';
        document.getElementById('componentBookmarks').style.display = 'flex';
        gsap.fromTo('#componentBookmarks .bookmark', 
          {y: 20, opacity: 0}, 
          {y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)"}
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
            scrollContainer.scrollTop += e.deltaY;
          }, { passive: false });
        } catch(err) {
          console.warn("Could not bind iframe scroll:", err);
        }
      };
    }

    try {
      const compId = path.split('/').filter(Boolean).pop();
      const mod = await import(`../../components/${compId}/viewer.js`);
      if (mod && mod.init) {
        mod.init();
      }
    } catch (err) {
      console.warn("No viewer.js found or failed to load:", err);
    }

    await turnPromise;

  } catch(e) {
    console.error("Failed to load component:", e);
  }
}
