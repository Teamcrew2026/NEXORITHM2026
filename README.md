# Nexorithm 2026 — Clean Project Folder

This folder has every file correctly wired together: real MySQL backend,
real bcrypt admin login, no localStorage. Ready to drop into WampServer.

## ⚠️ One file is missing: index.html

Your original `index.html` for this SPA was never uploaded to this chat
(the first upload attempt failed/came through empty). Everything else here
is complete and correct — you just need to copy your own `index.html` into
this folder's root (next to the `api/`, `js/`, `css/`, `assets/` folders).

Make sure your `index.html` has these script/link tags (adjust paths if
yours differ):

```html
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/components.css">
...
<script src="js/three-scene.js"></script>
<script src="js/events-data.js"></script>
<script src="js/storage.js"></script>
<script src="js/router.js"></script>
<script src="js/app.js"></script>
<script src="js/registration.js"></script>
<script src="js/admin.js"></script>
```

## How to deploy

1. Copy this whole folder into `C:\wamp64\www\` — rename it to whatever
   you like, e.g. `C:\wamp64\www\nexorithm-2026`.
2. Drop your `index.html` into that same folder's root.
3. Delete any OTHER `nexorithm*` folders you have under `www\` — having
   several copies is what caused the "data not saving" confusion earlier.
4. Make sure WampServer's tray icon is fully **green** (Apache + MySQL both
   running).
5. Open **`http://localhost/nexorithm-2026/index.html`** — not `file://`,
   not any other folder.
6. Submit a test registration, then check phpMyAdmin →
   **`nexorithm_2026`** database → `registrations` table.

## Default admin login

- Username: `admin`
- Password: `nexorithm@2026`

Change this after first login (see the bcrypt-hash instructions in the
`admin_login.php` / `db.php` comments, or ask me).

## What's inside

```
api/
  db.php                  — DB connection, creates tables + seed admin
  admin_login.php         — real bcrypt login, starts PHP session
  admin_session.php       — lets the SPA check "am I still logged in"
  admin_logout.php        — destroys the session
  registration.php        — GET (admin list, auth-gated) + POST (public submit)
  delete_registration.php — auth-gated delete
  update_status.php       — auth-gated payment-verify toggle

js/
  storage.js       — talks to /api via fetch (NOT localStorage)
  admin.js         — real session-based login/logout/dashboard
  app.js           — UI animations (unchanged from your original)
  router.js        — SPA hash router (unchanged)
  registration.js  — public registration form handler (unchanged)
  events-data.js   — your 7 events (unchanged)
  three-scene.js   — 3D background (unchanged)

css/
  main.css         — unchanged
  components.css   — unchanged

assets/
  favicon.svg      — unchanged
```

## Do NOT copy these old files into this folder if you still have them

`register.php`, `post_registration.php`, `get_registrations.php` — these
were duplicate/old endpoints from your original code and are intentionally
left out here. `registration.php` alone replaces all three.
