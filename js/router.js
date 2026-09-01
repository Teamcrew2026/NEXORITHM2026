/**
 * Nexorithm 2026 - Client-Side Smooth SPA Router
 */

class NexRouter {
  constructor() {
    this.routes = ['home', 'events', 'register', 'admin'];
    this.currentRoute = 'home';
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    // Initial routing on page load
    this.handleHashChange();
  }

  handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const [route, queryStr] = hash.split('?');
    const targetRoute = this.routes.includes(route) ? route : 'home';

    const params = new URLSearchParams(queryStr || '');
    const preselectedEvent = params.get('event');

    this.navigate(targetRoute, { preselectedEvent });
  }

  navigate(routeName, options = {}) {
    if (!this.routes.includes(routeName)) routeName = 'home';
    this.currentRoute = routeName;

    // 1. Update Navigation Links Active States
    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${routeName}` || (routeName === 'home' && (href === '#home' || href === '#'))) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });

    // 2. Animate View Switch
    const allViews = document.querySelectorAll('.page-view');
    const targetView = document.getElementById(`view-${routeName}`);

    allViews.forEach((view) => {
      if (view === targetView) {
        view.classList.remove('view-hidden');
        view.classList.add('view-active');
      } else {
        view.classList.add('view-hidden');
        view.classList.remove('view-active');
      }
    });

    // 3. Scroll to top of the view smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 4. View-specific lifecycle hooks
    if (routeName === 'events') {
      if (window.renderEventsList) window.renderEventsList();
    } else if (routeName === 'register') {
      if (window.setupRegistrationView) window.setupRegistrationView(options.preselectedEvent);
    } else if (routeName === 'admin') {
      if (window.checkAdminAuth) window.checkAdminAuth();
    }

    // 5. Trigger Lenis / ScrollTrigger resize update if available
    if (window.lenis) {
      window.lenis.resize();
    }
  }
}

window.nexRouter = new NexRouter();
