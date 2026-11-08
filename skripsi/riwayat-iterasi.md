# Riwayat Iterasi Motion Reel

Ekspor dari riwayat Git repositori `iluztar/iluztar.github.io` sebelum repositori dibuat ulang tanpa riwayat lama (untuk membersihkan data lama yang tidak lagi dipakai). Waktu dalam WIB (UTC+7).

Berkas ini menjadi bukti urutan iterasi pada Tabel 4.8 naskah skripsi.

## Ringkasan

- Pengembangan Motion Reel: **29 September 2026**, unggahan prototipe awal pukul 00.09 WIB, lalu **25 pull request** (berisi 34 commit pengembangan) digabungkan antara pukul 00.25 dan 10.02 WIB.
- Setiap pull request baru digabungkan setelah hasilnya ditinjau (human-in-the-loop).
- Tahap sesudahnya (pemindahan data ke PHP dan MySQL pada 29 September 2026 siang, dan mode animasi pembuka `?intro=1` pada 8 November 2026) dikerjakan di server ILUZTAR, lalu dimasukkan ke repositori pada 8 November 2026.

## Pull request yang digabungkan (29 September 2026)

| PR | Digabung (WIB) | Commit di dalamnya |
|---|---|---|
| #1 | 00.25 | • Add motion review and visual development plan<br>• Refine reel motion: easing tokens, calmer rhythm, directional cuts, logo lock-up<br>• Add README for the motion reel |
| #2 | 01.06 | • Show live Instagram profile counts in scene 8<br>• Rebuild reel motion to match the reference cut; add gradient canvas and dark/light theme |
| #3 | 02.05 | • Restore earlier improvements on top of the new motion; light default theme; mobile controls<br>• Minimal black capsule controls (browse bar, player, scene chips, hint)<br>• Step slow moves on the soundtrack's beats; keep the calendar upright<br>• Admin login to replace the audio track and sample images (Supabase); end card on the grid<br>• Connect the admin panel to the iluztar Supabase project<br>• Readable on phones; eye glances; Your Ownership as type |
| #4 | 02.18 | • Make the reel interactive; real service lists; iMessage tails on every bubble; smooth calendar pull-back<br>• Proper admin: login with password reset, tabs for contacts, profile, media and account |
| #5 | 02.31 | • Service cards: roomier list and a footer row (note left, Order right) |
| #6 | 02.34 | • Add favicon.ico and version the favicon links so cached icons refresh |
| #7 | 02.49 | • Smoother animation; shuffle the service cards; pick stages that go into the order |
| #8 | 05.27 | • Close the remaining gaps between shots |
| #9 | 06.30 | • Add project background: thesis context and video-to-website method |
| #10 | 06.37 | • Lock admin writes to listed emails; sign out non-admin accounts |
| #11 | 06.54 | • Redesign the admin panel; nothing cropped on phones; credit Alight Motion |
| #12 | 07.00 | • Type every chat message in the input bar before its bubble is sent |
| #13 | 07.18 | • Fix IG card flashes, pre-decode images, and isolate the admin panel from the page |
| #14 | 09.13 | • Admin: redraw the restore (undo) icon as a clean return arrow |
| #15 | 09.15 | • Folder tiles: keep the papers inside the folder and polish the style |
| #16 | 09.18 | • Landing-page mock for the website shot; closing chat matches the opening chat size |
| #17 | 09.20 | • One folder icon for every 'piece' in the film |
| #18 | 09.21 | • Refine toggle: swipe the knob right and fill the toggle white before it becomes the request pill |
| #19 | 09.25 | • Crisp scaled elements and a clean calendar page turn |
| #20 | 09.31 | • Ownership arrow, arrow-head sync, and a fuller Instagram card |
| #21 | 09.38 | • Location to network: the Indonesia pill rounds into a circle, hops and lands as the network centre |
| #22 | 09.41 | • Scroll cue: dark capsule with an animated mouse wheel, aligned with the control bar |
| #23 | 09.44 | • Plate.file in the shared folder style, profile buttons animate in, main-only Vercel deploys |
| #24 | 09.50 | • Instagram cover-flow: keep cards on their own layer, depth instead of scale for side cards |
| #25 | 10.02 | • Separate soundtrack for the Cut version |

## Seluruh commit pengembangan (29 September – 8 November 2026)

