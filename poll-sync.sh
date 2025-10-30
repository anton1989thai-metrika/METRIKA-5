#!/bin/bash

# Скрипт для периодической проверки и синхронизации с GitHub
# Использование: ./poll-sync.sh [интервал_в_секундах]
# Пример: ./poll-sync.sh 60  (проверка каждые 60 секунд)

INTERVAL=${1:-30}  # По умолчанию 30 секунд

echo "🔄 Запускаю периодическую синхронизацию..."
echo "⏱️  Интервал проверки: $INTERVAL секунд"
echo "📌 Для остановки нажмите Ctrl+C"
echo ""

# Проверяем, что скрипт auto-sync.sh существует
if [ ! -f "auto-sync.sh" ]; then
    echo "❌ Ошибка: Не найден скрипт auto-sync.sh"
    exit 1
fi

# Делаем скрипт исполняемым
chmod +x auto-sync.sh

# Начальная синхронизация
echo "🔄 [$(date '+%H:%M:%S')] Начальная синхронизация..."
./auto-sync.sh

echo ""
echo "⏳ Буду проверять изменения каждые $INTERVAL секунд..."
echo ""

# Бесконечный цикл проверки
while true; do
    sleep $INTERVAL
    
    # Проверяем, есть ли изменения на GitHub
    git fetch origin --quiet
    
    LOCAL=$(git rev-parse @ 2>/dev/null)
    REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
    
    # Проверяем наличие изменений
    HAS_REMOTE_CHANGES=false
    HAS_LOCAL_CHANGES=false
    
    if [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
        HAS_REMOTE_CHANGES=true
    fi
    
    if [ -n "$(git status --porcelain)" ]; then
        HAS_LOCAL_CHANGES=true
    fi
    
    # Если есть изменения, запускаем синхронизацию
    if [ "$HAS_REMOTE_CHANGES" = true ] || [ "$HAS_LOCAL_CHANGES" = true ]; then
        echo ""
        echo "🔄 [$(date '+%H:%M:%S')] Обнаружены изменения. Синхронизирую..."
        ./auto-sync.sh
        echo ""
        echo "⏳ Следующая проверка через $INTERVAL секунд..."
    else
        # Тихая проверка - ничего не выводим, если изменений нет
        :
    fi
done

