/* ===== SCRIPT.JS — Portfolio Logic ===== */

// ─── TYPED TEXT ───────────────────────────────────────────────────────────────
const en_phrases = [
  "Systems Engineer",
  "Mobile & Web Architecture",
  "Full Stack Solutions Expert",
  "Hardware & Software Integration",
  "AI & UX Specialist"
];
const es_phrases = [
  "Ingeniera de Sistemas",
  "Arquitecturas Móviles & Web",
  "Experta en Soluciones Full Stack",
  "Integración Hardware & Software",
  "Especialista en IA & UX"
];

let phraseIndex = 0, charIndex = 0, isDeleting = false;
let currentPhrases = en_phrases;
let typeTimeout = null;

function typeEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrase = currentPhrases[phraseIndex] || "";
  
  if (isDeleting) {
    el.textContent = phrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    el.textContent = phrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 30 : 70;

  if (!isDeleting && charIndex === phrase.length) {
    delay = 2500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % currentPhrases.length;
    delay = 500;
  }

  if (typeTimeout) clearTimeout(typeTimeout);
  typeTimeout = setTimeout(typeEffect, delay);
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

// Attention pulse for 5 seconds
themeToggle.classList.add('pulse-attention');
setTimeout(() => {
  themeToggle.classList.remove('pulse-attention');
}, 5000);

// ─── LANGUAGE TOGGLE ──────────────────────────────────────────────────────────
const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
let lang = localStorage.getItem('va-lang') || 'en';

function applyLanguage() {
  const isEs = lang === 'es';
  langLabel.textContent = isEs ? 'EN' : 'ES';
  currentPhrases = isEs ? es_phrases : en_phrases;
  
  // Reset typing effect to start from first phrase of new language
  phraseIndex = 0;
  charIndex = 0;
  isDeleting = false;
  if (typeTimeout) clearTimeout(typeTimeout);
  typeEffect();

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
  
  // Scroll Progress
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + "%";
  }
});

// ─── PARALLAX ORBS ────────────────────────────────────────────────────────────
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.orb');
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  orbs.forEach((orb, i) => {
    const speed = (i + 1) * 20;
    const offsetX = (x - 0.5) * speed;
    const offsetY = (y - 0.5) * speed;
    orb.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });
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

document.querySelectorAll('.project-card, .info-card, .skill-category, .timeline-item, .contact-card').forEach((el, index) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = `opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)`;
  el.style.transitionDelay = `${(index % 3) * 0.1}s`;
  revealObserver.observe(el);
});

// ─── CARD SPOTLIGHT & 3D TILT EFFECT ─────────────────────────────────────────
document.querySelectorAll('.project-card, .info-card, .skill-category').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Spotlight variables
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    
    // 3D Tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; // max tilt degrees
    const rotateY = ((x - centerX) / centerX) * 6;
    
    // Combine existing hover scale with new 3D tilt
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    // Reset transform on mouse leave
    card.style.transform = '';
  });
});


// ─── PROJECT IMAGE LOADING STATE ──────────────────────────────────────────────
// Images come from thum.io live screenshots — show a loading shimmer while they load
document.querySelectorAll('.project-img').forEach((img) => {
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.6s ease';
  
  const handleLoad = () => { img.style.opacity = '1'; };
  
  if (img.complete) {
    handleLoad();
  } else {
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', function () {
      this.parentElement.style.background = 'linear-gradient(135deg, var(--bg-alt), var(--bg-card))';
      this.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.className = 'project-img-placeholder';
      placeholder.innerHTML = '<span>&lt;/&gt;</span>';
      this.parentElement.appendChild(placeholder);
    });
  }
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

// ─── CONTACT FORM HANDLING ───────────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('formSubmit');
    const originalContent = btn.innerHTML;
    
    // Get Form Data
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const message = document.getElementById('form-message').value;

    // 1. Construct WhatsApp Message and Open
    const waPhone = "573017219288";
    const waText = encodeURIComponent(`Hola Valeria! Mi nombre es ${name} (${email}).\n\nTe escribo por: ${message}`);
    const waUrl = `https://wa.me/${waPhone}?text=${waText}`;
    
    // Open WhatsApp in a new tab
    window.open(waUrl, '_blank');

    // 2. Submit to Formspree (Email) in background
    btn.disabled = true;
    btn.innerHTML = lang === 'es' ? '<span>Enviando...</span>' : '<span>Sending...</span>';

    const formData = new FormData(contactForm);
    
    try {
      // We use the action from the form (Formspree URL)
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        btn.innerHTML = lang === 'es' ? '<span>¡Mensaje Enviado!</span>' : '<span>Message Sent!</span>';
        btn.style.background = 'var(--success)';
        contactForm.reset();
      } else {
        // If it's not OK, it might be unverified or rate limited
        // But since WhatsApp opened, we can treat it as a partial success
        btn.innerHTML = lang === 'es' ? '<span>¡Abriendo WhatsApp!</span>' : '<span>Opening WhatsApp!</span>';
        btn.style.background = 'var(--primary)';
      }
    } catch (error) {
      // Fallback if fetch fails (e.g. adblocker)
      btn.innerHTML = lang === 'es' ? '<span>¡Abriendo WhatsApp!</span>' : '<span>Opening WhatsApp!</span>';
      btn.style.background = 'var(--primary)';
    } finally {
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalContent;
        btn.style.background = '';
      }, 5000);
    }
  });
}


// ─── EMAIL COPY HELPER ────────────────────────────────────────────────────────
function copyEmailToClipboard(email = 'valerialarcon119@gmail.com') {
  navigator.clipboard.writeText(email).then(() => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
      background: var(--success); color: white; padding: 12px 24px;
      border-radius: 100px; font-weight: 600; z-index: 3000;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: fadeInUp 0.3s ease;
    `;
    toast.textContent = lang === 'es' ? '¡Email copiado al portapapeles!' : 'Email copied to clipboard!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) translateX(-50%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  });
}

// Add copy event to contact cards that use mailto
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', (e) => {
    // If it's a desktop and they click, we can copy as well
    // For now, let's just make it copy on all clicks to be safe
    // but still allow the mailto to trigger if possible.
    copyEmailToClipboard();
  });
});

// Update placeholders on lang change
const originalApplyLanguage = applyLanguage;
applyLanguage = function() {
  originalApplyLanguage();
  const isEs = lang === 'es';
  document.querySelectorAll('[data-en-placeholder]').forEach(el => {
    const attr = isEs ? 'data-es-placeholder' : 'data-en-placeholder';
    el.placeholder = el.getAttribute(attr);
  });
};
applyLanguage();

