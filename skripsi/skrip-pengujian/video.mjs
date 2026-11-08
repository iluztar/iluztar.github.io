import { chromium } from '../node_modules/playwright-core/index.mjs';
import fs from 'node:fs';

const OUT = 'D:/01_Kuliah_TI/01_Skripsi/00_Revisi_Pasca_Semhas_Website_Motion_ILUZTAR/03_Gambar';
const VBARU = 'D:/01_Kuliah_TI/01_Skripsi/05_Aset_Video_Audio/Video/ILUZTAR_Video_Explainer_Referensi_2026-09-26.mp4';
const VLAMA = 'D:/01_Kuliah_TI/01_Skripsi/05_Aset_Video_Audio/Video/ILUZTAR_Brand_Anthem_2026-07-11.mp4';
const URL_REEL = 'http://localhost/iluztar/hostinger/dev/motion/';
const CHROMIUM = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const SCENE_T = [0, 10.72, 19.95, 21.62, 31.3, 39.5, 49.4, 58.3];
const TITIK = SCENE_T.map((t, i) => +(t + (i === 2 ? 0.9 : 3.0)).toFixed(2));
const tunggu = ms => new Promise(r => setTimeout(r, ms));
const data = {};
const fileUrl = p => 'file:///' + p.replace(/\\/g, '/').split('/').map(encodeURIComponent).join('/').replace(/^D%3A/, 'D:');

// ---------- A. pengukuran halaman reel ----------
{
  const b = await chromium.launch({ executablePath: CHROMIUM });
  const pg = await b.newPage({ viewport: { width: 1440, height: 810 } });
  await pg.goto(URL_REEL, { waitUntil: 'networkidle' });
  await pg.waitForFunction(() => window.__reel && typeof window.__reel.seek === 'function');
  await tunggu(800);
  Object.assign(data, await pg.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource');
    const ukur = r => r.transferSize || r.encodedBodySize || 0;
    const kb = n => Math.round(n / 1024);
    const per = {};
    for (const r of res) { const k = /\.js(\?|$)/.test(r.name) ? 'js' : /\.css(\?|$)/.test(r.name) ? 'css' : /\.(png|jpe?g|webp|svg|gif|avif)(\?|$)/.test(r.name) ? 'gambar' : /\.(woff2?|ttf|otf)(\?|$)/.test(r.name) ? 'font' : 'lain'; per[k] = (per[k] || 0) + ukur(r); }
    for (const k in per) per[k] = kb(per[k]);
    return {
      muat: { dom_content_loaded_ms: Math.round(nav.domContentLoadedEventEnd), load_ms: Math.round(nav.loadEventEnd), html_kb: kb(ukur(nav)), total_kb: kb(ukur(nav) + res.reduce((s, r) => s + ukur(r), 0)), per_jenis_kb: per, jumlah_request: res.length + 1 },
      dom: {
        title: document.title, description: document.querySelector('meta[name=description]')?.content, lang: document.documentElement.lang,
        h1: document.querySelectorAll('h1').length, h2: document.querySelectorAll('h2').length,
        og: [...document.querySelectorAll('meta[property^="og:"]')].map(m => m.getAttribute('property')),
        canonical: !!document.querySelector('link[rel=canonical]'), noscript: document.querySelectorAll('noscript').length, jsonld: document.querySelectorAll('script[type="application/ld+json"]').length,
        scenes: [...document.querySelectorAll('section.scene')].map(s => ({ id: s.id, label: s.getAttribute('aria-label'), teks: (s.querySelector('.vo')?.textContent || s.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 160) })),
        kata_di_dom: document.body.innerText.split(/\s+/).filter(Boolean).length, svg: document.querySelectorAll('svg').length, canvas: document.querySelectorAll('canvas').length, video: document.querySelectorAll('video').length,
      },
    };
  }));
  data.durasi_reel = await pg.evaluate(() => { window.__reel.seek(9999); return window.__reel.time(); });
  // teks yang terlihat tanpa JavaScript (bukti SEO)
  const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 810 } });
  const p2 = await ctx.newPage();
  await p2.goto(URL_REEL, { waitUntil: 'load' });
  data.tanpa_js = { kata: await p2.evaluate(() => document.body.innerText.split(/\s+/).filter(Boolean).length), contoh: (await p2.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 400) };
  await p2.screenshot({ path: `${OUT}/reel_tanpa_javascript.png` });
  await b.close();
}

