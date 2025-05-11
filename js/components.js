// ===== PORTFOLIO CAROUSEL =====
function setupInfiniteCarousel() {
    const infiniteCarousel = document.querySelector('.infinite-carousel .carousel-track');
    if (!infiniteCarousel) return;
    
    const slides = document.querySelectorAll('.infinite-carousel .carousel-slide');
    
    if (!slides.length) return;
    
    // Clone first few slides for infinite effect
    const firstSlide = slides[0].cloneNode(true);
    const secondSlide = slides[1].cloneNode(true);
    infiniteCarousel.appendChild(firstSlide);
    infiniteCarousel.appendChild(secondSlide);
    
    // Handle auto-scrolling
    let animationFrame;
    let scrollPosition = 0;
    const speed = 1; // pixels per frame
    
    function animate() {
        scrollPosition += speed;
        if (scrollPosition >= infiniteCarousel.scrollWidth / 2) {
            scrollPosition = 0;
        }
        infiniteCarousel.style.transform = `translateX(-${scrollPosition}px)`;
        animationFrame = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Pause on hover
    infiniteCarousel.parentElement.addEventListener('mouseenter', () => {
        cancelAnimationFrame(animationFrame);
    });
    
    infiniteCarousel.parentElement.addEventListener('mouseleave', () => {
        animate();
    });
    
    // Cleanup on unmount
    return () => {
        cancelAnimationFrame(animationFrame);
    };
}

// ===== SERVICES CAROUSEL =====
const carouselState = {
    currentIndex: 1,
    startX: 0,
    startY: 0,
    deltaX: 0,
    isDragging: false,
    timer: null,
    isMobile: window.innerWidth <= 768,
    cardWidth: 300,
    cardMargin: 20
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

function getNextSlide() {
    if (carouselState.isMobile) return;
    
    const move = document.querySelector(".card-list");
    if (!move) return;
    
    const cards = document.querySelectorAll(".card");
    if (!cards.length) return;
    
    carouselState.currentIndex++;
    if (carouselState.currentIndex >= cards.length - 3) {
        carouselState.currentIndex = 2;
        move.style.transition = "none";
        move.style.transform = `translateX(-${1 * (carouselState.cardWidth + carouselState.cardMargin)}px)`;
        document.documentElement.offsetHeight; // Force reflow
        setTimeout(() => {
            move.style.transition = "0.5s all ease";
            move.style.transform = `translateX(-${carouselState.currentIndex * (carouselState.cardWidth + carouselState.cardMargin)}px)`;
        }, 10);
    } else {
        move.style.transform = `translateX(-${carouselState.currentIndex * (carouselState.cardWidth + carouselState.cardMargin)}px)`;
    }
    
    updateActiveCard();
    updateDots();
}

function getPrevSlide() {
    if (carouselState.isMobile) return;
    
    const move = document.querySelector(".card-list");
    if (!move) return;
    
    const cards = document.querySelectorAll(".card");
    if (!cards.length) return;
    
    carouselState.currentIndex--;
    if (carouselState.currentIndex < 0) {
        carouselState.currentIndex = cards.length - 5;
        move.style.transition = "none";
        move.style.transform = `translateX(-${(cards.length - 4) * (carouselState.cardWidth + carouselState.cardMargin)}px)`;
        document.documentElement.offsetHeight; // Force reflow
        setTimeout(() => {
            move.style.transition = "0.5s all ease";
            move.style.transform = `translateX(-${carouselState.currentIndex * (carouselState.cardWidth + carouselState.cardMargin)}px)`;
        }, 10);
    } else {
        move.style.transform = `translateX(-${carouselState.currentIndex * (carouselState.cardWidth + carouselState.cardMargin)}px)`;
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
    move.style.transform = `translateX(-${carouselState.currentIndex * (carouselState.cardWidth + carouselState.cardMargin)}px)`;
    
    updateActiveCard();
    updateDots();
}

function handleCarouselTouchStart(e) {
    carouselState.startX = e.touches ? e.touches[0].clientX : e.clientX;
    carouselState.startY = e.touches ? e.touches[0].clientY : e.clientY;
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
    
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
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
            const translateX = -carouselState.currentIndex * (carouselState.cardWidth + carouselState.cardMargin) + carouselState.deltaX * 0.5;
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
                getPrevSlide();
            } else if (carouselState.deltaX < -80) {
                getNextSlide();
            } else {
                move.style.transform = `translateX(-${carouselState.currentIndex * (carouselState.cardWidth + carouselState.cardMargin)}px)`;
            }
        }
    }
    
    carouselState.deltaX = 0;
    if (!carouselState.isMobile) {
        carouselState.timer = setInterval(getNextSlide, 4000);
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
        lbtn.removeEventListener("click", getPrevSlide);
        lbtn.addEventListener("click", getPrevSlide);
    }
    
    if (rbtn) {
        rbtn.removeEventListener("click", getNextSlide);
        rbtn.addEventListener("click", getNextSlide);
    }
    
    if (move) {
        move.removeEventListener("touchstart", handleCarouselTouchStart);
        move.removeEventListener("touchmove", handleCarouselTouchMove);
        move.removeEventListener("touchend", handleCarouselTouchEnd);
        move.removeEventListener("mousedown", handleCarouselTouchStart);
        move.removeEventListener("mousemove", handleCarouselTouchMove);
        move.removeEventListener("mouseup", handleCarouselTouchEnd);
        move.removeEventListener("mouseleave", handleCarouselTouchEnd);
        
        move.addEventListener("touchstart", handleCarouselTouchStart, { passive: true });
        move.addEventListener("touchmove", handleCarouselTouchMove, { passive: false });
        move.addEventListener("touchend", handleCarouselTouchEnd);
        move.addEventListener("mousedown", handleCarouselTouchStart);
        move.addEventListener("mousemove", handleCarouselTouchMove);
        move.addEventListener("mouseup", handleCarouselTouchEnd);
        move.addEventListener("mouseleave", handleCarouselTouchEnd);
        
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
                    const cardWidth = cards[0]?.offsetWidth + 16 || carouselState.cardWidth;
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
        carouselState.timer = setInterval(getNextSlide, 4000);
        
        // Stop on hover
        carousel.addEventListener("mouseenter", () => clearInterval(carouselState.timer));
        carousel.addEventListener("mouseleave", () => {
            clearInterval(carouselState.timer);
            carouselState.timer = setInterval(getNextSlide, 4000);
        });
    }
}

