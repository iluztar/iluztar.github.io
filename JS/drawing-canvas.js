class DrawingCanvasManager {
  constructor() {
    this.state = {
      isDrawing: false,
      isDrawingMode: false,
      lastPoint: null,
      sectionCanvases: [],
      penCursor: null,
      undoStacks: [],
      redoStacks: [],
      currentThickness: 1,
      minThickness: 0.5,
      maxThickness: 5,
      lastTime: 0,
      lastPos: { x: 0, y: 0 },
      hoverElement: null,
      currentColor: '',
      animationFrameId: null,
      resizeTimeout: null,
      currentSectionIndex: 0,
      touchSupported: false
    };
    
    this.elements = {};
    this.eventListeners = [];
    this.throttledResize = this.throttle(this.resizeCanvases.bind(this), 16);
    this.throttledCursorUpdate = this.throttle(this.updatePenCursor.bind(this), 16);
    this.init();
  }

  throttle(func, limit) {
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
  }

setupCanvases() {
  const canvasElements = document.querySelectorAll(".section-canvas");
  
  this.state.sectionCanvases = Array.from(canvasElements).map((canvas, index) => {
    const section = canvas.closest('section');
    if (!section) return null;
    
    // Set canvas position relative to its section
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '10'; // Ensure it's above section content
    
    // Set section to relative positioning to contain the canvas
    section.style.position = 'relative';
    section.style.overflow = 'hidden';
    
    const ctx = canvas.getContext("2d", { alpha: true });
    this.state.undoStacks[index] = [];
    this.state.redoStacks[index] = [];
    return { element: canvas, ctx, sectionId: section.id };
  }).filter(Boolean);
  
  this.resizeCanvases();
}

resizeCanvases() {
  if (this.state.resizeTimeout) {
    clearTimeout(this.state.resizeTimeout);
  }
  
  this.state.resizeTimeout = setTimeout(() => {
    this.state.sectionCanvases.forEach(({ element, ctx }, index) => {
      if (!element) return;
      
      const section = element.closest('section');
      if (!section) return;
      
      const rect = section.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      
      if (element.width !== width || element.height !== height) {
        const imageData = ctx.getImageData(0, 0, element.width, element.height);
        
        element.width = width;
        element.height = height;
        
        if (imageData.width > 0 && imageData.height > 0) {
          ctx.putImageData(imageData, 0, 0);
        }
        
        if (ctx) {
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.imageSmoothingEnabled = true;
        }
      }
    });
  }, 16);
}

  saveCanvasState(index) {
    const canvas = this.state.sectionCanvases[index];
    if (!canvas) return;
    
    if (this.state.undoStacks[index].length >= 50) {
      this.state.undoStacks[index].shift();
    }
    
    this.state.undoStacks[index].push(canvas.element.toDataURL());
    this.state.redoStacks[index] = [];
  }

  undoDrawing() {
    const index = this.getCurrentSectionIndex();
    const undoStack = this.state.undoStacks[index];
    const redoStack = this.state.redoStacks[index];
    
    if (!undoStack || undoStack.length === 0) return;
    
    const canvas = this.state.sectionCanvases[index];
    if (!canvas) return;
    
    redoStack.push(canvas.element.toDataURL());
    
    const image = new Image();
    image.onload = () => {
      canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
      canvas.ctx.drawImage(image, 0, 0);
    };
    image.src = undoStack.pop();
    
    this.showNotification("Undo");
  }

  redoDrawing() {
    const index = this.getCurrentSectionIndex();
    const undoStack = this.state.undoStacks[index];
    const redoStack = this.state.redoStacks[index];
    
    if (!redoStack || redoStack.length === 0) return;
    
    const canvas = this.state.sectionCanvases[index];
    if (!canvas) return;
    
    undoStack.push(canvas.element.toDataURL());
    
    const image = new Image();
    image.onload = () => {
      canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
      canvas.ctx.drawImage(image, 0, 0);
    };
    image.src = redoStack.pop();
    
    this.showNotification("Redo");
  }

  getCurrentSectionIndex() {
    if (window.scrollAnimationManager?.state?.currentIndex !== undefined) {
      return window.scrollAnimationManager.state.currentIndex;
    }
    
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let currentIndex = 0;
    
    this.state.sectionCanvases.forEach((canvas, index) => {
      if (!canvas?.element) return;
      
      const rect = canvas.element.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionBottom = sectionTop + rect.height;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentIndex = index;
      }
    });
    
    return currentIndex;
  }

