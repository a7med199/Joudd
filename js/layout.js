/* ==========================================================================
   JOUD — Shared layout: header, footer, drawers, mobile nav, search overlay
   ========================================================================== */

function injectLayout(activePage) {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  const overlays = document.getElementById("site-overlays");

  const navLink = (href, label, page) =>
    `<a href="${href}" class="nav-link${activePage === page ? " is-active" : ""}">${label}</a>`;

  if (header) {
    header.innerHTML = `
      <div class="announce-bar">
        <p>Complimentary shipping on orders over $200 &mdash; New season now live</p>
      </div>
      <div class="header-main">
        <button class="icon-btn menu-toggle" data-mobile-menu-toggle aria-label="Open menu">
          <span class="burger"><span></span><span></span><span></span></span>
        </button>

        <a href="index.html" class="logo" aria-label="JOUD home">
          <span class="logo-mark">J</span><span class="logo-word">JOUD</span>
        </a>

        <nav class="nav-primary" aria-label="Primary">
          ${navLink("shop.html", "Shop", "shop")}
          ${navLink("collections.html", "Collections", "collections")}
          ${navLink("about.html", "About", "about")}
          ${navLink("contact.html", "Contact", "contact")}
        </nav>

        <div class="header-actions">
          <button class="icon-btn" data-search-toggle aria-label="Search">
            <svg viewBox="0 0 24 24" width="19" height="19"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.4"/><line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          </button>
          <button class="icon-btn" data-open-drawer="wishlist-drawer" aria-label="Wishlist">
            <svg viewBox="0 0 24 24" width="19" height="19"><path d="M12 20s-7.5-4.6-9.8-9C.6 7.4 2.2 4 5.6 4c2 0 3.4 1 4.4 2.4C11 5 12.4 4 14.4 4c3.4 0 5 3.4 3.4 7-2.3 4.4-9.8 9-9.8 9z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
            <span class="badge" data-wishlist-count>0</span>
          </button>
          <button class="icon-btn" data-open-drawer="cart-drawer" aria-label="Shopping bag">
            <svg viewBox="0 0 24 24" width="19" height="19"><path d="M6 8h12l-1 12H7L6 8z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
            <span class="badge" data-cart-count>0</span>
          </button>
        </div>
      </div>

      <div class="mobile-menu" data-mobile-menu>
        <nav aria-label="Mobile primary">
          ${navLink("shop.html", "Shop", "shop")}
          ${navLink("collections.html", "Collections", "collections")}
          ${navLink("about.html", "About", "about")}
          ${navLink("contact.html", "Contact", "contact")}
        </nav>
        <div class="mobile-menu-foot">
          <a href="contact.html">Client Services</a>
          <a href="shop.html">Track an Order</a>
        </div>
      </div>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo logo-footer"><span class="logo-mark">J</span><span class="logo-word">JOUD</span></a>
          <p>A premium ready-to-wear house working in black, white, and gold. Cut for permanence, not for seasons.</p>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <a href="shop.html?category=tshirts">T-Shirts</a>
          <a href="shop.html?category=sweatpants">Sweatpants</a>
          <a href="shop.html?category=accessories">Accessories</a>
        </div>
        <div class="footer-col">
          <h4>House</h4>
          <a href="about.html">About JOUD</a>
          <a href="collections.html">Collections</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Newsletter</h4>
          <p class="footer-note">First access to new arrivals and private releases.</p>
          <form class="footer-form" data-newsletter-form>
            <input type="email" required placeholder="Email address" aria-label="Email address" />
            <button type="submit" class="btn-underline">Join</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <span data-year></span> JOUD. All rights reserved.</p>
        <p class="footer-locale">EG &middot; USD $</p>
      </div>
    `;
    const yearEl = footer.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const nlForm = footer.querySelector("[data-newsletter-form]");
    if (nlForm) {
      nlForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("You're on the list");
        nlForm.reset();
      });
    }
  }

  if (overlays) {
    overlays.innerHTML = `
      <div class="scrim" id="scrim"></div>

      <aside class="drawer" id="cart-drawer" aria-label="Shopping bag">
        <div class="drawer-head">
          <h3>Your Bag</h3>
          <button class="icon-btn" data-close-drawer aria-label="Close">&times;</button>
        </div>
        <div class="drawer-body" id="cart-drawer-body"></div>
        <div class="drawer-footer" id="cart-drawer-footer"></div>
      </aside>

      <aside class="drawer" id="wishlist-drawer" aria-label="Wishlist">
        <div class="drawer-head">
          <h3>Wishlist</h3>
          <button class="icon-btn" data-close-drawer aria-label="Close">&times;</button>
        </div>
        <div class="drawer-body" id="wishlist-drawer-body"></div>
      </aside>

      <div class="search-overlay" id="search-overlay">
        <button class="icon-btn search-close" data-search-close aria-label="Close search">&times;</button>
        <div class="search-inner">
          <p class="eyebrow">Search the Collection</p>
          <input type="text" id="search-input" placeholder="Search tees, hoodies, jackets&hellip;" autocomplete="off" />
          <div class="search-results" id="search-results"></div>
        </div>
      </div>
    `;
  }

  bindLayoutEvents();
  updateCartBadge();
  updateWishlistBadge();
  initScrollReveal();
}

