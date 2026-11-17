(function () {
  "use strict";

  var switchers = document.querySelectorAll(".lang-switcher");
  if (!switchers.length) return;

  function closeSwitcher(switcher) {
    var dropdown = switcher.querySelector(".lang-dropdown");
    var btn = switcher.querySelector(".lang-toggle-btn");
    if (dropdown) dropdown.classList.remove("is-open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function closeAll(except) {
    switchers.forEach(function (switcher) {
      if (switcher !== except) closeSwitcher(switcher);
    });
  }

  switchers.forEach(function (switcher) {
    var btn = switcher.querySelector(".lang-toggle-btn");
    var dropdown = switcher.querySelector(".lang-dropdown");
    if (!btn || !dropdown) return;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains("is-open");
      closeAll();
      if (!isOpen) {
        dropdown.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", function (e) {
    switchers.forEach(function (switcher) {
      if (!switcher.contains(e.target)) closeSwitcher(switcher);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll();
  });
})();
