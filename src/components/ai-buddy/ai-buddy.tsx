"use client";

import { useEffect, useRef, useState, useCallback } from "react";

import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

import { ORBO_CONTACT_SPAM_EVENT, ORBO_MAX_HOVER_EVENT, SECTIONS_IDS } from "@/constants/common";

// --- Данные ---

const SECTION_COMMENTS: Record<string, string[]> = {
  hero: [
    "Да, это тот самый чувак. Листай, не пожалеешь. Ну, наверное.",
    "Красивые частицы, правда? Я тут живу. Аренда бесплатная.",
    "Привет! Я — Орбо. Твой незваный экскурсовод по этому сайту.",
    "Первое впечатление — самое важное. Не подведи, он старался.",
    "Сайт красивый? А ты думал, 8 лет опыта — это шутки?",
    "Смотри какой лендинг отгрохал. Мог бы и попроще, но нет.",
  ],
  about: [
    "8 лет опыта? Я бы сказал — 8 лет выживания в IT.",
    "DevOps в прошлом? Значит, он знает, как всё сломать И починить. Ценный навык.",
    "Полный стек — это когда за всё отвечаешь один. Героизм или безумие?",
    "От серверной стойки до пикселя. Человек-оркестр, короче.",
    "AI-инструменты использует. Ну я-то знаю, он без меня никуда.",
    "Скромно написал. На самом деле тут на три экрана можно расписать.",
  ],
  experience: [
    "Газпромбанк — это вам не TODO-приложение на React. Тут серьёзно.",
    "Микрофронтенды — потому что один фронтенд ему было скучно.",
    "Код-ревью в банке — как экзамен, только каждый день.",
    "Enterprise, CI/CD, Kubernetes… У меня от одних слов процессор греется.",
    "Ведущий инженер — звучит солидно. Потому что так и есть.",
    "Посмотри на этот путь: сисадмин → DevOps → фронтенд-лид. Не каждый так может.",
  ],
  projects: [
    "Сервис24 — акты в поле, 1С на связи, офлайн не страшен. Пока в разработке, но уже выглядит серьёзно.",
    "Trenika — заставит тебя пойти в зал. Ну или хотя бы почувствовать вину.",
    "GlassesUSA — подобрал очки всей Америке. Буквально.",
    "Каждый проект — маленький стартап. Только работающий. Почувствуй разницу.",
    "Кликни на проект, посмотри вживую. Я разрешаю.",
    "Три проекта тут, но ты бы видел, сколько он ещё не показал.",
    "Он их ещё и с нуля делал. Не из шаблонов. Уважение.",
  ],
  lastArticles: [
    "О, блог! Человек ещё и пишет. Как будто мало ему было кода.",
    "Статьи пишет сам. Ну ладно, AI немного помогает. Совсем чуть-чуть.",
    "Кто ведёт блог в 2026? Только те, кому есть что сказать.",
    "MDX — Markdown + React. Обычные люди просто в Notion пишут, но нет.",
    "Тут можно залипнуть надолго. Не говори потом, что я не предупреждал.",
  ],
  contactUs: [
    "Хватит скроллить — напиши уже! Он не кусается. В отличие от меня.",
    "Telegram работает 24/7. Человек — примерно 16/5. Но пишите.",
    "Если дочитал до сюда — ты явно заинтересован. Ну так действуй!",
    "Форма не кусается. Проверено мной лично. Ну, виртуально.",
    "Один клик — и ты в его Telegram. Что тебя останавливает?",
    "Он реально отвечает. Проверено. Иногда даже быстро.",
  ],
};

const IDLE_COMMENTS = [
  "Задумался? Я тоже иногда зависаю. Мы похожи.",
  "Тишина… Слышу, как твой процессор скучает.",
  "Листай дальше, там ещё интереснее. Я проверял.",
  "Если что — я никуда не денусь. К сожалению для тебя.",
  "Залип? Понимаю. Сайт красивый, хозяин постарался.",
  "Ты ещё тут? Приятно, что кто-то задерживается.",
  "Можешь на меня не смотреть. Я всё равно буду комментировать.",
];

const CURSOR_COMMENTS: Record<string, string[]> = {
  avatar: [
    "Фоточка! Красавчик, конечно. Ну, для айтишника — точно.",
    "Смотришь на фото? Да, в жизни он ещё лучше. Ну или хуже. Кто знает.",
    "Залип на аватарке? Понимаю. Харизма через пиксели пробивает.",
    "Кто этот обаятельный мужчина? А, это же хозяин сайта.",
    "Фотогеничный, ничего не скажешь. Жаль, что код красивее.",
    "На фото он серьёзный, а в Telegram — душка. Проверь сам.",
    "Рассматриваешь? Он не модель, он инженер. Но фото огонь.",
    "Мог бы в IT не идти — с такой внешностью прямая дорога в стоковые фото.",
  ],
  link: [
    "О, присматриваешься к ссылке? Давай, не стесняйся.",
    "Ссылка не укусит. Кликай, я подожду.",
    "Интересный выбор. У тебя хороший вкус.",
    "Хочешь кликнуть, но сомневаешься? Это называется осторожность.",
  ],
  button: [
    "Кнопка! Нажми — хозяин старался, когда её делал.",
    "Палец завис? Смелее, я прикрою.",
    "Ну давай, жми. Обещаю — ничего не взорвётся. Наверное.",
    "Кнопка ждёт. Ты ждёшь. Все ждут. Кто первый?",
  ],
  image: [
    "Красивая картинка, правда? Он сам скриншотил, между прочим.",
    "Залип на фотке? Понимаю, тут есть на что посмотреть.",
    "Пиксели разглядываешь? Дизайнер из тебя неплохой.",
    "Картинка стоит тысячи строк кода. А он написал и код, и картинку нашёл.",
  ],
  heading: [
    "Заголовок зацепил? Правильно, тут всё продумано.",
    "Вижу, вчитываешься. Значит, текст работает.",
    "Заголовки он тоже сам придумывал. Ценю усилия.",
  ],
  text: [
    "Внимательно читаешь? Молодец. Он для тебя старался.",
    "Тут написано по делу, без воды. Редкость в наши дни.",
    "О, зависаешь на тексте — значит интересно! Передам автору.",
    "Читаешь мелкий шрифт? Ты из тех, кто лицензионные соглашения читает, да?",
  ],
  code: [
    "Код разглядываешь? Настоящий разработчик палится.",
    "Syntax highlighting — красота. Он мог бы и plain text влепить, но нет.",
    "Ревьюишь? Баги не ищи — он уже всё проверил. Ну, надеюсь.",
    "Это `sugar-high` подсвечивает. Лёгкий как я. Ну почти.",
  ],
  generic: [
    "Что-то привлекло внимание? У тебя хороший глаз.",
    "Курсор замер. Либо думаешь, либо уснул.",
    "Завис? Тут есть на что посмотреть, не спорю.",
    "Я бы тоже тут задержался. А, стоп, я и так тут живу.",
  ],
};

