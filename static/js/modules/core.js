'use strict';

import { config } from './config.js';
import { dom } from './dom.js';
import { throttle, debounce } from './utils.js';

let _lenis = null;

const uiStrings = {
    en: {
        alertText:                 '>> <strong>CLOSE COMMISSION / COLLABORATION</strong> <<',
        heroDescription:           '"Shine Through Art" - Creative studio for anime illustration, graphic branding, and collaborative partner for artists',
        heroCta: [
            { href: '#contact',   cls: 'cta-button primary', text: "Let's Talk" },
            { href: 'about.html', cls: 'cta-button',         text: 'Our Vision &amp; Values' }
        ],
        servicesSectionHeader:     '01. SERVICES',
        testimonialsSectionHeader: '03. TESTIMONIALS',
        contactSectionHeader:      '05. CONTACT US'
    },
    id: {
        alertText:                 '>> <strong>CLOSE COMMISSION / COLLABORATION</strong> <<',
        heroDescription:           '"Shine Through Art" - Studio kreatif untuk anime illustration, graphic branding, dan collaborative partner untuk artist',
        heroCta: [
            { href: '#contact',   cls: 'cta-button primary', text: 'Butuh Bantuan?' },
            { href: 'about.html', cls: 'cta-button',         text: 'Visi &amp; Nilai-Nilai Kami' }
        ],
        servicesSectionHeader:     '01. LAYANAN',
        testimonialsSectionHeader: '03. TESTIMONI',
        contactSectionHeader:      '05. HUBUNGI KAMI'
    }
};

// Sticky-scene section IDs
const STICKY_SCENE_IDS = ['portfolio', 'testimonials', 'faq', 'contact'];

/**
 * Hitung scrollY target untuk sticky scene.
 *
 * Semua sticky frame pakai position:sticky; top:0 — artinya begitu
 * scroll mencapai sceneTop, frame langsung ter-pin di viewport top
 * dan konten terlihat penuh. Cukup scroll ke sceneTop saja.
 *
 * Offset -8px agar tidak terpotong border/shadow di atas.
 */
function getStickySceneY(el) {
    return el.getBoundingClientRect().top + window.scrollY - 8;
}

