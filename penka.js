// Кейс «Пенка»: витрина, на которой включается вывеска, сборка знака, палитра, шрифт, один день кофейни в живых кадрах.
// app.js зовёт PENKA.html(w) для разметки и PENKA.bind(body, dlg) после вставки; bind возвращает функцию остановки.
window.PENKA = (() => {
  // Геометрия знака (viewBox 0 0 240 210) — та же, что в концепты/penka/lib.js
  const MARK = {
    foam: [[82, 100, 32], [120, 80, 42], [158, 100, 32]],
    foamBase: "M50 100H190V122H50Z",
    bowl: "M44 120H196C196 158 176 180 146 180H94C64 180 44 158 44 120Z",
    handle: "M190 132C216 128 222 162 188 164",
    saucer: "M28 190H212Q218 190 218 196Q218 202 212 202H28Q22 202 22 196Q22 190 28 190Z",
  };
  let uid = 0;
  const mark = (cls = "") => {
    const id = `pkm${uid++}`;
    return `<svg class="${cls}" viewBox="0 0 240 210" aria-hidden="true" focusable="false">
      <defs><mask id="${id}" maskUnits="userSpaceOnUse"><rect x="-20" y="-20" width="280" height="250" fill="#fff"/><rect x="0" y="111" width="240" height="9" fill="#000"/></mask></defs>
      <g fill="currentColor" mask="url(#${id})">${MARK.foam.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}
        <path d="${MARK.foamBase}"/><path d="${MARK.bowl}"/><path d="${MARK.saucer}"/></g>
      <path d="${MARK.handle}" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round"/></svg>`;
  };
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DRINKS = ["Раф на овсяном — как облако", "Флэт уайт без спешки", "Какао как в детстве", "Капучино на вынос"];

  // ---------- Разметка ----------
  const media = p => p.video
    ? `<video src="${p.video}" poster="${p.poster}" muted loop playsinline preload="none" width="${p.w || 1536}" height="${p.h || 1024}" aria-label="${p.alt}" data-pk-loop></video>`
    : `<img src="${p.src}" alt="${p.alt}" width="${p.w || 1920}" height="${p.h || 1280}" loading="lazy">`;
  const photo = (p, i, extra = "", style = "") => `
    <figure class="pk-ph ${extra}" data-pk-reveal${style ? ` style="${style}"` : ""}>
      <button class="pk-ph-img" data-shot="${i}" aria-label="Открыть крупно: ${p.title}">
        ${media(p)}
        ${p.time ? `<span class="pk-time">${p.time}</span>` : ""}
      </button>
      <figcaption>${p.caption}</figcaption>
    </figure>`;

  function html(w) {
    const p = w.penka, ph = p.photos, hero = p.hero;
    const at = id => ph.findIndex(x => x.id === id);
    const band = `${mark()}<span>пенка</span>${mark("pk-a")}<span>с пенкой вкуснее</span>${mark()}<span>7:30 — 22:00</span>${mark("pk-a")}<span>на овсяном</span>`;
    return `
    <section class="pk" aria-label="${w.title}">
      <div class="pk-hero" data-pk-hero>
        <div class="pk-hero-media">
          <img class="pk-hero-off" src="${hero.off}" alt="" width="1536" height="1024">
          <video class="pk-hero-video" src="${hero.video}" muted playsinline preload="auto" width="1536" height="1024" aria-label="${hero.alt}"></video>
          <img class="pk-hero-on" src="${hero.on}" alt="${hero.alt}" width="1536" height="1024">
        </div>
        <div class="pk-hero-copy">
          <p class="pk-eyebrow">${p.eyebrow}</p>
          <h2 class="pk-title">${p.headline}</h2>
          <p class="pk-hero-lead">${p.lead}</p>
        </div>
        <button class="pk-hero-again" type="button" hidden>Включить вывеску ещё раз</button>
        <span class="pk-hero-time">19:40</span>
      </div>

      <div class="pk-brief" data-pk-reveal>
        <div><h3>Задача</h3><p>${p.task}</p></div>
        <div><h3>Идея</h3><p>${p.idea}</p></div>
        <div><h3>Что сделано</h3><p>${p.done}</p></div>
      </div>

      <div class="pk-head" data-pk-reveal><h3>Знак — чашка капучино</h3><p>Шапка пены из трёх окружностей лежит поверх чашки с зазором, как у настоящего капучино. Блюдце держит знак устойчиво в любом размере.</p></div>
      <div class="pk-build" data-pk-build data-pk-reveal>
        <div class="pk-build-stage">
          <svg viewBox="-34 0 300 226" aria-label="Построение знака: три окружности пены, зазор, чаша, ручка и блюдце" role="img">
            <defs>
              <mask id="pk-gap" maskUnits="userSpaceOnUse"><rect x="-40" y="-20" width="320" height="260" fill="#fff"/><rect x="-34" y="111" width="300" height="9" fill="#000"/></mask>
              <clipPath id="pk-rim" clipPathUnits="userSpaceOnUse"><rect x="-40" y="-60" width="320" height="171"/></clipPath>
            </defs>
            <g class="pk-b-guides" fill="none" stroke="currentColor">
              ${[38, 111, 120, 180, 190].map((y, i) => `<line style="--i:${i}" pathLength="100" x1="-34" x2="266" y1="${y}" y2="${y}"/>`).join("")}
              <line style="--i:5" pathLength="100" x1="120" x2="120" y1="14" y2="214"/>
            </g>
            <g class="pk-b-ink" mask="url(#pk-gap)">
              <g clip-path="url(#pk-rim)"><g class="pk-b-foam">
                ${MARK.foam.map(([x, y, r], i) => `<circle class="pk-b-f" style="--i:${[1, 0, 2][i]}" cx="${x}" cy="${y}" r="${r}"/>`).join("")}
                <path class="pk-b-f" style="--i:1" d="${MARK.foamBase}"/>
              </g></g>
              <path class="pk-b-bowl" d="${MARK.bowl}"/>
              <path class="pk-b-saucer" d="${MARK.saucer}"/>
            </g>
            <path class="pk-b-handle" d="${MARK.handle}" pathLength="100" fill="none" stroke-width="16" stroke-linecap="round"/>
            <g class="pk-b-rings" fill="none">${MARK.foam.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>
            <g class="pk-b-labels">
              <text x="120" y="70">R 42</text><text x="76" y="96">R 32</text><text x="164" y="96">R 32</text>
              <text class="pk-b-side" x="-32" y="108">зазор 9</text><text class="pk-b-side" x="-32" y="187">блюдце</text>
            </g>
          </svg>
          <button class="pk-btn pk-replay" type="button">Собрать заново</button>
        </div>
        <div class="pk-build-side">
          <dl class="pk-specs">
            <div><dt>Пена</dt><dd>3 окружности · R 32 / 42 / 32</dd></div>
            <div><dt>Зазор</dt><dd>9 единиц, читается от 16 px</dd></div>
            <div><dt>Ручка</dt><dd>штрих 16 единиц, круглые концы</dd></div>
            <div><dt>Цвет</dt><dd>всегда один, на любом фоне</dd></div>
          </dl>
          <div class="pk-size">
            <div class="pk-size-view" style="--s:64px">${mark()}</div>
            <label class="pk-size-ctl"><span>Размер знака <b data-pk-size>64 px</b> <em data-pk-size-use>аватар в соцсетях</em></span>
              <input type="range" min="16" max="200" value="64" step="1" aria-label="Размер знака в пикселях"></label>
          </div>
        </div>
      </div>

      <div class="pk-head" data-pk-reveal><h3>Цвет</h3><p>Кобальт вместо привычного коричневого — его видно с улицы и в ленте. Сливки и абрикос добавляют тепла и пахнут выпечкой. Нажмите на цвет, чтобы скопировать HEX.</p></div>
      <div class="pk-pour" data-pk-pour>
        ${p.colors.map((c, i) => `
          <button class="pk-sw" type="button" style="--c:${c.hex};--fg:${c.fg};--share:${c.share};--i:${i}" data-hex="${c.hex}" aria-label="${c.name}, ${c.hex}. Скопировать">
            <span class="pk-liquid" aria-hidden="true"></span>
            <span class="pk-sw-top"><i>${c.role}</i><i>${c.share}%</i></span>
            <span class="pk-sw-bot"><b>${c.name}</b><span>HEX ${c.hex}<br>RGB ${c.rgb}<br>CMYK ${c.cmyk}</span></span>
          </button>`).join("")}
      </div>

      <div class="pk-head" data-pk-reveal><h3>Шрифты</h3><p>Dela Gothic One — плотный и округлый, как шапка пены: им набраны логотип и заголовки. Manrope держит меню, цены и подписи. Напишите свой напиток прямо на карточке.</p></div>
      <div class="pk-type" data-pk-reveal>
        <div class="pk-spec">
          <p class="pk-label">Dela Gothic One · логотип и заголовки</p>
          <div class="pk-spec-big" aria-hidden="true">Пп</div>
          <p class="pk-abc">АБВГДЕЁЖЗИЙКЛМНОП<br>РСТУФХЦЧШЩЪЫЬЭЮЯ<br>0123456789 — «»</p>
          <p class="pk-label pk-label--b">Manrope · меню, цены, подписи</p>
          <ul class="pk-weights"><li style="font-weight:500">Описания в меню и постах <i>Medium</i></li><li style="font-weight:700">Цены, кнопки, подписи <i>Bold</i></li><li style="font-weight:800;letter-spacing:.08em;text-transform:uppercase">Плашки и капс <i>ExtraBold</i></li></ul>
        </div>
        <div class="pk-menu">
          <div class="pk-card">
            <p class="pk-card-kicker">Новинка недели</p>
            <h4 class="pk-card-title" contenteditable="true" spellcheck="false" role="textbox" aria-label="Название напитка, можно изменить" data-pk-drink>${DRINKS[0]}</h4>
            <p class="pk-card-text">Готовим на овсяном или обычном молоке, с плотной шапкой пены. Не тяжёлый, сладкий в меру.</p>
            <div class="pk-card-foot"><span class="pk-price">340 ₽</span>${mark("pk-card-mark")}</div>
          </div>
          <div class="pk-chips" role="group" aria-label="Готовые названия">${DRINKS.map(d => `<button type="button" class="pk-chip">${d}</button>`).join("")}</div>
        </div>
      </div>

      <div class="pk-head" data-pk-reveal><h3>Один день «Пенки»</h3><p>Бренд проверяли не на макетах, а на целом дне кофейни: от первой чашки до вечерней вывески.</p></div>
      <div class="pk-day">
        ${p.day.map(row => `<div class="pk-row">${row.map(id => { const x = ph[at(id)]; return photo(x, at(id), `pk-ph--${id}`, `--ar:${((x.w || 1920) / (x.h || 1280)).toFixed(4)}`); }).join("")}</div>`).join("")}
      </div>

      <div class="pk-band" aria-hidden="true">
        <div class="pk-band-row"><div>${band}${band}</div></div>
      </div>

      <div class="pk-head" data-pk-reveal><h3>Бренд-бук</h3><p>Все листы системы: идея, знак, логотип, цвет, шрифты, графика, носители. Нажмите, чтобы открыть крупно и пролистать.</p></div>
      <div class="pk-system" data-pk-reveal>
        ${p.book.map((g, i) => `
          <button class="pk-sys" data-shot="${ph.length + i}" aria-label="Открыть крупно: ${g.title}">
            <img src="${g.src}" alt="${g.alt}" width="1920" height="1200" loading="lazy">
            <span><b>${String(i + 1).padStart(2, "0")}</b>${g.title}</span>
          </button>`).join("")}
      </div>
    </section>`;
  }

  // ---------- Шапка: вывеска включается, когда витрину видно ----------
  function hero(root, dlg) {
    const el = root.querySelector("[data-pk-hero]");
    const v = el.querySelector("video"), again = el.querySelector(".pk-hero-again");
    if (reduced()) { el.classList.add("is-lit"); v.removeAttribute("src"); v.load(); return () => {}; }
    let started = false;
    const play = () => {
      v.currentTime = 0;
      v.play().then(() => el.classList.add("is-playing")).catch(() => el.classList.add("is-lit"));
    };
    const start = () => { if (started) return; started = true; if (v.readyState >= 2) play(); else v.addEventListener("canplay", play, { once: true }); };
    v.addEventListener("ended", () => { again.hidden = false; });
    again.onclick = e => { e.stopPropagation(); again.hidden = true; play(); };
    // Если видео не дождались — показываем включённую вывеску
    const fallback = setTimeout(() => { if (v.paused && v.currentTime === 0) el.classList.add("is-lit"); }, 8000);
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { start(); io.disconnect(); } }, { root: dlg, threshold: .55 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(fallback); v.pause(); };
  }

  // ---------- Живые кадры: играют, только пока их видно ----------
  function loops(root, dlg) {
    const vids = [...root.querySelectorAll("[data-pk-loop]")];
    if (reduced()) return () => {};
    const io = new IntersectionObserver(es => es.forEach(en => {
      const v = en.target;
      if (en.isIntersecting && !document.hidden) { if (v.preload !== "auto") v.preload = "auto"; v.play().catch(() => {}); }
      else v.pause();
    }), { root: dlg, threshold: .25 });
    vids.forEach(v => io.observe(v));
    const onVis = () => { if (document.hidden) vids.forEach(v => v.pause()); else vids.forEach(v => { io.unobserve(v); io.observe(v); }); };
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); vids.forEach(v => v.pause()); };
  }

  // ---------- Плавные появления при прокрутке ----------
  function reveal(root, dlg) {
    const els = [...root.querySelectorAll("[data-pk-reveal]")];
    if (reduced()) { els.forEach(e => e.classList.add("is-in")); return () => {}; }
    els.forEach(e => e.classList.add("pk-hide"));
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { root: dlg, threshold: .12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }

  // ---------- Сборка знака, размер, палитра, шрифт ----------
  function build(root, dlg) {
    const el = root.querySelector("[data-pk-build]");
    const play = () => { el.classList.remove("is-on"); void el.offsetWidth; el.classList.add("is-on"); };
    if (!reduced()) el.classList.add("is-armed"); else el.classList.add("is-on");
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { setTimeout(play, 250); io.disconnect(); } }, { root: dlg, threshold: .5 });
    io.observe(el);
    el.querySelector(".pk-replay").onclick = () => { el.classList.add("is-armed"); play(); };

    const range = root.querySelector(".pk-size input"), view = root.querySelector(".pk-size-view");
    const out = root.querySelector("[data-pk-size]"), use = root.querySelector("[data-pk-size-use]");
    const uses = [[24, "иконка во вкладке"], [40, "значок приложения"], [90, "аватар в соцсетях"], [150, "стакан и меню"], [999, "вывеска над входом"]];
    const set = () => { const v = +range.value; view.style.setProperty("--s", `${v}px`); out.textContent = `${v} px`; use.textContent = uses.find(([m]) => v < m)[1]; };
    range.oninput = set; set();

    const pour = root.querySelector("[data-pk-pour]");
    const io2 = new IntersectionObserver(([en]) => { if (en.isIntersecting) { pour.classList.add("is-on"); io2.disconnect(); } }, { root: dlg, threshold: .35 });
    if (reduced()) pour.classList.add("is-on"); else io2.observe(pour);
    pour.querySelectorAll(".pk-sw").forEach(b => {
      b.onclick = async () => {
        const name = b.querySelector("b");
        const was = b.dataset.name || (b.dataset.name = name.textContent);
        try { await navigator.clipboard.writeText(b.dataset.hex); name.textContent = "Скопировано"; } catch { name.textContent = b.dataset.hex; }
        clearTimeout(b._t); b._t = setTimeout(() => { name.textContent = was; }, 1200);
      };
    });

    const title = root.querySelector("[data-pk-drink]");
    const fit = () => { const n = title.textContent.length; title.style.setProperty("--fs", n > 30 ? .8 : n > 22 ? .9 : 1); };
    title.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); title.blur(); } });
    title.addEventListener("paste", e => { e.preventDefault(); document.execCommand("insertText", false, (e.clipboardData.getData("text/plain") || "").replace(/\s+/g, " ").slice(0, 40)); });
    title.addEventListener("input", () => { if (title.textContent.length > 40) title.textContent = title.textContent.slice(0, 40); fit(); });
    title.addEventListener("blur", () => { if (!title.textContent.trim()) title.textContent = DRINKS[0]; fit(); });
    root.querySelectorAll(".pk-chip").forEach(c => { c.onclick = () => { title.textContent = c.textContent; fit(); }; });
    fit();
    return () => { io.disconnect(); io2.disconnect(); };
  }

  function bind(root, dlg) {
    const stops = [hero(root, dlg), loops(root, dlg), reveal(root, dlg), build(root, dlg)];
    return () => stops.forEach(f => f());
  }

  return { html, bind };
})();
