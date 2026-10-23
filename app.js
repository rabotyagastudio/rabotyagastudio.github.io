(() => {
  const S = window.SITE;
  const W = window.WORKS;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const tgUrl = `https://t.me/${S.telegram}`;
  const service = id => S.services.find(s => s.id === id) || { short: id, title: id };
  const bySlug = slug => W.find(w => w.slug === slug);

  // Тексты и ссылки из data.js
  document.documentElement.style.setProperty("--accent", S.accent);
  document.title = `${S.name} — ${S.role}`;
  $$("[data-site]").forEach(el => { el.textContent = S[el.dataset.site]; });
  $$("[data-tg]").forEach(el => {
    el.href = tgUrl;
    el.target = "_blank";
    el.rel = "noopener";
    if (!el.textContent.trim()) el.textContent = `@${S.telegram} →`;
  });
  $("#year").textContent = new Date().getFullYear();

  // Бегущая строка: две одинаковые половины, чтобы цикл был бесшовным
  const tickerItems = S.services.map(s => `<span>${s.title}</span>`).join("");
  $(".ticker-track").innerHTML = tickerItems.repeat(4);

  // Фильтры по услугам — только те, где есть работы
  let current = "all";
  const filters = $(".filters");
  const used = S.services.filter(s => W.some(w => w.service === s.id));
  [{ id: "all", short: "Все" }, ...used].forEach(s => {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = s.short;
    b.dataset.id = s.id;
    b.onclick = () => setFilter(s.id);
    filters.append(b);
  });
  filters.hidden = used.length < 2;

  function setFilter(id) {
    current = id;
    $$(".chip", filters).forEach(b => b.setAttribute("aria-pressed", b.dataset.id === id));
    renderGrid();
  }

  function renderGrid() {
    const grid = $(".grid");
    const list = W.filter(w => current === "all" || w.service === current);
    if (!list.length) {
      grid.innerHTML = `<p class="empty">Скоро здесь появятся работы.</p>`;
      return;
    }
    grid.innerHTML = list.map(w => `
      <a class="card" href="#${w.slug}">
        <div class="card-img"><img src="${w.cover}" alt="" loading="lazy"></div>
        <div class="badges">
          ${w.before && w.after ? `<span class="badge badge-accent">Было / стало</span>` : ""}
          ${w.concept ? `<span class="badge">Концепт</span>` : ""}
        </div>
        <div class="card-meta">
          <h3>${w.title}</h3>
          <p>${service(w.service).short}${w.year ? ` · ${w.year}` : ""}</p>
        </div>
      </a>`).join("");
  }

  setFilter("all");

  // Услуги
  $(".services").innerHTML = S.services.map((s, i) => `
    <li>
      <span class="num">${String(i + 1).padStart(2, "0")}</span>
      <div>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
      </div>
      <div class="svc-side">
        ${s.price ? `<span class="price">${s.price}</span>` : ""}
        ${used.includes(s) ? `<button class="link" data-filter="${s.id}">Работы →</button>` : ""}
      </div>
    </li>`).join("");
  $$("[data-filter]").forEach(b => {
    b.onclick = () => {
      setFilter(b.dataset.filter);
      $("#works").scrollIntoView({ behavior: "smooth" });
    };
  });

  // Кейс в модалке, адрес #slug — чтобы давать ссылку на конкретную работу
  const dlg = $("#case");
  const body = $(".case-body", dlg);

  function openCase(w) {
    const i = W.indexOf(w);
    const next = W[(i + 1) % W.length];
    body.innerHTML = `
      <p class="case-kicker">
        <span>${service(w.service).title}${w.year ? ` · ${w.year}` : ""}</span>
        ${w.concept ? `<span class="badge badge-line">Концепт</span>` : ""}
      </p>
      <h2>${w.title}</h2>
      ${w.url ? `<a class="btn btn-sm btn-ghost case-url" href="${w.url}" target="_blank" rel="noopener">Открыть сайт ↗</a>` : ""}
      ${w.before && w.after ? `
        <div class="compare">
          <img src="${w.before}" alt="Было">
          <img class="compare-after" src="${w.after}" alt="Стало">
          <span class="compare-label l">Было</span>
          <span class="compare-label r">Стало</span>
          <div class="compare-handle" tabindex="0" role="slider" aria-label="Было / стало"
               aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
            <span class="compare-knob"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 3 12l6 6M15 6l6 6-6 6"/></svg></span>
          </div>
        </div>` : ""}
      <div class="case-text">
        ${w.task ? `<div><h3>Задача</h3><p>${w.task}</p></div>` : ""}
        ${w.solution ? `<div><h3>Решение</h3><p>${w.solution}</p></div>` : ""}
      </div>
      ${w.video ? `<video class="case-media" src="${w.video}" autoplay muted loop playsinline controls></video>` : ""}
      ${(w.images || []).map(m => typeof m === "string"
        ? `<img class="case-media" src="${m}" alt="" loading="lazy">`
        : `<video class="case-media${m.vertical ? " vertical" : ""}" src="${m.video}"${m.poster ? ` poster="${m.poster}"` : ""} autoplay muted loop playsinline></video>`).join("")}
      <div class="case-end">
        <a class="btn" href="${tgUrl}" target="_blank" rel="noopener">Хочу так же — написать в Telegram</a>
        ${next !== w ? `<a class="link" href="#${next.slug}">Дальше: ${next.title} →</a>` : ""}
      </div>`;
    const cmp = $(".compare", body);
    if (cmp) bindCompare(cmp);
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }

  function bindCompare(el) {
    const handle = $(".compare-handle", el);
    let pos = 50;
    const set = p => {
      pos = Math.min(100, Math.max(0, p));
      el.style.setProperty("--pos", `${pos}%`);
      handle.setAttribute("aria-valuenow", Math.round(pos));
    };
    const fromX = x => {
      const r = el.getBoundingClientRect();
      set(((x - r.left) / r.width) * 100);
    };
    el.addEventListener("pointerdown", e => { el.setPointerCapture(e.pointerId); fromX(e.clientX); });
    el.addEventListener("pointermove", e => { if (el.hasPointerCapture(e.pointerId)) fromX(e.clientX); });
    handle.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") set(pos - 5);
      else if (e.key === "ArrowRight") set(pos + 5);
      else return;
      e.preventDefault();
    });
  }

  function route() {
    const w = bySlug(decodeURIComponent(location.hash.slice(1)));
    if (w) openCase(w);
    else if (dlg.open) dlg.close();
  }

  dlg.addEventListener("close", () => {
    $$("video", body).forEach(v => v.pause());
    if (bySlug(decodeURIComponent(location.hash.slice(1)))) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  });
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  $("[data-close]", dlg).onclick = () => dlg.close();
  $("[data-copy]", dlg).onclick = async e => {
    const b = e.currentTarget;
    try {
      await navigator.clipboard.writeText(location.href);
      b.textContent = "Скопировано";
    } catch {
      b.textContent = location.href;
    }
    setTimeout(() => { b.textContent = "Скопировать ссылку"; }, 1600);
  };

  window.addEventListener("hashchange", route);
  route();
})();
