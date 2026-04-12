#!/usr/bin/env bash
# =============================================================================
# Деплой per0w.space на VPS
#
# Запускать из /opt/per0w-space от пользователя deploy:
#   ./deploy/deploy.sh              — полный деплой (git pull + build + up)
#   ./deploy/deploy.sh --build-only — только сборка без перезапуска
#   ./deploy/deploy.sh --no-build   — только перезапуск (если образы готовы)
#
# GitHub Actions запускает этот скрипт через SSH после прохождения CI.
# =============================================================================

set -euo pipefail

APP_DIR="/opt/per0w-space"
ENV_FILE="$APP_DIR/.env.production"
COMPOSE_FILE="$APP_DIR/docker-compose.prod.yml"
LOCK_FILE="/tmp/perow-deploy.lock"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()   { echo -e "${GREEN}[deploy]${NC} $1"; }
warn()  { echo -e "${YELLOW}[deploy]${NC} $1"; }
error() { echo -e "${RED}[deploy]${NC} $1"; }

# ── Блокировка параллельных деплоев ───────────────────────────────────
exec 200>"$LOCK_FILE"
if ! flock -n 200; then
  error "Другой деплой уже выполняется. Ждём завершения (до 5 мин)..."
  flock -w 300 200 || { error "Таймаут ожидания блокировки"; exit 1; }
fi

cd "$APP_DIR"

# ── Проверка .env ────────────────────────────────────────────────────
if [ ! -f "$ENV_FILE" ]; then
  error ".env.production не найден!"
  echo "  cp .env.production.example .env.production"
  echo "  vim .env.production  # заполнить секреты"
  exit 1
fi

BUILD=true
RESTART=true

case "${1:-}" in
  --build-only) RESTART=false ;;
  --no-build)   BUILD=false ;;
esac

# ── Git pull ─────────────────────────────────────────────────────────
log "Обновление кода..."
git fetch origin
git reset --hard origin/$(git rev-parse --abbrev-ref HEAD)
log "Версия: $(git log -1 --format='%h %s')"

# ── Сборка образов ───────────────────────────────────────────────────
if [ "$BUILD" = true ]; then
  log "Сборка Docker-образов..."
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --parallel

  # Очистка старых образов после сборки
  docker image prune -f > /dev/null 2>&1 || true
fi

# ── Запуск / перезапуск ──────────────────────────────────────────────
if [ "$RESTART" = true ]; then
  log "Запуск сервисов..."
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d

  # ── Ждём пока blog поднимется ──────────────────────────────────
  log "Ожидание запуска blog..."
  sleep 3

  for i in 1 2 3 4 5; do
    if docker ps --filter name=perow-blog --filter status=running -q | grep -q .; then
      log "Blog: ОК"
      break
    fi
    if [ "$i" -eq 5 ]; then
      error "Blog контейнер не запущен! Проверьте логи: docker logs perow-blog"
      exit 1
    fi
    sleep 2
  done

  if docker ps --filter name=perow-traefik --filter status=running -q | grep -q .; then
    log "Traefik: ОК"
  else
    error "Traefik контейнер не запущен!"
    exit 1
  fi
fi

echo ""
log "=== Деплой завершён ==="
log "Ресурсы:"
docker stats --no-stream --format "  {{.Name}}: {{.MemUsage}} / CPU {{.CPUPerc}}" \
  perow-traefik perow-blog 2>/dev/null || true
