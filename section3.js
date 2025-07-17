class Portfolio {
  constructor() {
    this.config = { 
      slideTransitionDuration: 400,
      thumbnailDelay: 50,
      loaderDelay: 800,
      contentAnimationDelay: 200,
      zoomDuration: 1.2,
      zoomEase: "power2.inOut"
    };

    this.state = { 
      currentSlide: 0,
      currentMode: "intro", 
      isAnimating: false,
      activeIndex: 0,
      previousIndex: 0,
      slideDirection: "right",
      imagesLoaded: 0,
      touchStartX: 0,
      hasShownGrid: false,
      introPlayed: false,
      sectionVisible: false,
      transitionInProgress: false
    };

    this.imageUrls = [
      "https://cdn.cosmos.so/dfff1381-f09c-454b-b98d-8a79161c3d25?format=jpeg",
      "https://cdn.cosmos.so/c7af8b26-313a-40e4-9081-85f7fde00c22?format=jpeg",
      "https://cdn.cosmos.so/03a36d87-af8c-4cfe-bfed-7a3dd502404b.?format=jpeg",
      "https://cdn.cosmos.so/bdb2a659-2838-4055-a82e-f145c3fd4467?format=jpeg",
      "https://cdn.cosmos.so/fddfc757-d9c3-44f1-af6e-a607c3746738?format=jpeg",
      "https://cdn.cosmos.so/51a307de-a9ba-4c9e-ad24-beff1ce023d0?format=jpeg"
    ];

    this.slideContent = [
      { title: "URBAN GEOMETRY" },
      { title: "NATURAL ABSTRACTIONS" },
      { title: "SHADOW PLAY" },
      { title: "MINIMALIST FORMS" },
      { title: "MONOCHROME SERIES" },
      { title: "TEXTURAL STUDIES" }
    ];

    this.elements = this.initElements();
    this.bindMethods();
    this.checkSectionVisibility();
  }

  bindMethods() {
    const methods = [
      'handleKeydown', 'handleTouchStart', 'handleTouchEnd', 
      'handleBackButton', 'handleImageLoad', 'handleThumbnailClick',
      'handleGridClick', 'handleSwipe', 'animateTitleLines',
      'runIntroAnimation', 'checkSectionVisibility', 'initPortfolio', 'handleScrollPassThrough'
    ];

    methods.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  initElements() {
    return {
      loader: document.querySelector('#section3 .loader'),
      gridContainer: document.querySelector('#section3 #gridContainer'),
      grid: document.querySelector('#section3 #grid'),
      sliderImage: document.querySelector('#section3 #sliderImage'),
      sliderImageNext: document.querySelector('#section3 #sliderImageNext'),
      sliderImageBg: document.querySelector('#section3 #sliderImageBg'),
      transitionOverlay: document.querySelector('#section3 #transitionOverlay'),
      sliderContent: document.querySelector('#section3 #sliderContent'),
      sliderTitle: document.querySelector('#section3 #sliderTitle'),
      sliderThumbnails: document.querySelector('#section3 #sliderThumbnails'),
      backButton: document.querySelector('#section3 #backButton'),
      gridItems: document.querySelectorAll('#section3 .grid-item'),
      introText: document.querySelector('#section3 .intro-text'),
      introContainer: document.querySelector('#section3 .intro-container')
    };
  }

  checkSectionVisibility() {
    const section3 = document.getElementById('section3');
    if (!section3) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
          this.state.sectionVisible = true;
          if (!this.state.introPlayed) {
            this.runIntroAnimation().then(() => {
              this.state.introPlayed = true;
              this.initPortfolio();
            });
          }
          observer.unobserve(section3);
        }
      });
    }, { 
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(section3);
  }

  initPortfolio() {
    if (!this.elements.loader) return;

    gsap.set([this.elements.gridContainer, this.elements.sliderImage], {
      opacity: 0,
      visibility: 'hidden'
    });

    this.preloadImages();
  }

  runIntroAnimation() {
    return new Promise((resolve) => {
      if (!this.elements.introText || !this.elements.introContainer) {
        return resolve();
      }
      
      document.body.classList.remove('loaded');
      
      const split = new SplitText(this.elements.introText, {
        type: "words",
        wordsClass: "word"
      });
      
      gsap.set(split.words, {
        y: '100%',
        opacity: 0,
        willChange: 'transform, opacity'
      });
      
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            gsap.to(this.elements.introContainer, {
              opacity: 0,
              duration: 0.8,
              ease: 'power2.out',
              onComplete: () => {
                this.elements.introContainer.style.display = 'none';
                document.body.classList.add('loaded');
                resolve();
              }
            });
          }, 800);
        }
      });
      
      tl.to(this.elements.introText, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.in'
      })
      .to(split.words, {
        y: '0%',
        opacity: 1,
        duration: 1,
        stagger: 0.05,
        ease: 'power2.out'
      }, 0.2);
    });
  }
  
  preloadImages() {
    this.preloadedImages = [];
    let loadedCount = 0;
    
    const onLoad = () => {
      loadedCount++;
      this.handleImageLoad();
    };
    
    this.imageUrls.forEach((src, index) => {
      const img = new Image();
      img.onload = onLoad;
      img.onerror = onLoad;
      img.src = src;
      this.preloadedImages[index] = img;
    });
  }

  handleImageLoad() {
    this.state.imagesLoaded++;
    
    if (this.state.imagesLoaded === this.imageUrls.length) {
      this.bindEvents();
      this.createThumbnails();
      setTimeout(() => this.pageLoader(), this.config.loaderDelay);
    }
  }

  handleScrollPassThrough(e) {
  if (this.state.currentMode === "slider") {
    e.preventDefault();
    return false;
  }
  return true;
}

