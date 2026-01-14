#!/bin/bash

# Скрипт для деплоя login-form.tsx на VPS
# Использование: ./scripts/deploy-login-form.sh

set -e

SERVER="root@72.62.72.196"
VPS_PATH="/var/www/metrika5"
PASSWORD="${VPS_PASSWORD:-}"
FILE="src/components/login-form.tsx"

echo "🚀 Деплой login-form.tsx на VPS..."

if [ -z "$PASSWORD" ]; then
  echo "Введите пароль от VPS (будет скрыт):"
  read -rs PASSWORD
  echo ""
fi

# Проверяем наличие файла
if [ ! -f "$FILE" ]; then
  echo "❌ Файл не найден: $FILE"
  exit 1
fi

echo "📤 Загрузка файла и деплой на сервер..."

# Загружаем файл и выполняем все команды в одной сессии
expect << EOF
  set timeout 1800
  
  # Загружаем файл
  spawn scp -o StrictHostKeyChecking=no "$FILE" $SERVER:$VPS_PATH/$FILE
  expect {
    "password:" {
      send "$PASSWORD\r"
      exp_continue
    }
    "yes/no" {
      send "yes\r"
      exp_continue
    }
    eof
  }
  
  # Собираем проект
  spawn ssh -o StrictHostKeyChecking=no $SERVER "cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && export OPENAI_API_KEY=placeholder-for-build && export NODE_ENV=production && sudo -u metrika -H bash -lc 'cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && export OPENAI_API_KEY=placeholder-for-build && export NODE_ENV=production && npm run build && systemctl restart metrika5'"
  expect {
    "password:" {
      send "$PASSWORD\r"
      exp_continue
    }
    "yes/no" {
      send "yes\r"
      exp_continue
    }
    eof
  }
EOF

echo "✅ Деплой завершен!"
