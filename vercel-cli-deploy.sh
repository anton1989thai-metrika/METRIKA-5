#!/bin/bash

# Автоматический деплой через Vercel CLI
# Этот скрипт поможет деплоить проект даже если браузерное расширение не работает

echo "🚀 Автоматический деплой METRIKA- животных на Vercel"
echo ""

# Проверяем что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: Запустите скрипт из корневой папки проекта"
    exit 1
fi

# Проверяем что Vercel CLI установлен
if ! command -v vercel &> /dev/null; then
    echo "📦 Устанавливаю Vercel CLI..."
    npm install -g vercel
fi

# Проверяем авторизацию
echo "🔍 Проверяю авторизацию..."
if vercel whoami &> /dev/null; then
    USER=$(vercel whoami 2>/dev/null)
    echo "✅ Авторизован как: $USER"
else
    echo "⚠️  Требуется авторизация"
    echo ""
    echo "📝 Выполните авторизацию:"
    echo "   vercel login"
    echo ""
    echo "Это откроет браузер для входа. После авторизации запустите скрипт снова."
    exit 1
fi

echo ""
echo "📦 Начинаю деплой в production..."
echo ""

# Деплоим
vercel --prod --yes

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Деплой успешно завершен!"
    echo ""
    echo "🌐 Ваш проект задеплоен на Vercel"
    echo "💡 URL будет показан выше или выполните: vercel ls"
else
    echo ""
    echo "❌ Ошибка при деплое"
    echo "💡 Проверьте логи выше для деталей"
    exit 1
fi

