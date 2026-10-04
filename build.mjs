import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, "dist");
const data = JSON.parse(await fs.readFile(path.join(root, "catalog.json"), "utf8"));

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]));
const categoryName = new Map(data.categories.map((item) => [item.slug, item.nameRu]));
const categoryIcons = [
  '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 4v16M15 4v16M4 9h16M4 15h16"/>',
  '<path d="m4 8 16-2-4 12H2z"/><path d="M6 8 4 18"/>',
  '<path d="M5 4h14a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2Z"/><path d="M8 8h8v8H8z"/>',
  '<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M11 17h2"/>',
  '<path d="M4 7h16l-1 14H5L4 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>',
  '<path d="M3 14 8 8l4 4 4-6 5 8"/><path d="M4 18h16"/>',
  '<path d="M4 14a8 8 0 0 1 16 0v5H4v-5Z"/><path d="M8 14h.01M12 14h.01M16 14h.01"/>',
  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
];
const categories = data.categories.map((item, index) => `
  <button class="category-card" type="button" data-category="${esc(item.slug)}">
    <span class="category-top"><span class="category-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${categoryIcons[index] || categoryIcons[0]}</svg></span><span class="category-number">${String(index + 1).padStart(2, "0")}</span></span>
    <strong>${esc(item.nameRu)}</strong><span>${esc(item.descriptionRu)}</span>
  </button>`).join("");

const cards = data.products.map((product) => `
  <article class="product-card" data-name="${esc(product.name.toLowerCase())}" data-category="${esc(product.category)}">
    <a class="product-picture" href="${esc(product.productUrl)}" target="_blank" rel="noreferrer" aria-label="Открыть источник товара: ${esc(product.name)}">
      <img src="${esc(product.image)}" alt="${esc(product.name)}">
    </a>
    <div class="product-info">
      <span class="product-category">${esc(categoryName.get(product.category) || "")}</span>
      <h3>${esc(product.name)}</h3>
      <div class="product-bottom"><strong>${esc(product.priceLabel)}</strong><a href="${esc(product.productUrl)}" target="_blank" rel="noreferrer">Источник ↗</a></div>
    </div>
  </article>`).join("");
const filterButtons = data.categories.map((item) => `<button type="button" class="filter-chip" data-filter="${esc(item.slug)}">${esc(item.nameRu)}</button>`).join("");

