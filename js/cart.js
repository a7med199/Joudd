/* ==========================================================================
   JOUD — Cart, Wishlist, Toast (persisted via localStorage)
   ========================================================================== */

const CART_KEY = "joud_cart_v1";
const WISHLIST_KEY = "joud_wishlist_v1";

const Store = {
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  },
  saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  },
  addToCart(productId, size, qty) {
    const cart = this.getCart();
    const existing = cart.find((i) => i.id === productId && i.size === size);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, size, qty });
    }
    this.saveCart(cart);
  },
  updateQty(index, qty) {
    const cart = this.getCart();
    if (!cart[index]) return;
    cart[index].qty = Math.max(1, qty);
    this.saveCart(cart);
  },
  removeFromCart(index) {
    const cart = this.getCart();
    cart.splice(index, 1);
    this.saveCart(cart);
  },
  clearCart() {
    this.saveCart([]);
  },
  cartCount() {
    return this.getCart().reduce((sum, i) => sum + i.qty, 0);
  },
  cartTotal() {
    return this.getCart().reduce((sum, i) => {
      const p = getProductById(i.id);
      return p ? sum + p.price * i.qty : sum;
    }, 0);
  },

  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) {
      return [];
    }
  },
  saveWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    updateWishlistBadge();
  },
  isWishlisted(productId) {
    return this.getWishlist().includes(productId);
  },
  toggleWishlist(productId) {
    let list = this.getWishlist();
    if (list.includes(productId)) {
      list = list.filter((id) => id !== productId);
      this.saveWishlist(list);
      return false;
    } else {
      list.push(productId);
      this.saveWishlist(list);
      return true;
    }
  },
};

