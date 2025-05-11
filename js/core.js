// ===== Global Variables =====
const state = {
    cart: [],
    isScrolling: false,
    isModalOpen: false,
    currentImageIndex: 0,
    portfolioImages: [],
    currentSectionIndex: 0,
    touchStartY: 0,
    sections: document.querySelectorAll('section'),
    scrollDuration: 800,
    currentLanguage: localStorage.getItem('language') || 'en',
    currentTheme: localStorage.getItem('theme') || 'dark',
    lastScrollPosition: 0,
    isDraggingCarousel: false,
    carouselStartX: 0,
    isMobile: window.innerWidth <= 768
};

// ===== DOM Elements =====
const elements = {
    themeIconLight: document.getElementById('theme-icon-light'),
    themeIconDark: document.getElementById('theme-icon-dark'),
    mobileThemeIconLight: document.getElementById('mobile-theme-icon-light'),
    mobileThemeIconDark: document.getElementById('mobile-theme-icon-dark'),
    burger: document.querySelector('.menu-burger'),
    mobileMenu: document.querySelector('.mobile-menu'),
    mobileMenuClose: document.querySelector('.mobile-menu-close'),
    cartIcon: document.querySelector('.cart-icon'),
    cartSidebar: document.querySelector('.cart-sidebar'),
    cartClose: document.querySelector('.cart-close'),
    cartItemsContainer: document.querySelector('.cart-items'),
    cartTotal: document.querySelector('.cart-total-amount'),
    cartCount: document.querySelector('.cart-count'),
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.querySelector('.lightbox-content img'),
    lightboxClose: document.querySelector('.lightbox-close'),
    lightboxPrev: document.querySelector('.lightbox-prev'),
    lightboxNext: document.querySelector('.lightbox-next'),
    lightboxCounter: document.querySelector('.lightbox-counter'),
    languageSelectors: document.querySelectorAll('.language-toggle, .language-selector'),
    languageCurrents: document.querySelectorAll('.language-current'),
    scrollLinks: document.querySelectorAll('.scroll, .scroll-link'),
    controlNavItems: document.querySelectorAll('.line-nav li'),
    headerNavLinks: document.querySelectorAll('nav.header-nav ul li a, .mobile-menu a'),
    scrollDown: document.querySelector('.scroll-down'),
    modals: document.querySelectorAll('.modal'),
    loader: document.querySelector('.loader'),
    loaderProgress: document.querySelector('.loader-progress'),
    loaderCounter: document.querySelector('.loader-counter'),
    paymentToggle: document.querySelector('.payment-toggle'),
    paymentOptions: document.querySelector('.payment-options'),
    accordionItems: document.querySelectorAll('.accordion-item'),
    accordionHeaders: document.querySelectorAll('.accordion-header'),
    videoPlayButton: document.querySelector('.video-play-button'),
    carousel: document.querySelector('.carousel-container'),
    themeToggleButtons: document.querySelectorAll('.theme-toggle, .theme-icon-wrapper, .mobile-theme-toggle, .mobile-theme-icon-wrapper')
};

// ===== UTILITY FUNCTIONS =====
const utils = {
    debounce(func, wait = 100, immediate = false) {
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
    },

    throttle(func, limit = 100) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    isScrollableElement(el) {
        if (!el) return false;
        return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
    },

    closeModal(modal) {
        if (!modal) return;
        
        if (modal.classList.contains('modal')) {
            modal.style.display = 'none';
        } else {
            modal.classList.remove('active');
        }
        
        const anyModalOpen = document.querySelector('.modal[style*="display: block"], .cart-sidebar.active, .mobile-menu.active, .lightbox[style*="display: flex"]');
        if (!anyModalOpen) {
            document.body.style.overflow = '';
            state.isModalOpen = false;
        }
    },

    closeAllModals() {
        // Close mobile menu if open
        if (elements.mobileMenu?.classList.contains('active')) {
            elements.mobileMenu.classList.remove('active');
            elements.burger?.classList.remove('active');
        }
        
        // Close cart sidebar if open
        if (elements.cartSidebar?.classList.contains('active')) {
            elements.cartSidebar.classList.remove('active');
        }
        
        // Close all regular modals
        document.querySelectorAll('.modal[style*="display: block"]').forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Close lightbox if open
        if (elements.lightbox?.style.display === 'flex') {
            elements.lightbox.style.display = 'none';
        }
        
        // Reset state and body overflow
        state.isModalOpen = false;
        document.body.style.overflow = '';
    },

    scrollTo(target, callback) {
        if (typeof gsap !== 'undefined' && gsap.to) {
            gsap.to(window, {
                scrollTo: { y: target, autoKill: false },
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: callback
            });
        } else {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
            setTimeout(callback, state.scrollDuration);
        }
    },

    checkMobile() {
        state.isMobile = window.innerWidth <= 768;
        return state.isMobile;
    }
};

