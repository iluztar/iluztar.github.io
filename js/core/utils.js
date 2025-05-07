import { state } from './config.js';

export const debounce = (func, wait = 10, immediate = true) => {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export const isScrollableElement = (el) => {
    if (!el) return false;
    return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
};

export const closeModal = (modal) => {
    if (!modal) return;
    
    if (modal.classList.contains('modal')) {
        modal.style.display = 'none';
    } else {
        modal.classList.remove('active');
    }
    
    const anyModalOpen = document.querySelector('.modal[style*="display: block"], .cart-sidebar.active, .mobile-menu.active');
    if (!anyModalOpen) {
        document.body.style.overflow = '';
        state.isModalOpen = false;
    }
};

export const fallbackScroll = (target, callback) => {
    const targetPosition = target.offsetTop;
    
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        setTimeout(callback, state.scrollDuration || 800);
    } else {
        window.scrollTo(0, targetPosition);
        callback();
    }
};