getPosition(event) {
  const canvas = this.getCurrentCanvas();
  if (!canvas) return { x: 0, y: 0 };
  
  const rect = canvas.element.getBoundingClientRect();
  const scaleX = canvas.element.width / rect.width;
  const scaleY = canvas.element.height / rect.height;
  
  const clientX = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
  const clientY = event.clientY ?? event.touches?.[0]?.clientY ?? 0;
  
  return {
    x: Math.round((clientX - rect.left) * scaleX),
    y: Math.round((clientY - rect.top) * scaleY)
  };
}

getCurrentCanvas() {
  return this.state.sectionCanvases[this.state.currentSectionIndex] || null;
}
  startDrawing(event) {
    if (!this.state.isDrawingMode || this.isInteractiveElement(event.target)) return;
    
    const canvas = this.getCurrentCanvas();
    if (!canvas) return;
    
    this.state.isDrawing = true;
    const position = this.getPosition(event);
    this.state.lastPoint = position;
    this.state.lastPos = position;
    this.state.lastTime = Date.now();
    
    const pressure = event.pressure ?? 0.5;
    this.state.currentThickness = this.state.minThickness + 
      (this.state.maxThickness - this.state.minThickness) * pressure;
    
    this.saveCanvasState(this.getCurrentSectionIndex());
    
    canvas.ctx.beginPath();
    canvas.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--text");
    canvas.ctx.globalAlpha = 0.9;
    
    this.drawCalligraphyDot(position, this.state.currentThickness);
    this.updatePenCursor(position, true);
  }

  draw(event) {
    if (!this.state.isDrawing || !this.state.isDrawingMode) return;
    
    const canvas = this.getCurrentCanvas();
    if (!canvas) return;
    
    const position = this.getPosition(event);
    const currentTime = Date.now();
    const timeDiff = currentTime - this.state.lastTime;
    const distance = Math.hypot(position.x - this.state.lastPos.x, position.y - this.state.lastPos.y);
    const speed = timeDiff > 0 ? distance / timeDiff * 10 : 0;
    const pressure = event.pressure ?? 0.5;
    const speedFactor = Math.min(1 / (1 + 0.5 * speed), 1);
    
    this.state.currentThickness = this.state.minThickness + 
      (this.state.maxThickness - this.state.minThickness) * pressure * speedFactor;
    
    this.drawCalligraphyStroke(this.state.lastPoint, position, this.state.currentThickness);
    
    this.state.lastPoint = position;
    this.state.lastPos = position;
    this.state.lastTime = currentTime;
    this.updatePenCursor(position, this.state.currentThickness);
  }

  stopDrawing() {
    this.state.isDrawing = false;
    this.state.lastPoint = null;
  }

  drawCalligraphyDot(position, thickness) {
    const canvas = this.getCurrentCanvas();
    if (!canvas) return;
    
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.arc(position.x, position.y, thickness, 0, 2 * Math.PI);
    canvas.ctx.fill();
    canvas.ctx.restore();
  }

  drawCalligraphyStroke(start, end, thickness) {
    const canvas = this.getCurrentCanvas();
    if (!canvas) return;
    
    const angle = Math.atan2(end.x - start.x, end.y - start.y);
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    const color = getComputedStyle(document.documentElement).getPropertyValue("--text");
    
    canvas.ctx.fillStyle = color;
    
    const steps = Math.max(Math.floor(length / 2), 2);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;
      const currentThickness = thickness * (0.7 + 0.3 * Math.sin(t * Math.PI));
      
      canvas.ctx.save();
      canvas.ctx.beginPath();
      canvas.ctx.arc(x, y, currentThickness, 0, 2 * Math.PI);
      canvas.ctx.fill();
      canvas.ctx.restore();
    }
  }

  clearCanvas(clearAll = false) {
    const clear = (canvas, index) => {
      this.saveCanvasState(index);
      canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
    };
    
    if (clearAll) {
      this.state.sectionCanvases.forEach((canvas, index) => {
        if (canvas) clear(canvas, index);
      });
      this.showNotification("All canvases cleared");
    } else {
      const canvas = this.getCurrentCanvas();
      const index = this.getCurrentSectionIndex();
      if (canvas) {
        clear(canvas, index);
        this.showNotification("Current canvas cleared");
      }
    }
  }

  toggleDrawingMode() {
    this.state.isDrawingMode = !this.state.isDrawingMode;
    document.body.classList.toggle("pen-cursor-active", this.state.isDrawingMode);
    
    document.body.style.cursor = this.state.isDrawingMode ? "none" : "";
    
    if (this.state.penCursor) {
      this.state.penCursor.style.display = this.state.isDrawingMode ? "flex" : "none";
    }
    
    this.showNotification("Drawing Mode: " + (this.state.isDrawingMode ? "ON" : "OFF"));
  }

  isInteractiveElement(element) {
    return element?.closest('a, button, [role="button"], [tabindex]:not([tabindex="-1"]), input, textarea, select, [contenteditable]');
  }

  updatePenCursor(position, isDrawing = false) {
    if (!this.state.penCursor) return;
    
    const canvas = this.getCurrentCanvas();
    if (!canvas) return;
    
    const x = position.x;
    const y = position.y;
    
    const hoverElement = document.elementFromPoint(x, y);
    const isInteractive = this.isInteractiveElement(hoverElement);
    
    let size = 20;
    if (isInteractive) {
      size = 40;
      if (this.state.hoverElement !== hoverElement) {
        this.state.penCursor.classList.add("hover");
        this.state.hoverElement = hoverElement;
      }
    } else {
      if (this.state.hoverElement) {
        this.state.penCursor.classList.remove("hover");
        this.state.hoverElement = null;
      }
      size = isDrawing ? this.state.currentThickness * 4 : 20;
    }
    
    this.state.penCursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    this.state.penCursor.style.width = `${size}px`;
    this.state.penCursor.style.height = `${size}px`;
    this.state.penCursor.style.marginLeft = `-${size/2}px`;
    this.state.penCursor.style.marginTop = `-${size/2}px`;
  }

  handleCursorClick() {
    if (this.state.penCursor) {
      this.state.penCursor.classList.add("click");
      setTimeout(() => {
        this.state.penCursor.classList.remove("click");
      }, 35);
    }
  }

  showNotification(message, type = "info", duration = 2000) {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) existingNotification.remove();
    
    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.setAttribute("role", "alert");
    document.body.appendChild(notification);
    
    gsap.timeline({
      onComplete: () => notification.remove()
    })
    .fromTo(notification, {
      opacity: 0,
      y: 20,
      scale: 0.8
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)"
    })
    .to(notification, {
      opacity: 0,
      y: -20,
      scale: 0.8,
      duration: 0.3,
      delay: duration / 1000,
      ease: "back.in(1.7)"
    });
  }

