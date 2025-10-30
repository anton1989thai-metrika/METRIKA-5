#!/bin/bash

# Скрипт для запуска Next.js dev-сервера с ngrok одновременно
# Использование: ./start-dev-with-ngrok.sh

PORT=3000

echo "🚀 Запускаю Next.js dev-сервер и ngrok..."
echo ""

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: Запустите скрипт из корневой папки проекта METRIKA-5"
    exit 1
fi

# Функция для очистки при выходе
cleanup() {
    echo ""
    echo "🛑 Останавливаю процессы..."
    kill $NEXT_PID $NGROK_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Запускаем Next.js dev-сервер в фоне
echo "📦 Запускаю Next.js на порту $PORT..."
npm run dev &
NEXT_PID=$!

# Ждем пока сервер запустится
echo "⏳ Жду запуск сервера..."
sleep 5

# Проверяем, что сервер запущен
if ! curl -s http://localhost:$PORT > /dev/null; then
    echo "⚠️  Сервер не запустился. Проверьте ошибки выше."
    kill $NEXT_PID 2>/dev/null
    exit 1
fi

echo "✅ Next.js сервер запущен!"
echo ""

# Запускаем ngrok
echo "🌐 Запускаю ngrok туннель..."
ngrok http $PORT &
NGROK_PID=$!

echo ""
echo "✅ Всё запущено!"
echo ""
echo "📍 Локальный адрес: http://localhost:$PORT"
echo "🌐 Публичный адрес (ngrok): http://127.0.0.1:4040"
echo ""
echo "⏹️  Остановить всё: Ctrl+C"
echo ""

# Ждем завершения
wait

