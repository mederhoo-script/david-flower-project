/* ── Constants ──────────────────────────────────────────────────────────── */
const WA_NUMBER  = '2348034295030';
const WA_ENQUIRY = encodeURIComponent("Hello David Flower Project! 🌸 I'd like to place a flower order.");
const WA_FAB_URL = `https://wa.me/${WA_NUMBER}?text=${WA_ENQUIRY}`;

/* ── Tailwind custom colours used via JS-generated HTML ─────────────────── */
const BADGE_CLS = {
  New:      'bg-[#0A1A0A]',
  Trending: 'bg-[#2D6A2D]',
  Popular:  'bg-[#228B22]',
  Premium:  'bg-[#1A4A1A]',
  Fragrant: 'bg-[#3D8C3D]',
};

/* ── Navbar ──────────────────────────────────────────────────────────────── */
function initNavbar() {
  /* Scroll tint */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('shadow-lg');
      } else {
        navbar.classList.remove('shadow-lg');
      }
    }, { passive: true });
  }

  /* Mobile menu toggle */
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('hidden') === false;
      const spans = btn.querySelectorAll('span');
      if (open) {
        spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px);background:#00cc00';
        spans[1].style.opacity = '0';
        spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px);background:#00cc00';
      } else {
        spans[0].style.cssText = '';
        spans[1].style.opacity = '';
        spans[2].style.cssText = '';
      }
    });
  }

  /* Active link */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.dataset.page === page) el.classList.add('active', '!text-[#00cc00]');
  });

  /* Year */
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();
}

