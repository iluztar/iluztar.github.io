import { state, elements } from '../core/config.js';
import { initElements } from './dom.js';
import { setupThemeSwitcher } from './theme.js';
import { setupMobileMenu } from './mobileMenu.js';
import { setupCart, updateCartButtons } from './cart.js';
import { setupModals } from './modals.js';
import { setupLightbox } from './lightbox.js';
import { setupNavigation } from './navigation.js';
import { setupLanguage } from './language.js';
import { setupContactForm } from './contactForm.js';
import { setupSwiper } from './swiper.js';
import { setupCommissionCarousel } from './commission.js';

export const init = () => {
    // Initialize DOM elements first
    initElements();
    
    // Set initial theme and language
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    state.currentLanguage = 'en';
    
    // Setup all functionality
    setupThemeSwitcher();
    setupMobileMenu();
    setupCart();
    setupModals();
    setupLightbox();
    setupNavigation();
    setupLanguage();
    setupContactForm();
    setupCommissionCarousel();

    // Initialize Swiper if available
    if (typeof Swiper !== 'undefined') {
        setupSwiper();
    } else {
        console.warn('Swiper library not found.');
    }

    // Load portfolio images
    const portfolioImages = document.querySelectorAll('.modal-item img');
    if (portfolioImages.length > 0) {
        state.portfolioImages = Array.from(portfolioImages).map(img => ({
            src: img.src,
            alt: img.alt
        }));
    }

    // Update UI elements
    updateCartButtons();
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Mark page as loaded
    document.body.classList.add('loaded');
};