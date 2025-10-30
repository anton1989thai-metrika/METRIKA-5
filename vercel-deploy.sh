#!/bin/bash

# Скрипт для деплоя проекта на Vercel

echo "🚀 Начинаю деплой проекта METRIKA-5 на Vercel..."
echo ""

# Проверяем что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: Запустите скрипт из корневой папки проекта METRIKA-5"
    exit 1
fi

# Проверяем что Vercel CLI установлен
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI не установлен"
    echo "💡 Установите: npm install -g vercel"
    exit 1
fi

# Проверяем авторизацию
echo "🔍 Проверяю авторизацию Vercel..."
if vercel whoami &> /dev/null; then
    USER=$(vercel whoami 2>/dev/null)
    echo "✅ Авторизован как: $USER"
else
    echo "⚠️  Не авторизован в Vercel"
    echo "📝 Выполните авторизацию:"
    echo "   vercel login"
    exit 1
fi

echo ""
echo "📦 Начинаю деплой..."
echo ""

# Выполняем деплой
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Деплой успешно завершен!"
    echo ""
    echo "🌐 Ваш проект доступен на Vercel"
    echo "💡 Для получения URL выполните: vercel ls"
else
    echo ""
    echo "❌ Ошиб cors при деплое"
    exit 1
fi