// ---------- B. frame video (Edge) ----------
const PLAYER = 'D:/uji-claude/kh/skripsi/player.html';
async function ambilFrame(pg, videoPath, titik, awalan) {
  fs.writeFileSync(PLAYER, `<!doctype html><html><body style="margin:0;background:#000"><video id="v" src="${fileUrl(videoPath)}" muted preload="auto" style="width:1440px;height:810px;object-fit:contain;display:block"></video></body></html>`);
  await pg.goto(fileUrl(PLAYER));
  const dur = await pg.evaluate(() => new Promise((ok, no) => { const v = document.getElementById('v'); if (v.readyState >= 1) return ok(v.duration); v.onloadedmetadata = () => ok(v.duration); v.onerror = () => no('video error ' + (v.error && v.error.code)); setTimeout(() => no('timeout metadata'), 30000); }));
  const pts = typeof titik === 'function' ? titik(dur) : titik;
  for (let i = 0; i < pts.length; i++) {
    await pg.evaluate(t => new Promise(ok => { const v = document.getElementById('v'); v.onseeked = () => ok(); v.currentTime = t; }), Math.min(pts[i], dur - 0.1));
    await tunggu(350);
    await pg.screenshot({ path: `${OUT}/${awalan}${i + 1}.png` });
  }
  return { durasi_detik: +dur.toFixed(2), titik: pts };
}
{
  const e = await chromium.launch({ executablePath: EDGE, args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const pg = await e.newPage({ viewport: { width: 1440, height: 810 } });
  data.video_baru = await ambilFrame(pg, VBARU, TITIK, 'video_s');
  data.video_baru.ukuran_mb = +(fs.statSync(VBARU).size / 1048576).toFixed(1);
  const lima = d => [0.08, 0.3, 0.5, 0.7, 0.92].map(f => +(d * f).toFixed(2));
  data.video_baru_lima = await ambilFrame(pg, VBARU, lima, 'sesudah_');
  data.video_lama = await ambilFrame(pg, VLAMA, lima, 'sebelum_');
  data.video_lama.ukuran_mb = +(fs.statSync(VLAMA).size / 1048576).toFixed(1);
  await e.close();
}

// ---------- C. gambar banding ----------
{
  const c = await chromium.launch({ executablePath: CHROMIUM });
  const pg = await c.newPage({ viewport: { width: 1600, height: 560 } });
  const img = f => 'data:image/png;base64,' + fs.readFileSync(`${OUT}/${f}`).toString('base64');
  const dua = async (a, la, bb, lb, out) => {
    await pg.setContent(`<html><body style="margin:0;background:#fff;font:600 20px Arial;color:#111"><div style="display:flex;gap:16px;padding:16px">
      <figure style="margin:0;flex:1"><img src="${img(a)}" style="width:100%;border:1px solid #999"><figcaption style="padding-top:8px">${la}</figcaption></figure>
      <figure style="margin:0;flex:1"><img src="${img(bb)}" style="width:100%;border:1px solid #999"><figcaption style="padding-top:8px">${lb}</figcaption></figure></div></body></html>`);
    await pg.screenshot({ path: `${OUT}/${out}`, fullPage: true });
  };
  for (let i = 0; i < TITIK.length; i++) await dua(`video_s${i + 1}.png`, `(a) Video explainer (Alight Motion), detik ${TITIK[i]}`, `reel_s${i + 1}_desktop.png`, `(b) Rekonstruksi GSAP/HTML5, detik ${TITIK[i]}`, `banding_s${i + 1}.png`);
  for (let i = 0; i < 5; i++) await dua(`sebelum_${i + 1}.png`, `(a) Sebelum: video musik hip-hop, detik ${data.video_lama.titik[i]}`, `sesudah_${i + 1}.png`, `(b) Sesudah: video explainer, detik ${data.video_baru_lima.titik[i]}`, `sebelum_sesudah_${i + 1}.png`);
  await c.close();
}
data.titik_banding = TITIK;
fs.writeFileSync(`${OUT}/data_pengukuran.json`, JSON.stringify(data, null, 2));
console.log(JSON.stringify(data, null, 2));

