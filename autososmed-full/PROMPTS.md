# PROMPTS.md — prompt per tahap buat agen lain

Copy satu tahap per sesi ke agen lain. Setiap tahap mencantumkan input,
perintah, dan cek lolos. Jangan gabung tahap.

---

## Tahap 1 — Web statis (publikasi Pages)

```
Konteks: folder web/ berisi index.html prototype AutoSosmed (dashboard 3 kolom:
akun+sesi, antrian 21 slot, bukti). Baca DESIGN.md bagian 2-4 dan PRD F1-F3,F7.

Kerjakan:
1. Rapikan web/index.html jadi final: 3 kolom responsif, runway amber,
   21 akun dengan toggle hidup/mati (localStorage), composer campaign +
   preview spintax per tenant, stepper 10 node, log bukti + export JSON.
2. Tanpa framework build, tanpa kredensial di frontend.

Cek lolos: buka file langsung di browser — 21 slot tampil, simulasi 21/21 done,
tambah tenant ke-8 tanpa ubah kode (A2, A3).
```

## Tahap 2 — Deploy Pages

```
Konteks: web/ final dari Tahap 1. Target: autososmed.pages.dev.

Kerjakan:
1. Pastikan publish dir hanya web/ (index.html + aset), tanpa secret.
2. Buat perintah deploy: npx wrangler pages deploy web --project-name autososmed,
   plus langkah Dashboard alternatif (Workers & Pages → Create → Pages → Upload).
3. Verifikasi domain live dan semua panel fungsi (A4).

Cek lolos: URL publik dibuka dari HP + desktop, simulasi jalan.
```

## Tahap 3 — API queue (Dokploy)

```
Konteks: baca PRD F2-F4, DESIGN bagian 5-6, json/pipeline.json + tenants.json.

Kerjakan:
1. API kecil (Node): POST /campaigns (terima bundle) → fan-out jadi job
   (id = tenant+hash), GET /queue, PATCH /jobs/:id, GET /sessions.
2. Simpan di SQLite dulu (naik ke Postgres nanti), validasi slot 3/produk/hari.
3. Sambungkan web ke API via fetch + fallback localStorage saat offline.

Cek lolos: 1 campaign → 21 job di GET /queue, hash sama didedupe.
```

## Tahap 4 — Worker IG + Threads

```
Konteks: js/login.mjs + poster.mjs (kerangka), aturan anti-ban IG 90 mnt /
Threads 45 mnt + jitter, jam 07-22. Satu persistent-context per akun.

Kerjakan:
1. Wujudkan login.mjs (1x login manual → sessions/ig-<tenant>).
2. Wujudkan poster IG + Threads: ambil job FIFO, posting serial, screenshot +
   URL ke evidence, captcha = stop + tandai sesi dead.
3. Spintax caption + variasi media per akun.

Cek lolos: campaign 2 produk → 6 job IG + 6 Threads done, tiap job ada screenshot+URL.
```

## Tahap 5 — Worker TikTok

```
Konteks: sama seperti Tahap 4, batas TikTok ≤3/hari/akun, jeda 120 mnt.
Upload via tiktok.com/upload, wajib video.

Kerjakan:
1. Poster TikTok: validasi media video, jadwalkan maks 3 slot/hari/akun.
2. Tangani slider-captcha: stop + tandai sesi, jangan loop.
3. Evidence + notif Discord per job.

Cek lolos: 7 akun TikTok × 3 post dalam 07-22 tanpa captcha beruntun (A5).
```

## Tahap 6 — Operasional

```
Konteks: seluruh sistem jalan di VM Dokploy (API + 3 worker + SQLite/Postgres,
volume sessions/ persisten).

Kerjakan:
1. Compose + env example, backup sessions/, rotasi log evidence.
2. Monitor: sesi mati >2 akun = alert Discord; captcha beruntun = auto-pause 24 jam.
3. Runbook: tambah produk ke-8, ganti caption massal, rollback worker.

Cek lolos: restart stack → queue + sesi utuh, alert terkirim ke Discord.
```
