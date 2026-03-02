/* ── COLLECTIONS PAGE JS ─────────────────────────────────────────────────── */

/* makeFlowerCard and openQuickView are defined in home.js but we re-use here.
   Since both scripts are loaded, we define them only in home.js and use here. */

function buildFullCatalog() {
  const grid = document.getElementById('catalog-grid');
  const countEl = document.getElementById('catalog-count');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!grid || !DESIGNS) return;

  if (countEl) countEl.textContent = `${DESIGNS.length} varieties available`;

  let activeCategory = 'All';

  function renderGrid() {
    grid.innerHTML = '';
    const filtered = activeCategory === 'All'
      ? DESIGNS
      : DESIGNS.filter(d => d.category === activeCategory);
    filtered.forEach(d => grid.appendChild(makeFlowerCard(d, openQuickView)));
    if (countEl) countEl.textContent = `${filtered.length} varieties available`;
  }

  // Category filters
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.category;
        filterBtns.forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');
        renderGrid();
      });
    });
  }

  renderGrid();
}

document.addEventListener('DOMContentLoaded', buildFullCatalog);
