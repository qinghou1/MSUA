
(function () {
  'use strict';
  const track = document.getElementById('student-project-track');
  const previous = document.getElementById('student-project-prev');
  const next = document.getElementById('student-project-next');
  const position = document.getElementById('student-project-position');
  if (!track || !previous || !next || !position) return;
  const cards = Array.from(track.querySelectorAll('.student-project-card'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scrollFrame = 0;
  let resizeFrame = 0;
  let lastWidth = -1;

  function updateControls() {
    scrollFrame = 0;
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
    const bounds = track.getBoundingClientRect();
    const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const visible = cards.map(function (card, index) {
      const rect = card.getBoundingClientRect();
      const overlap = Math.max(0, Math.min(rect.right, bounds.right - padding) - Math.max(rect.left, bounds.left + padding));
      return overlap >= rect.width * 0.45 ? index + 1 : null;
    }).filter(Boolean);
    if (visible.length) {
      const first = visible[0];
      const last = visible[visible.length - 1];
      position.textContent = (first === last ? first : first + '–' + last) + ' of ' + cards.length;
    }
  }

  function move(direction) {
    if (!cards.length) return;
    const step = cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 20);
    track.scrollBy({ left: direction * step, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }

  // Align shared content rows without truncating titles or changing abstracts.
  // The tallest open abstract does not force other cards to grow blank space.
  function alignContentRows() {
    resizeFrame = 0;
    const rows = [
      ['.student-project-figure figcaption', '--research-caption-height'],
      ['.project-category', '--research-category-height'],
      ['.student-project-body h4', '--research-title-height']
    ];
    rows.forEach(function (row) { track.style.setProperty(row[1], '0px'); });
    const sizes = rows.map(function (row) {
      return Math.ceil(Math.max.apply(null, cards.map(function (card) {
        const element = card.querySelector(row[0]);
        return element ? element.getBoundingClientRect().height : 0;
      })));
    });
    rows.forEach(function (row, index) { track.style.setProperty(row[1], sizes[index] + 'px'); });
    updateControls();
  }

  previous.addEventListener('click', function () { move(-1); });
  next.addEventListener('click', function () { move(1); });
  track.addEventListener('scroll', function () {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateControls);
  }, { passive: true });
  track.addEventListener('keydown', function (event) {
    if (event.target !== track) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }
  });

  function scheduleAlignment() {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(alignContentRows);
  }
  if ('ResizeObserver' in window) {
    new ResizeObserver(function (entries) {
      const width = entries[0].contentRect.width;
      if (Math.abs(width - lastWidth) > 0.5) {
        lastWidth = width;
        scheduleAlignment();
      }
    }).observe(track);
  } else {
    window.addEventListener('resize', scheduleAlignment);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleAlignment);
  scheduleAlignment();
})();
