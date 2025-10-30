#!/bin/bash

# Скрипт для запуска ngrok туннеля к Vercel (production версия с GitHub)
# Ngrok будет показывать то, что задеплоено на Vercel, а не локальный dev-сервер

VERCEL_URL="https://METRIKA-5.vercel.app"

echo "🌐 Настраиваю ngrok для прямого подключения к Vercel..."
echo "📍 Vercel URL: $VERCEL_URL"
echo ""

# Проверяем доступность Vercel
echo "🔍 Проверяю доступность Vercel..."
if curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL" | grep -q "200"; then
    echo "✅ Vercel доступен"
else
    echo "⚠️  Внимание: Vercel может быть недоступен или еще не задеплоен"
    echo "💡 Убедитесь что проект задеплоен на Vercel"
fi

echo ""
echo "⚠️  ВАЖНО: Ngrok работает только с локальными портами"
echo "💡 Решение: Создаю локальный прокси-сервер к Vercel"
echo ""

# Проверяем наличие Node.js для запуска прокси
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js"
    exit 1
fi

# Создаем простой прокси-сервер на порту 3001
cat > /tmp/vercel-proxy-server.js << 'EOF'
const http = require('http');
const https = require('https');

const VERCEL_URL = 'https://METRIKA-5.vercel.app';
const PORT = 3001;

const server = http.createServer((req, res) => {
    const targetUrl = `${VERCEL_URL}${req.url}`;
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} -> ${targetUrl}`);
    
    https.get(targetUrl, (targetRes) => {
        res.writeHead(targetRes.statusCode, targetRes.headers);
        targetRes.pipe(res);
    }).on('error', (err) => {
        console.error('Error:', err);
        res.writeHead(500);
        res.end('Error proxying to Vercel');
    });
});

server.listen(PORT, () => {
    console.log(`✅ Прокси-сервер запущен на порту ${PORT}`);
    console.log(`📍 Проксирует запросы к: ${VERCEL_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Прокси-сервер остановлен');
        process.exit(0);
    });
});
EOF

# Останавливаем старый прокси если запущен
pkill -f "vercel-proxy-server.js" 2>/dev/null

echo "🚀 Запускаю прокси-сервер к Vercel на порту 3001..."
node /tmp/vercel-proxy-server.js > /tmp/vercel-proxy.log 2>&1 &
PROXY_PID=$!

sleep 2

# Проверяем что прокси запустился
if ps -p $PROXY_PID > /dev/null; then
    echo "✅ Прокси-сервер запущен (PID: $PROXY_PID)"
else
    echo "❌ Не удалось запустить прокси-сервер"
    cat /tmp/vercel-proxy.log
    exit 1
fi

echo ""
echo "🌐 Запускаю ngrok туннель к прокси (порт 3001)..."
echo "📊 Dashboard: http://127.0.0.1:4040"
echo ""

# Останавливаем старый ngrok
pkill -f "ngrok http" 2>/dev/null
sleep 1

# Запускаем ngrok
ngrok http 3001

# При остановке ngrok останавливаем и прокси
trap "kill $PROXY_PID 2>/dev/null; exit" SIGINT SIGTERM

