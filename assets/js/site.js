
/* Preserve the existing carousel behavior. */
function scrollFaculty(id, direction) {
  const track = document.getElementById(id);
  if (!track) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const amount = Math.min(track.clientWidth * 0.82, 680);
  track.scrollBy({ left: direction * amount, behavior: reducedMotion ? 'auto' : 'smooth' });
}
function facultyPhotoFallback(img, initials) {
  img.style.display = 'none';
  const fallback = img.nextElementSibling;
  if (fallback) {
    fallback.textContent = initials;
    fallback.style.display = 'grid';
  }
}

/*
 * The source filenames remain real hrefs. Hosted copies open the corresponding
 * file directly; isolated previews and local single-file copies use exact
 * embedded source bytes, without a network dependency or a missing-file error.
 */
(function () {
  'use strict';
  const rawSources = document.getElementById('curriculum-source-files');
  const viewer = document.getElementById('curriculum-viewer');
  let frame = document.getElementById('curriculum-frame');
  const back = document.getElementById('curriculum-back');
  const save = document.getElementById('curriculum-download');
  const heading = document.getElementById('curriculum-viewer-heading');
  const sourceName = document.getElementById('curriculum-source-name');
  const status = document.getElementById('curriculum-status');
  if (!rawSources || !viewer || !frame || !back || !save) return;

  let sources;
  try {
    sources = JSON.parse(rawSources.textContent);
  } catch (error) {
    console.error('Unable to read the embedded curriculum sources.', error);
    return; // The ordinary hrefs are still usable with the packaged files.
  }
  const decoded = new Map();
  const availability = new Map();
  const originalTitle = document.title;
  let currentKey = null;
  let returnLink = null;
  let returnScroll = 0;
  let downloadURL = null;
  let ownedHistoryEntry = false;
  let previousHash = '';
  let navigating = false;

  function decodeSource(key) {
    if (!Object.prototype.hasOwnProperty.call(sources, key)) return null;
    if (!decoded.has(key)) {
      const bytes = Uint8Array.from(atob(sources[key].content), char => char.charCodeAt(0));
      decoded.set(key, new TextDecoder('utf-8').decode(bytes));
    }
    return decoded.get(key);
  }

  function routeKey() {
    const match = /^#curriculum-view-(msua|certificate)$/.exec(window.location.hash);
    return match ? match[1] : null;
  }

  function showSource(key, link) {
    const text = decodeSource(key);
    if (text === null) return;
    if (!viewer.open) {
      returnScroll = window.scrollY;
      returnLink = link || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    }
    if (currentKey !== key) {
      currentKey = key;
      heading.textContent = sources[key].title;
      sourceName.textContent = sources[key].filename;
      const nextFrame = frame.cloneNode(false);
      nextFrame.title = sources[key].title;
      // Only the viewing context gets a base tag. The original source file is
      // kept byte-for-byte in the payload and in the downloadable website ZIP.
      nextFrame.srcdoc = prepareSourceDocument(text);
      frame.replaceWith(nextFrame);
      frame = nextFrame;
      if (downloadURL) URL.revokeObjectURL(downloadURL);
      const originalBytes = Uint8Array.from(atob(sources[key].content), char => char.charCodeAt(0));
      downloadURL = URL.createObjectURL(new Blob([originalBytes], { type: 'text/html;charset=utf-8' }));
      save.href = downloadURL;
      save.download = sources[key].filename;
    }
    document.title = sources[key].title + ' | UF Urban Analytics';
    document.body.classList.add('curriculum-open');
    if (!viewer.open) viewer.showModal();
    back.focus({ preventScroll: true });
    if (status) status.textContent = sources[key].title + ' opened.';
  }

  function hideSource() {
    if (viewer.open) viewer.close();
    currentKey = null;
    document.body.classList.remove('curriculum-open');
    document.title = originalTitle;
    if (returnLink && returnLink.isConnected) returnLink.focus({ preventScroll: true });
    window.scrollTo({ top: returnScroll, behavior: 'instant' });
    if (status) status.textContent = 'Returned to the Urban Analytics program page.';
  }

  function openEmbedded(key, link) {
    if (routeKey() !== key) {
      previousHash = window.location.hash;
      try {
        history.pushState({ ufCurriculumView: key }, '', window.location.href.split('#')[0] + '#curriculum-view-' + key);
        ownedHistoryEntry = true;
      } catch (error) {
        // Some sandboxed previews restrict History API writes. Viewing still works.
        ownedHistoryEntry = false;
      }
    }
    showSource(key, link);
  }

  function closeViewer() {
    hideSource();
    if (routeKey()) {
      if (ownedHistoryEntry) {
        ownedHistoryEntry = false;
        history.back();
      } else {
        try {
          history.replaceState(null, '', window.location.href.split('#')[0] + (previousHash || '#curriculum'));
        } catch (error) {
          // Closing the viewer itself does not rely on History API access.
        }
      }
    }
  }

  function normalized(text) {
    return text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim();
  }

  async function matchingHostedFile(key) {
    if (document.documentElement.dataset.delivery === 'standalone') return false;
    if (availability.has(key)) return availability.get(key);
    const knownPreview = /(^|\.)(oaiusercontent\.com|openaiusercontent\.com|chatgpt\.com)$/.test(window.location.hostname);
    if (!/^https?:$/.test(window.location.protocol) || knownPreview) return false;
    const target = new URL(sources[key].filename, window.location.href);
    if (target.origin !== window.location.origin) return false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1200);
    let matches = false;
    try {
      const response = await fetch(target.href, { signal: controller.signal, credentials: 'same-origin' });
      // Do not navigate to a 404 page, login page, or a generic host preview.
      matches = response.ok && normalized(await response.text()) === normalized(decodeSource(key));
    } catch (error) {
      matches = false;
    } finally {
      window.clearTimeout(timeout);
    }
    availability.set(key, matches);
    return matches;
  }

  window.addEventListener('click', async event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const element = event.target instanceof Element ? event.target : event.target.parentElement;
      const link = element ? element.closest('a[data-curriculum]') : null;
      if (!link) return;
      const key = link.dataset.curriculum;
      if (!Object.prototype.hasOwnProperty.call(sources, key)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (navigating) return;
      navigating = true;
      link.setAttribute('aria-busy', 'true');
      if (status) status.textContent = 'Opening ' + sources[key].title + '.';
      try {
        if (await matchingHostedFile(key)) {
          window.location.assign(new URL(sources[key].filename, window.location.href).href);
        } else {
          openEmbedded(key, link);
        }
      } catch (error) {
        openEmbedded(key, link);
      } finally {
        navigating = false;
        link.removeAttribute('aria-busy');
      }
  }, true);

  function prepareSourceDocument(text) {
    const binder = function () {
      window.addEventListener('click', function (event) {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const el = event.target instanceof Element ? event.target : event.target.parentElement;
        const anchor = el ? el.closest('a[href]') : null;
        if (!anchor) return;
        const href = anchor.getAttribute('href') || '';
        if (!href.startsWith('#')) return;
        let id;
        try { id = decodeURIComponent(href.slice(1)); } catch (_) { return; }
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({preventScroll: true});
        target.scrollIntoView({block: 'start', behavior: 'instant'});
      }, true);
    };
    const addition = '<base href="about:srcdoc" target="_self"><script>(' + binder.toString() + ')();<' + '/script>';
    return text.replace(/(<head\b[^>]*>)/i, '$1' + addition);
  }

  back.addEventListener('click', closeViewer);
  viewer.addEventListener('cancel', event => {
    event.preventDefault();
    closeViewer();
  });
  function syncRoute() {
    const key = routeKey();
    if (key) {
      showSource(key, null);
    } else if (viewer.open) {
      hideSource();
      ownedHistoryEntry = false;
    }
  }
  window.addEventListener('popstate', syncRoute);
  window.addEventListener('hashchange', syncRoute);
  if (routeKey()) showSource(routeKey(), null);
})();

