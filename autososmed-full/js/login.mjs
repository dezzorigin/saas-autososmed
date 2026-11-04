// Login manual 1x per akun: node login.mjs ig-produk01
// Buka browser, login manual di jendela, tekan ENTER -> sesi tersimpan di ../sessions/<id>/
import { chromium } from 'playwright';
import readline from 'readline';

const id = process.argv[2];
if (!id) { console.error('pakai: node login.mjs <platform-akun>'); process.exit(1); }
const ctx = await chromium.launchPersistentContext(`../sessions/${id}`, { headless: false, viewport: { width: 1280, height: 800 } });
const page = ctx.pages()[0] || await ctx.newPage();
await page.goto('https://www.google.com');
console.log(`Login manual untuk ${id} di jendela browser, lalu tekan ENTER di sini...`);
await new Promise(res => readline.createInterface({ input: process.stdin }).on('line', res));
await ctx.close();
console.log(`sesi ${id} tersimpan.`);
