// State global dan konfigurasi
export const state = {
    cart: [],
    isScrolling: false,
    isModalOpen: false,
    currentImageIndex: 0,
    portfolioImages: [],
    currentSectionIndex: 0,
    touchStartY: 0,
    sections: [],
    scrollDuration: 800,
    currentLanguage: 'en',
    swiper: null,
    carousel: {
        currentIndex: 0,
        itemsToShow: 1,
        itemWidth: 0,
        track: null,
        items: [],
        nextButton: null,
        prevButton: null,
        startX: 0,
        deltaX: 0,
        isDragging: false,
        timer: null
    }
};

// Cache DOM elements
export const elements = {};