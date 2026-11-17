'use strict';

export class SmoothScrollManager {
    constructor() {
        this.lenis          = null;
        this.isInitialized  = false;
        this._rafId         = null;
        this._tickerFn      = null;
        this._isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
        this._init();
    }

    _init() {
        // Touch devices: use native scroll — Lenis adds overhead and feels wrong on touch.
        // ScrollTrigger works fine with native scroll events.
        if (this._isTouchDevice) {
            this._setupAnchorScroll();
            if (typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => ScrollTrigger.refresh(), 300);
            }
            return;
        }

        if (typeof Lenis === 'undefined') {
            console.warn('Lenis not loaded — using native scroll');
            this._setupAnchorScroll();
            return;
        }

        this._setupLenis();
    }

    _setupLenis() {
        this.lenis = new Lenis({
            duration:        1.2,
            easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            syncTouch:       false,
            touchMultiplier: 1.0,
            wheelMultiplier: 1.0,
            autoResize:      true,
            // DO NOT prevent on swiper containers — this blocks vertical scroll
            // through carousel areas. Swiper's own touchStartPreventDefault handles
            // horizontal drag isolation.
        });

        if (typeof gsap !== 'undefined') {
            // ─── CORRECT Lenis 1.x + GSAP ScrollTrigger integration ───────────
            // gsap.ticker is the single RAF source. lenis.raf advances the virtual
            // scroll. Lenis internally dispatches a native 'scroll' event on window
            // which ScrollTrigger listens to on its own — no manual update needed.
            // lagSmoothing(0) prevents GSAP from skipping frames on tab refocus,
            // which would cause a visible jump in scroll position.
            this._tickerFn = (time) => this.lenis.raf(time * 1000);
            gsap.ticker.add(this._tickerFn);
            gsap.ticker.lagSmoothing(0);
        } else {
            // Fallback: standalone RAF loop when GSAP not present
            const loop = (time) => {
                this.lenis.raf(time);
                this._rafId = requestAnimationFrame(loop);
            };
            this._rafId = requestAnimationFrame(loop);
        }

        this._setupAnchorScroll();

        // Single refresh after everything is ready
        setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }, 500);

        this.isInitialized = true;
    }

    _setupAnchorScroll() {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            // Skip sidebar nav — ditangani oleh core.js::initSidebar
            // supaya tidak terjadi double scroll ke posisi berbeda
            if (anchor.classList.contains('sb-nav-item')) return;

            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            if (this.lenis) {
                this.lenis.scrollTo(target, {
                    offset:   0,
                    duration: 1.2,
                    easing:   (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            } else {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY,
                    behavior: 'smooth'
                });
            }
        });
    }

    getInstance() { return this.lenis; }

    destroy() {
        if (this._rafId)   cancelAnimationFrame(this._rafId);
        if (this._tickerFn && typeof gsap !== 'undefined') gsap.ticker.remove(this._tickerFn);
        if (this.lenis)    this.lenis.destroy();
        this._tickerFn    = null;
        this.lenis        = null;
        this.isInitialized = false;
    }
}