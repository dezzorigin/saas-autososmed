// Poster terjadwal (kerangka): node poster.mjs <campaign.json>
// 1 akun = 1 persistent-context, serial + jeda+jitter, simpan evidence screenshot+URL.
// SELECTOR upload berubah-ubah — sesuaikan saat implementasi per platform.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';

const campaign = JSON.parse(readFileSync(process.argv[2] || '../json/campaign.contoh.json', 'utf8'));
console.log(`campaign ${campaign.id}: ${campaign.target_tenants.length} tenants x ${campaign.platforms.join(',')}`);
console.log('DRY-RUN: belum posting (butuh sesi login + selector per platform). Isi poster per platform di sini.');
mkdirSync('../evidence', { recursive: true });
