import { state, elements } from '../core/config.js';

export const toggleMenu = () => {
    elements.burger.classList.toggle('active');
    elements.mobileMenu.classList.toggle('active');
    document.body.style.overflow = elements.mobileMenu.classList.contains('active') ? 'hidden' : '';
    state.isModalOpen = elements.mobileMenu.classList.contains('active');
};

export const setupMobileMenu = () => {
    if (!elements.burger || !elements.mobileMenu) return;
    
    elements.burger.addEventListener('click', toggleMenu);
    elements.mobileMenuClose?.addEventListener('click', toggleMenu);
    
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
};