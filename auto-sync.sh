#!/bin/bash

# Скрипт автоматической двусторонней синхронизации
# Локальные изменения → GitHub
# Изменения на GitHub → локально

echo "🔄 Начинаю автоматическую синхронизацию..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: Запустите скрипт из корневой папки проекта METRIKA-5"
    exit 1
fi

# 1. Получаем изменения с GitHub (pull)
echo "📥 Получаю изменения с GitHub..."
git fetch origin

# Проверяем, есть ли изменения на GitHub, которых нет локально
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")

if [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
    echo "📥 Обнаружены изменения на GitHub. Синхронизирую..."
    
    # Проверяем, есть ли локальные незакоммиченные изменения
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️  У вас есть незакоммиченные изменения. Сохраняю их..."
        
        # Создаем stash для сохранения локальных изменений
        git stash push -m "Auto-sync: сохранение изменений перед pull $(date '+%Y-%m-%d %H:%M:%S')"
        
        # Получаем изменения
        git pull origin main --no-rebase
        
        # Возвращаем сохраненные изменения
        git stash pop 2>/dev/null || echo "ℹ️  Нет сохраненных изменений для восстановления"
    else
        # Если нет локальных изменений, просто делаем pull
        git pull origin main --no-rebase
    fi
    
    echo "✅ Локальная версия обновлена с GitHub"
else
    echo "ℹ️  Локальная версия уже синхронизирована с GitHub"
fi

# 2. Отправляем локальные изменения на GitHub (push)
echo ""
echo "📤 Проверяю локальные изменения для отправки на GitHub..."

# Проверяем статус
git status --short

# Проверяем, есть ли изменения для коммита
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Обнаружены локальные изменения. Добавляю их..."
    
    # Добавляем все изменения
    git add .
    
    # Создаем коммит с временной меткой
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    COMMIT_MESSAGE="Auto-sync: $TIMESTAMP"
    
    git commit -m "$COMMIT_MESSAGE" 2>/dev/null
    
    # post-commit hook автоматически запустит push
    # Но на всякий случай делаем push здесь тоже
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    git push origin "$BRANCH"
    
    if [ $? -eq 0 ]; then
        echo "✅ Локальные изменения отправлены на GitHub"
    else
        echo "⚠️  Не удалось отправить изменения на GitHub"
    fi
else
    echo "ℹ️  Нет локальных изменений для отправки"
fi

echo ""
echo "✅ Синхронизация завершена!"

