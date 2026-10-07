const products = [
  {
    id: "aura-band",
    name: "Aura Diamond Band",
    type: "Ring",
    image: "./assets/collection-fine.png",
    meta: "18K yellow gold · Natural diamonds · Inquiry pricing",
    detail: {
      diamond: "Round brilliant diamonds, approx. 0.42 ct total",
      quality: "VS-SI clarity, G-H colour range",
      carat: "Available from 0.25 ct to 1.20 ct total",
      gold: "14K, 18K, or 22K yellow, rose, or white gold",
      weight: "Approx. 3.8 g in 18K gold, varies by size",
      certification: "IGI/GIA diamond certification options",
      customization: "Band width, diamond count, metal tone, engraving",
      delivery: "Estimated 7-14 days; custom sizing may vary",
      emi: "EMI available on eligible bank cards after inquiry"
    }
  },
  {
    id: "mira-solitaire",
    name: "Mira Pendant",
    type: "Necklace",
    image: "./assets/hero-atelier.png",
    meta: "Minimal solitaire · Adjustable chain · Inquiry pricing",
    detail: {
      diamond: "Round solitaire diamond, starting from 0.18 ct",
      quality: "VS clarity, G-H colour range",
      carat: "Customisable from 0.18 ct to 1.00 ct",
      gold: "18K yellow, rose, or white gold",
      weight: "Approx. 2.4 g including chain",
      certification: "Certificate available for centre diamond",
      customization: "Chain length, diamond size, bezel or prong setting",
      delivery: "Estimated 10-18 days",
      emi: "EMI and partial advance options discussed privately"
    }
  },
  {
    id: "eline-studs",
    name: "Eline Diamond Studs",
    type: "Earrings",
    image: "./assets/craft-detail.png",
    meta: "Everyday diamonds · Secure backs · Inquiry pricing",
    detail: {
      diamond: "Pair of round diamonds, starting from 0.30 ct total",
      quality: "VS-SI clarity, G-H colour range",
      carat: "Customisable up to 2.00 ct total",
      gold: "14K or 18K yellow, rose, or white gold",
      weight: "Approx. 1.9 g in 18K gold",
      certification: "IGI/GIA options for larger stones",
      customization: "Basket profile, screw backs, metal tone",
      delivery: "Estimated 7-12 days",
      emi: "EMI guidance shared during WhatsApp inquiry"
    }
  }
];

const state = {
  wishlist: new Set(),
  inquiry: new Set()
};

const grid = document.querySelector("#productGrid");
const panel = document.querySelector("#panel");
const overlay = document.querySelector("#overlay");
const panelContent = document.querySelector("#panelContent");
const panelEyebrow = document.querySelector("#panelEyebrow");
const cartBadge = document.querySelector("#cartBadge");
const closePanel = document.querySelector("#closePanel");

