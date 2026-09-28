# Iluztar Motion Reel — Review & Rencana Pengembangan Visual

Dokumen ini adalah hasil review `index.html` (reel 71 detik / cut 30 detik, GSAP 3.12.5 + ScrollTrigger + Lenis)
dan rencana bertahap untuk menaikkan kualitas motion-nya. Review dilakukan dengan membaca seluruh kode
timeline dan merender ±25 frame di titik-titik kunci (1.5s, 3s, 4.5s, 8s, 10.5s, … 69.5s).

---

## 0. Status Implementasi

**Revisi 2: disamakan dengan video referensi** (`VID_20260926_221855_617.mp4`, 71,5 detik). Setiap shot dicocokkan
frame demi frame (8 fps) terhadap referensi, lalu timeline ditulis ulang:

- [x] **Tanpa wiggle**: semua `settle()`, `anticipate()`, `back.out`, flash putih, dan wipe tile dihapus. Elemen masuk cepat lalu berhenti bersih; gerak halus datang dari kamera yang terus bergeser pelan.
- [x] **Shot disamakan dengan referensi**: kursor bintang berputar, zoom menembus teks, galeri naik dari bawah, pin berputar + pill "Indonesia", jaringan ±30 artist dengan garis menyebar searah jarum jam lalu kamera mundur, kalender dengan balik halaman, chat yang diketik, timer miring, tumpukan sketsa, folder "Plate.file", kartu layanan yang mengipas, *cover-flow* Sketch → Line-art → Base Color, *selection box*, checklist yang tumbuh dari titik, mata membuka + kalimat yang bergeser, roda "Work" → toggle "Refine" → pill → situs web, panah bergelombang yang diikuti kamera lalu tangan, chat penutup → profil Instagram → iluztar.com → logo.
- [x] **Latar bergradien**: gradien radial lembut + grid yang memudar diagonal (terinspirasi file referensi View Transitions), bukan grid datar.
- [x] **Transisi latar halus**: abu-abu ↔ biru memakai sapuan vertikal bertepi lembut.
- [x] **Mode gelap / terang**: *View Transitions* gaya "vertical" (satu-satunya gaya yang dipakai), tersimpan di browser, mengikuti sistem bila belum dipilih.

Belum: refactor ke sub-timeline + beat map, SplitText, suara, varian 9:16, pemindahan gambar base64 ke file.

## 1. Ringkasan Review

### Yang sudah kuat (pertahankan)

| Aspek | Kenapa bagus |
|---|---|
| **Satu timeline untuk Play & Scroll** | Mode scroll men-scrub timeline yang sama — arsitektur yang rapi dan jarang dibuat orang. |
| **Match cut yang cerdas** | Pill "Indonesia" → pusat network (S1), file-file → toggle "Refine" → pill "I want a Website!" → tombol CTA (S6), ikon paper → checklist card (S5). Ini momen paling "pro" di reel. |
| **Prinsip animasi sudah dipikirkan** | Ada helper `settle()` (follow-through), `anticipate()` (wind-up), depth pada tile hero (far/mid/near). |
| **Grid bersama (`#gbg`)** | Background tidak "loncat" antar scene; bahasa visual "kanvas desain" konsisten. |
| **Sinkron narasi** | Kartu masuk tepat saat namanya diucapkan (S4), timing per kata lewat array `per`. |

### Masalah utama (urut dari dampak terbesar)

1. **Ritme monoton — semua hal bergerak dengan "rasa" yang sama.**
   `back.out(1.2)` dipakai 23×, `settle()` 24×, `typeWords` (fade + blur + naik 12px) 20×. Akibatnya setiap
   elemen masuk dengan pop kecil + goyang kecil. Karena semuanya "spesial", tidak ada yang terasa spesial.
2. **Transisi antar-layer masih banyak cross-fade.** 10 pemanggilan `show()` memakai fade default 0.45s
   (mis. S2 timer → sketsa → plate, S5 tile → kalimat, S8 profil → URL). Ini yang membuat bagian tengah
   terasa seperti slideshow, bukan film — kontras sekali dengan match cut yang bagus di S1/S6.
