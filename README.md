# Iluztar Motion Reel

Reel perkenalan interaktif untuk **Iluztar**, studio kreatif asal Bandar Lampung, Indonesia (sejak 2023).
Reel ini adalah halaman web berisi animasi berdurasi ±71 detik. Semua gerakannya dibangun dengan HTML, CSS, dan
[GSAP](https://gsap.com), tanpa file video.

🌐 **Live:** https://iluztar.github.io · 📷 Instagram: [@iluztar](https://instagram.com/iluztar) · 🔗 iluztar.com

---

## Daftar Isi

- [Fitur](#fitur)
- [Cara Menonton](#cara-menonton)
- [Alur Cerita (Scene)](#alur-cerita-scene)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Struktur Proyek](#struktur-proyek)
- [Teknologi](#teknologi)
- [Arsitektur Animasi](#arsitektur-animasi)
- [Panduan Mengedit](#panduan-mengedit)
- [Statistik Instagram Otomatis](#statistik-instagram-otomatis)
- [Deploy (GitHub Pages)](#deploy-github-pages)
- [Performa & Aksesibilitas](#performa--aksesibilitas)
- [Roadmap](#roadmap)
- [Kredit & Hak Cipta](#kredit--hak-cipta)

---

## Fitur

- **Dua cara menonton**, keduanya memakai timeline yang sama:
  - **Mode Scroll** (default): animasi bergerak mengikuti scroll, dengan smooth scrolling dari Lenis.
  - **Mode Play**: diputar seperti video, layar penuh, dengan kontrol pemutar.
- **Dua versi**: *Full* (±71 detik, 8 scene) dan *Cut* (±30 detik, versi ringkas untuk media sosial).
- **Sinkron voice-over**: unggah file audio narasi, lalu animasi mengikuti waktu audionya.
- **Tombol "Play scene"** untuk langsung memutar scene tertentu.
- **Mode gelap / terang**: tombol bulan/matahari (atau tombol `T`). Pilihan disimpan di browser; tanpa pilihan, mengikuti pengaturan sistem. Pergantian tema memakai *View Transitions* dengan sapuan vertikal (gelap turun dari atas, terang naik dari bawah).
- **Stage responsif**: kanvas 1600×900 yang diskalakan otomatis ke ukuran layar mana pun.
- **Satu file**: semua kode, gaya, dan gambar ada di `index.html`, jadi mudah di-hosting di mana saja.
- **Statistik Instagram asli**: jumlah posts, followers, dan following di scene 8 diambil dari akun @iluztar dan diperbarui otomatis.

## Cara Menonton

| Aksi | Cara |
|---|---|
| Menonton sambil scroll | Buka halaman, lalu scroll ke bawah |
| Putar sebagai video | Klik **Play** di bar bawah (pilih dulu *Full · 71s* atau *Cut · 30s*) |
| Putar dari scene saat ini | Klik **▶ Play scene** di pojok kanan atas |
| Tambah narasi | Klik **♪ Add voice-over**, lalu pilih file audio |

**Pintasan keyboard (mode Play):**

| Tombol | Fungsi |
|---|---|
| `Space` | Play / Pause |
| `→` / `←` | Scene berikutnya / sebelumnya |
| `H` | Sembunyikan / tampilkan kontrol |
| `Esc` | Keluar, lalu kembali ke mode scroll di frame terakhir |
| `T` | Ganti tema gelap / terang (berlaku juga di mode scroll) |

Kontrol dan kursor otomatis tersembunyi setelah 2,2 detik tanpa input. Klik progress bar untuk melompat ke waktu tertentu.

## Alur Cerita (Scene)

| # | Scene | Mulai | Isi |
|---|---|---|---|
| 01 | Intro | 0:00 | "This is Iluztar" → "A creative studio" (galeri artwork) → Bandar Lampung, Indonesia → jaringan artist → kalender "Since 2023" |
| 02 | The problem | 0:11 | Chat "Got a project that's growing faster than you can handle?" → timer (deadline) → sketsa belum selesai → "Plate.file" |
| 03 | We got you | 0:20 | "We got you." |
| 04 | Services | 0:21 | Kartu *Full-Commission* & *Pair of Hands* → tahap Sketch / Line-art / Base Color → "We've got you covered!" |
| 05 | Same care | 0:30 | *Big Project* vs *Single Task* → checklist *Care, Precision, Attention to detail* |
| 06 | You & we | 0:39 | "You keep the vision" → file-file menyatu jadi toggle "Refine" → "I want a Website!" menjadi situs |
| 07 | Ownership | 0:49 | "Stays true to your style, your direction, and your ownership" |
| 08 | Let's talk | 0:58 | Chat CTA → profil Instagram → iluztar.com → logo penutup |

Versi *Cut* memakai scene 1–3, lalu langsung ke scene 8 (tanpa bagian chat).

## Menjalankan Secara Lokal

Tidak perlu proses build. Cukup jalankan server statis apa saja:

```bash
git clone https://github.com/iluztar/iluztar.github.io.git
cd iluztar.github.io

# pilih salah satu
python3 -m http.server 8000
npx serve .
```

Lalu buka http://localhost:8000.

> Halaman memuat GSAP, Lenis, dan font DM Sans dari CDN, jadi **koneksi internet diperlukan**.
> Membuka `index.html` langsung (tanpa server) umumnya juga bisa.

## Struktur Proyek

```
iluztar.github.io/
├── index.html        # seluruh reel: HTML scene, CSS, gambar (base64), dan JavaScript timeline
├── data/
│   └── instagram.json  # jumlah posts/followers/following (ditulis otomatis oleh GitHub Actions)
├── .github/workflows/
│   └── instagram-stats.yml  # mengambil statistik Instagram tiap 6 jam + refresh token mingguan
├── MOTION_PLAN.md    # review motion + rencana pengembangan visual bertahap
└── README.md
```

Isi `index.html`, dari atas ke bawah:

1. **`<style>`**: token warna (`--blue`, `--canvas`, …), stage, gaya tiap scene (S1–S8), kontrol pemutar, dan mode scroll.
2. **SVG `<defs>`**: simbol yang dipakai ulang (logo `#lgp`, ikon, folder, dan lain-lain).
3. **`<main id="film">`**: delapan `<section class="scene">`, masing-masing berisi beberapa `.layer` (shot).
4. **Kontrol**: `#bar` (Play, pilihan versi, voice-over) dan `#ctrl` (pemutar).
5. **`<script>`**: persiapan DOM, motion tokens, helper animasi, fungsi `S1()`–`S8()`, pemutar, dan mode scroll.

## Teknologi

| Library | Versi | Fungsi |
|---|---|---|
| [GSAP](https://gsap.com) | 3.12.5 | Mesin animasi & timeline |
| ScrollTrigger | 3.12.5 | Menghubungkan scroll ke timeline |
| [Lenis](https://lenis.darkroom.engineering) | 1.1.13 | Smooth scrolling |
| DM Sans (Google Fonts) | – | Tipografi |

## Arsitektur Animasi

**Satu timeline, dua pengendali.** `build()` menyusun satu `gsap.timeline` untuk seluruh film.
Mode Play menjalankannya dengan jam (atau `audio.currentTime` bila ada voice-over).
Mode Scroll men-*scrub* timeline yang sama lewat ScrollTrigger: 1 detik film = 280px scroll (`PX_PER_SEC`),
dan 1,3 detik pertama diputar otomatis saat halaman dibuka.

**Stage tetap, skala dinamis.** Semua posisi ditulis dalam koordinat 1600×900 di dalam `.fit`.
`fit()` menghitung variabel CSS `--s` agar stage selalu pas di layar.

**Bahasa gerak** (objek `E`) mengikuti video referensi: tenang dan presisi, tanpa pantulan atau goyangan.
Elemen masuk cepat lalu berhenti bersih (`power3.out`), perpindahan memakai `power2.inOut`, dan "hidup"-nya
datang dari kamera yang terus bergeser pelan (`drift`) serta bentuk yang berubah menjadi bentuk berikutnya (match cut).

**Latar**: satu kanvas bersama (`#gbg`) dengan gradien radial lembut dan grid yang memudar diagonal. Pergantian
abu-abu ↔ biru memakai sapuan vertikal bertepi lembut (`--wb` / `--wt` pada `mask`).

**Helper utama:**

| Fungsi | Kegunaan |
|---|---|
| `scene(tl, id, a, b)` | Menampilkan satu scene dari detik `a` sampai `b`, plus kamera yang mundur sangat pelan |
| `show(tl, el, a, b, {in, out})` | Menampilkan satu shot; cross-dissolve berpusat di titik potong, `in`/`out: 0` = potongan langsung (match cut) |
| `typeWords(tl, el, t, per)` | Kata muncul satu per satu; `per` bisa angka (jeda rata) atau array waktu per kata (sinkron narasi) |
| `typeChars(tl, el, t, dur, o)` | Efek mengetik huruf demi huruf dengan kursor (`data-caret="star"` untuk kursor bintang) |
| `bg(tl, blue, t, dur)` | Sapuan vertikal latar abu-abu ↔ biru |

**Aturan penting:** setiap tween masuk merender state awalnya saat timeline dibangun (`immediateRender`),
sehingga tidak ada elemen yang sempat tampil di posisi akhir sebelum animasinya berjalan.
Saat keluar dari mode Play, `#film` dikembalikan ke HTML awal (`PRISTINE`), lalu timeline dibangun ulang.

## Panduan Mengedit

**Mengubah teks.** Edit langsung di HTML scene. Elemen `.type` otomatis dipecah per kata, dan `.tw` dipecah per huruf.
Jika jumlah kata berubah, sesuaikan array `per` pada `typeWords` di fungsi scene terkait.

**Mengubah timing.** Waktu ditulis dalam detik absolut di fungsi `S1()`–`S8()`. Jika durasi sebuah scene berubah,
perbarui juga:
- `SCENE_T` (chip scene di mode scroll),
- `sceneStart.full` (tombol *Play scene*),
- label waktu di `.tag` setiap section,
- nilai `end` di `build()` (71.5 untuk Full, 30.5 untuk Cut).

**Mengganti gambar.** Gambar disimpan sebagai data URI base64 di atribut `src`. Ganti dengan data URI baru,
atau (disarankan) simpan file di folder `img/` dan rujuk path-nya. Tile artwork "far" di scene 1 memakai ulang gambar lain
lewat atribut `data-img` (indeks gambar), jadi tidak perlu gambar duplikat.

**Mengganti warna brand.** Ubah variabel di `:root` (`--blue`, `--canvas`, `--ink`, …). Beberapa warna di SVG dan JS
masih ditulis langsung (`#0047FF`, `#0042f8`), jadi cari dan ganti juga di sana.

**Debug di konsol browser:**

```js
__reel.time()     // waktu timeline saat ini
__reel.seek(42.5) // lompat & pause di detik 42.5 (mode Play)
```

## Statistik Instagram Otomatis

Kartu profil di scene 8 menampilkan jumlah **posts / followers / following** asli dari akun Instagram.

**Cara kerjanya:**

```
Instagram API ──(token rahasia)──▶ GitHub Actions (tiap 6 jam) ──▶ data/instagram.json ──▶ index.html
```

- Workflow `.github/workflows/instagram-stats.yml` memanggil Instagram API memakai token yang disimpan sebagai
  **repository secret**, lalu meng-commit `data/instagram.json`, tapi hanya jika angkanya berubah.
- `index.html` hanya membaca JSON publik itu (dari `raw.githubusercontent.com`, dengan cadangan `data/instagram.json`).
  **Token tidak pernah sampai ke browser.**
- Angka followers naik perlahan menuju nilai aslinya saat kartu muncul. Angka ≥ 10.000 diringkas (misalnya `12.3K`).
- Jika JSON gagal dimuat (offline, dibuka via `file://`), angka yang tertulis di HTML dipakai sebagai cadangan.

**Setup (sekali saja):**

1. **Akun Instagram harus Professional** (Business atau Creator): *Settings → Account type and tools → Switch to professional account*.
2. **Buat aplikasi Meta** di [developers.facebook.com](https://developers.facebook.com/apps). Pilih use case Instagram
   (*Instagram API with Instagram Login*), buka **API setup with Instagram login**, tambahkan akun @iluztar, lalu klik
   **Generate token**. Hasilnya adalah *long-lived token* (berlaku 60 hari). Mode *Development* sudah cukup untuk akun
   milik sendiri, tanpa App Review. Nama menu di dashboard Meta bisa sedikit berbeda karena sering diperbarui.
3. **Simpan token** di repo: *Settings → Secrets and variables → Actions → New repository secret*
   - Name: `IG_ACCESS_TOKEN`
   - Secret: token dari langkah 2
4. **(Disarankan) Refresh token otomatis.** Token Instagram kedaluwarsa setelah 60 hari. Agar tidak perlu diperbarui manual:
   - Buat [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) dengan
     *Repository access: Only select repositories → iluztar.github.io* dan *Permissions → Secrets: Read and write*.
   - Simpan sebagai secret `GH_SECRETS_PAT`.
   - Setiap Senin, workflow akan me-refresh `IG_ACCESS_TOKEN` secara otomatis.
5. **Jalankan pertama kali**: tab *Actions → Instagram stats → Run workflow*. Jadwal otomatis hanya berjalan dari branch
   default (`main`).

Tanpa `GH_SECRETS_PAT`, ulangi langkah 2–3 sebelum 60 hari. Workflow akan memberi peringatan di log.

## Deploy (GitHub Pages)

Repo ini bernama `iluztar.github.io`, jadi GitHub Pages otomatis menyajikan `index.html` dari branch default.
Setiap push ke branch tersebut langsung tayang di https://iluztar.github.io dalam beberapa menit.
Untuk domain kustom (misalnya `iluztar.com`), tambahkan file `CNAME` dan atur DNS sesuai
[dokumentasi GitHub Pages](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Performa & Aksesibilitas

- `index.html` berukuran ±870 KB karena 15 gambar ditanam sebagai base64. Memindahkannya ke file AVIF/WebP
  akan mempercepat tampilan pertama secara signifikan.
- Autoplay intro di mode scroll dinonaktifkan jika pengguna memilih `prefers-reduced-motion`.
- Setiap scene punya `aria-label` dan teks narasi lengkap di elemen `.vo`.
- Kontrol pemutar bisa diakses dengan keyboard dan punya indikator fokus.

## Roadmap

Rencana pengembangan motion ada di **[MOTION_PLAN.md](MOTION_PLAN.md)**, termasuk status bagian yang sudah dikerjakan.
Ringkasnya, yang akan datang:

- Refactor timeline per scene dengan label relatif dan beat map voice-over
- Kamera "kanvas" dan transisi match cut untuk semua pergantian shot
- Tipografi kinetik dengan reveal ber-mask
- Showcase artwork (proses sketch → line-art → color)
- Efek suara & musik
- Versi 9:16 dan 1:1 untuk Instagram, plus ekspor MP4

## Kredit & Hak Cipta

© 2023–2026 **Iluztar**. Seluruh artwork, logo, dan identitas visual adalah milik Iluztar.
Repositori ini belum mencantumkan lisensi open-source, jadi penggunaan ulang aset memerlukan izin dari Iluztar.

*Let's shine together through art.* ✦