function bindLayoutEvents() {
  initDrawers();
  bindCartDrawerEvents();
  bindWishlistDrawerEvents();

  const menuToggle = document.querySelector("[data-mobile-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", open);
      document.body.classList.toggle("no-scroll", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
      })
    );
  }

  const searchToggle = document.querySelector("[data-search-toggle]");
  const searchOverlay = document.getElementById("search-overlay");
  const searchClose = document.querySelector("[data-search-close]");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  function runSearch(q) {
    if (!searchResults) return;
    const query = q.trim().toLowerCase();
    if (!query) {
      searchResults.innerHTML = "";
      return;
    }
    const matches = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.collection.toLowerCase().includes(query)
    ).slice(0, 6);
    if (matches.length === 0) {
      searchResults.innerHTML = `<p class="search-empty">No pieces match &ldquo;${q}&rdquo;.</p>`;
      return;
    }
    searchResults.innerHTML = matches
      .map(
        (p) => `
      <a class="search-result" href="product.html?id=${p.id}">
        <img src="${p.images[0]}" alt="" />
        <span>
          <strong>${p.name}</strong>
          <em>${formatPrice(p.price)}</em>
        </span>
      </a>`
      )
      .join("");
  }

  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener("click", () => {
      searchOverlay.classList.add("is-open");
      document.body.classList.add("no-scroll");
      setTimeout(() => searchInput && searchInput.focus(), 200);
    });
  }
  if (searchClose && searchOverlay) {
    searchClose.addEventListener("click", () => {
      searchOverlay.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", (e) => runSearch(e.target.value));
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchOverlay) {
      searchOverlay.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
  });
}

/* --------------------------- Scroll reveal motion --------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* --------------------------- Shared add-to-cart / wishlist card wiring --------------------------- */
function bindProductCardEvents(root = document) {
  root.querySelectorAll("[data-quick-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-quick-add");
      const p = getProductById(id);
      if (!p) return;
      Store.addToCart(id, p.sizes[0], 1);
      showToast(p.name + " added to bag");
      renderCartDrawer();
    });
  });
  root.querySelectorAll("[data-toggle-wish]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-toggle-wish");
      const p = getProductById(id);
      const nowSaved = Store.toggleWishlist(id);
      btn.classList.toggle("is-active", nowSaved);
      showToast(nowSaved ? p.name + " saved to wishlist" : p.name + " removed from wishlist");
      renderWishlistDrawer();
    });
  });
}

function productCardHTML(p) {
  const saved = Store.isWishlisted(p.id);
  const tag = p.isNew ? '<span class="card-tag">New</span>' : p.isBestSeller ? '<span class="card-tag card-tag-gold">Best Seller</span>' : "";
  return `
  <article class="product-card" data-reveal>
    <a href="product.html?id=${p.id}" class="product-card-media">
      <img src="${p.images[0]}" alt="${p.name}" loading="lazy" class="img-primary" />
      <img src="${p.images[1]}" alt="" loading="lazy" class="img-hover" />
      ${tag}
      <button class="wish-btn ${saved ? "is-active" : ""}" data-toggle-wish="${p.id}" aria-label="Save ${p.name} to wishlist">
        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 20s-7.5-4.6-9.8-9C.6 7.4 2.2 4 5.6 4c2 0 3.4 1 4.4 2.4C11 5 12.4 4 14.4 4c3.4 0 5 3.4 3.4 7-2.3 4.4-9.8 9-9.8 9z"/></svg>
      </button>
      <button class="btn btn-gold card-add" data-quick-add="${p.id}">Quick Add</button>
    </a>
    <div class="product-card-info">
      <a href="product.html?id=${p.id}" class="product-card-name">${p.name}</a>
      <div class="product-card-bottom">
        <span class="product-card-price">${formatPrice(p.price)}</span>
        <span class="product-card-cat">${CATEGORIES.find((c) => c.id === p.category)?.name || ""}</span>
      </div>
    </div>
  </article>`;
}
