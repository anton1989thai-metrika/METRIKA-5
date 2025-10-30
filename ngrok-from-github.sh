#!/bin/bash

# Скрипт для настройки ngrok, который показывает версию напрямую с GitHub (через Vercel)
# Это создаст локальный прокси, который перенаправляет запросы на Vercel production

VERCEL_URL="https://METRIKA-5.vercel.app"
PROXY_PORT=3001
NGROK_PORT=4040

echo "🔧 Настраиваю ngrok для показа версии с GitHub (через Vercel)..."
echo "📍 Vercel URL: $VERCEL_URL"
echo ""

# Проверяем доступность Vercel
echo "🔍 Проверяю доступность Vercel..."
STATUS_CODE=$(curl -s -o /dev/null -w "%"{http_code}" "$VERCEL_URL" || echo "000")
if [ "$STATUS_CODE" = "200" ]; then
    echo "✅ Vercel доступен"
else
    echo "⚠️  Внимание: Vercel вернул код $STATUS_CODE"
    echo "💡 Убедитесь что проект задеплоен на Vercel"
fi

echo ""
echo "📦 Создаю прокси-сервер..."
echo ""

# Создаем прокси-сервер
cat > /tmp/vercel-ngrok-proxy.js << EOF
const http = require('http');
const https = require('https');
const url = require('url');

const VERCEL_URL = '$VERCEL_URL';
const PORT = $PROXY_PORT;

const server = http.createServer((req, res) => {
    const targetUrl = VERCEL_URL + req.url;
    
    const parsedUrl = url.parse(targetUrl);
    const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: req.method,
        headers: {
            ...req.headers,
            host: parsedUrl.hostname
        }
    };
    
    const proxyReq = https.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });
    
    req.pipe(proxyReq);
    
    proxyReq.on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(500);
        res.end('Error proxying to Vercel: ' + err.message);
    });
});

server.listen(PORT, () => {
    console.log(\`✅ Прокси-сервер запущен на порту \${PORT}\`);
    console.log(\`📍 Проксирует к: \${VERCEL_URL}\`);
    console.log(\`🔄 Все запросы будут перенаправляться на Vercel (production с GitHub)\`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Прокси-сервер остановлен');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Прокси-сервер остановлен');
        process.exit(0);
    });
});
EOF

# Останавливаем старые процессы
pkill -f "vercel-ngrok-proxy.js" 2>/dev/null
pkill -f "ngrok http" 2>/dev/null

echo "🚀 Запускаю прокси-сервер..."
node /tmp/vercel-ngrok-proxy.js &
PROXY_PID=$!

sleep 2

# Проверяем что прокси запустился
if ps -p $PROXY_PID > /dev/null 2>&1; then
    echo "✅ Прокси-сервер запущен (PID: $PROXY_PID)"
    echo "📍 Проксирует запросы к Vercel на порту $PROXY_PORT"
else
    echo "❌ Не удалось запустить прокси-сервер"
    exit 1
fi

echo ""
echo "🌐 Запускаю ngrok туннель..."
echo "📊 Dashboard: http://127.0.0.1:$NGROK_PORT"
echo ""
echo "✅ Ngrok будет показывать версию с GitHub (через Vercel)!"
echo "⏹️  Остановить: Ctrl+C"
echo ""

# Запускаем ngrok
ngrok http $PROXY_PORT

# Очистка при выходе
cleanup() {
    echo ""
    echo "🛑 Останавливаю процессы..."
    kill $PROXY_PID 2>/dev/null
    pkill -f "ngrok http" 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

