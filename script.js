// ===== HANDLER TOMBOL MODAL =====
// Menangani klik pada tombol dengan class 'cybr-btn' untuk membuka modal
document.querySelectorAll('.cybr-btn').forEach(button => {
  button.addEventListener('click', function(e) {
    if (this.hasAttribute('data-modal')) {
      e.preventDefault();
      const modalId = this.getAttribute('data-modal');
      document.getElementById(modalId).style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  });
});

// ===== THEME SWITCHER =====
// Fungsi untuk mengganti tema light/dark
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

// Mengatur tema awal berdasarkan localStorage
if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'dark') toggleSwitch.checked = true;
}

function switchTheme(e) {
  const theme = e.target.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
toggleSwitch.addEventListener('change', switchTheme);

// ===== ANIMASI SCROLL =====
// Fungsi debounce untuk optimasi event scroll
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

// Animasi elemen saat scrolling
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

// ===== UPDATE NAVIGASI AKTIF =====
// Update status aktif pada navigasi mobile
function updateMobileNav(hash) {
  const mobileNavLinks = document.querySelectorAll('.mobile-footer-nav a');
  mobileNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
    }
  });
}

// Update dot navigasi yang aktif
function updateActiveDot(hash) {
  $('nav.dots a').removeClass('active');
  if (hash == '#home') {
    $('nav.dots a.scroll-1').addClass('active');
  } else if (hash == '#portfolio') {
    $('nav.dots a.scroll-2').addClass('active');
  } else if (hash == '#tos') {
    $('nav.dots a.scroll-3').addClass('active');
  } else if (hash == '#contact') {
    $('nav.dots a.scroll-4').addClass('active');
  }
}

// ===== FUNGSI SCROLL KE SECTION =====
// Fungsi untuk scroll ke section dengan animasi
function scrollToSection(hash) {
  const targetSection = document.querySelector(hash);
  if (targetSection) {
    $('html, body').animate({
      scrollTop: targetSection.offsetTop
    }, 500, function() {
      // Update status aktif setelah animasi selesai
      $('section').removeClass('active');
      targetSection.classList.add('active');
      updateActiveDot(hash);
      updateMobileNav(hash);
      $('nav.header-nav ul li a').removeClass('active');
      $(`nav.header-nav ul li a[href="${hash}"]`).addClass('active');
    });
  }
}

// ===== INISIALISASI SAAT LOAD =====
window.addEventListener('load', () => {
  // Set section home sebagai aktif
  const homeSection = document.querySelector('#home');
  if (homeSection) {
    document.querySelectorAll('section').forEach(section => {
      section.classList.remove('active');
    });
    homeSection.classList.add('active');
    
    // Trigger animasi untuk elemen di section home
    const elements = homeSection.querySelectorAll('[data-animate]');
    elements.forEach(el => {
      el.classList.add('animated');
    });
  }
  
  // Update semua navigasi ke home
  updateActiveDot('#home');
  updateMobileNav('#home');
  $('nav.header-nav ul li a').removeClass('active');
  $('nav.header-nav ul li a[href="#home"]').addClass('active');
  
  // Jalankan animasi scroll
  animateOnScroll();
  
  // Handle hash URL saat load
  if (window.location.hash) {
    scrollToSection(window.location.hash);
  }
});

// Event listener untuk scroll
window.addEventListener('scroll', debounce(animateOnScroll));

