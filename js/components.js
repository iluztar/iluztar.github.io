// ===== PORTFOLIO CAROUSEL =====
function setupInfiniteCarousel() {
    const infiniteCarousel = document.querySelector('.infinite-carousel .carousel-track');
    if (!infiniteCarousel) return;
    
    const slides = document.querySelectorAll('.infinite-carousel .carousel-slide');
    
    if (!slides.length) return;
    
    const firstSlide = slides[0].cloneNode(true);
    const secondSlide = slides[1].cloneNode(true);
    infiniteCarousel.appendChild(firstSlide);
    infiniteCarousel.appendChild(secondSlide);
    
    function animateCarousel() {
        const firstSlideWidth = slides[0].offsetWidth;
        const currentTransform = infiniteCarousel.style.transform || 'translateX(0)';
        const currentX = parseInt(currentTransform.match(/translateX\((-?\d+)px\)/)?.[1] || 0);
        
        if (currentX <= -firstSlideWidth * (slides.length)) {
            infiniteCarousel.style.transition = 'none';
            infiniteCarousel.style.transform = 'translateX(0)';
            setTimeout(() => {
                infiniteCarousel.style.transition = 'transform 20s linear infinite';
                infiniteCarousel.style.transform = `translateX(-${firstSlideWidth}px)`;
            }, 10);
        }
    }
    
    infiniteCarousel.style.animation = 'scroll 20s linear infinite';
    
    infiniteCarousel.parentElement.addEventListener('mouseenter', () => {
        infiniteCarousel.style.animationPlayState = 'paused';
    });
    
    infiniteCarousel.parentElement.addEventListener('mouseleave', () => {
        infiniteCarousel.style.animationPlayState = 'running';
    });
}

// ===== SERVICES CAROUSEL =====
const carouselState = {
    currentIndex: 1,
    startX: 0,
    startY: 0, // Added startY
    deltaX: 0,
    isDragging: false,
    timer: null,
    isMobile: window.innerWidth <= 768
};

function updateDots() {
    const dots = document.querySelectorAll(".dot");
    if (!dots.length) return;
    
    dots.forEach(dot => {
        dot.classList.remove("active-card");
    });
    
    let dotIndex = (carouselState.currentIndex - 1) % 6;
    if (dotIndex < 0) dotIndex = 5;
    
    dots[dotIndex].classList.add("active-card");
}

function updateActiveCard() {
    const cards = document.querySelectorAll(".card");
    
    // Remove active class from all cards
    document.querySelectorAll(".card.active-card").forEach(card => {
        card.classList.remove("active-card");
    });
    
    // Add active class to current card
    if (cards[carouselState.currentIndex + 1]) {
        cards[carouselState.currentIndex + 1].classList.add("active-card");
    }
}

function getR() {
    if (carouselState.isMobile) return;
    
    const move = document.querySelector(".card-list");
    if (!move) return;
    
    const cards = document.querySelectorAll(".card");
    if (!cards.length) return;
    
    carouselState.currentIndex++;
    if (carouselState.currentIndex >= cards.length - 3) {
        carouselState.currentIndex = 2;
        move.style.transition = "none";
        move.style.transform = `translateX(-${1 * 320}px)`;
        document.documentElement.offsetHeight; // Force reflow
        setTimeout(() => {
            move.style.transition = "0.5s all ease";
            move.style.transform = `translateX(-${carouselState.currentIndex * 320}px)`;
        }, 10);
    } else {
        move.style.transform = `translateX(-${carouselState.currentIndex * 320}px)`;
    }
    
    updateActiveCard();
    updateDots();
}

