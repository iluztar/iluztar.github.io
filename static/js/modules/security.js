'use strict';

export const security = {
    init() {
        document.addEventListener('contextmenu', e => {
            if (e.target.tagName === 'IMG' || e.target.closest('.card, .portfolio-card')) {
                e.preventDefault();
            }
        });

        document.querySelectorAll('.card, .portfolio-card, .testimonial-card').forEach(el => {
            el.style.userSelect       = 'none';
            el.style.webkitUserSelect = 'none';
        });
    }
};

export const social = {
    fixInstagramLinks() {
        document.querySelectorAll('.instagram-link').forEach(link => {
            const username = link.dataset.username;
            if (!username) return;
            link.href   = `https://www.instagram.com/${username}/`;
            link.target = '_blank';
            if (!link.hasAttribute('rel')) link.setAttribute('rel', 'noopener noreferrer');
        });
    },

    setupLinks() {
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            if (!link.hasAttribute('rel')) link.setAttribute('rel', 'noopener noreferrer');
        });
    }
};

export const images = {
    protect() {
        document.querySelectorAll('img').forEach(img => {
            img.setAttribute('draggable', 'false');
            img.addEventListener('contextmenu', e => e.preventDefault());
        });
    }
};