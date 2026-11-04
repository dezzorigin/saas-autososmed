// Worker jalur 2 (stub aman): 1 persistent-context per akun, session reuse.
// TIDAK auto-posting di demo — butuh login manual 1x per akun via `node login.mjs <platform-akun>`
// lalu konteks tersimpan di ../sessions/<platform-akun>/ dan dipakai ulang poster.
console.log('worker stub: gunakan login.mjs untuk simpan sesi, poster.mjs untuk eksekusi terjadwal.');
console.log('risiko jalur 2: banned/captcha naik di volume 21 post/hari — patuhi jeda di tenants.json.');