function getL() {
    if (carouselState.isMobile) return;
    
    const move = document.querySelector(".card-list");
    if (!move) return;
    
    const cards = document.querySelectorAll(".card");
    if (!cards.length) return;
    
    carouselState.currentIndex--;
    if (carouselState.currentIndex < 0) {
        carouselState.currentIndex = cards.length - 5;
        move.style.transition = "none";
        move.style.transform = `translateX(-${(cards.length - 4) * 320}px)`;
        document.documentElement.offsetHeight; // Force reflow
        setTimeout(() => {
            move.style.transition = "0.5s all ease";
            move.style.transform = `translateX(-${carouselState.currentIndex * 320}px)`;
        }, 10);
    } else {
        move.style.transform = `translateX(-${carouselState.currentIndex * 320}px)`;
    }
    
    updateActiveCard();
    updateDots();
}

function goToSlide(slideIndex) {
    if (carouselState.isMobile) return;
    
    const move = document.querySelector(".card-list");
    if (!move) return;
    
    const cards = document.querySelectorAll(".card");
    if (!cards.length) return;
    
    // Calculate the correct card index based on the dot clicked
    const cardIndex = slideIndex + 2; // +2 because of the fake items at start
    
    // Ensure we don't go out of bounds
    if (cardIndex < 2) return;
    if (cardIndex > cards.length - 3) return;
    
    carouselState.currentIndex = slideIndex + 1;
    move.style.transform = `translateX(-${carouselState.currentIndex * 320}px)`;
    
    updateActiveCard();
    updateDots();
}

function handleCarouselTouchStart(e) {
    carouselState.startX = e.touches[0].clientX;
    carouselState.startY = e.touches[0].clientY; // Store startY
    carouselState.isDragging = true;
    clearInterval(carouselState.timer);
    
    if (!carouselState.isMobile) {
        const move = document.querySelector(".card-list");
        if (move) {
            move.style.transition = "none";
        }
    }
}

