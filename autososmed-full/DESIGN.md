# DESIGN.md — AutoSosmed

## 1. Konsep
"Broadcast master control": konsol ruang siaran untuk tim yang
menjadwalkan 21 siaran/hari. Satu elemen memorable = **strip runway
amber** (timeline antrian vertikal dengan garis sinyal). Sisanya tenang
dan disiplin.

## 2. Token
- graphite `#1B2430` (latar), ink `#141B25` (header/runway), graphite-2 `#232F3F` (panel bukti)
- paper `#F4F2EA` (kartu konten), paper-2 `#ECE8DB` (chip pipeline)
- amber `#FFB224` (satu-satunya aksen: badge, waktu, tombol, strip)
- steel `#8A94A6` (teks sekunder), ok `#2E9E5B`, warn `#C77414`, bad `#C23B3B`
- radius 14px kartu, 10px kontrol, 999px status pill.

## 3. Tipografi
Satu keluarga: Space Grotesk (display) + Inter (body), fallback system-ui.
Waktu pakai tabular-nums. Tanpa label all-caps, tanpa eyebrow di tiap heading,
tanpa aksen satu kata di headline.

## 4. Layout web (3 kolom → 1 di mobile)
- Kiri: Akun & sesi — 21 baris (7 produk × 3 platform), dot hijau/merah,
  tombol tandai mati/hidup, persist localStorage.
- Tengah: Antrian 21 slot — runway amber (waktu + tenant + caption +
  status pill), tombol susun/simulasi/unduh, textarea template, stepper
  pipeline 10 node (penomoran = urutan asli, bukan dekorasi).
- Kanan: Bukti jalan — log gelap, auto-scroll, nanti + thumbnail + URL.

## 5. Arsitektur
```
[Pages: web statis] -- campaign bundle --> [API Dokploy: queue + Postgres]
[API] -- FIFO per platform --> [Worker Playwright x3: ig/threads, tiktok]
[Worker] -- 1 persistent-context per akun --> [web IG/Threads/TikTok]
[Worker] -- screenshot + URL --> [Evidence store + Discord notify]
```
Web tidak menyimpan kredensial. Login sesi hanya di mesin worker
(`js/login.mjs` buka browser asli, operator login manual 1x).

## 6. Model data
- Tenant: `{id, nama, akun:{ig, threads, tiktok}, slot_harian:3}`
- Campaign: `{id, nama, media[], caption_template, target_tenants[], platforms[], jadwal}`
- Job: `{id = tenant+hash(caption+slot), tenant, platform, waktu, caption, media_variant, status}`
- Session: `{id = platform-tenant, status: live/dead, last_check}`
- Evidence: `{job_id, waktu_eksekusi, screenshot_path, post_url, status}`

## 7. Aturan anti-ban (ringkas, penuh di ARCHITECTURE.md)
Serial per akun, jeda IG 90 / Threads 45 / TikTok 120 mnt + jitter ±25,
jam 07–22, caption spintax, media ubah hash per akun, captcha = stop.
