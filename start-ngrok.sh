#!/bin/bash

# Скрипт для запуска ngrok туннеля для локального Next.js сервера
# Использование: ./start-ngrok.sh [порт]
# По умолчанию использует порт 3000

PORT=${1:-3000}

echo "🚀 Запускаю ngrok туннель для порта $PORT..."
echo ""
echo "📌 Если это первый запуск:"
echo "   1. Откройте https://dashboard.ngrok.com"
echo "   2. Скопируйте ваш authtoken"
echo "   3. Выполните: ngrok config add-authtoken YOUR_TOKEN"
echo ""

# Проверяем, запущен ли ngrok
if pgrep -x "ngrok" > /dev/null; then
    echo "⚠️  Ngrok уже запущен!"
    echo "💡 Остановите его или используйте существующий туннель"
    echo ""
    echo "🔗 Откройте http://127.0.0.1:4040 для просмотра адреса туннеля"
    exit 1
fi

# Запускаем ngrok
echo "🌐 Создаю туннель..."
echo "📊 Dashboard: http://127.0.0.1:4040"
echo ""
echo "⏹️  Остановить: Ctrl+C"
echo ""

ngrok http $PORT

