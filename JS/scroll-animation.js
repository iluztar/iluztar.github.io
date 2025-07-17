class ScrollAnimationManager {
  constructor() {
    this.state = {
      isScrolling: false,
      currentIndex: 0,
      sections: [],
      scrollLock: false,
      scrollCooldown: false,
      lastScrollTime: 0,
      scrollDirection: null,
      wheelTimeout: null,
      touchTimeout: null,
      touchStartY: 0,
      isProgrammaticScroll: false
    };
    
    this.animationDefaults = {
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.05
    };
    
    this.elements = {};
    this.eventListeners = [];
    this.init();
  }

  debounce(func, wait = 10, immediate = false) {
    let timeout;
    return function(...args) {
      const context = this;
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

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  cacheElements() {
    this.elements.contentWrapper = document.querySelector(".content-wrapper");
    this.elements.animatedElements = document.querySelectorAll("[data-animate]");
    this.state.sections = Array.from(document.querySelectorAll("section"));
    this.elements.scrollLinks = document.querySelectorAll(".scroll");
  }

  setupScrollObserver() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
            const index = this.state.sections.indexOf(entry.target);
            if (index !== -1 && index !== this.state.currentIndex && !this.state.isScrolling) {
              this.state.currentIndex = index;
              this.animateSection(index);
            }
          }
        });
      }, { 
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px 0px -100px 0px'
      });
      
      this.state.sections.forEach(section => this.observer.observe(section));
    } else {
      this.fallbackScrollListener();
    }
  }

  fallbackScrollListener() {
    const handler = this.throttle(() => {
      if (this.shouldIgnoreScroll()) return;
      
      const scrollPosition = window.pageYOffset + 0.5 * window.innerHeight;
      let currentIndex = this.state.currentIndex;
      
      this.state.sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentIndex = index;
        }
      });
      
      if (currentIndex !== this.state.currentIndex) {
        this.state.currentIndex = currentIndex;
        this.animateSection(currentIndex);
      }
    }, 50);
    
    this.addListener(window, "scroll", handler, { passive: true });
  }

  shouldIgnoreScroll() {
    return this.state.isScrolling || this.state.scrollCooldown || !this.state.sections.length;
  }

scrollToSection(index, options = {}) {
  if (index < 0 || index >= this.state.sections.length || 
      this.shouldIgnoreScroll() || 
      index === this.state.currentIndex) return;
    
  const settings = {
    duration: 1.0,
    ease: "power3.inOut",
    offset: 20,
    ...options
  };
  
  this.state.scrollCooldown = true;
  this.state.isScrolling = true;
  this.state.scrollLock = true;
  this.state.isProgrammaticScroll = true;
  this.state.scrollDirection = index > this.state.currentIndex ? "down" : "up";
  this.state.currentIndex = index;
  this.state.lastScrollTime = Date.now();
  
  setTimeout(() => {
    this.state.scrollCooldown = false;
  }, settings.duration * 1000);
  
  gsap.killTweensOf(window);
  
  const targetSection = this.state.sections[index];
  const targetPosition = targetSection.offsetTop;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
  
  setTimeout(() => {
    this.state.isScrolling = false;
    this.state.scrollLock = false;
    this.state.isProgrammaticScroll = false;
    this.animateSection(index);
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    if (options.callback) options.callback();
  }, settings.duration * 1000);
}

getSectionScrollState(section) {
  const content = section.querySelector('.content');
  if (!content) return { isScrollable: false, isAtBottom: true };
  
  return {
    isScrollable: content.scrollHeight > content.clientHeight,
    isAtBottom: content.scrollTop + content.clientHeight >= content.scrollHeight - 10,
    isAtTop: content.scrollTop <= 10
  };
}

animateSection(index) {
  if (index < 0 || index >= this.state.sections.length) return;
  
  const section = this.state.sections[index];
  if (section.id === 'section3') {
    return;
  }
  
  const animatedElements = this.state.sections[index].querySelectorAll("[data-animate]");
  
  if (animatedElements.length > 0) {
    gsap.killTweensOf(animatedElements);
    
    gsap.set(animatedElements, {
      opacity: 0,
      y: 20,
      clearProps: "all"
    });
    
    gsap.to(animatedElements, {
      opacity: 1,
      y: 0,
      duration: this.animationDefaults.duration,
      ease: this.animationDefaults.ease,
      stagger: this.animationDefaults.stagger,
      delay: 0.1,
      onStart: () => {
        animatedElements.forEach(el => el.style.visibility = 'visible');
      },
      onComplete: () => {
        animatedElements.forEach(el => el.classList.add("animated"));
      }
    });
  }
}


