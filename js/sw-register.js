/**
 * sw-register.js — Registrasi Service Worker
 * Taruh di: ./js/sw-register.js
 * Tambahkan ke index.html tepat sebelum </body>:
 *   <script src="./js/sw-register.js"></script>
 *
 * CATATAN PENTING untuk deploy:
 *   Setiap kali ada perubahan file CSS/JS/HTML, ganti CACHE_VERSION
 *   di sw.js (v1 → v2 → v3, dst.) agar browser semua user
 *   otomatis mendapatkan versi terbaru.
 */

(function () {
    'use strict';

    if (!('serviceWorker' in navigator)) return; // browser lama, skip

    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./sw.js', { scope: './' })
            .then(registration => {
                // Cek apakah ada SW baru yang menunggu (versi baru tersedia)
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener('statechange', () => {
                        // SW baru sudah installed & siap — reload untuk aktifkan
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // SW baru siap, reload halaman sekali untuk pakai versi terbaru
                            navigator.serviceWorker.addEventListener('controllerchange', () => {
                                window.location.reload();
                            });
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        }
                    });
                });
            })
            .catch(err => {
                // Gagal register SW — tidak masalah, site tetap jalan normal
                console.warn('SW registration failed:', err);
            });
    });
})();
