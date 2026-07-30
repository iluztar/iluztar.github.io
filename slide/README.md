# Sidang Skripsi — Company Profile Digital ILUZTAR

Presentasi sidang skripsi *"Pengembangan Company Profile Digital Studio Kreatif ILUZTAR dengan Menggunakan Motion Graphic sebagai Media Promosi"* — Muhammad Qoid Mushoddaq (NPM 1911010047), Teknik Informatika, IIB Darmajaya, 2026.

Dek presentasi berbasis HTML murni (bukan slideshow konvensional): 32 slide dengan kanvas tetap 1920×1080, animasi masuk per elemen (GSAP), transisi antar-slide yang mulus, serta chart yang teranimasi otomatis saat tampil.

**Live:** akan tersedia di `iluztar.github.io/slide/` dan `iluztar.com/slide/` setelah diunggah.

## Buka Presentasi

Buka `index.html` langsung di browser (Chrome/Edge/Brave/Safari terbaru). Tidak perlu server atau instalasi apa pun.

## Kontrol

| Aksi | Cara |
|---|---|
| Slide berikutnya / sebelumnya | `→` `←`, scroll, atau swipe layar/cursor |
| Lompat ke slide tertentu | Klik nomor halaman di capsule bawah, lalu ketik angkanya |
| Buka menu navigasi & pencarian | `M`, atau klik tombol "Menu" |
| Reset ke slide pertama | `R` |
| Layar penuh | `F`, atau klik ikon di capsule bawah |
| Sembunyikan semua kontrol | `H` |
| Cetak / simpan sebagai PDF | `Ctrl+P` — otomatis satu halaman lanskap 1920×1080 per slide |

Di perangkat mobile, presentasi meminta perangkat diputar ke posisi lanskap (16:9) agar tampilan tetap optimal.

## Struktur Folder

```
slide/
├── index.html          — markup 32 slide
├── css/
│   ├── base.css        — variabel warna, reset, skala tipografi
│   ├── layout.css      — sistem grid/tile, tabel, chart, media placeholder
│   ├── navigation.css  — menu navigasi & capsule kontrol bawah
│   ├── mobile.css      — gerbang "putar ke lanskap" untuk perangkat sentuh
│   └── print.css       — aturan cetak/ekspor PDF
├── js/
│   └── script.js       — seluruh logika interaksi & animasi
└── img/                — logo kampus & jurusan
```

## Teknologi

Vanilla HTML/CSS/JS — tanpa build step, tanpa dependency yang perlu diinstal. Animasi memakai [GSAP](https://gsap.com/) + CustomEase (transisi slide, reveal elemen) dan [Lenis](https://lenis.darkroom.engineering/) (smooth-scroll pada panel navigasi), keduanya dimuat dari CDN.

## Sumber

Seluruh materi dan data (statistik validasi, kutipan teori, dsb.) mengikuti naskah skripsi asli.

---

**ILUZTAR Creative Studio** — *Shine Through Art*