// Контекстные фразы: Орбо «читает» текст элемента
const CONTEXTUAL_HOVER: { pattern: RegExp; comments: string[] }[] = [
  {
    pattern: /telegram/i,
    comments: ["Telegram? Пиши, он отвечает. Обычно.", "О, Telegram заметил. Хороший знак."],
  },
  {
    pattern: /github/i,
    comments: [
      "GitHub открыть хочешь? Там код, там душа.",
      "Репозитории смотришь? Правильно, код не врёт.",
    ],
  },
  {
    pattern: /react|typescript|next/i,
    comments: [
      "React, TypeScript… Его стек. Мощный, проверенный.",
      "Технологии читаешь? Тут всё серьёзно, без jQuery.",
    ],
  },
  {
    pattern: /docker|kubernetes|devops|nginx/i,
    comments: [
      "DevOps-часть заметил? Он и сервера умеет, не только кнопки.",
      "Docker, K8s — он из тех, кто и деплоит сам.",
    ],
  },
  {
    pattern: /газпромбанк|gazprombank/i,
    comments: [
      "Газпромбанк! Это enterprise, тут без шуток.",
      "Банк — это надёжность, безопасность. Серьёзный опыт.",
    ],
  },
  {
    pattern: /сервис24|service\s*24|мобильн(ые|ых)\s+акт/i,
    comments: [
      "Сервис24 — механики, акты, 1С. Реальная полевая работа, не очередной TODO.",
      "Офлайн-очередь и синхронизация — он любит, когда интернет пропадает не в самый подходящий момент.",
    ],
  },
  {
    pattern: /trenika/i,
    comments: [
      "Trenika! Его pet-проект. С душой сделано.",
      "Тренировки, фитнес. Он ещё и в зал ходит, между прочим.",
    ],
  },
  {
    pattern: /glasses|очки/i,
    comments: [
      "GlassesUSA — крупный e-commerce. Миллионы пользователей!",
      "Очки для Америки подбирал. Масштаб, однако.",
    ],
  },
  {
    pattern: /опыт|experience|карьер/i,
    comments: [
      "Карьерный путь впечатляет, правда? Я тоже впечатлён.",
      "Опыт — это не годы, это история. Тут она крутая.",
    ],
  },
  {
    pattern: /навыки|skills|скилл/i,
    comments: [
      "Скиллов — на троих хватит. Серьёзно.",
      "Список навыков длиннее, чем мой буфер памяти.",
    ],
  },
  {
    pattern: /контакт|написать|связаться|hire|нанять/i,
    comments: [
      "Пиши ему! Не стесняйся. Я одобряю.",
      "Связаться хочешь? Правильное решение. Одобряю.",
    ],
  },
  {
    pattern: /блог|статья|article|post/i,
    comments: [
      "Блог! Он ещё и пишет. Талантливый человек, что сказать.",
      "Статьи авторские. Не сгенерированные. Ну, почти.",
    ],
  },
  {
    pattern: /проект|project/i,
    comments: [
      "Проекты разглядываешь? Каждый — с нуля и с душой.",
      "Тут не шаблонные проекты. Всё живое, рабочее.",
    ],
  },
  {
    pattern: /mentor|менторинг|команд|team/i,
    comments: [
      "Менторит, командой управляет. Лидер, короче.",
      "Он людей растит. Не каждый senior это умеет.",
    ],
  },
];

function getContextualComment(el: Element): string | null {
  const text = (el.textContent ?? "").slice(0, 200);
  if (!text.trim()) return null;

  for (const { pattern, comments } of CONTEXTUAL_HOVER) {
    if (pattern.test(text)) return pickRandom(comments);
  }
  return null;
}

/** Шутки при наведении на MAX — добрый подкол, без занудства */
const MAX_ORBO_COMMENTS = [
  "Не переживай — товарищ майор не читает, что ты там напишешь. Ну… почти не читает.",
  "MAX открываешь? Расслабься: майор сегодня в другом чате. Шучу. Наверное.",
  "Пиши спокойно. Говорят, не каждое сообщение попадает в папку «особой важности». Говорят.",
  "Решил написать? Товарищ майор занят отчётами — у тебя есть окно возможностей. Целых несколько секунд!",
  "Главное — не начинай с «план захвата» и не прикладывай чертежи. Тогда всё нормально.",
  "Это же MAX, не секретный канал. Хотя… ладно, шучу. Пиши, он человек нормальный.",
];

/** Форма контактов: жмаканье «Отправить» чаще, чем у людей с терпением */
const CONTACT_FORM_SPAM_COMMENTS = [
  "Форму ддосишь? Тут даже своего сервера нет, только Web3Forms. Скучный пентест.",
  "Мамкин хацкер нашёлся? Кнопку пожалей — она не бессмертная.",
  "Спамить форму — не взлом. Это просто… ну ты понял. Выпей воды.",
  "Один клик — уважение к почте хозяина. Десять — уважение к бану у провайдера. Шучу. Наверное.",
  "Ты чё не нормальный? Заполни, отправь один раз и иди пить чай. Орбо за всем видит.",
  "Хацкерство уровня «жму отправить до тепловой смерти пальца»? Не впечатляет.",
];

