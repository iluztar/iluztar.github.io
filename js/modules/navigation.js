import { state, elements } from '../core/config.js';
import { debounce, fallbackScroll } from '../core/utils.js';

export const updateHeaderNav = () => {
    if (!elements.headerNavLinks || !state.sections || state.currentSectionIndex < 0 || 
        state.currentSectionIndex >= state.sections.length) return;
        
    const currentSection = state.sections[state.currentSectionIndex];
    if (!currentSection || !currentSection.id) return;
    
    const targetId = `#${currentSection.id}`;
    
    elements.headerNavLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === targetId);
    });
};

export const updateControlNav = () => {
    if (!elements.controlNavItems || !elements.controlNavItems.length) return;
    
    elements.controlNavItems.forEach((item, index) => {
        item.classList.toggle('active', index === state.currentSectionIndex);
    });
};

export const updateSectionCounter = () => {
    const currentSectionElements = document.querySelectorAll('.current-section');
    const totalSectionElements = document.querySelectorAll('.total-sections');
    
    if (!currentSectionElements.length || !totalSectionElements.length || !state.sections) return;
    
    const currentSection = (state.currentSectionIndex + 1).toString().padStart(2, '0');
    const totalSections = state.sections.length.toString().padStart(2, '0');
    
    currentSectionElements.forEach(el => el.textContent = currentSection);
    totalSectionElements.forEach(el => el.textContent = totalSections);
};

export const updateCurrentSection = () => {
    if (state.isModalOpen || !state.sections || !state.sections.length) return;
    const scrollPosition = window.scrollY + (window.innerHeight / 2);
    
    let foundActiveSection = false;
    state.sections.forEach((section, index) => {
        if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
            state.currentSectionIndex = index;
            foundActiveSection = true;
            updateControlNav();
            updateHeaderNav();
            updateSectionCounter();
        }
    });
    
    if (!foundActiveSection && window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
        state.currentSectionIndex = state.sections.length - 1;
        updateControlNav();
        updateHeaderNav();
        updateSectionCounter();
    }
};

export const handleTouchStart = (e) => {
    if (state.isModalOpen) return;
    state.touchStartY = e.touches[0].clientY;
};

export const handleTouchEnd = (e) => {
    if (state.isScrolling || state.isModalOpen || !state.sections || !state.sections.length) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - state.touchStartY;
    
    if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
            scrollToPrevSection();
        } else {
            scrollToNextSection();
        }
    }
};

export const handleKeyNavigation = (e) => {
    if (state.isScrolling || state.isModalOpen || !state.sections || !state.sections.length) return;
    
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
    }
    
    switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
            e.preventDefault();
            scrollToNextSection();
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            scrollToPrevSection();
            break;
        case 'Home':
            e.preventDefault();
            scrollToSection(0);
            break;
        case 'End':
            e.preventDefault();
            scrollToSection(state.sections.length - 1);
            break;
    }
};

export const handleWheelScroll = (e) => {
    if (state.isScrolling || state.isModalOpen || !state.sections || !state.sections.length) return;
    
    const isInScrollableElement = e.target.closest('.scrollable') || 
                                 isScrollableElement(e.target);
    
    if (isInScrollableElement) return;
    
    e.preventDefault();
    
    if (e.deltaY > 0) {
        scrollToNextSection();
    } else if (e.deltaY < 0) {
        scrollToPrevSection();
    }
};

export const scrollToSectionByHref = (href) => {
    if (!href || !state.sections || !state.sections.length) return;
    
    const targetElement = document.querySelector(href);
    if (targetElement) {
        const index = Array.from(state.sections).findIndex(section => section === targetElement);
        if (index >= 0) {
            scrollToSection(index);
        }
    }
};

export const scrollToSection = (index) => {
    if (state.isScrolling || index < 0 || index >= state.sections.length) return;
    
    state.isScrolling = true;
    state.currentSectionIndex = index;
    const target = state.sections[index];
    
    if (typeof gsap !== 'undefined' && gsap.to) {
        gsap.to(window, {
            scrollTo: {y: target, autoKill: false},
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
                state.isScrolling = false;
                updateControlNav();
                updateHeaderNav();
                updateSectionCounter();
            }
        });
    } else {
        fallbackScroll(target, () => {
            state.isScrolling = false;
            updateControlNav();
            updateHeaderNav();
            updateSectionCounter();
        });
    }
};

export const scrollToNextSection = () => {
    if (!state.sections || !state.sections.length) return;
    if (state.currentSectionIndex < state.sections.length - 1) {
        scrollToSection(state.currentSectionIndex + 1);
    }
};

export const scrollToPrevSection = () => {
    if (!state.sections || !state.sections.length) return;
    if (state.currentSectionIndex > 0) {
        scrollToSection(state.currentSectionIndex - 1);
    }
};

export const setupNavigation = () => {
    elements.scrollLinks?.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSectionByHref(targetId);
        });
    });
    
    elements.controlNavItems?.forEach((item, index) => {
        item.addEventListener('click', function() {
            scrollToSection(index);
        });
    });
    
    document.querySelectorAll('.prev-section').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToPrevSection();
        });
    });
    
    document.querySelectorAll('.next-section').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToNextSection();
        });
    });
    
    window.addEventListener('wheel', handleWheelScroll, { passive: false });
    document.addEventListener('keydown', handleKeyNavigation);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('scroll', debounce(updateCurrentSection));
};