function renderProducts() {
  grid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-card-media">
            <img src="${product.image}" alt="${product.name}" />
            <span class="product-pill">${product.type}</span>
          </div>
          <div class="product-card-body">
            <h3>${product.name}</h3>
            <p class="product-meta">${product.meta}</p>
            <div class="mini-actions">
              <button class="button secondary" data-detail="${product.id}">View Details</button>
              <button class="icon-button" data-wishlist="${product.id}" aria-label="Add ${product.name} to wishlist">${state.wishlist.has(product.id) ? "♥" : "♡"}</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function updateBadge() {
  cartBadge.textContent = state.inquiry.size;
}

function openPanel(kind, productId) {
  panel.classList.remove("wide");
  panelEyebrow.textContent = "REIANNA";

  if (kind === "product") renderProductDetail(productId);
  if (kind === "wishlist") renderWishlist();
  if (kind === "cart") renderCart();
  if (kind === "search") renderSearch();
  if (kind === "profile") renderProfile();
  if (kind === "studio") renderStudioForm();

  overlay.hidden = false;
  panel.hidden = false;
  document.body.classList.add("panel-open");
}

function closeActivePanel() {
  overlay.hidden = true;
  panel.hidden = true;
  document.body.classList.remove("panel-open");
}

function productById(id) {
  return products.find((product) => product.id === id);
}

function renderProductDetail(productId) {
  const product = productById(productId);
  panel.classList.add("wide");
  panelEyebrow.textContent = product.type;
  const detailRows = Object.entries(product.detail)
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");

  panelContent.innerHTML = `
    <div class="panel-grid two">
      <div class="detail-media"><img src="${product.image}" alt="${product.name}" /></div>
      <div>
        <h2>${product.name}</h2>
        <p class="product-meta">${product.meta}</p>
        <dl class="detail-list">${detailRows}</dl>
        <div class="product-actions">
          <button class="button primary" data-studio-product="${product.id}">Customize This Design</button>
          <button class="button secondary" data-add-cart="${product.id}">Add to Inquiry Cart</button>
          <button class="button secondary" data-wishlist="${product.id}">${state.wishlist.has(product.id) ? "Saved" : "Add to Wishlist"}</button>
          <a class="button textual" target="_blank" rel="noreferrer" href="https://wa.me/919999999999?text=Hello%20REIANNA%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}.">Enquire on WhatsApp</a>
          <button class="button textual" data-share="${product.id}">Share</button>
        </div>
      </div>
    </div>
  `;
}

function renderWishlist() {
  panelEyebrow.textContent = "Wishlist";
  const saved = products.filter((product) => state.wishlist.has(product.id));
  panelContent.innerHTML = saved.length
    ? `<div>${saved.map(listItem).join("")}</div><div class="panel-actions"><button class="button primary" data-panel="cart">Move Toward Inquiry</button></div>`
    : `<div class="empty-state">Your quiet edit is empty. Save pieces you may want to customise or discuss privately.</div>`;
}

function renderCart() {
  panelEyebrow.textContent = "Inquiry Cart";
  const selected = products.filter((product) => state.inquiry.has(product.id));
  const message = encodeURIComponent(`Hello REIANNA, I would like to enquire about: ${selected.map((p) => p.name).join(", ") || "a fine jewellery design"}.`);
  panelContent.innerHTML = selected.length
    ? `<div>${selected.map(listItem).join("")}</div>
      <div class="field-group"><label for="cartNote">Consultation note</label><textarea id="cartNote" rows="4" placeholder="Budget, occasion, preferred gold tone, diamond size, or reference link"></textarea></div>
      <div class="panel-actions"><a class="button primary" target="_blank" rel="noreferrer" href="https://wa.me/919999999999?text=${message}">Send Inquiry on WhatsApp</a><button class="button secondary" data-panel="studio">Add Custom Details</button></div>`
    : `<div class="empty-state">No inquiry items yet. Add a piece or begin with the Custom Studio.</div><div class="panel-actions"><button class="button primary" data-panel="studio">Start Custom Studio</button></div>`;
}

function renderSearch() {
  panelEyebrow.textContent = "Search";
  panelContent.innerHTML = `
    <div class="field-group">
      <label for="searchInput">Search REIANNA</label>
      <input id="searchInput" type="search" placeholder="Try diamond band, pendant, 18K, bespoke" />
    </div>
    <div id="searchResults">${products.map(listItem).join("")}</div>
  `;
  const searchInput = document.querySelector("#searchInput");
  const searchResults = document.querySelector("#searchResults");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    const results = products.filter((product) => `${product.name} ${product.type} ${product.meta}`.toLowerCase().includes(query));
    searchResults.innerHTML = results.length ? results.map(listItem).join("") : `<div class="empty-state">No exact match. REIANNA can still customise from a reference.</div>`;
  });
}

function renderProfile() {
  panelEyebrow.textContent = "Profile";
  panelContent.innerHTML = `
    <h2>Your Atelier Profile</h2>
    <p class="product-meta">A lightweight profile surface for saved preferences, consultation history, wishlist, and inquiry updates.</p>
    <div class="field-row">
      <div class="field-group"><label for="metal">Preferred metal</label><select id="metal"><option>18K Yellow Gold</option><option>18K Rose Gold</option><option>White Gold</option><option>22K Gold</option></select></div>
      <div class="field-group"><label for="budget">Typical budget</label><select id="budget"><option>₹50,000-₹1,00,000</option><option>₹1,00,000-₹2,50,000</option><option>₹2,50,000+</option></select></div>
    </div>
    <div class="field-group"><label for="occasion">Jewellery note</label><textarea id="occasion" rows="4" placeholder="Everyday diamond pieces, milestone gift, heirloom reset, engagement, or self-purchase"></textarea></div>
    <div class="panel-actions"><button class="button primary">Save Preferences</button><button class="button secondary" data-panel="wishlist">Open Wishlist</button></div>
  `;
}

