// Всё, что меняется на сайте, — в этом файле.

window.SITE = {
  name: "Работяга Studio",
  role: "дизайнер",
  telegram: "rabotyaga_studio", // без @
  accent: "#FF4D1A",
  status: "Принимаю заказы",
  headline: "Дизайн, после которого бизнес выглядит дороже",
  lead: "Логотипы и айдентика, соцсети, презентации, моушен и сайты. Беру и точечные задачи, и упаковку бренда целиком.",
  // price можно оставить пустым — тогда цена не показывается
  services: [
    { id: "identity", short: "Айдентика", title: "Логотипы и айдентика", text: "Логотип, цвета, шрифты и правила, по которым бренд узнают с первого взгляда.", price: "" },
    { id: "social", short: "Соцсети", title: "Соцсети и креативы", text: "Аватар, обложки, шаблоны постов и сторис, рекламные баннеры.", price: "" },
    { id: "carousels", short: "Карусели", title: "Карусели для экспертов", text: "Экспертные карусели для Instagram и Telegram: обложка, которая цепляет, и слайды, которые листают до конца.", price: "" },
    { id: "slides", short: "Презентации", title: "Презентации", text: "Презентации для инвесторов, коммерческие предложения и гайды, которые дочитывают до конца.", price: "" },
    { id: "print", short: "Полиграфия", title: "Визитки и полиграфия", text: "Визитки, меню, листовки, наклейки — с подготовкой к печати.", price: "" },
    { id: "motion", short: "Моушен", title: "Моушен", text: "Анимация логотипа, короткие ролики для рилс и сторис.", price: "" },
    { id: "web", short: "Сайты", title: "Сайты и интерфейсы", text: "Лендинги и интерфейсы. Проект побольше обсуждаем отдельно.", price: "" },
  ],
};

