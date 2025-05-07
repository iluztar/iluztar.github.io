import { state, elements } from '../core/config.js';

export const updateLightboxCounter = () => {
    if (!elements.lightboxCounter || !state.portfolioImages.length) return;
    elements.lightboxCounter.textContent = `${state.currentImageIndex + 1} / ${state.portfolioImages.length}`;
};

export const updateLightboxImage = () => {
    if (!elements.lightboxImg || !state.portfolioImages[state.currentImageIndex]) return;
    elements.lightboxImg.src = state.portfolioImages[state.currentImageIndex].src;
    elements.lightboxImg.alt = state.portfolioImages[state.currentImageIndex].alt;
};

export const navigateLightbox = (direction) => {
    if (!state.portfolioImages.length) return;
    
    state.currentImageIndex = (state.currentImageIndex + direction + state.portfolioImages.length) % state.portfolioImages.length;
    updateLightboxImage();
    updateLightboxCounter();
};

export const setupLightbox = () => {
    if (!elements.lightbox) return;
    
    document.addEventListener('click', (e) => {
        const img = e.target.closest('.modal-item img');
        if (img) {
            const index = Array.from(document.querySelectorAll('.modal-item img')).indexOf(img);
            if (index >= 0) {
                state.currentImageIndex = index;
                updateLightboxImage();
                elements.lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                updateLightboxCounter();
                state.isModalOpen = true;
            }
        }
    });
    
    elements.lightboxClose?.addEventListener('click', () => {
        elements.lightbox.style.display = 'none';
        document.body.style.overflow = '';
        state.isModalOpen = false;
    });
    
    elements.lightboxPrev?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
    });
    
    elements.lightboxNext?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
    });
    
    document.addEventListener('keydown', (e) => {
        if (elements.lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                elements.lightbox.style.display = 'none';
                document.body.style.overflow = '';
                state.isModalOpen = false;
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        }
    });
};