function renderStudioForm(productId = "") {
  panelEyebrow.textContent = "Custom Studio";
  const selected = productId ? productById(productId) : null;
  panelContent.innerHTML = `
    <h2>${selected ? `Customise ${selected.name}` : "Begin a Personal Design"}</h2>
    <p class="product-meta">Customer-facing, simple, and guided. Technical sketch, 3D, CAD, and manufacturing steps stay behind the scenes.</p>
    <div class="field-group"><label for="reference">Show us what you love</label><textarea id="reference" rows="3" placeholder="Paste a reference link or describe the piece, mood, or saved image"></textarea></div>
    <div class="field-row">
      <div class="field-group"><label for="studioBudget">Budget</label><select id="studioBudget"><option>₹50,000-₹1,00,000</option><option>₹1,00,000-₹2,50,000</option><option>₹2,50,000-₹5,00,000</option><option>₹5,00,000+</option></select></div>
      <div class="field-group"><label for="studioPiece">Piece</label><select id="studioPiece"><option>${selected?.type || "Ring"}</option><option>Necklace</option><option>Earrings</option><option>Bracelet</option><option>Other fine jewellery</option></select></div>
    </div>
    <div class="field-row">
      <div class="field-group"><label for="studioMetal">Gold tone</label><select id="studioMetal"><option>Champagne yellow gold</option><option>Rose gold</option><option>White gold</option><option>Not sure yet</option></select></div>
      <div class="field-group"><label for="studioDiamond">Diamond preference</label><select id="studioDiamond"><option>Natural diamond</option><option>Lab-grown diamond</option><option>Open to guidance</option></select></div>
    </div>
    <div class="field-group"><label for="personalise">Personalise it</label><textarea id="personalise" rows="4" placeholder="Initials, date, motif, setting preference, comfort notes, delivery timeline"></textarea></div>
    <div class="panel-actions"><a class="button primary" target="_blank" rel="noreferrer" href="https://wa.me/919999999999?text=Hello%20REIANNA%2C%20I%20would%20like%20to%20start%20a%20Custom%20Studio%20design.">See My Concept on WhatsApp</a><button class="button secondary" data-panel="cart">Add to Inquiry Cart</button></div>
  `;
}

function listItem(product) {
  return `
    <div class="list-item">
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <h4>${product.name}</h4>
        <p>${product.meta}</p>
      </div>
      <button class="icon-button" data-detail="${product.id}" aria-label="View ${product.name}">⌕</button>
    </div>
  `;
}

function toggleWishlist(id) {
  state.wishlist.has(id) ? state.wishlist.delete(id) : state.wishlist.add(id);
  renderProducts();
}

function addInquiry(id) {
  state.inquiry.add(id);
  updateBadge();
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.dataset.panel) openPanel(target.dataset.panel);
  if (target.dataset.detail) openPanel("product", target.dataset.detail);
  if (target.dataset.wishlist) {
    toggleWishlist(target.dataset.wishlist);
    if (!panel.hidden && panelEyebrow.textContent === "Wishlist") renderWishlist();
  }
  if (target.dataset.addCart) {
    addInquiry(target.dataset.addCart);
    target.textContent = "Added to Inquiry Cart";
  }
  if (target.dataset.studioProduct) openPanel("studio", target.dataset.studioProduct);
  if (target.dataset.share) {
    const product = productById(target.dataset.share);
    const shareData = { title: product.name, text: `REIANNA ${product.name}`, url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      target.textContent = "Link Copied";
    }
  }
});

closePanel.addEventListener("click", closeActivePanel);
overlay.addEventListener("click", closeActivePanel);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".section-reveal").forEach((section) => revealObserver.observe(section));

renderProducts();
updateBadge();
