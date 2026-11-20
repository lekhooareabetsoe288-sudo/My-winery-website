/* ====== EDIT THESE DETAILS ====== */
const SHOP = {
  name: "my Winery Name",
  tagline: "Handcrafted wines from the heart of Lesotho, made with love",
  email: "lekhooareabetsoe288@gmail.com",
  phone: "+266 62113276",
  whatsapp: "+266 62113276",   // country code + number, no + or spaces
  address: "Seapoint, Maseru, Lesotho",
  currency: "M"
};
const WINES = [
  { id: 1, name: "Cabernet Sauvignon", type: "Red", year: 2021, price: 250, desc: "Full-bodied, dark berries, soft oak finish.", image: "" },
  { id: 2, name: "Merlot Reserve", type: "Red", year: 2020, price: 280, desc: "Smooth plum and cherry with a long finish.", image: "" },
  { id: 3, name: "Chardonnay", type: "White", year: 2022, price: 220, desc: "Crisp apple and citrus, lightly buttered.", image: "" },
  { id: 4, name: "Sauvignon Blanc", type: "White", year: 2023, price: 210, desc: "Fresh and zesty with green apple notes.", image: "" },
  { id: 5, name: "Rosé Delight", type: "Rosé", year: 2023, price: 200, desc: "Light strawberry and rose petal, served chilled.", image: "" },
  { id: 6, name: "Brut Sparkling", type: "Sparkling", year: 2022, price: 320, desc: "Fine bubbles for celebrations.", image: "" }
];
/* ================================ */
const $ = (s) => document.querySelector(s);
const money = (n) => SHOP.currency + n.toFixed(2);
const getCart = () => { try { return JSON.parse(localStorage.getItem("cart")) || {}; } catch (e) { return {}; } };
const saveCart = (c) => { try { localStorage.setItem("cart", JSON.stringify(c)); } catch (e) {} badge(); };
const count = () => Object.values(getCart()).reduce((a, b) => a + b, 0);
function badge() { const b = $("#badge"); if (b) b.textContent = count(); }