/* ── Hero Carousel ───────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  { bg: 'images/regal/regal-mixed-roses-million-stars.jpg',  tag: 'Fresh Arrivals',    title: "Nature's Finest Blooms",    subtitle: 'Curated flowers from seasonal gardens and exotic tropics',          cta: 'collections.html' },
  { bg: 'images/regal/regal-mixed-roses-yellow-red.jpg',     tag: 'Most Popular',      title: 'Garden Romance',            subtitle: "Lush roses and classic blooms — nature's most beloved arrangements", cta: 'collections.html' },
  { bg: 'images/regal/regal-red-roses-ferrero.jpg',          tag: 'Special Occasions', title: 'Rare & Beautiful',          subtitle: 'Stunning arrangements perfect for weddings, gifts & celebrations',    cta: 'contact.html' },
  { bg: 'images/regal/regal-chrysanthemums.jpg',             tag: 'Spring Collection', title: 'First Blooms of Spring',    subtitle: 'Elegant seasonal flowers heralding the arrival of a new season',    cta: 'collections.html' },
  { bg: 'images/regal/regal-popular-bundled.jpg',            tag: 'Seasonal Picks',    title: 'Rich & Vibrant',            subtitle: 'Bold colours and warm arrangements to brighten any space',           cta: 'collections.html' },
];
const N = HERO_SLIDES.length;

function initHero() {
  const root = document.getElementById('hero');
  if (!root) return;

  let cur = 0, autoTimer = null, dragging = false, tx0 = 0, ty0 = 0, dragPx = 0;

  /* Build DOM */
  root.innerHTML = `
    <div id="h-wrap" class="relative w-full h-full overflow-hidden" style="touch-action:pan-y">
      <div id="h-track" class="flex h-full will-change-transform" style="width:${N*100}%;transform:translateX(0);transition:transform .5s cubic-bezier(.25,.46,.45,.94)">
        ${HERO_SLIDES.map((s,i)=>`
          <div class="relative h-full flex-shrink-0" style="width:${100/N}%">
            <img src="${s.bg}" alt="${s.title}" class="w-full h-full object-cover object-center no-drag" ${i===0?'fetchpriority="high"':'loading="lazy"'}>
            <div class="absolute inset-0 bg-black/50"></div>
          </div>`).join('')}
      </div>
      <div class="absolute top-0 inset-x-0 h-px bg-[#2D6A2D]/50 z-20"></div>
      <div id="h-content" class="absolute inset-0 z-20 flex flex-col justify-end px-8 md:px-16 lg:px-20 pb-24 pointer-events-none"></div>
      <button onclick="heroPrev()" aria-label="Previous" class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 hidden md:flex items-center justify-center border border-white/50 text-white bg-white/10 hover:bg-white/25 transition-all">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button onclick="heroNext()" aria-label="Next" class="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 hidden md:flex items-center justify-center border border-white/50 text-white bg-white/10 hover:bg-white/25 transition-all">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div id="h-dots" class="absolute bottom-6 left-8 md:left-16 z-30 flex items-center gap-2.5"></div>
      <div class="absolute bottom-0 inset-x-0 h-0.5 bg-white/10 z-30">
        <div id="h-prog" class="h-full bg-[#00cc00] w-0"></div>
      </div>
    </div>`;

  const track   = document.getElementById('h-track');
  const content = document.getElementById('h-content');
  const dots    = document.getElementById('h-dots');
  const wrap    = document.getElementById('h-wrap');
  const prog    = document.getElementById('h-prog');

  function goTo(idx) {
    cur = ((idx % N) + N) % N;
    track.style.transition = 'transform .5s cubic-bezier(.25,.46,.45,.94)';
    track.style.transform  = `translateX(${-(cur * 100/N)}%)`;
    /* content */
    const s = HERO_SLIDES[cur];
    content.innerHTML = `
      <p class="font-inter text-[11px] tracking-[.45em] uppercase text-[#00cc00] mb-5 animate-hero-fade-up">${s.tag}</p>
      <h1 class="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-4 animate-hero-fade-up" style="animation-delay:.08s">${s.title}</h1>
      <p class="font-inter text-sm text-white/70 max-w-xs mb-8 leading-relaxed animate-hero-fade-up hidden sm:block" style="animation-delay:.15s">${s.subtitle}</p>
      <div class="flex flex-col sm:flex-row items-start gap-3 animate-hero-fade-up pointer-events-auto" style="animation-delay:.22s">
        <a href="${s.cta}" class="inline-block px-8 py-3.5 bg-[#2D6A2D] text-white font-inter font-medium text-xs tracking-widest uppercase hover:bg-[#3D8C3D] transition-all">Shop This Flower</a>
        <a href="collections.html" class="font-inter text-[11px] tracking-[.3em] uppercase border border-white/70 text-white px-8 py-3.5 hover:bg-white/10 transition-colors">Discover More</a>
      </div>`;
    /* dots */
    dots.innerHTML = HERO_SLIDES.map((_,i)=>`
      <button onclick="heroGoTo(${i})" aria-label="Slide ${i+1}" class="transition-all duration-300 ${i===cur?'w-7 h-[3px] rounded-none bg-[#00cc00]':'w-[6px] h-[6px] rounded-full bg-white/50 hover:bg-white/80'}"></button>`).join('');
    /* progress */
    prog.classList.remove('animate-hero-progress');
    void prog.offsetWidth;
    prog.classList.add('animate-hero-progress');
  }

  window.heroGoTo = goTo;
  window.heroNext = () => goTo(cur + 1);
  window.heroPrev = () => goTo(cur - 1);

  function startAuto() { stopAuto(); autoTimer = setInterval(() => goTo(cur+1), 5000); }
  function stopAuto()  { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

  /* Touch */
  wrap.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; dragging = true; stopAuto(); }, { passive: true });
  wrap.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - tx0, dy = e.touches[0].clientY - ty0;
    if (Math.abs(dx) > Math.abs(dy)) {
      dragPx = Math.max(-wrap.offsetWidth*.8, Math.min(wrap.offsetWidth*.8, dx));
      track.style.transition = 'none';
      track.style.transform  = `translateX(calc(${-(cur*100/N)}% + ${dragPx}px))`;
    }
  }, { passive: true });
  wrap.addEventListener('touchend', e => {
    if (!dragging) return; dragging = false;
    const dx = e.changedTouches[0].clientX - tx0;
    if (Math.abs(dx) > 40) { dx < 0 ? window.heroNext() : window.heroPrev(); } else { goTo(cur); }
    dragPx = 0; startAuto();
  });

  root.addEventListener('mouseenter', stopAuto);
  root.addEventListener('mouseleave', startAuto);
  window.addEventListener('keydown', e => { if (e.key==='ArrowLeft') window.heroPrev(); if (e.key==='ArrowRight') window.heroNext(); });

  goTo(0);
  startAuto();
}

