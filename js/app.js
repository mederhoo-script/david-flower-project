/* ── SHARED APP JS ───────────────────────────────────────────────────────── */

const WA_NUMBER = '2348034295030';
const WA_GREETING = encodeURIComponent("Hello David Flower Project! 🌸 I'd like to place a flower order.");

/* ── NAVBAR ──────────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!navbar) return;

  // Scroll-based background
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile menu toggle
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      const bars = menuBtn.querySelectorAll('span');
      if (bars.length === 3) {
        bars[0].style.transform = isOpen ? 'rotate(45deg) translate(4px, 5px)' : '';
        bars[1].style.opacity   = isOpen ? '0' : '1';
        bars[2].style.transform = isOpen ? 'rotate(-45deg) translate(4px, -5px)' : '';
      }
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // Mark active link
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href') || '';
    const isHome = (href === 'index.html' || href === './') && (page === 'index.html' || page === '');
    const isMatch = href === page;
    if (isHome || isMatch) a.classList.add('active');
  });
}

/* ── WHATSAPP FAB ─────────────────────────────────────────────────────────── */
function initWAFab() {
  const fab = document.getElementById('wa-fab');
  if (fab) fab.href = `https://wa.me/${WA_NUMBER}?text=${WA_GREETING}`;
}

/* ── MARQUEE STRIP ───────────────────────────────────────────────────────── */
function buildMarquee() {
  const container = document.getElementById('marquee-inner');
  if (!container) return;
  const items = [
    'Fresh Daily Blooms',
    'Winter & Spring Flowers',
    'Summer Garden Varieties',
    'Tropical Exotics',
    'Custom Arrangements',
    'Same-Day Delivery',
  ];
  const sep = '\u00A0\u00A0\u2022\u00A0\u00A0';
  const text = items.join(sep) + sep;
  // Two copies for seamless loop
  container.innerHTML = `<span>${text}</span><span>${text}</span>`;
}

/* ── INIT ─────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initWAFab();
  buildMarquee();
});
