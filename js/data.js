/* ==========================================================================
   JOUD — Product catalog & image placeholder generator
   ========================================================================== */

const COLLECTIONS = [
  { id: "after-dark", name: "After Dark", tag: "Collection 01 / 2025", blurb: "The city after the noise. Dense textures, low light and silhouettes built for the long way home." },
  { id: "daily-ritual", name: "Daily Ritual", tag: "The Essentials Edit", blurb: "The pieces that make getting dressed feel like second nature." },
  { id: "field-notes", name: "Field Notes", tag: "Limited Study 02", blurb: "Utility, refined. A small run of modular layers for moving through the world." },
];

const CATEGORIES = [
  { id: "tshirts", name: "T-Shirts" },
  { id: "sweatpants", name: "Sweatpants" },
  { id: "accessories", name: "Accessories" },
];

const GENDERS = [
  { id: "men", name: "Men" },
  { id: "women", name: "Women" },
];

const SIZE_SETS = {
  apparel: ["XS", "S", "M", "L", "XL", "XXL"],
  accessories: ["One Size"],
};

/* Deterministic pseudo-random from a string seed, so each product's
   generated artwork is stable across renders. */
function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return function () {
    h = (h * 9301 + 49297) % 233280;
    return h / 233280;
  };
}

/* Generates an editorial-style abstract SVG "photograph" placeholder for a
   product: gold linework over black, initials mark, category label. */
