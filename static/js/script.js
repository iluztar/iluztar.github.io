'use strict';

import { config, appData }     from './modules/config.js';
import { dom, initDom }        from './modules/dom.js';
import { core }                from './modules/core.js';
import { debounce }            from './modules/utils.js';
import { preloader }           from './modules/preloader.js';
import { SmoothScrollManager } from './modules/smooth-scroll.js';
import { carousels }           from './modules/carousels.js';
import { servicesHScroll }     from './modules/services-scroll.js';
import { animations }          from './modules/animations.js';
import { security, social, images } from './modules/security.js';

function init() {
    try {
        initDom();
        dom.body.classList.remove('loading', 'no-js');
        dom.body.classList.add('loaded');

        if (config.isEdgeMobile) core.applyEdgeFixes();

        security.init();
        core.initTheme();
        core.initLanguage();
        core.initSidebar();
        core.initScrollProgress();
        core.initFAQ(appData.faqs);
        preloader.init();

        preloader.onComplete = () => {
            core.showSidebar();
            carousels.initPortfolio(appData.portfolioData, appData.portfolioImages);
            carousels.initTestimonials(appData.testimonials);

            const scrollManager = new SmoothScrollManager();
            const lenis = scrollManager.getInstance();
            core.setLenis(lenis);

            servicesHScroll.init(appData.services);
            window._servicesHScroll = servicesHScroll;

            setTimeout(() => animations.init(lenis), 150);
        };

        social.fixInstagramLinks();
        social.setupLinks();
        setTimeout(() => images.protect(), 300);

        window.addEventListener('resize', debounce(() => {
            social.fixInstagramLinks();
            if (config.isEdgeMobile) core.applyEdgeFixes();
            carousels.updateAll();
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }, 250));

    } catch (err) {
        console.error('Initialization error:', err);
    }
}

// Single deferred task after full page load — refresh layout-sensitive state
window.addEventListener('load', () => {
    setTimeout(() => {
        if (Object.keys(carousels.swipers).length > 0) carousels.updateAll();
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 400);
}, { once: true });

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init();
}