// ===== LOADER =====
function initLoader() {
    if (!elements.loader) return;
    
    let progress = 0;
    const loaderInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        
        elements.loaderProgress.style.width = `${progress}%`;
        elements.loaderCounter.textContent = `${Math.floor(progress)}%`;
        
        if (progress >= 100) {
            clearInterval(loaderInterval);
            setTimeout(() => {
                elements.loader.style.opacity = '0';
                setTimeout(() => {
                    elements.loader.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 500);
            }, 500);
        }
    }, 200);
}

// ===== THEME MANAGEMENT =====
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    state.currentTheme = theme;
    updateThemeIcons(theme);
}

function updateThemeIcons(theme) {
    if (theme === 'dark') {
        elements.themeIconLight?.classList.remove('hidden');
        elements.themeIconDark?.classList.add('hidden');
        elements.mobileThemeIconLight?.classList.remove('hidden');
        elements.mobileThemeIconDark?.classList.add('hidden');
    } else {
        elements.themeIconLight?.classList.add('hidden');
        elements.themeIconDark?.classList.remove('hidden');
        elements.mobileThemeIconLight?.classList.add('hidden');
        elements.mobileThemeIconDark?.classList.remove('hidden');
    }
}

function setupThemeSwitcher() {
    applyTheme(state.currentTheme);
    
    const switchTheme = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const newTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    };
    
    elements.themeToggleButtons.forEach(element => {
        element.addEventListener('click', switchTheme);
    });
}

// ===== MOBILE MENU =====
const mobileMenu = {
    toggleMenu(forceClose = false) {
        if (forceClose || elements.mobileMenu?.classList.contains('active')) {
            // Close menu
            elements.burger?.classList.remove('active');
            elements.mobileMenu?.classList.remove('active');
            document.body.style.overflow = '';
            state.isModalOpen = false;
        } else {
            // Open menu (close other modals first)
            utils.closeAllModals();
            elements.burger?.classList.add('active');
            elements.mobileMenu?.classList.add('active');
            document.body.style.overflow = 'hidden';
            state.isModalOpen = true;
        }
    },

    setup() {
        if (!elements.burger || !elements.mobileMenu) return;
        
        elements.burger.addEventListener('click', () => mobileMenu.toggleMenu());
        elements.mobileMenuClose?.addEventListener('click', () => mobileMenu.toggleMenu(true));
        
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => mobileMenu.toggleMenu(true), 300);
            });
        });
    }
};

// ===== SHOPPING CART =====
function updateCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        const itemId = button.getAttribute('data-id') || 
                      button.getAttribute('data-title').toLowerCase().replace(/\s+/g, '-');
        const isInCart = state.cart.some(item => item.id === itemId);
        
        if (isInCart) {
            button.disabled = true;
            button.textContent = state.currentLanguage === 'id' ? 'Di Keranjang' : 'In Cart';
        } else {
            const text = state.currentLanguage === 'id' ? 
                button.getAttribute('data-lang-id') : 
                button.getAttribute('data-lang-en');
            button.textContent = text || 'Add to Cart';
            button.disabled = false;
        }
    });
}

