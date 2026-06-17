/**
 * sw.js — Service Worker Cache Busting
 * Strategi: Network First untuk semua asset.
 * Setiap deploy, ubah CACHE_VERSION → browser otomatis hapus cache lama dan ambil fresh.
 *
 * Cara kerja:
 * - Setiap request coba ambil dari network dulu (selalu fresh).
 * - Kalau network gagal (offline), fallback ke cache.
 * - Cache lama dihapus otomatis saat versi berubah.
 */

const CACHE_VERSION = 'v1'; // ← ganti ini setiap deploy (v2, v3, dst.)
const CACHE_NAME    = `iluztar-${CACHE_VERSION}`;

// Asset yang ingin di-cache untuk offline fallback
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './css/main.css',
    './css/07-sidebar.css',
    './js/script.js'
];

// ─── Install: pre-cache asset penting ───────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting()) // aktifkan SW baru langsung tanpa tunggu tab lama
    );
});

// ─── Activate: hapus semua cache versi lama ──────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key.startsWith('iluztar-') && key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim()) // ambil alih semua tab langsung
    );
});

// ─── Fetch: Network First ─────────────────────────────────────
self.addEventListener('fetch', (event) => {
    // Hanya handle GET, skip non-http (chrome-extension, dll)
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith('http')) return;

    // Jangan intercept request ke CDN eksternal (GSAP, Swiper, Lenis, Google Fonts)
    // agar selalu menggunakan versi CDN terbaru yang mereka cache sendiri
    const url = new URL(event.request.url);
    const isExternal = url.origin !== self.location.origin;
    if (isExternal) return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Hanya cache response yang valid (status 200, bukan opaque)
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                // Clone response karena stream hanya bisa dibaca sekali
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, responseToCache));
                return response;
            })
            .catch(() => {
                // Network gagal → fallback ke cache
                return caches.match(event.request);
            })
    );
});
