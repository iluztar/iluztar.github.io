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
    currentLanguage: 'en'
  };
  
  // ===== DOM Elements =====
  const elements = {
    // Theme Switcher
    themeIconLight: document.getElementById('theme-icon-light'),
    themeIconDark: document.getElementById('theme-icon-dark'),
    mobileThemeIconLight: document.getElementById('mobile-theme-icon-light'),
    mobileThemeIconDark: document.getElementById('mobile-theme-icon-dark'),
    
    // Mobile Menu
    burger: document.querySelector('.menu-burger'),
    mobileMenu: document.querySelector('.mobile-menu'),
    mobileMenuClose: document.querySelector('.mobile-menu-close'),
    
    // Cart
    cartIcon: document.querySelector('.cart-icon'),
    cartSidebar: document.querySelector('.cart-sidebar'),
    cartClose: document.querySelector('.cart-close'),
    cartItemsContainer: document.querySelector('.cart-items'),
    cartTotal: document.querySelector('.cart-total-amount'),
    cartCount: document.querySelector('.cart-count'),
    
    // Lightbox
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.querySelector('.lightbox-content img'),
    lightboxClose: document.querySelector('.lightbox-close'),
    lightboxPrev: document.querySelector('.lightbox-prev'),
    lightboxNext: document.querySelector('.lightbox-next'),
    lightboxCounter: document.querySelector('.lightbox-counter'),
    
    // Language Selector
    languageSelectors: document.querySelectorAll('.language-selector'),
    languageCurrents: document.querySelectorAll('.language-current'),
    
    // Navigation
    scrollLinks: document.querySelectorAll('.scroll, .scroll-link'),
    controlNavItems: document.querySelectorAll('.line-nav li'),
    headerNavLinks: document.querySelectorAll('nav.header-nav ul li a, .mobile-menu a'),
    
    // Scroll down arrow
    scrollDown: document.querySelector('.scroll-down')
  };
  
  // ===== Initialize All Functionality =====
  document.addEventListener('DOMContentLoaded', function() {
    try {
      setupThemeSwitcher();
      setupMobileMenu();
      setupCart();
      setupModals();
      setupLightbox();
      setupScrollAnimations();
      setupNavigation();
      setupLanguageSelectors();
      updateSectionCounter();
      
      // Initialize portfolio images for lightbox
      state.portfolioImages = Array.from(document.querySelectorAll('.modal-item img')).map(img => ({
        src: img.src,
        alt: img.alt
      }));
  
// Update the Swiper initialization code
const swiper = new Swiper('.swiper', {
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
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 40
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 40
      },
      1300: {
        slidesPerView: 3,
        spaceBetween: 40
      }
    },
    // Add accessibility features
    a11y: {
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide',
    },
    // Better touch support
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    // Improved keyboard control
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    // Better performance
    observer: true,
    observeParents: true,
    // Prevent clicks during transitions
    preventInteractionOnTransition: true
  });
  
  // Add event listeners for better UX
  swiper.on('slideChange', function() {
    // Add any additional logic when slide changes
  });
  
  // Handle window resize for better responsiveness
  window.addEventListener('resize', function() {
    swiper.update();
  });
  
      // Set initial active section
      updateCurrentSection();
      
      // Scroll to top on load
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Initialization error:', error);
    }
  });
  
  // ===== Theme Switcher =====
  function setupThemeSwitcher() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon visibility based on current theme
    updateThemeIcons(currentTheme);
  
    function switchTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(newTheme);
    }
    
    function updateThemeIcons(theme) {
      if (theme === 'dark') {
        elements.themeIconLight.classList.add('hidden');
        elements.themeIconDark.classList.remove('hidden');
        elements.mobileThemeIconLight.classList.add('hidden');
        elements.mobileThemeIconDark.classList.remove('hidden');
      } else {
        elements.themeIconLight.classList.remove('hidden');
        elements.themeIconDark.classList.add('hidden');
        elements.mobileThemeIconLight.classList.remove('hidden');
        elements.mobileThemeIconDark.classList.add('hidden');
      }
    }
    
    // Add event listeners to all theme icons
    [elements.themeIconLight, elements.themeIconDark, elements.mobileThemeIconLight, elements.mobileThemeIconDark].forEach(icon => {
      if (icon) {
        icon.addEventListener('click', switchTheme);
      }
    });
  }
  
  // ===== Mobile Menu =====
  function setupMobileMenu() {
    if (!elements.burger || !elements.mobileMenu) return;
    
    const toggleMenu = () => {
      elements.burger.classList.toggle('active');
      elements.mobileMenu.classList.toggle('active');
      document.body.style.overflow = elements.mobileMenu.classList.contains('active') ? 'hidden' : '';
      state.isModalOpen = elements.mobileMenu.classList.contains('active');
    };
    
    elements.burger.addEventListener('click', toggleMenu);
    
    if (elements.mobileMenuClose) {
      elements.mobileMenuClose.addEventListener('click', toggleMenu);
    }
    
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', toggleMenu);
    });
  }
  
  // ===== Shopping Cart =====
  function setupCart() {
    if (!elements.cartIcon || !elements.cartSidebar) return;
    
    const toggleCart = () => {
      elements.cartSidebar.classList.toggle('active');
      state.isModalOpen = elements.cartSidebar.classList.contains('active');
      document.body.style.overflow = state.isModalOpen ? 'hidden' : '';
    };
    
    elements.cartIcon.addEventListener('click', toggleCart);
    
    if (elements.cartClose) {
      elements.cartClose.addEventListener('click', toggleCart);
    }
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        const title = this.getAttribute('data-title');
        const price = parseFloat(this.getAttribute('data-price'));
        
        state.cart.push({ title, price });
        updateCart();
        toggleCart();
      });
    });
  }
  
  function updateCart() {
    if (!elements.cartItemsContainer) return;
    
    // Clear cart items
    elements.cartItemsContainer.innerHTML = '';
    
    // Calculate total
    let total = 0;
    
    // Add items to cart
    state.cart.forEach((item, index) => {
      total += item.price;
      
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="https://placeholder.pics/svg/100x100" alt="${item.title}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <button class="remove-item" data-index="${index}">✕</button>
        </div>
      `;
      
      elements.cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        state.cart.splice(index, 1);
        updateCart();
      });
    });
    
    // Update total and count
    if (elements.cartTotal) elements.cartTotal.textContent = total.toFixed(2);
    if (elements.cartCount) elements.cartCount.textContent = state.cart.length;
  }
  
  // ===== Modals =====
  function setupModals() {
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
    
    // Close modals
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
      closeBtn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
          closeModal(modal);
        }
      });
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          closeModal(this);
        }
      });
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active, .cart-sidebar.active').forEach(el => {
          closeModal(el);
        });
      }
    });
  }
  
  function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    state.isModalOpen = false;
  }
  
  // ===== Lightbox =====
  function setupLightbox() {
    if (!elements.lightbox) return;
    
    // Open lightbox when portfolio image is clicked
    document.querySelectorAll('.modal-item img').forEach((img, index) => {
      img.addEventListener('click', () => {
        state.currentImageIndex = index;
        updateLightboxImage();
        elements.lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateLightboxCounter();
        state.isModalOpen = true;
      });
    });
    
    // Close lightbox
    if (elements.lightboxClose) {
      elements.lightboxClose.addEventListener('click', () => {
        closeModal(elements.lightbox);
      });
    }
    
    // Close when clicking outside image
    elements.lightbox.addEventListener('click', (e) => {
      if (e.target === elements.lightbox) {
        closeModal(elements.lightbox);
      }
    });
    
    // Navigation
    if (elements.lightboxPrev) {
      elements.lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
      });
    }
    
    if (elements.lightboxNext) {
      elements.lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (elements.lightbox.style.display === 'flex') {
        if (e.key === 'Escape') {
          closeModal(elements.lightbox);
        } else if (e.key === 'ArrowLeft') {
          navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
          navigateLightbox(1);
        }
      }
    });
  }
  
  function navigateLightbox(direction) {
    state.currentImageIndex = (state.currentImageIndex + direction + state.portfolioImages.length) % state.portfolioImages.length;
    updateLightboxImage();
    updateLightboxCounter();
  }
  
  function updateLightboxImage() {
    if (!elements.lightboxImg || !state.portfolioImages[state.currentImageIndex]) return;
    elements.lightboxImg.src = state.portfolioImages[state.currentImageIndex].src;
    elements.lightboxImg.alt = state.portfolioImages[state.currentImageIndex].alt;
  }
  
  function updateLightboxCounter() {
    if (!elements.lightboxCounter) return;
    elements.lightboxCounter.textContent = `${state.currentImageIndex + 1} / ${state.portfolioImages.length}`;
  }
  
  // ===== Scroll Animations =====
  function setupScrollAnimations() {
    function animateOnScroll() {
      const elements = document.querySelectorAll('[data-animate]');
      const windowHeight = window.innerHeight;
      const triggerOffset = windowHeight * 0.8;
  
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        
        if (elementPosition < triggerOffset) {
          element.classList.add('animated');
        }
      });
    }
  
    // Initialize on load
    window.addEventListener('load', () => {
      // Trigger animations for home section
      const homeSection = document.querySelector('#home');
      if (homeSection) {
        const elements = homeSection.querySelectorAll('[data-animate]');
        elements.forEach(el => {
          el.classList.add('animated');
        });
      }
      
      animateOnScroll();
    });
  
    // Run on scroll
    window.addEventListener('scroll', debounce(animateOnScroll));
  }
  
  function debounce(func, wait = 10, immediate = true) {
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
  }
  
// ===== Navigation System =====
function setupNavigation() {
    // Smooth scroll to section
    elements.scrollLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        scrollToSectionByHref(targetId);
      });
    });
    
    // Control nav click handler
    elements.controlNavItems.forEach((item, index) => {
      item.addEventListener('click', function() {
        scrollToSection(index);
      });
    });
    
    // Section navigation buttons
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
    
    // Mouse wheel, keyboard and touchscreen navigation
    window.addEventListener('wheel', handleWheelScroll, { passive: false });
    document.addEventListener('keydown', handleKeyNavigation);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Update active section on scroll
    window.addEventListener('scroll', debounce(updateCurrentSection));
  }
  
  function scrollToSectionByHref(href) {
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const index = Array.from(state.sections).findIndex(section => section.id === href.substring(1));
      if (index >= 0) {
        scrollToSection(index);
      }
    }
  }
  
  function scrollToSection(index) {
    if (state.isScrolling || index < 0 || index >= state.sections.length) return;
    state.isScrolling = true;
    state.currentSectionIndex = index;
    
    $('html, body').animate({
      scrollTop: state.sections[index].offsetTop
    }, state.scrollDuration, function() {
      state.isScrolling = false;
      updateControlNav();
      updateHeaderNav();
    });
  }
  
  function scrollToNextSection() {
    if (state.currentSectionIndex < state.sections.length - 1) {
      scrollToSection(state.currentSectionIndex + 1);
    }
  }
  
  function scrollToPrevSection() {
    if (state.currentSectionIndex > 0) {
      scrollToSection(state.currentSectionIndex - 1);
    }
  }
  
  function handleWheelScroll(e) {
    if (state.isScrolling || state.isModalOpen) return;
    e.preventDefault();
    
    if (e.deltaY > 0) {
      scrollToNextSection();
    } else if (e.deltaY < 0) {
      scrollToPrevSection();
    }
  }
  
  function handleKeyNavigation(e) {
    if (state.isScrolling || state.isModalOpen) return;
    
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
  
  function handleTouchStart(e) {
    if (state.isModalOpen) return;
    state.touchStartY = e.touches[0].clientY;
  }
  
  function handleTouchEnd(e) {
    if (state.isScrolling || state.isModalOpen) return;
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
  
  function updateCurrentSection() {
    if (state.isModalOpen) return;
    const scrollPosition = window.scrollY + (window.innerHeight / 2);
    
    state.sections.forEach((section, index) => {
      if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
        state.currentSectionIndex = index;
        updateControlNav();
        updateHeaderNav();
        updateSectionCounter();
      }
    });
  }
  
  function updateSectionCounter() {
    const currentSectionElements = document.querySelectorAll('.current-section');
    const totalSectionElements = document.querySelectorAll('.total-sections');
    
    // Format dengan leading zero
    const currentSection = (state.currentSectionIndex + 1).toString().padStart(2, '0');
    const totalSections = state.sections.length.toString().padStart(2, '0');
    
    currentSectionElements.forEach(el => {
      el.textContent = currentSection;
    });
    
    totalSectionElements.forEach(el => {
      el.textContent = totalSections;
    });
  }
  
  function updateControlNav() {
    elements.controlNavItems.forEach((item, index) => {
      if (index === state.currentSectionIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  function updateHeaderNav() {
    const targetId = `#${state.sections[state.currentSectionIndex].id}`;
    
    elements.headerNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === targetId) {
        link.classList.add('active');
      }
    });
  }
  
