#!/bin/bash
# Автоформатирование файлов после редактирования агентом.
# Prettier запускается только для поддерживаемых расширений.
# Не зависит от jq — парсим JSON через grep/sed.

input=$(cat)
file_path=$(echo "$input" | grep -o '"filePath"\s*:\s*"[^"]*"' | head -1 | sed 's/.*:\s*"//;s/"$//')

if [ -z "$file_path" ]; then
  exit 0
fi

case "$file_path" in
  *.ts|*.tsx|*.js|*.mjs|*.css|*.json)
    npx prettier --write "$file_path" --log-level silent 2>/dev/null
    ;;
esac

exit 0
