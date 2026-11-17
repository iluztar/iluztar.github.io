(function () {
  "use strict";

  // Mobile skips the scroll-reveal animation entirely (not just visually via
  // CSS, but here too) — one less IntersectionObserver + per-element
  // transition-delay stagger loop running on lower-powered devices.
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || window.matchMedia("(max-width: 639px)").matches;

  /* ---------------- scroll reveal (FadeIn / FadeInStagger) ---------------- */
  var staggerContainers = document.querySelectorAll(".fade-in-stagger");
  staggerContainers.forEach(function (container) {
    var step = container.classList.contains("fade-in-stagger--faster") ? 0.06 : 0.1;
    var children = container.querySelectorAll(".fade-in");
    children.forEach(function (child, i) {
      // Cap the delay index so long grids (e.g. the 8-item trust panel)
      // don't take seconds to fully reveal — past the cap, items still
      // stagger visually but the whole group finishes quickly.
      var delayIndex = Math.min(i, 6);
      child.style.transitionDelay = reduceMotion ? "0s" : delayIndex * step + "s";
    });
  });

  if (reduceMotion) {
    document.querySelectorAll(".fade-in, .fade-in-stagger").forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -200px 0px", threshold: 0 }
    );
    document.querySelectorAll(".fade-in, .fade-in-stagger").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".fade-in, .fade-in-stagger").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