function layout() {
  const page = location.pathname.split("/").pop() || "index.html";
  const links = [["index.html","Home"],["shop.html","Our Wines"],["about.html","About Us"],["contact.html","Contact"],["cart.html","Cart"]];
  const nav = links.map(([h,t]) => `<a href="${h}" class="${page===h?"on":""}">${t}${h==="cart.html"?'<span class="badge" id="badge">0</span>':""}</a>`).join("");
  const h = $("#site-header"), f = $("#site-footer");
  if (h) h.innerHTML = `<header><div class="wrap"><a class="logo" href="index.html">${SHOP.name}</a><nav>${nav}</nav></div></header>`;
  if (f) f.innerHTML = `<footer><div class="wrap"><div class="grid"><div><h3>${SHOP.name}</h3><p>${SHOP.tagline}</p></div>
    <div><h3>Pages</h3>${links.slice(0,4).map(([h,t])=>`<a href="${h}">${t}</a>`).join("")}</div>
    <div><h3>Reach us</h3><p>${SHOP.address}<br>${SHOP.phone}<br>${SHOP.email}</p></div></div>
    <p class="legal">Please drink responsibly. Alcohol sales are for persons 18 and over only. &copy; ${new Date().getFullYear()} ${SHOP.name}</p></div></footer>`;
  badge();
}
function ageGate() {
  let ok = false; try { ok = localStorage.getItem("ageOk") === "yes"; } catch (e) {}
  if (ok) return;
  const g = document.createElement("div"); g.id = "gate";
  g.innerHTML = `<div><h2>Are you 18 or older?</h2><p>You must be of legal drinking age to enter this site.</p>
    <button class="btn light" id="yes">Yes, I am 18+</button><button class="btn" id="no">No</button></div>`;
  document.body.appendChild(g);
  $("#yes").onclick = () => { try { localStorage.setItem("ageOk", "yes"); } catch (e) {} g.remove(); };
  $("#no").onclick = () => { location.href = "https://www.google.com"; };
}
function card(w) {
  const pic = w.image ? `<img src="images/${w.image}" alt="${w.name}">` : "🍷";
  return `<article class="card"><div class="pic">${pic}</div><div class="body"><h3>${w.name}</h3>
    <p class="meta">${w.type}, ${w.year}</p><p>${w.desc}</p><p class="price">${money(w.price)}</p>
    <button class="btn small" data-add="${w.id}">Add to cart</button></div></article>`;
}
function renderWines(el, list) { el.innerHTML = list.map(card).join(""); }
function initShop() {
  const el = $("#wine-list"); if (!el) return;
  const limit = Number(el.dataset.limit) || 99;
  renderWines(el, WINES.slice(0, limit));
  const f = $("#filters"); if (!f) return;
  const types = ["All", ...new Set(WINES.map((w) => w.type))];
  f.innerHTML = types.map((t, i) => `<button class="${i?"":"on"}" data-type="${t}">${t}</button>`).join("");
  f.onclick = (e) => { const t = e.target.dataset.type; if (!t) return;
    [...f.children].forEach((b) => b.classList.toggle("on", b === e.target));
    renderWines(el, t === "All" ? WINES : WINES.filter((w) => w.type === t)); };
}
function renderCart() {
  const box = $("#cart-items"); if (!box) return;
  const cart = getCart(); const ids = Object.keys(cart);
  if (!ids.length) { box.innerHTML = `<p>Your cart is empty. <a href="shop.html">Browse our wines</a>.</p>`; $("#cart-total").textContent = ""; $("#checkout").style.display = "none"; return; }
  $("#checkout").style.display = "block"; let total = 0;
  box.innerHTML = ids.map((id) => { const w = WINES.find((x) => x.id == id); if (!w) return "";
    total += w.price * cart[id];
    return `<div class="row"><div><strong>${w.name}</strong><br><span class="meta">${money(w.price)} each</span></div>
      <button data-dec="${id}" aria-label="Fewer">-</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="More">+</button>
      <button class="rm" data-rm="${id}">Remove</button></div>`; }).join("");
  $("#cart-total").textContent = "Total: " + money(total);
}
function orderMessage() {
  const cart = getCart(); let total = 0;
  const lines = Object.keys(cart).map((id) => { const w = WINES.find((x) => x.id == id); total += w.price * cart[id]; return `${cart[id]} x ${w.name} (${money(w.price * cart[id])})`; });
  return `New order from ${$("#c-name").value}\nPhone: ${$("#c-phone").value}\nDelivery: ${$("#c-addr").value}\n\n${lines.join("\n")}\n\nTotal: ${money(total)}`;
}
document.addEventListener("click", (e) => {
  const d = e.target.dataset, c = getCart();
  if (d.add) { c[d.add] = (c[d.add] || 0) + 1; saveCart(c); e.target.textContent = "Added!"; setTimeout(() => (e.target.textContent = "Add to cart"), 900); }
  if (d.inc) { c[d.inc]++; saveCart(c); renderCart(); }
  if (d.dec) { c[d.dec]--; if (c[d.dec] < 1) delete c[d.dec]; saveCart(c); renderCart(); }
  if (d.rm) { delete c[d.rm]; saveCart(c); renderCart(); }
});
function initForms() {
  const co = $("#checkout"); if (co) co.onsubmit = (e) => { e.preventDefault();
    window.open(`https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(orderMessage())}`, "_blank"); };
  const cf = $("#contact-form"); if (cf) cf.onsubmit = (e) => { e.preventDefault();
    const body = `Name: ${$("#f-name").value}\nPhone: ${$("#f-phone").value}\n\n${$("#f-msg").value}`;
    location.href = `mailto:${SHOP.email}?subject=${encodeURIComponent($("#f-subject").value)}&body=${encodeURIComponent(body)}`; };
}
layout(); ageGate(); initShop(); renderCart(); initForms();
