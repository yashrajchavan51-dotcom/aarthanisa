// Header scroll state
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navMenu = document.querySelector('.nav-menu');

const closeMenu = () => {
  if (navLinks) navLinks.classList.remove('is-open');
  if (navToggle) navToggle.classList.remove('is-active');
};

const onScroll = () => {
  if (navLinks && navLinks.classList.contains('is-open')) closeMenu(); // any scroll closes an open menu instantly
  const wasScrolled = header.classList.contains('is-scrolled');
  const isScrolled = window.scrollY > 40;
  if (isScrolled !== wasScrolled) {
    header.classList.toggle('is-scrolled', isScrolled);
  }
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu toggle (full row up top on wide screens; compact dropdown once scrolled or on narrow screens)
if (navToggle && navLinks) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-active');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeMenu)
  );
  document.addEventListener('click', (e) => {
    if (navMenu && !navMenu.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// Project filter (projects.html)
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card, .project-feature');
if (filterButtons.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });
}

// Quote carousel (home page) — crossfades between quote slides
const quoteSlides = document.querySelectorAll('.quote-carousel__slide');
if (quoteSlides.length > 1) {
  let quoteIndex = 0;
  setInterval(() => {
    quoteSlides[quoteIndex].classList.remove('is-active');
    quoteIndex = (quoteIndex + 1) % quoteSlides.length;
    quoteSlides[quoteIndex].classList.add('is-active');
  }, 5000);
}
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message sent';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; contactForm.reset(); }, 2600);
  });
}

// About section (home page): make the photo's bottom edge land exactly on
// the text column's bottom edge (where "The Full Story" button ends),
// instead of the image dictating its own height and overshooting it.
// (about-section photo now uses a fixed generous size in CSS instead of
// being height-matched to the text column — see .about-photo-wrap)