// Работы. Картинки кладём в works/<slug>/.
// Ссылка на конкретный кейс для поста в Threads: адрес-сайта/#slug
//
// slug      — латиницей, уникальный
// service   — id из списка услуг выше
// concept   — true, если это концепт, а не реальный заказ
// cover     — обложка карточки (лучше 4:3)
// before/after — если есть, в кейсе появится слайдер «было/стало»
// images — картинки или видео: { video, poster, vertical, sound }; url — ссылка на живой сайт
//          sound: true — видео со звуком: не играет само, у него есть кнопки управления
// gallery — серия, которую листают: [{ src, title, alt }]; по клику открывается крупно со стрелками
// note    — короткая приписка под кейсом мелким шрифтом
window.WORKS = [
  {
    slug: "penka-identity",
    title: "Айдентика кофейни «Пенка»",
    service: "identity",
    concept: true,
    year: 2026,
    cover: "works/penka-identity/cover.jpg",
    task: "Небольшая кофейня у дома. Нужен бренд, который видно с улицы и в ленте: тёплый, но не в коричнево-бежевых тонах, как у всех. И чтобы он одинаково хорошо смотрелся на стакане, вывеске, в меню и в соцсетях.",
    solution: "Героем стала шапка молочной пены, из неё вырос знак: чашка капучино из трёх «облаков» пены, чаши и блюдца. Основной цвет — кобальт, он заметен издалека, а сливочный и абрикосовый добавляют тепла. Сделал логосистему, палитру с пропорциями, шрифтовую пару, паттерн и стикеры, стаканы трёх размеров, вывеску и оформление соцсетей.",
    images: [
      "works/penka-identity/01-idea.jpg",
      "works/penka-identity/02-mark.jpg",
      "works/penka-identity/03-logo.jpg",
      "works/penka-identity/04-colors.jpg",
      "works/penka-identity/05-type.jpg",
      "works/penka-identity/06-graphics.jpg",
      "works/penka-identity/07-cups.jpg",
      "works/penka-identity/08-social.jpg",
      "works/penka-identity/09-sign.jpg",
      "works/penka-identity/10-final.jpg",
    ],
  },
  {
    slug: "penka-print",
    title: "Меню и карта гостя для «Пенки»",
    service: "print",
    concept: true,
    year: 2026,
    cover: "works/penka-print/cover.jpg",
    task: "Полиграфия для той же кофейни: меню, которое читается за пять секунд у кассы, и карта лояльности, которую не хочется выбросить.",
    solution: "Меню на двух листах А4: кофе на кобальте, остальное на светлом, цены выровнены в одну колонку, объёмы набраны мелко, чтобы не спорить с названиями. Та же сетка масштабируется до меню-доски над стойкой. На обороте карты гостя семь штампов-знаков, седьмой, бесплатный кофе выделен абрикосовым. Плюс мелочи: Wi-Fi-карточка, ценники для витрины, сахар в стиках и наклейки.",
    images: [
      "works/penka-print/01-menu.jpg",
      "works/penka-print/02-board.jpg",
      "works/penka-print/03-card.jpg",
      "works/penka-print/04-details.jpg?v=2",
    ],
  },
  {
    slug: "editorial-covers",
    title: "Серия обложек «Ну типа журнал»",
    service: "print",
    concept: true,
    badge: false,
    year: 2026,
    cover: "works/editorial-covers/cover.jpg?v=2",
    task: "Авторский концепт: придумать журнал и собрать серию обложек, по которой его узнают и на полке, и в ленте. Каждый выпуск должен держаться сам по себе, а все четыре рядом — читаться как один журнал.",
    solution: "Название «Ну типа журнал» разговорное и с самоиронией, и шапка ведёт себя так же. На первом выпуске в ней стоит само название, а дальше журнал начинает комментировать собственные обложки: «Это чьё-то ухо», «Они несъедобные», «Ну присаживайся, старина». Шрифт, место шапки и номер выпуска везде одни, тема — крупно внизу, поэтому серия читается как один журнал. У каждого выпуска свой цвет и один сильный образ: бетонный дом с деревом во дворе на кислотно-жёлтом, бумажное ухо на кобальте, три хромовые груши на красном (третья уже плавится) и офисное кресло в спокойной воде на персиковом.",
    gallery: [
      { src: "works/editorial-covers/01-gorod-vnutri.jpg", title: "01 — Город внутри", alt: "Обложка «Ну типа журнал», выпуск 01 «Город внутри»: бетонное здание с деревом во внутреннем дворе на кислотно-жёлтом фоне, сверху название журнала" },
      { src: "works/editorial-covers/02-pravo-na-tishinu.jpg", title: "02 — Право на тишину", alt: "Обложка «Ну типа журнал», выпуск 02 «Право на тишину»: белая бумажная скульптура уха на кобальтовом фоне, сверху надпись «Это чьё-то ухо»" },
      { src: "works/editorial-covers/03-era-kopiy.jpg", title: "03 — Эра копий", alt: "Обложка «Ну типа журнал», выпуск 03 «Эра копий»: три хромированные груши на красном фоне, третья растекается лужицей, сверху надпись «Они несъедобные»" },
      { src: "works/editorial-covers/04-posle-raboty.jpg", title: "04 — После работы", alt: "Обложка «Ну типа журнал», выпуск 04 «После работы»: ржаво-красное офисное кресло в спокойной воде на персиковом фоне, сверху надпись «Ну присаживайся, старина»" },
    ],
  },
  {
    slug: "vnutri-social",
    title: "Соцсети психолога «Внутри»",
    service: "social",
    concept: true,
    badge: false,
    year: 2026,
    cover: "works/vnutri-social/cover.jpg?v=3",
    task: "Визуальная упаковка соцсетей психолога, который работает с тревогой и выгоранием. Аудитория устала от громких обещаний в ленте, поэтому профиль должен с первого экрана давать ощущение спокойствия и опоры, а посты — читаться до конца и вести к записи на консультацию.",
    solution: "Собрал тихий тёплый визуальный язык. Знак — открытая арка как образ безопасного места, и та же арка повторяется в кадрировании фото. Фотостиль держится на дневном свете, льне и букле, в шрифтах — антиква с курсивом. Что вошло в проект: сетка из 12 постов в формате 3:4, шаблоны каруселей и сторис, обложки актуального и рекламные креативы под два оффера.",
    images: [
      "works/vnutri-social/01-brief.jpg?v=2",
      "works/vnutri-social/02-identity.jpg",
      "works/vnutri-social/03-photo.jpg",
      "works/vnutri-social/04-grid.jpg",
      "works/vnutri-social/05-posts.jpg",
      "works/vnutri-social/06-carousel.jpg",
      "works/vnutri-social/07-stories.jpg",
      "works/vnutri-social/08-highlights.jpg",
      "works/vnutri-social/09-ads.jpg",
      "works/vnutri-social/10-final.jpg?v=2",
    ],
  },
  {
    slug: "carousels",
    // Старая ссылка отдельного кейса «Сытно» открывает этот кейс сразу с просмотром серии «Сытно»
    aliases: { "sytno-carousel": "sytno" },
    title: "Карусели для экспертов",
    service: "carousels",
    concept: true,
    badge: false,
    year: 2026,
    cover: "works/carousels/cover-all.jpg",
    // Кейс из нескольких серий: обложки серий, по клику — просмотр с вкладками серий.
    // kicker — строка над заголовком; headline и lead можно с <br>; disclaimer — сноска под серией в просмотре;
    // thumb — лёгкая миниатюра для ленты под слайдом и для сетки (у SVG сетка берёт сам слайд)
    kicker: "Карусели · Работяга Studio",
    headline: "Карусели<br>для экспертов",
    lead: "Сложная тема — понятная серия.<br> Дизайн, который помогает читать дальше.",
    cta: "Обсудить карусель",
    outro: "Три темы. Три визуальных подхода.",
    series: [
      {
        id: "sytno",
        name: "Сытно",
        category: "Нутрициолог",
        note: "Утро на свой вкус",
        intro: "Пять простых завтраков: блюда сверху, тёплый свет и крупная антиква. Круглое кадрирование рифмуется с посудой, рецепты набраны спокойным гротеском.",
        bg: "#9F2C21",
        spec: {
          palette: [
            { name: "Томатный", hex: "#9F2C21" },
            { name: "Сливочный", hex: "#F5EEDC" },
            { name: "Масляный", hex: "#EAC967" },
            { name: "Тёплый тёмный", hex: "#30251F" }
          ],
          fonts: "Prata — заголовки<br>Manrope — рецепты",
          format: "7 слайдов · 1080&nbsp;×&nbsp;1440"
        },
        slides: [
          { src: "works/sytno-carousel/01-cover.jpg", thumb: "works/sytno-carousel/thumbs/01-cover.jpg", title: "Обложка", alt: "Обложка карусели «Сытно»: утро на свой вкус, 5 простых завтраков, тост с авокадо и яйцом на тарелке" },
          { src: "works/sytno-carousel/02-omelette.jpg", thumb: "works/sytno-carousel/thumbs/02-omelette.jpg", title: "Омлет с овощами", alt: "Завтрак 01 — омлет с овощами: яйца, томаты, шпинат; сначала слегка обжарить овощи, потом залить яйцами" },
          { src: "works/sytno-carousel/03-oats.jpg", thumb: "works/sytno-carousel/thumbs/03-oats.jpg", title: "Овсянка с ягодами", alt: "Завтрак 02 — овсянка с ягодами и грецкими орехами: ягоды добавить в конце" },
          { src: "works/sytno-carousel/04-toast.jpg", thumb: "works/sytno-carousel/thumbs/04-toast.jpg", title: "Тост с авокадо и яйцом", alt: "Завтрак 03 — тост с авокадо и варёным яйцом: яйцо можно сварить с вечера" },
          { src: "works/sytno-carousel/05-curd.jpg", thumb: "works/sytno-carousel/thumbs/05-curd.jpg", title: "Творог с грушей", alt: "Завтрак 04 — творог с грушей, йогуртом и корицей, без плиты" },
          { src: "works/sytno-carousel/06-buckwheat.jpg", thumb: "works/sytno-carousel/thumbs/06-buckwheat.jpg", title: "Гречка с яйцом", alt: "Завтрак 05 — гречка с глазуньей, огурцом и укропом из готовой крупы" },
          { src: "works/sytno-carousel/07-save.jpg", thumb: "works/sytno-carousel/thumbs/07-save.jpg", title: "Сохраните подборку", alt: "Финальный слайд «Сытно»: пять идей — одна подборка, сохраните подборку" }
        ]
      },
      {
        id: "kubyshka",
        name: "Кубышка",
        category: "Финансы",
        note: "Резерв при нерегулярном доходе",
        intro: "Как объяснить резерв при неровном доходе: конкретные примеры, простые пропорции и синий акцент на накоплениях.",
        bg: "#F0EEE7",
        disclaimer: "Расчёты иллюстрируют сценарий и не обещают конкретный финансовый результат.",
        spec: {
          palette: [
            { name: "Бумага", hex: "#F0EEE7" },
            { name: "Графит", hex: "#1B211E" },
            { name: "Резерв", hex: "#2C4DFF" }
          ],
          fonts: "Manrope — заголовки и текст<br>моноширинные цифры в расчётах",
          format: "7 слайдов · 1080&nbsp;×&nbsp;1350"
        },
        slides: [
          { src: "works/carousels/kubyshka/01-cover.svg", thumb: "works/carousels/kubyshka/thumbs/01-cover.jpg", title: "Доход скачет. Запас растёт.", alt: "Типографическая обложка карусели «Кубышка» о финансовом резерве при неровном доходе" },
          { src: "works/carousels/kubyshka/02-percent-examples.svg", thumb: "works/carousels/kubyshka/thumbs/02-percent-examples.jpg", title: "Процент один. Суммы разные.", alt: "Три условных примера: от разных поступлений в резерв уходит десять процентов" },
          { src: "works/carousels/kubyshka/03-allocation.svg", thumb: "works/carousels/kubyshka/thumbs/03-allocation.jpg", title: "Раздели поступление.", alt: "Пропорция распределения поступления: девяносто процентов и десять процентов в резерв" },
          { src: "works/carousels/kubyshka/04-first-milestone.svg", thumb: "works/carousels/kubyshka/thumbs/04-first-milestone.jpg", title: "Первый рубеж.", alt: "Условная цель накоплений: 180 тысяч рублей на три месяца обязательных расходов по 60 тысяч" },
          { src: "works/carousels/kubyshka/05-change-the-pace.svg", thumb: "works/carousels/kubyshka/thumbs/05-change-the-pace.jpg", title: "Темп можно менять.", alt: "Как менять темп накоплений при разном доходе без давления на себя" },
          { src: "works/carousels/kubyshka/06-annual-calculation.svg", thumb: "works/carousels/kubyshka/thumbs/06-annual-calculation.jpg", title: "Расчёт за год.", alt: "Расчёт: средний доход 150 тысяч рублей в месяц, десять процентов, двенадцать месяцев — 180 тысяч рублей" },
          { src: "works/carousels/kubyshka/07-save-the-plan.svg", thumb: "works/carousels/kubyshka/thumbs/07-save-the-plan.jpg", title: "Сохрани схему.", alt: "Заключительный слайд карусели «Кубышка» с призывом сохранить схему" }
        ]
      },
      {
        id: "bukva",
        name: "Буква",
        category: "Юрист",
        note: "Договор с подрядчиком: 5 пунктов",
        intro: "Каждый слайд — страница договора: расплывчатый пункт зачёркнут красной ручкой, точная формулировка выделена маркером, на полях пометки юриста. Под листом — пример в цифрах.",
        bg: "#F2EFE8",
        disclaimer: "Формулировки показывают подход и не заменяют консультацию по конкретному договору.",
        spec: {
          palette: [
            { name: "Бумага", hex: "#F2EFE8" },
            { name: "Чернила", hex: "#1B1A17" },
            { name: "Красная ручка", hex: "#D7263D" },
            { name: "Маркер", hex: "#F4D0D1" }
          ],
          fonts: "Literata — заголовки и пункты<br>IBM Plex Sans — подписи<br>Caveat — пометки на полях",
          format: "7 слайдов · 1080&nbsp;×&nbsp;1440"
        },
        slides: [
          { src: "works/carousels/bukva/01.jpg", thumb: "works/carousels/bukva/thumbs/01.jpg", title: "Договор с подрядчиком", alt: "Обложка карусели «Буква»: договор с подрядчиком, 5 пунктов, которые сберегут деньги; лист договора с оглавлением и печатью «Проверено»" },
          { src: "works/carousels/bukva/02.jpg", thumb: "works/carousels/bukva/thumbs/02.jpg", title: "§ 1 Предмет", alt: "§ 1 Предмет: вместо «разработка сайта» — «сайт из 5 страниц по техническому заданию, Приложение 1»; пять страниц из задания" },
          { src: "works/carousels/bukva/03.jpg", thumb: "works/carousels/bukva/thumbs/03.jpg", title: "§ 2 Сроки", alt: "§ 2 Сроки: вместо «в разумный срок» — «до 15 марта 2027 года включительно»; календарь с днём сдачи и днями просрочки" },
          { src: "works/carousels/bukva/04.jpg", thumb: "works/carousels/bukva/thumbs/04.jpg", title: "§ 3 Оплата", alt: "§ 3 Оплата: вместо «по договорённости» — аванс 30% после подписания и 70% после акта; шкала цены договора" },
          { src: "works/carousels/bukva/05.jpg", thumb: "works/carousels/bukva/thumbs/05.jpg", title: "§ 4 Приёмка", alt: "§ 4 Приёмка: вместо «принята после передачи» — 5 рабочих дней на проверку и замечания письменно" },
          { src: "works/carousels/bukva/06.jpg", thumb: "works/carousels/bukva/thumbs/06.jpg", title: "§ 5 Неустойка", alt: "§ 5 Неустойка: 0,1% от цены договора за каждый день, не более 10%; пример: 300 000 ₽ × 0,1% × 20 дней = 6 000 ₽" },
          { src: "works/carousels/bukva/07.jpg", thumb: "works/carousels/bukva/thumbs/07.jpg", title: "Проверка договора", alt: "Финальный слайд «Буква»: проверю ваш договор за один день, пять пунктов с галочками, пришлите договор в директ" }
        ]
      }
    ]
  },
  {
    slug: "gryadka-deck",
    title: "Презентация для инвесторов «Грядка»",
    service: "slides",
    concept: true,
    year: 2026,
    cover: "works/gryadka-deck/cover.jpg?v=4",
    task: "Стартап вертикальных ферм ищет инвестиции. Нужна презентация, которую инвестор поймёт за три минуты: проблема, продукт, рынок, цифры, сколько просят и на что.",
    solution: "Девять слайдов, на каждом одна мысль и одна главная цифра. Тёмно-зелёный и салатовый — цвета фермы под LED-светом. Графики роста, размер рынка, экономика и то, на что пойдут деньги, нарисованы в одной системе, чтобы презентация читалась как продукт, а не как отчёт. Данные условные.",
    images: [
      "works/gryadka-deck/00-overview.jpg?v=2",
      "works/gryadka-deck/01.jpg?v=2",
      "works/gryadka-deck/02.jpg",
      "works/gryadka-deck/03.jpg",
      "works/gryadka-deck/04.jpg",
      "works/gryadka-deck/05.jpg",
      "works/gryadka-deck/06.jpg",
      "works/gryadka-deck/07.jpg",
      "works/gryadka-deck/08.jpg",
      "works/gryadka-deck/09.jpg",
    ],
  },
  {
    slug: "shum-motion",
    title: "Моушен-айдентика фестиваля «Шум»",
    service: "motion",
    concept: true,
    year: 2026,
    cover: "works/shum-motion/cover.jpg",
    task: "Городскому фестивалю электронной музыки нужен логотип, который живёт в движении: на экранах сцены, в рилс и на афишах, — и сразу считывается как «громко».",
    solution: "Логотип собран из пикселей LED-табло 5×5: в движении каждая колонка работает как полоса эквалайзера и сама складывается в слово ШУМ. Сделал анимацию логотипа, рилс на 12 секунд с кинетической типографикой и серию из трёх афиш.",
    images: [
      "works/shum-motion/01-system.jpg",
      { video: "works/shum-motion/logo.mp4", poster: "works/shum-motion/logo-poster.jpg" },
      { video: "works/shum-motion/reel.mp4", poster: "works/shum-motion/reel-poster.jpg", vertical: true },
      "works/shum-motion/02-board.jpg",
      "works/shum-motion/03-posters.jpg",
    ],
  },
  {
    slug: "speaker-video",
    aliases: { "director-video": null },
    title: "Видеообращение бизнес-консультанта",
    service: "motion",
    year: 2026,
    cover: "works/speaker-video/cover.jpg",
    task: "Прислали видеообращение спикера, но запись вышла неудачной: картинка не годится, а переснимать некогда. Ролик для соцсетей нужен сразу.",
    solution: "Вытащил из записи голос, а из фотографии спикера сделал говорящее видео под этот голос. Смонтировал вертикальный ролик: титры по словам с золотыми акцентами и плашки с ключевыми фактами — опыт, компании, карьерный путь. На всё ушло 10 минут.",
    images: [
      { video: "works/speaker-video/video.mp4", poster: "works/speaker-video/poster.jpg", vertical: true, sound: true },
      "works/speaker-video/01-process.jpg",
    ],
  },
  {
    slug: "yulia-sokolova",
    title: "Сайт для эксперта по метафизике бизнеса",
    service: "web",
    year: 2026,
    cover: "works/yulia-sokolova/cover.jpg?v=3",
    task: "Личный сайт эксперта по метафизике бизнеса: рассказать о методе, книгах и форматах работы и превратить посетителей в заявки на диагностику — так, чтобы ни одно обращение не потерялось.",
    solution: "Тёмная премиальная подача с золотыми акцентами под аудиторию первых лиц. Одна страница ведёт от образа эксперта к методу, книгам, форматам работы и форме записи. К сайту подключён Telegram-бот: заявки с формы сразу приходят в бот и автоматически попадают в CRM, где видно каждого клиента и статус его обращения. Сайт, бот и CRM работают как одна система продаж.",
    images: [
      "works/yulia-sokolova/01-intro.jpg?v=3",
      "works/yulia-sokolova/02-page.jpg?v=3",
      "works/yulia-sokolova/03-screens.jpg?v=3",
      "works/yulia-sokolova/04-mobile.jpg?v=3",
      "works/yulia-sokolova/05-system.jpg?v=3",
      "works/yulia-sokolova/06-details.jpg?v=3",
    ],
  },
  {
    slug: "director-goda",
    title: "Сайт всероссийского конкурса для руководителей",
    service: "web",
    year: 2026,
    cover: "works/director-goda/cover.jpg?v=3",
    task: "Сайт всероссийского конкурса для руководителей: объяснить, как устроен конкурс, показать номинации, экспертов и программу и собрать заявки участников и партнёров.",
    solution: "Строгая редакционная подача: антиква в заголовках, много воздуха, приглушённый зелёный. Страница ведёт по шагам: о конкурсе и сроки, номинации, методология оценки, эксперты, программа развития, партнёрство. Регистрация и оплата участия встроены прямо в сайт: кнопка «Стать участником» открывает форму с оплатой (GetCourse), и человек не уходит со страницы.",
    images: [
      "works/director-goda/01-intro.jpg?v=3",
      "works/director-goda/02-page.jpg?v=3",
      "works/director-goda/03-screens.jpg?v=3",
      "works/director-goda/04-mobile.jpg?v=3",
      "works/director-goda/05-system.jpg?v=3",
      "works/director-goda/06-details.jpg?v=3",
    ],
  },
  {
    slug: "director-deck",
    title: "Презентация конкурса «Директор года»",
    service: "slides",
    year: 2026,
    cover: "works/director-deck/cover.jpg",
    task: "Всероссийскому конкурсу для руководителей нужна презентация для выступлений перед залом: за пару минут объяснить топ-менеджеру, зачем ему участвовать, и довести до регистрации.",
    solution: "Презентация в стиле сайта конкурса: глубокий зелёный, золото и строгая типографика. История идёт от вопроса залу «Знают ли о вашем успехе другие?» к цифрам конкурса, турам оценки, программе из 20 тренингов и тому, что видит HR в строке резюме. На каждом слайде одна мысль, а главные цифры и выгоды выделены золотом.",
    images: [
      "works/director-deck/00-overview.jpg",
      "works/director-deck/01.jpg",
      "works/director-deck/02.jpg",
      "works/director-deck/03.jpg",
      "works/director-deck/04.jpg",
      "works/director-deck/05.jpg",
      "works/director-deck/06.jpg",
      "works/director-deck/07.jpg",
      "works/director-deck/08.jpg",
      "works/director-deck/09.jpg",
      "works/director-deck/10.jpg",
    ],
  },
];
