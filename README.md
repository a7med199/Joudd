# JOUD — Premium Ready-to-Wear Website

A fully static, multi-page e-commerce front end for a premium clothing brand,
built with plain HTML, CSS, and JavaScript (no build step, no frameworks).

## How to run

Just open `index.html` in a browser — or, better, serve the folder locally so
that relative paths and any future backend calls behave correctly:

```bash
cd joud
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
joud/
├── index.html          Editorial homepage
├── shop.html            Shop w/ search, filters, sorting, wishlist
├── product.html          Product detail (gallery, sizes, qty, recommendations)
├── collections.html      Collection listings
├── about.html            Brand story
├── contact.html          Contact form w/ validation
├── checkout.html         Checkout form w/ validation + confirmation state
├── css/
│   └── style.css        Full design system (tokens, components, responsive)
└── js/
    ├── data.js          Seeded product catalog + generated placeholder art
    ├── cart.js          Cart / wishlist / toast logic (localStorage-backed)
    └── layout.js        Shared header/footer/drawers/nav + product cards
```

## Notes

- **Product imagery** is generated on the fly as abstract gold-line SVG
  "editorial" placeholders (see `placeholderImage()` in `js/data.js`), so the
  site needs no external image assets and works completely offline. Swap in
  real photography by replacing `product.images` in `data.js`.
- **Cart & wishlist** persist in `localStorage`, so they survive refreshes
  and navigation across pages.
- **Checkout** is a front-end simulation: submitting a valid form clears the
  cart and shows an order-confirmation screen with a generated order number.
  No real payment is processed.
- Fonts load from Google Fonts via the CSS `@import` — an internet
  connection is needed for the exact typeface; otherwise the browser falls
  back to the system sans-serif stack.

## Recent changes

- **Typeface** — the whole site now uses **Inter** (both the display and
  body font roles in `css/style.css`) instead of Cormorant Garamond / Jost.
- **Categories** — consolidated from six to three: **T-Shirts**,
  **Sweatpants**, and **Accessories** (`CATEGORIES` in `js/data.js`). The
  former tees/hoodies/jackets/shirts groups now live under "T-Shirts",
  and cargos live under "Sweatpants" — nothing was removed from the catalog,
  only regrouped. Adjust `RAW_PRODUCTS[i].category` if you'd like a
  different split.
- **Collections** — reduced from four to three, renamed to **After Dark**,
  **Daily Ritual**, and **Field Notes** (`COLLECTIONS` in `js/data.js`),
  matching the reference layout supplied. Products were redistributed
  across the three (old noir-line/monochrome → After Dark, old
  studio-essentials → Daily Ritual, old gold-standard → Field Notes).
- **Shop By section** (homepage) — now shows **Men** and **Women** instead
  of product categories, linking to `shop.html?gender=men|women`. Every
  product carries a new `gender` field, and `shop.html` gained a matching
  Gender filter in the sidebar.
- **Light sections** — the **New Arrivals**, **Collections**, and
  **Shop By** sections on the homepage now use a white background
  (`.on-light` in `css/style.css`), with text recolored to black/dark gold
  for contrast. The rest of the site remains on the original black/gold
  theme.