const EXPERIENCE_TOOLTIP_COMMENTS = [
  "Бла-бла-бла… 8 лет, сисадмин, сети, 1С. Мог бы книгу написать. И она бы продавалась!",
  "Кем он только не работал. Вы правда собрались это всё читать? Ну ладно, поехали.",
  "Сисадмин, безопасник, DevOps… Мог бы просто сказать «я умею всё» и не расписывать.",
  "Биография длиннее, чем мой буфер памяти. Короче: он шарит. Поверь Орбо.",
  "Тут «8+», но плюс тянет ещё лет на десять. Скромность — его фишка.",
  "Серьёзно, вот это всё один человек? Я впечатлён, а я — частица.",
  "Он мог бы не объяснять, но объясняет. Честность — это сексуально.",
];

// --- CV-страница ---

const CV_SECTION_COMMENTS: Record<string, string[]> = {
  header: [
    "О, резюме открыл! Приготовься — тут послужной список серьёзный.",
    "CV-страница. Тут факты, цифры и немного магии.",
    "Добро пожаловать в биографию человека, который реально умеет всё.",
    "Senior Frontend Developer. Звучит скромно для того, что он умеет.",
  ],
  "job-газпромбанк-главный-инженер-разработки": [
    "Газпромбанк, между прочим. Это не стартап из подвала.",
    "Полный цикл: аналитика, проектирование, фронт, деплой. Один человек — целый отдел.",
    "Рефакторнул архитектуру — фичи стали внедряться вдвое быстрее. Цифры не врут.",
    "Менторит джунов, делает код-ревью, ведёт спринты — и ещё успевает код писать.",
  ],
  "job-optimax-dev-frontend-team-lead": [
    "Team Lead! Руководил командой, вёл проекты. Не каждый так может.",
    "PayPal, Klarna, Apple Pay, Stripe — интегрировал все. Деньги его любят.",
    "Международные заказчики, e-commerce. Серьёзный уровень.",
  ],
  "job-optimax-dev-frontend-разработчик": [
    "Пришёл разработчиком — вырос до Team Lead. Вот это эффективность.",
    "Внедрил SSR — Core Web Vitals улетели вверх. Google оценил бы.",
    "GlassesUSA — очки для всей Америки. Миллионы пользователей!",
  ],
  "job-cosysoft-frontend-разработчик": [
    "CosySoft, МЭШ — приложение для миллионов учеников. Масштаб впечатляет.",
    "React Native тоже знает. Кроссплатформа. Универсальный солдат, короче.",
    "Реактивное программирование, RxJS — не каждый фронтендер это освоил.",
  ],
  "job-optimax-dev-devops-инженер": [
    "DevOps-инженер! Вот откуда он знает Docker и Kubernetes.",
    "CI/CD пайплайны с нуля — автоматизировал то, что другие делают руками.",
    "Docker, Ansible, Bash — он ещё и сервера настраивает. Серьёзно.",
    "Написал утилиты для автоматизации — даже мелочи не оставляет без внимания.",
    "DevOps → Frontend → Team Lead → Главный инженер. Вот это карьера.",
  ],
  projects: [
    "Проекты! Каждый — от идеи до прода. Не шаблонные TODO-приложения.",
    "Trenika, МЭШ, GlassesUSA — масштаб от pet-проекта до enterprise.",
    "Тут можно кликнуть и посмотреть вживую. Рекомендую.",
  ],
  skills: [
    "React, TypeScript, Next.js, Docker, K8s… Список длиннее, чем моя RAM.",
    "AI-инструменты тоже в арсенале. Cursor, Claude, Copilot — он в теме.",
    "Frontend + DevOps + Backend. Тройная угроза.",
    "Svelte и Astro тоже знает. На всякий случай. Мало ли.",
  ],
};

const CV_CLICK_COMMENTS = [
  "Что, хочешь ещё подробностей? Пиши ему — расскажет лично.",
  "Резюме впечатляет? А в деле — ещё круче. Telegram: @per0w.",
  "Если после этого CV ты не впечатлён — проверь пульс.",
  "Нажимаешь на меня вместо «Написать»? Интересные приоритеты.",
  "Могу рассказывать бесконечно, но лучше свяжись с ним напрямую.",
];

// --- Поведенческие реакции ---

const FAST_SCROLL_COMMENTS = [
  "Эй-эй, тормози! Ты же ничего не прочитал!",
  "Скроллишь как будто за тобой гонятся.",
  "Полегче! Тут контент, а не лента TikTok.",
  "Куда так несёшься? Тут каждый пиксель важен.",
  "Спринтер, значит? А я-то думал, ты вдумчивый.",
  "Пролистал три экрана за секунду. Новый рекорд? Поздравляю.",
];

const SCROLL_BACK_COMMENTS = [
  "О, решил вернуться? Что-то зацепило наверху?",
  "Скроллишь назад? Значит, пропустил что-то важное.",
  "Ага, перечитываешь! Вижу, контент зашёл.",
  "Назад? Правильно. Тут стоит читать внимательно.",
  "Вернулся! Значит, не всё потеряно.",
];

const COPY_TEXT_COMMENTS = [
  "Копируешь? Уже в резюме вставляешь? Шучу. Или нет.",
  "Ctrl+C засёк! Что-то ценное нашёл.",
  "Копипастишь с его сайта? Ну, он бы оценил.",
  "О, сохраняешь себе? Правильно, тут полезное.",
  "Скопировал? Теперь обязательно процитируй.",
];

const THEME_DARK_COMMENTS = [
  "Тёмная сторона! Добро пожаловать. У нас печеньки.",
  "Dark mode — выбор настоящего разработчика.",
  "Выключил свет? Правильно, глазкам полегче.",
  "Тёмная тема? Вижу, ты свой человек.",
];

