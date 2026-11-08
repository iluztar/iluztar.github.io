// Bandingkan beranda situs lama (hostinger/) dan baru (iluztar-personal) dari sisi SEO dan performa, + tangkapan layar.
import { chromium } from '../node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const OUT = 'D:/01_Kuliah_TI/01_Skripsi/00_Revisi_Pasca_Semhas_Website_Motion_ILUZTAR/03_Gambar';
const CHROMIUM = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const SITUS = { lama: 'http://localhost/iluztar/hostinger/', baru: 'http://localhost/iluztar/hostinger/dev/iluztar-personal/public_html/' };
const tunggu = ms => new Promise(r => setTimeout(r, ms));
const hasil = {};
const b = await chromium.launch({ executablePath: CHROMIUM });
for (const [nama, url] of Object.entries(SITUS)) {
  // 1. HTML mentah (tanpa JS): yang dibaca perayap
  const r = await fetch(url + (nama === 'baru' ? '?intro=0' : ''));
  const html = await r.text();
  const cari = re => (html.match(re) || [])[1] || '';
  const jsonld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map(m => { try { const j = JSON.parse(m[1]); return [].concat(j['@graph'] || j).map(x => x['@type']).flat(); } catch { return ['(tidak valid)']; } }).flat();
  const teks = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').split(/\s+/).filter(w => /\w/.test(w));
  const seo = {
    title: cari(/<title>([^<]*)<\/title>/), meta_description: cari(/<meta name="description" content="([^"]*)"/).length + ' karakter',
    canonical: /<link rel="canonical"/.test(html), hreflang: (html.match(/hreflang=/g) || []).length,
    open_graph: (html.match(/property="og:/g) || []).length, twitter_card: /name="twitter:card"/.test(html),
    json_ld: [...new Set(jsonld)].join(', ') || '-', h1: (html.match(/<h1[\s>]/g) || []).length,
    lang: cari(/<html[^>]*lang="([^"]+)"/), kata_tanpa_js: teks.length,
    img_tanpa_alt: (html.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length,
    x_robots_tag: r.headers.get('x-robots-tag') || '-',
  };
  // 2. Performa (desktop, cold cache, 3x) + video
  const ukur = [];
  for (let i = 0; i < 3; i++) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const pg = await ctx.newPage();
    const cdp = await ctx.newCDPSession(pg); await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    let bytes = 0, video = 0; cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; });
    cdp.on('Network.responseReceived', e => { if (/video\//.test(e.response.mimeType)) video++; });
    await pg.addInitScript(() => { window.__lcp = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); });
    await pg.goto(url + (nama === 'baru' ? '?intro=0' : ''), { waitUntil: 'load' }); await tunggu(4000);
    const m = await pg.evaluate(() => ({ lcp: Math.round(window.__lcp), load: Math.round(performance.getEntriesByType('navigation')[0].loadEventEnd), elemen_video: document.querySelectorAll('video').length, iframe_video: [...document.querySelectorAll('iframe')].filter(f => /youtube|vimeo|video/.test(f.src)).length }));
    ukur.push({ ...m, transfer_kb: Math.round(bytes / 1024), respons_video: video });
    if (i === 0) {
      await pg.screenshot({ path: `${OUT}/situs_${nama}_beranda_1440.png` });
      await pg.screenshot({ path: `${OUT}/situs_${nama}_beranda_penuh.png`, fullPage: true });
    }
    await ctx.close();
  }
  const rata = k => Math.round(ukur.reduce((s, x) => s + x[k], 0) / ukur.length);
  hasil[nama] = { url, seo, performa: { lcp_ms: rata('lcp'), load_ms: rata('load'), transfer_kb: rata('transfer_kb'), elemen_video: ukur[0].elemen_video, iframe_video: ukur[0].iframe_video, respons_video: ukur[0].respons_video } };
}
await b.close();
fs.writeFileSync(`${OUT}/data_banding_situs.json`, JSON.stringify(hasil, null, 2));
console.log(JSON.stringify(hasil, null, 2));
