import { state, elements } from '../core/config.js';
import { updateCartButtons } from './cart.js';

export const updateLanguageContent = () => {
    document.querySelectorAll('[data-lang-en], [data-lang-id]').forEach(el => {
        el.classList.add('language-changing');
    });
    
    setTimeout(() => {
        document.querySelectorAll('[data-lang-en], [data-lang-id]').forEach(element => {
            const attr = `data-lang-${state.currentLanguage}`;
            if (element.hasAttribute(attr)) {
                let newText = element.getAttribute(attr);
                
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    newText = newText.replace(/<br\s*\/?>/gi, '\n');
                    element.placeholder = newText;
                } else {
                    element.innerHTML = newText;
                }
            }
            element.classList.remove('language-changing');
        });
    }, 300);
    
    const checkoutButton = document.querySelector('.cart-actions .cybr-btn');
    if (checkoutButton && checkoutButton.hasAttribute(`data-lang-${state.currentLanguage}`)) {
        checkoutButton.textContent = checkoutButton.getAttribute(`data-lang-${state.currentLanguage}`);
    }
    
    const openModal = document.querySelector('.modal[style="display: block;"]');
    if (openModal) {
        const modalTitle = openModal.querySelector('.modal-header h2');
        if (modalTitle && modalTitle.hasAttribute(`data-lang-${state.currentLanguage}`)) {
            modalTitle.textContent = modalTitle.getAttribute(`data-lang-${state.currentLanguage}`);
        }
    }
};

export const setupLanguage = () => {
    elements.languageSelectors.forEach(selector => {
        selector.addEventListener('click', function() {
            state.currentLanguage = state.currentLanguage === 'en' ? 'id' : 'en';
            
            elements.languageCurrents.forEach(el => {
                el.textContent = state.currentLanguage.toUpperCase();
            });
            
            updateLanguageContent();
            updateCartButtons();
        });
    });
};