| Waktu (WIB) | Commit |
|---|---|
| 29-09 00.07 | Delete css directory |
| 29-09 00.07 | Delete img directory |
| 29-09 00.07 | Delete js directory |
| 29-09 00.07 | Delete slide directory |
| 29-09 00.08 | Delete about.html |
| 29-09 00.08 | Delete sw.js |
| 29-09 00.08 | Delete index.html |
| 29-09 00.09 | Add files via upload |
| 29-09 00.14 | Add motion review and visual development plan |
| 29-09 00.21 | Refine reel motion: easing tokens, calmer rhythm, directional cuts, logo lock-up |
| 29-09 00.22 | Add README for the motion reel |
| 29-09 00.25 | Show live Instagram profile counts in scene 8 |
| 29-09 01.03 | Rebuild reel motion to match the reference cut; add gradient canvas and dark/light theme |
| 29-09 01.24 | Restore earlier improvements on top of the new motion; light default theme; mobile controls |
| 29-09 01.30 | Minimal black capsule controls (browse bar, player, scene chips, hint) |
| 29-09 01.35 | Step slow moves on the soundtrack's beats; keep the calendar upright |
| 29-09 01.42 | Admin login to replace the audio track and sample images (Supabase); end card on the grid |
| 29-09 01.48 | Connect the admin panel to the iluztar Supabase project |
| 29-09 02.04 | Readable on phones; eye glances; Your Ownership as type |
| 29-09 02.12 | Make the reel interactive; real service lists; iMessage tails on every bubble; smooth calendar pull-back |
| 29-09 02.17 | Proper admin: login with password reset, tabs for contacts, profile, media and account |
| 29-09 02.28 | Service cards: roomier list and a footer row (note left, Order right) |
| 29-09 02.34 | Add favicon.ico and version the favicon links so cached icons refresh |
| 29-09 02.48 | Smoother animation; shuffle the service cards; pick stages that go into the order |
| 29-09 05.27 | Close the remaining gaps between shots |
| 29-09 06.30 | Add project background: thesis context and video-to-website method |
| 29-09 06.37 | Lock admin writes to listed emails; sign out non-admin accounts |
| 29-09 06.53 | Redesign the admin panel; nothing cropped on phones; credit Alight Motion |
| 29-09 07.00 | Type every chat message in the input bar before its bubble is sent |
| 29-09 07.17 | Fix IG card flashes, pre-decode images, and isolate the admin panel from the page |
| 29-09 09.13 | Admin: redraw the restore (undo) icon as a clean return arrow |
| 29-09 09.14 | Folder tiles: keep the papers inside the folder and polish the style |
| 29-09 09.18 | Landing-page mock for the website shot; closing chat matches the opening chat size |
| 29-09 09.20 | One folder icon for every 'piece' in the film |
| 29-09 09.21 | Refine toggle: swipe the knob right and fill the toggle white before it becomes the request pill |
| 29-09 09.25 | Crisp scaled elements and a clean calendar page turn |
| 29-09 09.31 | Ownership arrow, arrow-head sync, and a fuller Instagram card |
| 29-09 09.38 | Location to network: the Indonesia pill rounds into a circle, hops and lands as the network centre |
| 29-09 09.41 | Scroll cue: dark capsule with an animated mouse wheel, aligned with the control bar |
| 29-09 09.44 | Plate.file in the shared folder style, profile buttons animate in, main-only Vercel deploys |
| 29-09 09.49 | Instagram cover-flow: keep cards on their own layer, depth instead of scale for side cards |
| 29-09 10.02 | Separate soundtrack for the Cut version |
| 08-11 11.48 | Motion terbaru dari server ILUZTAR + aset, data, dan lampiran skripsi |
| 08-11 11.51 | README: animasi kode responsif terhadap ukuran layar |
| 08-11 11.56 | Hapus workflow dan data statistik Instagram versi lama |

## Riwayat sebelumnya: website statis di GitHub Pages

Sebelum menjadi Motion Reel, repositori ini menampung *website* statis ILUZTAR (Gambar 4.7a). Jumlah commit per bulan:

| Bulan | Commit |
|---|---|
| 2022-02 | 5 |
| 2022-09 | 6 |
| 2022-10 | 29 |
| 2022-11 | 8 |
| 2024-03 | 9 |
| 2025-03 | 9 |
| 2025-04 | 31 |
| 2025-05 | 13 |
| 2025-06 | 4 |
| 2025-07 | 7 |
| 2026-02 | 15 |
| 2026-06 | 4 |
| 2026-07 | 3 |