// ===== Language Selector =====
function setupLanguageSelectors() {
    elements.languageSelectors.forEach(selector => {
      selector.addEventListener('click', function() {
        // Toggle between EN and ID
        state.currentLanguage = state.currentLanguage === 'en' ? 'id' : 'en';
        
        // Update all language displays
        elements.languageCurrents.forEach(el => {
          el.textContent = state.currentLanguage.toUpperCase();
        });
        
        // Update all elements with data-lang attributes
        updateLanguageContent();
      });
    });
  }
  
  function updateLanguageContent() {
    // Update all elements with data-lang attributes
    document.querySelectorAll('[data-lang-en], [data-lang-id]').forEach(element => {
      const attr = `data-lang-${state.currentLanguage}`;
      if (element.hasAttribute(attr)) {
        const newText = element.getAttribute(attr);
        
    // Handle different element types
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        // Remove any HTML tags for input/textarea
        newText = newText.replace(/<br\s*\/?>/gi, '\n');
        element.placeholder = newText;
    } else {
        // For other elements, keep the <br> tags
        element.innerHTML = newText;
    }
    }
    });
  
    // Update cart button text if it exists
    const checkoutButton = document.querySelector('.cart-actions .cybr-btn');
    if (checkoutButton && checkoutButton.hasAttribute(`data-lang-${state.currentLanguage}`)) {
      checkoutButton.textContent = checkoutButton.getAttribute(`data-lang-${state.currentLanguage}`);
    }
  
    // Update modal content if any modal is open
    const openModal = document.querySelector('.modal[style="display: block;"]');
    if (openModal) {
      const modalTitle = openModal.querySelector('.modal-header h2');
      if (modalTitle && modalTitle.hasAttribute(`data-lang-${state.currentLanguage}`)) {
        modalTitle.textContent = modalTitle.getAttribute(`data-lang-${state.currentLanguage}`);
      }
    }
  }