updateCurrentSection() {
  const scrollPosition = window.scrollY + window.innerHeight / 2;
  let currentIndex = 0;
  
  this.state.sectionCanvases.forEach((canvas, index) => {
    if (!canvas?.element) return;
    
    const section = canvas.element.closest('section');
    if (!section) return;
    
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      currentIndex = index;
    }
  });
  
  this.state.currentSectionIndex = currentIndex;
}

  handlePointer(event, action) {
    if (action === "down") {
      if (!this.state.isDrawingMode || this.isInteractiveElement(event.target)) return;
      event.preventDefault();
      this.startDrawing(event);
    } else if (action === "move") {
      if (!this.state.isDrawingMode) return;
      const position = this.getPosition(event);
      this.updatePenCursor(position, this.state.isDrawing);
      if (this.state.isDrawing) this.draw(event);
    } else if (action === "up") {
      this.stopDrawing();
    }
  }

  handleDrawingTouch(event, isStart = false) {
    if (!this.state.isDrawingMode) return;
    
    const element = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
    if (!this.isInteractiveElement(element)) {
      event.preventDefault();
      if (isStart) {
        this.startDrawing(event);
      } else {
        this.draw(event);
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
        this.updateCurrentSection();
    this.elements.toggleDrawing = document.querySelector("#toggle-drawing");
    this.elements.clearCanvas = document.querySelector("#clear-canvas");
    this.elements.clearAllCanvases = document.querySelector("#clear-all-canvases");
    
    this.setupCanvases();
    this.state.penCursor = document.querySelector(".pen-cursor");
    const penCursorDot = document.querySelector(".pen-cursor-dot");
    
    if (this.state.penCursor && penCursorDot) {
      this.state.penCursor.style.display = "none";
      this.state.penCursor.removeAttribute("hidden");
      penCursorDot.removeAttribute("hidden");
    }
    
    this.setupEventListeners();
  }

  setupEventListeners() {
     // Add scroll listener to update current section
    this.addListener(window, "scroll", () => {
      this.updateCurrentSection();
    }, { passive: true });
  

    this.addListener(document, "click", () => this.handleCursorClick());
    this.addListener(window, "resize", () => this.resizeCanvases());
    
    if (this.elements.toggleDrawing) {
      this.addListener(this.elements.toggleDrawing, "click", () => this.toggleDrawingMode());
    }
    
    if (this.elements.clearCanvas) {
      this.addListener(this.elements.clearCanvas, "click", () => this.clearCanvas());
    }
    
    if (this.elements.clearAllCanvases) {
      this.addListener(this.elements.clearAllCanvases, "click", () => this.clearCanvas(true));
    }
    
    this.addListener(document, "pointerdown", event => this.handlePointer(event, "down"), { passive: false });
    this.addListener(document, "pointermove", event => this.handlePointer(event, "move"), { passive: true });
    this.addListener(document, "pointerup", event => this.handlePointer(event, "up"), { passive: true });
    
    this.addListener(document, "touchstart", event => this.handleDrawingTouch(event, true), { passive: false });
    this.addListener(document, "touchmove", event => this.handleDrawingTouch(event), { passive: false });
    this.addListener(document, "touchend", () => this.stopDrawing(), { passive: true });
    
    this.addListener(document, "keydown", event => {
      if (event.ctrlKey && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        this.undoDrawing();
      } else if ((event.ctrlKey && event.key === "y") || (event.ctrlKey && event.shiftKey && event.key === "Z")) {
        event.preventDefault();
        this.redoDrawing();
      } else if (event.ctrlKey && event.key === "Delete") {
        event.preventDefault();
        this.clearCanvas(true);
      } else if (event.key === "Delete") {
        event.preventDefault();
        this.clearCanvas();
      } else if (event.altKey && event.key === "b") {
        event.preventDefault();
        this.toggleDrawingMode();
      }
    }, { passive: true });
  }

  destroy() {
    this.eventListeners.forEach(({ target, event, handler, options }) => {
      target.removeEventListener(event, handler, options);
    });
    this.eventListeners = [];
  }
}

const drawingCanvasManager = new DrawingCanvasManager();
window.addEventListener("unload", () => drawingCanvasManager.destroy());