function handleCarouselTouchMove(e) {
    if (!carouselState.isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    carouselState.deltaX = currentX - carouselState.startX;
    
    // Calculate horizontal vs vertical scrolling
    const isHorizontalScroll = Math.abs(carouselState.deltaX) > Math.abs(currentY - carouselState.startY);
    
    if (carouselState.isMobile) {
        // Mobile behavior (inner overflow)
        const inner = document.querySelector('.inner');
        if (inner && isHorizontalScroll) {
            inner.style.scrollBehavior = 'auto';
            inner.scrollLeft -= carouselState.deltaX * 0.1;
            e.preventDefault();
        }
    } else {
        // Desktop behavior (transform)
        const move = document.querySelector(".card-list");
        if (move) {
            const translateX = -carouselState.currentIndex * 320 + carouselState.deltaX * 0.5;
            move.style.transform = `translateX(${translateX}px)`;
            
            if (isHorizontalScroll) {
                e.preventDefault();
            }
        }
    }
}

function handleCarouselTouchEnd() {
    if (!carouselState.isDragging) return;
    carouselState.isDragging = false;
    
    if (carouselState.isMobile) {
        // Mobile behavior - snap to nearest card
        snapToNearestCard();
    } else {
        // Desktop behavior
        const move = document.querySelector(".card-list");
        if (move) {
            move.style.transition = "0.5s all ease";
            
            if (carouselState.deltaX > 80) {
                getL();
            } else if (carouselState.deltaX < -80) {
                getR();
            } else {
                move.style.transform = `translateX(-${carouselState.currentIndex * 320}px)`;
            }
        }
    }
    
    carouselState.deltaX = 0;
    if (!carouselState.isMobile) {
        carouselState.timer = setInterval(getR, 4000);
    }
}

function snapToNearestCard() {
    const inner = document.querySelector('.inner');
    if (!inner) return;
    
    const cards = document.querySelectorAll(".card");
    if (!cards.length) return;
    
    const cardWidth = cards[0].offsetWidth + 16; // include gap
    
    // Find the closest card
    const innerWidth = inner.offsetWidth;
    const scrollPosition = inner.scrollLeft + (innerWidth / 2);
    const activeIndex = Math.round(scrollPosition / cardWidth);
    
    // Snap to that card
    inner.style.scrollBehavior = 'smooth';
    inner.scrollLeft = cardWidth * activeIndex - (innerWidth / 2) + (cardWidth / 2);
    
    // Update active card and dots for visual feedback
    updateMobileActiveCard(activeIndex);
}

function updateMobileActiveCard(activeIndex) {
    const cards = document.querySelectorAll(".card");
    if (!cards.length) return;
    
    // Clear active class
    cards.forEach(card => card.classList.remove('active-card'));
    
    // Set active card
    if (cards[activeIndex]) {
        cards[activeIndex].classList.add('active-card');
    }
    
    // Update dots if they exist
    const dots = document.querySelectorAll('.dot');
    if (dots.length) {
        dots.forEach(dot => dot.classList.remove('active-card'));
        if (dots[activeIndex % dots.length]) {
            dots[activeIndex % dots.length].classList.add('active-card');
        }
    }
}

function handleMobileCardClick(e) {
    if (!carouselState.isMobile) return;
    
    // Find clicked card
    const clickedCard = e.target.closest('.card');
    if (!clickedCard) return;
    
    // Get all cards and find clicked index
    const cards = document.querySelectorAll(".card");
    const clickedIndex = Array.from(cards).indexOf(clickedCard);
    
    // Update active status
    cards.forEach(card => card.classList.remove('active-card'));
    clickedCard.classList.add('active-card');
    
    // Scroll card into view
    const inner = document.querySelector('.inner');
    if (inner) {
        inner.style.scrollBehavior = 'smooth';
        const cardWidth = clickedCard.offsetWidth + 16;
        const offset = clickedCard.offsetLeft - (inner.offsetWidth - cardWidth) / 2;
        inner.scrollLeft = offset;
    }
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    if (dots.length) {
        dots.forEach(dot => dot.classList.remove('active-card'));
        const dotIndex = clickedIndex % dots.length;
        if (dots[dotIndex]) {
            dots[dotIndex].classList.add('active-card');
        }
    }
}

function setupServicesCarousel() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;

    // Clear any existing event listeners first
    const lbtn = carousel.querySelector(".lbtn");
    const rbtn = carousel.querySelector(".rbtn");
    const move = carousel.querySelector(".card-list");
    
    if (lbtn) {
        lbtn.removeEventListener("click", getL);
        lbtn.addEventListener("click", getL);
    }
    
    if (rbtn) {
        rbtn.removeEventListener("click", getR);
        rbtn.addEventListener("click", getR);
    }
    
    if (move) {
        move.removeEventListener("touchstart", handleCarouselTouchStart);
        move.removeEventListener("touchmove", handleCarouselTouchMove);
        move.removeEventListener("touchend", handleCarouselTouchEnd);
        
        move.addEventListener("touchstart", handleCarouselTouchStart, { passive: true });
        move.addEventListener("touchmove", handleCarouselTouchMove, { passive: false });
        move.addEventListener("touchend", handleCarouselTouchEnd);
        
        move.removeEventListener("click", handleMobileCardClick);
        move.addEventListener("click", handleMobileCardClick);
    }
    
    // Setup dots navigation
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
        dot.removeEventListener("click", () => goToSlide(index));
        dot.addEventListener("click", () => {
            if (carouselState.isMobile) {
                // For mobile, scroll to the position
                const inner = document.querySelector('.inner');
                if (inner) {
                    const cards = document.querySelectorAll(".card");
                    const cardWidth = cards[0]?.offsetWidth + 16 || 320;
                    const targetPosition = index * cardWidth;
                    
                    inner.style.scrollBehavior = 'smooth';
                    inner.scrollLeft = targetPosition;
                    
                    // Update active status
                    updateMobileActiveCard(index);
                }
            } else {
                // For desktop, use the existing function
                goToSlide(index);
            }
        });
    });
    
    clearInterval(carouselState.timer);
    
    // Setup auto rotation for desktop only
    if (!carouselState.isMobile) {
        // Update initial active card
        updateActiveCard();
        updateDots();
        
        // Start auto rotation
        carouselState.timer = setInterval(getR, 4000);
        
        // Stop on hover
        carousel.addEventListener("mouseenter", () => clearInterval(carouselState.timer));
        carousel.addEventListener("mouseleave", () => {
            clearInterval(carouselState.timer);
            carouselState.timer = setInterval(getR, 4000);
        });
    }
}

