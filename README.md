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
pnpm dev
```

Открыть [http://localhost:3000](http://localhost:3000)

## Скрипты

| Команда             | Описание                                  |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Dev-сервер с Turbopack                    |
| `pnpm build`        | Production build (static export → `out/`) |
| `pnpm lint`         | ESLint проверка                           |
| `pnpm lint:fix`     | ESLint с автоисправлением                 |
| `pnpm format`       | Prettier форматирование                   |
| `pnpm format:check` | Проверка форматирования                   |

## Деплой

### GitHub Pages (резервный)

Push в `main` → GitHub Actions → static export → GitHub Pages.

### VPS (основной)

Push в `main` → GitHub Actions → Docker build → GHCR → SSH deploy на VPS.

#### 1. Настройка GitHub Secrets

В репозитории: **Settings → Secrets and variables → Actions → New repository secret**

| Secret             | Значение                                                     |
| ------------------ | ------------------------------------------------------------ |
| `SSH_PRIVATE_KEY`  | Содержимое приватного SSH-ключа для подключения к VPS         |

`GITHUB_TOKEN` создаётся автоматически — отдельно добавлять не нужно.

#### 2. Генерация SSH-ключа (если нет)

```bash
# На локальной машине
ssh-keygen -t ed25519 -C "deploy@per0w.space" -f ~/.ssh/per0w_deploy

# Скопировать публичный ключ на VPS
ssh-copy-id -i ~/.ssh/per0w_deploy.pub -p 2222 root@212.192.0.241

# Содержимое приватного ключа → в GitHub Secret SSH_PRIVATE_KEY
cat ~/.ssh/per0w_deploy
```

#### 3. Подготовка VPS (первый раз)

```bash
# Подключиться к VPS
ssh -p 2222 root@212.192.0.241

# Создать директорию проекта
mkdir -p /opt/per0w-space
cd /opt/per0w-space

# Создать docker-compose.yml (или скопировать из репозитория)
cat > docker-compose.yml << 'EOF'
services:
  app:
    image: ghcr.io/per0w/blog:latest
    ports:
      - "80:80"
    restart: always
EOF

# Авторизоваться в GitHub Container Registry
# (нужен Personal Access Token с правом read:packages)
docker login ghcr.io -u per0w

# Запустить
docker compose up -d
```

#### 4. Настройка DNS

Направить домен `per0w.space` на IP VPS:

| Тип   | Имя           | Значение         |
| ----- | ------------- | ---------------- |
| A     | @             | 212.192.0.241    |
| A     | www           | 212.192.0.241    |

#### 5. SSL (опционально)

Если не используется Cloudflare Proxy, настроить Let's Encrypt на VPS:

```bash
apt install certbot
certbot certonly --standalone -d per0w.space -d www.per0w.space
```

Затем обновить nginx.conf для HTTPS и пробросить порт 443 в docker-compose.

#### 6. Проверка

После первого push в `main`:

```bash
# На VPS — проверить что контейнер работает
docker compose ps
docker compose logs

# Проверить сайт
curl -I http://per0w.space
```

#### Откат

```bash
# Откатиться на предыдущую версию образа
docker compose down
docker pull ghcr.io/per0w/blog:previous-tag
docker compose up -d
```

## Структура

```
src/
  app/                 # App Router: страницы, layout, SEO
    blog/              # Блог: список, посты, утилиты
      posts/*.mdx      # MDX-файлы постов
  components/          # Секции страниц (Hero, About, Skills, ...)
  ui/                  # UI-компоненты (Card, Section, Tags, Icons)
  constants/           # Константы
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
