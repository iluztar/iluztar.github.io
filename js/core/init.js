import { state, elements } from './config.js';
import { initElements } from '../modules/dom.js';
import { setupThemeSwitcher } from '../modules/theme.js';
import { setupMobileMenu } from '../modules/mobileMenu.js';
import { setupCart } from '../modules/cart.js';
import { setupModals } from '../modules/modals.js';
import { setupLightbox } from '../modules/lightbox.js';
import { setupNavigation } from '../modules/navigation.js';
import { setupLanguage } from '../modules/language.js';
import { setupContactForm } from '../modules/contactForm.js';
import { setupSwiper } from '../modules/swiper.js';
import { setupCommissionCarousel } from '../modules/commission.js';

export const init = () => {
    document.body.classList.add('loaded');
    state.sections = document.querySelectorAll('section');
    initElements();

    try {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        state.currentLanguage = 'en';

        setupThemeSwitcher();
        setupMobileMenu();
        setupCart();
        setupModals();
        setupLightbox();
        setupNavigation();
        setupLanguage();
        setupContactForm();
        setupCommissionCarousel();

        if (typeof Swiper !== 'undefined') {
            setupSwiper();
        } else {
            console.warn('Swiper library not found.');
        }

        const portfolioImages = document.querySelectorAll('.modal-item img');
        if (portfolioImages.length > 0) {
            state.portfolioImages = Array.from(portfolioImages).map(img => ({
                src: img.src,
                alt: img.alt
            }));
        }

        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Initialization error:', error);
    }
};