/* ── Trending Auto-Scroll Carousel ──────────────────────────────────────── */
function initTrending(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap || typeof DESIGNS === 'undefined') return;

  const all = [...DESIGNS, ...DESIGNS];
  const track = document.createElement('div');
  track.className = 'flex will-change-transform';
  track.style.transform = 'translateX(0)';

  all.forEach(d => {
    const img = d.image.replace(/^\//, '');
    const a = document.createElement('a');
    a.href = 'collections.html';
    a.className = 'flex-shrink-0 w-[40vw] md:w-[22vw] px-1.5 block group no-drag';
    a.draggable = false;
    a.innerHTML = `
      <div class="aspect-[3/4] overflow-hidden bg-[#E8F0E8] rounded-2xl">
        <img src="${img}" alt="${d.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 no-drag" loading="lazy">
      </div>
      <p class="font-playfair text-sm font-semibold text-[#0A1A0A] mt-2 truncate px-0.5">${d.title}</p>`;
    track.appendChild(a);
  });

  wrap.innerHTML = '';
  wrap.appendChild(track);

  const SPEED = 0.09;
  let offset = 0, raf = null, lastT = null, touching = false, tStartX = 0, tStartOff = 0;

  function halfW() { return track.scrollWidth / 2; }
  function tick(t) {
    if (!touching && lastT !== null) {
      offset += SPEED * (t - lastT);
      const h = halfW(); if (h && offset >= h) offset -= h;
      track.style.transform = `translateX(-${offset}px)`;
    }
    lastT = t; raf = requestAnimationFrame(tick);
  }
  function start() { lastT = null; raf = requestAnimationFrame(tick); }
  function stop()  { if (raf) { cancelAnimationFrame(raf); raf = null; } lastT = null; }

  wrap.addEventListener('mouseenter', stop);
  wrap.addEventListener('mouseleave', start);
  wrap.addEventListener('touchstart', e => { touching = true; tStartX = e.touches[0].clientX; tStartOff = offset; stop(); }, { passive: true });
  wrap.addEventListener('touchmove', e => {
    if (!touching) return;
    const dx = tStartX - e.touches[0].clientX;
    const h = halfW(); let o = tStartOff + dx; if (h) o = ((o%h)+h)%h;
    offset = o; track.style.transform = `translateX(-${offset}px)`;
  }, { passive: true });
  wrap.addEventListener('touchend', () => { touching = false; start(); });
  start();
}

/* ── Flower Grid ─────────────────────────────────────────────────────────── */
function renderFlowerGrid(containerId, designs, qv = true) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6';
  el.innerHTML = designs.map((d, i) => {
    const img  = d.image.replace(/^\//, '');
    const badge = d.badge
      ? `<span class="absolute top-3 left-3 z-10 font-inter text-[9px] tracking-[.15em] uppercase px-2 py-0.5 text-white ${BADGE_CLS[d.badge]||'bg-[#1A2E1A]'}">${d.badge}</span>` : '';
    const qvBtns = qv ? `
      <button onclick="openQV('${d.id}')" aria-label="Quick view ${d.title}" class="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-white/90 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#2D6A2D] hover:text-white hover:border-[#2D6A2D]">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
      <div class="quick-view-bar absolute bottom-0 inset-x-0 z-10">
        <button onclick="openQV('${d.id}')" class="flex items-center justify-center gap-1.5 w-full font-inter text-[10px] tracking-[.25em] uppercase bg-white/95 text-[#0A1A0A] py-3 hover:bg-[#2D6A2D] hover:text-white transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Quick View
        </button>
      </div>` : '';
    const desc = d.description ? d.description.split('.')[0] + '.' : '';
    return `
      <article class="flower-card group flex flex-col bg-white overflow-hidden rounded-xl shadow-sm">
        <div class="relative aspect-[3/4] overflow-hidden bg-[#E8F0E8] cursor-pointer rounded-t-xl" onclick="openQV('${d.id}')">
          <img src="${img}" alt="${d.title}" class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="${i<8?'eager':'lazy'}">
          ${badge}${qvBtns}
        </div>
        <div class="pt-3 pb-4 px-3">
          <p class="font-inter text-[10px] tracking-widest uppercase text-[#00cc00] mb-1">${d.category}</p>
          <h3 class="font-playfair text-base font-medium text-[#0A1A0A] leading-snug cursor-pointer hover:text-[#00cc00] transition-colors mb-2" onclick="openQV('${d.id}')">${d.title}</h3>
          ${desc ? `<p class="font-inter text-xs text-[#1A2E1A]/60 leading-relaxed line-clamp-2">${desc}</p>` : ''}
        </div>
      </article>`;
  }).join('');
}

/* ── Regal Gallery ───────────────────────────────────────────────────────── */
function renderRegalGallery(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof DESIGNS === 'undefined') return;
  const regal = DESIGNS.filter(d => d.id.startsWith('regal'));
  el.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
  el.innerHTML = regal.map((d,i) => `
    <a href="collections.html" class="group block">
      <div class="relative aspect-[3/4] overflow-hidden bg-white">
        <img src="${d.image.replace(/^\//,'')}" alt="${d.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" ${i<4?'fetchpriority="high"':'loading="lazy"'}>
      </div>
      <p class="font-playfair text-sm text-[#0A1A0A] mt-2 truncate">${d.title}</p>
    </a>`).join('');
}

