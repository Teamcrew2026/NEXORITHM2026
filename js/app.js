/**
 * Nexorithm 2026 - Main UI Engine, Animations & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initCountdown();
  initCounterObserver();
  initMagneticButtons();
  init3DTilt();
  initCursorGlow();
  initEventsRenderer();
  initHorizontalScroll();
  initLenisSmoothScroll();

  if (window.lucide) {
    lucide.createIcons();
  }
});

/**
 * 1. Intro Page-Load Reveal Animation
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const progressBar = document.getElementById('preloader-bar');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 25) + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      if (progressBar) progressBar.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('preloader-finished');
        document.body.classList.remove('overflow-hidden');
        triggerHeroAnimations();
      }, 350);
    } else {
      if (progressBar) progressBar.style.width = `${progress}%`;
    }
  }, 40);
}

function triggerHeroAnimations() {
  document.querySelectorAll('.animate-hero-reveal').forEach((el, idx) => {
    setTimeout(() => {
      el.classList.add('is-revealed');
    }, idx * 120);
  });
}

/**
 * 2. Sticky Navbar with Scroll Blur / Shrink & Mobile Drawer
 */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  const toggleBtn = document.getElementById('nav-toggle-btn');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar?.classList.add('nav-scrolled');
    } else {
      navbar?.classList.remove('nav-scrolled');
    }

    if (currentScroll > 300 && currentScroll > lastScroll) {
      // Scrolling down
      navbar?.classList.add('nav-hidden');
    } else {
      // Scrolling up
      navbar?.classList.remove('nav-hidden');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) {
        mobileMenu.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.add('is-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile menu when clicking any link
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/**
 * 3. Live Countdown Timer to Event Date
 */
function initCountdown() {
  // Target: September 21, 2026 09:00:00 IST
  const targetDate = new Date('2026-09-21T09:00:00+05:30').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      const timerEl = document.getElementById('countdown-timer');
      if (timerEl) timerEl.innerHTML = '<div class="text-brand-cyan text-xl font-bold font-mono">Symposium is Live!</div>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById('cnt-days');
    const hEl = document.getElementById('cnt-hours');
    const mEl = document.getElementById('cnt-mins');
    const sEl = document.getElementById('cnt-secs');

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/**
 * 4. Animated Counting-Up Numbers on Scroll
 */
function initCounterObserver() {
  const counters = document.querySelectorAll('.counter-number');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-target'), 10) || 0;
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';
        const duration = 1800;
        let startTimestamp = null;

        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const currentCount = Math.floor(progress * targetVal);
          target.textContent = `${prefix}${currentCount.toLocaleString('en-IN')}${suffix}`;
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            target.textContent = `${prefix}${targetVal.toLocaleString('en-IN')}${suffix}`;
          }
        };

        window.requestAnimationFrame(step);
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach((c) => observer.observe(c));
}

/**
 * 5. Cursor-Reactive Magnetic Buttons
 */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  const magneticElements = document.querySelectorAll('.btn-magnetic');
  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
    });
  });
}

/**
 * 6. 3D Card Tilt Micro-interaction
 */
