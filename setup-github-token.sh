#!/bin/bash

# Скрипт для настройки GitHub токена
# Использование: ./setup-github-token.sh <your-token>

set -e

if [ -z "$1" ]; then
    echo "❌ Ошибка: Укажите токен как аргумент"
    echo "Использование: ./setup-github-token.sh <your-github-token>"
    echo ""
    echo "Получить токен можно здесь:"
    echo "https://github.com/settings/tokens/new"
    exit 1
fi

TOKEN="$1"
REPO_URL="https://${TOKEN}@github.com/anton1989thai-metrika/METRIKA-5.git"

echo "🔐 Настройка доступа к GitHub..."

# Обновляем remote URL с токеном
git remote set-url origin "$REPO_URL"

echo "✅ Токен настроен!"
echo "📤 Загрузка кода на GitHub..."

# Пушим код
git push -u origin main --force

# Пушим теги
echo "📌 Загрузка тега восстановления..."
git push origin --tags

echo ""
echo "✅ Готово! Код и тег загружены на GitHub"
echo "📌 Точка восстановления: $(git tag -l | tail -1)"