/* ── Collections Season Grid ─────────────────────────────────────────────── */
function renderSeasonGrid(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof COLLECTIONS === 'undefined') return;
  el.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8';
  el.innerHTML = COLLECTIONS.map(c => `
    <div class="group cursor-pointer">
      <a href="collections.html">
        <div class="relative aspect-[3/4] overflow-hidden bg-[#E8F0E8] mb-4">
          <img src="${c.image.replace(/^\//,'')}" alt="${c.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
        </div>
        <p class="font-inter text-xs tracking-widest uppercase text-[#00cc00] mb-1">${c.category}</p>
        <h3 class="font-playfair text-lg text-[#0A1A0A]">${c.title}</h3>
      </a>
    </div>`).join('');
}

/* ── Testimonials ────────────────────────────────────────────────────────── */
function renderTestimonials(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof TESTIMONIALS === 'undefined') return;
  el.className = 'grid grid-cols-1 md:grid-cols-3 gap-6';
  el.innerHTML = TESTIMONIALS.map(t => `
    <div class="bg-[#0A1A0A]/5 border border-[#2D6A2D]/20 p-8">
      <div class="text-[#00cc00] text-4xl font-playfair mb-4 leading-none">&ldquo;</div>
      <p class="font-playfair italic text-base text-[#1A2E1A]/90 leading-relaxed mb-6">${t.quote}</p>
      <div class="w-8 h-px bg-[#00cc00] mb-4"></div>
      <p class="font-inter text-sm font-medium text-[#0A1A0A]">${t.name}</p>
      <p class="font-inter text-xs text-[#00cc00] tracking-wide">${t.title}</p>
    </div>`).join('');
}

/* ── Quick View Modal ────────────────────────────────────────────────────── */
const QV_TABS = {
  'Description':
    'Each flower in our catalog is hand-selected for freshness, color, and form. We source directly from trusted growers to ensure you receive only the finest blooms, delivered at peak beauty.',
  'Care & Vase Life':
    '• Re-cut stems at a 45° angle before placing in water\n• Remove leaves below the water line\n• Change water every 2–3 days\n• Keep away from direct sunlight and heat sources\n• Most flowers last 5–14 days with proper care',
  'Order Info':
    'Orders can be placed via WhatsApp or our contact form. Same-day delivery available for orders placed before noon. Minimum order: 1 bunch (~10 stems). Custom arrangements available on request.',
};

let _qvData = [];

function initQV(designs) { _qvData = designs; }