handleWheel(event) {
  if (this.state.isProgrammaticScroll || this.shouldIgnoreScroll()) {
    return;
  }

  const currentSection = this.state.sections[this.state.currentIndex];
  if (currentSection.id === 'section3') {
    return;
  }

  const now = Date.now();
  if (now - this.state.lastScrollTime < 300) {
    event.preventDefault();
    return;
  }

  const scrollState = this.getSectionScrollState(currentSection);
  
  if (scrollState.isScrollable) {
    const buffer = 50;
    if ((event.deltaY > 0 && !scrollState.isAtBottom) || 
        (event.deltaY < 0 && !scrollState.isAtTop)) {
      return;
    }
  }

  event.preventDefault();
  clearTimeout(this.state.wheelTimeout);
  
  const direction = event.deltaY > 0 ? 1 : -1;
  const newIndex = this.state.currentIndex + direction;
  
  if (newIndex >= 0 && newIndex < this.state.sections.length) {
    this.state.lastScrollTime = now;
    this.state.wheelTimeout = setTimeout(() => {
      this.scrollToSection(newIndex, { duration: 1.0 });
    }, 100);
  }
}


  handleTouchStart(event) {
    if (!this.state.isScrolling && !this.state.scrollCooldown) {
      this.state.touchStartY = event.touches[0].clientY;
    }
  }




handleTouchEnd(event) {
  if (this.state.isScrolling || this.state.scrollCooldown) return;
  
  const currentSection = this.state.sections[this.state.currentIndex];
  if (currentSection.id === 'section3') {
    return;
  }

  const deltaY = event.changedTouches[0].clientY - this.state.touchStartY;
  const minSwipeDistance = 30;
  
  if (Math.abs(deltaY) > minSwipeDistance) {
    event.preventDefault();
    clearTimeout(this.state.touchTimeout);
    
    this.state.touchTimeout = setTimeout(() => {
      if (!this.state.isScrolling) {
        const direction = deltaY > 0 ? -1 : 1;
        this.scrollToSection(this.state.currentIndex + direction, { duration: 1.0 });
      }
    }, 100);
  }
}

  handleNavigation(event) {
    if (this.shouldIgnoreScroll() || event.target.matches("input, textarea, select")) return;
    
    const keyActions = {
      ArrowDown: () => this.scrollToSection(this.state.currentIndex + 1),
      PageDown: () => this.scrollToSection(this.state.currentIndex + 1),
      ArrowUp: () => this.scrollToSection(this.state.currentIndex - 1),
      PageUp: () => this.scrollToSection(this.state.currentIndex - 1),
      Home: () => this.scrollToSection(0),
      End: () => this.scrollToSection(this.state.sections.length - 1)
    };
    
    if (keyActions[event.key]) {
      event.preventDefault();
      keyActions[event.key]();
    }
  }

  addListener(target, event, handler, options) {
    if (target) {
      target.addEventListener(event, handler, options);
      this.eventListeners.push({ target, event, handler, options });
    }
  }

  init() {
    if (document.readyState === "loading") {
      this.addListener(document, "DOMContentLoaded", () => this.initialize());
    } else {
      this.initialize();
    }
  }

  initialize() {
    window.scrollTo(0, 0);
    this.cacheElements();
    
    if (typeof gsap !== "undefined") {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      gsap.defaults({ ease: this.animationDefaults.ease });
    }
    
    this.setupScrollObserver();
    this.setupEventListeners();
    
    setTimeout(() => {
      this.resizeCanvases();
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
      this.state.sections = Array.from(document.querySelectorAll("section"));
    }, 300);
  }

    setupEventListeners() {
    this.addListener(window, "resize", this.debounce(() => {
      this.resizeCanvases();
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }, 100), { passive: true });

this.addListener(window, "wheel", event => {
  if (this.state.currentIndex === 2) return; // Skip untuk section3
  this.handleWheel(event);
}, { passive: false });

this.addListener(document, "touchstart", event => {
  if (this.state.currentIndex === 2) return;
  this.handleTouchStart(event);
}, { passive: true });

this.addListener(document, "touchend", event => {
  if (this.state.currentIndex === 2) return;
  this.handleTouchEnd(event);
}, { passive: false });
    
    this.addListener(document, "touchmove", event => {
      if (this.shouldIgnoreScroll()) return;
      event.preventDefault(); // Prevent default scroll
    }, { passive: false });
    
    this.addListener(document, "keydown", event => this.handleNavigation(event), { passive: false });
    
    // Scroll links
    if (this.elements.scrollLinks) {
      this.elements.scrollLinks.forEach(link => {
        this.addListener(link, "click", event => {
          event.preventDefault();
          const target = document.querySelector(link.getAttribute("href"));
          if (target) {
            const index = this.state.sections.indexOf(target);
            if (index >= 0) this.scrollToSection(index, { duration: 1.5 });
          }
        });
      });
    }
  }

destroy() {
  // Hentikan semua animasi GSAP yang aktif
  gsap.globalTimeline.getChildren().forEach(tween => tween.kill());
  
  // Hapus event listeners
  this.eventListeners.forEach(({ target, event, handler, options }) => {
    target.removeEventListener(event, handler, options);
  });
  this.eventListeners = [];
  
  // Bersihkan state
  this.state.sectionCanvases = [];
}
}

const scrollAnimationManager = new ScrollAnimationManager();
window.addEventListener("unload", () => scrollAnimationManager.destroy());

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true
  });
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  window.scrollAnimationManager = new ScrollAnimationManager();
  
  setTimeout(() => {
    window.scrollAnimationManager.resizeCanvases();
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  }, 500);
});