3. **Komposisi terlalu kecil & kosong.** Di frame 1600×900, objek utama sering hanya ±20–30% lebar layar
   (timer, kartu Full-Commission, tile Big Project, panah S7, logo penutup). Caption 38px di `top:104px`
   terlepas dari objeknya. Teks di kartu IG / tile (13–19px) tidak terbaca di layar HP.
4. **Karya seni hampir tidak tampil.** Studio ilustrasi, tapi artwork hanya muncul ±1.5 detik sebagai tile
   kecil (S1) dan thumbnail IG (S4). Reel ini lebih terasa "UI SaaS" daripada "studio seni".
5. **Kamera statis.** Satu-satunya gerak kamera adalah zoom linear `1 → 1.04` per scene. Tidak ada pan,
   parallax antar-layer, atau "perjalanan" di atas grid — padahal grid infinite adalah kanvas sempurna untuk itu.
6. **Penutup (end card) lemah.** Logo 130px + teks kecil, pop `rotation:-90 → 0`. Logo Iluztar (path `#lgp`)
   terdiri dari **dua bentuk cermin** — potensi besar untuk logo-reveal yang ikonik, belum dipakai.
7. **Waktu di-hardcode absolut** (`21.72`, `44.25 + i*.04`, `T.a + 2.35`…). Menggeser satu beat berarti
   menggeser puluhan angka → iterasi motion jadi lambat, dan itu langsung membatasi kualitas.
8. **Performa.** `filter: blur()` dianimasikan per kata; morph memakai `width/height/left/top/borderRadius`
   (memicu layout tiap frame); ~870 KB base64 inline. Aman di laptop, bisa patah-patah di HP menengah.
9. **Hanya 16:9.** Untuk Instagram (CTA-nya sendiri @iluztar) dibutuhkan versi 9:16 dan 1:1.
10. **Tanpa suara.** Motion tipografi/UI seperti ini ±50% "rasa"-nya berasal dari SFX (klik, whoosh, pop).

> Catatan: di lingkungan render saya Google Fonts tidak termuat, jadi screenshot memakai font fallback.
> Semua catatan di atas berlaku terlepas dari font.

---

## 2. Arah Visual (North Star)

**"Studio kreatif yang bekerja di atas kanvas desain."**
Penonton berada di dalam satu kanvas (grid) tak terbatas; kamera *terbang* dari satu area kerja ke area kerja
berikutnya. UI (chat, toggle, kartu) adalah *alat*, sedangkan **artwork adalah bintangnya**.

Tiga kata kunci rasa gerak: **Tegas · Hangat · Tertata.**
- *Tegas*: masuk cepat, berhenti bersih (bukan memantul).
- *Hangat*: overshoot hanya di momen emosional/brand.
- *Tertata*: semua bergerak mengikuti grid 64px & kurva yang sama.

---

## 3. Rencana Bertahap

### Fase 0 — Fondasi & Tooling (±3–4 hari)
Tujuan: membuat iterasi motion cepat. Tanpa ini fase lain akan lambat.

1. **Upgrade ke GSAP ≥ 3.13.** Sejak 3.13 semua plugin (SplitText, CustomEase, MorphSVG, DrawSVG,
   GSDevTools, Flip) gratis. Hosting Lenis & GSAP lokal (`/vendor`) atau via cdnjs/jsdelivr dengan versi terkunci.
2. **Motion tokens** — satu sumber kebenaran untuk durasi & easing:
   ```js
   gsap.registerPlugin(CustomEase);
   const M = {
     dur:  { xs: .18, s: .32, m: .55, l: .9, xl: 1.4 },
     ease: {
       enter: CustomEase.create('enter', 'M0,0 C0.16,1 0.3,1 1,1'),   // cepat masuk, berhenti bersih
       exit:  CustomEase.create('exit',  'M0,0 C0.7,0 0.84,0 1,1'),   // akselerasi keluar
       move:  CustomEase.create('move',  'M0,0 C0.65,0 0.35,1 1,1'),  // perpindahan / morph
       brand: 'back.out(1.7)',                                        // HANYA momen brand
       cam:   'power2.inOut',
     },
     stagger: { tight: .03, word: .07, item: .12 },
   };
   ```
   Lalu ganti semua angka mentah dengan token ini.
