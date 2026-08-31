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

// Quote section (home page) now shows one fixed quote — no rotation needed.

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
// About section (home page): the photo frame's top/bottom exactly match
// the text column's — from the first paragraph's top to the last
// paragraph's bottom — instead of using a fixed height.
function syncAboutPhotoHeight(){
  const split = document.querySelector('.about-split');
  const photoWrap = document.querySelector('.about-photo-wrap');
  if (!split || !photoWrap) return;
  if (window.matchMedia('(max-width: 820px)').matches) {
    photoWrap.style.height = ''; // let the mobile CSS value apply instead
    return;
  }
  const left = split.children[0];
  if (!left) return;
  const leftRect = left.getBoundingClientRect();
  const available = leftRect.bottom - leftRect.top;
  photoWrap.style.height = available > 100 ? available + 'px' : '';
}
window.addEventListener('load', syncAboutPhotoHeight);
window.addEventListener('resize', syncAboutPhotoHeight);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(syncAboutPhotoHeight);
}
