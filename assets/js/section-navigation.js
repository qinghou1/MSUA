/* Same-document navigation. Never navigate the preview's outer URL. */
(function () {
  'use strict';
  const nav = document.querySelector('.inpage');
  const navLinks = Array.from(document.querySelectorAll('.inpage [data-section-target]'));
  const sections = navLinks.map(a => document.getElementById(a.dataset.sectionTarget)).filter(Boolean);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;
  let activeId = '';

  function updateOffset() {
    const height = nav ? Math.ceil(nav.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--section-offset', (height + 16) + 'px');
  }

  function markActive(id) {
    if (activeId === id) return;
    activeId = id;
    navLinks.forEach(function (link) {
      if (link.dataset.sectionTarget === id) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function updateActive() {
    ticking = false;
    if (document.body.classList.contains('curriculum-open')) return;
    const threshold = (nav ? nav.getBoundingClientRect().height : 0) + 100;
    let current = '';
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= threshold) current = section.id;
    });
    const bottom = Math.ceil(window.scrollY + window.innerHeight);
    if (bottom >= document.documentElement.scrollHeight - 3 && sections.length) {
      current = sections[sections.length - 1].id;
    }
    markActive(current);
  }

  function jumpTo(id, options) {
    const target = document.getElementById(id);
    if (!target) return false;
    const opts = options || {};
    updateOffset();
    if (opts.focus !== false) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({preventScroll: true});
    }
    target.scrollIntoView({
      block: 'start', inline: 'nearest',
      behavior: opts.instant || reducedMotion.matches ? 'instant' : 'smooth'
    });
    markActive(id);
    if (opts.record !== false) {
      try {
        // History is optional. Opaque-origin previews may forbid this write.
        if (window.location.hash !== '#' + id) {
          const localURL = window.location.href.split('#')[0] + '#' + id;
          window.history.pushState({ufSection: id}, '', localURL);
        }
      } catch (_) {
        // Do not fall back to location.href: that can leave a sandboxed preview.
      }
    }
    return true;
  }

  window.addEventListener('click', function (event) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const element = event.target instanceof Element ? event.target : event.target.parentElement;
    const link = element ? element.closest('[data-section-target]') : null;
    if (!link) return;
    const id = link.dataset.sectionTarget;
    if (!document.getElementById(id)) return;
    // Capture before preview link interceptors. The immutable data attribute
    // still identifies the right section if a host rewrites href or adds <base>.
    event.preventDefault();
    event.stopImmediatePropagation();
    jumpTo(id);
  }, true);

  function followHistory() {
    if (document.body.classList.contains('curriculum-open')) return;
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return; }
    if (id && !id.startsWith('curriculum-view-')) jumpTo(id, {record: false, focus: false, instant: true});
  }
  window.addEventListener('popstate', followHistory);
  window.addEventListener('hashchange', followHistory);
  window.addEventListener('resize', function () { updateOffset(); updateActive(); });
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateActive); }
  }, {passive: true});
  if (nav && 'ResizeObserver' in window) new ResizeObserver(updateOffset).observe(nav);
  updateOffset();
  updateActive();
  window.requestAnimationFrame(followHistory);
})();
