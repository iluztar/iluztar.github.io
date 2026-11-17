'use strict';

export const dom = {};

export function initDom() {
    Object.assign(dom, {
        body:                 document.body,
        html:                 document.documentElement,
        alertBar:             document.getElementById('alert'),
        scrollIndicator:      document.querySelector('.scroll-indicator'),
        scrollProgress:       document.getElementById('scrollProgress'),
        faqAccordion:         document.getElementById('faqAccordion'),
        portfolioWrapper:     document.getElementById('portfolioWrapper'),
        testimonialWrapper:   document.getElementById('testimonialWrapper'),
        servicesCardsWrapper: document.getElementById('servicesCardsWrapper')
    });
}