bindEvents() {
  if (this.elements.sliderThumbnails) {
    this.elements.sliderThumbnails.addEventListener('click', this.handleThumbnailClick);
  }

  if (this.elements.backButton) {
    this.elements.backButton.addEventListener('click', this.handleBackButton);
  }

  if (this.elements.grid) {
    this.elements.grid.addEventListener('click', this.handleGridClick);
  }
document.addEventListener('wheel', this.handleScrollPassThrough, { passive: false });

  document.addEventListener('keydown', this.handleKeydown);
  document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
  document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
  
  document.addEventListener('wheel', this.handleSectionScroll, { passive: false });
}

  handleThumbnailClick(e) {
    if (this.state.currentMode !== "slider" || this.state.isAnimating) return;

    const thumb = e.target.closest('.slider-thumbnail');
    if (!thumb) return;

    const index = parseInt(thumb.getAttribute('data-index'));
    if (!isNaN(index)) {
      this.transitionToSlide(index);
    }
  }

  handleBackButton(e) {
    e.preventDefault();
    if (this.state.currentMode === 'slider' && !this.state.isAnimating && !this.state.transitionInProgress) {
      this.state.transitionInProgress = true;
      this.showGridView();
    }
  }

  handleGridClick(e) {
    if (this.state.isAnimating || this.state.transitionInProgress) return;
    
    const item = e.target.closest('.grid-item');
    if (!item) return;
    
    const index = parseInt(item.getAttribute('data-index'));
    if (!isNaN(index)) {
      this.state.transitionInProgress = true;
      this.state.activeIndex = index;
      this.showSliderView();
    }
  }

  handleKeydown(e) {
    if (this.state.currentMode !== 'slider' || this.state.isAnimating) return;

    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.nextSlide();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.prevSlide();
        break;
      case 'Escape':
        e.preventDefault();
        this.showGridView();
        break;
    }
  }

