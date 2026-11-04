# AutoSosmed — README

Mission control untuk automasi posting TikTok, Instagram, Threads.
7 produk, 3 post/produk/hari = 21 job/hari. Jalur browser (Playwright
persistent-context + session reuse).

## Isi paket ini

- `PRD.md` — kebutuhan produk, scope, acceptance criteria
- `DESIGN.md` — token desain, layout web, arsitektur, model data
- `PROMPTS.md` — prompt siap-copy per tahap buat agen lain (1–6)
- `overview.pdf` — gambaran sistem buat tim/non-teknis
- `web/index.html` — prototype web statis (publish dir Cloudflare Pages)
- `json/` — tenants, pipeline, contoh campaign
- `js/` — scheduler demo, kerangka login/poster Playwright
- `ARCHITECTURE.md` — diagram + aturan anti-ban + TODO backend

## Urutan bangun (buat agen lain)

1. Baca `PRD.md`, lalu `DESIGN.md`.
2. Jalankan prompt Tahap 1–2 di `PROMPTS.md` (web statis dulu).
3. Deploy `web/` ke `autososmed.pages.dev` (Pages → upload folder).
4. Lanjut Tahap 3–6 (API + worker Playwright di VM Dokploy).
5. 7 produk/asli diinput lewat web setelah jadi — bukan di kode.

## Verifikasi cepat

```bash
cd js && node scheduler.demo.mjs   # harus DEMO PASS 21/21
grep -o "<title>[^<]*</title>" ../web/index.html
```

## Batasan jalur browser (jujur)

Volume 21 post/hari via browser rawan captcha/ban. Mitigasi: 1 profil
per akun, serial + jeda + jitter, caption/media bervariasi, login ulang
hanya saat sesi mati. Detail di `ARCHITECTURE.md`.