3. **Sub-timeline per scene + label relatif.** Setiap `S1..S8` mengembalikan timeline sendiri, di-`add` ke master
   dengan label. Di dalam scene gunakan posisi relatif (`'<'`, `'>'`, `'+=0.2'`, `'beat3'`) alih-alih detik absolut:
   ```js
   function S3() {
     const tl = gsap.timeline({ defaults: { ease: M.ease.enter, duration: M.dur.m } });
     tl.addLabel('in')
       .from('.s3col', { scale: 2.6 }, 'in')
       .add(typeChars('#s3say', .75), 'in+=.05');
     return tl;
   }
   master.add(S1(), 'S1').add(S2(), 'S2').add(S3(), 'S3'); // durasi scene otomatis
   ```
4. **Beat map dari voice-over.** Simpan waktu kata/frasa VO di satu objek JSON (`beats.json`), dan scene
   mengambil posisi dari sana. Mengganti rekaman VO = hanya mengganti JSON.
5. **GSDevTools** di mode dev (`?dev`) untuk scrub, loop satu scene, dan slow-mo 0.25×.
6. **Harness render frame**: skrip Playwright yang memanggil `window.__reel.seek(t)` dan menyimpan PNG per
   0.5 detik → contact sheet untuk review cepat, plus ekspor MP4 via ffmpeg (untuk Instagram).

### Fase 1 — Bahasa Motion (±1 minggu)
Tujuan: memecah monoton, membangun hierarki gerak.

| Kategori | Dipakai untuk | Kurva | Durasi | Overshoot/settle? |
|---|---|---|---|---|
| **UI Snap** | bubble chat, tombol, checkbox, pill | `enter` | xs–s | Tidak |
| **Object Enter** | kartu, timer, plate, file | `enter` | m | Tidak (sesekali ringan) |
| **Morph / Move** | match cut, perpindahan posisi | `move` | m–l | Tidak |
| **Camera** | pan/zoom antar area | `cam` | l–xl | Tidak |
| **Brand Accent** | logo, "We got you.", "ownership.", end card | `brand` | m | **Ya — hanya di sini** |

Aturan praktis:
- **Kurangi `settle()` dari 24 → ±5 pemakaian** (hanya momen hero). Sisanya berhenti bersih.
- Keluar (exit) selalu **lebih cepat** dari masuk (±60–70% durasinya) dan memakai `exit`.
- **Offset & overlap**: elemen dalam satu grup tidak mulai bersamaan; properti dalam satu elemen juga
  tidak (mis. posisi mulai dulu, rotasi menyusul 0.05s) → gerak terasa organik.
- **Arah bermakna**: masalah (S2) datang dari kiri/atas dengan sedikit "berat"; solusi (S4–S6) bergerak
  ke atas/kanan dengan ringan. Konsisten di seluruh reel.

### Fase 2 — Tipografi Kinetik (±4 hari)
1. Pakai **SplitText** (masking per baris/kata) menggantikan `blur()` per kata:
   `yPercent: 110 → 0` di dalam wadah `overflow:hidden` — lebih tajam, lebih murah untuk GPU.
2. **Tiga level teks** dengan perlakuan berbeda:
   - *Headline brand* (This is Iluztar, A creative studio, We got you, ownership): besar (90–140px),
     reveal mask + satu aksen (warna biru / ikon).
   - *Kalimat narasi*: 52–62px, reveal kata dengan stagger `M.stagger.word`.
   - *Caption*: jangan selalu di atas; letakkan **menempel pada objek** (di bawah/di samping kartu) agar mata
     tidak melompat.
3. **Typewriter hanya untuk konteks UI** (input chat, caption IG, search bar). Jangan untuk teks narasi.
4. **Kata kunci diberi aksi**: "Tight deadlines" → angka timer berdetak merah; "unfinished" → garis sketsa
   berhenti di tengah; "precision" → teks snap ke grid; "ownership" → teks masuk ke dalam file di tangan.

### Fase 3 — Transisi & Kamera (±1 minggu) — *dampak terbesar*
Target: **nol cross-fade polos**. Setiap pergantian layer adalah salah satu dari: match cut, morph, push
kamera, atau mask wipe. Usulan per titik:

