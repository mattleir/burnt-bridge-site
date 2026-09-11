# Burnt Bridge Strength Lab — Website

A four-page static website. No build step, no framework, no dependencies. Open `index.html` in a browser and it works.

```
index.html          Home
about.html          About & Our Approach (+ map)
training.html       Services & Rates — four service blocks, comparison table, FAQ
contact.html        Book a consult (form)
404.html            Not-found page
robots.txt          Search engine directives
sitemap.xml         Sitemap
assets/
  css/style.css     All styling
  js/main.js        Nav, scroll reveals, form handling
  fonts/            Bebas Neue + IBM Plex Mono + Inter (self-hosted .woff2)
  img/              Photos, favicon
```

---

## 1. Connect the contact form (do this first)

The form on `contact.html` is fully built but not yet pointed at a mailbox. Right now, submitting it shows a message explaining that it needs connecting.

**With Formspree (free tier, ~2 minutes):**

1. Sign up at [formspree.io](https://formspree.io) and create a new form.
2. Copy the endpoint it gives you — it looks like `https://formspree.io/f/abcdwxyz`.
3. Open `contact.html`, find this line (around line 60):

   ```html
   <form id="consult-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
   ```

4. Replace the whole `action` URL with yours. Save.

That's it. Submissions arrive by email, the visitor stays on the page, and a confirmation message appears in place. The same works with Netlify Forms, Basin, Getform, or any endpoint that accepts a `POST` and returns JSON.

A honeypot field is already in place to absorb bot submissions silently.

---

## 2. Things to replace before launch

| What | Where |
|---|---|
| `hello@burntbridgestrengthlab.com` | Footer + contact sidebar on every page |
| Instagram / Facebook URLs | Footer `<div class="social">` on every page |
| `https://burntbridgestrengthlab.com` | `<link rel="canonical">` and `og:url` in each page's `<head>`, plus `sitemap.xml` and `robots.txt` |
| ~~Gym address~~ | Now published as **4414 NE 12th Ave, Vancouver, WA 98663** on every page, in the structured data, and as a Google Map at the bottom of the About page |

---

## 3. Hosting

Any static host works. Drag the whole folder into:

- **Netlify** — netlify.com/drop, free, instant, custom domain supported
- **Cloudflare Pages**, **Vercel**, or **GitHub Pages** — all free for this
- Any traditional web host via FTP

No server-side code is required.

---

## 4. Editing content

Everything is plain HTML. To change a headline, open the file and edit the text between the tags. The copy is organized with comments like `<!-- ============ PRICING ============ -->` so sections are easy to find.

**Prices** appear in two places in `training.html`, and both must be changed together:

1. The `<span class="price-tag">` inside each of the four service blocks
2. The `class="price"` cell in each row of the comparison table

They are also mirrored in the `OfferCatalog` structured data in that page's `<head>`, and in the `makesOffer` block in `index.html`.

**Colors** live at the top of `assets/css/style.css` under `:root`, matching the Website Design Brief:

```css
--ink:      #242118;   /* Near-Black — dark sections */
--forest:   #2E4034;   /* Forest Green — media panels, differentiator strip */
--bone:     #F5EDE1;   /* Cream — light sections */
--rust:     #C4622D;   /* Terracotta — brand accent */
```

**One deliberate deviation from the brief.** White text on Terracotta #C4622D measures 4.09:1, below the 4.5:1 WCAG AA minimum for text that size — so button fills use `--rust-btn: #B85723` (4.75:1) and small terracotta text on cream uses `--rust-ink: #9D4A1E` (5.27:1). Both read as the same terracotta; #C4622D itself still drives icons, rules, and borders, where the contrast rules don't apply. Every text/background pair on the site now passes AA. If you'd rather have the exact hex everywhere, change `--rust-btn` and `--rust-ink` to `#C4622D` — just know the CTA text drops below standard.

**Fonts** follow the brief too: Bebas Neue for display and headings, IBM Plex Mono for eyebrows, stats, prices, labels, nav and buttons, Inter for body copy. All self-hosted in `assets/fonts/`.

**The logo** is your `updated_logo.png`, used in the header and footer of every page, the Home hero lockup, and the four forest-green panels on the Services page. Three sizes are generated from it:

| File | Used for |
|---|---|
| `logo-320.png` | header + footer |
| `logo-900.png` | hero lockup + Services panels |
| `favicon-64.png` / `favicon-180.png` | browser tab + iOS home screen |
| `updated_logo.png` | untouched master — regenerate the others from this |

The artwork is white, so it only works on dark backgrounds — which is where every current placement sits. If you ever need it on cream, you'll need a dark version of the file; CSS can't recolor a PNG the way it could the old inline SVG.

The header mark is set to 78px wide. Much smaller and the truss detail in the bridge turns to mush, so don't shrink it far below that. A vector (SVG) version of the logo would solve that and stay crisp at any size — worth asking your designer for if one exists.

---

## 5. What's already handled

- Per-page SEO titles and meta descriptions, taken from your copy doc
- Open Graph / Twitter card tags for link previews
- Schema.org structured data — local business, offers, coach profile, FAQ
- Responsive from 320px up; mobile menu below 900px
- Self-hosted fonts (no Google Fonts request — faster and privacy-friendly)
- Lazy-loaded images with explicit dimensions (no layout shift)
- Keyboard navigation, skip link, focus rings, ARIA labels
- `prefers-reduced-motion` respected
- Print stylesheet

---

## 6. The Services page

`training.html` is built from the Services Page Design Brief: hero, intro strip, four service blocks (alternating light/dark with forest-green arch panels), the VBT differentiator strip, the remote/in-person callout, the comparison table, FAQ, and closing CTA.

The nav label reads **Services** rather than Training, to match the page's own heading. The file is still `training.html`, so existing links keep working.

Each service block has an `id` (`#individual`, `#small-group`, `#olympic`, `#mobility`) and the Home page's offering cards link straight to them.

---

## 7. The map

The About page ends with a Google Maps embed pointing at 4414 NE 12th Ave. It uses the keyless embed URL, so there's no API key, no billing account, and nothing to configure — it just works once the site is online. It's set to `loading="lazy"`, so it only loads if a visitor scrolls that far.

To move or resize it, the block is `<section>` marked `<!-- ============ FIND US / MAP ============ -->` near the bottom of `about.html`.

---

## 8. The hero slideshow

The Home page hero cycles through background photos every 6 seconds with a slow crossfade. It currently holds **three** images — all shots of Julia coaching a client.

**To add a slide**, drop a new 16:9 image into `assets/img/` and add one `<img>` inside the block marked `id="hero-slideshow"` in `index.html`:

```html
<img src="assets/img/hero-4-2000.jpg" alt="Describe what's happening in the photo"
     width="2000" height="1125" decoding="async">
```

That's the only edit needed — the dots below the hero are generated from however many images are in that block, so they update themselves. Removing a slide works the same way. Only the first image carries `class="is-active"`; leave the rest without it.

**Framing.** Images are cropped to fill, so the subject should sit near the middle. The pull-up shot is vertical action that doesn't survive a wide crop on phones, so it uses a `<picture>` element to swap in a portrait version below 700px — a useful pattern if another photo has the same problem.

**Controls and motion.** A pause button and dots sit at the bottom-right (centered on phones). The slideshow stops when the tab is hidden, stops when a visitor clicks a dot, and never auto-advances at all for anyone whose system is set to reduce motion. With JavaScript off, the first image shows and the controls stay hidden.

**Timing** is the `INTERVAL` value near the top of the slideshow block in `assets/js/main.js`.

---

## 9. Photos

The four gym photos are in `assets/img/` at two widths each (1600px and 900px), plus wide crops used as section backgrounds. To swap one, replace the file and keep the same name — or update the `src` and the `alt` text describing what's in the new photo.
