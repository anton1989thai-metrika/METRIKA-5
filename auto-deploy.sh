#!/bin/bash

# Автоматический деплой METRIKA-5
echo "🚀 Автоматический деплой METRIKA-5..."

# Проверяем статус git
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Обнаружены изменения, коммитим и деплоим..."
    
    # Добавляем все изменения
    git add .
    
    # Коммитим с автоматическим сообщением
    COMMIT_MESSAGE="Auto deploy: $(date '+%Y-%m-%d %H:%M:%S') - $(git diff --cached --name-only | head -3 | tr '\n' ', ' | sed 's/,$//')"
    git commit -m "$COMMIT_MESSAGE"
    
    # Отправляем на GitHub
    git push origin main
    
    echo "✅ Изменения отправлены на GitHub"
    echo "🔄 GitHub Actions автоматически деплоят на Vercel"
    echo "🌐 Проверьте статус деплоя: https://github.com/anton1989thai-metrika/METRIKA-5/actions"
else
    echo "ℹ️  Нет изменений для деплоя"
fi

echo "🎉 Автоматический деплой завершен!"
