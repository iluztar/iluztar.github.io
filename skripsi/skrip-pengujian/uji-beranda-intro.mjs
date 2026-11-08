import { chromium } from '../node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const CHROMIUM = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const URL = 'http://localhost/iluztar/hostinger/dev/iluztar-personal/public_html/';
const RILIS = 'D:/uji-claude/rilis/intro-beranda';
const SKR = 'D:/01_Kuliah_TI/01_Skripsi/00_Revisi_Pasca_Semhas_Website_Motion_ILUZTAR/03_Gambar';
fs.mkdirSync(RILIS, { recursive: true });
const tunggu = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: CHROMIUM });
const hasil = {};
async function konteks(opsi = {}) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opsi });
  const pg = await ctx.newPage(); const galat = [];
  // waitForFunction bawaan memakai eval dan diblokir CSP situs; evaluate (CDP) tidak.
  pg.waitForFunction = async (fn, _a, opt = {}) => { const t = Date.now(); while (Date.now() - t < (opt.timeout || 30000)) { if (await pg.evaluate(fn).catch(() => false)) return; await tunggu(150); } throw new Error('timeout menunggu kondisi'); };
  pg.on('console', m => { if (m.type() === 'error') galat.push(m.text().slice(0, 160)); });
  pg.on('pageerror', e => galat.push('pageerror: ' + e.message.slice(0, 160)));
  await pg.addInitScript(() => document.addEventListener('securitypolicyviolation', e => console.error('CSP ' + e.violatedDirective + ' ' + e.blockedURI)));
  return { ctx, pg, galat };
}
const ada = pg => pg.evaluate(() => !!document.getElementById('ilz-intro') && document.documentElement.classList.contains('ilz-intro-aktif'));

// 1. alur penuh + kunjungan ulang
{
  const { ctx, pg, galat } = await konteks(); const t0 = Date.now();
  await pg.goto(URL, { waitUntil: 'domcontentloaded' });
  await tunggu(250); await pg.screenshot({ path: `${RILIS}/1-loader-1440.png` });
  await pg.waitForFunction(() => document.querySelector('#ilz-intro.is-siap'), null, { timeout: 15000 });
  const siap = (Date.now() - t0) / 1000;
  await tunggu(2500); await pg.screenshot({ path: `${RILIS}/2-reel-1440.png` });
  await tunggu(9000); await pg.screenshot({ path: `${RILIS}/3-reel-tengah-1440.png` });
  await pg.waitForFunction(() => !document.getElementById('ilz-intro'), null, { timeout: 45000 });
  const tutup = (Date.now() - t0) / 1000;
  await tunggu(400); await pg.screenshot({ path: `${RILIS}/4-halaman-utama-1440.png` });
  const ss = await pg.evaluate(() => sessionStorage.getItem('ilz-intro'));
  const scrollOk = await pg.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden' && ![...document.body.children].some(n => n.inert));
  await pg.reload({ waitUntil: 'domcontentloaded' }); await tunggu(400);
  hasil.alur_penuh = { reel_siap_detik: +siap.toFixed(1), tertutup_otomatis_detik: +tutup.toFixed(1), sessionStorage: ss, halaman_bisa_digulir: scrollOk, kunjungan_ulang_tanpa_intro: !(await ada(pg)), galat };
  await ctx.close();
}
// 2. tombol Lewati
{
  const { ctx, pg, galat } = await konteks();
  await pg.goto(URL, { waitUntil: 'domcontentloaded' }); await tunggu(3000);
  const fokus = await pg.evaluate(() => document.activeElement && document.activeElement.className);
  const t = Date.now(); await pg.click('.ilz-intro__lewati');
  await pg.waitForFunction(() => !document.getElementById('ilz-intro'), null, { timeout: 3000 });
  hasil.lewati = { fokus_awal: fokus, tertutup_ms: Date.now() - t, galat };
  await ctx.close();
}
// 3. Esc
{
  const { ctx, pg } = await konteks();
  await pg.goto(URL, { waitUntil: 'domcontentloaded' }); await tunggu(2500);
  await pg.keyboard.press('Escape');
  await pg.waitForFunction(() => !document.getElementById('ilz-intro'), null, { timeout: 3000 }).then(() => hasil.esc = 'tertutup', () => hasil.esc = 'GAGAL');
  await ctx.close();
}
// 4. reduced motion, 5. ?intro=0
{
  const { ctx, pg } = await konteks({ reducedMotion: 'reduce' });
  await pg.goto(URL, { waitUntil: 'domcontentloaded' }); await tunggu(500);
  hasil.reduced_motion_tanpa_intro = !(await ada(pg)) && !(await pg.$('#ilz-intro'));
  await pg.goto(URL + '?intro=0', { waitUntil: 'domcontentloaded' }); await tunggu(500);
  await ctx.close();
  const k2 = await konteks(); await k2.pg.goto(URL + '?intro=0', { waitUntil: 'domcontentloaded' }); await tunggu(500);
  hasil.intro_0_tanpa_intro = !(await ada(k2.pg)); await k2.ctx.close();
}
// 6. HP
{
  const { ctx, pg, galat } = await konteks({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await pg.goto(URL, { waitUntil: 'domcontentloaded' }); await tunggu(250);
  await pg.screenshot({ path: `${RILIS}/5-loader-390.png` });
  await pg.waitForFunction(() => document.querySelector('#ilz-intro.is-siap'), null, { timeout: 15000 }); await tunggu(2500);
  await pg.screenshot({ path: `${RILIS}/6-reel-390.png` });
  await pg.tap('.ilz-intro__lewati'); await pg.waitForFunction(() => !document.getElementById('ilz-intro'), null, { timeout: 3000 }); await tunggu(400);
  await pg.screenshot({ path: `${RILIS}/7-halaman-utama-390.png` });
  hasil.hp = { galat };
  await ctx.close();
}
await b.close();
for (const f of fs.readdirSync(RILIS)) fs.copyFileSync(`${RILIS}/${f}`, `${SKR}/intro_${f}`);
fs.writeFileSync(`${SKR}/data_uji_intro.json`, JSON.stringify(hasil, null, 2));
console.log(JSON.stringify(hasil, null, 2));
