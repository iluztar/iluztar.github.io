// Ukur FCP, LCP, CLS, TBT (perkiraan dari long task), waktu load, dan ukuran transfer. 5x per profil, cold cache.
import { chromium } from '../node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const OUT = 'D:/01_Kuliah_TI/01_Skripsi/00_Revisi_Pasca_Semhas_Website_Motion_ILUZTAR/03_Gambar';
const URL = 'http://localhost/iluztar/hostinger/dev/motion/';
const CHROMIUM = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const PROFIL = {
  desktop: { vp: { width: 1440, height: 810 }, cpu: 1, net: null, mobile: false },
  hp: { vp: { width: 390, height: 844 }, cpu: 4, net: { latency: 150, downloadThroughput: 9 * 1024 * 1024 / 8, uploadThroughput: 1.5 * 1024 * 1024 / 8 }, mobile: true },
};
const INIT = `window.__m={lcp:0,cls:0,tbt:0,fcp:0};
new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__m.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__m.cls+=e.value}).observe({type:'layout-shift',buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries()) if(e.name==='first-contentful-paint') window.__m.fcp=e.startTime}).observe({type:'paint',buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__m.tbt+=Math.max(0,e.duration-50)}).observe({type:'longtask',buffered:true});`;
const hasil = {};
const b = await chromium.launch({ executablePath: CHROMIUM });
for (const [nama, p] of Object.entries(PROFIL)) {
  hasil[nama] = [];
  for (let i = 0; i < 5; i++) {
    const ctx = await b.newContext({ viewport: p.vp, isMobile: p.mobile, hasTouch: p.mobile });
    const pg = await ctx.newPage();
    const cdp = await ctx.newCDPSession(pg);
    await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    if (p.net) await cdp.send('Network.emulateNetworkConditions', { offline: false, ...p.net });
    if (p.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu });
    let bytes = 0; cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; });
    await pg.addInitScript(INIT);
    await pg.goto(URL, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 3000));
    const m = await pg.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { ...window.__m, load: n.loadEventEnd, dcl: n.domContentLoadedEventEnd }; });
    hasil[nama].push({ fcp_ms: Math.round(m.fcp), lcp_ms: Math.round(m.lcp), cls: +m.cls.toFixed(3), tbt_ms: Math.round(m.tbt), dcl_ms: Math.round(m.dcl), load_ms: Math.round(m.load), transfer_kb: Math.round(bytes / 1024) });
    await ctx.close();
  }
}
await b.close();
const rata = a => Object.fromEntries(Object.keys(a[0]).map(k => [k, +(a.reduce((s, x) => s + x[k], 0) / a.length).toFixed(k === 'cls' ? 3 : 0)]));
const ringkas = Object.fromEntries(Object.entries(hasil).map(([k, v]) => [k, { rata_rata: rata(v), per_percobaan: v }]));
fs.writeFileSync(`${OUT}/data_performa.json`, JSON.stringify(ringkas, null, 2));
console.log(JSON.stringify(Object.fromEntries(Object.entries(ringkas).map(([k, v]) => [k, v.rata_rata])), null, 2));
