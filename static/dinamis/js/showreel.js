(function () {
  "use strict";
  var facade = document.querySelector(".showreel-facade");
  if (!facade) return;

  facade.addEventListener("click", function () {
    var iframe = document.createElement("iframe");
    iframe.className = "h-full w-full";
    iframe.src = facade.getAttribute("data-embed-src");
    iframe.title = facade.getAttribute("data-embed-title") || "";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);
  });
})();
