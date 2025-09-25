#!/bin/bash

# Быстрый деплой для METRIKA-5
# Использование: ./deploy.sh

echo "🚀 Быстрый деплой METRIKA-5..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: Запустите скрипт из корневой папки проекта METRIKA-5"
    exit 1
fi

# Получаем текущее время для коммита
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# Добавляем все изменения
git add .

# Проверяем, есть ли изменения
if git diff --staged --quiet; then
    echo "ℹ️  Нет изменений для деплоя"
    exit 0
fi

# Создаем коммит с временной меткой
git commit -m "Auto-deploy: $TIMESTAMP"

# Пушим на GitHub
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Деплой запущен!"
    echo "📊 Отслеживайте прогресс: https://github.com/anton1989thai-metrika/METRIKA-5/actions"
    echo "🌐 Сайт будет обновлен через 2-3 минуты"
else
    echo "❌ Ошибка деплоя"
    exit 1
fi
