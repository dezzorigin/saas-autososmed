# AutoSosmed — arsitektur jalur 2 (prototype)

## Ringkasan
Web kena di `autososmed.pages.dev` (Cloudflare Pages, statis, tanpa kredensial).
Worker + API nyusul di VM Dokploy. 7 produk, 3 post/produk/hari = 21 job/hari.

## Diagram alir
```
[Tim via autososmed.pages.dev] -- campaign bundle (media+caption+target) -->
[API Dokploy (TODO)] -- queue FIFO per platform -->
[Worker Playwright: 1 persistent-context per akun, session reuse] -->
[IG / Threads / TikTok web] -- screenshot+URL --> [Evidence + notif]
```

## Pipeline (kontrak, sama dengan json/pipeline.json)
cron → load_tenant → entitlement → auth_reuse → captcha_login_branch →
fetch_content → normalize_dedupe → execute_browser_post → notify + evidence

## Aturan anti-ban jalur 2
- 1 profil browser per akun (`sessions/<platform>-<akun>`), jangan campur.
- Serial per platform + jeda (IG 90 mnt, Threads 45, TikTok 120) + jitter ±25 mnt, jam 07:00–22:00.
- Caption spintax + hashtag rotasi; media diubah hash-nya per akun (resize 1px / strip metadata).
- TikTok maks 3 post/hari/akun. IG maks 5, Threads maks 8.
- Login ulang hanya saat sesi mati. Captcha = berhenti + tandai sesi, jangan spam retry.

## Deploy web (Pages)
- Folder publish: `web/` (statis, tanpa build).
- Cara: Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets / connect repo → domain `autososmed`.
- Alternatif CLI: `npx wrangler pages deploy web --project-name autososmed`.

## TODO backend Dokploy
1. API kecil (terima campaign, simpan queue di Postgres/SQLite).
2. Worker Node + Playwright (login.mjs/poster.mjs jadi asli per platform).
3. Volume `sessions/` persisten + backup.
4. Notif ke Discord + evidence screenshot.
