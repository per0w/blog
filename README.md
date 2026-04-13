# per0w.space — Персональный сайт + Блог

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![MDX](https://img.shields.io/badge/MDX-FCB32C?style=for-the-badge&logo=mdx&logoColor=black)](https://mdxjs.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![ESLint](https://img.shields.io/badge/ESLint_9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)

Сайт-визитка с портфолио и MDX-блогом. Построен на современном стеке с фокусом на производительность и красивый дизайн.

## Стек

- **Next.js 16** — App Router, static export, Turbopack
- **React 19** — серверные компоненты по умолчанию
- **TypeScript** — strict mode
- **Tailwind CSS 4** — CSS-first конфигурация, `@theme`
- **Framer Motion** — анимации появления, hover-эффекты
- **MDX** — блог с подсветкой синтаксиса (sugar-high)
- **Geist** — шрифт (sans + mono)
- **ESLint 9** — flat config
- **Prettier** — автоформатирование + сортировка Tailwind-классов

## Быстрый старт

```bash
pnpm install
pnpm dev        # или: make dev
```

Открыть [http://localhost:3000](http://localhost:3000)

## Команды

Все команды доступны через `make`:

```bash
make help       # Показать список команд
```

| Команда             | Описание                                  |
| ------------------- | ----------------------------------------- |
| `make dev`          | Dev-сервер с Turbopack                    |
| `make build`        | Production build (static export → `out/`) |
| `make lint`         | ESLint проверка                           |
| `make format`       | Prettier форматирование                   |
| `make docker-build` | Собрать Docker-образ локально             |
| `make docker-up`    | Запустить production локально             |
| `make clean`        | Удалить build-артефакты                   |

## Развёртывание

Два варианта деплоя — оба работают параллельно.

### Маршрутизация (VPS)

| Домен         | Сервис         | Контейнер    |
| ------------- | -------------- | ------------ |
| `per0w.space` | Блог (статика) | `perow-blog` |

SSL-сертификаты — автоматически через **Traefik + Let's Encrypt**.

### VPS (основной) — Docker + Traefik

Push в `main` → GitHub Actions → SSH → `deploy.sh` → git pull → Docker build → up → healthcheck.

#### 1. Первичная настройка VPS

```bash
# Скопировать и запустить скрипт настройки (от root)
scp deploy/setup-vps.sh root@<VPS_IP>:~
ssh root@<VPS_IP> bash setup-vps.sh
```

Скрипт установит Docker, создаст пользователя `deploy`, настроит firewall и swap.

#### 2. Деплой (первый раз)

```bash
# Войти как deploy
ssh deploy@<VPS_IP>

# Склонировать репозиторий
cd /opt/per0w-space
git clone https://github.com/per0w/blog.git .

# Создать и заполнить .env
cp .env.production.example .env.production
vim .env.production  # DOMAIN и ACME_EMAIL

# Запустить
./deploy/deploy.sh
```

#### 3. GitHub Secrets

В репозитории: **Settings → Secrets → Actions**

| Secret         | Значение                                 |
| -------------- | ---------------------------------------- |
| `VPS_HOST`     | IP-адрес VPS                             |
| `VPS_SSH_KEY`  | Приватный SSH-ключ пользователя `deploy` |
| `VPS_SSH_PORT` | SSH-порт (по умолчанию 22)               |

#### 4. DNS

| Тип | Имя | Значение   |
| --- | --- | ---------- |
| A   | @   | `<VPS_IP>` |
| A   | www | `<VPS_IP>` |

#### 5. Ручной деплой

```bash
ssh deploy@<VPS_IP>
cd /opt/per0w-space
./deploy/deploy.sh              # полный деплой
./deploy/deploy.sh --no-build   # только перезапуск
./deploy/deploy.sh --build-only # только сборка
```

### GitHub Pages (резервный)

Push в `main` → GitHub Actions → static export (с `basePath: /blog`) → GitHub Pages.

Доступен по адресу: `https://per0w.github.io/blog/`

Работает автоматически — отдельной настройки не требует. Переменная `GITHUB_PAGES=true` в workflow автоматически добавляет `basePath` и `assetPrefix`.

<a id="github-pages-api-secrets"></a>

#### Секреты API для сборки на GitHub Pages

Ключи для формы и OpenRouter **не** вводятся в **Settings → Pages** (там только кастомный домен и источник публикации). Они задаются как **секреты GitHub Actions**: workflow [.github/workflows/nextjs.yml](.github/workflows/nextjs.yml) на шаге `pnpm build` подставляет их в `env` и они попадают в клиентский бандл (`NEXT_PUBLIC_*`).

**Куда нажимать в GitHub**

1. Откройте репозиторий, например `https://github.com/per0w/blog`.
2. Вкладка **Settings** (настройки репозитория, не профиля GitHub).
3. В левом меню: **Secrets and variables** → **Actions**.
4. Блок **Repository secrets** → кнопка **New repository secret**  
   (не путать с **Environment secrets**, если вы сами не создавали environments для Actions).
5. **Name:** имя переменной **строго** как в таблице ниже — латиница, регистр и подчёркивания важны.  
   **Secret:** значение **одной строкой**, без кавычек вокруг и без пробелов в начале/конце.
6. **Add secret**. Повторите для каждого нужного ключа.

**Таблица имён для этого проекта**

| Name                               | Обязательность | Зачем                                                                   |
| ---------------------------------- | -------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Для формы      | Access Key с [web3forms.com](https://web3forms.com)                     |
| `NEXT_PUBLIC_OPENROUTER_API_KEY`   | Опционально    | Ключ [OpenRouter](https://openrouter.ai) — AI в форме и Орбо на главной |
| `NEXT_PUBLIC_OPENROUTER_MODEL`     | Опционально    | Id модели; если не задать — используется значение по умолчанию в коде   |

**Когда подхватятся изменения:** секреты читаются **в момент сборки**. После добавления или смены секрета нужен новый запуск workflow: вкладка **Actions** → **Deploy to GitHub Pages** → откройте последний успешный или неуспешный запуск → **Re-run all jobs**, либо сделайте любой commit и `push` в ветку, на которую повешен workflow (здесь — `main`).

**Важно:** секреты в **Settings → Secrets and variables → Dependabot** или **Codespaces** к этой сборке **не относятся** — для Pages нужен именно раздел **Actions**.

#### Почта с формы «Связаться» на GitHub Pages (Web3Forms)

Сайт статический — своего API нет. Письма уходят через [Web3Forms](https://web3forms.com): их сервер принимает POST и пересылает на ваш email.

1. Зарегистрируйтесь на [web3forms.com](https://web3forms.com), создайте форму и в панели укажите **email получателя** (тот же, куда хотите получать обращения с сайта).
2. Скопируйте **Access Key** (публичный идентификатор формы, не пароль от почты).
3. В GitHub добавьте секрет **`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`** с этим значением (пошаговый путь — раздел [Секреты API для сборки на GitHub Pages](#github-pages-api-secrets) выше).
4. Запустите новую сборку (push в `main` или **Re-run** в Actions) — workflow подставит секрет при `pnpm build`, ключ попадёт в клиентский бандл (так устроен static export; для Web3Forms это нормально).
5. Откройте сайт на GitHub Pages и отправьте тестовое сообщение с блока контактов.

Локально создайте `.env.local`:

```bash
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=ваш_ключ_из_web3forms
```

##### Какой домен указывать в Web3Forms

В кабинете Web3Forms, если запрашивают **сайт / домен / URL формы**, укажите **канонический адрес страницы, с которой пользователь реально отправляет форму** (со схемой `https://`):

| Где крутится сайт                        | Что писать                                                                          |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| Основной домен (VPS и т.д.)              | `https://per0w.space` (или тот поддомен/путь, где форма)                            |
| Только GitHub Pages (`*.github.io`)      | `https://<user>.github.io/blog/` — с учётом `basePath` (`/blog` в этом репозитории) |
| GitHub Pages + **свой домен** (см. ниже) | `https://ваш-домен.ru` (тот же хост, что в браузере после настройки DNS)            |

Цель — чтобы адрес совпадал с реальным источником запросов: так проще отличать легитимные отправки от мусора, и вы не путаетесь в настройках.

#### Свой домен на GitHub Pages (DNS → GitHub, сайт остаётся на Pages)

Нужно, чтобы по вашему имени (например `portfolio.example.com` или `example.com`) открывался тот же статический сайт, что собирает Actions в этот репозиторий.

1. **В репозитории GitHub:** **Settings** → **Pages** → **Build and deployment** → в поле **Custom domain** введите ваш домен (например `www.example.com` или `blog.example.com`) → **Save**. GitHub проверит DNS и при успехе предложит включить **Enforce HTTPS** (включите, когда появится).
2. **Файл `CNAME` в статике (рекомендуется для этого проекта):** в каталоге `public/` создайте файл `CNAME` **одной строкой** — ровно тот hostname, который указали в настройках (без `https://`), например:
   ```text
   www.example.com
   ```
   При `pnpm build` он попадёт в `out/CNAME`, и каждый деплой на Pages не «забудет» домен.
3. **DNS у регистратора домена** (замените `YOURUSER` на ваш логин GitHub, для проектного сайта — как в URL `YOURUSER.github.io/blog`):

   **Вариант A — поддомен** (`www`, `blog`, …):

   | Тип     | Имя / хост         | Значение             |
   | ------- | ------------------ | -------------------- |
   | `CNAME` | `www` (или `blog`) | `YOURUSER.github.io` |

   **Вариант B — корень зоны** (`example.com` без префикса, «apex»):

   | Тип | Имя / хост | Значение          |
   | --- | ---------- | ----------------- |
   | `A` | `@`        | `185.199.108.153` |
   | `A` | `@`        | `185.199.109.153` |
   | `A` | `@`        | `185.199.110.153` |
   | `A` | `@`        | `185.199.111.153` |

   Актуальный список IP для apex лучше сверить с [официальной документацией GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) (иногда обновляют).

4. Подождите распространения DNS (от минут до 24–48 ч), снова откройте **Settings → Pages** — статус должен стать зелёным. Откройте сайт по своему домену: должен открываться тот же контент, что и на `https://YOURUSER.github.io/blog/`.

Учтите: в этом репозитории для Pages включён **`basePath: /blog`**. Кастомный домен обычно вешают на **корень** сайта Pages для данного репозитория — пользователь заходит на `https://ваш-домен/` и видит приложение с префиксом `/blog` в путях внутри Next — проверьте в проде ссылки и `next.config` при смене стратегии (корень домена vs подпуть).

#### Кнопка «AI» в форме: OpenRouter (бесплатные модели)

Вместо отдельного API Google используется [OpenRouter](https://openrouter.ai/) — единая точка доступа к разным моделям; часть моделей помечена как **бесплатные** (в каталоге ищите суффикс **`:free`** или фильтр по цене $0).

**Почему так:** запрос идёт из браузера (static export), поэтому ключ всё равно окажется в клиентском JS (`NEXT_PUBLIC_*`). Относитесь к нему как к «публичному с ограничениями»: в OpenRouter задайте лимиты и по возможности ограничения по использованию.

**Пошагово:**

1. Зайдите на [openrouter.ai](https://openrouter.ai/), зарегистрируйтесь (можно через GitHub).
2. **Keys** → создайте API-ключ, при желании ограничьте расход кредитов / включите алерты.
3. Откройте [Models](https://openrouter.ai/models), найдите модель с пометкой **Free** (например `meta-llama/llama-3.2-3b-instruct:free`). Если модель недоступна или снята, выберите другую `:free` и пропишите её id в секрете модели ниже.
4. В GitHub создайте секреты **`NEXT_PUBLIC_OPENROUTER_API_KEY`** (обязательно для AI) и при необходимости **`NEXT_PUBLIC_OPENROUTER_MODEL`** — см. [Секреты API для сборки на GitHub Pages](#github-pages-api-secrets).
5. Пересоберите сайт (push в `main` или **Re-run** workflow в Actions).

**Орбо** на главной использует **тот же** `NEXT_PUBLIC_OPENROUTER_API_KEY` и модель: при входе секции в зону видимости сначала идёт запрос в OpenRouter; если ключа нет или ответ не пришёл — пробуется встроенный **Chrome Prompt API** (если доступен), иначе остаются готовые текстовые реплики.

Локально в `.env.local`:

```bash
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-...
# необязательно:
# NEXT_PUBLIC_OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

**Если запрос из браузера блокируется (CORS / политика ключа):** варианты — другая модель/план на OpenRouter, либо вынести вызов на свой небольшой backend / serverless и хранить ключ только на сервере (для статического репозитория это отдельная доработка).

**Docker / VPS:** задайте `NEXT_PUBLIC_OPENROUTER_API_KEY` и при необходимости `NEXT_PUBLIC_OPENROUTER_MODEL` в `.env.production` — они передаются как build-args в [Dockerfile](Dockerfile).

## Структура

```
src/
  app/                 # App Router: страницы, layout, SEO
    blog/              # Блог: список, посты, утилиты
      posts/*.mdx      # MDX-файлы постов
    cv/                # Страница резюме
  components/          # Секции страниц (Hero, About, Skills, ...)
    ai-buddy/          # Орбо — интерактивный AI-компаньон
  ui/                  # UI-компоненты (Card, Section, Tags, Icons)
  hooks/               # Кастомные хуки
  constants/           # Константы
  types/               # TypeScript-декларации
deploy/
  deploy.sh            # Скрипт деплоя на VPS
  setup-vps.sh         # Первичная настройка VPS
```

## Блог

Посты — MDX-файлы в `src/app/blog/posts/`. Frontmatter:

```yaml
---
title: "Заголовок"
publishedAt: "2025-01-15"
description: "Описание"
tags: "react, typescript"
---
```
