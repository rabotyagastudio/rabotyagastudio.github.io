// Главная: шоурил → фильм из лучших работ (пролёт камеры) → индекс всех работ → контакт.
// Индекс строится из window.WORKS (data.js), поэтому новая работа появляется в нём сама.
// Кейсы открывает app.js по адресу #slug, поэтому ссылки на работы здесь — просто #slug.
(() => {
  const S = window.SITE, W = window.WORKS;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = matchMedia("(max-width: 760px)").matches;
  // телефон вертикально: шоурил берёт лёгкие кропы роликов из home/ (кадр тот же, что виден на экране)
  const narrow = matchMedia("(max-width: 760px) and (max-aspect-ratio: 3/4)");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const caseUrl = (slug) => `#${slug}`;
  const pad = (n) => String(n).padStart(2, "0");
  const service = (id) => S.services.find((s) => s.id === id) || {};
  // пока открыт кейс, шоурил и фильм стоят: не тратим трафик и батарею за окном
  const caseDlg = document.getElementById("case");
  const caseOpen = () => !!(caseDlg && caseDlg.open);

  // ---------- что показываем ----------
  // Шоурил на первом экране: короткие планы из разных работ. mVideo/mPoster — кропы 3:4 для телефона (home/build.sh)
  const SHOTS = [
    { slug: "shum-motion", title: "«Шум» — моушен-айдентика фестиваля", video: "works/shum-motion/stage.mp4", poster: "works/shum-motion/stage-poster.jpg", mVideo: "home/stage-m.mp4", mPoster: "home/stage-m.jpg" },
    { slug: "penka-identity", title: "«Пенка» — вывеска кофейни вечером", video: "works/penka-identity/motion/storefront.mp4", poster: "works/penka-identity/motion/storefront-on.jpg", mVideo: "home/storefront-m.mp4", mPoster: "home/storefront-m.jpg" },
    { slug: "vnutri-social", title: "«Внутри» — соцсети психолога", img: "works/vnutri-social/cover.jpg?v=3" },
    { slug: "shum-motion", title: "«Шум» — афиша на остановке", video: "works/shum-motion/busstop.mp4", poster: "works/shum-motion/busstop-poster.jpg", mVideo: "home/busstop-m.mp4", mPoster: "home/busstop-m.jpg" },
    { slug: "gryadka-deck", title: "«Грядка» — презентация для инвесторов", img: "works/gryadka-deck/hero.jpg" },
    { slug: "penka-identity", title: "«Пенка» — своя керамика", video: "works/penka-identity/motion/barista.mp4", poster: "works/penka-identity/motion/barista-poster.jpg", mVideo: "home/barista-m.mp4", mPoster: "home/barista-m.jpg" },
  ];

  // Фильм: самые сильные работы.
  // door — «дверь» в кадре: углы TL, TR, BR, BL в долях кадра; через неё камера влетает в следующую работу.
  // notes — режиссёрские пометки: [x, y, текст] в долях кадра (у обложек — [номер обложки, x, y, текст]).
  const FILM = [
    { slug: "shum-motion", name: "Шум", kicker: "Моушен-айдентика фестиваля", line: "Знак, который двигается под музыку: на сцене, в ленте, на улице и в руках у гостей.",
      video: "works/shum-motion/stage.mp4", poster: "works/shum-motion/stage-poster.jpg", w: 1920, h: 1072, tone: "#05090B",
      door: [[0.3432, 0.3316], [0.6526, 0.3316], [0.6563, 0.6637], [0.3401, 0.6637]],
      notes: [
        [0.50, 0.47, "Знак — само слово «Шум». Ширина букв меняется в такт музыке, поэтому логотип живой даже на огромном экране."],
        [0.22, 0.25, "Ледяной циан на почти чёрном: фестиваль узнают по цвету раньше, чем прочитают название."],
        [0.53, 0.70, "Один знак — четыре режима движения: хром, свет внутри, живой шрифт и изгиб. Под каждый носитель свой."],
      ] },
    { slug: "penka-identity", name: "Пенка", kicker: "Айдентика кофейни", line: "Кофейня, которую видно с другого конца улицы: от вывески и стаканов до карты гостя.",
      video: "works/penka-identity/motion/storefront.mp4", poster: "works/penka-identity/motion/storefront-on.jpg", once: true, w: 1536, h: 1024, tone: "#1B2340",
      door: [[0.3809, 0.2520], [0.7604, 0.2695], [0.7604, 0.7012], [0.3809, 0.7129]],
      notes: [
        [0.47, 0.15, "Кобальт вместо привычного бежевого: вывеску видно с другого конца улицы."],
        [0.86, 0.21, "Круглая консоль со знаком читается сбоку, когда идёшь вдоль домов."],
        [0.28, 0.52, "Дверь и рамы в том же кобальте: весь фасад работает на бренд."],
      ] },
    { slug: "gryadka-deck", name: "Грядка", kicker: "Презентация для инвесторов", line: "Городские фермы и 60 млн ₽ на рост. Презентация, в которой у бизнеса есть и цифры, и характер.",
      img: "works/gryadka-deck/hero.jpg", w: 2400, h: 1350, tone: "#21462F", mPos: "22% 50%",
      door: [[0.0371, 0.3111], [0.5933, 0.2074], [0.6262, 0.7652], [0.0667, 0.8696]],
      notes: [
        [0.29, 0.56, "Плакатный заголовок и одна мысль на слайд: суть понятна, даже если листать презентацию с телефона."],
        [0.86, 0.33, "Рост — крупной цифрой и графиком, где главный столбец выделен цветом."],
        [0.70, 0.70, "Сколько денег нужно и на что — на одном слайде, без сносок мелким шрифтом."],
      ] },
    { slug: "editorial-covers", name: "Ну типа журнал", kicker: "Серия обложек", line: "Журнал, который комментирует собственные обложки. Каждый выпуск держится сам, а вместе — одна серия.",
      light: true, bg: "#B49FF0", tone: "#B49FF0", doorEl: 1,
      covers: ["works/editorial-covers/01-gorod-vnutri.jpg", "works/editorial-covers/02-pravo-na-tishinu.jpg", "works/editorial-covers/03-era-kopiy.jpg", "works/editorial-covers/04-posle-raboty.jpg"],
      notes: [
        [0, 0.5, 0.07, "Шрифт, место шапки и номер выпуска везде одни — четыре обложки читаются как один журнал.", "t"],
        [2, 0.5, 0.07, "Шапка комментирует собственную обложку: «Это чьё-то ухо», «Они несъедобные».", "t"],
        [3, 0.5, 0.97, "У каждого выпуска свой цвет и один сильный образ — серию узнают и на полке, и в ленте.", "b"],
      ] },
    { slug: "vnutri-social", name: "Внутри", kicker: "Соцсети психолога", line: "Тихий профиль, который с первого экрана даёт ощущение опоры, а посты дочитывают до записи.",
      img: "works/vnutri-social/cover.jpg?v=3", w: 1600, h: 1200, pos: "62% 50%", mPos: "70% 50%", tone: "#E9E1D6",
      notes: [
        [0.22, 0.345, "Антиква с курсивом звучит тихо и по-человечески — как разговор, а не реклама.", "t"],
        [0.86, 0.16, "Знак — открытая арка, образ безопасного места. Та же арка повторяется в кадрировании фото."],
        [0.69, 0.47, "Дневной свет, лён и букле — без студийных вспышек и стоковых улыбок."],
      ] },
  ];

  // Живое превью в индексе вместо картинки
  const PEEK_VIDEO = {
    "shum-motion": "works/shum-motion/mode-chrome.mp4",
    "penka-identity": "works/penka-identity/motion/cups.mp4",
    "speaker-video": "works/speaker-video/video.mp4",
  };

  // defer — адреса кладём в data-*, а грузим, только когда зритель начал листать (hydrate)
  function media(m, eager, defer) {
    const useM = narrow.matches;
    const put = (node, attr, val) => { if (defer) node.dataset[attr] = val; else node[attr] = val; };
    if (m.video) {
      const v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true;
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      v.preload = eager ? "auto" : "metadata";
      put(v, "poster", useM && m.mPoster ? m.mPoster : m.poster);
      put(v, "src", useM && m.mVideo ? m.mVideo : m.video);
      const vp = (mobile && m.mPos) || m.pos; if (vp) v.style.objectPosition = vp;
      return v;
    }
    const i = new Image();
    put(i, "src", m.img); i.alt = ""; i.decoding = "async";
    if (!eager) i.loading = "lazy";
    const ip = (mobile && m.mPos) || m.pos; if (ip) i.style.objectPosition = ip;
    return i;
  }
  const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const hydrate = (node) => {
    if (node.dataset.poster) { node.poster = node.dataset.poster; delete node.dataset.poster; }
    if (node.dataset.src) { node.src = node.dataset.src; delete node.dataset.src; }
  };

  // ---------- шоурил ----------
  const hero = $(".hero"), heroMedia = $(".hero-media"), bars = $(".hero-bars"), nowTitle = $(".hero-title");
  const DUR = 4200;
  document.documentElement.style.setProperty("--dur", `${DUR}ms`);
  // сразу грузим только первый план; следующий подгружается, пока идёт текущий
  const shots = SHOTS.map((s, i) => {
    const d = el("div", "shot"); const m = media(s, i === 0 && !caseOpen()); d.append(m); heroMedia.append(d);
    const b = el("i"); b.append(el("b")); b.title = s.title; bars.append(b);
    b.addEventListener("click", () => show(i));
    return { s, d, m, b, anim: null };
  });
  let cur = -1, timer = 0, heroOn = !caseOpen();
  function show(i) {
    const prev = shots[cur];
    cur = (i + shots.length) % shots.length;
    const sh = shots[cur];
    if (prev && prev !== sh) {
      prev.d.classList.remove("on");
      if (prev.m.tagName === "VIDEO") { const pv = prev.m; setTimeout(() => { if (!pv.parentNode.classList.contains("on")) pv.pause(); }, 1300); }
    }
    sh.d.classList.add("on");
    if (sh.m.tagName === "VIDEO" && heroOn) { try { sh.m.currentTime = 0; } catch (e) {} sh.m.play().catch(() => {}); }
    const nx = shots[(cur + 1) % shots.length].m;
    if (heroOn && nx.tagName === "VIDEO" && nx.preload !== "auto") nx.preload = "auto";
    if (!reduce) {
      if (sh.anim) sh.anim.cancel();
      sh.anim = sh.m.animate([{ transform: "scale(1)" }, { transform: "scale(1.07)" }], { duration: DUR + 1400, easing: "linear", fill: "forwards" });
    }
    nowTitle.textContent = sh.s.title; nowTitle.href = caseUrl(sh.s.slug);
    shots.forEach((x, k) => { x.b.className = k < cur ? "done" : k === cur ? "run" : ""; });
    const fill = sh.b.firstChild; fill.style.animation = "none"; void fill.offsetWidth; fill.style.animation = "";
    clearTimeout(timer);
    if (!reduce && heroOn) timer = setTimeout(() => show(cur + 1), DUR);
  }
  function heroPause(on) {
    heroOn = on;
    hero.classList.toggle("paused", !on);
    if (on) show(cur); else { clearTimeout(timer); const m = shots[cur].m; if (m.tagName === "VIDEO") m.pause(); }
  }
  show(0);
  document.addEventListener("visibilitychange", () => heroPause(!document.hidden && heroVisible() && !caseOpen()));
  // повернули телефон — меняем кроп на полный кадр и обратно
  narrow.addEventListener("change", () => shots.forEach((x) => {
    if (!x.s.mVideo) return;
    const v = x.m, src = narrow.matches ? x.s.mVideo : x.s.video;
    if (v.getAttribute("src") === src) return;
    v.poster = narrow.matches ? x.s.mPoster : x.s.poster; v.src = src;
    if (x.d.classList.contains("on") && heroOn) v.play().catch(() => {});
  }));

  // ---------- фильм: пролёт камеры из работы в работу ----------
  const stage = $(".stage"), pin = $(".stage-pin"), stageIn = $(".stage-in"), indexEl = $(".index"), hd = $(".hd");
  const HOLD0 = 0.25, NOTE = 0.4, HOLD1 = 0.2, FLY = 1.25; // длины отрезков в экранах прокрутки
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  const sim = (k, t) => [[k * Math.cos(t), -k * Math.sin(t)], [k * Math.sin(t), k * Math.cos(t)]];
  const mv = (A, p) => [A[0][0] * p[0] + A[0][1] * p[1], A[1][0] * p[0] + A[1][1] * p[1]];
  const mm = (X, Y) => [[X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]], [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]]];
  const inv = (A) => { const d = A[0][0] * A[1][1] - A[0][1] * A[1][0]; return [[A[1][1] / d, -A[0][1] / d], [-A[1][0] / d, A[0][0] / d]]; };
  const css = (A, b) => `matrix(${A[0][0]},${A[1][0]},${A[0][1]},${A[1][1]},${b[0]},${b[1]})`;
  let VW = innerWidth, VH = innerHeight;

  const scenes = FILM.map((f, i) => {
    const root = el("article", "sc"); root.setAttribute("aria-label", `${f.name} — ${f.kicker}`);
    if (f.light) root.classList.add("reel--light");
    root.style.background = f.tone || "#000";
    const cam = el("div", "sc-cam");
    let md = null; const covers = [];
    if (f.covers) {
      cam.classList.add("reel-covers"); cam.style.background = f.bg;
      // прозрачная заглушка держит размер обложки, пока настоящая не загружена: по ней меряется «дверь»
      f.covers.forEach((src) => { const im = new Image(); im.src = BLANK; im.dataset.src = src; im.alt = ""; im.decoding = "async"; cam.append(im); covers.push(im); });
    } else {
      md = media(f, false, true); if (f.once) md.loop = false; cam.append(md);
    }
    const notes = el("div", "notes");
    const nts = (f.notes || []).map((n, j) => {
      const ti = n.findIndex((v) => typeof v === "string");
      const d = el("div", "nt", `<i class="nt-dot"></i><p class="nt-card"><b>${pad(j + 1)}</b>${n[ti]}</p>`);
      d.dataset.side = n[ti + 1] || "";
      notes.append(d); return d;
    });
    const cap = el("div", "reel-cap", `
      <div><p class="reel-kicker"><span>${pad(i + 1)} / ${pad(FILM.length)}</span>${f.kicker}</p><h3 class="reel-name">${f.name}</h3></div>
      <p class="reel-line">${f.line}</p>
      <a class="reel-go" href="${caseUrl(f.slug)}">Смотреть кейс <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>`);
    root.append(cam, el("div", "reel-shade"), notes, cap);
    root.addEventListener("click", (e) => { if (root.classList.contains("live") && !e.target.closest("a")) location.href = caseUrl(f.slug); });
    stageIn.append(root);
    return { f, root, cam, cap, covers, nts, md, vid: md && md.tagName === "VIDEO" ? md : null, door: null, C: null, pts: [], state: "" };
  });
  // кадры фильма грузим, когда зритель начал листать; ролик следующей работы — заранее, пока идёт текущая
  let hydrated = false;
  const hydrateFilm = () => { if (hydrated) return; hydrated = true; scenes.forEach((s) => { if (s.md) hydrate(s.md); s.covers.forEach(hydrate); }); };
  const warm = (s) => { if (s && s.vid && s.vid.preload !== "auto") s.vid.preload = "auto"; };

  // таймлайн: работа держится, пока появляются пометки, потом пролёт в следующую
  const segs = []; let T = 0;
  scenes.forEach((s, i) => {
    const hold = HOLD0 + s.nts.length * NOTE + HOLD1;
    segs.push({ type: "hold", i, a: T, len: hold }); T += hold;
    if (i < scenes.length - 1) { segs.push({ type: "fly", i, a: T, len: FLY }); T += FLY; }
  });

  function coverMap(f) {
    const [px, py] = ((mobile && f.mPos) || f.pos || "50% 50%").split(" ").map((v) => parseFloat(v) / 100);
    const k = Math.max(VW / f.w, VH / f.h), dw = f.w * k, dh = f.h * k, ox = (VW - dw) * px, oy = (VH - dh) * py;
    return (u, v) => [ox + u * dw, oy + v * dh];
  }
  // камера: подобие (масштаб + поворот) вокруг неподвижной точки, которое в конце разворачивает дверь на весь экран
  function camera(P) {
    const c = [(P[0][0] + P[1][0] + P[2][0] + P[3][0]) / 4, (P[0][1] + P[1][1] + P[2][1] + P[3][1]) / 4];
    const w = (dist(P[0], P[1]) + dist(P[3], P[2])) / 2, h = (dist(P[0], P[3]) + dist(P[1], P[2])) / 2;
    const th = -Math.atan2(P[1][1] - P[0][1], P[1][0] - P[0][0]);
    const k = Math.max(VW / w, VH / h);
    const A1 = sim(k, th), Ac = mv(A1, c);
    const M = [[1 - A1[0][0], -A1[0][1]], [-A1[1][0], 1 - A1[1][1]]], r = [VW / 2 - Ac[0], VH / 2 - Ac[1]];
    const d = M[0][0] * M[1][1] - M[0][1] * M[1][0];
    const F = [(r[0] * M[1][1] - M[0][1] * r[1]) / d, (M[0][0] * r[1] - M[1][0] * r[0]) / d];
    const AF = mv(A1, F);
    return { k, th, F, A1, A1i: inv(A1), b1: [F[0] - AF[0], F[1] - AF[1]] };
  }
  function camAt(C, e) {
    const A = sim(Math.pow(C.k, e), C.th * e), AF = mv(A, C.F);
    return { A, b: [C.F[0] - AF[0], C.F[1] - AF[1]] };
  }
  const apply = (S2, p) => { const q = mv(S2.A, p); return [q[0] + S2.b[0], q[1] + S2.b[1]]; };

  function placeNotes(s) {
    const capTop = s.cap.offsetTop - 18;
    s.nts.forEach((n, j) => {
      const [x, y] = s.pts[j];
      const dot = n.firstChild, card = n.lastChild;
      n.hidden = x < 10 || x > VW - 10 || y < 64 || y > capTop;
      dot.style.left = `${x}px`; dot.style.top = `${y}px`;
      const cw = card.offsetWidth, ch = card.offsetHeight, side = n.dataset.side;
      let left, top;
      if (side === "t" || side === "b") {
        left = x - cw / 2;
        top = side === "t" ? y - 20 - ch : y + 20;
      } else {
        left = x + 26 + cw <= VW - 16 ? x + 26 : x - 26 - cw;
        top = y - ch / 2;
      }
      left = Math.max(16, Math.min(VW - 16 - cw, left));
      top = Math.max(72, Math.min(capTop - ch, top));
      card.style.left = `${left}px`; card.style.top = `${top}px`;
    });
  }

  function measure() {
    const r = pin.getBoundingClientRect(); VW = r.width; VH = r.height;
    const keep = stageIn.style.transform; stageIn.style.transform = "none";
    scenes.forEach((s) => {
      const f = s.f;
      if (f.covers) {
        const keepCam = s.cam.style.transform; s.cam.style.transform = "none";
        const base = s.root.getBoundingClientRect();
        const rects = s.covers.map((im) => { const q = im.getBoundingClientRect(); return [q.left - base.left, q.top - base.top, q.width, q.height]; });
        s.cam.style.transform = keepCam;
        if (f.doorEl != null) { const [x, y, w, h] = rects[f.doorEl]; s.door = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
        s.pts = f.notes.map((n) => { const q = rects[n[0]]; return [q[0] + n[1] * q[2], q[1] + n[2] * q[3]]; });
      } else {
        const map = coverMap(f);
        s.door = f.door ? f.door.map(([u, v]) => map(u, v)) : null;
        s.pts = (f.notes || []).map((n) => map(n[0], n[1]));
      }
      s.C = s.door ? camera(s.door) : null;
      placeNotes(s);
    });
    stageIn.style.transform = keep;
    stage.style.height = `${(T + 2) * VH}px`;
  }

  function setState(s, st) {
    if (s.state === st) return;
    s.state = st;
    s.root.classList.toggle("vis", st !== "off");
    s.root.classList.toggle("live", st === "live");
    if (st !== "in") { s.root.style.clipPath = ""; s.root.style.opacity = ""; s.root.style.zIndex = ""; }
    if (st !== "out" && st !== "in") s.cam.style.transform = "";
    if (st !== "live") s.nts.forEach((n) => n.classList.remove("on", "cur"));
  }
  function playSet(on) {
    scenes.forEach((s) => {
      if (!s.vid) return;
      const want = on.includes(s);
      if (want && !s.playing) { if (s.f.once) { try { s.vid.currentTime = 0; } catch (e) {} } s.vid.play().catch(() => {}); s.playing = true; }
      else if (!want && s.playing) { s.vid.pause(); s.playing = false; }
    });
  }

  let liveLight = false;
  function render(u) {
    const uu = Math.max(0, Math.min(T - 1e-6, u));
    const seg = segs.find((g) => uu >= g.a && uu < g.a + g.len) || segs[segs.length - 1];
    const loc = (uu - seg.a) / seg.len;
    const playing = [];
    liveLight = false;
    if (seg.type === "hold") {
      const s = scenes[seg.i];
      scenes.forEach((x) => { if (x !== s) setState(x, "off"); });
      setState(s, "live");
      // пометки по очереди; те, что не влезли в кадр (на телефоне), пропускаем
      const h = uu - seg.a, shown = s.nts.filter((n) => !n.hidden);
      const last = shown.reduce((m, n, j) => (h >= HOLD0 + j * NOTE - 0.1 ? j : m), -1);
      shown.forEach((n, j) => { n.classList.toggle("on", j <= last); n.classList.toggle("cur", j === last); });
      playing.push(s); liveLight = !!s.f.light;
      if (u > -0.7) warm(scenes[seg.i + 1]);
    } else {
      const s = scenes[seg.i], n = scenes[seg.i + 1];
      scenes.forEach((x) => { if (x !== s && x !== n) setState(x, "off"); });
      setState(s, "out"); setState(n, "in");
      n.root.style.zIndex = 2;
      if (reduce || !s.C) {
        n.root.style.opacity = loc.toFixed(3);
      } else {
        const t = ease(loc), C = s.C, St = camAt(C, t);
        s.cam.style.transform = css(St.A, St.b);
        const M = mm(St.A, C.A1i), Mb = mv(M, C.b1);
        n.cam.style.transform = css(M, [St.b[0] - Mb[0], St.b[1] - Mb[1]]);
        // в самом конце окно-клип дотягиваем до краёв экрана, чтобы не осталось щелей от перспективы
        const m = clamp01((loc - 0.86) / 0.14), mE = m * m * (3 - 2 * m);
        const full = [[-2, -2], [VW + 2, -2], [VW + 2, VH + 2], [-2, VH + 2]];
        const D = s.door.map((p, j) => { const q = apply(St, p); return [q[0] + (full[j][0] - q[0]) * mE, q[1] + (full[j][1] - q[1]) * mE]; });
        n.root.style.clipPath = `polygon(${D.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(",")})`;
        n.root.style.opacity = clamp01(loc / 0.12).toFixed(3);
      }
      playing.push(s, n);
      warm(scenes[seg.i + 2]);
    }
    if (u > -0.95) hydrateFilm();
    if (u > -0.7) warm(scenes[0]);
    const stageOn = u > -1 && u < T + 1;
    playSet(stageOn && hydrated && !caseOpen() ? playing : []);

    // въезд сцены поверх шоурила и уход под индекс
    const pIn = clamp01(1 + u);
    const heroIn = hero.querySelector(".layer-in");
    if (!reduce) {
      heroIn.style.transform = pIn > 0 ? `scale(${(1 - 0.08 * pIn).toFixed(4)})` : "";
      heroIn.style.filter = pIn > 0.001 ? `brightness(${(1 - 0.7 * pIn).toFixed(3)})` : "";
      const rad = 28 * clamp01(-u);
      pin.style.borderRadius = rad > 0.1 ? `${rad.toFixed(1)}px ${rad.toFixed(1)}px 0 0` : "";
      const q = clamp01(u - T);
      stageIn.style.transform = q > 0 ? `scale(${(1 - 0.08 * q).toFixed(4)})` : "";
      stageIn.style.filter = q > 0.001 ? `brightness(${(1 - 0.7 * q).toFixed(3)})` : "";
    }
    hero.style.visibility = u >= 0.02 ? "hidden" : "";
    pin.style.visibility = u >= T + 1 ? "hidden" : "";

    const ir = indexEl.getBoundingClientRect();
    hd.classList.toggle("light", (ir.top <= 36 && ir.bottom > 36) || (ir.top > 36 && u >= 0 && liveLight));
    const hv = u < -0.2;
    if (hv !== heroOn && !document.hidden && !caseOpen()) heroPause(hv);
  }

  const heroVisible = () => -stage.getBoundingClientRect().top / VH < -0.2;
  // плавность «камеры»: прогресс догоняет прокрутку по времени, а не по кадрам
  let us = null, raf2 = 0, lastT = 0;
  function tick(now) {
    raf2 = 0;
    const dt = Math.min(1, Math.max(0.001, ((now || performance.now()) - (lastT || performance.now() - 16)) / 1000));
    lastT = now || performance.now();
    const target = -stage.getBoundingClientRect().top / VH;
    if (us === null || reduce || Math.abs(target - us) > 6) us = target;
    else us += (target - us) * (1 - Math.exp(-dt / 0.14));
    if (Math.abs(target - us) < 0.0006) us = target;
    render(us);
    if (us !== target) raf2 = requestAnimationFrame(tick); else lastT = 0;
  }
  const kick = () => { if (!raf2) { lastT = performance.now() - 16; raf2 = requestAnimationFrame(tick); } };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", () => { measure(); us = null; kick(); });
  measure(); tick();
  if (document.fonts) document.fonts.ready.then(() => { measure(); us = null; kick(); });
  addEventListener("load", () => { measure(); us = null; kick(); });
  // открыли сайт по ссылке на раздел (#index, #contact, старые #works и #services) — докручиваем,
  // когда высота фильма уже известна: браузер прыгнул к якорю раньше, чем она появилась
  const jump = () => {
    const id = decodeURIComponent(location.hash.slice(1)), t = id && document.getElementById(id);
    if (t && !caseOpen() && !t.closest("dialog")) t.scrollIntoView({ behavior: "instant", block: "start" });
  };
  jump();
  // открыли кейс — всё за окном на паузе; закрыли — сцена сама решает, что играть
  if (caseDlg) new MutationObserver(() => {
    if (caseOpen()) { if (heroOn) heroPause(false); playSet([]); }
    else { us = null; kick(); }
  }).observe(caseDlg, { attributes: true, attributeFilter: ["open"] });

  // ---------- индекс всех работ ----------
  const list = $(".ix-list"), filters = $(".ix-filters");
  // концепты «Пенки» — в самом конце индекса
  const BOTTOM = ["penka-identity", "penka-print"];
  const IX = [...W.filter((w) => !BOTTOM.includes(w.slug)), ...BOTTOM.map((s) => W.find((w) => w.slug === s)).filter(Boolean)];
  $(".ix-count").textContent = IX.length;
  // name — крупно; what — что сделано; phrase — продолжение фразы курсивом; who — для кого
  const INFO = {
    "penka-identity": { name: "Пенка", what: "Айдентика", phrase: "айдентика кофейни", who: "Кофейня у дома" },
    "penka-print": { name: "Меню «Пенки»", what: "Полиграфия", phrase: "меню и карта гостя", who: "Кофейня у дома" },
    "editorial-covers": { name: "Ну типа журнал", what: "Серия обложек", phrase: "серия журнальных обложек", who: "Журнал" },
    "vnutri-social": { name: "Внутри", what: "Соцсети", phrase: "соцсети психолога", who: "Психолог" },
    "carousels": { name: "Сытно, Кубышка, Буква", what: "Карусели", phrase: "карусели для экспертов", who: "Нутрициолог, финансист, юрист" },
    "gryadka-deck": { name: "Грядка", what: "Презентация", phrase: "презентация для инвесторов", who: "Агростартап" },
    "shum-motion": { name: "Шум", what: "Моушен-айдентика", phrase: "моушен-айдентика фестиваля", who: "Фестиваль электронной музыки" },
    "speaker-video": { name: "Видеообращение", what: "Ролик для соцсетей", phrase: "ролик для бизнес-консультанта", who: "Бизнес-консультант" },
    "yulia-sokolova": { name: "Сайт эксперта", what: "Лендинг", phrase: "лендинг с онлайн-записью", who: "Бизнес-эксперт" },
    "director-goda": { name: "Директор года", what: "Сайт", phrase: "сайт всероссийского конкурса", who: "Всероссийский конкурс" },
    "director-deck": { name: "Директор года", what: "Презентация", phrase: "презентация конкурса", who: "Всероссийский конкурс" },
  };
  const info = (w) => INFO[w.slug] || { name: w.title, what: service(w.service).short || "", phrase: (service(w.service).title || "").toLowerCase(), who: "" };
  const badgeOf = (w) => (w.concept && w.badge !== false ? `<span class="ix-badge">концепт</span>` : "");
  const arrow = `<span class="ix-arrow" aria-hidden="true">↗</span>`;
  const thumb = (w) => `<img class="ix-thumb" src="${w.cover}" alt="" loading="lazy">`;
  const rowEl = (w, inner) => {
    const li = el("li", "ix-row");
    li.dataset.service = w.service; li.dataset.cover = w.cover; li.dataset.slug = w.slug;
    li.innerHTML = `<a href="${caseUrl(w.slug)}">${inner}</a>`;
    return li;
  };
  const GROUPS = ["motion", "slides", "social", "carousels", "web", "print", "identity"];
  const GROUP_NAME = { identity: "Айдентика", social: "Соцсети", carousels: "Карусели", slides: "Презентации", print: "Полиграфия", motion: "Моушен", web: "Сайты" };
  // подача списка: «По услугам»; запасные — ?ix=italic («Фраза») и ?ix=credits («Титры»)
  const VARIANTS = ["groups", "italic", "credits"];
  let rows = [], filterId = "all";

  function buildIndex(v) {
    list.innerHTML = ""; list.dataset.v = v; rows = [];
    filters.hidden = v === "groups";
    if (v === "groups") {
      GROUPS.forEach((g) => {
        const ws = IX.filter((w) => w.service === g); if (!ws.length) return;
        const grp = el("li", "ixg", `<h3 class="ixg-name">${GROUP_NAME[g] || service(g).short}<sup>${pad(ws.length)}</sup></h3>`);
        const ol = el("ol", "ixg-list");
        ws.forEach((w) => { const it = info(w); const li = rowEl(w, `${thumb(w)}<span class="v-name">${it.name}${badgeOf(w)}</span><span class="v-who">${it.who}</span>${arrow}`); ol.append(li); rows.push(li); });
        grp.append(ol); list.append(grp);
      });
    } else if (v === "italic") {
      IX.forEach((w, i) => {
        const it = info(w);
        const li = rowEl(w, `<span class="ix-num">${pad(i + 1)}</span>${thumb(w)}<span class="v-line"><span class="v-name">${it.name}</span> <span class="v-it">— ${it.phrase}</span>${badgeOf(w)}</span><span class="ix-year">${w.year || ""}</span>${arrow}`);
        list.append(li); rows.push(li);
      });
    } else {
      list.append(el("li", "v-head", `<span>Проект</span><span>Что сделано</span><span>Для кого</span><span>Год</span><span></span>`));
      IX.forEach((w) => {
        const it = info(w);
        const li = rowEl(w, `${thumb(w)}<span class="v-name">${it.name}${badgeOf(w)}</span><span class="v-what">${it.what}</span><span class="v-who">${it.who}</span><span class="ix-year">${w.year || ""}</span>${arrow}`);
        list.append(li); rows.push(li);
      });
    }
    applyFilter();
  }
  function applyFilter() { rows.forEach((li) => { li.hidden = !(list.dataset.v === "groups" || filterId === "all" || li.dataset.service === filterId); }); }

  const used = [...new Set(W.map((w) => w.service))];
  const chips = [["all", "Все"], ...S.services.filter((s) => used.includes(s.id)).map((s) => [s.id, s.short])];
  chips.forEach(([id, label], k) => {
    const b = el("button", "", label); b.type = "button"; b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", k === 0 ? "true" : "false");
    b.addEventListener("click", () => {
      filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-selected", x === b ? "true" : "false"));
      filterId = id; applyFilter();
    });
    filters.append(b);
  });

  const v0 = new URLSearchParams(location.search).get("ix");
  buildIndex(VARIANTS.includes(v0) ? v0 : "groups");

  // «По услугам»: если хоть одно название не влезает рядом с «для кого», во всём списке «для кого» уходит под название
  function fitIndex() {
    if (list.dataset.v !== "groups") return;
    list.classList.remove("ix-stack");
    const tight = rows.some((li) => { const n = li.querySelector(".v-name"); return n && n.scrollWidth > n.clientWidth + 1; });
    list.classList.toggle("ix-stack", tight);
  }
  fitIndex();
  let fitRaf = 0;
  addEventListener("resize", () => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fitIndex); });
  if (document.fonts) document.fonts.ready.then(fitIndex);

  // превью за курсором
  const peek = $(".peek"), [pa, pb] = peek.querySelectorAll("img"), pv = peek.querySelector("video");
  let front = pa, tx = 0, ty = 0, x = 0, y = 0, raf = 0, active = false, fresh = true;
  function place() {
    const w = peek.offsetWidth, h = peek.offsetHeight, gap = 36;
    let px = tx + gap; if (px + w > innerWidth - 16) px = tx - gap - w;
    let py = ty - h / 2; py = Math.max(16, Math.min(innerHeight - h - 16, py));
    return [px, py];
  }
  function loop() {
    const [px, py] = place();
    if (fresh) { x = px; y = py; fresh = false; }
    x += (px - x) * 0.14; y += (py - y) * 0.14;
    peek.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    raf = active || Math.abs(px - x) > 0.5 || Math.abs(py - y) > 0.5 ? requestAnimationFrame(loop) : 0;
  }
  function setPeek(li) {
    const vsrc = PEEK_VIDEO[li.dataset.slug];
    if (vsrc) {
      if (pv.getAttribute("src") !== vsrc) pv.src = vsrc;
      pv.play().catch(() => {});
      pv.classList.add("top"); pa.classList.remove("top"); pb.classList.remove("top");
      return;
    }
    pv.classList.remove("top"); pv.pause();
    const src = li.dataset.cover;
    if (front.getAttribute("src") === src) { front.classList.add("top"); return; }
    const back = front === pa ? pb : pa;
    back.src = src; back.classList.add("top"); front.classList.remove("top"); front = back;
  }
  list.addEventListener("pointermove", (e) => {
    if (!fine.matches) return;
    tx = e.clientX; ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(loop);
  });
  // делегирование: строки пересобираются при смене подачи
  let hoverLi = null;
  const hidePeek = () => { hoverLi = null; active = false; peek.classList.remove("on"); setTimeout(() => { if (!active) pv.pause(); }, 400); };
  list.addEventListener("pointerover", (e) => {
    if (!fine.matches) return;
    const li = e.target.closest(".ix-row");
    if (!li) { if (active) hidePeek(); return; }
    if (li === hoverLi) return;
    hoverLi = li;
    if (!active) { fresh = true; tx = e.clientX; ty = e.clientY; }
    active = true; setPeek(li); peek.classList.add("on");
    if (!raf) raf = requestAnimationFrame(loop);
  });
  list.addEventListener("pointerleave", hidePeek);
  // прогреваем обложки, чтобы превью не мигало
  if (fine.matches) setTimeout(() => W.forEach((w) => { const i = new Image(); i.src = w.cover; }), 2500);
})();
