'use strict';

import { dom } from './dom.js';
import { debounce } from './utils.js';

export const carousels = {
    swipers: {},

    _baseConfig(selector) {
        return {
            selector,
            slidesPerView: 1,
            spaceBetween:  20,
            loop:          true,
            speed:         600,
            autoplay: {
                delay:                4000,
                disableOnInteraction: false,
                pauseOnMouseEnter:    true
            },
            grabCursor:     true,
            centeredSlides: false,
            // Prevent Swiper wheel from interfering with Lenis page scroll
            mousewheel:       false,
            passiveListeners: true,
            // Don't prevent default on touch so Lenis can handle vertical scroll
            touchStartPreventDefault: false,
            breakpoints: {
                480:  { slidesPerView:1.1, spaceBetween:15 },
                640:  { slidesPerView:1.3, spaceBetween:20 },
                768:  { slidesPerView:1.8, spaceBetween:25 },
                1024: { slidesPerView:2.5, spaceBetween:30 },
                1200: { slidesPerView:3,   spaceBetween:30 }
            },
            pagination: { el:'.swiper-pagination', clickable:true, dynamicBullets:false }
        };
    },

    initPortfolio(portfolioData, portfolioImages) {
        if (!dom.portfolioWrapper) return;

        dom.portfolioWrapper.innerHTML = portfolioData.map((item, index) => `
            <div class="swiper-slide">
                <div class="portfolio-card">
                    <div class="portfolio-image-wrapper">
                        <img src="${portfolioImages[index]}" alt="${item.title}" loading="lazy" class="portfolio-image">
                    </div>
                    <div class="portfolio-info">
                        <div class="portfolio-header">
                            <span class="portfolio-id">${item.id}</span>
                            <div class="portfolio-header-right">
                                <span class="portfolio-category-box"></span>
                                <span class="portfolio-number">${item.number}</span>
                            </div>
                        </div>
                        <h3 class="portfolio-title">${item.title}</h3>
                        <p class="portfolio-category">${item.category}</p>
                    </div>
                </div>
            </div>
        `).join('');

        const cfg = this._baseConfig('.portfolio-swiper');
        cfg.loopedSlides = portfolioData.length;
        this._createSwiper('portfolio', cfg);
    },

    initTestimonials(testimonials) {
        if (!dom.testimonialWrapper) return;

        dom.testimonialWrapper.innerHTML = testimonials.map((t, index) => `
            <div class="swiper-slide">
                <div class="testimonial-card">
                    <div class="testimonial-header">
                        <div class="testimonial-header-top">
                            <span class="testimonial-id">TST-00${index + 1}</span>
                            <span class="testimonial-category-box"></span>
                        </div>
                        <div class="testimonial-client-info">
                            <a href="${t.socialLink}" target="_blank" rel="noopener noreferrer"
                               class="avatar-link testimonial-avatar" aria-label="Visit ${t.name}'s profile">
                                <div class="avatar">
                                    <img src="${t.img}" alt="${t.name}" loading="lazy" class="avatar-img">
                                </div>
                            </a>
                            <div class="testimonial-info">
                                <div class="testimonial-name-role">
                                    <a href="${t.socialLink}" target="_blank" rel="noopener noreferrer" class="name-link">${t.name}</a>
                                    <p class="role">${t.role}</p>
                                </div>
                                <div class="stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
                            </div>
                        </div>
                    </div>
                    <p class="testimonial-text">"${t.text}"</p>
                    <div class="testimonial-footer">
                        <span class="testimonial-type">${t.type === 'collab' ? 'COLLAB PARTNER' : 'CLIENT'}</span>
                        <a href="${t.socialLink}" target="_blank" rel="noopener noreferrer" class="verified-badge">@${t.idname}</a>
                    </div>
                </div>
            </div>
        `).join('');

        const cfg = this._baseConfig('.testimonial-swiper');
        cfg.loopedSlides = testimonials.length;
        cfg.autoHeight   = false;   // tinggi container menyesuaikan slide aktif
        this._createSwiper('testimonials', cfg);
    },

    _createSwiper(key, cfg) {
        if (typeof Swiper === 'undefined') return;

        if (this.swipers[key]) {
            try { this.swipers[key].destroy(true, true); } catch (_) {}
        }

        const { selector, ...swiperConfig } = cfg;

        try {
            this.swipers[key] = new Swiper(selector, swiperConfig);
        } catch (err) {
            console.error(`Error initializing ${key} swiper:`, err);
        }
    },

    updateAll: debounce(function() {
        Object.values(carousels.swipers).forEach(swiper => {
            if (swiper?.update) { try { swiper.update(); } catch (_) {} }
        });
    }, 250)
};