// ===== MOBILE/DESKTOP CAROUSEL SWITCHING =====
function setupMobileCarousel() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;
    
    carouselState.isMobile = window.innerWidth <= 768;
    
    const inner = carousel.querySelector('.inner');
    const cardList = carousel.querySelector('.card-list');
    const cards = carousel.querySelectorAll('.card');
    
    // Reset existing state
    clearInterval(carouselState.timer);
    
    if (carouselState.isMobile) {
        // MOBILE SETUP
        console.log("Setting up mobile carousel");
        
        // Reset transform for card-list
        if (cardList) {
            cardList.style.transform = 'none';
            cardList.style.position = 'relative';
            cardList.style.left = '0';
            cardList.style.transition = 'none';
        }
        
        // Make all cards visible with consistent styling
        cards.forEach(card => {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
            card.style.filter = 'none';
        });
        
        // Setup horizontal scrolling behavior
        if (inner) {
            inner.style.overflowX = 'auto';
            inner.style.scrollBehavior = 'smooth';
            inner.style.scrollSnapType = 'x mandatory';
            
            // Listen for scroll events to update active card
            inner.addEventListener('scroll', debounce(() => {
                if (!carouselState.isDragging) {
                    const scrollPosition = inner.scrollLeft + (inner.offsetWidth / 2);
                    const cardWidth = cards[0]?.offsetWidth + 16 || 320;
                    const activeIndex = Math.round(scrollPosition / cardWidth);
                    
                    updateMobileActiveCard(activeIndex);
                }
            }, 100));
            
            // Scroll to first card
            setTimeout(() => {
                inner.scrollLeft = 0;
                
                // Make first card active
                cards.forEach((card, index) => {
                    card.classList.remove('active-card');
                    if (index === 0) {
                        card.classList.add('active-card');
                    }
                });
                
                updateDots();
            }, 100);
        }
    } else {
        // DESKTOP SETUP
        console.log("Setting up desktop carousel");
        
        // Reset card-list for desktop view
        if (cardList) {
            cardList.style.transform = `translateX(-${320}px)`;
            cardList.style.transition = '0.5s all ease';
            cardList.style.position = 'absolute';
        }
        
        // Reset cards for desktop view
        cards.forEach((card, index) => {
            card.classList.remove('active-card');
            card.style.transform = '';
            card.style.opacity = '';
            card.style.filter = '';
            
            // Set active card
            if (index === 2) { // Index 2 is the first visible card in desktop
                card.classList.add('active-card');
            }
        });
        
        carouselState.currentIndex = 1; // Reset index
        
        if (inner) {
            inner.style.overflowX = 'hidden';
            inner.scrollLeft = 0;
        }
        
        // Update dots for desktop view
        updateDots();
    }
    
    // Setup event listeners based on mode
    setupServicesCarousel();
}

// Helper function for scroll debouncing
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// ===== ACCORDION =====
function setupAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (!accordionHeaders.length) return;
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                document.querySelectorAll('.accordion-item').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            }
        });
    });
}

// ===== Initialize Component Functionality =====
document.addEventListener('DOMContentLoaded', function() {
    try {
        setupInfiniteCarousel();
        setupMobileCarousel(); // This now handles both mobile and desktop
        setupAccordion();
        
        // Add resize listener to handle mobile/desktop switch
        window.addEventListener('resize', debounce(() => {
            const wasMobile = carouselState.isMobile;
            carouselState.isMobile = window.innerWidth <= 768;
            
            // Only re-setup if there was a switch between mobile and desktop
            if (wasMobile !== carouselState.isMobile) {
                setupMobileCarousel();
            }
        }, 250));
    } catch (error) {
        console.error('Component initialization error:', error);
    }
});