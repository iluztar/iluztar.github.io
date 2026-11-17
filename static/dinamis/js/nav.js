(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- mobile navigation panel ----------------
     Source behaviour (RootLayout.jsx): the panel is a normal in-flow
     sibling inside <header> that animates height 0.5rem -> auto
     (framer-motion `layout`), pushing the white content area down.
     It is NOT a fixed/fullscreen overlay. */
  var panel = document.getElementById("nav-panel");
  var closedHeader = document.getElementById("nav-closed-header");
  var openBtn = document.getElementById("nav-open-btn");
  var closeBtn = document.getElementById("nav-close-btn");
  var expanded = false;
  var heightTransitionHandler = null;

  // Interrupting the height transition mid-flight (close before open
  // finishes, or vice versa) cancels it without ever firing "transitionend",
  // so the listener openNav() attached never got to remove itself — repeated
  // rapid toggling stacked up listeners. Tracking the handler here lets both
  // open/close clear any still-pending one before attaching a new one, so at
  // most one is ever attached.
  function clearHeightTransitionHandler() {
    if (heightTransitionHandler) {
      panel.removeEventListener("transitionend", heightTransitionHandler);
      heightTransitionHandler = null;
    }
  }

  function setInert(el, on) {
    if (!el) return;
    if (on) {
      el.setAttribute("aria-hidden", "true");
      el.setAttribute("inert", "");
    } else {
      el.removeAttribute("aria-hidden");
      el.removeAttribute("inert");
    }
  }

  function setExpandedAttr(value) {
    if (openBtn) openBtn.setAttribute("aria-expanded", value);
    if (closeBtn) closeBtn.setAttribute("aria-expanded", value);
  }

  function openNav() {
    if (!panel || expanded) return;
    expanded = true;
    setInert(panel, false);
    setInert(closedHeader, true);
    setExpandedAttr("true");

    clearHeightTransitionHandler();

    if (reduceMotion) {
      panel.style.height = "auto";
      panel.style.overflow = "visible";
    } else {
      var target = panel.scrollHeight;
      panel.style.height = target + "px";
      heightTransitionHandler = function onEnd(e) {
        if (e.propertyName !== "height") return;
        clearHeightTransitionHandler();
        if (expanded) {
          panel.style.height = "auto";
          // Only needed to keep the height animation itself from showing an
          // overflow flash — once open, absolutely-positioned popups inside
          // (the language switcher dropdown) must be able to extend past the
          // panel's own box instead of being clipped by it.
          panel.style.overflow = "visible";
        }
      };
      panel.addEventListener("transitionend", heightTransitionHandler);
    }

    window.setTimeout(function () {
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    }, 0);
  }

  function closeNav() {
    if (!panel || !expanded) return;
    expanded = false;
    setInert(panel, true);
    setInert(closedHeader, false);
    setExpandedAttr("false");

    clearHeightTransitionHandler();
    panel.style.overflow = "hidden"; // re-clip before collapsing back down

    if (reduceMotion) {
      panel.style.height = "0.5rem";
    } else {
      var current = panel.getBoundingClientRect().height;
      panel.style.height = current + "px";
      void panel.offsetHeight; // force reflow so the browser has a starting point to animate from
      panel.style.height = "0.5rem";
    }

    window.setTimeout(function () {
      if (openBtn) openBtn.focus({ preventScroll: true });
    }, 0);
  }

  if (openBtn) openBtn.addEventListener("click", openNav);
  if (closeBtn) closeBtn.addEventListener("click", closeNav);

  // Source (RootLayout.jsx): a single global click listener collapses the panel
  // only when the clicked link's href resolves to the CURRENT page URL — not
  // "any link inside the panel". For real cross-page links the browser just
  // navigates away and the panel resets on load anyway; this only matters for
  // a link back to the page you're already on (e.g. clicking a social icon
  // does NOT close the panel, matching source).
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (a && a.href === window.location.href) closeNav();
  });

  // Escape-to-close: not present in source, added as a harmless a11y affordance
  // (does not change any default/rendered behaviour).
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && expanded) closeNav();
  });
})();
