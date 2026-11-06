(() => {
  const S = window.SITE;
  const W = window.WORKS;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const tgUrl = `https://t.me/${S.telegram}`;
  const service = id => S.services.find(s => s.id === id) || { short: id, title: id };
  // aliases — старые адреса кейса: { "старый-slug": "id серии, просмотр которой открыть" }
  const bySlug = slug => W.find(w => w.slug === slug || (w.aliases && slug in w.aliases));

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
          ${w.concept && w.badge !== false ? `<span class="badge">Концепт</span>` : ""}
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

  const ICON_UR = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>`;
  const slidesWord = n => {
    const d = n % 10, h = n % 100;
    if (d === 1 && h !== 11) return `${n} слайд`;
    if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return `${n} слайда`;
    return `${n} слайдов`;
  };

  // Кейс из нескольких серий: обложки серий, по клику — просмотр с переключением серий
  const seriesCase = w => `
    <section class="cs" aria-label="${w.title}">
      <div class="cs-intro">
        <h2>${w.headline || w.title}</h2>
        <div class="cs-intro-note">
          ${w.lead ? `<p>${w.lead}</p>` : ""}
          <a class="btn" href="${tgUrl}" target="_blank" rel="noopener">${w.cta || "Обсудить задачу"} ${ICON_UR}</a>
        </div>
      </div>
      ${w.series.length === 1 ? seriesGrid(w.series[0]) : `
      <div class="cs-projects">
        ${w.series.map((s, i) => `
          <article style="--series-bg: ${s.bg || "var(--card)"}">
            <button class="cs-cover" data-series="${i}" aria-label="Смотреть серию «${s.name}», ${slidesWord(s.slides.length)}">
              <img src="${s.slides[0].src}" alt="">
              <span class="cs-hint" aria-hidden="true">Листать серию ${ICON_UR}</span>
            </button>
            <div class="cs-meta">
              <p class="cs-eyebrow">${s.category}</p>
              <h3>${s.name}</h3>
              <p>${s.note}</p>
              <button class="cs-link" data-series="${i}">Смотреть ${slidesWord(s.slides.length)} ${ICON_UR}</button>
            </div>
          </article>`).join("")}
      </div>`}
      ${w.outro ? `<p class="cs-outro">${w.outro}</p>` : ""}
    </section>`;

  // Серия сеткой, последняя ячейка — палитра, шрифты и формат. В сетке — лёгкая миниатюра, у SVG — сам слайд
  const gridSrc = g => (/\.svg$/.test(g.src) ? g.src : g.thumb || g.src);
  const seriesGrid = (s, si = 0) => `
    <div class="cs-grid" style="--series-bg: ${s.bg || "var(--card)"}">
      ${s.slides.map((g, i) => `
        <button class="cs-slide" data-series="${si}" data-at="${i}" aria-label="Открыть крупно: ${g.title}">
          <img src="${gridSrc(g)}" alt="" loading="lazy">
          <span><b>${String(i + 1).padStart(2, "0")}</b>${g.title}</span>
        </button>`).join("")}
      ${s.spec ? `
        <div class="cs-spec">
          ${s.spec.palette ? `
            <p class="cs-eyebrow">Палитра</p>
            <ul class="cs-swatches">
              ${s.spec.palette.map(c => `<li><i style="background: ${c.hex}"></i>${c.name}<small>${c.hex}</small></li>`).join("")}
            </ul>` : ""}
          ${s.spec.fonts ? `<p class="cs-eyebrow">Шрифты</p><p>${s.spec.fonts}</p>` : ""}
          ${s.spec.format ? `<p class="cs-eyebrow">Формат</p><p>${s.spec.format}</p>` : ""}
        </div>` : ""}
    </div>`;

  function openCase(w, setId) {
    const i = W.indexOf(w);
    const next = W[(i + 1) % W.length];
    body.innerHTML = `
      <p class="case-kicker">
        <span>${w.kicker || `${service(w.service).title}${w.year ? ` · ${w.year}` : ""}`}</span>
        ${w.concept && w.badge !== false ? `<span class="badge badge-line">Концепт</span>` : ""}
      </p>
      ${w.series ? "" : `<h2>${w.title}</h2>`}
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
      ${w.series ? seriesCase(w) : `
        <div class="case-text">
          ${w.task ? `<div><h3>Задача</h3><p>${w.task}</p></div>` : ""}
          ${w.solution ? `<div><h3>Решение</h3><p>${w.solution}</p></div>` : ""}
        </div>
        ${w.gallery ? `
          <div class="gallery">
            ${w.gallery.map((g, i) => `
              <button class="gallery-item" data-shot="${i}" aria-label="Открыть крупно: ${g.title}">
                <img src="${g.src}" alt="${g.alt}" loading="lazy">
                <span class="gallery-cap">${g.title}</span>
              </button>`).join("")}
          </div>` : ""}
        ${w.video ? `<video class="case-media" src="${w.video}" autoplay muted loop playsinline controls></video>` : ""}
        ${(w.images || []).map(m => typeof m === "string"
          ? `<img class="case-media" src="${m}" alt="" loading="lazy">`
          : `<video class="case-media${m.vertical ? " vertical" : ""}" src="${m.video}"${m.poster ? ` poster="${m.poster}"` : ""} ${m.sound ? "controls preload=\"metadata\"" : "autoplay muted loop"} playsinline></video>`).join("")}`}
      ${w.note ? `<p class="case-note">${w.note}</p>` : ""}
      <div class="case-end">
        <a class="btn" href="${tgUrl}" target="_blank" rel="noopener">Хочу так же — написать в Telegram</a>
        ${next !== w ? `<a class="link" href="#${next.slug}">Дальше: ${next.title} →</a>` : ""}
      </div>`;
    const cmp = $(".compare", body);
    if (cmp) bindCompare(cmp);
    $$("[data-shot]", body).forEach(b => { b.onclick = () => openShot(w.gallery, +b.dataset.shot); });
    $$("[data-series]", body).forEach(b => { b.onclick = () => openSeries(w, +b.dataset.series, b, +(b.dataset.at || 0)); });
    dlg.classList.toggle("case-series", !!w.series);
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    // Старый адрес серии — сразу открываем её просмотр поверх кейса
    const si = setId ? w.series.findIndex(s => s.id === setId) : -1;
    if (si >= 0) openSeries(w, si, $(`.cs-cover[data-series="${si}"]`, body));
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

  // Просмотр серии крупно: стрелки, клавиши ← →, свайп; Esc и «Назад ко всем» возвращают к кейсу
  const viewer = $("#viewer");
  const stage = $(".viewer-stage", viewer);
  const shotImg = $("img", stage);
  let shots = [];
  let shot = 0;

  function showShot(i) {
    shot = (i + shots.length) % shots.length;
    const g = shots[shot];
    shotImg.src = g.src;
    shotImg.alt = g.alt;
    $(".viewer-title", viewer).textContent = g.title;
    $(".viewer-count", viewer).textContent = `${shot + 1} / ${shots.length}`;
    [shot - 1, shot + 1].forEach(j => { new Image().src = shots[(j + shots.length) % shots.length].src; });
  }

  function openShot(list, i) {
    shots = list;
    showShot(i);
    if (!viewer.open) viewer.showModal();
  }

  $("[data-back]", viewer).onclick = () => viewer.close();
  $$("[data-step]", viewer).forEach(b => { b.onclick = () => showShot(shot + Number(b.dataset.step)); });
  viewer.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") showShot(shot - 1);
    else if (e.key === "ArrowRight") showShot(shot + 1);
    else return;
    e.preventDefault();
  });
  // Фокус возвращаем на ту обложку, до которой долистали
  viewer.addEventListener("close", () => { $(`[data-shot="${shot}"]`, body)?.focus(); });

  let swipeX = null;
  stage.addEventListener("pointerdown", e => { swipeX = e.clientX; });
  stage.addEventListener("pointercancel", () => { swipeX = null; });
  stage.addEventListener("pointerup", e => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 50) showShot(shot + (dx < 0 ? 1 : -1));
  });

  // Просмотр серий: вкладки серий, стрелки, миниатюры, клавиши ← →, свайп.
  // Esc, «Все серии» и ✕ возвращают к кейсу, фокус — на кнопку, с которой открыли
  const sv = $("#series");
  const svStage = $(".sv-stage", sv);
  const svImg = $("img", svStage);
  const svPrev = $(".sv-prev", sv);
  const svNext = $(".sv-next", sv);
  let svWork = null;
  let svSet = 0;
  let svAt = 0;
  let svFrom = null;

  function renderSeries(focusTab, at = 0) {
    const s = svWork.series[svSet];
    const several = svWork.series.length > 1;
    sv.style.setProperty("--series-bg", s.bg || "var(--card)");
    $(".sv-back-text", sv).textContent = several ? "Все серии" : "Все слайды";
    $(".sv-tabs", sv).hidden = !several;
    $(".sv-tabs", sv).innerHTML = svWork.series.map((x, i) =>
      `<button data-sv-set="${i}"${i === svSet ? ` aria-current="true"` : ""}>${x.name}</button>`).join("");
    $(".sv-eyebrow", sv).textContent = `${s.category} · ${slidesWord(s.slides.length)}`;
    $(".sv-name", sv).textContent = s.name;
    $(".sv-intro", sv).textContent = s.intro || "";
    $(".sv-strip", sv).innerHTML = s.slides.map((g, i) => `
      <button data-sv-at="${i}" aria-label="Слайд ${i + 1}: ${g.title}">
        <img src="${g.thumb || g.src}" alt=""><span>${String(i + 1).padStart(2, "0")}</span>
      </button>`).join("");
    const note = $(".sv-note", sv);
    note.textContent = s.disclaimer || "";
    note.hidden = !s.disclaimer;
    $$("[data-sv-set]", sv).forEach(b => { b.onclick = () => { svSet = +b.dataset.svSet; renderSeries(true); }; });
    $$("[data-sv-at]", sv).forEach(b => { b.onclick = () => showSlide(+b.dataset.svAt); });
    showSlide(at);
    if (focusTab) $(`[data-sv-set="${svSet}"]`, sv).focus();
  }

  function showSlide(i) {
    const slides = svWork.series[svSet].slides;
    svAt = Math.max(0, Math.min(slides.length - 1, i));
    const g = slides[svAt];
    svImg.src = g.src;
    svImg.alt = g.alt;
    $(".sv-cap", sv).textContent = g.title;
    $(".sv-count", sv).textContent = `${svAt + 1} / ${slides.length}`;
    svPrev.disabled = svAt === 0;
    svNext.disabled = svAt === slides.length - 1;
    // Стрелка стала неактивной — переводим фокус на соседнюю, чтобы клавиатура не терялась
    if (document.activeElement === svPrev && svPrev.disabled) svNext.focus();
    if (document.activeElement === svNext && svNext.disabled) svPrev.focus();
    $$("[data-sv-at]", sv).forEach(b => {
      if (+b.dataset.svAt === svAt) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
    [svAt - 1, svAt + 1].forEach(j => { if (slides[j]) new Image().src = slides[j].src; });
  }

  function openSeries(w, i, from, at = 0) {
    svWork = w;
    svSet = i;
    svFrom = from;
    renderSeries(false, at);
    if (!sv.open) sv.showModal();
  }

  svPrev.onclick = () => showSlide(svAt - 1);
  svNext.onclick = () => showSlide(svAt + 1);
  $$("[data-sv-close]", sv).forEach(b => { b.onclick = () => sv.close(); });
  // В сетке слайдов фокус встаёт на тот слайд, до которого долистали; иначе — на кнопку, с которой открыли
  sv.addEventListener("close", () => {
    ($(`[data-series="${svSet}"][data-at="${svAt}"]`, body) || svFrom)?.focus();
  });
  sv.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") showSlide(svAt - 1);
    else if (e.key === "ArrowRight") showSlide(svAt + 1);
    else return;
    e.preventDefault();
  });

  let svX = null;
  let svY = null;
  svStage.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;
    svX = e.clientX;
    svY = e.clientY;
  });
  svStage.addEventListener("pointercancel", () => { svX = null; });
  svStage.addEventListener("pointerup", e => {
    if (svX === null) return;
    const dx = e.clientX - svX;
    const dy = e.clientY - svY;
    svX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showSlide(svAt + (dx < 0 ? 1 : -1));
  });

  function route() {
    const slug = decodeURIComponent(location.hash.slice(1));
    const w = bySlug(slug);
    if (w) openCase(w, w.aliases?.[slug]);
    else if (dlg.open) dlg.close();
  }

  dlg.addEventListener("close", () => {
    if (viewer.open) viewer.close();
    if (sv.open) sv.close();
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
