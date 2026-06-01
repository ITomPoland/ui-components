import { gsap } from 'gsap';
import { playPencilScratch } from './audio.js';

let bookOpened = false;

// HTML Cache for fast flipping
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
    }, 1.0)
    .to('.base-left-page .page-content > *', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "power2.out"
    }, 1.0)
    .to('.flip-page .front .page-content > *', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "power2.out"
    }, 1.2);
  });

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.component-card');
    if (!card) return;
    e.preventDefault();
    const componentPath = card.getAttribute('href');
    flipToComponent(componentPath);
  });

  document.getElementById('btnBackToGrid').addEventListener('click', () => {
    playPencilScratch(900, 0.4, 0.05);
    
    // Restore visibility and interaction BEFORE flipping back so it's seen during the flip
    const frontFace = document.querySelector('.flip-page .front');
    if(frontFace) {
      frontFace.style.display = 'block';
      frontFace.style.pointerEvents = 'auto';
    }

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
    
    gsap.to('.flip-page', {
      rotateY: 0,
      duration: 1.5,
      ease: "power3.inOut"
    });
  });
}

export async function flipToComponent(path) {
  playPencilScratch(900, 0.4, 0.05);

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
    
    if (previewSection) {
      const iframe = previewSection.querySelector('iframe');
      if (iframe && iframe.getAttribute('src').startsWith('./')) {
        iframe.src = path + iframe.getAttribute('src').replace('./', '');
        
        iframe.onload = () => {
          try {
            // Prevent iframe from having internal scroll
            iframe.contentDocument.documentElement.style.overflow = 'hidden';
            iframe.contentDocument.body.style.overflow = 'hidden';
            
            // Forward mouse wheel events perfectly to the parent page
            const scrollContainer = document.querySelector('.flip-page .back .page-content');
            iframe.contentWindow.addEventListener('wheel', (e) => {
              e.preventDefault();
              scrollContainer.scrollTop += e.deltaY;
            }, { passive: false });
          } catch(err) {
            console.warn("Could not bind iframe scroll:", err);
          }
        };
      }
    }

    document.getElementById('componentDemoContainer').innerHTML = '';
    if (previewSection) document.getElementById('componentDemoContainer').appendChild(previewSection);
    
    document.getElementById('componentCodeContainer').innerHTML = '';
    if (codeSection) document.getElementById('componentCodeContainer').appendChild(codeSection);
    
    try {
      const compId = path.split('/').filter(Boolean).pop();
      const mod = await import(`../../components/${compId}/viewer.js`);
      if (mod && mod.init) {
        mod.init();
      }
    } catch (err) {
      console.warn("No viewer.js found or failed to load:", err);
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

    gsap.to('.flip-page', {
      rotateY: -180,
      duration: 1.5,
      ease: "power3.inOut",
      onComplete: () => {
        // Hide front face completely to kill IntersectionObserver (unloads videos)
        // and prevent it from intercepting mouse events from the left page.
        const frontFace = document.querySelector('.flip-page .front');
        if (frontFace) {
          frontFace.style.display = 'none';
          frontFace.style.pointerEvents = 'none';
        }
      }
    });

  } catch(e) {
    console.error("Failed to load component:", e);
  }
}
