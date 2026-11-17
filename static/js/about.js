// about.js — About Page Entry Point (standalone, does NOT depend on script.js)
'use strict';

import { config }               from './modules/config.js';
import { dom, initDom }         from './modules/dom.js';
import { core }                 from './modules/core.js';
import { preloader }            from './modules/preloader.js';
import { SmoothScrollManager }  from './modules/smooth-scroll.js';
import { animations }           from './modules/animations.js';
import { security, social, images } from './modules/security.js';
import { debounce }             from './modules/utils.js';

// ─── About page bilingual copy ────────────────────────────────────────────────
// Only about-page-specific strings. Sidebar ctrl labels (ENGLISH, LIGHT THEME,
// ABOUT US, etc.) are handled by core.switchLanguage — no duplication needed.
const aboutCopy = {
    en: {
        heroSubtitle:  'ABOUT // CREATIVE STUDIO',
        heroDesc:      'Get to know ILUZTAR — A creative studio that shines through art and collaboration',
        ctaPrimary:    "Let's Talk",
        ctaSecondary:  'Back to Home',
        footerDate:    '[ PROFILE DOCUMENT // UPDATED ON FEBRUARY 2026 ]',
        sbLabelAbout:    '// ABOUT US',
        sbLabelServices: '// SERVICES',
        sections: {
            intro:      '01. INTRODUCTION',
            visual:     '02. VISUAL IDENTITY',
            services:   '03. SERVICES OFFERED',
            workflow:   '04. WORKFLOW',
            values:     '05. VALUES & ETHICS',
            skills:     '06. TECHNICAL SKILLS',
            pricing:    '07. PRICING & PACKAGES',
            faq:        '08. FREQUENTLY ASKED QUESTIONS',
            conclusion: '09. CONCLUSION',
        },
    },
    id: {
        heroSubtitle:  'TENTANG // CREATIVE STUDIO',
        heroDesc:      'Mengenal lebih dalam tentang ILUZTAR — Studio kreatif yang bersinar melalui seni dan kolaborasi',
        ctaPrimary:    'Butuh Bantuan?',
        ctaSecondary:  'Kembali ke Beranda',
        footerDate:    '[ PROFILE DOCUMENT // DIPERBARUI PADA FEBRUARI 2026 ]',
        sbLabelAbout:    '// TENTANG KAMI',
        sbLabelServices: '// LAYANAN',
        sections: {
            intro:      '01. PENGENALAN',
            visual:     '02. IDENTITAS VISUAL',
            services:   '03. LAYANAN YANG DITAWARKAN',
            workflow:   '04. ALUR KERJA',
            values:     '05. NILAI & ETIKA',
            skills:     '06. KEMAMPUAN TEKNIS',
            pricing:    '07. HARGA & PAKET',
            faq:        '08. PERTANYAAN UMUM',
            conclusion: '09. KESIMPULAN',
        },
    },
};

// ─── Apply about-page bilingual content ───────────────────────────────────────
function applyLang(lang) {
    const copy = aboutCopy[lang];
    if (!copy) return;

    // Hero subtitle & description
    const sub  = document.getElementById('heroSubtitle');
    const desc = document.getElementById('heroDescription');
    if (sub)  sub.textContent  = copy.heroSubtitle;
    if (desc) desc.textContent = copy.heroDesc;

    // CTA buttons
    const heroCta = document.getElementById('heroCta');
    if (heroCta) {
        heroCta.innerHTML = `
            <a href="index.html#contact" class="cta-button primary" id="ctaPrimary">${copy.ctaPrimary}</a>
            <a href="index.html"         class="cta-button"         id="ctaSecondary">${copy.ctaSecondary}</a>
        `;
    }

    // About-page-specific sidebar labels (HOME is generic, these are page-specific)
    const sbLabelAbout    = document.getElementById('sbLabelAbout');
    const sbLabelServices = document.getElementById('sbLabelServices');
    if (sbLabelAbout)    sbLabelAbout.textContent    = copy.sbLabelAbout;
    if (sbLabelServices) sbLabelServices.textContent = copy.sbLabelServices;

    // Section headers with data-lang-key
    document.querySelectorAll('.section-header[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        if (copy.sections[key]) el.textContent = copy.sections[key];
    });

    // Footer date
    const footerDate = document.getElementById('footerDate');
    if (footerDate) footerDate.textContent = copy.footerDate;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
    try {
        initDom();

        // Remove no-js; add about-page for CSS scoping
        dom.body.classList.remove('no-js');
        dom.body.classList.add('loaded', 'about-page');

        // Edge mobile fixes if needed
        if (config.isEdgeMobile) core.applyEdgeFixes();

        // Core systems — identical init order to index/script.js
        security.init();
        core.initTheme();
        core.initLanguage();
        core.initSidebar();       // desktop-sidebar system, consistent with index.html
        core.initScrollProgress();

        // Intercept language switches to also update about-page-specific copy
        const _origSwitch = core.switchLanguage.bind(core);
        core.switchLanguage = function (lang) {
            _origSwitch(lang);
            applyLang(lang);
        };

        // Run preloader, then boot scroll + animations
        preloader.init();
        preloader.onComplete = () => {
            const scrollMgr = new SmoothScrollManager();
            const lenis     = scrollMgr.getInstance();
            core.setLenis(lenis);
            core.showSidebar();   // reveal sidebar after preloader, same as index

            setTimeout(() => animations.init(lenis), 150);
        };

        // Social / image hardening
        social.fixInstagramLinks();
        social.setupLinks();
        setTimeout(() => images.protect(), 300);

        // Resize handler
        window.addEventListener('resize', debounce(() => {
            social.fixInstagramLinks();
            if (config.isEdgeMobile) core.applyEdgeFixes();
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }, 250));

        // Apply initial language content (lang already set by initLanguage above)
        applyLang(core.currentLang);

    } catch (err) {
        console.error('[about.js] Initialization error:', err);
    }
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}