# Iluztar Motion Reel

Reel perkenalan interaktif untuk **Iluztar**, studio kreatif asal Bandar Lampung, Indonesia (sejak 2023).
Reel ini adalah halaman web berisi animasi berdurasi ±71 detik. Semua gerakannya dibangun dengan HTML, CSS, dan
[GSAP](https://gsap.com), tanpa file video.

🌐 **Live:** https://iluztar.github.io · 📷 Instagram: [@iluztar](https://instagram.com/iluztar) · 🔗 iluztar.com

> **Tentang proyek ini**
>
> Proyek ini dibuat oleh salah satu artist di **ILUZTAR Studio** untuk menuntaskan skripsi berjudul
> ***"Pengembangan Company Profile Digital Studio Kreatif ILUZTAR dengan Menggunakan Motion Graphic sebagai Media Promosi"***.
>
> Harapannya, proyek ini bisa menjadi referensi untuk mengembangkan website dengan animasi yang dinamis. Caranya:
> sebuah video motion graphic dijadikan bahan referensi, lalu dikonversi menjadi website interaktif dengan bantuan
> **Claude AI (Opus 5.5)**.
>
> Video utama, yang menjadi referensi website ini sekaligus media promosi di media sosial dalam format video, dibuat
> menggunakan **Alight Motion**.

---

## Daftar Isi

- [Latar Belakang Proyek](#latar-belakang-proyek)
- [Fitur](#fitur)
- [Cara Menonton](#cara-menonton)
- [Alur Cerita (Scene)](#alur-cerita-scene)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Struktur Proyek](#struktur-proyek)
- [Teknologi](#teknologi)
- [Arsitektur Animasi](#arsitektur-animasi)
- [Panduan Mengedit](#panduan-mengedit)
- [Admin: Ganti Gambar & Audio](#admin-ganti-gambar--audio)
- [Statistik Instagram Otomatis](#statistik-instagram-otomatis)
- [Deploy (GitHub Pages)](#deploy-github-pages)
- [Performa & Aksesibilitas](#performa--aksesibilitas)
- [Roadmap](#roadmap)
- [Kredit & Hak Cipta](#kredit--hak-cipta)

---

## Latar Belakang Proyek

| | |
|---|---|
| **Pembuat** | Salah satu artist ILUZTAR Studio |
| **Konteks** | Skripsi |
| **Judul** | *Pengembangan Company Profile Digital Studio Kreatif ILUZTAR dengan Menggunakan Motion Graphic sebagai Media Promosi* |
| **Tujuan** | Menjadi referensi pengembangan website dengan animasi dinamis |
| **Metode** | Video motion graphic dipakai sebagai referensi, lalu dikonversi menjadi website interaktif |
| **Video utama** | Dibuat dengan **Alight Motion**. Dipakai sebagai referensi website ini dan sebagai media promosi di media sosial (format video) |
| **Alat bantu** | Alight Motion (video motion graphic), Claude AI (Opus 5.5) (konversi ke website) |

**Alur konversi video → website** yang dipakai di proyek ini:

0. **Membuat video motion graphic di Alight Motion.** Video ini menjadi media promosi di media sosial sekaligus acuan website.
1. **Analisis video referensi.** Video dipecah per frame untuk mencatat setiap shot: kapan mulai, arah gerak, dan ukuran objek.
2. **Analisis audio.** Ketukan musik dideteksi (*spectral flux*) supaya gerak kamera melangkah tepat di beat (lihat `BEATS`).
3. **Membangun ulang dengan HTML/CSS/GSAP.** Setiap shot ditulis sebagai timeline animasi, bukan video, sehingga tetap tajam di semua ukuran layar.
4. **Verifikasi.** Hasil dirender dan dibandingkan berdampingan dengan video di detik yang sama, lalu dikoreksi sampai mirip.
5. **Menjadikannya website.** Elemen dibuat bisa diklik (lightbox, Maps, Instagram, WhatsApp, form pesanan), ditambah panel admin untuk mengedit konten.

## Fitur

- **Dua cara menonton**, keduanya memakai timeline yang sama:
  - **Mode Scroll** (default): animasi bergerak mengikuti scroll, dengan smooth scrolling dari Lenis.
  - **Mode Play**: diputar seperti video, layar penuh, dengan kontrol pemutar.
- **Dua versi**: *Full* (±71 detik, 8 scene) dan *Cut* (±30 detik, versi ringkas untuk media sosial).
- **Sinkron voice-over** *(sementara disembunyikan)*: unggah file audio narasi, lalu animasi mengikuti waktu audionya. Untuk memunculkan lagi tombolnya, hapus atribut `hidden` pada `<label class="vofile">` di `index.html`.
- **Tombol "Play scene"** untuk langsung memutar scene tertentu.
- **Mode gelap / terang**: default terang. Tombol bulan/matahari (atau tombol `T`) mengganti tema, dan pilihannya disimpan di browser. Pergantian tema memakai *View Transitions* dengan sapuan vertikal (gelap turun dari atas, terang naik dari bawah).
- **Stage responsif**: kanvas 1600×900 yang diskalakan otomatis ke ukuran layar mana pun.
- **Satu file**: semua kode, gaya, dan gambar ada di `index.html`, jadi mudah di-hosting di mana saja.
- **Statistik Instagram asli**: jumlah posts, followers, dan following di scene 8 diambil dari akun @iluztar dan diperbarui otomatis.

## Cara Menonton

| Aksi | Cara |
|---|---|
| Menonton sambil scroll | Buka halaman, lalu scroll ke bawah |
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
| 07 | Ownership | 0:49 | "And every piece stays true to your style" → panah bergelombang → "Your Ownership" |
| 08 | Let's talk | 0:58 | Chat CTA → profil Instagram → iluztar.com → logo penutup |

Versi *Cut* memakai scene 1–3, lalu langsung ke scene 8 (tanpa bagian chat).

## Elemen yang Bisa Diklik

Reel ini sebuah halaman web, jadi elemennya bisa diklik, baik saat di-scroll maupun saat diputar:

| Elemen | Aksi |
|---|---|
| Artwork galeri, lembar sketsa, gambar postingan | Dibuka besar (lightbox). Film otomatis dijeda, lalu lanjut saat ditutup (klik / `Esc`) |
| "Bandar Lampung, Indonesia" | Google Maps |
| Checklist di kartu Full-Commission (boleh pilih beberapa) / Pair of Hands (pilih satu) | Memilih tahap yang ingin dipesan |
| Tombol **Order** di kartu layanan | Membuka WhatsApp dengan pesan berisi layanan + tahap yang dicentang (mis. *“saya ingin order Full-Commission: Sketch, Lineart, Full Color.”*). Kalau tujuannya email, pesan masuk ke subjek/isi email; kalau DM Instagram, pesan disalin otomatis untuk ditempel |
| Folder Big Project / Single Task, **Build it!** | WhatsApp bila nomornya diisi, selain itu DM Instagram (bisa diatur di admin) |
| Header postingan, nama & tombol **Follow** di profil | Profil Instagram @iluztar |
| **Message** | DM Instagram |
| **Contact** | WhatsApp → email → website → DM (bisa diatur di admin); labelnya ikut berubah jadi *WhatsApp* / *Email* |
| "iluztar.com" | Website |
| Logo penutup | Putar ulang dari awal |

Setiap elemen menyebut tujuannya lewat `data-link` (`ig`, `dm`, `contact`, `order`, `web`, `map`); alamatnya dihitung dari pengaturan Kontak di panel admin.

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
├── config.js         # URL & anon key Supabase untuk panel admin (kosong = admin nonaktif)
├── favicon.ico, favicon.svg, favicon-32.png, apple-touch-icon.png   # ikon tab & home screen (logo Iluztar)
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

**Mengikuti ketukan**: gerak kamera/drift yang pelan tidak meluncur mulus, tapi maju bertahap tepat di ketukan
musik referensi lalu diam di antaranya. Daftar ketukan ada di konstanta `BEATS` (onset kuat dari audio referensi,
diekstrak dengan analisis *spectral flux*), dan fungsi easing `bE(start, durasi, {beats, w})` membagi satu gerakan
menjadi langkah-langkah di ketukan itu. Kalau musik diganti, cukup perbarui `BEATS`.

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

## Admin: Edit Kontak, Profil & Media

Klik ikon orang di bar bawah (atau buka alamat dengan `?admin`), lalu login. Panel admin punya empat tab:

| Tab | Isi |
|---|---|
| **Kontak** | Username Instagram, nomor WhatsApp (awalan 0 otomatis jadi 62) dan pesan awalnya, email, website, alamat Google Maps, serta tujuan tombol **Contact** dan **Order** (otomatis, WhatsApp, email, website, atau DM Instagram). Ada pratinjau semua tautan sebelum disimpan. |
| **Profil** | Nama, keterangan, dan bio di kartu profil scene 8 |
| **Media** | Ganti audio track dan gambar contoh (tabel slot di bawah) |
| **Akun** | Ganti password, keluar |

Di halaman login ada **Lupa password?** yang mengirim link reset ke email. Supaya link itu kembali ke situs,
tambahkan alamat situs (misalnya `https://iluztar.vercel.app`) di Supabase: *Authentication → URL Configuration*
(*Site URL* dan *Redirect URLs*).

Semua perubahan langsung terlihat oleh pengunjung. Kontak dan profil disimpan di tabel yang sama dengan media
(`reel_slots`, baris berawalan `c:`), jadi tidak perlu tabel tambahan.

### Slot media

**Cara kerja media:** file disimpan di Supabase Storage (bucket `reel`), dan pasangan *slot → URL* di tabel `reel_slots`.
Halaman membaca tabel itu saat dibuka. Kalau sebuah slot kosong atau Supabase belum dikonfigurasi, gambar bawaan
yang dipakai. Siapa pun bisa **membaca**, tapi hanya email di `reel_admins` yang bisa **mengubah**. Situs tidak punya form pendaftaran, dan akun yang login tapi bukan admin langsung dikeluarkan.

**Audio per versi:** ada dua slot audio, karena tiap versi punya durasi dan musik sendiri.

| Slot | Dipakai saat | Durasi |
|---|---|---|
| `AUDIO` | Play dengan mode **Full** | 71 detik |
| `AUDIO_CUT` | Play dengan mode **Cut** | 30 detik |

Kalau slot versi yang diputar masih kosong, versi itu berjalan tanpa suara mengikuti jam animasi.

**Setup (sekali saja):**

1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, lalu jalankan:

   ```sql
   -- data
   create table public.reel_slots (
     slot text primary key,
     url text not null,
     updated_at timestamptz default now()
   );
   insert into storage.buckets (id, name, public) values ('reel', 'reel', true);
   ```

   Lalu jalankan juga blok **kunci admin** di bawah.

   **Kunci admin.** Hanya email yang terdaftar di `reel_admins` yang boleh mengubah data atau mengunggah file.
   Jadi walaupun ada akun lain yang sempat terbuat (misalnya lewat API pendaftaran Supabase), akun itu tidak bisa mengubah
   apa pun. Ganti `admin@contoh.com` dengan email admin Anda:

   ```sql
   -- siapa saja admin
   create table if not exists public.reel_admins (email text primary key);
   alter table public.reel_admins enable row level security;   -- tanpa policy: tidak bisa dibaca/diubah dari situs
   insert into public.reel_admins (email) values ('admin@contoh.com') on conflict do nothing;

   create or replace function public.is_reel_admin() returns boolean
     language sql stable security definer set search_path = public
     as $$ select exists (select 1 from public.reel_admins where lower(email) = lower(auth.jwt() ->> 'email')) $$;
   revoke all on function public.is_reel_admin() from public;
   grant execute on function public.is_reel_admin() to anon, authenticated;

   -- tabel data: semua orang boleh membaca, hanya admin yang boleh menulis
   alter table public.reel_slots enable row level security;
   drop policy if exists "public read"  on public.reel_slots;
   drop policy if exists "admin write"  on public.reel_slots;
   create policy "public read" on public.reel_slots for select using (true);
   create policy "admin write" on public.reel_slots for all to authenticated
     using (public.is_reel_admin()) with check (public.is_reel_admin());

   -- file di bucket 'reel': hanya admin yang boleh mengunggah, mengganti, menghapus
   drop policy if exists "admin upload" on storage.objects;
   drop policy if exists "admin update" on storage.objects;
   drop policy if exists "admin delete" on storage.objects;
   create policy "admin upload" on storage.objects for insert to authenticated with check (bucket_id = 'reel' and public.is_reel_admin());
   create policy "admin update" on storage.objects for update to authenticated using (bucket_id = 'reel' and public.is_reel_admin());
   create policy "admin delete" on storage.objects for delete to authenticated using (bucket_id = 'reel' and public.is_reel_admin());
   ```

   Kalau database Anda sudah dibuat dengan SQL versi lama, cukup jalankan blok **kunci admin** ini. Blok ini aman
   dijalankan ulang. Untuk menambah admin lain: `insert into public.reel_admins (email) values ('email@lain.com');`

3. **Authentication → Sign In / Providers → Email:** matikan *Allow new users to sign up*, supaya tidak ada orang
   lain yang bisa membuat akun.
4. **Authentication → Users → Add user:** buat akun admin Anda (email + password).
5. **Project Settings → API:** salin *Project URL* dan kunci *anon* / *publishable* ke `config.js`:

   ```js
   window.ILUZTAR_SUPABASE = {
     url: 'https://xxxxxxxx.supabase.co',
     anonKey: 'eyJ...',
   };
   ```

   Kedua nilai ini memang aman untuk publik. Yang melindungi data adalah *row-level security* dan daftar `reel_admins` di langkah 2.
6. Buka situs. Tombol ikon orang akan muncul di bar bawah. Klik, login, lalu unggah file per slot
   (gambar maks. 8 MB, audio maks. 20 MB). Tombol **Reset** mengembalikan slot ke bawaan.

Sebelum `config.js` diisi, panel bisa dibuka lewat `?admin` di akhir alamat. Panel akan menampilkan petunjuk setup.

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
