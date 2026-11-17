(function () {
  "use strict";

  var picker = document.getElementById("testimonial-picker");
  if (!picker) return;

  var figure = document.getElementById("testimonial-figure");
  var quoteEl = document.getElementById("testimonial-quote");
  var nameEl = document.getElementById("testimonial-name");
  var roleEl = document.getElementById("testimonial-role");
  var avatarWrap = document.getElementById("testimonial-avatar-wrap");
  var socialLinkEl = document.getElementById("testimonial-social-link");
  var showMoreBtn = document.getElementById("testimonial-show-more");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Auto-rotation only cycles through what's actually visible — items still
  // behind "Show more" join the cycle once revealed, not before (rotating to
  // a hidden testimonial would change the quote with no highlighted trigger
  // visible in the grid to explain why).
  function getTriggers() {
    return Array.prototype.filter.call(picker.querySelectorAll(".testimonial-trigger"), function (t) {
      return !t.closest("[data-testimonial-extra]") || !t.closest("[data-testimonial-extra]").classList.contains("hidden");
    });
  }
  var triggers = getTriggers();

  // Built via DOM methods (not innerHTML string concatenation) so nothing in
  // the data — even if it ever contained HTML-like text — gets parsed as markup.
  function renderAvatar(src, name, initial) {
    avatarWrap.textContent = "";
    if (src) {
      var img = document.createElement("img");
      img.src = src;
      img.alt = name;
      img.className = "h-12 w-12 rounded-full object-cover";
      avatarWrap.appendChild(img);
    } else {
      var span = document.createElement("span");
      span.className = "flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-white font-display";
      span.textContent = initial || "?";
      avatarWrap.appendChild(span);
    }
  }

  var AUTO_ROTATE_MS = 6000;
  var autoTimer = null;

  function activate(trigger) {
    triggers.forEach(function (t) {
      t.classList.toggle("is-active", t === trigger);
      t.setAttribute("aria-pressed", t === trigger ? "true" : "false");
    });

    var apply = function () {
      quoteEl.textContent = "“" + trigger.dataset.quote + "”";
      nameEl.textContent = trigger.dataset.name;
      roleEl.textContent = trigger.dataset.role || "";
      renderAvatar(trigger.dataset.avatar, trigger.dataset.name, trigger.dataset.initial);
      if (socialLinkEl) {
        var link = trigger.dataset.socialLink || "";
        var arrowEl = document.getElementById("testimonial-social-arrow");
        if (link) {
          socialLinkEl.href = link;
          socialLinkEl.target = "_blank";
          socialLinkEl.rel = "noopener noreferrer";
          if (arrowEl) arrowEl.style.display = "";
        } else {
          socialLinkEl.removeAttribute("href");
          socialLinkEl.removeAttribute("target");
          socialLinkEl.removeAttribute("rel");
          if (arrowEl) arrowEl.style.display = "none";
        }
      }
    };

    if (reduceMotion || !figure) {
      apply();
    } else {
      figure.style.opacity = "0";
      window.setTimeout(function () {
        apply();
        figure.style.opacity = "1";
      }, 200);
    }

    scheduleAutoRotate();
  }

  // Auto-advance every few seconds; any manual click reschedules from there
  // (activate() calls this too) so it doesn't fight the visitor's own choice.
  // Skipped under prefers-reduced-motion — auto-changing content is exactly
  // the kind of motion that setting asks sites to avoid.
  function scheduleAutoRotate() {
    if (reduceMotion || triggers.length < 2) return;
    window.clearTimeout(autoTimer);
    autoTimer = window.setTimeout(function () {
      var current = picker.querySelector(".testimonial-trigger.is-active") || triggers[0];
      var idx = Array.prototype.indexOf.call(triggers, current);
      activate(triggers[(idx + 1) % triggers.length]);
    }, AUTO_ROTATE_MS);
  }

  // Click listeners go on every trigger, including ones still hidden behind
  // "Show more" — they become clickable the moment their <li> is revealed.
  picker.querySelectorAll(".testimonial-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      if (trigger.classList.contains("is-active")) return;
      if (!triggers.includes(trigger)) triggers = getTriggers();
      activate(trigger);
    });
  });

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", function () {
      picker.querySelectorAll("[data-testimonial-extra]").forEach(function (li) {
        li.classList.remove("hidden");
      });
      triggers = getTriggers();
      var wrap = document.getElementById("testimonial-show-more-wrap");
      if (wrap) wrap.remove();
    });
  }

  scheduleAutoRotate();
})();

// ---------------- public testimonial submission modal ----------------
(function () {
  "use strict";

  var overlay = document.getElementById("testimonial-overlay");
  var addBtn = document.getElementById("testimonial-add-btn");
  if (!overlay || !addBtn) return;

  var closeBtn = document.getElementById("testimonial-close-btn");
  var successCloseBtn = document.getElementById("testimonial-success-close-btn");
  var formView = document.getElementById("testimonial-form-view");
  var successView = document.getElementById("testimonial-success-view");
  var form = document.getElementById("testimonial-form");
  var errorBox = form ? form.querySelector("[data-testimonial-error]") : null;
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  function open() {
    if (formView) formView.classList.remove("hidden");
    if (successView) successView.classList.add("hidden");
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  addBtn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (successCloseBtn) successCloseBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) close();
  });

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (errorBox) { errorBox.textContent = ""; errorBox.classList.add("hidden"); }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add("opacity-50"); }

    var apiBase = window.ILUZTAR_API_BASE || "/api/";
    fetch(apiBase + "testimonial-submit.php", {
      method: "POST",
      body: new FormData(form),
    })
      .then(function (res) { return res.json().then(function (json) { return { status: res.status, json: json }; }); })
      .then(function (result) {
        if (result.json && result.json.ok) {
          form.reset();
          if (formView) formView.classList.add("hidden");
          if (successView) successView.classList.remove("hidden");
        } else if (errorBox) {
          errorBox.textContent = (result.json && result.json.msg) || "Something went wrong. Please try again.";
          errorBox.classList.remove("hidden");
        }
      })
      .catch(function () {
        if (errorBox) {
          errorBox.textContent = "Network error — please check your connection and try again.";
          errorBox.classList.remove("hidden");
        }
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove("opacity-50"); }
      });
  });
})();
