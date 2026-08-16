# Seiszn — Coming Soon Page

A single-page, animated "site is being built" placeholder for seiszn.in, using your
real logo assets. No build step, no dependencies — plain HTML/CSS/JS.

## What's inside
```
index.html      – the page
styles.css      – palette, type, animations
script.js       – footer year (only script on the page)
assets/         – your logo (cropped/cleaned, transparent background),
                  generated favicons, the two animated illustrations
                  (self-playing SVGs, no JS needed), and the Razorpay /
                  Shiprocket trust logos
```

## Push to GitHub and go live (free, ~2 minutes)
```bash
git init
git add .
git commit -m "Coming soon page"
git branch -M main
git remote add origin <your-empty-repo-url>
git push -u origin main
```
Then in the repo: **Settings → Pages → Deploy from branch → main → / (root)**.
Your page will be live at `https://<username>.github.io/<repo>/`.

Point your `seiszn.in` domain at it later via **Settings → Pages → Custom domain**,
or just swap this folder in on whatever host you use (Netlify/Vercel also work —
drag-and-drop this folder, no config needed).

## Editing
- **Instagram link:** search `instagram.com/Seiszn.in` in `index.html`.
- **Copy:** the eyebrow / headline / subtext / footer are plain text in `index.html`.
- **Colors:** all in the `:root` block at the top of `styles.css`.
- **Logo:** `assets/logo-wordmark.png` (full lockup) and `assets/logo-mark.png`
  (S mark only, used in the top brand row) — both already background-removed.
- **Illustrations:** `assets/illustration-building.svg` (hero, "site being built")
  and `assets/illustration-order.svg` (small looping accent by the CTA button)
  are self-animating SVGs — they loop on their own in any modern browser, no JS.
- **Trust bar:** the Razorpay / Shiprocket section near the bottom. Logos are
  `assets/trust-razorpay.png` and `assets/trust-shiprocket.png`.
