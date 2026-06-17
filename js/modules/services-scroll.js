'use strict';

import { dom } from './dom.js';
import { core } from './core.js';
import { debounce } from './utils.js';

export const servicesHScroll = {
    _trigger: null,
    _holdPct: 0,

    // Returns the scrollY position where all cards are visible (center of hold phase)
    getSweetSpotY() {
        if (!this._trigger) return null;
        const start = this._trigger.start;
        const end   = this._trigger.end;
        return Math.round(start + (end - start) * this._holdPct);
    },

    // Initialize services horizontal scroll — render cards and set up GSAP
    init(services) {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP not available for services horizontal scroll');
            return;
        }

        const wrapper = dom.servicesCardsWrapper;
        if (!wrapper) return;

        const numCards = services.length;

        wrapper.innerHTML = services.map((s, i) => `
            <div class="card" data-index="${i}">
                <div class="card-header">
                    <span class="card-id">${s.id}</span>
                    <div class="card-header-right">
                        <span class="card-category-box" title="${s.category}"></span>
                    </div>
                </div>
                <h2 class="card-title">${s.title}</h2>
                <p class="card-description card-desc-en">${s.descriptionEn}</p>
                <p class="card-description card-desc-id">${s.descriptionId}</p>
                <div class="card-footer">
                    <div class="card-footer-left">
                        <span class="card-category">${s.category}</span>
                    </div>
                    <div class="card-footer-right">
                        <span class="card-number">${s.number}</span>
                        <span class="card-specialty">${s.specialty}</span>
                    </div>
                </div>
            </div>
        `).join('');

        this._applyCardLang(core.currentLang);

        const cards = wrapper.querySelectorAll('.card');
        this._setupCards(cards, numCards);

        window.addEventListener('resize', debounce(() => {
            const freshCards = wrapper.querySelectorAll('.card');
            this._setupCards(freshCards, numCards);
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }, 300));

        window.addEventListener('langchange', (e) => {
            this._applyCardLang(e.detail?.lang || core.currentLang);
        });
    },

    _applyCardLang(lang) {
        document.querySelectorAll('.card-desc-en, .card-desc-id').forEach(el => {
            el.style.display = el.classList.contains(`card-desc-${lang}`) ? '' : 'none';
        });
    },

    // Select appropriate layout based on viewport width
    _setupCards(cards, numCards) {
        const sceneEl = document.querySelector('.services-scene');
        const winW = sceneEl ? sceneEl.getBoundingClientRect().width : window.innerWidth;

        ScrollTrigger.getAll()
            .filter(t => t.vars._svcHScroll)
            .forEach(t => t.kill());

        const svcHeaders = document.querySelectorAll('.services-label-block .section-header');
        if (svcHeaders.length) gsap.set(svcHeaders, { opacity: 1, y: 0 });

        if (winW < 640) {
            this._setupMobile(cards, numCards, winW);
        } else if (winW < 1024) {
            this._setupTablet(cards, numCards, winW);
        } else {
            this._setupDesktop(cards, numCards, winW);
        }
    },

    // Build ScrollTrigger config for the services sticky scene
    _makeTrigger(scrub, holdPct) {
        this._holdPct = holdPct;
        const self = this;
        return {
            _svcHScroll:         true,
            trigger:             '.services-scene',
            start:               'top top',
            end:                 'bottom bottom',
            scrub,
            pin:                 '.services-sticky-frame',
            anticipatePin:       1,
            pinSpacing:          false,
            invalidateOnRefresh: true,
            onRefresh(st)  { self._trigger = st; },
            onUpdate(st)   { if (!self._trigger) self._trigger = st; }
        };
    },

    // Mobile layout — single card at a time, sequential slide in/out
    _setupMobile(cards, numCards, winW) {
        const sidePad = 24;
        const cardW   = Math.min(winW - sidePad * 2, 340);
        const centerX = (winW - cardW) / 2;

        cards.forEach(card => { card.style.width = `${cardW}px`; });
        gsap.set(cards, { x: winW + 60, yPercent: -50, opacity: 0, scale: 0.92, rotate: 0 });

        const tl      = gsap.timeline({ scrollTrigger: this._makeTrigger(1.0, 0.17) });
        const slotDur = 0.16;
        const holdDur = 0.18;
        const exitDur = 0.12;

        for (let i = 0; i < numCards; i++) {
            const base = i * (holdDur + exitDur * 0.5);
            tl.to(cards[i], { x: centerX, opacity: 1, scale: 1, rotate: 0, duration: slotDur, ease: 'power2.out' }, base);
            if (i < numCards - 1) {
                tl.to(cards[i], { x: -(cardW + 60), opacity: 0, scale: 0.92, duration: exitDur, ease: 'power2.in' }, base + slotDur + holdDur);
            }
        }

        tl.to({}, { duration: 0.14 });
        if (cards[numCards - 1]) {
            tl.to(cards[numCards - 1], { x: winW + 60, opacity: 0, scale: 0.90, duration: 0.16, ease: 'power3.in' });
        }
        this._addOutro(tl);
    },

    // Tablet layout — cards in pairs
    _setupTablet(cards, numCards, winW) {
        const sidePad = 32;
        const gap     = 20;
        const cardW   = Math.min(Math.floor((winW - sidePad * 2 - gap) / 2), 320);
        const pairW   = cardW * 2 + gap;
        const pairX   = (winW - pairW) / 2;

        cards.forEach(card => { card.style.width = `${cardW}px`; });
        gsap.set(cards, { x: winW + 60, yPercent: -50, opacity: 0, scale: 0.90, rotate: 0 });

        const tl = gsap.timeline({ scrollTrigger: this._makeTrigger(1.1, 0.20) });

        const pairs = [];
        for (let i = 0; i < numCards; i += 2) {
            if (i + 1 < numCards) pairs.push([i, i + 1]);
            else pairs.push([i]);
        }

        let cursor     = 0;
        const enterDur = 0.14;
        const holdDur  = 0.22;
        const exitDur  = 0.10;

        pairs.forEach((pair, pi) => {
            const isSingle = pair.length === 1;
            pair.forEach((ci, offset) => {
                if (!cards[ci]) return;
                const xPos = isSingle ? (winW - cardW) / 2 : pairX + offset * (cardW + gap);
                tl.to(cards[ci], { x: xPos, opacity: 1, scale: 1, rotate: 0, duration: enterDur, ease: 'power2.out' }, cursor + offset * 0.05);
            });
            tl.to({}, { duration: holdDur }, cursor + enterDur);
            if (pi < pairs.length - 1) {
                pair.forEach((ci, offset) => {
                    if (!cards[ci]) return;
                    tl.to(cards[ci], { x: -(cardW + 60), opacity: 0, scale: 0.90, duration: exitDur, ease: 'power2.in' }, cursor + enterDur + holdDur + offset * 0.03);
                });
            }
            cursor += enterDur + holdDur + (pi < pairs.length - 1 ? exitDur + 0.04 : 0);
        });

        tl.to({}, { duration: 0.10 });
        pairs[pairs.length - 1].forEach((ci, offset) => {
            if (!cards[ci]) return;
            tl.to(cards[ci], {
                x:        winW + 60 + offset * 40,
                rotate:   offset * 2,
                scale:    0.88,
                opacity:  0,
                duration: 0.16,
                ease:     'power3.in'
            }, `>-0.${offset > 0 ? '08' : '00'}`);
        });
        this._addOutro(tl);
    },

    // Desktop layout — all cards spread across viewport simultaneously
    _setupDesktop(cards, numCards, winW) {
        const cardWidthRatio = 5;
        const cardGapRatio   = 1;
        const totalUnits     = (numCards * cardWidthRatio) + ((numCards + 1) * cardGapRatio);
        const unit           = winW / totalUnits;
        const cardW          = Math.max(240, Math.min(380, cardWidthRatio * unit));
        const cardGap        = Math.max(12,  Math.min(40,  cardGapRatio * unit));

        cards.forEach(card => { card.style.width = `${cardW}px`; });
        gsap.set(cards, { x: -winW - 200, yPercent: -50, opacity: 0, scale: 0.88 });

        const totalSpread = numCards * cardW + (numCards - 1) * cardGap;
        const startX      = Math.max(cardGap, (winW - totalSpread) / 2);

        // holdPct 0.38–0.44 ensures getSweetSpotY lands in the hold phase
        const tl = gsap.timeline({ scrollTrigger: this._makeTrigger(1.2, 0.41) });

        for (let i = 0; i < numCards; i++) {
            tl.to(cards[i], { x: startX + i * (cardW + cardGap), opacity: 1, scale: 1, duration: 0.16, ease: 'power2.out' }, i * 0.11);
        }
        // Hold — all cards visible together
        tl.to({}, { duration: 0.30 });
        tl.to(cards, {
            x:        (i) => winW + 80 + (i * 50),
            y:        (i) => i * -20,
            rotate:   (i) => i * 2.5,
            scale:    0.90,
            opacity:  (i) => Math.max(0, 1 - i * 0.18),
            stagger:  0.04,
            duration: 0.26,
            ease:     'power3.in'
        });
        this._addOutro(tl);
    },

    // Fade in/out the outro text overlay after last card exits
    _addOutro(tl) {
        const outro = document.querySelector('.services-outro');
        if (!outro) return;
        gsap.set(outro, { opacity: 0 });
        tl.to(outro, { opacity: 1, duration: 0.18, ease: 'power2.out' }, '>-0.08');
        tl.to(outro, { opacity: 0, duration: 0.14, ease: 'power2.in'  }, '+=0.22');
    }
};