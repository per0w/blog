# ── Stage 1: зависимости ──────────────────────────────────────────
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── Stage 2: сборка ──────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Публичные ключи (этап сборки на VPS / CI — см. .env.production.example).
ARG NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
ENV NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=$NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
ARG NEXT_PUBLIC_OPENROUTER_API_KEY
ENV NEXT_PUBLIC_OPENROUTER_API_KEY=$NEXT_PUBLIC_OPENROUTER_API_KEY
ARG NEXT_PUBLIC_OPENROUTER_MODEL
ENV NEXT_PUBLIC_OPENROUTER_MODEL=$NEXT_PUBLIC_OPENROUTER_MODEL

RUN pnpm build

# ── Stage 3: production (nginx) ──────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
