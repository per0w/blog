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

#### Почта с формы «Связаться» на GitHub Pages (Web3Forms)

Сайт статический — своего API нет. Письма уходят через [Web3Forms](https://web3forms.com): их сервер принимает POST и пересылает на ваш email.

1. Зарегистрируйтесь на [web3forms.com](https://web3forms.com), создайте форму и в панели укажите **email получателя** (тот же, куда хотите получать обращения с сайта).
2. Скопируйте **Access Key** (публичный идентификатор формы, не пароль от почты).
3. В GitHub: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - имя: `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`;
   - значение: ключ из кабинета Web3Forms.
4. Запушьте в `main` — workflow [.github/workflows/nextjs.yml](.github/workflows/nextjs.yml) подставит секрет при `pnpm build`, ключ попадёт в клиентский бандл (так устроен static export; для Web3Forms это ожидаемо).
5. Откройте сайт на GitHub Pages и отправьте тестовое сообщение с блока контактов.

Локально создайте `.env.local`:

```bash
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=ваш_ключ_из_web3forms
```

**Опционально — кнопка «AI» в форме (Google Gemini, бесплатный лимит в AI Studio):**

- Создайте ключ в [Google AI Studio](https://aistudio.google.com/).
- Добавьте secret `NEXT_PUBLIC_GEMINI_API_KEY` в GitHub Actions (или строку в `.env.local`).
- **Важно:** любой `NEXT_PUBLIC_*` виден в скачанном JS. В настройках ключа Google задайте ограничения по **HTTP referrer** (домен GitHub Pages и при необходимости `http://localhost:3000`).
- Без переменной кнопка «AI» не показывается.

**Основной сайт (Docker / VPS):** задайте те же переменные в `.env.production` рядом с `docker-compose.prod.yml` — они передаются как build-args в [Dockerfile](Dockerfile) при сборке образа.

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