function updateCart() {
    if (!elements.cartItemsContainer) return;
    
    elements.cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    state.cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="https://placeholder.pics/svg/100x100" alt="${item.title}" loading="lazy">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}" aria-label="Decrease quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}" aria-label="Increase quantity">+</button>
                </div>
                <button class="remove-item" data-index="${index}" aria-label="Remove item"><i class='bx bx-trash-alt'></i></button>
            </div>
        `;
        
        elements.cartItemsContainer.appendChild(cartItem);
    });
    
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const isPlus = this.classList.contains('plus');
            
            if (isPlus) {
                state.cart[index].quantity++;
            } else {
                if (state.cart[index].quantity > 1) {
                    state.cart[index].quantity--;
                } else {
                    state.cart.splice(index, 1);
                }
            }
            
            updateCart();
            updateCartButtons();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            state.cart.splice(index, 1);
            updateCart();
            updateCartButtons();
        });
    });
    
    if (elements.cartTotal) elements.cartTotal.textContent = total.toFixed(2);
    if (elements.cartCount) {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        elements.cartCount.textContent = totalItems;
    }
}

function toggleCart(forceClose = false) {
    if (forceClose || elements.cartSidebar.classList.contains('active')) {
        // Close cart
        elements.cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
        state.isModalOpen = false;
    } else {
        // Open cart (close other modals first)
        utils.closeAllModals();
        elements.cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
        state.isModalOpen = true;
    }
}

function setupCart() {
    if (!elements.cartIcon || !elements.cartSidebar) return;
    
    elements.cartIcon.addEventListener('click', () => toggleCart());
    elements.cartClose?.addEventListener('click', () => toggleCart(true));
    
    if (elements.paymentToggle) {
        elements.paymentToggle.addEventListener('click', () => {
            elements.paymentOptions.classList.toggle('hidden');
        });
    }
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const titleId = this.getAttribute('data-title-id') || title;
            const price = parseFloat(this.getAttribute('data-price'));
            const id = this.getAttribute('data-id') || title.toLowerCase().replace(/\s+/g, '-');
            
            const itemTitle = state.currentLanguage === 'id' && titleId ? titleId : title;
            
            const existingItem = state.cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                state.cart.push({ 
                    id,
                    title: itemTitle, 
                    price,
                    quantity: 1
                });
            }
            
            updateCart();
            updateCartButtons();
            
            this.disabled = true;
            this.textContent = state.currentLanguage === 'id' ? 'Di Keranjang' : 'In Cart';
        });
    });
}

// ===== MODALS =====
function setupModals() {
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                utils.closeAllModals();
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                state.isModalOpen = true;
            }
        });
    });
    
    if (elements.videoPlayButton) {
        const videoModal = document.getElementById('video-modal');
        elements.videoPlayButton.addEventListener('click', () => {
            utils.closeAllModals();
            videoModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            state.isModalOpen = true;
        });
    }
    
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) utils.closeModal(modal);
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) utils.closeModal(this);
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            utils.closeAllModals();
        }
    });
}

// ===== LIGHTBOX =====
function updateLightboxCounter() {
    if (!elements.lightboxCounter || !state.portfolioImages.length) return;
    elements.lightboxCounter.textContent = `${state.currentImageIndex + 1} / ${state.portfolioImages.length}`;
}

function updateLightboxImage() {
    if (!elements.lightboxImg || !state.portfolioImages[state.currentImageIndex]) return;
    elements.lightboxImg.src = state.portfolioImages[state.currentImageIndex].src;
    elements.lightboxImg.alt = state.portfolioImages[state.currentImageIndex].alt;
}

function navigateLightbox(direction) {
    if (!state.portfolioImages.length) return;
    
    state.currentImageIndex = (state.currentImageIndex + direction + state.portfolioImages.length) % state.portfolioImages.length;
    updateLightboxImage();
    updateLightboxCounter();
}

function setupLightbox() {
    if (!elements.lightbox) return;
    
    state.portfolioImages = Array.from(document.querySelectorAll('.modal-item img')).map(img => ({
        src: img.src,
        alt: img.alt
    }));
    
    document.addEventListener('click', (e) => {
        const img = e.target.closest('.modal-item img');
        if (img) {
            const index = Array.from(document.querySelectorAll('.modal-item img')).indexOf(img);
            if (index >= 0) {
                utils.closeAllModals();
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
}

// ===== SCROLL ANIMATIONS =====
function animateOnScroll() {
    const animateElements = document.querySelectorAll('[data-animate]');
    const windowHeight = window.innerHeight;
    const triggerOffset = windowHeight * 0.8;

    animateElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        
        if (elementPosition < triggerOffset) {
            element.classList.add('animated');
        }
    });
}

function setupScrollAnimations() {
    window.addEventListener('load', () => {
        const homeSection = document.querySelector('#home');
        if (homeSection) {
            const elements = homeSection.querySelectorAll('[data-animate]');
            elements.forEach(el => el.classList.add('animated'));
        }
        animateOnScroll();
    });
    
    window.addEventListener('scroll', utils.throttle(animateOnScroll, 100));
}

// ===== NAVIGATION SYSTEM =====
function updateHeaderNav() {
    if (!elements.headerNavLinks || !state.sections || state.currentSectionIndex < 0 || 
        state.currentSectionIndex >= state.sections.length) return;
        
    const currentSection = state.sections[state.currentSectionIndex];
    if (!currentSection || !currentSection.id) return;
    
    const targetId = `#${currentSection.id}`;
    
    elements.headerNavLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === targetId);
    });
}

function updateControlNav() {
    if (!elements.controlNavItems || !elements.controlNavItems.length) return;
    
    elements.controlNavItems.forEach((item, index) => {
        item.classList.toggle('active', index === state.currentSectionIndex);
    });
}

function updateCurrentSection() {
    if (state.isModalOpen || !state.sections || !state.sections.length) return;
    const scrollPosition = window.scrollY + (window.innerHeight / 2);
    
    let foundActiveSection = false;
    state.sections.forEach((section, index) => {
        if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
            state.currentSectionIndex = index;
            foundActiveSection = true;
            updateControlNav();
            updateHeaderNav();
        }
    });
    
    if (!foundActiveSection && window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
        state.currentSectionIndex = state.sections.length - 1;
        updateControlNav();
        updateHeaderNav();
    }
}