function placeholderImage(product, variant = 0) {
  const rand = seededRandom(product.id + ":" + variant);
  const w = 900, h = 1125; // 4:5 editorial ratio
  const lines = [];
  const lineCount = 5 + Math.floor(rand() * 5);
  for (let i = 0; i < lineCount; i++) {
    const x1 = rand() * w;
    const y1 = rand() * h;
    const len = 200 + rand() * 500;
    const angle = 35 + rand() * 20;
    const rad = (angle * Math.PI) / 180;
    const x2 = x1 + len * Math.cos(rad);
    const y2 = y1 + len * Math.sin(rad);
    const op = (0.08 + rand() * 0.22).toFixed(2);
    const sw = (0.6 + rand() * 1.8).toFixed(2);
    lines.push(
      `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#c9a24a" stroke-opacity="${op}" stroke-width="${sw}"/>`
    );
  }
  const cx = w / 2, cy = h / 2;
  const ringR = 150 + rand() * 40;
  const initials = product.name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const bgShift = (rand() * 18 - 9).toFixed(1);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg-${product.id}-${variant}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#131210"/>
        <stop offset="55%" stop-color="#0b0a09"/>
        <stop offset="100%" stop-color="#161410"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg-${product.id}-${variant})"/>
    <rect width="${w}" height="${h}" fill="#c9a24a" opacity="0.02" transform="rotate(${bgShift} ${cx} ${cy})"/>
    ${lines.join("\n")}
    <circle cx="${cx}" cy="${cy}" r="${ringR}" fill="none" stroke="#c9a24a" stroke-width="1" opacity="0.5"/>
    <circle cx="${cx}" cy="${cy}" r="${ringR - 14}" fill="none" stroke="#c9a24a" stroke-width="0.6" opacity="0.3"/>
    <text x="${cx}" y="${cy + 34}" text-anchor="middle" font-family="'Inter', sans-serif" font-size="92" fill="#e8cd8a" opacity="0.92">${initials}</text>
    <text x="40" y="${h - 46}" font-family="'Inter', sans-serif" font-size="20" letter-spacing="4" fill="#f6f4ee" opacity="0.55">${product.category.toUpperCase()}</text>
    <text x="40" y="${h - 20}" font-family="'Inter', sans-serif" font-size="14" letter-spacing="3" fill="#c9a24a" opacity="0.7">JOUD — ${product.collection.toUpperCase()}</text>
    <rect x="24" y="24" width="${w - 48}" height="${h - 48}" fill="none" stroke="#f6f4ee" stroke-opacity="0.08" stroke-width="1"/>
  </svg>`;

  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/* -------------------------------------------------------------------------
   Catalog

   NOTE: the brand's original six-way category taxonomy (tees, hoodies,
   jackets, cargos, shirts, accessories) has been consolidated down to the
   three categories the storefront now uses — T-Shirts, Sweatpants, and
   Accessories. Tops (tees, hoodies, jackets, shirts) are grouped under
   "tshirts", trousers (cargos) fall under "sweatpants", and accessories
   are unchanged. Each product also now carries a `gender` ("men" / "women")
   so it can appear under the new Men / Women "Shop By" section.
   ------------------------------------------------------------------------- */
const RAW_PRODUCTS = [
  // TEES
  { id: "tee-001", name: "Signature Tee", category: "tshirts", collection: "after-dark", gender: "men", price: 68, isNew: true, isBestSeller: true, desc: "A heavyweight 240gsm cotton tee with a boxed silhouette and tonal embroidered crest at the chest." },
  { id: "tee-002", name: "Gold Line Tee", category: "tshirts", collection: "field-notes", gender: "women", price: 72, isNew: true, desc: "Garment-dyed cotton tee finished with a single hairline gold stripe at the hem." },
  { id: "tee-003", name: "Essential Crew Tee", category: "tshirts", collection: "daily-ritual", gender: "men", price: 58, isBestSeller: true, desc: "The foundation tee — combed cotton, reinforced collar, cut for daily rotation." },
  { id: "tee-004", name: "Ivory Wash Tee", category: "tshirts", collection: "after-dark", gender: "women", price: 64, desc: "Stone-washed ivory cotton with a relaxed drop shoulder and raw hem finish." },

  // HOODIES
  { id: "hd-001", name: "Atelier Hoodie", category: "tshirts", collection: "after-dark", gender: "men", price: 148, isBestSeller: true, desc: "420gsm brushed fleece hoodie with a dropped shoulder seam and ribbed hem." },
  { id: "hd-002", name: "Gold Thread Hoodie", category: "tshirts", collection: "field-notes", gender: "women", price: 168, isNew: true, desc: "Heavyweight fleece with metallic gold thread detailing along the kangaroo pocket." },
  { id: "hd-003", name: "Studio Zip Hoodie", category: "tshirts", collection: "daily-ritual", gender: "men", price: 158, desc: "Full-zip fleece hoodie in a clean, uniform silhouette built for layering." },
  { id: "hd-004", name: "Monochrome Hoodie", category: "tshirts", collection: "after-dark", gender: "women", price: 152, isNew: true, desc: "Oversized fit hoodie in undyed cotton fleece with tonal drawcords." },

  // JACKETS
  { id: "jk-001", name: "Noir Bomber", category: "tshirts", collection: "after-dark", gender: "men", price: 328, isBestSeller: true, desc: "Matte nylon bomber with a quilted lining and brushed gold hardware." },
  { id: "jk-002", name: "Gold Trim Overcoat", category: "tshirts", collection: "field-notes", gender: "women", price: 468, isNew: true, desc: "Structured wool-blend overcoat with a hand-finished gold-tone button stand." },
  { id: "jk-003", name: "Studio Field Jacket", category: "tshirts", collection: "daily-ritual", gender: "men", price: 268, desc: "Cotton-twill field jacket with four utility pockets and a corozo button closure." },
  { id: "jk-004", name: "Ivory Trench", category: "tshirts", collection: "after-dark", gender: "women", price: 398, desc: "Double-breasted trench in a water-resistant cotton gabardine." },

  // CARGOS
  { id: "cg-001", name: "Utility Cargo", category: "sweatpants", collection: "after-dark", gender: "men", price: 158, isBestSeller: true, desc: "Tapered cargo trouser in ripstop cotton with six reinforced pockets." },
  { id: "cg-002", name: "Gold Stitch Cargo", category: "sweatpants", collection: "field-notes", gender: "women", price: 172, isNew: true, desc: "Straight-leg cargo with contrast gold stitching along structural seams." },
  { id: "cg-003", name: "Studio Cargo Pant", category: "sweatpants", collection: "daily-ritual", gender: "men", price: 138, desc: "A pared-back cargo silhouette in mid-weight twill, built for daily wear." },
  { id: "cg-004", name: "Ivory Cargo", category: "sweatpants", collection: "after-dark", gender: "women", price: 148, desc: "Relaxed cargo in undyed cotton with an adjustable drawcord waist." },

  // SHIRTS
  { id: "sh-001", name: "Noir Overshirt", category: "tshirts", collection: "after-dark", gender: "men", price: 138, isNew: true, desc: "Heavyweight cotton overshirt with a boxy fit and corozo buttons." },
  { id: "sh-002", name: "Gold Button Shirt", category: "tshirts", collection: "field-notes", gender: "women", price: 128, desc: "Poplin shirt with hand-set gold-tone buttons and a camp collar." },
  { id: "sh-003", name: "Studio Oxford", category: "tshirts", collection: "daily-ritual", gender: "men", price: 98, isBestSeller: true, desc: "A classic oxford cloth shirt built for rotation between studio and street." },
  { id: "sh-004", name: "Ivory Linen Shirt", category: "tshirts", collection: "after-dark", gender: "women", price: 118, desc: "Lightweight linen-cotton shirt in an undyed ivory finish." },

  // ACCESSORIES
  { id: "ac-001", name: "Crest Cap", category: "accessories", collection: "after-dark", gender: "men", price: 58, isBestSeller: true, desc: "Six-panel cap in brushed cotton twill with a tonal embroidered crest." },
  { id: "ac-002", name: "Gold Chain Belt", category: "accessories", collection: "field-notes", gender: "women", price: 88, isNew: true, desc: "Vegetable-tanned leather belt with a solid brass gold-finish buckle." },
  { id: "ac-003", name: "Studio Tote", category: "accessories", collection: "daily-ritual", gender: "men", price: 78, desc: "Heavy canvas tote with leather handles and an interior utility pocket." },
  { id: "ac-004", name: "Ivory Scarf", category: "accessories", collection: "after-dark", gender: "women", price: 68, isNew: true, desc: "Fine-knit wool scarf in an undyed ivory finish with a whipped edge." },
];

const PRODUCTS = RAW_PRODUCTS.map((p) => {
  const sizes = p.category === "accessories" ? SIZE_SETS.accessories : SIZE_SETS.apparel;
  return {
    ...p,
    sizes,
    images: [placeholderImage(p, 0), placeholderImage(p, 1), placeholderImage(p, 2)],
  };
});

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function getRelatedProducts(product, count = 4) {
  const sameCategory = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
  const rest = PRODUCTS.filter((p) => p.category !== product.category && p.id !== product.id);
  return [...sameCategory, ...rest].slice(0, count);
}

function formatPrice(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}
