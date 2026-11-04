# PRD — AutoSosmed

## 1. Masalah
Tim builder/founder memegang ±7 produk, masing-masing butuh ±3 post/hari
di TikTok, Instagram, Threads. Manual = 21 post/hari, tidak scalable.
API resmi sempit (TikTok perlu audit/app-approved, IG maks 100 post/24 jam,
Threads maks 250/24 jam, semua akun harus OAuth satu-satu). Keputusan:
**jalur browser automation** (Playwright, session cookie reuse).

## 2. Pengguna
Tim internal (builder + founder). Satu web bersama di
`autososmed.pages.dev`. Backend/worker nanti di VM Dokploy.

## 3. Scope prototype (sekarang)
- Web statis: dashboard akun & sesi, antrian 21 slot, composer campaign,
  alur pipeline, log bukti. Data di browser (localStorage).
- Kontrak pipeline: cron → load_tenant → entitlement → auth_reuse →
  captcha_login_branch → fetch_content → normalize_dedupe →
  execute_browser_post → notify + evidence.
- Scheduler demo + kerangka login/poster Playwright.

## 4. Scope backend (nanti, VM Dokploy)
- API: terima campaign bundle, simpan queue (Postgres/SQLite).
- Worker Playwright: 1 persistent-context per akun (21 profil),
  eksekusi serial per platform + jeda + jitter.
- Evidence: screenshot + URL postingan per job. Notif ke Discord.
- Session vault: cookie terenkripsi, re-login hanya saat mati.

## 5. Kebutuhan fungsional
- F1: CRUD 7+ tenant + 21 akun (IG/Threads/TikTok per produk).
- F2: Campaign = media + caption template (spintax) + target tenant +
  platform → fan-out jadi N job dengan caption bervariasi.
- F3: Scheduler staggered 07:00–22:00, jeda per akun (IG 90, Threads 45,
  TikTok 120 mnt) + jitter ±25 mnt.
- F4: Dedupe: job id = tenant + hash(scope+caption+slot); hash sama dilewat.
- F5: Status sesi per akun (hidup/mati), tandai manual + deteksi otomatis.
- F6: Evidence per job: waktu, akun, status, screenshot, URL.
- F7: Export antrian JSON.

## 6. Kebutuhan non-fungsional
- Web: statis, tanpa build step, tanpa kredensial di frontend, mobile OK,
  keyboard focus terlihat, hormati reduced-motion.
- Worker: tidak paralel dalam 1 akun; captcha = berhenti + tandai, bukan
  retry brutal. TikTok ≤3/hari/akun, IG ≤5, Threads ≤8.
- Kredensial/session tidak pernah tampil di chat/log.

## 7. Acceptance criteria
- A1: `node scheduler.demo.mjs` → DEMO PASS, 21/21 unik.
- A2: Web dibuka: 21 slot tampil, simulasi jalan 21/21 done, export JSON valid.
- A3: Tambah produk ke-8 lewat web tanpa ubah kode.
- A4: Deploy `web/` ke Pages → domain live, semua panel fungsi.
- A5 (backend): 1 campaign → 21 job tereksekusi serial sesuai jeda,
  tiap job punya screenshot + URL.

## 8. Risiko
Jalur browser melanggar ToS platform → risiko ban/captcha, selector
upload berubah sewaktu-waktu. Mitigasi di ARCHITECTURE.md. Jika 1 platform
mematikan akun massal: turunkan ke 1 post/hari/akun selama 7 hari.