// ===== DOCUMENT READY =====
$(document).ready(function() {
  let isScrolling = false;
  let isModalOpen = false;

  // ===== PORTFOLIO SLIDER =====
  // Inisialisasi portfolio slider dengan Swiper
  const portfolioSlider = new Swiper('.portfolio-slider', {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">✦</span>';
      },
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 40,
        centeredSlides: false
      }
    },
    on: {
      init: function () {
        if (this.slides.length <= 3) {
          this.navigation.destroy();
          this.pagination.destroy();
        }
      }
    }
  });

  // Update slider saat window diresize
  $(window).on('resize', function() {
    portfolioSlider.update();
  });

  // ===== MODAL FUNCTIONS =====
  // Portfolio modal functionality
  $('.category-btn').click(function() {
    const modalId = $(this).data('modal');
    $('#' + modalId).fadeIn();
    $('body').css('overflow', 'hidden');
    isModalOpen = true;
  });
  
  $('.modal-close').click(function() {
    $(this).closest('.portfolio-modal').fadeOut();
    $('body').css('overflow', 'hidden');
    isModalOpen = false;
  });
  
  // Close modal when clicking outside content
  $(document).click(function(e) {
    if ($(e.target).hasClass('portfolio-modal')) {
      $('.portfolio-modal').fadeOut();
      $('body').css('overflow', 'hidden');
      isModalOpen = false;
    }
  });
  
  // Close modal with ESC key
  $(document).keydown(function(e) {
    if (e.key === 'Escape') {
      $('.portfolio-modal').fadeOut();
      $('body').css('overflow', 'hidden');
      isModalOpen = false;
    }
  });

  // TOS modal functionality
  $('.tos-btn').click(function() {
    const modalId = $(this).data('modal');
    $('#' + modalId).fadeIn();
    $('body').css('overflow', 'hidden');
    isModalOpen = true;
  });
  
  $('.tos-modal-close').click(function() {
    $(this).closest('.tos-modal').fadeOut();
    $('body').css('overflow', 'hidden');
    isModalOpen = false;
  });
  
  // Close TOS modal when clicking outside content
  $(document).click(function(e) {
    if ($(e.target).hasClass('tos-modal')) {
      $('.tos-modal').fadeOut();
      $('body').css('overflow', 'hidden');
      isModalOpen = false;
    }
  });

  // ===== LIGHTBOX FUNCTIONALITY =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  const lightboxPagination = lightbox.querySelector('.lightbox-pagination');
  
  // Get all portfolio images
  const portfolioImages = document.querySelectorAll('.modal-item img');
  let currentImageIndex = 0;
  const images = Array.from(portfolioImages).map(img => ({
    src: img.src,
    alt: img.alt
  }));

  // Create lightbox pagination dots
  function createLightboxPagination() {
    lightboxPagination.innerHTML = '';
    images.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'lightbox-dot';
      dot.innerHTML = '✦';
      dot.addEventListener('click', () => {
        goToLightboxImage(index);
      });
      lightboxPagination.appendChild(dot);
    });
    updateLightboxPagination();
  }

  // Update lightbox pagination active state
  function updateLightboxPagination() {
    const dots = lightboxPagination.querySelectorAll('.lightbox-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentImageIndex);
    });
  }

  // Open lightbox when portfolio image is clicked
  portfolioImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentImageIndex = index;
      updateLightboxImage();
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      createLightboxPagination();
      isModalOpen = true;
    });
  });

  // Close lightbox
  lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    isModalOpen = false;
  });

  // Close when clicking outside image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
      isModalOpen = false;
    }
  });

  // Navigation
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightboxImage();
    updateLightboxPagination();
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightboxImage();
    updateLightboxPagination();
  });

  // Go to specific image in lightbox
  function goToLightboxImage(index) {
    currentImageIndex = index;
    updateLightboxImage();
    updateLightboxPagination();
  }

  // Update lightbox image
  function updateLightboxImage() {
    lightboxImg.src = images[currentImageIndex].src;
    lightboxImg.alt = images[currentImageIndex].alt;
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        isModalOpen = false;
      } else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
        updateLightboxPagination();
      } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
        updateLightboxPagination();
      }
    }
  });

  // ===== NAVIGASI DENGAN ANIMASI SCROLL =====
  // Event listener untuk navigasi header
  $('nav.header-nav ul li a').click(function(e) {
    e.preventDefault();
    const hash = this.hash;
    scrollToSection(hash);
  });

  // Event listener untuk navigasi mobile
  $('.mobile-footer-nav a').click(function(e) {
    e.preventDefault();
    const hash = this.hash;
    scrollToSection(hash);
  });

  // Event listener untuk dots navigation
  $('nav.dots a').click(function(e) {
    e.preventDefault();
    const hash = this.hash;
    scrollToSection(hash);
  });

  // ===== SCROLLING FUNCTIONALITY =====
  // Mouse wheel scrolling - only when modal is not open
  $(window).on('wheel', { passive: false }, function(e) {
    if (isScrolling || isModalOpen) return;
    isScrolling = true;

    var currentSection = $('section.active');
    var nextSection;

    if (e.originalEvent.deltaY > 0 && !currentSection.is(':last-of-type')) {
      nextSection = currentSection.next('section');
    } else if (e.originalEvent.deltaY < 0 && !currentSection.is(':first-of-type')) {
      nextSection = currentSection.prev('section');
    }

    if (nextSection && nextSection.length) {
      $('html, body').animate({
        scrollTop: nextSection.offset().top
      }, 800, function() {
        isScrolling = false;
        updateActiveDot('#' + nextSection.attr('id'));
        updateMobileNav('#' + nextSection.attr('id'));
      });
    } else {
      isScrolling = false;
    }

    e.preventDefault();
  });

  // Keyboard arrow navigation - only when modal is not open
  $(document).keydown(function(e) {
    if (isScrolling || isModalOpen) return;

    var currentSection = $('section.active');
    var nextSection;

    switch (e.which) {
      case 38: // Up arrow
        if (currentSection.is(':first-of-type')) return;
        isScrolling = true;
        nextSection = currentSection.prev('section');
        break;

      case 40: // Down arrow
        if (currentSection.is(':last-of-type')) return;
        isScrolling = true;
        nextSection = currentSection.next('section');
        break;

      default: return;
    }

    if (nextSection && nextSection.length) {
      $('html, body').animate({
        scrollTop: nextSection.offset().top
      }, 800, function() {
        isScrolling = false;
        updateActiveDot('#' + nextSection.attr('id'));
        updateMobileNav('#' + nextSection.attr('id'));
      });
      e.preventDefault();
    }
  });

  // Update active section on scroll
  let lastScrollPosition = 0;
  let ticking = false;

  $(window).scroll(function() {
    lastScrollPosition = $(window).scrollTop();
    
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (isModalOpen) return;
        
        // Jika di paling atas, pastikan section home aktif
        if (lastScrollPosition <= 10) {
          $('section').removeClass('active');
          $('#home').addClass('active');
          updateActiveDot('#home');
          updateMobileNav('#home');
          ticking = false;
          return;
        }

        $('section').each(function() {
          var top = $(this).offset().top - 100;
          var bottom = top + $(this).outerHeight();

          if (lastScrollPosition >= top && lastScrollPosition < bottom) {
            $('section').removeClass('active');
            $(this).addClass('active');
            updateActiveDot('#' + $(this).attr('id'));
            updateMobileNav('#' + $(this).attr('id'));
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // Improved touch swipe functionality for section navigation
  let touchStartY = 0;
  let touchStartTime = 0;
  const swipeThreshold = 50;
  const swipeTimeThreshold = 300;

  document.addEventListener('touchstart', function(e) {
    if (isModalOpen) return;
    touchStartY = e.touches[0].clientY;
    touchStartTime = new Date().getTime();
  }, { passive: true });
  
  document.addEventListener('touchend', function(e) {
    if (isScrolling || isModalOpen) return;
  
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY;
    const touchEndTime = new Date().getTime();
    const deltaTime = touchEndTime - touchStartTime;
  
    if (Math.abs(deltaY) > swipeThreshold && deltaTime < swipeTimeThreshold) {
      const currentSection = $('section.active');
  
      if (deltaY > 0 && !currentSection.is(':first-of-type')) {
        navigateSection('prev');
      } else if (deltaY < 0 && !currentSection.is(':last-of-type')) {
        navigateSection('next');
      }
    }
  }, { passive: false });

  function navigateSection(direction) {
    const currentSection = $('section.active');
    let nextSection = direction === 'next' ?
      currentSection.next('section') :
      currentSection.prev('section');

    if (!nextSection.length)
      nextSection = direction === 'next' ?
        $('section').first() :
        $('section').last();

    $('html, body').animate({
      scrollTop: nextSection.offset().top
    }, 800);
    
    updateActiveDot('#' + nextSection.attr('id'));
    updateMobileNav('#' + nextSection.attr('id'));
  }

  // Update header navigation based on current section
  $(window).scroll(function() {
    var scrollPosition = $(window).scrollTop();

    $('section').each(function() {
      var top = $(this).offset().top - 100;
      var bottom = top + $(this).outerHeight();

      if (scrollPosition >= top && scrollPosition < bottom) {
        var sectionId = $(this).attr('id');
        $('nav.header-nav ul li a').removeClass('active');
        $('nav.header-nav ul li a[href="#' + sectionId + '"]').addClass('active');
      }
    });
  });
});
