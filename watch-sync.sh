#!/bin/bash

# Скрипт для постоянного отслеживания изменений и автоматической синхронизации
# Использование: ./watch-sync.sh (работает в фоновом режиме)

echo "👀 Запускаю отслеживание изменений..."
echo "📌 Для остановки нажмите Ctrl+C"
echo ""

# Функция синхронизации
sync_changes() {
    echo ""
    echo "🔄 [$(date '+%H:%M:%S')] Обнаружены изменения. Синхронизирую..."
    
    # Запускаем скрипт синхронизации
    ./auto-sync.sh
    
    echo "⏳ Ожидаю следующие изменения..."
    echo ""
}

# Проверяем, что скрипт auto-sync.sh существует
if [ ! -f "auto-sync.sh" ]; then
    echo "❌ Ошибка: Не найден скрипт auto-sync.sh"
    exit 1
fi

# Делаем скрипт исполняемым
chmod +x auto-sync.sh

# Начальная синхронизация
sync_changes

# Определяем команду watch в зависимости от системы
if command -v fswatch &> /dev/null; then
    # Используем fswatch для macOS
    echo "📡 Использую fswatch для отслеживания изменений..."
    fswatch -o . --exclude='\.git|node_modules|\.next' | while read f; do
        sync_changes
    done
elif command -v inotifywait &> /dev/null; then
    # Используем inotifywait для Linux
    echo "📡 Использую inotifywait для отслеживания изменений..."
    while true; do
        inotifywait -r -e modify,create,delete --exclude '\.git|node_modules|\.next' . 2>/dev/null
        sync_changes
    done
else
    # Fallback: проверка каждые 30 секунд
    echo "⚠️  fswatch/inotifywait не найдены. Использую периодическую проверку (каждые 30 секунд)..."
    echo "💡 Для лучшей производительности установите fswatch: brew install fswatch"
    
    while true; do
        sleep 30
        # Проверяем, есть ли изменения
        if [ -n "$(git status --porcelain)" ] || [ "$(git rev-parse @)" != "$(git rev-parse @{u} 2>/dev/null)" ]; then
            sync_changes
        fi
    done
fi

