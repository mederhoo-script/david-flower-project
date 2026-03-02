/* ── HOMEPAGE JS ─────────────────────────────────────────────────────────── */

const WA_NUM = '2348034295030';

/* ── HERO CAROUSEL ───────────────────────────────────────────────────────── */
const SLIDES = [
  {
    bg: 'public/images/regal/regal-mixed-roses-million-stars.jpg',
    tag: 'Fresh Arrivals',
    title: "Nature's Finest Blooms",
    subtitle: 'Curated flowers from seasonal gardens and exotic tropics',
    ctaHref: 'collections.html',
  },
  {
    bg: 'public/images/regal/regal-mixed-roses-yellow-red.jpg',
    tag: 'Most Popular',
    title: 'Garden Romance',
    subtitle: "Lush roses and classic blooms — nature's most beloved arrangements",
    ctaHref: 'collections.html',
  },
  {
    bg: 'public/images/regal/regal-red-roses-ferrero.jpg',
    tag: 'Special Occasions',
    title: 'Rare & Beautiful',
    subtitle: 'Stunning arrangements perfect for weddings, gifts, and celebrations',
    ctaHref: 'contact.html',
  },
  {
    bg: 'public/images/regal/regal-chrysanthemums.jpg',
    tag: 'Spring Collection',
    title: 'First Blooms of Spring',
    subtitle: 'Elegant seasonal flowers heralding the arrival of a new season',
    ctaHref: 'collections.html',
  },
  {
    bg: 'public/images/regal/regal-popular-bundled.jpg',
    tag: 'Seasonal Picks',
    title: 'Rich & Vibrant',
    subtitle: 'Bold colours and warm arrangements to brighten any space',
    ctaHref: 'collections.html',
  },
];

const AUTOPLAY_MS = 5000;

function initHero() {
  const track   = document.getElementById('hero-track');
  const dotsEl  = document.getElementById('hero-dots');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  const contentEl = document.getElementById('hero-content');
  const progressBar = document.getElementById('hero-progress-bar');
  if (!track) return;

  let current = 0;
  let timer = null;
  let touchStartX = 0;
  let progressTimer = null;

  // Build slides
  SLIDES.forEach(s => {
    const div = document.createElement('div');
    div.className = 'hero-slide';
    div.innerHTML = `<img src="${s.bg}" alt="${s.title}" loading="eager"><div class="overlay"></div>`;
    track.appendChild(div);
  });

  // Build dots
  SLIDES.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'hero-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(btn);
  });

  function updateContent() {
    const s = SLIDES[current];
    contentEl.innerHTML = `
      <p class="hero-tag">${s.tag}</p>
      <h1 class="hero-title">${s.title}</h1>
      <p class="hero-subtitle">${s.subtitle}</p>
      <div class="hero-btns">
        <a href="${s.ctaHref}" class="btn-primary">Shop This Flower</a>
        <a href="collections.html" class="btn-outline-white">Discover More</a>
      </div>`;
    contentEl.style.animation = 'none';
    contentEl.offsetHeight; // reflow
    contentEl.style.animation = 'fadeUp .6s ease-out both';
  }

  function updateDots() {
    dotsEl.querySelectorAll('.hero-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startProgress() {
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      progressBar.offsetHeight;
      progressBar.style.transition = `width ${AUTOPLAY_MS}ms linear`;
      progressBar.style.width = '100%';
    }
  }

  function goTo(idx) {
    current = ((idx % SLIDES.length) + SLIDES.length) % SLIDES.length;
    track.style.transform = `translateX(-${current * 100}vw)`;
    updateContent();
    updateDots();
    startProgress();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Init
  updateContent();
  startProgress();
  startAuto();

  prevBtn && prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { next(); startAuto(); });

  // Keyboard
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { prev(); startAuto(); }
    if (e.key === 'ArrowRight') { next(); startAuto(); }
  });

  // Touch
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    heroEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
    heroEl.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      startAuto();
    }, { passive: true });
    heroEl.addEventListener('mouseenter', stopAuto);
    heroEl.addEventListener('mouseleave', startAuto);
  }
}

