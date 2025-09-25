#!/bin/bash

# Скрипт для автоматической синхронизации изменений с GitHub и Vercel
# Использование: ./sync.sh "Описание изменений"

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: Запустите скрипт из корневой папки проекта METRIKA-5"
    exit 1
fi

# Проверяем аргумент с описанием изменений
if [ -z "$1" ]; then
    echo "❌ Ошибка: Укажите описание изменений"
    echo "Использование: ./sync.sh \"Описание изменений\""
    exit 1
fi

COMMIT_MESSAGE="$1"

echo "🚀 Начинаем синхронизацию проекта METRIKA-5..."

# Проверяем статус git
echo "📋 Проверяем статус git..."
git status

# Добавляем все изменения
echo "➕ Добавляем все изменения..."
git add .

# Проверяем, есть ли изменения для коммита
if git diff --staged --quiet; then
    echo "ℹ️  Нет изменений для коммита"
    exit 0
fi

# Создаем коммит
echo "💾 Создаем коммит: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

# Пушим изменения на GitHub
echo "📤 Отправляем изменения на GitHub..."
git push origin main

# Проверяем результат
if [ $? -eq 0 ]; then
    echo "✅ Успешно! Изменения отправлены на GitHub"
    echo "🔄 GitHub Actions автоматически развернет изменения на Vercel"
    echo ""
    echo "📊 Статус деплоя можно отследить по ссылке:"
    echo "https://github.com/anton1989thai-metrika/METRIKA-5/actions"
    echo ""
    echo "🌐 После успешного деплоя сайт будет доступен на Vercel"
else
    echo "❌ Ошибка при отправке изменений на GitHub"
    exit 1
fi
