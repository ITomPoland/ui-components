const components = [
  {
    id: 'magnetic-button',
    name: 'Magnetic Button',
    description: 'GSAP powered magnetic hover effect',
    tags: ['button'],
    path: './components/magnetic-button/'
  },
  // Add future components here
];

const grid = document.getElementById('componentsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderComponents(filter = 'all') {
  grid.innerHTML = '';
  
  const filtered = filter === 'all' 
    ? components 
    : components.filter(c => c.tags.includes(filter));

  filtered.forEach(comp => {
    const card = document.createElement('a');
    card.href = comp.path;
    card.className = 'component-card';
    
    // Instead of a GIF, we embed the actual component in a non-interactive iframe for a true live preview
    card.innerHTML = `
      <div class="card-preview">
        <iframe src="${comp.path}preview.html" scrolling="no" tabindex="-1"></iframe>
      </div>
      <div class="card-info">
        <h2>${comp.name}</h2>
        <p>${comp.description}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Initialize filters
filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Update active state
    document.querySelector('.filter-btn.active').classList.remove('active');
    e.target.classList.add('active');
    
    // Render
    renderComponents(e.target.dataset.filter);
  });
});

// Initial render
renderComponents();
