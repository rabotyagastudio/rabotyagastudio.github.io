// Кейс «Пенка»: живая пена в шапке, сборка знака, палитра, шрифт, один день кофейни, наклейки.
// app.js зовёт PENKA.html(w) для разметки и PENKA.bind(body, dlg) после вставки; bind возвращает функцию остановки.
window.PENKA = (() => {
  const C = { cream: "#F3EBDD", milk: "#FBF7F0", cobalt: "#2743E8", choc: "#2B1C14", apricot: "#FF8A4C" };
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
  const lockup = () => `<span class="pk-lockup">${mark()}<span>пенка</span></span>`;
  const stacked = () => `<span class="pk-stacked">${mark()}<span>пенка</span></span>`;
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Разметка ----------
  const photo = (p, i, extra = "") => `
    <figure class="pk-ph ${extra}">
      <button class="pk-ph-img" data-shot="${i}" aria-label="Открыть крупно: ${p.title}">
        <img src="${p.src}" alt="${p.alt}" width="${p.w || 1920}" height="${p.h || 1280}" loading="lazy">
        ${p.time ? `<span class="pk-time">${p.time}</span>` : ""}
      </button>
      <figcaption>${p.caption}</figcaption>
    </figure>`;

  const STICKERS = [
    { id: "logo", shape: "circle", d: 168, bg: C.cobalt, fg: C.cream, html: stacked() },
    { id: "soft", shape: "pill", w: 360, h: 80, bg: C.apricot, fg: C.choc, html: `<b>с пенкой вкуснее</b>`, a: -7 },
    { id: "time", shape: "circle", d: 136, bg: C.choc, fg: C.cream, html: `<b class="pk-st-big">7:30</b><small>открываемся</small>` },
    { id: "mark", shape: "circle", d: 122, bg: C.cream, fg: C.cobalt, html: mark() },
    { id: "oat", shape: "pill", w: 252, h: 70, bg: C.cobalt, fg: C.cream, html: `<b>на овсяном</b>`, a: 5 },
    { id: "plus", shape: "circle", d: 104, bg: C.milk, fg: C.cobalt, html: `<b class="pk-st-mid">+1<br>к утру</b>` },
    { id: "apri", shape: "circle", d: 108, bg: C.apricot, fg: C.choc, html: mark() },
    { id: "word", shape: "pill", w: 230, h: 92, bg: C.cream, fg: C.cobalt, html: `<b class="pk-st-word">пенка</b>`, a: -3, r: 22 },
  ];

  const DRINKS = ["Раф на овсяном — как облако", "Флэт уайт без спешки", "Какао как в детстве", "Капучино на вынос"];

  function html(w) {
    const p = w.penka;
    const ph = p.photos;
    const at = id => ph.findIndex(x => x.id === id);
    const slides0 = ph.length;
    const band = `${mark()}<span>пенка</span>${mark("pk-a")}<span>с пенкой вкуснее</span>${mark()}<span>7:30 — 22:00</span>${mark("pk-a")}<span>на овсяном</span>`;
    return `
    <section class="pk" aria-label="${w.title}">
      <div class="pk-hero" data-pk-hero>
        <canvas class="pk-foam" aria-hidden="true"></canvas>
        <div class="pk-hero-copy">
          <p class="pk-eyebrow">${p.eyebrow}</p>
          <h2 class="pk-word">пенка</h2>
          <p class="pk-hero-lead">${p.lead}</p>
        </div>
        <div class="pk-cup" data-pk-cup>
          <svg viewBox="0 0 240 210" aria-hidden="true" focusable="false"><g fill="currentColor"><path d="${MARK.bowl}"/><path d="${MARK.saucer}"/></g>
            <path d="${MARK.handle}" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round"/></svg>
          ${mark("pk-cup-fallback")}
        </div>
        <p class="pk-hint" aria-hidden="true"><i></i><span class="pk-hint-fine">Потрогайте пену, нажмите — взобьётся</span><span class="pk-hint-touch">Нажмите на пену — взобьётся</span></p>
      </div>

      <div class="pk-brief">
        <div><h3>Задача</h3><p>${p.task}</p></div>
        <div><h3>Идея</h3><p>${p.idea}</p></div>
        <div><h3>Что сделано</h3><p>${p.done}</p></div>
      </div>

      ${photo(ph[at("storefront")], at("storefront"), "pk-ph--hero")}

      <div class="pk-head"><h3>Знак — чашка капучино</h3><p>Шапка пены из трёх окружностей лежит поверх чашки с зазором, как у настоящего капучино. Блюдце держит знак устойчиво в любом размере.</p></div>
      <div class="pk-build" data-pk-build>
        <div class="pk-build-stage">
          <svg viewBox="-34 0 300 226" aria-label="Построение знака: три окружности пены, зазор, чаша, ручка и блюдце" role="img">
            <defs><mask id="pk-gap" maskUnits="userSpaceOnUse"><rect x="-40" y="-20" width="320" height="260" fill="#fff"/><rect class="pk-b-gap" x="-34" y="111" width="300" height="9" fill="#000"/></mask></defs>
            <g class="pk-b-guides" fill="none" stroke="currentColor">
              ${[38, 111, 120, 180, 190].map(y => `<line x1="-34" x2="266" y1="${y}" y2="${y}"/>`).join("")}
              <line x1="120" x2="120" y1="14" y2="214"/>
            </g>
            <g class="pk-b-ink" mask="url(#pk-gap)">
              ${MARK.foam.map(([x, y, r], i) => `<circle class="pk-b-f" style="--i:${i}" cx="${x}" cy="${y}" r="${r}"/>`).join("")}
              <path class="pk-b-base" d="${MARK.foamBase}"/>
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

      <div class="pk-head"><h3>Цвет</h3><p>Кобальт вместо привычного коричневого — его видно с улицы и в ленте. Сливки и абрикос добавляют тепла и пахнут выпечкой. Нажмите на цвет, чтобы скопировать HEX.</p></div>
      <div class="pk-pour" data-pk-pour>
        ${p.colors.map((c, i) => `
          <button class="pk-sw" type="button" style="--c:${c.hex};--fg:${c.fg};--share:${c.share};--i:${i}" data-hex="${c.hex}" aria-label="${c.name}, ${c.hex}. Скопировать">
            <span class="pk-liquid" aria-hidden="true"></span>
            <span class="pk-sw-top"><i>${c.role}</i><i>${c.share}%</i></span>
            <span class="pk-sw-bot"><b>${c.name}</b><span>HEX ${c.hex}<br>RGB ${c.rgb}<br>CMYK ${c.cmyk}</span></span>
          </button>`).join("")}
      </div>

      <div class="pk-head"><h3>Шрифты</h3><p>Dela Gothic One — плотный и округлый, как шапка пены: им набраны логотип и заголовки. Manrope держит меню, цены и подписи. Напишите свой напиток прямо на карточке.</p></div>
      <div class="pk-type">
        <div class="pk-spec">
          <p class="pk-label">Dela Gothic One · логотип и заголовки</p>
          <div class="pk-spec-big" aria-hidden="true">Пп</div>
          <p class="pk-abc">АБВГДЕЁЖЗИЙКЛМНОП<br>РСТУФХЦЧШЩЪЫЬЭЮЯ<br>0123456789 ₽ — «»</p>
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

      <div class="pk-head"><h3>Один день «Пенки»</h3><p>Бренд проверяли не на макетах, а на целом дне кофейни: от первой чашки до вечерней вывески.</p></div>
      <div class="pk-day">
        ${p.day.map(row => `<div class="pk-row">${row.map(id => { const x = ph[at(id)]; return photo(x, at(id), `pk-ph--${id}" style="--ar:${((x.w || 1920) / (x.h || 1280)).toFixed(4)}`); }).join("")}</div>`).join("")}
      </div>

      <div class="pk-head"><h3>Наклейки</h3><p>Их клеят на ноутбук, бутылку и дверь холодильника — так бренд уходит из кофейни домой. Потаскайте их.</p></div>
      <div class="pk-board" data-pk-board>
        ${STICKERS.map(s => `<div class="pk-st pk-st--${s.shape}" data-st="${s.id}" style="--bg:${s.bg};--fg:${s.fg};${s.shape === "circle" ? `--w:${s.d}px;--h:${s.d}px` : `--w:${s.w}px;--h:${s.h}px`}${s.r ? `;--r:${s.r}px` : ""}">${s.html}</div>`).join("")}
        <p class="pk-board-hint" aria-hidden="true">Хватайте и бросайте</p>
      </div>

      <div class="pk-band" aria-hidden="true">
        <div class="pk-band-row"><div>${band}${band}</div></div>
        <div class="pk-band-row pk-band-row--rev"><div>${band}${band}</div></div>
      </div>

      <div class="pk-head"><h3>Бренд-бук</h3><p>Все листы системы: идея, знак, логотип, цвет, шрифты, графика, носители. Нажмите, чтобы открыть крупно и пролистать.</p></div>
      <div class="pk-system">
        ${p.book.map((g, i) => `
          <button class="pk-sys" data-shot="${slides0 + i}" aria-label="Открыть крупно: ${g.title}">
            <img src="${g.src}" alt="${g.alt}" width="1920" height="1200" loading="lazy">
            <span><b>${String(i + 1).padStart(2, "0")}</b>${g.title}</span>
          </button>`).join("")}
      </div>
    </section>`;
  }

  // ---------- Живая пена: SDF-метаболлы в WebGL ----------
  const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec3 uMap;
uniform vec4 uB[24];
uniform int uN;
uniform vec3 uPtr;
uniform float uK;
uniform vec3 uCol;
float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }
void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 p = (px - uMap.xy) / uMap.z;
  float foam = 1e4; float bub = 1e4;
  for (int i = 0; i < 24; i++) {
    if (i >= uN) break;
    vec4 b = uB[i];
    float d = length(p - b.xy) - b.z;
    if (b.w < 0.5) foam = smin(foam, d, uK); else bub = smin(bub, d, 6.0);
  }
  vec2 q = abs(p - vec2(120.0, 105.5)) - vec2(70.0, 5.5);
  float box = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  foam = smin(foam, box, uK);
  foam = max(foam, p.y - 111.0);
  float d = smin(foam, bub, 9.0);
  if (uPtr.z > 0.5) { float c = -(length(p - uPtr.xy) - uPtr.z); float h = max(7.0 - abs(d - c), 0.0) / 7.0; d = max(d, c) + h * h * 7.0 * 0.25; }
  float a = clamp(0.5 - d * uMap.z, 0.0, 1.0);
  gl_FragColor = vec4(uCol * a, a);
}`;

  function foam(root, dlg) {
    const hero = root.querySelector("[data-pk-hero]");
    const cup = root.querySelector("[data-pk-cup]");
    const canvas = hero.querySelector("canvas");
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) { hero.classList.add("pk-static"); return () => {}; }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }"));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { hero.classList.add("pk-static"); return () => {}; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(prog, n);
    const u = { res: U("uRes"), map: U("uMap"), b: U("uB"), n: U("uN"), ptr: U("uPtr"), k: U("uK"), col: U("uCol") };
    gl.uniform3f(u.col, 0xF3 / 255, 0xEB / 255, 0xDD / 255);
    gl.clearColor(0, 0, 0, 0);
    hero.classList.add("pk-live");

    // Три облака пены и три «внутренних» шара: в покое они спрятаны внутри шапки и выглядывают, когда пену взбивают
    const homes = [[82, 100, 32], [120, 80, 42], [158, 100, 32], [101, 82, 18], [139, 82, 18], [120, 62, 20]];
    const F = homes.map(([x, y, r], i) => ({ x, y, r, hx: x, hy: y, hr: r, vx: 0, vy: 0, vr: 0, ph: i * 1.7 }));
    let B = [];
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, r: 0, vr: 0, on: false };
    let energy = 0, map = { x: 0, y: 0, s: 1 }, dpr = 1, W = 0, H = 0;
    const data = new Float32Array(24 * 4);
    const rnd = (a, b) => a + Math.random() * (b - a);

    const layout = () => {
      const hr = hero.getBoundingClientRect(), cr = cup.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.round(hr.width * dpr); H = Math.round(hr.height * dpr);
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      map = { x: (cr.left - hr.left) * dpr, y: (cr.top - hr.top) * dpr, s: cr.width / 240 * dpr };
      gl.viewport(0, 0, W, H);
    };
    const toMark = e => { const hr = hero.getBoundingClientRect(); return [((e.clientX - hr.left) * dpr - map.x) / map.s, ((e.clientY - hr.top) * dpr - map.y) / map.s]; };
    const inFoam = (x, y, pad = 0) => y < 112 && F.slice(0, 3).some(f => Math.hypot(x - f.x, y - f.y) < f.r + pad);

    const spawn = (n, power = 1) => {
      for (let i = 0; i < n && B.length < 24 - F.length; i++) {
        const a = rnd(-2.55, -0.6), f = F[1];
        const sp = rnd(120, 230) * power;
        B.push({ x: f.x + Math.cos(a) * (f.r - 6), y: f.y + Math.sin(a) * (f.r - 6), vx: Math.cos(a) * sp * .55 + rnd(-30, 30), vy: Math.sin(a) * sp - 40 * power, r: rnd(4.5, 11) * (power < 1 ? .7 : 1), t: 0, out: false, gone: false });
      }
    };
    const whip = () => {
      energy = 1;
      F.forEach((f, i) => { f.vx += rnd(-70, 70); f.vy += rnd(-110, -30); f.vr += i < 3 ? rnd(40, 70) : rnd(60, 110); });
      spawn(8);
    };

    const step = (dt, t) => {
      const calm = reduced();
      energy *= Math.exp(-dt * 1.6);
      F.forEach((f, i) => {
        const breathe = calm ? 0 : Math.sin(t * 1.5 + f.ph) * (i < 3 ? .012 : .05);
        const tr = f.hr * (1 + breathe + energy * (i < 3 ? .07 : .35));
        f.vx += (-(f.x - f.hx) * 90 - f.vx * 9) * dt;
        f.vy += (-(f.y - f.hy) * 90 - f.vy * 9) * dt;
        f.vr += (-(f.r - tr) * 120 - f.vr * 10) * dt;
        if (ptr.on) {
          const dx = f.x - ptr.x, dy = f.y - ptr.y, dd = Math.hypot(dx, dy) || 1, reach = f.r + 26;
          if (dd < reach) { const k = (1 - dd / reach) * 520 * dt; f.vx += dx / dd * k; f.vy += dy / dd * k; }
        }
        f.x += f.vx * dt; f.y += f.vy * dt; f.r += f.vr * dt;
      });
      B.forEach(b => {
        b.t += dt;
        if (!b.gone) {
          b.vy += 420 * dt; b.vx *= Math.exp(-dt * .8);
          b.x += b.vx * dt; b.y += b.vy * dt;
          if (b.vy > 0 && (inFoam(b.x, b.y, -b.r * .2) || b.y > 104)) {
            b.gone = true;
            const f = F.slice(0, 3).reduce((m, x) => Math.hypot(b.x - x.x, b.y - x.y) < Math.hypot(b.x - m.x, b.y - m.y) ? x : m);
            f.vy += b.r * 4; f.vr += b.r * 1.2;
          }
        } else { b.r -= dt * 120; b.x += (F[1].x - b.x) * dt * 2; }
      });
      B = B.filter(b => b.r > .4 && b.y < 400 && b.t < 6);
      const near = ptr.on && (inFoam(ptr.x, ptr.y, 6) || ptr.y < 111 && ptr.y > 20 && ptr.x > 44 && ptr.x < 196 && inFoam(ptr.x, ptr.y + 8, 4));
      const tr = near ? 15 : 0;
      ptr.vr += (-(ptr.r - tr) * 160 - ptr.vr * 13) * dt;
      ptr.r = Math.max(0, ptr.r + ptr.vr * dt);
      ptr.x += (ptr.tx - ptr.x) * Math.min(1, dt * 18); ptr.y += (ptr.ty - ptr.y) * Math.min(1, dt * 18);
    };

    const draw = () => {
      let n = 0;
      F.forEach(f => { data.set([f.x, f.y, Math.max(0, f.r), 0], n * 4); n++; });
      B.forEach(b => { if (n < 24) { data.set([b.x, b.y, Math.max(0, b.r), 1], n * 4); n++; } });
      gl.uniform2f(u.res, W, H);
      gl.uniform3f(u.map, map.x, map.y, map.s);
      gl.uniform4fv(u.b, data);
      gl.uniform1i(u.n, n);
      gl.uniform3f(u.ptr, ptr.x, ptr.y, ptr.r);
      gl.uniform1f(u.k, 1.2 + energy * 12);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0, last = 0, visible = false, nextIdle = 2.2, clock = 0;
    const frame = now => {
      raf = 0;
      if (!visible || document.hidden) return;
      let left = Math.min(.25, (now - (last || now)) / 1000);
      last = now;
      if (!reduced() && clock > nextIdle) { spawn(1, .55); nextIdle = clock + rnd(3.4, 5.6); }
      while (left > 1e-4) { const dt = Math.min(1 / 90, left); left -= dt; clock += dt; step(dt, clock); }
      draw();
      raf = requestAnimationFrame(frame);
    };
    const go = () => { if (!raf && visible) { last = 0; raf = requestAnimationFrame(frame); } };

    const onMove = e => { const [x, y] = toMark(e); ptr.tx = x; ptr.ty = y; if (!ptr.on) { ptr.x = x; ptr.y = y; } ptr.on = true; };
    const onLeave = () => { ptr.on = false; };
    const onDown = e => { onMove(e); whip(); hero.classList.add("pk-touched"); go(); };
    const onUp = e => { if (e.pointerType !== "mouse") ptr.on = false; };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("pointercancel", onLeave);
    hero.addEventListener("pointerdown", onDown);
    hero.addEventListener("pointerup", onUp);
    const ro = new ResizeObserver(() => { layout(); draw(); });
    ro.observe(hero);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; go(); }, { root: dlg, threshold: 0 });
    io.observe(hero);
    const onVis = () => go();
    document.addEventListener("visibilitychange", onVis);
    layout(); draw();
    // Первое касание взгляда: пена сама чуть взбивается
    const t0 = setTimeout(() => { if (!reduced()) { energy = .55; spawn(4, .8); F.forEach(f => { f.vr += 30; }); go(); } }, 650);
    return () => { cancelAnimationFrame(raf); clearTimeout(t0); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); visible = false; };
  }

  // ---------- Сборка знака, размер, палитра, шрифт ----------
  function build(root, dlg) {
    const el = root.querySelector("[data-pk-build]");
    const play = () => { el.classList.remove("is-on"); void el.offsetWidth; el.classList.add("is-on"); };
    if (!reduced()) el.classList.add("is-armed");
    else el.classList.add("is-on");
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { play(); io.disconnect(); } }, { root: dlg, threshold: .45 });
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
        const was = name.textContent;
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
    root.querySelectorAll(".pk-chip").forEach(c => { c.onclick = () => { title.textContent = c.textContent; fit(); title.classList.remove("is-new"); void title.offsetWidth; title.classList.add("is-new"); }; });
    fit();
    return () => { io.disconnect(); io2.disconnect(); };
  }

  // ---------- Наклейки с физикой (Matter.js грузится, только когда доска видна) ----------
  const MATTER = "https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js";
  let matterLoading = null;
  const loadMatter = () => matterLoading || (matterLoading = new Promise((ok, no) => {
    if (window.Matter) return ok(window.Matter);
    const s = document.createElement("script"); s.src = MATTER; s.onload = () => ok(window.Matter); s.onerror = no; document.head.append(s);
  }));

  const scaleFor = bw => Math.min(1, Math.max(.56, bw / 980));

  function stickers(root, dlg) {
    const board = root.querySelector("[data-pk-board]");
    const els = [...board.querySelectorAll(".pk-st")];
    let stop = () => {}, dead = false;
    // Пока физика не загрузилась (или если не загрузится) — наклейки просто разложены
    const lay = () => {
      const bw = board.clientWidth, bh = board.clientHeight, sc = scaleFor(bw);
      board.style.setProperty("--sc", sc);
      const spots = [[.2, .46, -8], [.52, .3, -7], [.82, .5, 9], [.36, .75, 6], [.66, .74, 5], [.1, .8, -12], [.9, .2, 14], [.5, .58, -3]];
      els.forEach((el, i) => { const [x, y, a] = spots[i]; el.style.transform = `translate(${x * bw}px, ${y * bh}px) translate(-50%, -50%) rotate(${a}deg)`; });
    };
    lay();
    const ro0 = new ResizeObserver(lay); ro0.observe(board);
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      loadMatter().then(M => { if (!dead) { ro0.disconnect(); stop = physics(M, board, els, dlg); } }).catch(() => {});
    }, { root: dlg, rootMargin: "200px 0px" });
    io.observe(board);
    return () => { dead = true; io.disconnect(); ro0.disconnect(); stop(); };
  }

  function physics(M, board, els, dlg) {
    const { Engine, Bodies, Body, Composite, Constraint } = M;
    const engine = Engine.create({ gravity: { y: 1.15 } });
    const world = engine.world;
    let bw = board.clientWidth, bh = board.clientHeight;
    const sc = scaleFor(bw);
    board.style.setProperty("--sc", sc);
    let walls = [];
    const makeWalls = () => {
      Composite.remove(world, walls);
      const t = 400;
      walls = [
        Bodies.rectangle(bw / 2, bh + t / 2, bw * 3, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, bh / 2, t, bh * 6, { isStatic: true }),
        Bodies.rectangle(bw + t / 2, bh / 2, t, bh * 6, { isStatic: true }),
      ];
      Composite.add(world, walls);
    };
    makeWalls();
    const calm = reduced();
    const bodies = els.map((el, i) => {
      const s = STICKERS.find(x => x.id === el.dataset.st);
      const opts = { restitution: .32, friction: .6, frictionAir: .018, density: .0016, chamfer: undefined };
      const x = bw * (.14 + (i % 4) * .24) + (Math.random() - .5) * 30;
      const y = calm ? bh - 120 - Math.floor(i / 4) * 140 : -80 - i * 95;
      let b;
      if (s.shape === "circle") b = Bodies.circle(x, y, s.d * sc / 2 + 4, opts);
      else b = Bodies.rectangle(x, y, s.w * sc + 8, s.h * sc + 8, { ...opts, chamfer: { radius: Math.min(s.r || s.h / 2, s.h / 2) * sc } });
      Body.setAngle(b, ((s.a || (Math.random() - .5) * 20) * Math.PI) / 180);
      return { el, b };
    });
    Composite.add(world, bodies.map(x => x.b));

    // Перетаскивание своим указателем: прокрутка страницы на телефоне не ломается
    let grab = null;
    const local = e => { const r = board.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    bodies.forEach(({ el, b }) => {
      el.addEventListener("pointerdown", e => {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        const p = local(e);
        const offset = { x: p.x - b.position.x, y: p.y - b.position.y };
        const c = Math.cos(-b.angle), s = Math.sin(-b.angle);
        const pointB = { x: offset.x * c - offset.y * s, y: offset.x * s + offset.y * c };
        const con = Constraint.create({ pointA: p, bodyB: b, pointB, stiffness: .22, damping: .08, length: 0 });
        Composite.add(world, con);
        grab = { con, el, id: e.pointerId };
        el.classList.add("is-grab");
        board.classList.add("pk-played");
      });
      const end = e => { if (grab && grab.id === e.pointerId) { Composite.remove(world, grab.con); grab.el.classList.remove("is-grab"); grab = null; } };
      el.addEventListener("pointermove", e => { if (grab && grab.id === e.pointerId) { const p = local(e); grab.con.pointA = { x: Math.max(0, Math.min(bw, p.x)), y: Math.max(-200, Math.min(bh, p.y)) }; } });
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
    });

    const ro = new ResizeObserver(() => {
      const nw = board.clientWidth, nh = board.clientHeight;
      if (Math.abs(nw - bw) < 2 && Math.abs(nh - bh) < 2) return;
      bodies.forEach(({ b }) => Body.setPosition(b, { x: b.position.x * nw / bw, y: Math.min(b.position.y, nh - 40) }));
      bw = nw; bh = nh; makeWalls();
    });
    ro.observe(board);

    // Шагаем по реальному времени мелкими подшагами: при просевшей частоте кадров наклейки не замедляются
    let visible = true;
    const sync = () => {
      bodies.forEach(({ el, b }) => { el.style.transform = `translate(${b.position.x}px, ${b.position.y}px) translate(-50%, -50%) rotate(${b.angle}rad)`; });
    };
    let raf = 0, last = 0, acc = 0;
    const STEP = 1000 / 60;
    const tick = now => {
      acc += Math.min(250, now - (last || now)); last = now;
      while (acc >= STEP) { Engine.update(engine, STEP); acc -= STEP; }
      sync(); raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };
    const pause = () => { cancelAnimationFrame(raf); raf = 0; };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : pause(); }, { root: dlg });
    io.observe(board);
    board.classList.add("pk-physics");
    start();
    return () => { pause(); io.disconnect(); ro.disconnect(); Composite.clear(world, false); Engine.clear(engine); };
  }

  function bind(root, dlg) {
    const stops = [foam(root, dlg), build(root, dlg), stickers(root, dlg)];
    return () => stops.forEach(f => f());
  }

  return { html, bind };
})();