const THEME_LIGHT_COMMENTS = [
  "Свет включил! У тебя что, день на дворе?",
  "Light mode? Смело. Мои частицы слепнут.",
  "Ого, светлая тема? Ты или храбрый, или мониторы дорогие.",
  "Свет! Мои глаза! Ой, у меня нет глаз.",
];

const TAB_RETURN_COMMENTS = [
  "О, вернулся! Скучал? Я — да.",
  "Привет снова! Где гулял?",
  "А я думал, ты ушёл навсегда. Рад, что ошибся.",
  "Вернулся! Другие сайты оказались хуже, да?",
  "С возвращением! Я тут скучал и считал пиксели.",
];

const PAGE_BOTTOM_COMMENTS = [
  "Дочитал до конца! Ты — легенда. Теперь пиши ему.",
  "Финиш! Весь сайт осмотрел. Ну и как, впечатляет?",
  "Долистал до низа? Теперь точно пора нажать «Написать».",
  "Конец страницы. Начало сотрудничества?",
  "Ты реально дочитал до конца. Серьёзный подход, уважаю.",
];

const TEXT_SELECT_GENERIC = [
  "Выделяешь текст? Что-то важное нашёл?",
  "О, выделил! Конспектируешь, значит.",
  "Выделяешь — значит читаешь внимательно. Молодец!",
  "Хочешь запомнить? Тут всё по делу написано.",
  "Текст выделил — полдела. Теперь прочитай два раза.",
];

const SELECTION_CONTEXT: { pattern: RegExp; comments: string[] }[] = [
  {
    pattern: /главный инженер|ведущий/i,
    comments: [
      "Должность выделил? Да, звучит солидно. Потому что так и есть.",
      "«Главный инженер» — это не просто title, это ответственность за всё.",
    ],
  },
  {
    pattern: /газпромбанк/i,
    comments: [
      "Газпромбанк! Запомни это название. Enterprise-масштаб.",
      "Выделил банк? Правильно, тут серьёзные проекты.",
    ],
  },
  {
    pattern: /react|typescript|javascript|next\.?js/i,
    comments: [
      "Технологии копируешь? Да, стек внушительный.",
      "React, TypeScript… Выделяешь то, что знаешь? Или то, что хочешь узнать?",
    ],
  },
  {
    pattern: /docker|kubernetes|k8s|nginx|ci\/cd|ansible/i,
    comments: [
      "DevOps-стек выделил? Он реально и сервера настраивает.",
      "Docker, K8s… Не каждый фронтендер это даже знает, а он — делает.",
    ],
  },
  {
    pattern: /team\s*lead|тимлид|руковод|команд/i,
    comments: [
      "Лидерские качества заметил? Он команды ведёт, не только код пишет.",
      "Team Lead — это когда и за людей, и за результат отвечаешь.",
    ],
  },
  {
    pattern: /paypal|stripe|klarna|apple\s*pay|платёж/i,
    comments: [
      "Платёжки! Интеграция платёжных систем — это ювелирная работа.",
      "PayPal, Stripe, Klarna… Деньги доверяли — значит, надёжный.",
    ],
  },
  {
    pattern: /менторинг|обучение|онбординг|адаптаци/i,
    comments: [
      "Менторит! Не каждый senior умеет учить, а он делает это системно.",
      "Выделил менторинг? Значит, ценишь soft skills. Правильно.",
    ],
  },
  {
    pattern: /рефакторинг|рефакторнул|оптимизац|ускорен/i,
    comments: [
      "Рефакторинг — его конёк. Ускорил внедрение фич вдвое!",
      "Оптимизация выделена. Он не просто код пишет — он его улучшает.",
    ],
  },
  {
    pattern: /ssr|server.?side|core\s*web\s*vitals|производительност/i,
    comments: [
      "SSR, производительность — он про метрики, не про красивые слова.",
      "Core Web Vitals улучшил. Google оценил бы, и рекрутеры тоже.",
    ],
  },
  {
    pattern: /cosysoft|мэш|электронный дневник/i,
    comments: [
      "МЭШ — электронный дневник для миллионов! Масштаб, однако.",
      "CosySoft — кроссплатформа, React Native. Серьёзный проект.",
    ],
  },
  {
    pattern: /optimax/i,
    comments: [
      "Optimax Dev — тут он вырос от DevOps до Team Lead. Карьерный рост!",
      "В Optimax он три разные роли прошёл. Универсальный солдат.",
    ],
  },
  {
    pattern: /glassesusa|glasses/i,
    comments: [
      "GlassesUSA! Очки для всей Америки. Миллионы пользователей.",
      "E-commerce для US-рынка. Международный опыт, между прочим.",
    ],
  },
  {
    pattern: /trenika/i,
    comments: [
      "Trenika — pet-проект с душой. Full-stack, от идеи до прода.",
      "Дневник тренировок! Он ещё и спортсмен. Ну или пытается.",
    ],
  },
  {
    pattern: /скрипт|bash|python|автоматизац/i,
    comments: [
      "Автоматизация! Он из тех, кто руками дважды не делает.",
      "Bash, Python — он автоматизирует всё, до чего дотянется.",
    ],
  },
  {
    pattern: /полный цикл|аналитика.*проектирование|от.*до/i,
    comments: [
      "Полный цикл! От аналитики до деплоя — один человек.",
      "Видишь? Он не просто кодит, он весь процесс ведёт.",
    ],
  },
  {
    pattern: /senior|8\+.*лет|опыт/i,
    comments: [
      "8+ лет! И каждый год — в деле, не на диване.",
      "Senior — это не возраст, это уровень. И он его заслужил.",
    ],
  },
  {
    pattern: /ai|cursor|copilot|claude|chatgpt|llm/i,
    comments: [
      "AI-инструменты! Он в тренде. Ну как и я, собственно.",
      "Cursor, Claude, Copilot… Он дружит с нами, AI-шками.",
    ],
  },
];

