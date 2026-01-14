#!/bin/bash

# Скрипт для завершения синхронизации с GitHub
# Использование: ./complete-github-sync.sh

set -e

echo "🚀 Завершение синхронизации с GitHub..."

# Получаем текущий тег
CURRENT_TAG=$(git tag -l | tail -1)
echo "📌 Текущий тег восстановления: $CURRENT_TAG"

# Пушим код и теги
echo "📤 Загрузка кода на GitHub..."
git push -u origin main --force

echo "📤 Загрузка тега на GitHub..."
git push origin --tags

echo ""
echo "✅ Код и тег загружены на GitHub!"
echo "📌 Точка восстановления: $CURRENT_TAG"
echo ""
echo "Для удаления старых тегов на GitHub выполните:"
echo "  git push origin --delete <old-tag-name>"
echo ""
echo "Или через веб-интерфейс GitHub:"
echo "  https://github.com/anton1989thai-metrika/METRIKA-5/tags"