const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ffffff">
  <meta name="description" content="Автомобильные аксессуары для салона, ухода и комфортных поездок.">
  <title>Автомобильные аксессуары — Online Auto</title>
  <link rel="icon" href="assets/logo.svg" type="image/svg+xml">
  <style>
    :root{--ink:#20252b;--muted:#747b83;--line:#e4e7ea;--soft:#f5f6f7;--accent:#c94012;--accent-dark:#a93612;--max:1200px}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);font:15px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#fff}a{color:inherit;text-decoration:none}button,input{font:inherit}.wrap{width:min(var(--max),calc(100% - 48px));margin:auto}
    .topbar{height:82px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:28px}.brand{display:flex;align-items:center;gap:12px;min-width:245px}.brand img{width:42px;height:42px}.brand-name{font-size:14px;font-weight:800;line-height:1.2}.brand-tag{font-size:11px;color:var(--muted);margin-top:4px}.searchbox{height:44px;flex:1;position:relative}.searchbox input{width:100%;height:100%;border:0;border-radius:12px;background:#f3f4f5;padding:0 48px 0 48px;outline:0}.searchbox input:focus{box-shadow:0 0 0 2px #f0b39f}.searchbox svg{position:absolute;left:16px;top:12px;color:#717982}.top-link{font-size:13px;font-weight:650;white-space:nowrap}.top-link:hover{color:var(--accent)}.menu-button{display:none}
    .menu-button svg{width:22px;height:22px;stroke:currentColor;stroke-width:2;stroke-linecap:round;fill:none}.category-icon svg{width:20px;height:20px;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;fill:none}
    .nav{height:52px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:28px;overflow-x:auto;white-space:nowrap}.nav a{font-size:12px;font-weight:650;color:#626a72}.nav a:first-child{color:var(--accent)}.nav a:hover{color:var(--accent)}
    .hero{display:grid;grid-template-columns:.94fr 1.06fr;align-items:center;gap:48px;padding:36px 0 52px}.eyebrow{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;color:#656d75;display:flex;align-items:center;gap:10px}.eyebrow:before{content:"";width:20px;height:2px;background:var(--accent)}h1{font-size:clamp(38px,5vw,58px);line-height:1.04;letter-spacing:-.055em;margin:20px 0 18px;max-width:560px}.hero-copy p{color:#666f77;max-width:440px;margin:0 0 24px}.primary{display:inline-flex;align-items:center;justify-content:center;border-radius:9px;padding:13px 21px;background:var(--accent);color:white;font-size:13px;font-weight:750;transition:background .15s,transform .15s}.primary:hover{background:var(--accent-dark);transform:translateY(-1px)}.hero-note{margin-top:17px;color:#8a9096;font-size:11px}.hero-visual{height:340px;position:relative;border-radius:16px;overflow:hidden;background:#e8eaec}.hero-visual img{width:100%;height:100%;object-fit:cover}.hero-caption{position:absolute;bottom:17px;left:20px;color:white;font-size:12px;font-weight:650;text-shadow:0 1px 8px #0008;border-left:2px solid var(--accent);padding-left:10px}
    .section{padding:8px 0 54px}.section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:23px}.section-kicker{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#747b83;font-weight:800}.section h2{font-size:29px;letter-spacing:-.04em;line-height:1.15;margin:8px 0 0}.text-link{font-size:12px;font-weight:750;color:var(--accent);text-decoration:underline;text-underline-offset:3px;white-space:nowrap}.category-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.category-card{padding:17px 18px 18px;border:1px solid var(--line);border-radius:12px;background:#fafbfc;text-align:left;min-height:143px;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;transition:border-color .15s,background .15s}.category-card:hover{border-color:#e9a48e;background:#fff}.category-top{display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:13px}.category-icon{height:38px;width:38px;border:1px solid var(--line);border-radius:10px;background:white;display:grid;place-items:center;color:#606971}.category-number{font-size:10px;color:#abb1b7;font-weight:700}.category-card strong{font-size:13px;line-height:1.3}.category-card>span:last-child{font-size:11px;color:#777f87;margin-top:5px}
    .catalog-section{padding-top:6px}.catalog-head{align-items:center}.result-count{font-size:12px;color:var(--muted);margin-top:7px}.filters{display:flex;gap:8px;overflow-x:auto;padding:3px 0 15px;scrollbar-width:thin}.filter-chip{border:1px solid var(--line);border-radius:999px;background:white;padding:8px 13px;color:#5c646c;font-size:11px;font-weight:650;white-space:nowrap;cursor:pointer}.filter-chip:hover,.filter-chip.active{background:var(--ink);border-color:var(--ink);color:white}.products{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.product-card{border:1px solid var(--line);border-radius:13px;overflow:hidden;background:#fff;min-width:0;transition:box-shadow .15s,transform .15s}.product-card:hover{box-shadow:0 8px 24px #1e293b12;transform:translateY(-2px)}.product-card[hidden]{display:none}.product-picture{position:relative;display:block;background:#f4f5f6;aspect-ratio:1.12/1;padding:12px;overflow:hidden}.product-picture img{height:100%;width:100%;object-fit:contain;mix-blend-mode:multiply}.product-info{padding:13px 14px 14px}.product-category{font-size:10px;color:#858c92}.product-info h3{font-size:13px;line-height:1.35;min-height:36px;margin:7px 0 18px;font-weight:700}.product-bottom{display:flex;justify-content:space-between;align-items:center;gap:8px}.product-bottom strong{font-size:12px}.product-bottom a{font-size:10px;color:var(--accent);font-weight:750;text-decoration:underline;text-underline-offset:3px;white-space:nowrap}.empty{display:none;padding:38px;border:1px dashed var(--line);border-radius:12px;text-align:center;color:var(--muted)}.empty.visible{display:block}
    .footer{background:#f5f6f7;margin-top:35px;padding:31px 0 20px}.footer-main{display:flex;justify-content:space-between;gap:20px;align-items:start}.footer h2{font-size:21px;letter-spacing:-.03em;margin:0 0 5px}.footer p{font-size:12px;color:#707880;margin:0}.footer-nav{display:flex;gap:22px;font-size:11px;color:#656d75}.footer-bottom{border-top:1px solid #e3e6e8;margin-top:24px;padding-top:15px;display:flex;justify-content:space-between;gap:14px;color:#858c92;font-size:10px}.demo-note{font-size:10px;color:#737b82;padding:11px 0 0}
    @media(max-width:900px){.wrap{width:min(var(--max),calc(100% - 36px))}.brand{min-width:195px}.topbar{gap:18px}.nav{gap:20px}.hero{gap:28px}.hero-visual{height:300px}.category-grid{grid-template-columns:repeat(4,1fr)}.products{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}}
    @media(max-width:640px){.wrap{width:calc(100% - 32px)}.topbar{height:auto;min-height:70px;display:grid;grid-template-columns:1fr auto auto;gap:10px;padding:12px 0}.brand{min-width:0}.brand img{width:38px;height:38px}.brand-name{font-size:13px}.searchbox{grid-column:1/-1;grid-row:2;height:42px}.top-link{font-size:0;width:36px;height:36px;border:1px solid var(--line);border-radius:9px;display:grid;place-items:center}.top-link:after{content:"⌕";font-size:22px}.menu-button{width:38px;height:38px;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--ink);display:grid;place-items:center;cursor:pointer}.nav{height:0;overflow:hidden;opacity:0;visibility:hidden;pointer-events:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 12px;white-space:normal;border:0;transition:height .2s ease,opacity .16s ease,visibility .16s}.nav.is-open{height:auto;max-height:70vh;overflow-y:auto;opacity:1;visibility:visible;pointer-events:auto;padding:4px 0 13px;border-bottom:1px solid var(--line)}.nav a{padding:10px 2px;border-bottom:1px solid #f0f1f2;font-size:12px}.nav a:first-child{color:var(--accent)}.hero{display:flex;flex-direction:column;align-items:stretch;gap:23px;padding:28px 0 37px}.hero-copy p{font-size:13px}.hero-visual{height:auto;aspect-ratio:1.34/1}.hero h1{font-size:42px}.section{padding-bottom:37px}.section h2{font-size:25px}.section-head{margin-bottom:17px}.category-grid{grid-template-columns:repeat(2,1fr);gap:9px}.category-card{min-height:133px;padding:13px}.category-card strong{font-size:12px}.category-card>span:last-child{font-size:10px}.category-icon{width:40px;height:40px;border-radius:12px}.category-icon svg{width:21px;height:21px;stroke-width:1.8}.products{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.product-picture{aspect-ratio:.94/1;padding:8px}.product-info{padding:10px}.product-info h3{font-size:12px;min-height:48px;margin:6px 0 13px}.product-bottom strong{font-size:11px}.product-bottom a{font-size:9px}.footer-main{display:block}.footer-nav{margin-top:19px}.footer-bottom{font-size:9px}}
    @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
  </style>
</head>
<body>
  <header>
    <div class="wrap topbar">
      <a class="brand" href="./" aria-label="Автомобильные аксессуары — главная">
        <img src="assets/logo.svg" alt=""><span><span class="brand-name">Автомобильные<br>аксессуары</span><br><span class="brand-tag">Для вашего автомобиля</span></span>
      </a>
      <label class="searchbox"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="search" type="search" placeholder="Найти аксессуар" autocomplete="off" aria-label="Найти аксессуар"></label>
      <a href="#catalog" class="top-link" aria-label="Перейти в каталог">Каталог&nbsp; ↓</a>
      <button class="menu-button" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-nav"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </div>
    <nav class="nav wrap" id="mobile-nav" aria-label="Категории">
      <a href="#catalog">Все товары</a>
      ${data.categories.map((item) => `<a href="#catalog" data-nav-category="${esc(item.slug)}">${esc(item.nameRu)}</a>`).join("")}
    </nav>
  </header>
  <main>
    <section class="wrap hero">
      <div class="hero-copy"><span class="eyebrow">КОМФОРТ В ДЕТАЛЯХ</span><h1>Каждая деталь<br>имеет значение.</h1><p>Аксессуары для салона, ухода и комфортных поездок. Найдите то, что нужно вашему автомобилю.</p><a class="primary" href="#catalog">Подобрать аксессуары</a><div class="hero-note">Салон · Уход · Поездки</div></div>
      <div class="hero-visual"><img src="assets/hero.webp" alt="Современный автомобильный салон"><span class="hero-caption">Для вашего автомобиля</span></div>
    </section>
    <section class="wrap section" id="categories"><div class="section-head"><div><span class="section-kicker">01 / КАТЕГОРИИ</span><h2>Найдите свою категорию</h2></div><a class="text-link" href="#catalog">Смотреть каталог</a></div><div class="category-grid">${categories}</div></section>
    <section class="wrap section catalog-section" id="catalog"><div class="section-head catalog-head"><div><span class="section-kicker">02 / КАТАЛОГ</span><h2>Автоаксессуары</h2><div class="result-count" id="result-count" aria-live="polite">48 товаров</div></div></div><div class="filters"><button type="button" class="filter-chip active" data-filter="all">Все товары</button>${filterButtons}</div><div class="products" id="products">${cards}</div><div class="empty" id="empty">Ничего не найдено. Попробуйте изменить запрос.</div></section>
  </main>
  <footer class="footer"><div class="wrap"><div class="footer-main"><div><h2>Будем на связи</h2><p>Подбор аксессуаров для повседневных поездок.</p><div class="demo-note">Демонстрационная витрина: оформление заказа и администрирование пока не подключены.</div></div><nav class="footer-nav"><a href="#catalog">Каталог</a><a href="#categories">Категории</a></nav></div><div class="footer-bottom"><span>© Online Auto</span><span>Русский · Автомобильные аксессуары</span></div></div></footer>
  <script>
    const search = document.getElementById("search");
    const cards = [...document.querySelectorAll(".product-card")];
    const filters = [...document.querySelectorAll("[data-filter]")];
    const count = document.getElementById("result-count");
    const empty = document.getElementById("empty");
    const menuButton = document.querySelector(".menu-button");
    const nav = document.getElementById("mobile-nav");
    let active = "all";
    function update() {
      const query = search.value.trim().toLocaleLowerCase("ru");
      let visible = 0;
      for (const card of cards) {
        const matches = (active === "all" || card.dataset.category === active) && card.dataset.name.includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      }
      count.textContent = visible + (visible === 1 ? " товар" : visible < 5 ? " товара" : " товаров");
      empty.classList.toggle("visible", visible === 0);
    }
    search.addEventListener("input", update);
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
      nav.classList.toggle("is-open", isOpen);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Открыть меню");
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Открыть меню");
        menuButton.focus();
      }
    });
    for (const filter of filters) filter.addEventListener("click", () => {
      active = filter.dataset.filter;
      for (const button of filters) button.classList.toggle("active", button === filter);
      update();
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    for (const card of document.querySelectorAll(".category-card")) card.addEventListener("click", () => {
      const target = document.querySelector('[data-filter="' + card.dataset.category + '"]');
      target?.click();
    });
    for (const link of document.querySelectorAll("[data-nav-category]")) link.addEventListener("click", () => {
      document.querySelector('[data-filter="' + link.dataset.navCategory + '"]')?.click();
    });
  </script>
</body>
</html>`;

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });
await fs.writeFile(path.join(output, "index.html"), html);
await fs.cp(path.join(root, "assets"), path.join(output, "assets"), { recursive: true });
console.log(`Built a static visual catalog with ${data.products.length} products.`);