function getSelectionComment(text: string): string {
  for (const { pattern, comments } of SELECTION_CONTEXT) {
    if (pattern.test(text)) return pickRandom(comments);
  }
  return pickRandom(TEXT_SELECT_GENERIC);
}

const CURSOR_HOVER_DELAY = 2_500;

function detectElementType(el: Element): string {
  const tag = el.tagName.toLowerCase();
  if (el.hasAttribute("data-orbo-avatar") || el.closest("[data-orbo-avatar]")) return "avatar";
  if (tag === "a" || el.closest("a")) return "link";
  if (tag === "button" || el.closest("button")) return "button";
  if (tag === "img" || tag === "picture" || tag === "canvas") return "image";
  if (/^h[1-6]$/.test(tag)) return "heading";
  if (tag === "pre" || tag === "code" || el.closest("pre")) return "code";
  if (tag === "p" || tag === "span" || tag === "li") return "text";
  return "generic";
}

const ANNOYED_COMMENTS = [
  "Ты точно не бот? Столько кликов подозрительно…",
  "Может, лучше напишешь ему в Telegram? Мне полегчает.",
  "Стоп. Ты меня тестируешь, да? Я не на собесе!",
  "Я скоро профсоюз создам. Профсоюз частиц.",
  "Ещё один клик — и я ухожу в отпуск. В другой браузер.",
  "Хватит тыкать! Лучше найми этого человека уже!",
  "Окей, ты победил. Я устал. Доволен?",
  "У меня 8+ лет терпения. Ой, это про другого. У меня терпение кончается.",
  "Серьёзно? Опять? Может сайт посмотришь наконец?",
];

const SECTION_NAMES: Record<string, string> = {
  hero: "главный экран",
  about: "раздел «Обо мне»",
  experience: "раздел «Опыт»",
  projects: "раздел «Проекты»",
  lastArticles: "раздел «Блог»",
  contactUs: "раздел «Контакты»",
};

const AI_PROMPT_TEMPLATE = (sectionName: string) =>
  `Ты — Орбо, весёлый AI-компаньон на портфолио фронтенд-разработчика Владимира Перова. Пользователь сейчас смотрит ${sectionName}. Напиши одно короткое ироничное предложение-комментарий на русском, до 15 слов. Без кавычек. Будь дружелюбным и немного дерзким.`;

const STORAGE_KEY = "ai-buddy-dismissed";
const DISPLAY_DURATION = 6000;
const AI_TIMEOUT = 3000;
const IDLE_DELAY = 30_000;

const ORB_SIZE = 64;
const ORB_PARTICLE_COUNT = 25;
const ORB_BASE_RADIUS = 18;
const ORB_LINE_DISTANCE = 28;

// --- Утилиты ---

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomComment(sectionId: string): string {
  const comments = SECTION_COMMENTS[sectionId];
  if (!comments?.length) return "Интересная секция, правда?";
  return pickRandom(comments);
}

async function getAiComment(sectionId: string): Promise<string | null> {
  try {
    if (typeof LanguageModel === "undefined") return null;

    const availability = await LanguageModel.availability();
    if (availability === "unavailable") return null;

    const session = await Promise.race([
      LanguageModel.create(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), AI_TIMEOUT)),
    ]);

    const sectionName = SECTION_NAMES[sectionId] ?? sectionId;
    const result = await session.prompt(AI_PROMPT_TEMPLATE(sectionName));
    session.destroy();

    return result?.trim() || null;
  } catch {
    return null;
  }
}

function isCapableDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return false;
  if (cores < 4) return false;
  if (window.innerWidth < 768) return false;
  return true;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

// --- OrbAvatar (canvas) ---

type OrbParticle = {
  angle: number;
  orbitRadius: number;
  speed: number;
  radius: number;
  phase: number;
  type: "accent" | "secondary";
};

