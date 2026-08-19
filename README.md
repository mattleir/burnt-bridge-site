# Burnt Bridge Strength Lab — Website

A four-page static website. No build step, no framework, no dependencies. Open `index.html` in a browser and it works.

```
index.html          Home
about.html          About Coach Julia
training.html       Training & Pricing (+ FAQ)
contact.html        Book a consult (form)
404.html            Not-found page
robots.txt          Search engine directives
sitemap.xml         Sitemap
assets/
  css/style.css     All styling
  js/main.js        Nav, scroll reveals, form handling
  fonts/            Oswald + Inter (self-hosted .woff2)
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
| Gym address | Currently written as "address shared after your consult" — change if you want it public |

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

**Prices** live in `training.html` in the `<ul class="price-list">` blocks.

**Colors** live at the top of `assets/css/style.css` under `:root`:

```css
--ink:  #100E0D;   /* near-black backgrounds */
--bone: #F4F1EC;   /* light sections */
--rust: #C25B2C;   /* accent — buttons, rules, eyebrows */
```

Changing those three updates the entire site.

**The logo** is inline SVG (in the header, hero, and footer of each page), so it stays sharp at any size and picks up whatever text color it sits on. If you get a vector version of the real logo, swap the `<svg>` blocks for an `<img src="assets/img/logo.svg">`.

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

## 6. Photos

The four gym photos are in `assets/img/` at two widths each (1600px and 900px), plus wide crops used as section backgrounds. To swap one, replace the file and keep the same name — or update the `src` and the `alt` text describing what's in the new photo.
