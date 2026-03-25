/* ===== SCRIPT.JS — Portfolio Logic ===== */

// ─── TYPED TEXT ───────────────────────────────────────────────────────────────
const en_phrases = [
  "Full-Stack Developer",
  "Angular & Laravel Specialist",
  "React & Node.js Engineer",
  "UI/UX Enthusiast",
  "NestJS & TypeScript Dev",
  "Systems Engineer"
];
const es_phrases = [
  "Desarrolladora Full-Stack",
  "Especialista en Angular & Laravel",
  "Ingeniería de Sistemas",
  "Apasionada por el UI/UX",
  "NestJS & TypeScript Dev",
  "React & Node.js Engineer"
];

let phraseIndex = 0, charIndex = 0, isDeleting = false;
let currentPhrases = en_phrases;

function typeEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const phrase = currentPhrases[phraseIndex];
  if (isDeleting) {
    el.textContent = phrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    el.textContent = phrase.substring(0, charIndex + 1);
    charIndex++;
  }
  let delay = isDeleting ? 40 : 90;
  if (!isDeleting && charIndex === phrase.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % currentPhrases.length;
    delay = 400;
  }
  setTimeout(typeEffect, delay);
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('va-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('va-theme', next);
});

// ─── LANGUAGE TOGGLE ──────────────────────────────────────────────────────────
const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
let lang = localStorage.getItem('va-lang') || 'en';

function applyLanguage() {
  const isEs = lang === 'es';
  langLabel.textContent = isEs ? 'EN' : 'ES';
  currentPhrases = isEs ? es_phrases : en_phrases;
  document.querySelectorAll('[data-en]').forEach(el => {
    const attr = isEs ? 'data-es' : 'data-en';
    if (el.getAttribute(attr)) el.textContent = el.getAttribute(attr);
  });
  // Special handling: html lang attr
  document.documentElement.lang = isEs ? 'es' : 'en';
}

applyLanguage();

langToggle.addEventListener('click', () => {
  lang = lang === 'en' ? 'es' : 'en';
  localStorage.setItem('va-lang', lang);
  applyLanguage();
});

// ─── NAVBAR SCROLL ────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ─── HAMBURGER MENU ───────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ─── SMOOTH ACTIVE NAV ────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navItems.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--primary-light)' : '';
  });
});

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .info-card, .skill-category, .timeline-item, .contact-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// ─── PROJECT IMAGE LOADING STATE ──────────────────────────────────────────────
// Images come from thum.io live screenshots — show a loading shimmer while they load
document.querySelectorAll('.project-img').forEach((img) => {
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.6s ease';
  img.addEventListener('load', function () {
    this.style.opacity = '1';
  });
  img.addEventListener('error', function () {
    // If screenshot service fails, show a minimal placeholder
    this.parentElement.style.background = 'linear-gradient(135deg, var(--bg-alt), var(--bg-card))';
    this.style.display = 'none';
  });
});

// ─── COUNTER ANIMATION ────────────────────────────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '+');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const val = parseInt(el.textContent);
        if (!isNaN(val)) {
          el.dataset.suffix = el.textContent.replace(/\d/g, '');
          animateCounter(el, val);
        }
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeEffect, 800);
});

// ─── MALLKU MODAL ─────────────────────────────────────────────────────────────
let mallkuCurrentSlide = 0;
const mallkuSlideCount = 3;

function openMallkuModal() {
  const modal = document.getElementById('mallkuModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  initMallkuCarousel();
  // Apply current language to modal elements
  applyLanguage();
}

function closeMallkuModal(e) {
  if (e && e.target !== document.getElementById('mallkuModal')) return;
  document.getElementById('mallkuModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Close with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('mallkuModal').classList.remove('open');
    document.body.style.overflow = '';
  }
});

function initMallkuCarousel() {
  mallkuCurrentSlide = 0;
  updateMallkuCarousel();

  // Build dots
  const dotsContainer = document.getElementById('mallkuDots');
  if (dotsContainer && !dotsContainer.hasChildNodes()) {
    for (let i = 0; i < mallkuSlideCount; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.onclick = () => { mallkuCurrentSlide = i; updateMallkuCarousel(); };
      dotsContainer.appendChild(dot);
    }
  }

  // Lazy load images when modal opens
  document.querySelectorAll('.carousel-slide img').forEach(img => {
    img.addEventListener('load', function() { this.classList.add('loaded'); });
    if (img.complete) img.classList.add('loaded');
  });
}

function mallkuSlide(dir) {
  mallkuCurrentSlide = (mallkuCurrentSlide + dir + mallkuSlideCount) % mallkuSlideCount;
  updateMallkuCarousel();
}

function updateMallkuCarousel() {
  const track = document.getElementById('mallkuTrack');
  if (track) track.style.transform = `translateX(-${mallkuCurrentSlide * 100}%)`;

  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === mallkuCurrentSlide);
  });
}