function openQV(id) {
  const d = _qvData.find(x => x.id === id);
  if (!d) return;

  let modal = document.getElementById('qv-overlay');
  if (!modal) { modal = document.createElement('div'); modal.id = 'qv-overlay'; document.body.appendChild(modal); }

  document.body.style.overflow = 'hidden';
  const img  = d.image.replace(/^\//, '');
  const badge = d.badge
    ? `<span class="absolute top-3 left-3 z-10 font-inter text-[9px] tracking-[.15em] uppercase px-2 py-0.5 text-white ${BADGE_CLS[d.badge]||'bg-[#1A2E1A]'}">${d.badge}</span>` : '';
  const sym = d.symbolism
    ? `<div class="bg-[#E8F0E8] border-l-2 border-[#2D6A2D] px-4 py-3"><p class="font-inter text-xs text-[#1A2E1A]/70 leading-relaxed italic">🌿 ${d.symbolism}</p></div>` : '';
  const related = _qvData.filter(x => x.category === d.category && x.id !== d.id).slice(0, 8);
  const waMsg   = encodeURIComponent(`Hello David Flower Project! 🌸\n\nI'm interested in ordering *${d.title}* (${d.category}).\n\nPlease confirm availability and arrange delivery. Thank you!`);
  const waUrl   = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;
  const WA_SVG  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

  modal.className = 'fixed inset-0 z-[200] bg-white overflow-y-auto animate-fade-in';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <button onclick="closeQV()" aria-label="Close" class="fixed top-4 right-4 z-[210] w-10 h-10 flex items-center justify-center bg-white border border-gray-200 shadow-sm hover:bg-[#0A1A0A] hover:text-white transition-colors">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="border-b border-gray-100 px-6 py-3 flex items-center gap-2 font-inter text-xs text-[#1A2E1A]/50">
      <button onclick="closeQV()" class="hover:text-[#00cc00] transition-colors">Home</button>
      <span>/</span>
      <a href="collections.html" onclick="closeQV()" class="hover:text-[#00cc00] transition-colors">${d.category}</a>
      <span>/</span>
      <span class="text-[#0A1A0A]">${d.title}</span>
    </div>
    <div class="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8 lg:gap-14">
      <div class="md:w-[48%] flex-shrink-0">
        <div class="relative aspect-[3/4] bg-[#E8F0E8] overflow-hidden">
          <img src="${img}" alt="${d.title}" class="w-full h-full object-contain">
          ${badge}
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-5">
        <p class="font-inter text-[10px] tracking-[.4em] uppercase text-[#00cc00]">${d.category}</p>
        <h1 class="font-playfair text-2xl md:text-3xl font-semibold leading-snug text-[#0A1A0A]">${d.title}</h1>
        <div class="w-10 h-px bg-[#00cc00]"></div>
        <p class="font-inter text-sm text-[#1A2E1A]/70 leading-relaxed">${d.description}</p>
        ${sym}
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 w-full font-inter text-xs tracking-[.2em] uppercase py-4 bg-[#2D6A2D] text-white hover:bg-[#0A1A0A] transition-colors">${WA_SVG} Enquire via WhatsApp</a>
        <a href="contact.html" onclick="closeQV()" class="flex items-center justify-center w-full font-inter text-xs tracking-[.2em] uppercase border border-[#0A1A0A] text-[#0A1A0A] py-3 hover:bg-[#0A1A0A] hover:text-white transition-colors">Contact Us for Custom Order</a>
        <p class="font-inter text-[10px] text-[#1A2E1A]/40 text-center">Fresh daily · Custom arrangements available</p>
        <div class="border-t border-gray-100 mt-2">
          ${Object.entries(QV_TABS).map(([tab, body]) => `
            <div class="border-b border-gray-100">
              <button onclick="toggleQVTab(this)" class="w-full flex items-center justify-between py-4 font-inter text-xs tracking-[.15em] uppercase text-[#0A1A0A] hover:text-[#00cc00] transition-colors">
                ${tab}<span class="text-lg leading-none qv-icon">+</span>
              </button>
              <div class="qv-acc-body pb-4 font-inter text-sm text-[#1A2E1A]/70 leading-relaxed whitespace-pre-line">${body}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>
    ${related.length ? `
    <section class="border-t border-gray-100 bg-[#E8F0E8] px-4 md:px-8 py-12">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8">
          <p class="font-inter text-[10px] tracking-[.4em] uppercase text-[#00cc00] mb-2">Discover More</p>
          <h2 class="font-playfair text-2xl md:text-3xl font-semibold text-[#0A1A0A]">You May Also Like</h2>
        </div>
        <div class="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          ${related.map(r=>`
            <button onclick="openQV('${r.id}')" class="flex-shrink-0 w-40 md:w-48 text-left group">
              <div class="aspect-[3/4] overflow-hidden bg-white">
                <img src="${r.image.replace(/^\//,'')}" alt="${r.title}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy">
              </div>
              <p class="font-inter text-[10px] tracking-widest uppercase text-[#00cc00] mt-2 mb-0.5">${r.category}</p>
              <p class="font-playfair text-sm font-medium leading-snug line-clamp-2 text-[#0A1A0A] group-hover:text-[#00cc00] transition-colors text-left">${r.title}</p>
            </button>`).join('')}
        </div>
      </div>
    </section>` : ''}`;
  modal.scrollTop = 0;
}

function closeQV() {
  const m = document.getElementById('qv-overlay');
  if (m) m.remove();
  document.body.style.overflow = '';
}

function toggleQVTab(btn) {
  const body = btn.nextElementSibling;
  const icon = btn.querySelector('.qv-icon');
  const isOpen = body.classList.contains('open');
  document.querySelectorAll('#qv-overlay .qv-acc-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('#qv-overlay .qv-icon').forEach(ic => { ic.textContent = '+'; });
  if (!isOpen) { body.classList.add('open'); icon.textContent = '−'; }
}

window.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('qv-overlay')) closeQV(); });

/* ── Contact Form ────────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name     = form.querySelector('[name="name"]').value;
    const occasion = form.querySelector('[name="occasion"]').value;
    const message  = form.querySelector('[name="message"]').value;
    const msg  = `Hello, my name is ${name}. I would like to place a flower order${occasion ? ` for ${occasion}` : ''}. ${message || ''}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    form.style.display = 'none';
    const ok = document.getElementById('form-success');
    if (ok) ok.classList.remove('hidden');
  });
}

/* ── Boot ────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  document.getElementById('footer-year') && (document.getElementById('footer-year').textContent = new Date().getFullYear());
});
