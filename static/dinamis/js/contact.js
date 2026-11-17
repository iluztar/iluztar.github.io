(function () {
  "use strict";

  var overlay = document.getElementById("contact-overlay");
  if (!overlay) return;

  var openBtns = document.querySelectorAll(".contact-open-btn");
  var closeBtn = document.getElementById("contact-close-btn");
  var choiceView = document.getElementById("contact-choice-view");
  var waView = document.getElementById("contact-wa-view");
  var waChooseBtn = document.getElementById("contact-choose-wa");
  var waBackBtn = document.getElementById("contact-wa-back");

  function open() {
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    showChoiceView();
  }

  function close() {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showChoiceView() {
    if (choiceView) choiceView.classList.remove("hidden");
    if (waView) waView.classList.add("hidden");
  }

  function showWaView() {
    if (choiceView) choiceView.classList.add("hidden");
    if (waView) {
      waView.classList.remove("hidden");
      var msgEl = document.getElementById("wa-message");
      if (msgEl) window.setTimeout(function () { msgEl.focus(); }, 0);
    }
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", open);
  });
  if (closeBtn) closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) close();
  });

  if (waChooseBtn) waChooseBtn.addEventListener("click", showWaView);
  if (waBackBtn) waBackBtn.addEventListener("click", showChoiceView);

  // ---- WhatsApp compose (custom message before sending) ----
  var msgEl = document.getElementById("wa-message");
  var sendLink = document.getElementById("wa-send");
  if (!msgEl || !sendLink) return;

  var honeypot = document.getElementById("wa-honeypot");
  var warning = document.getElementById("wa-throttle-warning");
  var b64 = window.ILUZTAR_WA_B64 || "";
  var number = b64 ? atob(b64).split("").reverse().join("") : "";
  var THROTTLE_MS = 20000;
  var RATE_KEY = "iluztar-wa-last-sent";

  function updateLink() {
    sendLink.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(msgEl.value);
  }
  msgEl.addEventListener("input", updateLink);

  // Anti-spam: (1) honeypot field bots auto-fill but real visitors never see,
  // (2) per-visitor cooldown between chat opens so a script can't mass-spam
  // wa.me redirects. Both are client-only checks (this is a static wa.me
  // deep link, not a form with a backend to rate-limit server-side).
  sendLink.addEventListener("click", function (e) {
    if (honeypot && honeypot.value !== "") {
      e.preventDefault();
      return;
    }
    var last = parseInt(localStorage.getItem(RATE_KEY) || "0", 10);
    var now = Date.now();
    if (now - last < THROTTLE_MS) {
      e.preventDefault();
      if (warning) {
        warning.classList.remove("hidden");
        window.setTimeout(function () { warning.classList.add("hidden"); }, 3000);
      }
      return;
    }
    localStorage.setItem(RATE_KEY, String(now));
    updateLink();
  });
  updateLink();
})();
