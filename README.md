# Cravins Ice Cream — Website

A premium, production-ready website for Cravins Ice Cream, Maiduguri. Pure HTML/CSS/JavaScript — no frameworks, no build step, no backend required.

## What's included

- `index.html` — the full one-page site (hero, about, flavours, menu, why-us, reviews, gallery, delivery, events, contact)
- `css/styles.css` — all styling
- `js/script.js` — all interactivity (nav, forms, carousel, lightbox, menu tabs)
- `manifest.json` + `service-worker.js` + `offline.html` — Progressive Web App support (installable, works offline)
- `icons/` — app icons for PWA install / browser tab
- `images/` — placeholder photography (see below — **replace these**)
- `robots.txt` + `sitemap.xml` — SEO

## Before you go live — 3 things to update

1. **Phone & WhatsApp numbers.** The placeholder number `+234 800 000 0000` appears throughout (header, floating buttons, delivery, contact, footer, and inside `js/script.js` as `WHATSAPP_NUMBER`). Find-and-replace it everywhere with your real number, including in `js/script.js`.

2. **Photography.** Every file in `images/` is a brand-colored placeholder, not a real photo — they're there so the site looks complete, not broken, while you gather real photography. Replace these with real photos of your store, food, and customers (with permission), keeping the same filenames or updating the `src` attributes in `index.html` to match new filenames. Recommended: square or near-square photos for the gallery, since those cells crop aggressively.

3. **Domain-specific SEO fields.** `index.html` and `sitemap.xml` reference `https://www.cravinsicecream.com/` — update this to your actual domain once you've registered/deployed it, and update the same domain inside the JSON-LD structured data block in `index.html`.

## Hosting

This is a fully static site — it works on Netlify, InfinityFree, AwardSpace, GitHub Pages, or any static host. Just upload all files preserving the folder structure (`css/`, `js/`, `images/`, `icons/` must stay alongside `index.html`).

## Menu & pricing

Edit the prices and items directly inside the `<div class="menu-panel">` blocks in `index.html` — each row is a simple `<div class="menu-row">` with an item name and a price.

## PWA install

Once deployed over HTTPS, visitors on mobile can "Add to Home Screen" and the site will behave like an installed app, including offline fallback (see `offline.html`).
