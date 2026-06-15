/**
 * script.js – Poorani Portfolio
 * Handles: navbar scroll, mobile menu, scroll-reveal,
 *          progress bar animation, contact form validation,
 *          active nav link, back-to-top button.
 */

'use strict';

/* ============================================================
   1. NAVBAR – scroll effect + active link highlighting
   ============================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  // Add 'scrolled' class after 50px scroll for background
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight the nav link whose section is in view
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar(); // run once on load


/* ============================================================
   2. MOBILE NAVIGATION TOGGLE
   ============================================================ */
const navToggle  = document.getElementById('navToggle');
const navLinksList = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinksList.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen.toString());
});

// Close mobile menu when any link is clicked
navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksList.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinksList.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});


/* ============================================================
   3. SCROLL-REVEAL ANIMATION (IntersectionObserver)
   ============================================================ */
const revealSelectors = [
  '.reveal',
  '.reveal-right',
  '.reveal-delay-1',
  '.reveal-delay-2',
  '.reveal-delay-3',
  '.reveal-delay-4',
  '.reveal-delay-5'
].join(', ');

const revealElements = document.querySelectorAll(revealSelectors);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing (no re-animation)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,  // Trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'
  }
);

revealElements.forEach(el => revealObserver.observe(el));


/* ============================================================
   4. PROGRESS BARS – animate width when in viewport
   ============================================================ */
const progressBars = document.querySelectorAll('.progress-fill');

const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar       = entry.target;
        const targetWidth = bar.getAttribute('data-width') + '%';

        // Small delay for visual effect
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 200);

        progressObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.3 }
);

progressBars.forEach(bar => progressObserver.observe(bar));


/* ============================================================
   5. BACK-TO-TOP BUTTON
   ============================================================ */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   6. CONTACT FORM – validation + submission feedback
   ============================================================ */
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');
const btnText      = document.getElementById('btn-text');

/**
 * Validates a single field.
 * Returns an error message string, or '' if valid.
 */
function validateField(name, value) {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Please enter your name.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';

    case 'email':
      if (!value.trim()) return 'Please enter your email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
      return '';

    case 'subject':
      if (!value.trim()) return 'Please enter a subject.';
      if (value.trim().length < 4) return 'Subject is too short.';
      return '';

    case 'message':
      if (!value.trim()) return 'Please write your message.';
      if (value.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';

    default:
      return '';
  }
}

/**
 * Shows or clears error for a specific field.
 */
function showError(fieldName, errorMsg) {
  const input     = document.querySelector(`[name="${fieldName}"]`);
  const errorSpan = document.getElementById(`err-${fieldName}`);

  if (!input || !errorSpan) return;

  if (errorMsg) {
    input.classList.add('error');
    errorSpan.textContent = errorMsg;
  } else {
    input.classList.remove('error');
    errorSpan.textContent = '';
  }
}

// Live validation on input blur
contactForm.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('blur', () => {
    const err = validateField(input.name, input.value);
    showError(input.name, err);
  });

  // Clear error on focus
  input.addEventListener('focus', () => {
    showError(input.name, '');
  });
});

// Form submit handler
contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const fields = ['name', 'email', 'subject', 'message'];
  let isValid  = true;

  // Validate all fields
  fields.forEach(fieldName => {
    const input = contactForm.querySelector(`[name="${fieldName}"]`);
    const err   = validateField(fieldName, input ? input.value : '');
    showError(fieldName, err);
    if (err) isValid = false;
  });

  if (!isValid) return;

  // Simulate sending (replace with actual backend / EmailJS integration)
  btnText.textContent = 'Sending…';
  contactForm.querySelector('[type="submit"]').disabled = true;

  setTimeout(() => {
    // Show success
    formSuccess.classList.add('visible');
    contactForm.reset();
    btnText.textContent = 'Send Message ✉';
    contactForm.querySelector('[type="submit"]').disabled = false;

    // Hide success message after 5s
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  }, 1200);
});


/* ============================================================
   7. SMOOTH-SCROLL for in-page anchor links (fallback)
      (html { scroll-behavior: smooth } handles most cases,
       this adds safety for older browsers)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId  = this.getAttribute('href');
    const target    = document.querySelector(targetId);

    if (target) {
      e.preventDefault();
      const offset = 70; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ============================================================
   8. TYPED HEADLINE EFFECT in hero (subtle cycling subtitles)
   ============================================================ */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const phrases = [
    'Aspiring <span class="highlight">Data Analyst</span>',
    'Python &amp; <span class="highlight">SQL</span> Enthusiast',
    'Power BI <span class="highlight">Dashboard</span> Builder',
    'AI &amp; DS <span class="highlight">Graduate</span>',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let typingTimer;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove one character
      heroTitle.innerHTML = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add one character (handle HTML tags atomically)
      heroTitle.innerHTML = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 50 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at end of phrase
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    typingTimer = setTimeout(type, delay);
  }

  // Start typing after initial animations settle
  setTimeout(type, 2800);
}


/* ============================================================
   9. STAT COUNTER ANIMATION
   ============================================================ */
const statNumbers = document.querySelectorAll('.stat-number');

function animateCount(el) {
  const target  = parseInt(el.textContent);  // e.g. 3 from "3+"
  const suffix  = el.textContent.replace(/[0-9]/g, '');
  const duration = 1200;
  const step     = 16;
  const increment = target / (duration / step);
  let current    = 0;

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(counter);
    }
    el.textContent = Math.floor(current) + suffix;
  }, step);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(el => statsObserver.observe(el));


/* ============================================================
   10. PREVENT anchor # scroll jump on page load
   ============================================================ */
if (window.location.hash) {
  setTimeout(() => {
    const target = document.querySelector(window.location.hash);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, 300);
}
