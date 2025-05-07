import { state, elements } from '../core/config.js';
import { closeModal } from '../core/utils.js';

export const setupModals = () => {
    // Open modals
    document.querySelectorAll('.btn[data-modal]').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                state.isModalOpen = true;
            }
        });
    });
    
    // Video modal
    const videoPlayButton = document.querySelector('.video-play-button');
    const videoModal = document.getElementById('video-modal');
    if (videoPlayButton && videoModal) {
        videoPlayButton.addEventListener('click', () => {
            videoModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            state.isModalOpen = true;
        });
    }
    
    // Close modals
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal(this);
        });
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal[style*="display: block"], .cart-sidebar.active, .mobile-menu.active').forEach(el => {
                closeModal(el);
            });
        }
    });
};