function init3DTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Specular sheen highlight calculation
      const sheenX = (x / rect.width) * 100;
      const sheenY = (y / rect.height) * 100;
      card.style.setProperty('--sheen-x', `${sheenX}%`);
      card.style.setProperty('--sheen-y', `${sheenY}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/**
 * 7. Ambient Pointer Cursor Glow
 */
function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glowEl = document.getElementById('cursor-glow');
  if (!glowEl) return;

  let mouseX = -100;
  let mouseY = -100;
  let currentX = -100;
  let currentY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderCursor() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    glowEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }

  renderCursor();
}

/**
 * 8. Events Page Grid & Tab Filter Renderer
 */
function initEventsRenderer() {
  window.renderEventsList = function(categoryFilter = 'all') {
    const grid = document.getElementById('events-catalog-grid');
    if (!grid) return;

    let filtered = EVENTS_DATA;
    if (categoryFilter !== 'all') {
      filtered = EVENTS_DATA.filter((e) => e.category === categoryFilter);
    }

    let html = '';
    filtered.forEach((ev, idx) => {
      const isTech = ev.category === 'technical';
      html += `
        <article class="glass-card event-card tilt-card ${isTech ? 'event-tech' : 'event-nontech'}" style="animation-delay: ${idx * 0.08}s">
          <div class="card-glow-sheen"></div>
          
          <div class="flex items-center justify-between mb-4">
            <span class="badge ${isTech ? 'badge-cyan' : 'badge-purple'}">
              <i data-lucide="${ev.icon}" class="w-3.5 h-3.5 inline mr-1"></i> ${ev.badge}
            </span>
          </div>

          <h3 class="text-xl font-bold text-white mb-2 font-display">${ev.title}</h3>
          <p class="text-xs text-brand-purple font-mono mb-3 font-semibold">${ev.tagline}</p>
          <p class="text-sm text-slate-300 mb-5 leading-relaxed line-clamp-3">${ev.description}</p>

          <div class="grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono mb-6 pt-3 border-t border-white/10">
            <div><i data-lucide="users" class="w-3.5 h-3.5 inline mr-1 text-slate-500"></i> ${ev.teamSize}</div>
            <div><i data-lucide="clock" class="w-3.5 h-3.5 inline mr-1 text-slate-500"></i> ${ev.timing}</div>
          </div>

          <div class="flex items-center gap-2 mt-auto">
            <button class="btn btn-glass-sm flex-1" onclick="window.openEventModal('${ev.id}')">
              <span>View Rules</span>
              <i data-lucide="info" class="w-3.5 h-3.5"></i>
            </button>
            <a href="#register?event=${ev.id}" class="btn btn-pearl-sm flex-1 text-center">
              <span>Register</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </article>
      `;
    });

    grid.innerHTML = html;
    init3DTilt();
    if (window.lucide) lucide.createIcons();
  };

  // Event Tab Buttons (All / Technical / Non-Technical)
  const tabBtns = document.querySelectorAll('.event-tab-btn');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.getAttribute('data-category');
      window.renderEventsList(cat);
    });
  });
}

/**
 * 9. Event Details Modal Handler
 */
window.openEventModal = function(eventId) {
  const ev = EVENTS_DATA.find((e) => e.id === eventId);
  if (!ev) return;

  const modal = document.getElementById('event-detail-modal');
  if (!modal) return;

  const isTech = ev.category === 'technical';
  document.getElementById('modal-ev-badge').className = `badge ${isTech ? 'badge-cyan' : 'badge-purple'} mb-2`;
  document.getElementById('modal-ev-badge').textContent = ev.badge;
  document.getElementById('modal-ev-title').textContent = ev.title;
  document.getElementById('modal-ev-tagline').textContent = ev.tagline;
  document.getElementById('modal-ev-desc').textContent = ev.description;
  document.getElementById('modal-ev-team').textContent = ev.teamSize;
  document.getElementById('modal-ev-timing').textContent = ev.timing;
  document.getElementById('modal-ev-venue').textContent = ev.venue;

  // Rounds
  const roundsContainer = document.getElementById('modal-ev-rounds');
  if (roundsContainer && ev.rounds) {
    let roundsHtml = '';
    ev.rounds.forEach((r, idx) => {
      roundsHtml += `
        <div class="mb-3 p-3 rounded-lg bg-white/5 border border-white/10">
          <h5 class="text-sm font-bold text-white mb-1"><span class="text-brand-cyan">Phase ${idx + 1}:</span> ${r.title}</h5>
          <p class="text-xs text-slate-300 leading-relaxed">${r.desc}</p>
        </div>
      `;
    });
    roundsContainer.innerHTML = roundsHtml;
  }

  // Rules
  const rulesContainer = document.getElementById('modal-ev-rules');
  if (rulesContainer && ev.rules) {
    let rulesHtml = '';
    ev.rules.forEach((rule) => {
      rulesHtml += `<li class="text-xs text-slate-300 mb-1.5 flex items-start gap-2"><i data-lucide="check" class="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0"></i> <span>${rule}</span></li>`;
    });
    rulesContainer.innerHTML = rulesHtml;
  }

  // Coordinators
  const coordsContainer = document.getElementById('modal-ev-coords');
  if (coordsContainer && ev.coordinators) {
    let coordsHtml = '';
    ev.coordinators.forEach((c) => {
      coordsHtml += `<div class="text-xs text-slate-300 mb-1"><strong class="text-white">${c.name}:</strong> <span class="font-mono text-cyan-300">${c.phone}</span></div>`;
    });
    coordsContainer.innerHTML = coordsHtml;
  }

  // Register CTA link inside modal
  const regLink = document.getElementById('modal-ev-reg-btn');
  if (regLink) {
    regLink.setAttribute('href', `#register?event=${ev.id}`);
    regLink.onclick = () => window.closeEventModal();
  }

  modal.classList.add('is-open');
  if (window.lucide) lucide.createIcons();
};

window.closeEventModal = function() {
  const modal = document.getElementById('event-detail-modal');
  if (modal) modal.classList.remove('is-open');
};

/**
 * 10. Horizontal Carousel Scroll for Featured Highlights
 */
function initHorizontalScroll() {
  const carousel = document.getElementById('highlight-carousel');
  const prevBtn = document.getElementById('btn-carousel-prev');
  const nextBtn = document.getElementById('btn-carousel-next');

  if (!carousel) return;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -340, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 340, behavior: 'smooth' });
    });
  }
}

/**
 * 11. Lenis Smooth Scroll Integration
 */
function initLenisSmoothScroll() {
  if (typeof Lenis !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    });

    function raf(time) {
      window.lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}
