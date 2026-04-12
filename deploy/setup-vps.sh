#!/usr/bin/env bash
# =============================================================================
# Первичная настройка VPS для per0w.space
#
# Запускать от root один раз:
#   scp deploy/setup-vps.sh root@IP:~ && ssh root@IP bash setup-vps.sh
# =============================================================================

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }

DEPLOY_USER="deploy"
APP_DIR="/opt/per0w-space"

# ── 1. Системные пакеты ──────────────────────────────────────────────
log "Обновление системы..."
apt-get update -qq && apt-get upgrade -y -qq

log "Установка необходимых пакетов..."
apt-get install -y -qq curl git ufw fail2ban

# ── 2. Docker ─────────────────────────────────────────────────────────
if ! command -v docker &> /dev/null; then
  log "Установка Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
else
  log "Docker уже установлен"
fi

# ── 3. Пользователь deploy ───────────────────────────────────────────
if ! id "$DEPLOY_USER" &> /dev/null; then
  log "Создание пользователя $DEPLOY_USER..."
  useradd -m -s /bin/bash -G docker "$DEPLOY_USER"
  mkdir -p /home/$DEPLOY_USER/.ssh
  cp /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/ 2>/dev/null || true
  chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
  chmod 700 /home/$DEPLOY_USER/.ssh
  chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys 2>/dev/null || true
else
  log "Пользователь $DEPLOY_USER уже существует"
  usermod -aG docker "$DEPLOY_USER" 2>/dev/null || true
fi

# ── 4. Директория приложения ──────────────────────────────────────────
log "Подготовка $APP_DIR..."
mkdir -p "$APP_DIR"
chown $DEPLOY_USER:$DEPLOY_USER "$APP_DIR"

# ── 5. Firewall ──────────────────────────────────────────────────────
log "Настройка firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# ── 6. Swap (подстраховка при сборке образов) ─────────────────────────
if [ ! -f /swapfile ]; then
  log "Создание swap 1 GB..."
  fallocate -l 1G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
else
  log "Swap уже настроен"
fi

# ── 7. Fail2ban ──────────────────────────────────────────────────────
systemctl enable --now fail2ban

echo ""
log "=== Настройка завершена ==="
echo ""
echo "  Следующие шаги:"
echo "  1. Войти как deploy:    ssh deploy@$(hostname -I | awk '{print $1}')"
echo "  2. Склонировать репо:   cd $APP_DIR && git clone https://github.com/per0w/blog.git ."
echo "  3. Создать .env:        cp .env.production.example .env.production"
echo "  4. Заполнить .env.production (домен, email для SSL)"
echo "  5. Запустить:           ./deploy/deploy.sh"
echo ""
warn "Не забудьте настроить DNS: A-запись per0w.space → $(hostname -I | awk '{print $1}')"
