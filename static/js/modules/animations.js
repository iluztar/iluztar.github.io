'use strict';

export const animations = {
    // Initialize all GSAP scroll-based animations
    init(lenis) {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP not loaded -- skipping animations');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        this._setInitialStates();
        this._animateBigText();
        this._animateSections();

        ScrollTrigger.refresh();
    },

    // Set opacity/transform initial hidden state before scroll animations trigger
    _setInitialStates() {
        const selectors = [
            '#portfolio .section-header',    '#portfolio .carousel-section',
            '#testimonials .section-header', '#testimonials .carousel-section',
            '#faq .section-header',          '#faq .faq-item',
            '#contact .section-header',      '#contact .contact-card'
        ];
        selectors.forEach(sel => {
            const els = document.querySelectorAll(sel);
            if (els.length) gsap.set(els, { opacity: 0, y: 28, immediateRender: true });
        });

        document.querySelectorAll('.big-text').forEach(text => {
            text.classList.remove('filled', 'force-filled');
            gsap.set(text, { backgroundSize: '0% 100%', opacity: 0.4, y: 50, scale: 0.9, immediateRender: true });
        });
    },

    // Scrub-based big text fill animation tied to scroll position
    _animateBigText() {
        const textElements = gsap.utils.toArray('.big-text');
        if (!textElements.length) return;

        textElements.forEach(text => {
            const isServicesBigText = text.classList.contains('services-big-text');
            const trigger   = isServicesBigText ? document.querySelector('.services-scene') : text;
            const fillStart = isServicesBigText ? 'top top'  : 'top 85%';
            const fillEnd   = isServicesBigText ? '15% top'  : 'top 55%';
            const entrStart = isServicesBigText ? 'top 100%' : 'top 85%';
            const entrEnd   = isServicesBigText ? '10% top'  : 'top 20%';

            gsap.to(text, {
                backgroundSize: '100% 100%',
                ease: 'none',
                immediateRender: false,
                scrollTrigger: {
                    trigger, start: fillStart, end: fillEnd, scrub: 1.5,
                    onUpdate(self) {
                        if (self.progress >= 0.95) {
                            text.classList.add('filled');
                            text.style.backgroundSize = '100% 100%';
                        } else if (self.progress < 0.80) {
                            text.classList.remove('filled');
                        }
                    },
                    onLeave()     { text.style.backgroundSize = '100% 100%'; text.classList.add('filled'); },
                    onLeaveBack() { text.style.backgroundSize = '0% 100%';   text.classList.remove('filled'); }
                }
            });

            gsap.fromTo(text,
                { opacity: 0.3, scale: 0.92, y: 40 },
                {
                    opacity: 1, scale: 1, y: 0, ease: 'power2.out',
                    scrollTrigger: {
                        trigger, start: entrStart, end: entrEnd,
                        scrub: 1, toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    },

    // Fade-in animations for each major section as it enters viewport
    _animateSections() {
        const sectionGroups = [
            { trigger: '#portfolio', items: [
                { sel: '#portfolio .section-header',   delay: 0    },
                { sel: '#portfolio .carousel-section', delay: 0.15 }
            ]},
            { trigger: '#testimonials', items: [
                { sel: '#testimonials .section-header',   delay: 0    },
                { sel: '#testimonials .carousel-section', delay: 0.15 }
            ]},
            { trigger: '#faq', items: [
                { sel: '#faq .section-header', delay: 0,    stagger: 0    },
                { sel: '#faq .faq-item',       delay: 0.15, stagger: 0.07 }
            ]},
            { trigger: '#contact', items: [
                { sel: '#contact .section-header', delay: 0,    stagger: 0    },
                { sel: '#contact .contact-card',   delay: 0.15, stagger: 0.09 }
            ]}
        ];

        sectionGroups.forEach(group => {
            const triggerEl = document.querySelector(group.trigger);
            if (!triggerEl) return;

            ScrollTrigger.create({
                trigger: triggerEl, start: 'top 82%',
                toggleActions: 'play none none none', once: true,
                onEnter() {
                    group.items.forEach(item => {
                        const elements = document.querySelectorAll(item.sel);
                        if (!elements.length) return;
                        gsap.to(elements, {
                            opacity:  1,
                            y:        0,
                            duration: 0.65,
                            ease:     'power2.out',
                            delay:    item.delay,
                            stagger:  item.stagger || 0
                        });
                    });
                }
            });
        });
    }
};