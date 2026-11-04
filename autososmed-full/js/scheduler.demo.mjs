// Demo scheduler: validasi tenants + pipeline + campaign, simulasi 21 slot + dedupe.
// Jalur 2: cron -> load_tenant -> entitlement -> auth reuse -> fetch -> normalize_dedupe -> execute -> notify -> evidence
import { readFileSync } from 'fs';
import { createHash } from 'crypto';

const tenants = JSON.parse(readFileSync('../json/tenants.json', 'utf8'));
const pipeline = JSON.parse(readFileSync('../json/pipeline.json', 'utf8'));
const campaign = JSON.parse(readFileSync('../json/campaign.contoh.json', 'utf8'));

// 1. entitlement check (stub: semua tenant aktif)
const entitled = tenants.tenants.filter(t => campaign.target_tenants.includes(t.id));
console.log(`tenants entitled: ${entitled.length}/${tenants.tenants.length}`);

// 2. expand spintax 1x per tenant (demo deterministik via index)
function spin(tpl, i) {
  return tpl.replace(/\{([^}]+)\}/g, (_, g) => g.split('|')[i % g.split('|').length]);
}
const jobs = [];
for (const t of entitled) {
  for (let s = 0; s < t.slot_harian; s++) {
    const caption = spin(campaign.caption_template.replace('{produk}', t.nama).replace('{produkTag}', t.id), entitled.indexOf(t) + s);
    const id = t.id + '+' + createHash('sha256').update(campaign.id + t.id + caption + s).digest('hex').slice(0, 12);
    jobs.push({ id, tenant: t.id, slot: s + 1, caption });
  }
}
console.log(`jobs generated: ${jobs.length} (target 21)`);

// 3. dedupe: id unik -> lolos semua
const uniq = new Set(jobs.map(j => j.id));
console.log(`dedupe: ${uniq.size}/${jobs.length} unik`);

// 4. staggered schedule 07:00-22:00 + jitter deterministik
const startMin = 7 * 60, endMin = 22 * 60;
jobs.forEach((j, i) => {
  const base = startMin + Math.floor((endMin - startMin) * i / jobs.length);
  const jitter = ((i * 37) % 51) - 25; // -25..+25
  const m = base + jitter;
  j.waktu = String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
});
console.log('slot pertama:', jobs[0].waktu, '| slot terakhir:', jobs[jobs.length - 1].waktu);

// 5. pipeline contract check
const need = ['cron','load_tenant','entitlement','auth_reuse','normalize_dedupe','execute_browser_post','evidence'];
const missing = need.filter(n => !pipeline.nodes.includes(n));
if (missing.length) { console.error('PIPELINE MISSING:', missing.join(',')); process.exit(1); }
console.log('pipeline OK:', pipeline.nodes.length, 'nodes');

// 6. anti-duplicate media note
console.log('media rule:', tenants.aturan_jalur2.variasi_media.slice(0, 60) + '...');
console.log('DEMO PASS');
