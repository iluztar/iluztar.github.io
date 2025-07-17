class UIManager {
  constructor() {
    this.state = {
      lang: "en",
      uiVisible: true
    };
    
    this.elements = {};
    this.eventListeners = [];
    this.preventFlash();
    this.init();
  }

  cacheElements() {
    this.elements = {
      themeToggle: document.querySelector("#theme-toggle"),
      themeIcon: document.querySelector("#theme-icon"),
      langBtn: document.querySelector(".lang-select"),
      langText: document.querySelector(".language-current"),
      header: document.querySelector("#header"),
      footer: document.querySelector("#footer"),
      menuToggle: document.querySelector("#menu-toggle"),
      dropdownMenu: document.querySelector("#dropdown-menu")
    };
  }

preventFlash() {
  const savedTheme = localStorage.getItem("theme") || 
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  
  document.documentElement.setAttribute("data-theme", savedTheme);
  
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.content = savedTheme === "dark" ? "#1a1a1a" : "#ffffff";
  }
}

  updateTheme(theme) {
    if (this.elements.themeIcon) {
      this.elements.themeIcon.className = theme === "dark" ? "bx bx-moon" : "bx bx-sun";
    }
    
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === "dark" ? "#1a1a1a" : "#ffffff");
    }
  }

toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  
  // Perbaikan: Update icon tema
  if (this.elements.themeIcon) {
    this.elements.themeIcon.className = newTheme === "dark" ? "bx bx-moon" : "bx bx-sun";
  }
    
  // Perbaikan: Update meta theme-color
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.content = newTheme === "dark" ? "#1a1a1a" : "#ffffff";
  }
}

  toggleLanguage() {
    this.state.lang = this.state.lang === "en" ? "id" : "en";
    
    if (this.elements.langText) {
      this.elements.langText.textContent = this.state.lang.toUpperCase();
    }
    
    this.updateLanguage();
  }

  updateLanguage() {
    const elements = document.querySelectorAll("[data-lang-en], [data-lang-id]");
    if (elements.length === 0) return;
    
    gsap.timeline({
      onComplete: () => {
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      }
    })
    .to(elements, {
      opacity: 0,
      y: 10,
      duration: 0.3,
      ease: "power2.in",
      stagger: 0.02
    })
    .call(() => {
      elements.forEach(element => {
        const text = element.getAttribute(`data-lang-${this.state.lang}`)?.replace(/\s+/g, " ").trim();
        if (text) {
          const span = element.querySelector("span:not(.highlight)");
          if (span && !element.querySelector(".highlight")) {
            span.textContent = text;
          } else {
            element.innerHTML = text;
          }
        }
      });
    })
    .to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.03
    });
  }

  toggleUI() {
    this.state.uiVisible = !this.state.uiVisible;
    const uiElements = [this.elements.header, this.elements.footer].filter(Boolean);
    
    gsap.to(uiElements, {
      opacity: this.state.uiVisible ? 1 : 0,
      y: (target, index) => this.state.uiVisible ? 0 : (index === 0 ? -60 : 60),
      duration: 0.3,
      ease: this.state.uiVisible ? "power2.out" : "power2.in",
      stagger: 0.1
    });
  }

  toggleMenuDropdown(event) {
    event.preventDefault();
    this.elements.dropdownMenu?.classList.toggle("show");
  }

  handleDropdownNavigation(event) {
    event.preventDefault();
    const target = event.currentTarget.getAttribute("href");
    const section = document.querySelector(target);
    
    if (!section) return;
    
    this.elements.dropdownMenu?.classList.remove("show");
    
    // You might need to integrate with your scroll manager here
    // For example:
    // scrollAnimationManager.scrollToSection(sectionIndex, { duration: 1 });
    
    // Close menu after a delay
    setTimeout(() => {
      // Additional cleanup if needed
    }, 100);
  }

  handleClickOutside(event) {
    if (!event.target.closest(".links") && 
        this.elements.dropdownMenu?.classList.contains("show")) {
      this.elements.dropdownMenu.classList.remove("show");
    }
  }

  handleKeydown(event) {
    if (event.altKey) {
      if (event.key === "h") {
        event.preventDefault();
        this.toggleUI();
      }
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
    this.cacheElements();
    
    // Initialize theme
    const savedTheme = localStorage.getItem("theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateTheme(savedTheme);
    
    // Initialize language
    this.state.lang = localStorage.getItem("lang") || "en";
    if (this.elements.langText) {
      this.elements.langText.textContent = this.state.lang.toUpperCase();
    }
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Theme toggle
if (this.elements.themeToggle) {
  this.addListener(this.elements.themeToggle, "click", () => this.toggleTheme());
}
    
    // Language toggle
    if (this.elements.langBtn) {
      this.addListener(this.elements.langBtn, "click", () => this.toggleLanguage());
    }
    
    // Menu toggle
    if (this.elements.menuToggle) {
      this.addListener(this.elements.menuToggle, "click", event => this.toggleMenuDropdown(event));
    }
    
    // Dropdown navigation
    if (this.elements.dropdownMenu) {
      const dropdownLinks = this.elements.dropdownMenu.querySelectorAll('a[href^="#"]');
      dropdownLinks.forEach(link => {
        this.addListener(link, "click", event => this.handleDropdownNavigation(event));
      });
    }
    
    // Click outside to close dropdown
    this.addListener(document, "click", event => this.handleClickOutside(event));
    
    // Keyboard shortcuts
    this.addListener(document, "keydown", event => this.handleKeydown(event), { passive: true });
  }

  destroy() {
    this.eventListeners.forEach(({ target, event, handler, options }) => {
      target.removeEventListener(event, handler, options);
    });
    this.eventListeners = [];
  }
}

// Initialize
const uiManager = new UIManager();
window.addEventListener("unload", () => uiManager.destroy());