| Waktu | Sekarang | Usulan |
|---|---|---|
| S1 A→B (2.05s) | fade + scale | Kotak sel "This is Iluztar" membesar jadi bingkai; tile artwork muncul **dari dalam** bingkai |
| S1 E→S2 (11.1s) | fade | Titik "on" di kalender membesar jadi bubble chat biru pertama (morph Flip) |
| S2 A→B (15.05s) | fade | Bubble "Yeah :(" menyusut jadi titik → jarum/timer |
| S2 B→C (16.12s) | fade | Timer terbanting ke meja, sketsa "berhamburan" dari baliknya (push kamera ke kanan) |
| S2 C→D (17.62s) | fade | Sketsa ditarik masuk ke folder "Plate.file" (Flip ke posisi `.psh`) |
| S3 → S4 (21.3s) | flash putih | Folder di "We got you." dibuka → isi (biru) memenuhi layar = masuk ke background biru |
| S4 C → S5 (30.6s) | tile acak | Pertahankan tile, tapi arah **sapuan diagonal** (stagger `from:'start'` grid 16×9), bukan acak |
| S5 A→B (33.6s) | fade | Selection box (`#sel`) menyusut membungkus kata "piece" |
| S6 A→B (42.45s) | flash | Ikon mata berkedip → kelopak menutup jadi layar biru (mask) |
| S7 C → S8 (58.4s) | fade | File biru di tangan diluncurkan ke atas → jadi bubble "Ready to bring your" |
| S8 B→C (64.9s) | scale out | Tombol "Follow" ditekan → berubah jadi link `iluztar.com` |

**Kamera kanvas**: jadikan `#gbg` + scene sebagai satu kanvas besar; tiap scene punya koordinat
(mis. S2 di kanan S1, S5 di bawah S4). Transisi = kamera *pan* dengan `M.ease.cam` + grid ikut bergerak
(parallax 0.6× untuk grid, 1× untuk konten) → penonton merasakan ruang, bukan potongan slide.
Tambahkan **motion blur palsu** saat pan cepat: `scaleX` 1.04 + opacity grid turun sedikit selama 0.15s.

### Fase 4 — Komposisi & Pencahayaan (±4 hari)
1. **Skala**: objek hero minimal 45–60% tinggi frame (timer, kartu layanan, tile, end logo). Uji di 390px lebar.
2. **Rule of thirds** untuk frame berteks + objek (teks di sepertiga kiri, objek di kanan) — bergantian
   agar ada ritme kiri/kanan.
3. **Elevasi dinamis**: bayangan ikut "ketinggian". Saat elemen di-scale >1 (terangkat), bayangan makin
   lebar & lembut; saat mendarat, bayangan mengecil. Buat helper `lift(el, h)` yang memetakan h → shadow.
4. **Tekstur & cahaya**: noise/grain 3–4% overlay (SVG `feTurbulence` statis), vignette sangat lembut, dan
   gradient cahaya biru radial di scene biru agar tidak datar.
5. **Kontras palet**: tambah satu warna aksen hangat (mis. kuning/oranye kecil) khusus untuk momen
   "masalah" di S2 — biru tetap untuk "solusi". Warna jadi bercerita.

### Fase 5 — Brand & Artwork (±1 minggu) — *pembeda utama*
1. **Logo reveal**: path `#lgp` berisi dua bentuk cermin (subpath kedua dimulai di `m-1195 2361.8`).
   Pisahkan jadi dua `<path>`; animasikan keduanya meluncur dari sudut berlawanan lalu **mengunci** di tengah
   (sedikit overshoot `brand`), diikuti kotak biru `rx=880` yang tumbuh di belakangnya. Pakai di pembuka
   (0–1s) *dan* penutup → reel punya "bookend".
2. **Proses karya sebagai hero** (ganti/perkuat S4 B): satu ilustrasi besar full-frame dengan **wipe
   sketch → line-art → base color** (tiga gambar ditumpuk, `clip-path` mask menyapu diagonal), label tahap
   muncul menempel di garis sapuan. Kartu IG bisa tetap sebagai penutup kecil.
