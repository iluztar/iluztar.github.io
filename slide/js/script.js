    // ===================== CONFIG / STATE =====================
    const PANEL_COUNT = 32;
    const CHAPTER_RANGES = [[0,1],[2,4],[5,9],[10,14],[15,27],[28,31]];
    const OVERLAY_HIDE_MS = 1800;
    let currentSlide = 0;
    let navOpen = false;
    let uiHidden = false;
    let overlayHideTimer = null;

    const stage = document.getElementById('stage');
    const deckStrip = document.getElementById('deckStrip');
    const slides = document.querySelectorAll('.slide');
    const menuBtn = document.getElementById('menuBtn');
    const navOverlay = document.getElementById('navOverlay');
    const navCloseBtn = document.getElementById('navCloseBtn');
    const deckOverlay = document.getElementById('deckOverlay');
    const ovCurrentEl = document.getElementById('ovCurrent');
    const navChapters = document.querySelectorAll('.chapter-card-head');
    const navSubItems = document.querySelectorAll('.subchapter-list li');
    const searchInput = document.getElementById('searchInput');
    const searchResultsEl = document.getElementById('searchResults');
    const chapterListEl = document.getElementById('chapterList');

    // Feature-detect the CDN libs up front — everything below reads these,
    // so they must exist before any code that references them runs.
    const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const HAS_GSAP = typeof gsap !== 'undefined';
    const HAS_LENIS = typeof Lenis !== 'undefined';

    // ===================== STAGE SCALING (fixed 1920x1080 canvas) =====================
    function fitStage() {
      const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      stage.style.transform = `scale(${scale})`;
    }
    window.addEventListener('resize', fitStage);
    fitStage();

    // ===================== LENIS: smooths the nav overlay's internal chapter/
    // search scroll (its own scroll surface — separate from the slide
    // carousel, which never scrolls). Re-targeted whenever the visible list
    // switches between the chapter grid and search results. =====================
    let navLenis = null;
    function destroyNavLenis() { if (navLenis) { navLenis.destroy(); navLenis = null; } }
    function refreshNavLenis() {
      destroyNavLenis();
      if (!HAS_LENIS || REDUCE_MOTION || !navOpen) return;
      const target = searchResultsEl.classList.contains('show') ? searchResultsEl : chapterListEl;
      navLenis = new Lenis({ wrapper: target, content: target, lerp: 0.12, smoothWheel: true });
    }
    if (HAS_GSAP) {
      gsap.ticker.add((time) => { if (navLenis) navLenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // ===================== NAV OVERLAY TOGGLE =====================
    function setNavOpen(open) {
      navOpen = open;
      navOverlay.classList.toggle('open', open);
      if (open) { setTimeout(() => searchInput.focus(), 350); refreshNavLenis(); }
      else destroyNavLenis();
    }
    menuBtn.addEventListener('click', () => setNavOpen(!navOpen));
    navCloseBtn.addEventListener('click', () => setNavOpen(false));

    // ===================== HIDE-ALL-CHROME (press H) =====================
    function setUiHidden(hidden) {
      uiHidden = hidden;
      document.body.classList.toggle('ui-hidden', hidden);
      if (hidden && overlayHideTimer) { clearTimeout(overlayHideTimer); deckOverlay.removeAttribute('data-visible'); }
    }

    // ===================== DECK OVERLAY (fades in on nav/mouse move) =====================
    function flashOverlay() {
      if (uiHidden) return;
      deckOverlay.setAttribute('data-visible', '');
      if (overlayHideTimer) clearTimeout(overlayHideTimer);
      overlayHideTimer = setTimeout(() => deckOverlay.removeAttribute('data-visible'), OVERLAY_HIDE_MS);
    }
    window.addEventListener('mousemove', flashOverlay, { passive: true });

    // ===================== SLIDE SWITCHING =====================

    // ===================== AE EASINGS =====================
    // Same custom-ease signature as the actual motion graphic this thesis is
    // about (modular/motionv1.html) — named bezier curves that read as
    // "after-effects" motion rather than stock CSS easing. Each name has a
    // plain GSAP-builtin fallback first, then upgrades to a CustomEase bezier
    // path if that plugin loaded — never a hard dependency.
    const AE = { cinematic: 'power4.out', glide: 'sine.out', easeIO: 'power2.inOut', easeOut: 'power2.out', smooth: 'expo.out' };
    if (HAS_GSAP && typeof CustomEase !== 'undefined') {
      CustomEase.create('aeCinematic', 'M0,0 C0.42,0 0.22,1 1,1');
      CustomEase.create('aeGlide', 'M0,0 C0.1,0.6 0.3,1 1,1');
      CustomEase.create('aeEase', 'M0,0 C0.333,0 0.667,1 1,1');
      CustomEase.create('aeEaseOut', 'M0,0 C0,0 0.333,1 1,1');
      AE.cinematic = 'aeCinematic'; AE.glide = 'aeGlide'; AE.easeIO = 'aeEase'; AE.easeOut = 'aeEaseOut';
    }

    // ===================== GSAP: per-slide reveal choreography =====================
    // The deck-strip glide and every slide's tile stagger run on one shared
    // GSAP timeline so they're coordinated rather than two effects firing
    // independently. Falls back to an instant CSS-free jump if GSAP failed
    // to load (e.g. offline) or the user asked for reduced motion.
    let slideTimeline = null;
    function animateToSlide(index, activeEl) {
      if (slideTimeline) slideTimeline.kill();
      const targetX = index * -1920;
      const items = activeEl ? activeEl.querySelectorAll(':scope > .frame > *') : [];
      if (!HAS_GSAP) {
        // CDN unreachable (e.g. offline) — plain DOM fallback, no tweening lib to call.
        deckStrip.style.transform = `translateX(${targetX}px)`;
        items.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
        return;
      }
      if (REDUCE_MOTION) {
        gsap.set(deckStrip, { x: targetX });
        if (items.length) gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      // Deliberately unhurried — this is a defense presentation meant to be
      // watched one beat at a time, not a website scroll reveal. The tile
      // reveal waits until the glide has mostly settled, then each element
      // arrives on its own with a clear pause between, not a rapid cascade.
      if (items.length) gsap.set(items, { opacity: 0, y: 26 });
      slideTimeline = gsap.timeline()
        .to(deckStrip, { x: targetX, duration: 0.95, ease: AE.cinematic }, 0)
        .to(items, { opacity: 1, y: 0, duration: 0.85, ease: AE.glide, stagger: 0.18, overwrite: true }, 0.65);
    }

    function goTo(index) {
      index = Math.max(0, Math.min(PANEL_COUNT - 1, index));
      currentSlide = index;
      slides.forEach((s) => {
        const i = parseInt(s.getAttribute('data-slide'), 10);
        s.classList.toggle('active', i === index);
      });
      const activeEl = slides[index];
      animateToSlide(index, activeEl);
      ovCurrentEl.textContent = String(index + 1);
      updateMenuState(index);
      flashOverlay();
      if (activeEl) { resetBars(); triggerBars(activeEl); triggerCounters(activeEl); }
    }

    function updateMenuState(index) {
      let chapterIndex = 0;
      for (let c = 0; c < CHAPTER_RANGES.length; c++) {
        if (index >= CHAPTER_RANGES[c][0] && index <= CHAPTER_RANGES[c][1]) { chapterIndex = c; break; }
      }
      navChapters.forEach((ch) => ch.classList.toggle('active', parseInt(ch.getAttribute('data-chapter'), 10) === chapterIndex));
      navSubItems.forEach((item) => item.classList.toggle('active', parseInt(item.getAttribute('data-slide'), 10) === index));
    }

    navChapters.forEach((chapter) => {
      chapter.addEventListener('click', () => { goTo(parseInt(chapter.getAttribute('data-start'), 10)); setNavOpen(false); });
    });
    navSubItems.forEach((item) => {
      item.addEventListener('click', () => { goTo(parseInt(item.getAttribute('data-slide'), 10)); setNavOpen(false); });
    });
    document.getElementById('ovPrev').addEventListener('click', () => goTo(currentSlide - 1));
    document.getElementById('ovNext').addEventListener('click', () => goTo(currentSlide + 1));
    document.getElementById('ovReset').addEventListener('click', () => goTo(0));

    // ===================== FULLSCREEN (desktop + mobile) =====================
    const docEl = document.documentElement;
    const requestFs = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
    const exitFs = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    const ovFullscreenBtn = document.getElementById('ovFullscreen');
    const HAS_FULLSCREEN = !!(requestFs && (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen));
    if (!HAS_FULLSCREEN) {
      ovFullscreenBtn.style.display = 'none';
    } else {
      const fsIconOn = ovFullscreenBtn.querySelector('.fs-icon-on');
      const fsIconOff = ovFullscreenBtn.querySelector('.fs-icon-off');
      const isFullscreen = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
      const syncFsIcon = () => {
        const active = isFullscreen();
        fsIconOn.style.display = active ? 'none' : 'block';
        fsIconOff.style.display = active ? 'block' : 'none';
        ovFullscreenBtn.title = active ? 'Keluar Layar Penuh (F)' : 'Layar Penuh (F)';
      };
      ovFullscreenBtn.addEventListener('click', () => {
        if (isFullscreen()) exitFs.call(document);
        else requestFs.call(docEl);
      });
      ['fullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange'].forEach((evt) => {
        document.addEventListener(evt, syncFsIcon);
      });
    }

    // ===================== JUMP TO SLIDE (click the counter, type, Enter) =====================
    const ovCountDisplay = document.getElementById('ovCountDisplay');
    const ovJumpInput = document.getElementById('ovJumpInput');
    function openJump() {
      ovJumpInput.value = '';
      ovCountDisplay.style.display = 'none';
      ovJumpInput.style.display = 'inline-block';
      ovJumpInput.focus();
      flashOverlay();
    }
    function closeJump() {
      ovJumpInput.style.display = 'none';
      ovCountDisplay.style.display = '';
    }
    ovCountDisplay.addEventListener('click', openJump);
    ovJumpInput.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        const n = parseInt(ovJumpInput.value, 10);
        if (!Number.isNaN(n) && n >= 1 && n <= PANEL_COUNT) goTo(n - 1);
        closeJump();
      } else if (e.key === 'Escape') {
        closeJump();
      }
    });
    ovJumpInput.addEventListener('blur', closeJump);

    // Locked for the full glide+reveal choreography (~1.5s), not just the
    // glide itself — trackpad inertial scrolling keeps firing wheel events
    // well past 500ms, which used to sneak a second goTo() in mid-transition
    // and skip an extra slide from a single scroll gesture.
    let wheelLock = false;
    window.addEventListener('wheel', (e) => {
      if (navOpen || wheelLock) return;
      if (Math.abs(e.deltaY) < 12) return;
      wheelLock = true;
      goTo(currentSlide + (e.deltaY > 0 ? 1 : -1));
      setTimeout(() => { wheelLock = false; }, REDUCE_MOTION ? 200 : 1500);
    }, { passive: true });

    // ===================== SWIPE / DRAG TO NAVIGATE (touch + mouse) =====================
    // Same commit-on-release model as the wheel handler above (no live drag-follow):
    // measure total displacement once the pointer lifts, then hand off to the same
    // goTo() + GSAP transition every other input method already uses.
    let swipeActive = false;
    let swipeStartX = 0, swipeStartY = 0, swipeStartTime = 0, swipePointerId = null;
    const SWIPE_MIN_DIST = 70;
    const SWIPE_MAX_OFF_AXIS = 90;
    const SWIPE_MAX_DURATION = 900;

    stage.addEventListener('pointerdown', (e) => {
      if (navOpen) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      swipeActive = true;
      swipeStartX = e.clientX;
      swipeStartY = e.clientY;
      swipeStartTime = performance.now();
      swipePointerId = e.pointerId;
    });

    window.addEventListener('pointerup', (e) => {
      if (!swipeActive || e.pointerId !== swipePointerId) return;
      swipeActive = false;
      if (navOpen) return;
      const dx = e.clientX - swipeStartX;
      const dy = e.clientY - swipeStartY;
      const dt = performance.now() - swipeStartTime;
      if (dt > SWIPE_MAX_DURATION) return;
      if (Math.abs(dy) > SWIPE_MAX_OFF_AXIS) return;
      if (Math.abs(dx) < SWIPE_MIN_DIST) return;
      // A mouse drag that ends with an active text selection means the user
      // meant to select text (see the ::selection yellow highlight above),
      // not change slides — let the selection stand instead of navigating.
      if (e.pointerType === 'mouse') {
        const sel = window.getSelection();
        if (sel && sel.toString().length > 0) return;
      }
      goTo(currentSlide + (dx < 0 ? 1 : -1));
    });

    window.addEventListener('pointercancel', () => { swipeActive = false; });

    window.addEventListener('keydown', (e) => {
      if (document.activeElement === searchInput) {
        if (e.key === 'Escape') { if (searchInput.value) { searchInput.value = ''; runSearch(''); } else setNavOpen(false); }
        return;
      }
      if (e.key === '/' || e.key === 's' || e.key === 'S') { e.preventDefault(); setNavOpen(true); return; }
      if (e.key === 'm' || e.key === 'M') { e.preventDefault(); setNavOpen(!navOpen); return; }
      if (e.key === 'h' || e.key === 'H') { if (!navOpen) { e.preventDefault(); setUiHidden(!uiHidden); } return; }
      if ((e.key === 'f' || e.key === 'F') && HAS_FULLSCREEN) { e.preventDefault(); ovFullscreenBtn.click(); return; }
      if (navOpen) { if (e.key === 'Escape') setNavOpen(false); return; }
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); goTo(currentSlide + 1); }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); goTo(currentSlide - 1); }
      else if (e.key === 'Home') goTo(0);
      else if (e.key === 'End') goTo(PANEL_COUNT - 1);
      else if (e.key === 'r' || e.key === 'R') goTo(0);
      else if (/^[0-9]$/.test(e.key)) { goTo(e.key === '0' ? 9 : parseInt(e.key, 10) - 1); }
    });

    // ===================== SEARCH (textContent-based so hidden slides still index) =====================
    let SEARCH_INDEX = [];
    function escapeHTML(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

    function buildSearchIndex() {
      SEARCH_INDEX = Array.from(slides).map((slide) => {
        const i = parseInt(slide.getAttribute('data-slide'), 10);
        const titleEl = slide.querySelector('.t-title, .t-display, .t-h2, h2, h3');
        const title = titleEl ? titleEl.textContent.trim() : ('Slide ' + (i + 1));
        const pageEl = slide.querySelector('.pagenum');
        const text = slide.textContent.replace(/\s+/g, ' ').trim();
        return { i, path: pageEl ? pageEl.textContent.trim() : '', title, text, textLower: text.toLowerCase() };
      });
    }

    function highlight(snippet, query) {
      const escaped = escapeHTML(snippet);
      const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return escaped.replace(new RegExp('(' + q + ')', 'ig'), '<mark>$1</mark>');
    }

    function runSearch(query) {
      const q = query.trim().toLowerCase();
      if (!q) { searchResultsEl.classList.remove('show'); searchResultsEl.innerHTML = ''; chapterListEl.style.display = 'grid'; return; }
      chapterListEl.style.display = 'none';
      searchResultsEl.classList.add('show');
      const results = SEARCH_INDEX.map((entry) => {
        const idx = entry.textLower.indexOf(q);
        if (idx === -1) return null;
        const start = Math.max(0, idx - 36);
        const end = Math.min(entry.text.length, idx + q.length + 60);
        const snippet = (start > 0 ? '&hellip;' : '') + highlight(entry.text.slice(start, end), query.trim()) + (end < entry.text.length ? '&hellip;' : '');
        return { i: entry.i, path: entry.path, title: entry.title, snippet };
      }).filter(Boolean).slice(0, 12);
      if (!results.length) {
        searchResultsEl.innerHTML = '<div class="search-empty">Tidak ada slide yang cocok dengan &ldquo;' + escapeHTML(query.trim()) + '&rdquo;.</div>';
        return;
      }
      searchResultsEl.innerHTML = results.map((r) => `
        <div class="search-result-item" data-goto="${r.i}">
          <div class="srh-path">${escapeHTML(r.path || ('Slide ' + (r.i + 1)))}</div>
          <div class="srh-title">${escapeHTML(r.title)}</div>
          <div class="srh-snippet">${r.snippet}</div>
        </div>`).join('');
      searchResultsEl.querySelectorAll('.search-result-item').forEach((el) => {
        el.addEventListener('click', () => { goTo(parseInt(el.getAttribute('data-goto'), 10)); setNavOpen(false); });
      });
    }
    searchInput.addEventListener('input', (e) => runSearch(e.target.value));
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const first = searchResultsEl.querySelector('.search-result-item');
        if (first) { goTo(parseInt(first.getAttribute('data-goto'), 10)); setNavOpen(false); }
      }
    });

    // ==========================================================================
    // FIGURE PLACEHOLDERS — set a "src" to swap the CSS placeholder texture for
    // a real photo (mis. "assets/gambar-4-1.jpg"). Numbering follows the
    // thesis's Daftar Gambar.
    // ==========================================================================
    const IMAGES = {
      'fig-4-1': '', 'fig-4-2': '', 'fig-4-3': '', 'fig-4-4': '', 'fig-4-5': '',
      'fig-4-6': '', 'fig-4-7': '', 'fig-4-8': '', 'fig-4-9': '',
      'fig-4-10': '', 'fig-4-11': '', 'fig-4-12': '', 'fig-4-13': '',
      'fig-4-14': '', 'fig-4-15': '', 'fig-4-16': '', 'fig-4-17a': '', 'fig-4-17b': '', 'fig-4-18': '',
    };
    function mountImages() {
      document.querySelectorAll('[data-img]').forEach((slot) => {
        const key = slot.getAttribute('data-img');
        const src = IMAGES[key];
        if (!src) return;
        const img = slot.querySelector('img');
        img.src = src;
        slot.classList.add('has-img');
      });
    }

    // ==========================================================================
    // CHART DATA — Hasil Validasi (Bab IV), angka mengikuti naskah skripsi.
    // ==========================================================================
    function fmtID(n, decimals) { return n.toFixed(decimals).replace('.', ','); }
    function renderBars(containerId, items, { max = 100, suffix = '%', decimals = 0 } = {}) {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = items.map((it) => `
        <div class="row">
          <div class="lbl">${it.label}</div>
          <div class="track"><div class="fill" data-w="${(it.value / max * 100).toFixed(2)}"></div></div>
          <div class="val">${fmtID(it.value, decimals)}${suffix}</div>
        </div>`).join('');
      // Fill to target once immediately — the print/never-visited-slide baseline.
      // goTo() additionally replays a reset-then-grow animation each time the
      // containing slide becomes active (see resetBars/triggerBars).
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.querySelectorAll('.fill').forEach((b) => { b.style.width = b.dataset.w + '%'; });
      }));
    }
    function resetBars(root) {
      (root || document).querySelectorAll('.bars-h .fill').forEach((b) => {
        b.style.transition = 'none';
        b.style.width = '0%';
        void b.offsetWidth;
        b.style.transition = '';
      });
    }
    // Charts/counters sit inside tiles that themselves fade in on the GSAP
    // stagger (see animateToSlide) — start growing only once tiles have had
    // a chance to become visible, or the bars finish racing to 100% while
    // still hidden and just "pop in" already-full the moment opacity arrives.
    const CHART_REVEAL_BASE_MS = 750;
    function triggerBars(root) {
      root.querySelectorAll('.bars-h').forEach((chart, chartIndex) => {
        chart.querySelectorAll('.fill').forEach((b, i) => {
          const delay = REDUCE_MOTION ? 0 : CHART_REVEAL_BASE_MS + chartIndex * 120 + i * 130;
          setTimeout(() => { b.style.width = b.dataset.w + '%'; }, delay);
        });
      });
    }
    function triggerCounters(root) {
      root.querySelectorAll('.cnt').forEach((el, i) => {
        const target = parseFloat(el.getAttribute('data-count'));
        if (Number.isNaN(target)) return;
        if (REDUCE_MOTION) { el.textContent = target; return; }
        const duration = 900;
        const delay = CHART_REVEAL_BASE_MS + i * 110;
        setTimeout(() => {
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
          }
          requestAnimationFrame(tick);
        }, delay);
      });
    }
    renderBars('chartDemografi', [
      { label: 'Usia < 18', value: 12 }, { label: 'Usia 18–24', value: 14 },
      { label: 'Usia 25–34', value: 48 }, { label: 'Usia ≥ 35', value: 38 },
      { label: 'Mengenal ILUZTAR', value: 45 },
    ], { max: 112, suffix: ' org', decimals: 0 });
    renderBars('chartKesan', [
      { label: 'Kejelasan pesan', value: 4.22 }, { label: 'Keterbacaan tipografi', value: 4.30 },
      { label: 'Sinkronisasi audio', value: 4.32 }, { label: 'Estetika ilustrasi', value: 4.21 },
      { label: 'Kesan keseluruhan', value: 4.21 },
    ], { max: 5, suffix: '', decimals: 2 });
    renderBars('chartRecall', [
      { label: 'Nama studio', value: 99.11 }, { label: 'Lokasi studio', value: 96.43 },
      { label: 'CTA (min. 1 kanal)', value: 95.24 }, { label: 'CTA (3 kanal penuh)', value: 66.07 },
    ], { max: 100, suffix: '%', decimals: 2 });
    renderBars('chartMinat', [
      { label: 'Attention', value: 77.68 }, { label: 'Interest', value: 67.86 }, { label: 'Desire / Action', value: 61.61 },
    ], { max: 100, suffix: '%', decimals: 2 });

    // ===================== INIT =====================
    buildSearchIndex();
    mountImages();
    goTo(0);
