# Iluztar Motion Reel

Reel perkenalan interaktif untuk **Iluztar**, studio kreatif asal Bandar Lampung, Indonesia (sejak 2023).
Reel ini adalah halaman web berisi animasi berdurasi ±71 detik. Semua gerakannya dibangun dengan HTML, CSS, dan
[GSAP](https://gsap.com), tanpa file video.

🌐 **Live:** https://iluztar.github.io · 📷 Instagram: [@iluztar](https://instagram.com/iluztar) · 🔗 iluztar.com

> **Tentang proyek ini**
>
> Proyek ini dibuat oleh salah satu artist di **ILUZTAR Studio** untuk menuntaskan skripsi berjudul
> ***"Pengembangan Company Profile Digital Studio Kreatif ILUZTAR dengan Menggunakan Motion Graphic sebagai Media Promosi"***
> (Teknik Informatika, IIB Darmajaya).
>
> Caranya: sebuah video *explainer* dibuat manual di **Alight Motion** dengan narasi dari **ElevenLabs**, lalu
> setiap *frame*-nya dianalisis dan direkonstruksi menjadi kode HTML/CSS/GSAP dengan bantuan **Claude AI**.
> Setiap hasil ditinjau pemilik studio sebelum digabungkan (*human-in-the-loop*).
> Repositori ini juga menyimpan **aset, data pengukuran, skrip pengujian, dan lampiran skripsi** agar hasilnya dapat diperiksa dan diulang.

---

## Daftar Isi

- [Latar Belakang Proyek](#latar-belakang-proyek)
- [Isi Repositori untuk Skripsi](#isi-repositori-untuk-skripsi)
- [Mengapa Animasi Kode, Bukan Video Tertanam](#mengapa-animasi-kode-bukan-video-tertanam)
- [Fitur](#fitur)
- [Cara Menonton](#cara-menonton)
- [Alur Cerita (Scene)](#alur-cerita-scene)
- [Elemen yang Bisa Diklik](#elemen-yang-bisa-diklik)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Struktur Proyek](#struktur-proyek)
- [Teknologi](#teknologi)
- [Arsitektur Animasi](#arsitektur-animasi)
- [Panduan Mengedit](#panduan-mengedit)
- [Admin: Edit Kontak, Profil & Media](#admin-edit-kontak-profil--media)
- [Statistik Instagram](#statistik-instagram)
- [Riwayat Pengembangan (Iterasi)](#riwayat-pengembangan-iterasi)
- [Hasil Pengujian](#hasil-pengujian)
- [Mengulang Pengujian](#mengulang-pengujian)
- [Performa & Aksesibilitas](#performa--aksesibilitas)
- [Privasi Data Lampiran](#privasi-data-lampiran)
- [Roadmap](#roadmap)
- [Kredit & Hak Cipta](#kredit--hak-cipta)

---

## Latar Belakang Proyek

| | |
|---|---|
| **Pembuat** | Salah satu artist ILUZTAR Studio |
| **Konteks** | Skripsi Teknik Informatika, IIB Darmajaya |
| **Judul** | *Pengembangan Company Profile Digital Studio Kreatif ILUZTAR dengan Menggunakan Motion Graphic sebagai Media Promosi* |
| **Metode** | *Design Thinking* + siklus iteratif *human-in-the-loop* |
| **Luaran** | (1) animasi pembuka *website* berbasis kode, (2) video *explainer* berbahasa Inggris untuk media sosial |
| **Alat bantu** | Alight Motion (video), ElevenLabs (narasi), Claude AI (analisis *frame* & kode), Playwright + Lighthouse (pengujian) |

**Alur konversi video → website:**

0. **Membuat video *explainer* di Alight Motion.** Narasi bahasa Inggris dihasilkan dengan ElevenLabs. Video menjadi media promosi di media sosial sekaligus acuan *website*.
1. **Analisis video referensi.** Video dipecah per *frame* untuk mencatat setiap *shot*: kapan mulai, arah gerak, dan ukuran objek.
2. **Analisis audio.** Ketukan musik dideteksi (*spectral flux*) supaya gerak kamera melangkah tepat di ketukan (lihat `BEATS`).
3. **Membangun ulang dengan HTML/CSS/GSAP.** Setiap *shot* ditulis sebagai *timeline* animasi, bukan video, sehingga tetap tajam di semua ukuran layar.
4. **Verifikasi.** Hasil dirender dan dibandingkan berdampingan dengan video di detik yang sama, lalu dikoreksi sampai mirip.
5. **Tinjauan pemilik studio.** Setiap putaran perbaikan diajukan sebagai *pull request* dan baru digabungkan setelah ditinjau.
6. **Menjadikannya website.** Elemen dibuat bisa diklik, ditambah panel admin, lalu dipasang sebagai animasi pembuka beranda (`?intro=1`).

## Isi Repositori untuk Skripsi

| Folder / berkas | Isi | Rujukan di naskah |
|---|---|---|
| `index.html`, `config.js` | Kode Motion Reel (versi terbaru, termasuk mode `?intro=1`) | Bab III–IV |
| [`aset/video/`](aset/video) | Salinan video *explainer* referensi (960×540, 71,5 detik, 2,1 MB) | Bab IV, Gambar 4.1–4.2 |
| [`aset/voiceover/`](aset/voiceover) | Naskah narasi dan semua percobaan suara ElevenLabs (Anne, Belle, Clara, Liam, Nichalia, Roger) | Bab III (produksi video) |
| [`skripsi/lampiran/`](skripsi/lampiran) | Lampiran 2–5 per berkas (PDF + DOCX), sudah dianonimkan | Lampiran 2–5 |
| [`skripsi/data-pengukuran/`](skripsi/data-pengukuran) | Data mentah pengujian (JSON) dan laporan Lighthouse (HTML/JSON) | Bab IV, Tabel 4.3–4.6 |
| [`skripsi/riwayat-iterasi.md`](skripsi/riwayat-iterasi.md) | Ekspor riwayat 25 *pull request* dan seluruh *commit* pengembangan | Tabel 4.8 |
| [`skripsi/skrip-pengujian/`](skripsi/skrip-pengujian) | Skrip Playwright untuk uji fungsional, performa, perbandingan situs, dan pengambilan *frame* video | Bab III, subbab 3.3.6 |
| [`MOTION_PLAN.md`](MOTION_PLAN.md) | Tinjauan visual dan rencana perbaikan iterasi pertama | Tabel 4.8, iterasi 1 |

Musik latar dan efek suara **tidak** disertakan: sebagian berasal dari pustaka pihak ketiga (Pixabay, MusicGPT, pustaka Alight Motion) yang lisensinya tidak mengizinkan penyebaran ulang sebagai berkas lepas. Ekspor asli video *explainer* dari Alight Motion (2560×1440, 71,4 detik, ±68 MB) juga tidak disertakan agar repositori tetap ringan; salinan 540p di `aset/video/` sudah cukup untuk melihat dan membandingkan gerakannya.

## Mengapa Animasi Kode, Bukan Video Tertanam

*Website* versi sebelumnya menampilkan video promosi di bagian atas beranda. Pada kuesioner video versi sebelumnya (112 responden, [Lampiran 2](skripsi/lampiran)), 8 responden melaporkan kendala teknis. Sebagian besar berkaitan dengan pemutaran, misalnya *"Awal video tidak ada suara"*, *"tidak ada suara"*, dan *"alangkah baiknya audio langsung muncul tanpa harus klik icon sound terlebih dahulu"*. Dua responden lain menyebut halaman lambat dimuat karena sinyal atau HP.

Penyebabnya adalah kebijakan *autoplay* peramban: video tertanam (berkas MP4 maupun pemutar YouTube) hanya boleh berputar otomatis bila **dibisukan**. Pengunjung harus mengeklik ikon suara, dan pesan yang bergantung pada lirik atau narasi tidak tersampaikan sebelum itu. Pemutar YouTube juga memuat skrip dan tampilan pemutar milik YouTube sebelum video bisa berjalan.

Animasi berbasis kode mengatasi hal ini dengan cara berbeda:

- **Langsung berjalan.** Animasi diputar otomatis begitu halaman siap, tanpa pemutar pihak ketiga dan tanpa klik.
- **Pesan tidak bergantung pada suara.** Narasi tampil sebagai teks animasi, sehingga pesan tetap tersampaikan walaupun audio tidak berbunyi. Mode pembuka sengaja berjalan **tanpa audio**, karena *autoplay* bersuara tetap diblokir peramban, sedangkan versi bersuara tersedia lewat tombol Play dan di video *explainer*.
- **Ringan dan tajam.** Halaman animasi 527 KB, sekitar seperempat salinan video 540p (2,1 MB), dan tetap tajam di layar beresolusi tinggi.
- **Responsif.** Video terkunci pada rasio 16:9 dan resolusinya sendiri, sehingga di ponsel tegak tampil kecil dengan bidang kosong. Animasi kode disusun pada panggung 1600×900 yang diskalakan otomatis (`fit()`), dengan tata letak khusus ponsel, sehingga tetap terbaca di lebar 390 px.
- **Terbaca mesin pencari dan interaktif.** Teks narasi ada di HTML (311 kata terbaca tanpa JavaScript), dan elemennya dapat diklik.

## Fitur

- **Dua cara menonton**, keduanya memakai *timeline* yang sama:
  - **Mode Scroll** (default): animasi bergerak mengikuti gulir, dengan *smooth scrolling* dari Lenis.
  - **Mode Play**: diputar seperti video, layar penuh, dengan kontrol pemutar.
- **Dua versi**: *Full* (±71 detik, 8 scene) dan *Cut* (±30 detik, versi ringkas), masing-masing dengan *soundtrack* sendiri.
- **Mode intro (`?intro=1`)** untuk animasi pembuka beranda (lihat di bawah).
- **Tombol "Play scene"** untuk langsung memutar scene tertentu.
- **Mode gelap / terang**: default terang; tombol bulan/matahari (atau `T`), pilihan disimpan di browser, berganti dengan *View Transitions*.
- **Stage responsif**: kanvas 1600×900 yang diskalakan otomatis ke ukuran layar mana pun.
- **Satu file**: semua kode, gaya, dan gambar bawaan ada di `index.html`.
- **Data dari server ILUZTAR**: gambar, audio, kontak, profil, dan statistik Instagram diambil dari `api/motion.php`. Tanpa API, isi bawaan dipakai.

## Cara Menonton

| Aksi | Cara |
|---|---|
| Menonton sambil scroll | Buka halaman, lalu gulir ke bawah |
| Putar sebagai video | Klik **Play** di bar bawah (pilih dulu *Full · 71s* atau *Cut · 30s*) |
| Putar dari scene saat ini | Klik **▶ Play scene** di pojok kanan atas |

**Pintasan keyboard (mode Play):**

| Tombol | Fungsi |
|---|---|
| `Space` | Play / Pause |
| `→` / `←` | Scene berikutnya / sebelumnya |
| `H` | Sembunyikan / tampilkan kontrol |
| `Esc` | Keluar, lalu kembali ke mode scroll di frame terakhir |
| `T` | Ganti tema gelap / terang (berlaku juga di mode scroll) |

Kontrol dan kursor otomatis tersembunyi setelah 2,2 detik tanpa input. Klik *progress bar* untuk melompat ke waktu tertentu.

### Mode intro (`?intro=1`): animasi pembuka beranda

Sejak 8 November 2026, reel dipakai sebagai **animasi pembuka** di beranda situs ILUZTAR.

- Beranda memuat reel dengan `?intro=1` di dalam `iframe` (asal yang sama). Reel langsung memutar versi **Cut 30 detik**, tanpa layar penuh, tanpa audio, dan tanpa bar/kontrol/petunjuk gulir.
- Reel memberi tahu halaman induk lewat `postMessage({ iluztarReel: 'siap' | 'selesai' })`. Induk menyembunyikan *loader* saat `siap`, lalu menutup lapisan pembuka saat `selesai`.
- Di beranda: diputar sekali per sesi (`sessionStorage 'ilz-intro'`), bisa dilewati dengan tombol **Lewati** atau `Esc`, dan langsung ke halaman utama bila `prefers-reduced-motion` aktif atau `?intro=0`. *Loader* yang macet 10 detik langsung diteruskan ke halaman utama.
- Tanpa `?intro=1`, perilaku reel tidak berubah.

## Alur Cerita (Scene)

| # | Scene | Mulai | Isi |
|---|---|---|---|
| 01 | Intro | 0:00 | "This is Iluztar" → "A creative studio" (galeri artwork) → Bandar Lampung, Indonesia → jaringan artist → kalender "Since 2023" |
| 02 | The problem | 0:11 | Chat "Got a project that's growing faster than you can handle?" → timer (deadline) → sketsa belum selesai → "Plate.file" |
| 03 | We got you | 0:20 | "We got you." |
| 04 | Services | 0:21 | Kartu *Full-Commission* & *Pair of Hands* → tahap Sketch / Line-art / Base Color → "We've got you covered!" |
| 05 | Same care | 0:30 | *Big Project* vs *Single Task* → checklist *Care, Precision, Attention to detail* |
| 06 | You & we | 0:39 | "You keep the vision" → file-file menyatu jadi toggle "Refine" → "I want a Website!" menjadi situs |
| 07 | Ownership | 0:49 | "And every piece stays true to your style" → panah bergelombang → "Your Ownership" |
| 08 | Let's talk | 0:58 | Chat CTA → profil Instagram → iluztar.com → logo penutup |

Versi *Cut* memakai scene 1–3, lalu langsung ke scene 8 (tanpa bagian chat).

## Elemen yang Bisa Diklik

| Elemen | Aksi |
|---|---|
| Artwork galeri, lembar sketsa, gambar postingan | Dibuka besar (lightbox). Film otomatis dijeda, lalu lanjut saat ditutup (klik / `Esc`) |
| "Bandar Lampung, Indonesia" | Google Maps |
| Checklist di kartu Full-Commission (boleh pilih beberapa) / Pair of Hands (pilih satu) | Memilih tahap yang ingin dipesan |
| Tombol **Order** di kartu layanan | Membuka WhatsApp dengan pesan berisi layanan + tahap yang dicentang. Kalau tujuannya email, pesan masuk ke subjek/isi email; kalau DM Instagram, pesan disalin otomatis |
| Folder Big Project / Single Task, **Build it!** | WhatsApp bila nomornya diisi, selain itu DM Instagram (bisa diatur di admin) |
| Header postingan, nama & tombol **Follow** di profil | Profil Instagram @iluztar |
| **Message** | DM Instagram |
| **Contact** | WhatsApp → email → website → DM (bisa diatur di admin) |
| "iluztar.com" | Website |
| Logo penutup | Putar ulang dari awal |

Setiap elemen menyebut tujuannya lewat `data-link` (`ig`, `dm`, `contact`, `order`, `web`, `map`); alamatnya dihitung dari pengaturan Kontak.

## Menjalankan Secara Lokal

Tidak perlu proses *build*. Cukup jalankan server statis apa saja:

```bash
git clone https://github.com/iluztar/iluztar.github.io.git
cd iluztar.github.io

# pilih salah satu
python3 -m http.server 8000
npx serve .
```

Lalu buka http://localhost:8000. Tambahkan `?intro=1` untuk melihat mode pembuka.

> Halaman memuat GSAP, Lenis, dan font DM Sans dari CDN, jadi **koneksi internet diperlukan**.
> Di GitHub Pages dan saat dijalankan lokal, `api/motion.php` tidak tersedia, sehingga reel memakai gambar, teks, dan kontak bawaan.
> Data dari admin hanya muncul pada versi yang di-*hosting* di server ILUZTAR.

## Struktur Proyek

```
iluztar.github.io/
├── index.html        # seluruh reel: HTML scene, CSS, gambar bawaan (base64), dan JavaScript timeline
├── config.js         # alamat API data reel & panel admin di server ILUZTAR (relatif dari dev/motion/)
├── MOTION_PLAN.md    # tinjauan visual & rencana perbaikan (iterasi 1)
├── favicon.ico, favicon.svg, favicon-32.png, apple-touch-icon.png
├── vercel.json       # deploy Vercel hanya dari cabang main
├── aset/
│   ├── video/        # video explainer referensi (540p)
│   └── voiceover/    # naskah + percobaan narasi ElevenLabs
├── skripsi/
│   ├── lampiran/           # Lampiran 2–5 (PDF + DOCX, anonim)
│   ├── riwayat-iterasi.md  # ekspor 25 PR + seluruh commit (bukti Tabel 4.8)
│   ├── data-pengukuran/    # JSON hasil uji + laporan Lighthouse
│   └── skrip-pengujian/    # skrip Playwright (Node.js)
└── README.md
```

Isi `index.html`, dari atas ke bawah:

1. **`<style>`**: token warna (`--blue`, `--canvas`, …), stage, gaya tiap scene (S1–S8), kontrol pemutar, mode scroll, dan mode intro.
2. **SVG `<defs>`**: simbol yang dipakai ulang (logo `#lgp`, ikon, folder, dan lain-lain).
3. **`<main id="film">`**: delapan `<section class="scene">`, masing-masing berisi beberapa `.layer` (*shot*) dan teks narasi `.vo`.
4. **Kontrol**: `#bar` (Play, pilihan versi) dan `#ctrl` (pemutar).
5. **`<script>`**: persiapan DOM, *motion tokens*, helper animasi, fungsi `S1()`–`S8()`, pemutar, mode scroll, dan pemuatan data dari API.

## Teknologi

| Library | Versi | Fungsi |
|---|---|---|
| [GSAP](https://gsap.com) | 3.12.5 | Mesin animasi & *timeline* |
| ScrollTrigger | 3.12.5 | Menghubungkan gulir ke *timeline* |
| [Lenis](https://lenis.darkroom.engineering) | 1.1.13 | *Smooth scrolling* |
| DM Sans (Google Fonts) | – | Tipografi |
| PHP + MySQL (server ILUZTAR) | – | Data reel dan panel admin |

## Arsitektur Animasi

**Satu *timeline*, dua pengendali.** `build()` menyusun satu `gsap.timeline` untuk seluruh film.
Mode Play menjalankannya dengan jam (atau `audio.currentTime` bila ada audio).
Mode Scroll men-*scrub* *timeline* yang sama lewat ScrollTrigger: 1 detik film = 280 px gulir (`PX_PER_SEC`),
dan 1,3 detik pertama diputar otomatis saat halaman dibuka.

**Stage tetap, skala dinamis.** Semua posisi ditulis dalam koordinat 1600×900 di dalam `.fit`.
`fit()` menghitung variabel CSS `--s` agar stage selalu pas di layar.

**Bahasa gerak** (objek `E`) mengikuti video referensi: tenang dan presisi, tanpa pantulan atau goyangan.
Elemen masuk cepat lalu berhenti bersih (`power3.out`), perpindahan memakai `power2.inOut`, dan "hidup"-nya
datang dari kamera yang terus bergeser pelan (`drift`) serta bentuk yang berubah menjadi bentuk berikutnya (*match cut*).

**Mengikuti ketukan.** Gerak kamera yang pelan maju bertahap tepat di ketukan musik referensi lalu diam di antaranya.
Daftar ketukan ada di konstanta `BEATS` (diekstrak dengan analisis *spectral flux*), dan fungsi *easing*
`bE(start, durasi, {beats, w})` membagi satu gerakan menjadi langkah-langkah di ketukan itu.

**Latar**: satu kanvas bersama (`#gbg`) dengan gradien radial lembut dan grid yang memudar diagonal. Pergantian
abu-abu ↔ biru memakai sapuan vertikal bertepi lembut (`--wb` / `--wt` pada `mask`).

**Helper utama:**

| Fungsi | Kegunaan |
|---|---|
| `scene(tl, id, a, b)` | Menampilkan satu scene dari detik `a` sampai `b`, plus kamera yang mundur sangat pelan |
| `show(tl, el, a, b, {in, out})` | Menampilkan satu *shot*; *cross-dissolve* berpusat di titik potong, `in`/`out: 0` = potongan langsung |
| `typeWords(tl, el, t, per)` | Kata muncul satu per satu; `per` bisa angka (jeda rata) atau array waktu per kata |
| `typeChars(tl, el, t, dur, o)` | Efek mengetik huruf demi huruf dengan kursor |
| `bg(tl, blue, t, dur)` | Sapuan vertikal latar abu-abu ↔ biru |

**Aturan penting:** setiap *tween* masuk merender *state* awalnya saat *timeline* dibangun (`immediateRender`),
sehingga tidak ada elemen yang sempat tampil di posisi akhir sebelum animasinya berjalan.

## Panduan Mengedit

**Mengubah teks.** Edit langsung di HTML scene. Elemen `.type` otomatis dipecah per kata, dan `.tw` per huruf.
Jika jumlah kata berubah, sesuaikan array `per` pada `typeWords` di fungsi scene terkait.

**Mengubah timing.** Waktu ditulis dalam detik absolut di fungsi `S1()`–`S8()`. Jika durasi sebuah scene berubah, perbarui juga
`SCENE_T`, `sceneStart.full`, label waktu di `.tag` setiap section, dan nilai `end` di `build()` (71.5 untuk Full, 30.5 untuk Cut).

**Mengganti gambar.** Lewat admin (versi server), atau ganti data URI base64 di atribut `src` (versi statis).

**Mengganti warna brand.** Ubah variabel di `:root` (`--blue`, `--canvas`, `--ink`, …), lalu cari juga `#0047FF` / `#0042f8` di SVG dan JS.

**Debug di konsol browser:**

```js
__reel.time()     // waktu timeline saat ini
__reel.seek(42.5) // lompat & pause di detik 42.5 (mode Play)
```

## Admin: Edit Kontak, Profil & Media

Pada versi server, data reel disimpan di database MySQL ILUZTAR dan diubah dari **Admin ILUZTAR › Motion Reel** (perlu login).
Panel admin Supabase pada versi awal sudah **tidak dipakai lagi**.

| Bagian | Isi |
|---|---|
| **Kontak** | Username Instagram, nomor WhatsApp (awalan 0 otomatis jadi 62) dan pesan awalnya, email, website, alamat Google Maps, serta tujuan tombol **Contact** dan **Order** |
| **Kartu Profil** | Nama, keterangan, dan bio di kartu profil scene 8 |
| **Media** | Tiap slot bisa memakai karya dari **Portofolio** ILUZTAR atau unggahan baru; *Kembalikan ke bawaan* memakai gambar asli reel |
| **Statistik Instagram** | Posts / followers / following, otomatis dari Instagram API atau diisi manual |

```
Admin ILUZTAR ──▶ MySQL: motion_slots ──▶ api/motion.php (GET, publik, hanya baca) ──▶ index.html
                         uploads/motion/
```

- Tabel `motion_slots` menyimpan pasangan *slot → nilai*: slot media (`ART0`, `TEX`, `AUDIO`, …), `c:<kunci>` untuk kontak & profil, dan `ig:<kunci>` untuk statistik Instagram.
- **Audio per versi:** slot `AUDIO` dipakai mode **Full** (71 detik), `AUDIO_CUT` dipakai mode **Cut** (30 detik). Slot kosong = versi itu berjalan tanpa suara mengikuti jam animasi.
- Batas unggahan: gambar maks. 8 MB (JPG, PNG, WebP, GIF), audio maks. 20 MB (MP3, M4A, AAC, OGG, WAV).

## Statistik Instagram

Kartu profil di scene 8 menampilkan jumlah **posts / followers / following** asli. Server ILUZTAR mengambil angka terbaru
dari Instagram API paling sering sekali per 15 menit; token disimpan di server dan **tidak pernah sampai ke browser**.
Jika Instagram tidak bisa dihubungi, angka terakhir tetap dipakai. Di GitHub Pages (tanpa server), angka bawaan yang dipakai.

## Riwayat Pengembangan (Iterasi)

Setiap putaran perbaikan diajukan sebagai *pull request* (PR) dan digabungkan setelah ditinjau. Pada **29 September 2026**
tercatat **25 PR** (34 *commit*) yang digabungkan pukul 00.25–10.02 WIB. Repositori ini kemudian dibuat ulang tanpa riwayat lama
untuk membersihkan data versi lama; daftar PR dan seluruh *commit*-nya diekspor lebih dulu ke
[`skripsi/riwayat-iterasi.md`](skripsi/riwayat-iterasi.md).

| Iterasi | Bukti | Isi |
|---|---|---|
| 1. Prototipe & tinjauan visual | Unggahan awal 00.09; PR #1 | Tinjauan ±25 *frame* kunci ([MOTION_PLAN.md](MOTION_PLAN.md)); perbaikan *easing*, ritme, arah potongan, logo |
| 2. Disamakan dengan video referensi | PR #2–#3 | *Timeline* dibangun ulang mengikuti potongan referensi; gerak di ketukan; gradien; tema gelap/terang; terbaca di ponsel |
| 3. Interaktivitas & kehalusan | PR #4–#8 | Reel interaktif, daftar layanan asli, animasi lebih halus, jeda antar-*shot* ditutup |
| 4. Pengelolaan isi oleh klien | PR #3, #4, #10, #11, #13; lalu migrasi server | Panel admin dengan *login* dan pembatasan akun; kemudian dipindah ke PHP + MySQL di server ILUZTAR |
| 5. Detail per adegan | PR #12–#25 | Chat diketik sebelum terkirim, folder & kertas, *mock* website, *toggle*, panah *ownership*, lokasi → jaringan, petunjuk gulir, kartu Instagram, *pre-decode* gambar, *soundtrack* versi Cut |
| 6. Animasi pembuka beranda (8 Nov 2026) | *Commit* mode `?intro=1` | Diputar otomatis setelah *loader*, bisa dilewati, sekali per kunjungan |

## Hasil Pengujian

Diukur pada 8 November 2026 di server lokal; data mentah ada di [`skripsi/data-pengukuran/`](skripsi/data-pengukuran).

| Metrik (rata-rata 5×, *cold cache*) | Desktop | Ponsel (CPU 4×, 4G) |
|---|---|---|
| First Contentful Paint | 0,97 s | 1,61 s |
| Largest Contentful Paint | 0,97 s | 1,61 s |
| Cumulative Layout Shift | 0,003 | 0,002 |
| Total Blocking Time (perkiraan) | 366 ms | 913 ms |
| Ukuran transfer | 527 KB | 527 KB |

- **Uji fungsional animasi pembuka:** 10/10 skenario berhasil di Chromium dan Microsoft Edge, 0 pelanggaran CSP.
- **Lighthouse:** Accessibility 100, Best Practices 100 (desktop) / 96 (*mobile*), SEO 63. Satu-satunya audit SEO yang gagal (`is-crawlable`) disebabkan header `noindex` pada folder uji `/dev/`.
- **Tanpa JavaScript:** HTML tetap memuat 311 kata, termasuk seluruh narasi delapan adegan.

## Mengulang Pengujian

Skrip di [`skripsi/skrip-pengujian/`](skripsi/skrip-pengujian) memakai Node.js dan `playwright-core` dengan Chromium.

| Skrip | Fungsi | Hasil |
|---|---|---|
| `perf.mjs` | FCP, LCP, CLS, TBT, waktu muat, ukuran transfer; 5× per profil | `data_performa.json` |
| `banding_situs.mjs` | Fitur SEO dari HTML mentah + LCP/transfer beranda lama vs baru | `data_banding_situs.json` |
| `uji-beranda-intro.mjs` | 10 skenario animasi pembuka (Chromium) | `data_uji_intro.json` |
| `uji-intro-edge.mjs` | Skenario yang sama di Microsoft Edge | `data_uji_intro_edge.json` |
| `video.mjs` | Pengukuran halaman reel + pengambilan *frame* video untuk perbandingan | `data_pengukuran.json` |

```bash
npm i playwright-core
npx playwright install chromium
node skripsi/skrip-pengujian/perf.mjs
```

> Alamat halaman dan folder keluaran di dalam skrip masih menunjuk ke lingkungan penulis (XAMPP lokal, drive `D:`).
> Sesuaikan konstanta `URL` / `OUT` di bagian atas tiap skrip sebelum menjalankannya.

## Performa & Aksesibilitas

- `index.html` berukuran ±870 KB sebelum kompresi karena 15 gambar ditanam sebagai base64 (transfer terkompresi 384 KB).
  Memindahkannya ke berkas AVIF/WebP akan menurunkan *Total Blocking Time* di ponsel.
- *Autoplay* intro di mode scroll dan mode pembuka dinonaktifkan bila pengguna memilih `prefers-reduced-motion`.
- Setiap scene punya `aria-label` dan teks narasi lengkap di elemen `.vo`.
- Kontrol pemutar bisa diakses dengan keyboard dan punya indikator fokus.

## Privasi Data Lampiran

Berkas di [`skripsi/lampiran/`](skripsi/lampiran) sudah dianonimkan sebelum diunggah:

- Nama, akun media sosial, dan waktu pengisian narasumber dihapus; narasumber diberi kode **KK-01–KK-04** (klien) dan **RS-01–RS-21** (rekan seniman), sama seperti di naskah.
- Pemilik studio dirujuk sebagai **P-01**; nama institusi klien disamarkan.
- Kuesioner hanya memuat jawaban, tanpa kolom waktu pengisian.

## Roadmap

- Gambar bawaan dipindah ke berkas terpisah (AVIF/WebP) dan dimuat bertahap
- Judul `<h1>`, atribut bahasa yang sesuai, dan data terstruktur (JSON-LD)
- Uji penerimaan audiens untuk video *explainer* baru
- Versi 9:16 dan 1:1 untuk Instagram, plus ekspor MP4

## Kredit & Hak Cipta

© 2023–2026 **Iluztar**. Seluruh artwork, logo, dan identitas visual adalah milik Iluztar.
Narasi suara dihasilkan dengan [ElevenLabs](https://elevenlabs.io). Video *explainer* dibuat dengan Alight Motion.
Repositori ini belum mencantumkan lisensi *open-source*, jadi penggunaan ulang aset memerlukan izin dari Iluztar.

*Let's shine together through art.* ✦
