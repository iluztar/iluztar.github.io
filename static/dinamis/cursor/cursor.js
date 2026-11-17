(function() {
    var mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mql.matches) return;
    var CANDIDATES = {
        blue: {
            hex: "#0042f8",
            rgb: [ 0, 66, 248 ]
        },
        white: {
            hex: "#ffffff",
            rgb: [ 255, 255, 255 ]
        },
        black: {
            hex: "#101114",
            rgb: [ 16, 17, 20 ]
        }
    };
    var SIZE = 24;
    var HOTSPOT_FRAC_X = 1245 / 2900;
    var HOTSPOT_FRAC_Y = 755 / 2900;
    function srgbToLinear(c) {
        c /= 255;
        return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
    }
    function relativeLuminance(rgb) {
        return .2126 * srgbToLinear(rgb[0]) + .7152 * srgbToLinear(rgb[1]) + .0722 * srgbToLinear(rgb[2]);
    }
    function contrastRatio(a, b) {
        var lA = relativeLuminance(a), lB = relativeLuminance(b);
        var lighter = Math.max(lA, lB), darker = Math.min(lA, lB);
        return (lighter + .05) / (darker + .05);
    }
    function parseColor(str) {
        var m = str.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        var parts = m[1].split(",").map(function(s) {
            return parseFloat(s);
        });
        var a = parts[3] === undefined ? 1 : parts[3];
        if (a === 0) return null;
        return [ parts[0], parts[1], parts[2], a ];
    }
    function getBackgroundRGB(el) {
        var layers = [];
        var node = el;
        while (node) {
            var rgba = parseColor(getComputedStyle(node).backgroundColor);
            if (rgba) {
                layers.push(rgba);
                if (rgba[3] >= 1) break;
            }
            node = node.parentElement;
        }
        var result = [ 244, 246, 251 ];
        for (var i = layers.length - 1; i >= 0; i--) {
            var r = layers[i][0], g = layers[i][1], b = layers[i][2], a = layers[i][3];
            result = [ r * a + result[0] * (1 - a), g * a + result[1] * (1 - a), b * a + result[2] * (1 - a) ];
        }
        return result;
    }
    var lastColorKey = "blue";
    function pickCursorColorKey(bgRGB) {
        var ratios = {};
        for (var key in CANDIDATES) ratios[key] = contrastRatio(bgRGB, CANDIDATES[key].rgb);
        var blueThreshold = lastColorKey === "blue" ? 3 : 3.6;
        if (ratios.blue >= blueThreshold) return "blue";
        return ratios.white >= ratios.black ? "white" : "black";
    }
    function init() {
        var cursor = document.createElement("div");
        cursor.id = "ilz-cursor";
        cursor.setAttribute("aria-hidden", "true");
        cursor.innerHTML = '<svg viewBox="550 550 2900 2900" xmlns="http://www.w3.org/2000/svg">' + '<g class="shapeA"><path d="M2597.5 819.1 1269 1002.75c-66.87 10.92-129.84 43.94-177.63 91.88-47.95 47.92-80.35 111.08-91.28 177.99L815.13 2617.09c-13.315 142.852 89.42 228.213 180.21 319.27l685.02-687.55c84.49-100.39 95.23-253.01 30.27-366.29-135.4-178.02-281.19-349.01-420.85-524.12-39.29-42.36 26.61-104.55 66.19-63.67 181.89 140.81 351.8 298.85 541.11 428.97 112.87 56.32 259.08 39.22 354.05-44.48l684.98-684c-143.23-186.86-289.49-179.68-338.61-176.12Z"/></g>' + '<g class="shapeB"><path d="M1402.5 3180.9L2731 2997.25c66.87-10.92 129.84-43.94 177.63-91.88 47.95-47.92 80.35-111.08 91.28-177.99l184.96-1344.47c13.315-142.852-89.42-228.213-180.21-319.27l-685.02 687.55c-84.49 100.39-95.23 253.01-30.27 366.29 135.4 178.02 281.19 349.01 420.85 524.12 39.29 42.36-26.61 104.55-66.19 63.67-181.89-140.81-351.8-298.85-541.11-428.97-112.87-56.32-259.08-39.22-354.05 44.48l-684.98 684c143.23 186.86 289.49 179.68 338.61 176.12Z"/></g>' + "</svg>";
        document.body.appendChild(cursor);
        document.body.classList.add("ilz-cursor-active");
        var lastX = 0, lastY = 0, ticking = false;
        function moveCursor(x, y) {
            cursor.style.transform = "translate(" + (x - HOTSPOT_FRAC_X * SIZE) + "px, " + (y - HOTSPOT_FRAC_Y * SIZE) + "px)";
        }
        function updateCursorColor(x, y) {
            cursor.style.display = "none";
            var el = document.elementFromPoint(x, y);
            cursor.style.display = "";
            if (!el) return;
            // #nav-closed-header floats via position:absolute over the white
            // content card below it — that card is a DOM *sibling*, not an
            // ancestor, so walking up the real DOM tree for a background
            // (getBackgroundRGB) skips right past it to <html>'s own brand-blue
            // background and wrongly concludes it needs a white cursor to
            // contrast against blue, even though on screen it's sitting on
            // white. Short-circuit with the known light backdrop instead.
            var key = el.closest && el.closest("video, .showreel") ? "blue"
                : el.closest && el.closest("#nav-closed-header") ? pickCursorColorKey([ 255, 255, 255 ])
                : pickCursorColorKey(getBackgroundRGB(el));
            lastColorKey = key;
            cursor.style.setProperty("--cursor-fill", CANDIDATES[key].hex);
        }
        window.addEventListener("mousemove", function(e) {
            lastX = e.clientX;
            lastY = e.clientY;
            moveCursor(lastX, lastY);
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(function() {
                    updateCursorColor(lastX, lastY);
                    ticking = false;
                });
            }
        });
        window.addEventListener("mouseleave", function() {
            cursor.style.transform = "translate(-1000px, -1000px)";
        });
        document.addEventListener("dragstart", function() {
            cursor.classList.add("is-dragging");
        });
        document.addEventListener("dragend", function() {
            cursor.classList.remove("is-dragging");
        });
        document.querySelectorAll("iframe").forEach(function(frame) {
            frame.addEventListener("mouseenter", function() {
                cursor.classList.add("ilz-cursor-hidden");
            });
            frame.addEventListener("mouseleave", function() {
                cursor.classList.remove("ilz-cursor-hidden");
            });
        });
        if (mql.addEventListener) {
            mql.addEventListener("change", function(e) {
                if (!e.matches) {
                    cursor.remove();
                    document.body.classList.remove("ilz-cursor-active");
                }
            });
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();