function handleTouchStart(e) {
    if (state.isModalOpen) return;
    state.touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
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
}

function handleKeyNavigation(e) {
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
}

function handleWheelScroll(e) {
    if (state.isScrolling || state.isModalOpen || !state.sections || !state.sections.length) return;
    
    const isInScrollableElement = e.target.closest('.scrollable') || 
                                 utils.isScrollableElement(e.target);
    
    if (isInScrollableElement) return;
    
    e.preventDefault();
    
    if (e.deltaY > 0) {
        scrollToNextSection();
    } else if (e.deltaY < 0) {
        scrollToPrevSection();
    }
}

function scrollToSectionByHref(href) {
    if (!href || !state.sections || !state.sections.length) return;
    
    const targetElement = document.querySelector(href);
    if (targetElement) {
        const index = Array.from(state.sections).findIndex(section => section === targetElement);
        if (index >= 0) {
            scrollToSection(index);
        }
    }
}

function scrollToSection(index) {
    if (state.isScrolling || index < 0 || index >= state.sections.length) return;
    
    state.isScrolling = true;
    state.currentSectionIndex = index;
    const target = state.sections[index];
    
    utils.scrollTo(target, () => {
        state.isScrolling = false;
        updateControlNav();
        updateHeaderNav();
    });
}

function scrollToNextSection() {
    if (!state.sections || !state.sections.length) return;
    if (state.currentSectionIndex < state.sections.length - 1) {
        scrollToSection(state.currentSectionIndex + 1);
    }
}

function scrollToPrevSection() {
    if (!state.sections || !state.sections.length) return;
    if (state.currentSectionIndex > 0) {
        scrollToSection(state.currentSectionIndex - 1);
    }
}

function setupNavigation() {
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
    
    if (elements.scrollDown) {
        elements.scrollDown.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToNextSection();
        });
    }
    
    window.addEventListener('wheel', handleWheelScroll, { passive: false });
    document.addEventListener('keydown', handleKeyNavigation);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    window.addEventListener('scroll', utils.throttle(updateCurrentSection, 100));
}

// ===== LANGUAGE MANAGEMENT =====
function updateLanguageContent() {
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
        
        if (elements.cartTotal) {
            const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            elements.cartTotal.textContent = total.toFixed(2);
        }
    }, 300);
}

function setupLanguageSelectors() {
    elements.languageSelectors.forEach(selector => {
        selector.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            state.currentLanguage = state.currentLanguage === 'en' ? 'id' : 'en';
            localStorage.setItem('language', state.currentLanguage);
            
            elements.languageCurrents.forEach(el => {
                el.textContent = state.currentLanguage.toUpperCase();
            });
            
            updateLanguageContent();
            updateCartButtons();
        });
    });
}

// ===== CONTACT FORM =====
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim();
        const message = form.elements.message.value.trim();
        
        if (!name || !email || !message) {
            alert(state.currentLanguage === 'id' ? 'Harap isi semua bidang' : 'Please fill in all fields');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert(state.currentLanguage === 'id' ? 'Format email tidak valid' : 'Invalid email format');
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = state.currentLanguage === 'id' ? 'Mengirim...' : 'Sending...';
        
        fetch('https://formspree.io/f/iluztar.studio@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message
            })
        })
        .then(response => {
            if (response.ok) {
                alert(state.currentLanguage === 'id' ? 
                    'Pesan terkirim! Saya akan menghubungi Anda segera.' : 
                    'Message sent! I will contact you soon.');
                form.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(() => {
            alert(state.currentLanguage === 'id' ? 
                'Terjadi kesalahan. Silakan coba lagi nanti.' : 
                'There was an error. Please try again later.');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
    });
}

// ===== Initialize Core Functionality =====
document.addEventListener('DOMContentLoaded', function() {
    try {
        initLoader();
        setupThemeSwitcher();
        mobileMenu.setup();
        setupCart();
        setupModals();
        setupLightbox();
        setupScrollAnimations();
        setupNavigation();
        setupLanguageSelectors();
        setupContactForm();
        
        // Update initial language content
        elements.languageCurrents.forEach(el => {
            el.textContent = state.currentLanguage.toUpperCase();
        });
        updateLanguageContent();
        updateCartButtons();
        
        updateCurrentSection();
        window.scrollTo(0, 0);
        
        // Handle resize events
        window.addEventListener('resize', utils.debounce(() => {
            utils.checkMobile();
            updateCurrentSection();
        }, 250));
        
    } catch (error) {
        console.error('Initialization error:', error);
    }
});