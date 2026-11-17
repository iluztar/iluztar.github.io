(function () {
  "use strict";

  var overlay = document.getElementById("search-overlay");
  if (!overlay) return;

  var input = document.getElementById("search-input");
  var meta = document.getElementById("search-meta");
  var resultsEl = document.getElementById("search-results");
  var emptyEl = document.getElementById("search-empty");
  var openBtns = document.querySelectorAll(".search-open-btn");
  var closeBtn = document.getElementById("search-close-btn");
  var clearBtn = document.getElementById("search-clear-btn");
  var apiBase = window.ILUZTAR_API_BASE || "/api/";
  var debounceTimer = null;
  var currentRequest = 0;

  function open() {
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    updateClearBtn();
    window.setTimeout(function () {
      input.focus();
    }, 0);
  }

  function close() {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", open);
  });
  if (closeBtn) closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      overlay.classList.contains("hidden") ? open() : close();
    } else if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
      close();
    }
  });

  // Built via DOM methods, not innerHTML — result titles/meta come from the
  // database and get inserted as text, never parsed as markup.
  function renderResults(results) {
    resultsEl.textContent = "";
    if (!results.length) {
      emptyEl.classList.remove("hidden");
      return;
    }
    emptyEl.classList.add("hidden");
    results.forEach(function (r) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = r.url;
      a.className = "flex items-center gap-x-4 rounded-2xl px-3 transition hover:bg-neutral-100";
      a.style.paddingTop = "0.75rem";
      a.style.paddingBottom = "0.75rem";

      var thumbWrap = document.createElement("span");
      thumbWrap.className = "flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-xl bg-neutral-100";
      if (r.image) {
        var img = document.createElement("img");
        img.src = r.image;
        img.alt = "";
        img.loading = "lazy";
        img.className = "h-full w-full object-cover";
        thumbWrap.appendChild(img);
      } else {
        var placeholder = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        placeholder.setAttribute("viewBox", "0 0 20 20");
        placeholder.setAttribute("class", "h-5 w-5");
        placeholder.style.fill = "#d4d4d4";
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill-rule", "evenodd");
        path.setAttribute("d", "M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l3.5-4.5 2.5 3L13.5 9 16 15z");
        path.setAttribute("clip-rule", "evenodd");
        placeholder.appendChild(path);
        thumbWrap.appendChild(placeholder);
      }

      var textWrap = document.createElement("span");
      textWrap.className = "min-w-0 flex-auto";

      var left = document.createElement("span");
      left.className = "block truncate text-sm font-semibold text-neutral-950";
      left.style.whiteSpace = "nowrap";
      left.textContent = r.title;

      var right = document.createElement("span");
      right.className = "block text-xs uppercase tracking-wider text-neutral-400";
      right.style.marginTop = "0.125rem";
      right.textContent = (r.type === "blog" ? "Blog" : "Work") + " · " + r.meta;

      textWrap.appendChild(left);
      textWrap.appendChild(right);
      a.appendChild(thumbWrap);
      a.appendChild(textWrap);
      li.appendChild(a);
      resultsEl.appendChild(li);
    });
  }

  function updateClearBtn() {
    if (!clearBtn) return;
    clearBtn.classList.toggle("hidden", input.value.length === 0);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      input.value = "";
      updateClearBtn();
      resultsEl.textContent = "";
      emptyEl.classList.add("hidden");
      meta.classList.remove("hidden");
      input.focus();
    });
  }

  input.addEventListener("input", function () {
    var q = input.value.trim();
    window.clearTimeout(debounceTimer);
    updateClearBtn();

    if (q.length < 2) {
      resultsEl.textContent = "";
      emptyEl.classList.add("hidden");
      meta.classList.remove("hidden");
      return;
    }

    debounceTimer = window.setTimeout(function () {
      var requestId = ++currentRequest;
      meta.classList.add("hidden");
      fetch(apiBase + "search.php?q=" + encodeURIComponent(q))
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (requestId !== currentRequest) return; // a newer keystroke already superseded this request
          renderResults((data && data.results) || []);
        })
        .catch(function () {
          if (requestId !== currentRequest) return;
          renderResults([]);
        });
    }, 250);
  });
})();
