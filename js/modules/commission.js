import { state } from '../core/config.js';

export const updateDots = () => {
    const dots = document.querySelectorAll(".dot");
    if (!dots.length) return;
    
    dots.forEach(dot => {
        dot.classList.remove("active-card");
    });
    
    let dotIndex = (state.carousel.currentIndex - 1) % 6;
    if (dotIndex < 0) dotIndex = 5;
    
    dots[dotIndex].classList.add("active-card");
};

export const getR = () => {
    const move = document.querySelector(".card-list");
    const cards = document.querySelectorAll(".card");
    
    state.carousel.currentIndex++;
    if (state.carousel.currentIndex === 8) {
        state.carousel.currentIndex = 2;
        move.style.transition = "none";
        move.style.transform = `translateX(-${1 * 320}px)`;
        document.documentElement.offsetHeight; // Force reflow
        move.style.transition = "0.5s all ease";
        move.style.transform = `translateX(-${state.carousel.currentIndex * 320}px)`;
    } else {
        move.style.transform = `translateX(-${state.carousel.currentIndex * 320}px)`;
    }
    document.querySelector(".card.active-card").classList.remove("active-card");
    cards[state.carousel.currentIndex + 1].classList.add("active-card");
    updateDots();
};

export const getL = () => {
    const move = document.querySelector(".card-list");
    const cards = document.querySelectorAll(".card");
    
    state.carousel.currentIndex--;
    if (state.carousel.currentIndex < 0) {
        state.carousel.currentIndex = cards.length - 5;
        move.style.transition = "none";
        move.style.transform = `translateX(-${(cards.length - 4) * 320}px)`;
        document.documentElement.offsetHeight; // Force reflow
        move.style.transition = "0.5s all ease";
        move.style.transform = `translateX(-${state.carousel.currentIndex * 320}px)`;
    } else {
        move.style.transform = `translateX(-${state.carousel.currentIndex * 320}px)`;
    }
    document.querySelector(".card.active-card").classList.remove("active-card");
    cards[state.carousel.currentIndex + 1].classList.add("active-card");
    updateDots();
};

export const goToSlide = (slideIndex) => {
    const move = document.querySelector(".card-list");
    const cards = document.querySelectorAll(".card");
    
    state.carousel.currentIndex = slideIndex;
    
    if (state.carousel.currentIndex === 6) {
        state.carousel.currentIndex = 0;
    }
    
    if (state.carousel.currentIndex < 0) {
        state.carousel.currentIndex = 5;
    }
    
    move.style.transform = `translateX(-${(state.carousel.currentIndex + 1) * 320}px)`;
    document.querySelector(".card.active-card").classList.remove("active-card");
    cards[state.carousel.currentIndex + 2].classList.add("active-card");
    updateDots();
};

export const handleTouchStart = (e) => {
    state.carousel.startX = e.touches[0].clientX;
    state.carousel.isDragging = true;
    clearInterval(state.carousel.timer);
};

export const handleTouchMove = (e) => {
    if (!state.carousel.isDragging) return;
    
    state.carousel.deltaX = e.touches[0].clientX - state.carousel.startX;
    const move = document.querySelector(".card-list");
    
    const translateX = -state.carousel.currentIndex * 320 + state.carousel.deltaX * 0.5;
    move.style.transition = "none";
    move.style.transform = `translateX(${translateX}px)`;
    
    e.preventDefault();
};

export const handleTouchEnd = () => {
    if (!state.carousel.isDragging) return;
    state.carousel.isDragging = false;
    
    const move = document.querySelector(".card-list");
    move.style.transition = "0.5s all ease";
    
    if (state.carousel.deltaX > 80) {
        getL();
    } else if (state.carousel.deltaX < -80) {
        getR();
    } else {
        move.style.transform = `translateX(-${state.carousel.currentIndex * 320}px)`;
    }
    
    state.carousel.deltaX = 0;
    state.carousel.timer = setInterval(getR, 4000);
};

export const setupCommissionCarousel = () => {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;
  
    const lbtn = carousel.querySelector(".lbtn");
    const rbtn = carousel.querySelector(".rbtn");
    const move = carousel.querySelector(".card-list");
    const cards = carousel.querySelectorAll(".card");
    const dots = document.querySelectorAll(".dot");
    
    state.carousel.currentIndex = 1;
    state.carousel.startX = 0;
    state.carousel.deltaX = 0;
    state.carousel.isDragging = false;

    rbtn.addEventListener("click", getR);
    lbtn.addEventListener("click", getL);
    
    move.addEventListener("touchstart", handleTouchStart, { passive: true });
    move.addEventListener("touchmove", handleTouchMove, { passive: false });
    move.addEventListener("touchend", handleTouchEnd);
    
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
        });
    });
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.target.closest('.card');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            alert(`Added ${title} (${price}) to cart`);
        });
    });
    
    move.addEventListener("click", (e) => {
        if (e.target.classList.contains('card') || e.target.closest('.card')) {
            const clickedCard = e.target.classList.contains('card') ? e.target : e.target.closest('.card');
            const cardId = parseInt(clickedCard.dataset.cid);
            
            state.carousel.currentIndex = cardId;
            if (state.carousel.currentIndex === 8) {
                state.carousel.currentIndex = 2;
                move.style.transition = "none";
                move.style.transform = `translateX(-${1 * 320}px)`;
                document.documentElement.offsetHeight;
                move.style.transition = "0.5s all ease";
            } else if (state.carousel.currentIndex < 0) {
                state.carousel.currentIndex = cards.length - 5;
                move.style.transition = "none";
                move.style.transform = `translateX(-${(cards.length - 4) * 320}px)`;
                document.documentElement.offsetHeight;
                move.style.transition = "0.5s all ease";
            }
            
            move.style.transform = `translateX(-${state.carousel.currentIndex * 320}px)`;
            document.querySelector(".card.active-card").classList.remove("active-card");
            cards[state.carousel.currentIndex + 1].classList.add("active-card");
            updateDots();
        }
    });
    
    state.carousel.timer = setInterval(getR, 4000);
    carousel.addEventListener("mouseenter", () => clearInterval(state.carousel.timer));
    carousel.addEventListener("mouseleave", () => {
        state.carousel.timer = setInterval(getR, 4000);
    });
};