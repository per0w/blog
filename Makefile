# =============================================================================
# per0w.space — задачи разработки
# Использование: make <команда>
# Подсказка:     make help
# =============================================================================

.DEFAULT_GOAL := help
.PHONY: help dev build lint lint-fix format format-check clean install

BOLD   := $(shell tput bold 2>/dev/null || true)
GREEN  := $(shell tput setaf 2 2>/dev/null || true)
YELLOW := $(shell tput setaf 3 2>/dev/null || true)
RESET  := $(shell tput sgr0 2>/dev/null || true)

# =============================================================================
# Справка
# =============================================================================
help: ## Показать список команд
	@echo ""
	@echo "$(BOLD)per0w.space — команды разработки$(RESET)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_%-]+:.*?##/ { \
		printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2 \
	}' $(MAKEFILE_LIST)
	@echo ""

# =============================================================================
# Зависимости
# =============================================================================
install: ## Установить зависимости
	pnpm install

# =============================================================================
# Dev-запуск
# =============================================================================
dev: ## Запустить dev-сервер (Turbopack)
	pnpm dev

# =============================================================================
# Сборка и проверки
# =============================================================================
build: ## Собрать статический сайт
	pnpm build

lint: ## Запустить ESLint
	pnpm lint

lint-fix: ## Автоисправление ESLint
	pnpm lint --fix

format: ## Отформатировать код (Prettier)
	npx prettier --write "**/*.{ts,tsx,js,mjs,json,css,md,yaml,yml,mdx}"

format-check: ## Проверить форматирование
	npx prettier --check "**/*.{ts,tsx,js,mjs,json,css,md,yaml,yml,mdx}"

# =============================================================================
# Docker (production)
# =============================================================================
docker-build: ## Собрать Docker-образ локально
	docker compose -f docker-compose.prod.yml build

docker-up: ## Запустить production локально (нужен .env.production)
	docker compose -f docker-compose.prod.yml --env-file .env.production up -d

docker-down: ## Остановить production контейнеры
	docker compose -f docker-compose.prod.yml down

docker-logs: ## Логи production контейнеров
	docker compose -f docker-compose.prod.yml logs -f

# =============================================================================
# Очистка
# =============================================================================
clean: ## Удалить build-артефакты
	rm -rf out .next
	@echo "$(GREEN)Готово$(RESET)"