3. **Artwork di S1 B**: tile lebih sedikit tapi lebih besar (5–6), gerak parallax 3 lapis selama tahan
   (bukan hanya masuk lalu keluar), dan satu tile "dipilih" lalu zoom menjadi transisi.
4. **End card**: logo reveal + handle IG + URL dalam satu komposisi besar, tahan ≥ 2 detik diam (penonton
   butuh waktu membaca CTA).

### Fase 6 — Suara (±3 hari)
- Tambahkan track SFX yang dipicu dari timeline (`tl.call(sfx, ['pop'], t)`) — klik ketik, send "whoosh",
  checkbox tick, toggle switch, logo lock "thump".
- Musik latar dengan BPM tetap (mis. 100–110 BPM); **snap beat map ke grid ketukan** agar cut jatuh di beat.
- Hormati autoplay policy: suara aktif hanya setelah user menekan Play.

### Fase 7 — Performa, Aksesibilitas, Distribusi (±4 hari)
1. Ganti animasi `width/height/left/top/borderRadius` dengan **Flip plugin** atau transform + `clip-path: inset(round)`.
2. Hapus `filter: blur` per kata (sudah digantikan mask di Fase 2); jika tetap dipakai, batasi ke headline.
3. Pindahkan gambar base64 ke file `img/*.avif|webp` (lazy/preload sesuai scene) — HTML turun dari ~870 KB
   ke ±100 KB, first paint jauh lebih cepat.
4. `will-change: transform` hanya selama elemen beranimasi; hindari animasi `box-shadow` (animasikan opacity
   pseudo-element berbayang).
5. **`prefers-reduced-motion`**: versi yang men-*cut* (tanpa pan/scale besar), tetap menampilkan semua info.
6. **Mode scroll**: snap lembut ke label scene, dan saat scrub cepat nonaktifkan typewriter (tampilkan teks utuh).
7. **Varian 9:16 & 1:1** untuk Reels/feed: stage `900×1600` dengan layout ulang per scene (bukan crop),
   diekspor MP4 lewat harness Fase 0.

---

## 4. Urutan Kerja yang Disarankan

| Minggu | Fokus | Hasil yang bisa dilihat |
|---|---|---|
| 1 | Fase 0 + Fase 1 | Timeline modular, token motion, ritme tidak lagi "semua memantul" |
| 2 | Fase 3 (transisi & kamera) | Reel terasa satu shot mengalir di atas kanvas |
| 3 | Fase 2 + Fase 4 | Tipografi tajam, komposisi besar, cahaya/tekstur |
| 4 | Fase 5 | Logo reveal + showcase proses artwork |
| 5 | Fase 6 + Fase 7 | Suara, performa HP, versi 9:16, ekspor MP4 |

Kerjakan **scene demi scene**, tapi mulai dari S3→S4 dan S8 (pembuka-penutup brand) karena paling terlihat.

---

## 5. Checklist Kualitas per Scene (pakai saat review)

- [ ] Apakah ada **satu** fokus yang jelas di tiap frame? (Tutup mata 1 detik, buka — mata ke mana?)
- [ ] Apakah transisinya **bermakna** (match cut/morph/kamera), bukan fade?
- [ ] Apakah exit lebih cepat dari enter?
- [ ] Overshoot/settle hanya di momen brand?
- [ ] Teks terbaca di layar 390px, dan tahan ≥ (jumlah kata × 0.3s) + 0.5s?
- [ ] Gerak mengikuti grid 64px / arah bermakna?
- [ ] Jalan 60fps di HP menengah (Chrome DevTools, CPU 4× slowdown)?
- [ ] Beat jatuh di ketukan musik / kata VO?

---

## 6. Referensi Belajar

- *The Illusion of Life* — 12 prinsip animasi Disney (timing, spacing, anticipation, follow-through).
- Dokumentasi GSAP: Timeline position parameter, Flip, SplitText, CustomEase, MorphSVG.
- Studi reel produk: Apple product films, Linear / Stripe / Framer launch videos (bahasa motion UI yang tenang
  dan tegas), dan motion brand Buck / ManvsMachine untuk transisi match-cut.
