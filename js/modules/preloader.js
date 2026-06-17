'use strict';

export const preloader = {
    isComplete: false,
    onComplete: null,
    _timeoutId: null,

    init() {
        if (typeof gsap === 'undefined') {
            this._fallbackRemove();
            return;
        }

        const container  = document.querySelector('.preloader');
        const eyeWrap    = document.querySelector('.eye-wrap');
        const eyeSvg     = document.querySelector('.eye-outer-svg');
        const eyeInner   = document.querySelector('.eye-inner');
        const eyeIris    = document.querySelector('.eye-iris');
        const starWrap   = document.querySelector('.star-wrap');

        if (!container || !eyeWrap || !starWrap) {
            this._fallbackRemove();
            return;
        }

        // Tambahkan class untuk lock scroll selama preloader — cross-browser safe
        document.body.classList.add('preloader-active');

        const heroTitle    = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDesc     = document.querySelector('#heroDescription');
        const heroCta      = document.querySelector('#heroCta');
        const hud          = null; // removed from HTML
        const alert        = document.getElementById('alert');
        const scanlines    = document.querySelector('.scanlines');
        const vignette     = document.querySelector('.vignette');
        const noise        = document.querySelector('.noise');
        const bgGrid       = document.querySelector('.bg-grid');

        if (scanlines) gsap.set(scanlines, { opacity: 0 });
        if (vignette)  gsap.set(vignette,  { opacity: 0 });
        if (noise)     gsap.set(noise,      { opacity: 0 });
        if (bgGrid)    gsap.set(bgGrid,     { opacity: 0 });

        if (alert) { gsap.set(alert, { opacity: 0, immediateRender: true }); }

        // Overflow sudah dikunci oleh CSS body.preloader-active
        // TIDAK set body.style.overflow secara inline agar _resetOverflow bisa bersihkan semuanya

        gsap.set(starWrap, { scale: 0.016, rotation: 15, transformOrigin: '50% 50%', opacity: 0, immediateRender: true });

        if (heroTitle)    gsap.set(heroTitle,    { opacity: 0, y: 40, immediateRender: true });
        if (heroSubtitle) gsap.set(heroSubtitle, { opacity: 0, y: 20, immediateRender: true });
        if (heroDesc)     gsap.set(heroDesc,     { opacity: 0, y: 20, immediateRender: true });
        if (heroCta)      gsap.set(heroCta,      { opacity: 0, y: 20, immediateRender: true });

        gsap.ticker.lagSmoothing(0);

        // Durasi konsisten di semua device — tidak ada perbedaan low-end/high-end
        const tl = gsap.timeline({
            delay: 0.3,
            onComplete: () => {
                clearTimeout(this._timeoutId);
                this._cleanup(container);
            }
        });

        tl
            .to(eyeWrap, { opacity: 1, duration: 0.5, ease: 'power2.out' })
            .to({}, { duration: 1.0 })
            .call(() => {
                if (eyeSvg)   eyeSvg.classList.add('blinking');
                if (eyeInner) eyeInner.classList.add('blinking');
                if (eyeIris)  eyeIris.classList.add('blinking');
            })
            .to({}, { duration: 1.1 })
            .to({}, { duration: 0.6 })
            .set(starWrap, { opacity: 1 })
            .to(starWrap, { scale: 160, rotation: -300, duration: 1.8, ease: 'power2.in' })
            .to(eyeWrap,  { opacity: 0, duration: 0.4, ease: 'power2.in' }, '<+=0.05')
            .call(() => {
                container.style.display = 'none';
                this.isComplete = true;
                if (typeof this.onComplete === 'function') this.onComplete();
            })
            .to(heroTitle    ? heroTitle    : {}, { y: 0, opacity: 1, ease: 'back.out(1.6)', duration: 0.9 }, '+=0.05')
            .to(heroSubtitle ? heroSubtitle : {}, { y: 0, opacity: 1, ease: 'back.out(2)',   duration: 0.6 }, '-=0.5')
            .to([heroDesc].filter(Boolean), { y: 0, opacity: 0.7, ease: 'power2.out', duration: 0.6 }, '-=0.4')
            .to(heroCta  ? heroCta  : {}, { y: 0, opacity: 1, ease: 'back.out(2)',   duration: 0.6 }, '-=0.4')
            .to(alert    ? alert    : {}, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.4')
            .to([scanlines, vignette, noise, bgGrid].filter(Boolean), { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.5');

        this._timeoutId = setTimeout(() => {
            tl.kill();
            this._fallbackRemove();
        }, 9000);
    },

    _cleanup(container) {
        if (container) {
            container.classList.add('preloader-hidden');
            setTimeout(() => { if (container.parentNode) container.remove(); }, 150);
        }
        this._resetOverflow();
    },

    _resetOverflow() {
        // Hapus class preloader-active yang mengunci scroll (cross-browser safe)
        document.body.classList.remove('preloader-active');
        // Bersihkan inline style juga jika ada yang ter-set sebelumnya
        document.body.style.overflow             = '';
        document.body.style.overflowX            = '';
        document.body.style.height               = '';
        document.documentElement.style.overflow  = '';
        document.documentElement.style.overflowX = '';
        document.documentElement.style.height    = '';
    },

    _fallbackRemove() {
        clearTimeout(this._timeoutId);

        const container = document.querySelector('.preloader');
        if (container) {
            container.style.display = 'none';
            if (container.parentNode) container.remove();
        }

        const hud       = document.querySelector('.hud');
        const alert     = document.getElementById('alert');
        const scanlines = document.querySelector('.scanlines');
        const vignette  = document.querySelector('.vignette');
        const noise     = document.querySelector('.noise');
        const bgGrid    = document.querySelector('.bg-grid');

        [scanlines, vignette, noise, bgGrid].forEach(el => { if (el) el.style.opacity = ''; });

        if (hud) {
            hud.style.animation = '';
            if (typeof gsap !== 'undefined') gsap.set(hud, { opacity: 1 });
            else hud.style.opacity = '1';
        }
        if (alert) {
            if (typeof gsap !== 'undefined') gsap.set(alert, { opacity: 1 });
            else alert.style.opacity = '1';
        }

        [
            { sel: '.hero-title',      opacity: 1   },
            { sel: '.hero-subtitle',   opacity: 1   },
            { sel: '#heroDescription', opacity: 0.7 },
            { sel: '#heroCta',         opacity: 1   }
        ].forEach(({ sel, opacity }) => {
            document.querySelectorAll(sel).forEach(el => {
                if (typeof gsap !== 'undefined') gsap.set(el, { opacity, y: 0 });
                else { el.style.opacity = String(opacity); el.style.transform = 'none'; }
            });
        });

        this._resetOverflow();
        this.isComplete = true;
        if (typeof this.onComplete === 'function') this.onComplete();
    }
};