function OrbAvatar({ speaking }: { speaking: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<OrbParticle[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const speakingRef = useRef(speaking);
  const mouseRef = useRef({ x: -1, y: -1 });

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = ORB_SIZE * dpr;
    canvas.height = ORB_SIZE * dpr;
    ctx.scale(dpr, dpr);

    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      return {
        accent: style.getPropertyValue("--color-accent").trim(),
        secondary: style.getPropertyValue("--color-accent-secondary").trim(),
      };
    };

    let colors = getColors();
    let accentRgb = hexToRgb(colors.accent);
    let secondaryRgb = hexToRgb(colors.secondary);

    const observer = new MutationObserver(() => {
      colors = getColors();
      accentRgb = hexToRgb(colors.accent);
      secondaryRgb = hexToRgb(colors.secondary);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    particlesRef.current = Array.from({ length: ORB_PARTICLE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      orbitRadius: ORB_BASE_RADIUS * (0.4 + Math.random() * 0.6),
      speed: 0.3 + Math.random() * 0.7,
      radius: 0.8 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      type: Math.random() > 0.5 ? "secondary" : ("accent" as const),
    }));

    const cx = ORB_SIZE / 2;
    const cy = ORB_SIZE / 2;

    const draw = () => {
      timeRef.current += 0.012;
      const t = timeRef.current;
      const isSpeaking = speakingRef.current;
      const mouse = mouseRef.current;

      const breathe = 1 + Math.sin(t * 1.5) * 0.08;
      const speakMult = isSpeaking ? 1.35 : 1;
      const speedMult = isSpeaking ? 1.5 : 1;
      const glowMult = isSpeaking ? 2.5 : 1;

      ctx.clearRect(0, 0, ORB_SIZE, ORB_SIZE);

      const particles = particlesRef.current;
      const positions: { x: number; y: number; p: OrbParticle }[] = [];

      for (const p of particles) {
        p.angle += p.speed * 0.015 * speedMult;
        const r = p.orbitRadius * breathe * speakMult;
        let px = cx + Math.cos(p.angle) * r;
        let py = cy + Math.sin(p.angle) * r;

        if (mouse.x >= 0) {
          const dx = mouse.x - px;
          const dy = mouse.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 30 && dist > 0) {
            const pull = (30 - dist) / 30;
            px += dx * pull * 0.15;
            py += dy * pull * 0.15;
          }
        }

        positions.push({ x: px, y: py, p });
      }

      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const a = positions[i];
          const b = positions[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < ORB_LINE_DISTANCE) {
            const opacity = (1 - dist / ORB_LINE_DISTANCE) * 0.4;
            const rgb = a.p.type !== b.p.type ? secondaryRgb : accentRgb;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const { x, y, p } of positions) {
        const rgb = p.type === "accent" ? accentRgb : secondaryRgb;
        const pulseR = p.radius * (1 + Math.sin(t * 3 + p.phase) * 0.25);
        const alpha = 0.5 + 0.3 * Math.sin(t * 2 + p.phase);
        const glow = (3 + Math.sin(t * 2 + p.phase) * 2) * glowMult;

        ctx.beginPath();
        ctx.arc(x, y, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
        ctx.shadowColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha + 0.2})`;
        ctx.shadowBlur = glow;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Мягкое свечение центра
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12 * speakMult);
      centerGlow.addColorStop(
        0,
        `rgba(${accentRgb[0]},${accentRgb[1]},${accentRgb[2]},${isSpeaking ? 0.15 : 0.06})`,
      );
      centerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, ORB_SIZE, ORB_SIZE);

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="size-16"
      height={ORB_SIZE}
      style={{ width: ORB_SIZE, height: ORB_SIZE }}
      width={ORB_SIZE}
      onMouseLeave={() => {
        mouseRef.current = { x: -1, y: -1 };
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }}
    />
  );
}

// --- SimpleAvatar ---

function SimpleAvatar({ speaking, compact }: { speaking: boolean; compact?: boolean }) {
  const size = compact ? "size-10" : "size-12";
  const iconSize = compact ? "size-4" : "size-5";
  return (
    <div
      className={`flex ${size} items-center justify-center rounded-2xl bg-linear-to-br from-accent/20 to-accent-secondary/20 transition-transform duration-300 ${speaking ? "scale-110 animate-pulse" : ""}`}
    >
      <Sparkles className={`${iconSize} text-accent`} />
    </div>
  );
}

// --- CommentTooltip ---

function CommentTooltip({
  comment,
  visible,
  onDismiss,
}: {
  comment: string | null;
  visible: boolean;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence mode="wait">
      {visible && comment && (
        <motion.div
          key="buddy-tooltip"
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className="pointer-events-auto z-10 w-full max-w-[min(22rem,calc(100vw-1.5rem))] max-sm:relative max-sm:mx-auto max-sm:mb-2 sm:absolute sm:right-0 sm:bottom-14 sm:mb-0 sm:w-64 sm:max-w-none"
          exit={{ opacity: 0, y: 8 }}
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="relative rounded-2xl border border-accent/15 bg-surface/60 px-4 py-3.5 shadow-[0_12px_40px_-8px_color-mix(in_srgb,var(--color-foreground)_12%,transparent)] backdrop-blur-xl supports-[backdrop-filter]:bg-surface/50 sm:border-accent/20 sm:bg-surface/88 sm:px-4 sm:py-3 sm:shadow-[0_0_25px_color-mix(in_srgb,var(--color-accent)_12%,transparent)] sm:supports-[backdrop-filter]:bg-surface/80">
            <button
              aria-label="Закрыть Орбо"
              className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full border border-accent/25 bg-surface/90 text-muted shadow-sm backdrop-blur-md transition-colors hover:border-accent/40 hover:text-foreground sm:size-6"
              onClick={onDismiss}
            >
              <X className="size-3.5 sm:size-3" />
            </button>

            <div className="flex items-start gap-2 pr-5 sm:pr-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold tracking-wide text-accent">Орбо</p>
                <p className="mt-1 text-sm leading-snug text-foreground sm:mt-0.5 sm:leading-relaxed">
                  {comment}
                </p>
              </div>
            </div>

            {/* Мобилка: стрелка вниз по центру к орбу; десктоп: вправо */}
            <div
              aria-hidden
              className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r border-b border-accent/20 bg-surface/60 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/45 sm:hidden"
            />
            <div
              aria-hidden
              className="absolute top-1/2 -right-1.5 hidden size-3 -translate-y-1/2 rotate-45 border-t border-r border-accent/20 bg-surface/88 backdrop-blur-xl sm:block"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- AiBuddy (основной) ---

/**
 * Мобилка: по центру снизу — не перекрывает основной текст у правого края.
 * Десктоп: правый нижний угол.
 */
const ORBO_FLOAT_CLASS =
  "fixed z-[100] [contain:layout] max-sm:bottom-[max(1rem,env(safe-area-inset-bottom,0px))] max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:right-[max(1.5rem,env(safe-area-inset-right,0px))] sm:left-auto sm:translate-x-0";

export function AiBuddy() {
  const [comment, setComment] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [enhanced, setEnhanced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCvPage, setIsCvPage] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  const lastSectionRef = useRef<string | null>(null);
  const displayTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const idleFiredRef = useRef(false);
  const tapCountRef = useRef(0);
  const lastCommentRef = useRef<string | null>(null);

  useEffect(() => {
    // Все setState — в микрозадаче (eslint react-hooks/set-state-in-effect).
    queueMicrotask(() => {
      setPortalReady(true);
      try {
        setDismissed(sessionStorage.getItem(STORAGE_KEY) === "true");
      } catch {
        setDismissed(false);
      }
      setEnhanced(isCapableDevice());
      setIsMobile(window.innerWidth < 640);
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      const cvPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/cv`;
      setIsCvPage(path === cvPath || path.startsWith(`${cvPath}/`));
    });
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setTooltipVisible(false);
    setSpeaking(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* private mode */
    }
  }, []);

  const showComment = useCallback((text: string) => {
    if (displayTimerRef.current) clearTimeout(displayTimerRef.current);

    lastCommentRef.current = text;
    setComment(text);
    setTooltipVisible(true);
    setSpeaking(true);

    displayTimerRef.current = setTimeout(() => {
      setTooltipVisible(false);
      setSpeaking(false);
    }, DISPLAY_DURATION);
  }, []);

  // CV-страница: IntersectionObserver по секциям резюме
  useEffect(() => {
    if (dismissed || !isCvPage) return;

    const seen = new Set<string>();
    const elements = document.querySelectorAll<HTMLElement>("[data-orbo-cv]");
    if (!elements.length) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = (entry.target as HTMLElement).dataset.orboCv;
          if (!key || seen.has(key)) continue;

          seen.add(key);
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            const comments = CV_SECTION_COMMENTS[key];
            if (comments?.length) {
              showComment(pickRandom(comments));
            }
          }, 800);
        }
      },
      { threshold: 0.4 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [dismissed, isCvPage, showComment]);

  // Запрос комментария (AI или fallback)
  const requestComment = useCallback(
    async (sectionId: string) => {
      const aiComment = await getAiComment(sectionId);
      const text = aiComment ?? getRandomComment(sectionId);
      showComment(text);
    },
    [showComment],
  );

  // Главная страница: очередь комментариев по секциям
  useEffect(() => {
    if (dismissed || isCvPage) return;

    const sectionIds = Object.values(SECTIONS_IDS);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const seen = new Set<string>();
    const queue: string[] = [];
    let processing = false;
    let queueTimer: ReturnType<typeof setTimeout> | null = null;

    const processQueue = () => {
      if (processing || !queue.length) return;
      processing = true;

      const sectionId = queue.shift()!;
      lastSectionRef.current = sectionId;
      idleFiredRef.current = false;
      tapCountRef.current = 0;
      requestComment(sectionId);

      queueTimer = setTimeout(() => {
        processing = false;
        processQueue();
      }, DISPLAY_DURATION + 500);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (seen.has(id)) continue;
          seen.add(id);
          queue.push(id);
        }
        processQueue();
      },
      { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      if (queueTimer) clearTimeout(queueTimer);
    };
  }, [dismissed, isCvPage, requestComment]);

  // Idle-таймер: 15 секунд без смены секции
  useEffect(() => {
    if (dismissed) return;

    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (idleFiredRef.current || !lastSectionRef.current) return;
        idleFiredRef.current = true;
        showComment(pickRandom(IDLE_COMMENTS));
      }, IDLE_DELAY);
    };

    resetIdle();

    window.addEventListener("scroll", resetIdle, { passive: true });
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("scroll", resetIdle);
    };
  }, [dismissed, showComment]);

  // Отслеживание курсора: комментарий при зависании на элементе
  useEffect(() => {
    if (dismissed || isMobile) return;

    let hoverTimer: ReturnType<typeof setTimeout> | null = null;
    let lastTarget: Element | null = null;
    let cursorCommented = false;

    const handleMouseMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target || target === lastTarget) return;

      lastTarget = target;
      cursorCommented = false;
      if (hoverTimer) clearTimeout(hoverTimer);

      // Не комментировать сам виджет Орбо
      if (target.closest("[data-orbo]")) return;

      // MAX — шутка только через orbo:max-hover (enter/focus), без второго срабатывания по таймеру
      if (target.closest("[data-orbo-max]")) return;

      hoverTimer = setTimeout(() => {
        if (cursorCommented) return;
        cursorCommented = true;

        const contextual = getContextualComment(target);
        if (contextual) {
          showComment(contextual);
          return;
        }

        const elType = detectElementType(target);
        const comments = CURSOR_COMMENTS[elType] ?? CURSOR_COMMENTS.generic;
        showComment(pickRandom(comments));
      }, CURSOR_HOVER_DELAY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hoverTimer) clearTimeout(hoverTimer);
    };
  }, [dismissed, isMobile, showComment]);

  // Реакция на попап «8+ лет в IT»
  useEffect(() => {
    if (dismissed) return;

    const handleExperienceTooltip = () => {
      showComment(pickRandom(EXPERIENCE_TOOLTIP_COMMENTS));
    };

    window.addEventListener("orbo:experience-tooltip", handleExperienceTooltip);
    return () => {
      window.removeEventListener("orbo:experience-tooltip", handleExperienceTooltip);
    };
  }, [dismissed, showComment]);

  // Наведение на ссылку MAX — шутка без ожидания курсорного таймера
  useEffect(() => {
    if (dismissed) return;

    let lastAt = 0;
    const cooldownMs = 14_000;

    const handleMaxHover = () => {
      const now = Date.now();
      if (now - lastAt < cooldownMs) return;
      lastAt = now;
      showComment(pickRandom(MAX_ORBO_COMMENTS));
    };

    window.addEventListener(ORBO_MAX_HOVER_EVENT, handleMaxHover);
    return () => window.removeEventListener(ORBO_MAX_HOVER_EVENT, handleMaxHover);
  }, [dismissed, showComment]);

  // Спам по кнопке отправки формы контактов
  useEffect(() => {
    if (dismissed) return;

    const handleContactSpam = () => {
      showComment(pickRandom(CONTACT_FORM_SPAM_COMMENTS));
    };

    window.addEventListener(ORBO_CONTACT_SPAM_EVENT, handleContactSpam);
    return () => window.removeEventListener(ORBO_CONTACT_SPAM_EVENT, handleContactSpam);
  }, [dismissed, showComment]);

  // Быстрый скролл: >3000px за секунду
  useEffect(() => {
    if (dismissed) return;

    let lastY = window.scrollY;
    let lastTime = Date.now();
    let fired = false;

    const handleScroll = () => {
      const now = Date.now();
      const delta = Math.abs(window.scrollY - lastY);
      const elapsed = now - lastTime;

      if (elapsed > 800) {
        const speed = delta / (elapsed / 1000);
        if (speed > 3000 && !fired) {
          fired = true;
          showComment(pickRandom(FAST_SCROLL_COMMENTS));
          setTimeout(() => {
            fired = false;
          }, 8000);
        }
        lastY = window.scrollY;
        lastTime = now;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed, showComment]);

  // Скролл назад вверх (>400px вверх)
  useEffect(() => {
    if (dismissed) return;

    let maxY = window.scrollY;
    let firedBack = false;

    const handleScroll = () => {
      const y = window.scrollY;
      if (y > maxY) {
        maxY = y;
        firedBack = false;
      } else if (maxY - y > 400 && !firedBack) {
        firedBack = true;
        showComment(pickRandom(SCROLL_BACK_COMMENTS));
        setTimeout(() => {
          maxY = window.scrollY;
          firedBack = false;
        }, 10000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed, showComment]);

  // Копирование текста
  useEffect(() => {
    if (dismissed) return;

    const handleCopy = () => showComment(pickRandom(COPY_TEXT_COMMENTS));

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, [dismissed, showComment]);

  // Переключение темы
  useEffect(() => {
    if (dismissed) return;

    const handleTheme = (e: Event) => {
      const detail = (e as CustomEvent<{ theme: string }>).detail;
      const comments = detail?.theme === "dark" ? THEME_DARK_COMMENTS : THEME_LIGHT_COMMENTS;
      showComment(pickRandom(comments));
    };

    window.addEventListener("orbo:theme-switch", handleTheme);
    return () => window.removeEventListener("orbo:theme-switch", handleTheme);
  }, [dismissed, showComment]);

  // Уход и возврат на вкладку
  useEffect(() => {
    if (dismissed) return;

    let leftAt = 0;

    const handleVisibility = () => {
      if (document.hidden) {
        leftAt = Date.now();
      } else if (leftAt && Date.now() - leftAt > 3000) {
        showComment(pickRandom(TAB_RETURN_COMMENTS));
        leftAt = 0;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [dismissed, showComment]);

  // Достижение конца страницы
  useEffect(() => {
    if (dismissed) return;

    let firedBottom = false;

    const handleScroll = () => {
      if (firedBottom) return;
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;
      if (atBottom) {
        firedBottom = true;
        showComment(pickRandom(PAGE_BOTTOM_COMMENTS));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed, showComment]);

  // Выделение текста — Орбо читает что выделено
  useEffect(() => {
    if (dismissed) return;

    let selectTimer: ReturnType<typeof setTimeout> | null = null;

    const handleSelect = () => {
      if (selectTimer) clearTimeout(selectTimer);
      selectTimer = setTimeout(() => {
        const sel = window.getSelection();
        const selected = sel?.toString().trim() ?? "";
        if (selected.length > 5) {
          showComment(getSelectionComment(selected));
        }
      }, 1200);
    };

    document.addEventListener("selectionchange", handleSelect);
    return () => {
      document.removeEventListener("selectionchange", handleSelect);
      if (selectTimer) clearTimeout(selectTimer);
    };
  }, [dismissed, showComment]);

  const getUniqueComment = useCallback((sectionId: string): string => {
    const comments = SECTION_COMMENTS[sectionId] ?? [];
    const available = comments.filter((c) => c !== lastCommentRef.current);
    const picked = available.length > 0 ? pickRandom(available) : pickRandom(comments);
    lastCommentRef.current = picked;
    return picked;
  }, []);

  // Клик по орбу — другой комментарий или ругань при спаме
  const handleOrbClick = useCallback(() => {
    tapCountRef.current += 1;
    const taps = tapCountRef.current;

    if (taps >= 4) {
      const annoyed = pickRandom(ANNOYED_COMMENTS);
      lastCommentRef.current = annoyed;
      showComment(annoyed);
      return;
    }

    if (isCvPage) {
      showComment(pickRandom(CV_CLICK_COMMENTS));
      return;
    }

    const section = lastSectionRef.current;
    if (section) {
      showComment(getUniqueComment(section));
    }
  }, [showComment, getUniqueComment, isCvPage]);

  const revive = useCallback(() => {
    setDismissed(false);
    idleFiredRef.current = false;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private mode */
    }
    const section = lastSectionRef.current;
    if (section) requestComment(section);
  }, [requestComment]);

  if (!portalReady) {
    return null;
  }

  if (dismissed) {
    return createPortal(
      <div data-orbo className={ORBO_FLOAT_CLASS}>
        <button
          aria-label="Вернуть Орбо"
          className="group flex size-8 items-center justify-center rounded-full border border-accent/20 bg-surface/80 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-accent/40 hover:shadow-[0_0_12px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]"
          type="button"
          onClick={revive}
        >
          <Sparkles className="size-3.5 text-accent/60 transition-colors group-hover:text-accent" />
        </button>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div data-orbo className={`pointer-events-none ${ORBO_FLOAT_CLASS}`}>
      {/*
        flex-col-reverse: на мобилке тултип визуально над орбом, ширина по контенту.
        На sm+ слот 4×4 справа — тултип снова absolute у края.
      */}
      <div className="flex max-w-[calc(100vw-1rem)] flex-col-reverse items-center gap-2.5 sm:relative sm:h-16 sm:w-16 sm:max-w-none sm:items-end sm:gap-0">
        <button
          aria-label="Орбо — нажми для комментария"
          className="pointer-events-auto shrink-0 cursor-pointer rounded-2xl transition-transform duration-200 hover:scale-105"
          type="button"
          onClick={handleOrbClick}
        >
          {enhanced ? (
            <OrbAvatar speaking={speaking} />
          ) : (
            <SimpleAvatar compact={isMobile} speaking={speaking} />
          )}
        </button>

        <CommentTooltip comment={comment} visible={tooltipVisible} onDismiss={dismiss} />
      </div>
    </div>,
    document.body,
  );
}