/* ── TRENDING CAROUSEL ───────────────────────────────────────────────────── */
function initTrending() {
  const wrap  = document.getElementById('trending-wrap');
  const track = document.getElementById('trending-track');
  if (!track || !DESIGNS) return;

  // Build card items
  const items = [...DESIGNS, ...DESIGNS]; // duplicate for seamless loop
  items.forEach(d => {
    const a = document.createElement('a');
    a.href = 'collections.html';
    a.className = 'trending-card';
    a.innerHTML = `
      <div class="trending-img">
        <img src="public${d.image}" alt="${d.title}" loading="lazy">
      </div>
      <p class="font-playfair text-sm font-semibold mt-2 px-0.5 truncate" style="color:var(--brand-black)">${d.title}</p>`;
    track.appendChild(a);
  });

  const SPEED = 0.09; // px/ms
  let offset = 0;
  let lastTime = null;
  let raf = null;
  let isTouching = false;
  let touchStartX2 = 0;
  let touchStartOffset = 0;

  function getHalfWidth() { return track.scrollWidth / 2; }

  function apply(px) { track.style.transform = `translateX(-${px}px)`; }

  function tick(time) {
    if (isTouching) return;
    if (lastTime !== null) {
      const dt = time - lastTime;
      offset += SPEED * dt;
      const half = getHalfWidth();
      if (half > 0 && offset >= half) offset -= half;
      apply(offset);
    }
    lastTime = time;
    raf = requestAnimationFrame(tick);
  }

  function startAuto() { lastTime = null; raf = requestAnimationFrame(tick); }
  function stopAuto()  { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } lastTime = null; }

  startAuto();

  if (wrap) {
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
    wrap.addEventListener('touchstart', e => {
      isTouching = true;
      touchStartX2 = e.touches[0].clientX;
      touchStartOffset = offset;
      stopAuto();
    }, { passive: true });
    wrap.addEventListener('touchmove', e => {
      if (!isTouching) return;
      const dx = touchStartX2 - e.touches[0].clientX;
      const half = getHalfWidth();
      let o = touchStartOffset + dx;
      if (half > 0) o = ((o % half) + half) % half;
      offset = o;
      apply(o);
    }, { passive: true });
    wrap.addEventListener('touchend', () => { isTouching = false; startAuto(); });
  }
}

/* ── HOME FLOWER PREVIEW (8 flowers) ─────────────────────────────────────── */
function buildHomeFlowers() {
  const grid = document.getElementById('home-flower-grid');
  if (!grid || !DESIGNS) return;
  DESIGNS.slice(0, 8).forEach(d => {
    grid.appendChild(makeFlowerCard(d, openQuickView));
  });
}

/* ── COLLECTIONS PREVIEW ─────────────────────────────────────────────────── */
function buildCollections() {
  const grid = document.getElementById('collections-preview');
  if (!grid || !COLLECTIONS) return;
  COLLECTIONS.slice(0, 3).forEach(c => {
    const div = document.createElement('div');
    div.className = 'coll-card group cursor-pointer';
    div.innerHTML = `
      <a href="collections.html">
        <div style="position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--beige);margin-bottom:1rem">
          <img src="public${c.image}" alt="${c.title}" style="width:100%;height:100%;object-fit:cover;display:block">
        </div>
        <p style="font-family:'Inter',system-ui,sans-serif;font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:.25rem">${c.category}</p>
        <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.125rem;color:var(--brand-black)">${c.title}</h3>
      </a>`;
    grid.appendChild(div);
  });
}

/* ── TESTIMONIALS ─────────────────────────────────────────────────────────── */
function buildTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid || !TESTIMONIALS) return;
  TESTIMONIALS.forEach(t => {
    const div = document.createElement('div');
    div.className = 'testimonial-card';
    div.innerHTML = `
      <div class="testimonial-stars">★★★★★</div>
      <p class="testimonial-quote">"${t.quote}"</p>
      <p class="testimonial-name">${t.name}</p>
      <p class="testimonial-author">${t.title}</p>`;
    grid.appendChild(div);
  });
}

