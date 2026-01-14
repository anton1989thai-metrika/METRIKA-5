#!/bin/bash

# Скрипт для загрузки и выполнения исправления на сервере
# Использование: ./upload-and-run.sh

SERVER="root@72.62.72.196"
PASSWORD="${VPS_PASSWORD:-}"

if [ -z "$PASSWORD" ]; then
  echo "Введите пароль от VPS (будет скрыт):"
  read -rs PASSWORD
  echo ""
fi

echo "📤 Загрузка скрипта на сервер..."

# Используем sshpass если доступен, иначе просим пользователя выполнить вручную
if command -v sshpass &> /dev/null; then
    sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no scripts/complete-mail-fix.sh "$SERVER:/root/"
    echo "✅ Скрипт загружен"
    echo ""
    echo "🔧 Выполнение скрипта на сервере..."
    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER" "cd /root && chmod +x complete-mail-fix.sh && ./complete-mail-fix.sh"
else
    echo "⚠️  sshpass не установлен. Выполните вручную:"
    echo ""
    echo "1. Загрузите скрипт:"
    echo "   scp scripts/complete-mail-fix.sh $SERVER:/root/"
    echo ""
    echo "2. Подключитесь:"
    echo "   ssh $SERVER"
    echo ""
    echo "3. Выполните:"
    echo "   cd /root"
    echo "   chmod +x complete-mail-fix.sh"
    echo "   ./complete-mail-fix.sh"
    echo ""
    echo "Или установите sshpass:"
    echo "   brew install hudochenkov/sshpass/sshpass  # macOS"
    echo "   sudo apt-get install sshpass  # Linux"
fi
