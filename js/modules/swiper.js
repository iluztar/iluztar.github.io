import { state } from '../core/config.js';

export const setupSwiper = () => {
    const swiperContainer = document.querySelector('.swiper');
    if (!swiperContainer || typeof Swiper === 'undefined') return;
    
    try {
        state.swiper = new Swiper('.swiper', {
            slidesPerView: 'auto',
            spaceBetween: 20,
            centeredSlides: false,
            loop: false,
            grabCursor: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 15 },
                480: { slidesPerView: 1.2, spaceBetween: 15 },
                576: { slidesPerView: 1.5, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 25 },
                992: { slidesPerView: 2.5, spaceBetween: 30 },
                1200: { slidesPerView: 3, spaceBetween: 30 }
            },
            a11y: {
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
                firstSlideMessage: 'This is the first slide',
                lastSlideMessage: 'This is the last slide',
            },
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: true,
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            observer: true,
            observeParents: true,
            preventInteractionOnTransition: true
        });
        
        window.addEventListener('resize', function() {
            state.swiper.update();
        });
    } catch (error) {
        console.error('Error initializing Swiper:', error);
    }
};