handleSectionScroll(event) {
  if (this.state.currentMode === "slider") {
    event.preventDefault();
    return false;
  }
  return true;
}


  handleTouchStart(e) {
    if (this.state.currentMode !== 'slider' || this.state.isAnimating) return;
    this.state.touchStartX = e.changedTouches[0].screenX;
  }

  handleTouchEnd(e) {
    if (this.state.currentMode !== 'slider' || this.state.isAnimating) return;
    this.handleSwipe(this.state.touchStartX, e.changedTouches[0].screenX);
  }

  handleSwipe(startX, endX) {
    const diff = endX - startX;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) < minSwipeDistance) return;
    
    if (diff < 0) {
      this.nextSlide();
    } else {
      this.prevSlide();
    }
  }

  nextSlide() {
    const nextIndex = (this.state.activeIndex + 1) % this.imageUrls.length;
    this.transitionToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.state.activeIndex - 1 + this.imageUrls.length) % this.imageUrls.length;
    this.transitionToSlide(prevIndex);
  }

  createThumbnails() {
    if (!this.elements.sliderThumbnails) return;

    const fragment = document.createDocumentFragment();

    this.imageUrls.forEach((img, i) => {
      const thumb = document.createElement('div');
      thumb.className = `slider-thumbnail${i === 0 ? ' active' : ''}`;
      thumb.setAttribute('data-index', i);
      thumb.setAttribute('aria-label', `View image ${i + 1}`);
      
      const thumbImg = document.createElement('div');
      thumbImg.className = 'slider-thumbnail-img';
      thumbImg.style.backgroundImage = `url(${img})`;
      
      thumb.appendChild(thumbImg);
      fragment.appendChild(thumb);
    });

    this.elements.sliderThumbnails.appendChild(fragment);
  }

  pageLoader() {
    const loaderColumns = document.querySelectorAll('#section3 .loader-column-inner');
    loaderColumns.forEach((el, i) => {
      const animationClasses = ['is-edge-animate', 'is-reversed-animate', 'is-centered-animate'];
      el.classList.add(animationClasses[i % 3]);
    });

    this.prepareSliderView();
    this.prepareGridView();

    setTimeout(() => {
      this.hideLoader();
    }, 1800);
  }

  hideLoader() {
    const middleImage = document.querySelector('#section3 .loader-image.is-middle');
    if (middleImage) {
      const tl = gsap.timeline({
        defaults: { 
          ease: this.config.zoomEase,
          duration: this.config.zoomDuration 
        },
        onComplete: () => {
          this.elements.loader.style.display = 'none';
          gsap.set(this.elements.loader, { scale: 1 });
          
          gsap.set(this.elements.gridContainer, {
            opacity: 1,
            visibility: 'visible'
          });
          
          gsap.set([this.elements.sliderImage, this.elements.sliderImageBg], {
            opacity: 1,
            visibility: 'visible'
          });
          
          this.initApp();
        }
      });
      
      tl.to(this.elements.loader, {
        scale: 4.15,
        opacity: 0.8
      }, 0)
      .to(middleImage, {
        scale: 4.15,
        opacity: 1
      }, 0)
      .to(this.elements.loader, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.in"
      }, "-=0.6");
    }
  }

  prepareSliderView() {
    const activeImageUrl = `url(${this.imageUrls[0]})`;
    
    if (this.elements.sliderImage) {
      this.elements.sliderImage.style.backgroundImage = activeImageUrl;
    }
    if (this.elements.sliderImageBg) {
      this.elements.sliderImageBg.style.backgroundImage = activeImageUrl;
    }

    gsap.set(this.elements.sliderImage, {
      width: '100vw',
      height: '100vh',
      x: 0,
      y: 0,
      opacity: 0,
      visibility: 'hidden'
    });
  }

  prepareGridView() {
    if (!this.elements.gridContainer) return;
    gsap.set(this.elements.gridContainer, {
      display: 'block',
      opacity: 0
    });
  }

  initApp() {
    CustomEase.create("mainEase", "0.65, 0.05, 0.36, 1");
    this.showSliderViewDirect();
  }

  showSliderViewDirect() {
    this.state.currentMode = "slider";
    this.state.activeIndex = 0;

    const activeImageUrl = `url(${this.imageUrls[0]})`;
    
    if (this.elements.sliderImage) {
      this.elements.sliderImage.style.backgroundImage = activeImageUrl;
    }
    if (this.elements.sliderImageBg) {
      this.elements.sliderImageBg.style.backgroundImage = activeImageUrl;
    }

    this.updateContent(0);

    gsap.set(this.elements.sliderContent, {
      display: 'flex',
    });

    gsap.set(this.elements.gridContainer, {
      display: 'none',
      opacity: 0
    });

    this.animateSliderContent();
    this.showBackButton();
    this.updateActiveThumbnail(0);
  }

  animateSliderContent() {
    gsap.set(this.elements.sliderContent, {
      display: 'flex',
      opacity: 0
    });

    const tl = gsap.timeline({ onComplete: () => this.state.isAnimating = false });

    tl.to(this.elements.sliderContent, { 
      opacity: 1, 
      duration: 0.384, 
      ease: 'power2.inOut' 
    }, 0)
    .to('.slider-thumbnail', {
      opacity: 1,
      y: 0,
      duration: 0.384,
      stagger: 0.032,
      ease: 'power2.inOut'
    }, 0.3);
  }

  updateContent(index) {
    const content = this.slideContent[index];
    if (!content || !this.elements.sliderTitle) return;

    this.resetTitleAnimation();

    const words = content.title.split(' ');
    const midPoint = Math.ceil(words.length / 2);
    const line1 = words.slice(0, midPoint).join(' ');
    const line2 = words.slice(midPoint).join(' ');

    this.elements.sliderTitle.innerHTML = `
      <span class="title-line"><span>${line1}</span></span>
      <span class="title-line"><span>${line2}</span></span>
    `;

    this.animateTitleLines();
  }

  resetTitleAnimation() {
    if (!this.elements.sliderContent || !this.elements.sliderTitle) return;
    
    this.elements.sliderContent.classList.remove('active');
    void this.elements.sliderTitle.offsetWidth;
    
    const spans = this.elements.sliderTitle.querySelectorAll('.title-line span');
    spans.forEach(span => {
      span.style.transform = 'translate3d(0, 140%, 0)';
      span.style.opacity = '0';
      span.style.transition = 'none';
    });
  }

  animateTitleLines() {
    if (!this.elements.sliderTitle) return;
    
    const lines = this.elements.sliderTitle.querySelectorAll('.title-line span');
    gsap.set(lines, {
      y: '140%',
      opacity: 0
    });
    
    gsap.to(lines, {
      y: '0%',
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
      delay: 0.05,
      onStart: () => {
        this.elements.sliderContent.classList.add('active');
      }
    });
  }

  showBackButton() {
    const backButton = this.elements.backButton;
    if (backButton) {
      backButton.style.display = 'block';
      setTimeout(() => {
        backButton.classList.add('visible');
      }, 300);
    }
  }

  hideBackButton() {
    const backButton = this.elements.backButton;
    if (backButton) {
      backButton.classList.remove('visible');
      setTimeout(() => {
        backButton.style.display = 'none';
      }, 200);
    }
  }

  showSliderView() {
    if (this.state.currentMode === "slider" || this.state.isAnimating) return;
    
    this.state.currentMode = "slider";
    this.state.isAnimating = true;

    const activeItem = this.elements.gridItems[this.state.activeIndex];
    if (!activeItem) return;

    const activeItemRect = activeItem.getBoundingClientRect();
    const activeImageUrl = `url(${this.imageUrls[this.state.activeIndex]})`;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        this.state.isAnimating = false;
        this.state.transitionInProgress = false;
      }
    });

    tl.set([this.elements.sliderImage, this.elements.sliderImageBg], {
      backgroundImage: activeImageUrl,
      opacity: 0,
      visibility: 'visible'
    })
    .to(this.elements.transitionOverlay, {
      opacity: 1,
      duration: 0.2
    })
    .set(this.elements.sliderImage, {
      width: activeItemRect.width,
      height: activeItemRect.height,
      x: activeItemRect.left,
      y: activeItemRect.top,
      opacity: 1,
      backgroundPosition: 'center',
      transformOrigin: 'center center'
    }, "<")
    .to(this.elements.sliderImage, {
      height: '100vh',
      width: '100vw',
      x: 0,
      y: 0,
      duration: 0.8
    }, ">")
    .to(this.elements.gridContainer, {
      opacity: 0,
      duration: 0.3
    }, "-=0.3")
    .call(() => {
      this.updateContent(this.state.activeIndex);
      this.showSliderContent();
    })
    .to(this.elements.transitionOverlay, {
      opacity: 0,
      duration: 0.4
    }, ">0.1");
  }

  showSliderContent() {
    this.elements.sliderContent.style.display = 'flex';
    
    this.updateActiveThumbnail(this.state.activeIndex);

    const contentTl = gsap.timeline({ onComplete: () => this.state.isAnimating = false });

    contentTl.to(this.elements.sliderContent, { 
      opacity: 1, 
      duration: 0.384, 
      ease: 'power2.inOut' 
    }, 0)
    .to('.slider-thumbnail', {
      opacity: 1,
      y: 0,
      duration: 0.384,
      stagger: 0.032,
      ease: 'power2.inOut'
    }, 0.128);

    this.showBackButton();
  }

  showGridView() {
    if (this.state.currentMode === "grid" || this.state.isAnimating) return;
    
    this.state.currentMode = "grid";
    this.state.isAnimating = true;

    const isFirstTime = !this.state.hasShownGrid;
    this.state.hasShownGrid = true;

    if (isFirstTime) {
      this.showGridViewFirstTime();
    } else {
      this.hideSliderContent(() => this.contractSliderToGrid());
    }
  }

  showGridViewFirstTime() {
    if (this.elements.gridContainer) {
      gsap.set(this.elements.gridContainer, {
        display: 'block',
        opacity: 0
      });
    }

    this.hideSliderContent(() => {
      const activeItem = this.elements.gridItems[this.state.activeIndex];
      if (!activeItem) return;

      const activeItemRect = activeItem.getBoundingClientRect();

      gsap.to(this.elements.gridContainer, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut'
      });

      const contractTl = gsap.timeline({
        onComplete: () => {
          gsap.to(this.elements.sliderImage, {
            opacity: 0,
            duration: 0.256,
            ease: 'power2.inOut',
            onComplete: () => {
              this.elements.sliderImage.style.visibility = 'hidden';
              this.state.isAnimating = false;
            }
          });
        }
      });
      contractTl.to(this.elements.sliderImage, {
        height: activeItemRect.height,
        y: activeItemRect.top,
        duration: 0.512,
        ease: 'power2.inOut',
        onComplete: () => {
          this.state.transitionInProgress = false;
        }
      });
    });
  }

  hideSliderContent(callback) {
    const contentTl = gsap.timeline({ onComplete: callback });

    contentTl.to('.slider-thumbnail', {
      opacity: 0,
      y: 20,
      duration: 0.384,
      stagger: -0.032,
      ease: 'power2.inOut'
    }, 0)
    .to(this.elements.sliderContent, { 
      opacity: 0, 
      duration: 0.384, 
      ease: 'power2.inOut' 
    }, 0.128);

    this.hideBackButton();
  }

  contractSliderToGrid() {
    const activeItem = this.elements.gridItems[this.state.activeIndex];
    if (!activeItem) return;

    const activeItemRect = activeItem.getBoundingClientRect();

    gsap.to(this.elements.gridContainer, {
      opacity: 1,
      duration: 0.256,
      ease: 'power2.inOut'
    });

    const contractTl = gsap.timeline({
      onComplete: () => {
        gsap.to(this.elements.sliderImage, {
          opacity: 0,
          duration: 0.256,
          ease: 'power2.inOut',
          onComplete: () => {
            this.elements.sliderImage.style.visibility = 'hidden';
            this.state.isAnimating = false;
          }
        });
      }
    });

    contractTl.to(this.elements.sliderImage, {
      width: activeItemRect.width,
      x: activeItemRect.left,
      duration: 0.512,
      ease: 'power2.inOut'
    }).to(this.elements.sliderImage, {
      height: activeItemRect.height,
      y: activeItemRect.top,
      duration: 0.512,
      ease: 'power2.inOut'
    });
  }

  updateActiveThumbnail(index) {
    if (!this.elements.sliderThumbnails) return;

    const thumbnails = this.elements.sliderThumbnails.querySelectorAll('.slider-thumbnail');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));

    const activeThumbnail = this.elements.sliderThumbnails.querySelector(`[data-index="${index}"]`);
    if (activeThumbnail) {
      activeThumbnail.classList.add('active');
    }
  }

  transitionToSlide(index) {
    if (this.state.isAnimating || this.state.transitionInProgress || 
        index === this.state.activeIndex || index < 0 || index >= this.imageUrls.length) {
      return;
    }
    
    try {
      this.state.isAnimating = true;
      this.state.transitionInProgress = true;
      this.state.slideDirection = index > this.state.activeIndex ? 'right' : 'left';
      this.state.previousIndex = this.state.activeIndex;
      
      this.updateActiveThumbnail(index);
      this.performSlideTransition(index);
    } catch (error) {
      console.error('Transition error:', error);
      this.state.isAnimating = false;
      this.state.transitionInProgress = false;
    }
  }

  performSlideTransition(index) {
    const newImageUrl = `url(${this.imageUrls[index]})`;
    const xOffset = this.state.slideDirection === 'right' ? '100%' : '-100%';

    this.elements.sliderImageNext.style.backgroundImage = newImageUrl;
    this.elements.sliderImageBg.style.backgroundImage = newImageUrl;

    gsap.set([this.elements.sliderImageNext, this.elements.sliderImageBg], {
      visibility: 'visible',
      width: '100vw',
      height: '100vh',
      y: 0,
      x: xOffset,
      backgroundPosition: 'center',
      transformOrigin: 'center center'
    });

    gsap.set(this.elements.sliderImageNext, { x: xOffset, opacity: 1 });
    gsap.set(this.elements.sliderImageBg, { x: xOffset, opacity: 0.9, scale: 1 });

    const transitionTl = gsap.timeline({
      onComplete: () => this.completeSlideTransition(index, newImageUrl)
    });

    transitionTl.to(this.elements.sliderContent, { 
      opacity: 0, 
      duration: 0.2,
      ease: 'power2.inOut' 
    }, 0)
    .to(this.elements.transitionOverlay, { 
      opacity: 0.15, 
      duration: 0.15,
      ease: 'power1.in' 
    }, 0)
    .to(this.elements.transitionOverlay, { 
      opacity: 0, 
      duration: 0.2,
      ease: 'power1.out' 
    }, 0.1);

    const slideOffset = this.state.slideDirection === 'right' ? '-35%' : '35%';
    const bgOffset = this.state.slideDirection === 'right' ? '-10%' : '10%';

    transitionTl.to(this.elements.sliderImage, {
      x: slideOffset,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 0).to(this.elements.sliderImageBg, {
      x: bgOffset,
      opacity: 0.95,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 0.02)
    .to(this.elements.sliderImageNext, {
      x: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 0.05);
  }

  completeSlideTransition(index, newImageUrl) {
    try {
      this.elements.sliderImage.style.backgroundImage = newImageUrl;

      gsap.set([this.elements.sliderImageNext, this.elements.sliderImageBg, this.elements.transitionOverlay], {
        opacity: 0,
        x: 0,
        y: 0,
        visibility: 'hidden'
      });

      gsap.set(this.elements.sliderImage, { x: 0, opacity: 1 });

      this.updateContent(index);
      this.state.activeIndex = index;

      const showTl = gsap.timeline({ 
        onComplete: () => {
          this.state.isAnimating = false;
          this.state.transitionInProgress = false;
        } 
      });
      
      showTl.to(this.elements.sliderContent, { 
        opacity: 1, 
        duration: 0.512, 
        ease: 'mainEase' 
      }, 0);
    } catch (error) {
      console.error('Completion error:', error);
      this.state.isAnimating = false;
      this.state.transitionInProgress = false;
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);

    document.removeEventListener('wheel', this.handleScrollPassThrough);


    if (this.elements.sliderThumbnails) {
      this.elements.sliderThumbnails.removeEventListener('click', this.handleThumbnailClick);
    }
    if (this.elements.backButton) {
      this.elements.backButton.removeEventListener('click', this.handleBackButton);
    }
    if (this.elements.grid) {
      this.elements.grid.removeEventListener('click', this.handleGridClick);
    }

    if (window.gsap) {
      gsap.killTweensOf("*");
    }
    this.preloadedImages = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const portfolio = new Portfolio();
  window.addEventListener('beforeunload', () => {
    portfolio.destroy();
  });
});