export const core = {
    currentLang:     'en',
    currentTheme:    'light',
    alertBarVisible: true,

    setLenis(lenisInstance) { _lenis = lenisInstance; },

    // ─── Theme ───────────────────────────────────────────────
    initTheme() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme(this.currentTheme);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) this.applyTheme(e.matches ? 'dark' : 'light');
        });
    },

    applyTheme(theme) {
        this.currentTheme = theme;
        dom.body.classList.toggle('light-mode', theme === 'light');
        const sbThemeValue = document.getElementById('sbThemeValue');
        const sbThemeIcon  = document.getElementById('sbThemeIcon');
        if (sbThemeValue) sbThemeValue.textContent = theme === 'light' ? 'LIGHT THEME' : 'DARK THEME';
        if (sbThemeIcon)  sbThemeIcon.className    = theme === 'light' ? 'bx bx-sun' : 'bx bx-moon';
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    },

    // ─── Language ────────────────────────────────────────────
    initLanguage() {
        this.switchLanguage(localStorage.getItem('language') || 'en');
    },

    switchLanguage(lang) {
        this.currentLang = lang;
        const s = uiStrings[lang];
        dom.html.setAttribute('data-lang', lang);

        const ids = {
            sbLangValue:         lang === 'en' ? 'ENGLISH' : 'INDONESIA',
            sbLabelAbout:        lang === 'en' ? '// ABOUT US'     : '// TENTANG KAMI',
            sbLabelServices:     lang === 'en' ? '// SERVICES'     : '// LAYANAN',
            sbLabelTestimonials: lang === 'en' ? '// TESTIMONIALS' : '// TESTIMONI',
            sbLabelContact:      lang === 'en' ? '// CONTACT'      : '// KONTAK'
        };
        Object.entries(ids).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });

        const alertEl = document.getElementById('alert');
        if (alertEl) alertEl.innerHTML = s.alertText;

        const heroDesc = document.getElementById('heroDescription');
        if (heroDesc) heroDesc.textContent = s.heroDescription;

        const heroCta = document.getElementById('heroCta');
        if (heroCta) {
            heroCta.innerHTML = s.heroCta.map(b =>
                `<a href="${b.href}" class="${b.cls}">${b.text}</a>`
            ).join('');
        }

        [
            ['servicesSectionHeader',     s.servicesSectionHeader],
            ['testimonialsSectionHeader', s.testimonialsSectionHeader],
            ['contactSectionHeader',      s.contactSectionHeader]
        ].forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });

        this._applyFAQLang(lang);
        window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    },

    // ─── Sidebar ─────────────────────────────────────────────
    initSidebar() {
        const sidebar     = document.getElementById('desktopSidebar');
        const sbThemeBtn  = document.getElementById('sbThemeBtn');
        const sbLangBtn   = document.getElementById('sbLangBtn');
        const sbEmailLink = document.getElementById('sbEmailLink');

        if (!sidebar) return;

        if (sbEmailLink) {
            const addr = 'iluztar@proton.me';
            sbEmailLink.href  = 'mailto:' + addr;
            sbEmailLink.title = addr;
        }

        sbThemeBtn?.addEventListener('click', () => {
            const next = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme(next);
            localStorage.setItem('theme', next);
        });

        sbLangBtn?.addEventListener('click', () => {
            const next = this.currentLang === 'en' ? 'id' : 'en';
            this.switchLanguage(next);
            localStorage.setItem('language', next);
        });

        // Audio toggle
        const sbAudioBtn   = document.getElementById('sbAudioBtn');
        const sbAudioIcon  = document.getElementById('sbAudioIcon');
        const sbAudioValue = document.getElementById('sbAudioValue');
        let audioMuted = localStorage.getItem('audioMuted') === 'true';
        const updateAudioIcon = () => {
            if (!sbAudioIcon) return;
            sbAudioIcon.className = audioMuted ? 'bx bx-volume-mute' : 'bx bx-volume-full';
            if (sbAudioValue) sbAudioValue.textContent = audioMuted ? 'SOUND OFF' : 'SOUND ON';
        };
        updateAudioIcon();
        sbAudioBtn?.addEventListener('click', () => {
            audioMuted = !audioMuted;
            localStorage.setItem('audioMuted', audioMuted);
            updateAudioIcon();
        });

        // Logo → scroll to top
        document.getElementById('sbLogo')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (_lenis) _lenis.scrollTo(0, { duration: 1.2 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.getElementById('sbHideBtn')?.addEventListener('click', () => this.toggleSidebar(false));
        document.getElementById('sbShowBtn')?.addEventListener('click', () => this.toggleSidebar(true));
        document.getElementById('sbOverlay')?.addEventListener('click', () => this.toggleSidebar(false));

        const easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

        sidebar.querySelectorAll('.sb-nav-item[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || href === '#') return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();

                const isMobile = window.innerWidth < 1024;

                // Hitung posisi scroll target
                const getTargetY = () => {
                    // Services: pakai sweet-spot dari GSAP timeline
                    if (target.classList.contains('services-scene')) {
                        const sweetY = window._servicesHScroll?.getSweetSpotY?.();
                        if (sweetY != null) return sweetY;
                    }
                    // Sticky scenes: cukup scroll ke top scene,
                    // sticky frame (top:0) langsung ter-pin dan konten tampil
                    if (STICKY_SCENE_IDS.includes(target.id)) {
                        return getStickySceneY(target);
                    }
                    // Default: top section
                    return target.getBoundingClientRect().top + window.scrollY;
                };

                const doScroll = () => {
                    const y = getTargetY();
                    if (_lenis) {
                        _lenis.scrollTo(y, { duration: 1.2, easing });
                    } else {
                        // Mobile: native scroll. 'instant' untuk menghindari
                        // konflik dengan animasi smooth browser yang bisa terhenti
                        // di tengah jalan jika user menyentuh layar.
                        window.scrollTo({ top: y, behavior: 'instant' });
                    }
                };

                if (isMobile) {
                    // Tutup sidebar → tunggu CSS transition (300ms) selesai → scroll
                    this.toggleSidebar(false);
                    setTimeout(doScroll, 320);
                } else {
                    doScroll();
                }
            });
        });

        this._initSidebarObserver();

        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 'h') {
                e.preventDefault();
                this.toggleSidebar(!dom.body.classList.contains('sidebar-visible'));
            }
            if (e.key === 'Escape' && dom.body.classList.contains('sidebar-open')) {
                this.toggleSidebar(false);
            }
        });
    },

    toggleSidebar(show) {
        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
            dom.body.classList.toggle('sidebar-open', show);
            const overlay = document.getElementById('sbOverlay');
            if (overlay) {
                overlay.classList.toggle('active', show);
                overlay.setAttribute('aria-hidden', String(!show));
            }
            if (_lenis) show ? _lenis.stop() : _lenis.start();
        } else {
            dom.body.classList.toggle('sidebar-visible', show);
            dom.body.classList.toggle('sidebar-hidden', !show);
        }
        if (typeof ScrollTrigger !== 'undefined') setTimeout(() => ScrollTrigger.refresh(), 350);
    },

    showSidebar() {
        const sidebar = document.getElementById('desktopSidebar');
        if (!sidebar) return;
        if (window.innerWidth < 1024) {
            sidebar.classList.add('sb-ready');
            return;
        }
        setTimeout(() => {
            sidebar.classList.add('sb-ready');
            dom.body.classList.add('sidebar-hidden');
            if (typeof ScrollTrigger !== 'undefined') setTimeout(() => ScrollTrigger.refresh(), 350);
        }, 300);
    },

    // ─── Active nav tracking ─────────────────────────────────
    _initSidebarObserver() {
        const sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;

        const setActive = (id) => {
            document.querySelectorAll('.sb-nav-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
            });
        };

        const updateByScroll = throttle(() => {
            const mid = window.scrollY + window.innerHeight * 0.4;
            let best = null, bestTop = -Infinity;
            sections.forEach(sec => {
                const top = sec.getBoundingClientRect().top + window.scrollY;
                if (top <= mid && top > bestTop) { bestTop = top; best = sec.id; }
            });
            if (best) setActive(best);
        }, 80);

        window.addEventListener('scroll', updateByScroll, { passive: true });
        setTimeout(updateByScroll, 100);
    },

    // ─── Scroll progress ─────────────────────────────────────
    initScrollProgress() {
        const progressEl = document.getElementById('scrollProgress');
        if (!progressEl) return;
        const update = throttle(() => {
            const scrollTop    = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const pct = scrollHeight <= 0
                ? 0
                : Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
            progressEl.innerHTML = `SCROLL // <strong>${pct}%</strong>`;
            this._updateScrollStatus(scrollTop);
        }, 50);
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update, { passive: true });
        window.addEventListener('load', () => setTimeout(update, 200));
        update();
    },

    _updateScrollStatus: null,

    // ─── Edge Mobile fix ─────────────────────────────────────
    applyEdgeFixes() {
        if (!config.isEdgeMobile) return;
        dom.body.classList.add('edge-mobile');
        const setVH = () => dom.html.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        setVH();
        window.addEventListener('resize', debounce(setVH, 250));
    },

    // ─── FAQ ─────────────────────────────────────────────────
    initFAQ(faqs) {
        if (!dom.faqAccordion) return;
        dom.faqAccordion.innerHTML = faqs.map((faq, index) => `
            <div class="faq-item" data-index="${index}">
                <button class="faq-question" aria-expanded="false">
                    <span class="faq-q-en">${faq.questionEn}</span>
                    <span class="faq-q-id">${faq.questionId}</span>
                </button>
                <div class="faq-answer" aria-hidden="true">
                    <p class="faq-a-en">${faq.answerEn}</p>
                    <p class="faq-a-id">${faq.answerId}</p>
                </div>
            </div>
        `).join('');
        this._applyFAQLang(this.currentLang);
        dom.faqAccordion.addEventListener('click', (e) => {
            const question = e.target.closest('.faq-question');
            if (!question) return;
            const item     = question.closest('.faq-item');
            const isActive = item.classList.contains('active');
            dom.faqAccordion.querySelectorAll('.faq-item').forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                other.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
            });
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                item.querySelector('.faq-answer').setAttribute('aria-hidden', 'false');
            }
        });
    },

    _applyFAQLang(lang) {
        ['faq-q', 'faq-a'].forEach(prefix => {
            document.querySelectorAll(`.${prefix}-en, .${prefix}-id`).forEach(el => {
                el.style.display = el.classList.contains(`${prefix}-${lang}`) ? '' : 'none';
            });
        });
    },

    // Backward-compat alias
    initMenu() { return this.initSidebar(); }
};

// Alert bar + scroll indicator
core._updateScrollStatus = throttle((scroll) => {
    if (dom.alertBar) {
        const shouldHide = scroll > 80;
        if (shouldHide !== !core.alertBarVisible) {
            dom.alertBar.classList.toggle('oculto', shouldHide);
            core.alertBarVisible = !shouldHide;
        }
    }
    if (dom.scrollIndicator) {
        const hero = document.getElementById('home');
        const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
        dom.scrollIndicator.style.opacity = heroBottom > window.innerHeight * 0.3 ? '0.5' : '0';
        dom.scrollIndicator.style.pointerEvents = 'none';
    }
}, 100);