// ===== IMPROVED CAROUSEL FOR MOBILE LANDSCAPE =====
function setupMobileCarousel() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;
    
    const isLandscape = window.innerWidth > window.innerHeight && window.innerWidth <= 992;
    carouselState.isMobile = window.innerWidth <= 768 && !isLandscape;
    
    const inner = carousel.querySelector('.inner');
    const cardList = carousel.querySelector('.card-list');
    const cards = carousel.querySelectorAll('.card');
    
    // Reset existing state
    clearInterval(carouselState.timer);
    
    if (carouselState.isMobile) {
        // MOBILE PORTRAIT SETUP
        if (cardList) {
            cardList.style.transform = 'none';
            cardList.style.position = 'relative';
            cardList.style.left = '0';
            cardList.style.transition = 'none';
        }
        
        cards.forEach(card => {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
            card.style.filter = 'none';
        });
        
        if (inner) {
            inner.style.overflowX = 'auto';
            inner.style.scrollBehavior = 'smooth';
            inner.style.scrollSnapType = 'x mandatory';
            
            inner.addEventListener('scroll', debounce(() => {
                if (!carouselState.isDragging) {
                    const scrollPosition = inner.scrollLeft + (inner.offsetWidth / 2);
                    const cardWidth = cards[0]?.offsetWidth + 16 || carouselState.cardWidth;
                    const activeIndex = Math.round(scrollPosition / cardWidth);
                    updateMobileActiveCard(activeIndex);
                }
            }, 100));
            
            setTimeout(() => {
                inner.scrollLeft = 0;
                cards.forEach((card, index) => {
                    card.classList.remove('active-card');
                    if (index === 0) card.classList.add('active-card');
                });
                updateDots();
            }, 100);
        }
    } else {
        // DESKTOP OR MOBILE LANDSCAPE SETUP
        if (cardList) {
            cardList.style.transform = `translateX(-${carouselState.cardWidth + carouselState.cardMargin}px)`;
            cardList.style.transition = '0.5s all ease';
            cardList.style.position = 'absolute';
        }
        
        cards.forEach((card, index) => {
            card.classList.remove('active-card');
            card.style.transform = '';
            card.style.opacity = '';
            card.style.filter = '';
            
            if (index === 2) {
                card.classList.add('active-card');
            }
        });
        
        carouselState.currentIndex = 1;
        
        if (inner) {
            inner.style.overflowX = 'hidden';
            inner.scrollLeft = 0;
        }
        
        updateDots();
    }
    
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
            const isActive = item.classList.contains('active');
            
            // Close all accordion items first
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
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