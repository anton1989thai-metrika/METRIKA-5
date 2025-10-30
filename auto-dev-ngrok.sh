#!/bin/bash

# Автоматическая синхронизация GitHub → локально → dev-сервер → ngrok
# Этот скрипт обеспечивает, что изменения с GitHub сразу попадают на ngrok

PROJECT_DIR="$(pwd)"
PORT=3000

echo "🔄 Настраиваю автоматическую синхронизацию cache GitHub → ngrok..."

# Функция проверки и запуска dev-сервера
ensure_dev_server() {
    if ! pgrep -f "next dev" > /dev/null; then
        echo "📦 Запускаю Next.js dev-сервер..."
        cd "$PROJECT_DIR"
        npm run dev > /tmp/nextjs-dev.log 2>&1 &
        sleep 5
        echo "✅ Dev-сервер запущен"
    else
        echo "✅ Dev-сервер уже запущен"
    fi
}

# Функция проверки и запуска ngrok
ensure_ngrok() {
    if ! pgrep -f "ngrok http" > /dev/null; then
        echo "🌐 Запускаю ngrok..."
        cd "$PROJECT_DIR"
        ngrok http $PORT > /tmp/ngrok.log 2>&1 &
        sleep 3
        echo "✅ Ngrok запущен"
    else
        echo "✅ Ngrok уже запущен"
    fi
    
    # Получаем публичный адрес
    sleep 2
    PUBLIC_URL=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "")
    if [ -n "$PUBLIC_URL" ]; then
        echo "🌐 Публичный адрес: $PUBLIC_URL"
        echo "$PUBLIC_URL" > /tmp/ngrok-url.txt
    fi
}

# Функция синхронизации с GitHub
sync_from_github() {
    cd "$PROJECT_DIR"
    
    echo "📥 Проверяю изменения на GitHub..."
    git fetch origin --quiet
    
    LOCAL=$(git rev-parse @ 2>/dev/null)
    REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
    
    if [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
        echo "📥 Обнаружены изменения на GitHub. Обновляю..."
        
        # Сохраняем локальные изменения если есть
        if [ -n "$(git status --porcelain)" ]; then
            echo "⚠️  Сохраняю локальные изменения..."
            git stash push -m "Auto-sync: сохранение перед pull $(date '+%Y-%m-%d %H:%M:%S')"
        fi
        
        # Получаем изменения
        git pull origin main --no-rebase
        
        if [ $? -eq 0 ]; then
            echo "✅ Изменения загружены с GitHub"
            
            # Восстанавливаем локальные изменения если были
            git stash pop 2>/dev/null || echo ""
            
            # Next.js автоматически перезагрузится при изменении файлов (hot reload)
            echo "🔄 Dev-сервер автоматически обновит изменения (hot reload)"
            return 0
        else
            echo "❌ Ошибка при загрузке изменений"
            return 1
        fi
    else
        echo "ℹ️  Нет новых изменений на GitHub"
        return 0
    fi
}

# Основной цикл
main() {
    echo "🚀 Запускаю автоматическую синхронизацию GitHub → ngrok"
    echo "📍 Проект: $PROJECT_DIR"
    echo ""
    
    # ВАЖНО: Сначала загружаем все изменения с GitHub при старте
    # Это загрузит изменения, сделанные пока компьютер был выключен
    echo "🔄 Проверяю и загружаю изменения с GitHub (при старте системы)..."
    sync_from_github
    
    # Убеждаемся что dev-сервер запущен
    ensure_dev_server
    
    # Убеждаемся что ngrok запущен
    ensure_ngrok
    
    echo ""
    echo "✅ Всё запущено и готово!"
    echo "🔄 Буду проверять изменения на GitHub каждые 30 секунд..."
    echo "⏹️  Остановить: Ctrl+C"
    echo ""
    
    # Бесконечный цикл синхронизации
    while true; do
        sleep 30
        
        # Проверяем изменения на GitHub
        if sync_from_github; then
            # Перепроверяем что сервисы работают
            ensure_dev_server
            ensure_ngrok
        fi
    done
}

# Обработка сигналов
trap 'echo ""; echo "🛑 Останавливаю синхронизацию..."; exit 0' SIGINT SIGTERM

# Запуск
main