/* ── QUICK VIEW (shared with collections.js) ─────────────────────────────── */
function openQuickView(design) {
  const modal = document.getElementById('quick-view');
  if (!modal) return;
  document.body.style.overflow = 'hidden';

  const badge = design.badge;
  const badgeClass = badge ? `badge-${badge.toLowerCase()}` : '';

  const related = DESIGNS.filter(d => d.category === design.category && d.id !== design.id).slice(0, 8);

  const waMsg = encodeURIComponent(`Hello David Flower Project! 🌸\n\nI'm interested in ordering *${design.title}* (${design.category}).\n\nPlease confirm availability and arrange delivery. Thank you!`);
  const waUrl = `https://wa.me/${WA_NUM}?text=${waMsg}`;

  const tabContents = {
    'Description': 'Each flower in our catalog is hand-selected for freshness, color, and form. We source directly from trusted growers to ensure you receive only the finest blooms, delivered at peak beauty.',
    'Care & Vase Life': '• Re-cut stems at a 45° angle before placing in water\n• Remove leaves below the water line\n• Change water every 2–3 days\n• Keep away from direct sunlight and heat sources\n• Most flowers last 5–14 days with proper care',
    'Order Info': 'Orders can be placed via WhatsApp or our contact form. Same-day delivery available for orders placed before noon. Minimum order: 1 bunch (approx. 10 stems). Custom arrangements available on request.',
  };

  const tabsHTML = Object.entries(tabContents).map(([tab, content]) => `
    <div class="qv-tab-item">
      <button class="qv-tab-btn" data-tab="${tab}">
        ${tab} <span class="qv-tab-icon">+</span>
      </button>
      <div class="qv-tab-content" id="tab-${tab.replace(/\s/g,'_')}">${content}</div>
    </div>`).join('');

  const relatedHTML = related.length ? `
    <div class="qv-related">
      <div class="qv-related-inner">
        <div style="text-align:center;margin-bottom:2rem">
          <p style="font-family:'Inter',system-ui,sans-serif;font-size:.625rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem">Discover More</p>
          <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:1.75rem;color:var(--brand-black)">You May Also Like</h2>
        </div>
        <div class="qv-related-strip">
          ${related.map(d => `
            <button class="qv-related-card" data-id="${d.id}" onclick="openQuickView(DESIGNS.find(x=>x.id==='${d.id}'))">
              <div class="qv-related-img"><img src="public${d.image}" alt="${d.title}" loading="lazy"></div>
              <p style="font-family:'Inter',system-ui,sans-serif;font-size:.625rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:.25rem">${d.category}</p>
              <p style="font-family:'Playfair Display',Georgia,serif;font-size:.875rem;color:var(--brand-black)">${d.title}</p>
            </button>`).join('')}
        </div>
      </div>
    </div>` : '';

  modal.innerHTML = `
    <button class="qv-close" onclick="closeQuickView()" aria-label="Close">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <div class="qv-breadcrumb">
      <button onclick="closeQuickView()" style="background:none;border:none;cursor:pointer;color:inherit;font-size:inherit;font-family:inherit">Home</button>
      <span>/</span>
      <a href="collections.html">${design.category}</a>
      <span>/</span>
      <span style="color:var(--brand-black)">${design.title}</span>
    </div>
    <div class="qv-body">
      <div class="qv-img-wrap">
        <div class="qv-img-inner">
          <img src="public${design.image}" alt="${design.title}">
          ${badge ? `<span class="flower-badge ${badgeClass}">${badge}</span>` : ''}
        </div>
      </div>
      <div class="qv-details">
        <p class="qv-category">${design.category}</p>
        <h1 class="qv-title">${design.title}</h1>
        <div class="qv-gold-line"></div>
        <p class="qv-desc">${design.description}</p>
        ${design.symbolism ? `<div class="qv-symbolism">🌿 ${design.symbolism}</div>` : ''}
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="qv-wa-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Enquire via WhatsApp
        </a>
        <a href="contact.html" class="qv-contact-btn">Contact Us for Custom Order</a>
        <p class="qv-note">Fresh daily · Custom arrangements available</p>
        <div class="qv-tabs">${tabsHTML}</div>
      </div>
    </div>
    ${relatedHTML}`;

  modal.classList.add('open');
  modal.scrollTop = 0;

  // Accordion tabs
  modal.querySelectorAll('.qv-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      const contentId = `tab-${tabName.replace(/\s/g,'_')}`;
      const contentEl = document.getElementById(contentId);
      const icon = btn.querySelector('.qv-tab-icon');
      const isOpen = contentEl.classList.contains('open');
      // Close all
      modal.querySelectorAll('.qv-tab-content').forEach(c => c.classList.remove('open'));
      modal.querySelectorAll('.qv-tab-icon').forEach(i => i.textContent = '+');
      // Toggle current
      if (!isOpen) {
        contentEl.classList.add('open');
        if (icon) icon.textContent = '−';
      }
    });
  });

  // Open first tab
  const firstTab = modal.querySelector('.qv-tab-btn');
  if (firstTab) firstTab.click();
}

function closeQuickView() {
  const modal = document.getElementById('quick-view');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── FLOWER CARD BUILDER (shared) ────────────────────────────────────────── */
function makeFlowerCard(d, onQuickView) {
  const badge = d.badge;
  const badgeClass = badge ? `badge-${badge.toLowerCase()}` : '';
  const article = document.createElement('article');
  article.className = 'flower-card';
  article.innerHTML = `
    <div class="flower-card-img">
      <img src="public${d.image}" alt="${d.title}" loading="lazy">
      ${badge ? `<span class="flower-badge ${badgeClass}">${badge}</span>` : ''}
      <button class="flower-quick-btn" aria-label="Quick view ${d.title}" title="Quick view">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
      <div class="flower-quick-bar">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
        Quick View
      </div>
    </div>
    <div class="flower-info">
      <p class="flower-category">${d.category}</p>
      <h3 class="flower-title">${d.title}</h3>
    </div>`;
  const qvFn = () => onQuickView(d);
  article.querySelector('.flower-card-img').addEventListener('click', qvFn);
  article.querySelector('.flower-quick-btn').addEventListener('click', e => { e.stopPropagation(); qvFn(); });
  article.querySelector('.flower-quick-bar').addEventListener('click', e => { e.stopPropagation(); qvFn(); });
  article.querySelector('.flower-title').addEventListener('click', qvFn);
  return article;
}

/* ── ESCAPE KEY ──────────────────────────────────────────────────────────── */
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQuickView(); });

/* ── INIT ─────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initTrending();
  buildHomeFlowers();
  buildCollections();
  buildTestimonials();
});
