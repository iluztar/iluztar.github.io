# ILUZTAR · Proyek Web

Halaman induk proyek web **ILUZTAR**, studio kreatif dari Bandar Lampung (sejak 2023).
Setiap proyek punya repositori sendiri dan tampil sebagai subfolder situs ini lewat GitHub Pages.

🌐 **Live:** https://iluztar.github.io · 📷 Instagram: [@iluztar](https://instagram.com/iluztar) · 🔗 iluztar.com

## Proyek

| Proyek | Alamat | Repositori | Isi |
|---|---|---|---|
| **Motion Reel** | https://iluztar.github.io/motion/ | [iluztar/motion](https://github.com/iluztar/motion) | Video *explainer* yang direkonstruksi menjadi animasi HTML/CSS/GSAP; animasi pembuka *company profile*, beserta aset, data pengujian, dan lampiran skripsi |
| **Latar Sirpeltric** | https://iluztar.github.io/threejs/ | [iluztar/threejs](https://github.com/iluztar/threejs) | Enam latar animasi Three.js bergaya 2D datar |

## Menambah proyek baru

1. Buat repositori publik baru di akun `iluztar`, misalnya `iluztar/nama-proyek`.
2. Aktifkan **Settings → Pages → Deploy from a branch → `main` / root**.
   Proyek otomatis tampil di `https://iluztar.github.io/nama-proyek/`.
3. Gunakan **path relatif** di dalam proyek (`gambar/a.png`, bukan `/gambar/a.png`), karena proyek berada di subfolder.
4. Pakai favicon standar ILUZTAR: logo putih di atas petak biru `#0042f8` bersudut bulat (lihat folder [`logo/`](logo)).
5. Tambahkan kartu proyek di [`index.html`](index.html) dan baris di tabel di atas.

## Isi repositori ini

```
iluztar.github.io/
├── index.html   # halaman induk: daftar proyek
├── 404.html     # meneruskan alamat lama Motion Reel (/skripsi/…, /aset/…) ke /motion/…
├── logo/        # logo resmi & favicon standar ILUZTAR
├── vercel.json
└── README.md
```

Sampai 8 November 2026, Motion Reel berada langsung di akar situs ini. Alamat lamanya diteruskan otomatis oleh `404.html`,
dan riwayat pengembangannya tersimpan di [iluztar/motion › skripsi/riwayat-iterasi.md](https://github.com/iluztar/motion/blob/main/skripsi/riwayat-iterasi.md).

## Hak cipta

© 2023–2026 **Iluztar**. Seluruh artwork, logo, dan identitas visual adalah milik Iluztar.