/* --------------------------- Toast feedback --------------------------- */
function showToast(message, opts = {}) {
  let host = document.getElementById("toast-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "toast-host";
    host.className = "toast-host";
    document.body.appendChild(host);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="toast-mark">JOUD</span><span class="toast-msg">${message}</span>`;
  host.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, opts.duration || 2600);
}

/* --------------------------- Badges --------------------------- */
function updateCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const n = Store.cartCount();
    el.textContent = n;
    el.classList.toggle("is-visible", n > 0);
  });
}
function updateWishlistBadge() {
  document.querySelectorAll("[data-wishlist-count]").forEach((el) => {
    const n = Store.getWishlist().length;
    el.textContent = n;
    el.classList.toggle("is-visible", n > 0);
  });
}

/* --------------------------- Cart Drawer --------------------------- */
function renderCartDrawer() {
  const body = document.getElementById("cart-drawer-body");
  const footer = document.getElementById("cart-drawer-footer");
  if (!body) return;
  const cart = Store.getCart();

  if (cart.length === 0) {
    body.innerHTML = `<div class="drawer-empty">
      <p>Your bag is empty.</p>
      <a href="shop.html" class="btn btn-ghost" data-close-drawer>Continue Shopping</a>
    </div>`;
    if (footer) footer.innerHTML = "";
    return;
  }

  body.innerHTML = cart
    .map((item, i) => {
      const p = getProductById(item.id);
      if (!p) return "";
      return `
      <div class="cart-line" data-index="${i}">
        <img src="${p.images[0]}" alt="${p.name}" class="cart-line-img" />
        <div class="cart-line-info">
          <div class="cart-line-top">
            <a href="product.html?id=${p.id}" class="cart-line-name">${p.name}</a>
            <button class="cart-line-remove" data-remove="${i}" aria-label="Remove ${p.name}">&times;</button>
          </div>
          <div class="cart-line-meta">Size ${item.size} &middot; ${formatPrice(p.price)}</div>
          <div class="qty-stepper" data-index="${i}">
            <button class="qty-btn" data-qty-down="${i}" aria-label="Decrease quantity">&minus;</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-qty-up="${i}" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>`;
    })
    .join("");

  if (footer) {
    footer.innerHTML = `
      <div class="cart-subtotal">
        <span>Subtotal</span>
        <span>${formatPrice(Store.cartTotal())}</span>
      </div>
      <p class="cart-note">Shipping &amp; taxes calculated at checkout.</p>
      <a href="checkout.html" class="btn btn-gold btn-block">Checkout</a>
    `;
  }
}

function bindCartDrawerEvents() {
  const body = document.getElementById("cart-drawer-body");
  if (!body) return;
  body.addEventListener("click", (e) => {
    const upIdx = e.target.getAttribute("data-qty-up");
    const downIdx = e.target.getAttribute("data-qty-down");
    const removeIdx = e.target.getAttribute("data-remove");
    if (upIdx !== null) {
      const cart = Store.getCart();
      Store.updateQty(+upIdx, cart[+upIdx].qty + 1);
      renderCartDrawer();
    } else if (downIdx !== null) {
      const cart = Store.getCart();
      const item = cart[+downIdx];
      if (item.qty <= 1) {
        Store.removeFromCart(+downIdx);
        showToast("Removed from bag");
      } else {
        Store.updateQty(+downIdx, item.qty - 1);
      }
      renderCartDrawer();
    } else if (removeIdx !== null) {
      Store.removeFromCart(+removeIdx);
      renderCartDrawer();
      showToast("Removed from bag");
    }
  });
}

/* --------------------------- Wishlist Drawer --------------------------- */
function renderWishlistDrawer() {
  const body = document.getElementById("wishlist-drawer-body");
  if (!body) return;
  const list = Store.getWishlist();
  if (list.length === 0) {
    body.innerHTML = `<div class="drawer-empty">
      <p>No saved pieces yet.</p>
      <a href="shop.html" class="btn btn-ghost" data-close-drawer>Browse the Shop</a>
    </div>`;
    return;
  }
  body.innerHTML = list
    .map((id) => {
      const p = getProductById(id);
      if (!p) return "";
      return `
      <div class="cart-line" data-id="${p.id}">
        <img src="${p.images[0]}" alt="${p.name}" class="cart-line-img" />
        <div class="cart-line-info">
          <div class="cart-line-top">
            <a href="product.html?id=${p.id}" class="cart-line-name">${p.name}</a>
            <button class="cart-line-remove" data-unwish="${p.id}" aria-label="Remove ${p.name}">&times;</button>
          </div>
          <div class="cart-line-meta">${formatPrice(p.price)}</div>
          <button class="btn btn-ghost btn-small" data-move-to-cart="${p.id}">Move to Bag</button>
        </div>
      </div>`;
    })
    .join("");
}

function bindWishlistDrawerEvents() {
  const body = document.getElementById("wishlist-drawer-body");
  if (!body) return;
  body.addEventListener("click", (e) => {
    const unwish = e.target.getAttribute("data-unwish");
    const moveId = e.target.getAttribute("data-move-to-cart");
    if (unwish) {
      Store.toggleWishlist(unwish);
      renderWishlistDrawer();
      showToast("Removed from wishlist");
    } else if (moveId) {
      const p = getProductById(moveId);
      Store.addToCart(moveId, p.sizes[0], 1);
      showToast(p.name + " added to bag");
      renderCartDrawer();
    }
  });
}

/* --------------------------- Drawer open/close plumbing --------------------------- */
function initDrawers() {
  document.querySelectorAll("[data-open-drawer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-open-drawer");
      openDrawer(target);
    });
  });
  document.querySelectorAll("[data-close-drawer]").forEach((btn) => {
    btn.addEventListener("click", () => closeAllDrawers());
  });
  const scrim = document.getElementById("scrim");
  if (scrim) scrim.addEventListener("click", () => closeAllDrawers());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllDrawers();
  });
}

function openDrawer(name) {
  closeAllDrawers();
  const el = document.getElementById(name);
  const scrim = document.getElementById("scrim");
  if (el) el.classList.add("is-open");
  if (scrim) scrim.classList.add("is-open");
  document.body.classList.add("no-scroll");
  if (name === "cart-drawer") renderCartDrawer();
  if (name === "wishlist-drawer") renderWishlistDrawer();
}

function closeAllDrawers() {
  document.querySelectorAll(".drawer").forEach((d) => d.classList.remove("is-open"));
  const scrim = document.getElementById("scrim");
  if (scrim) scrim.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
}
