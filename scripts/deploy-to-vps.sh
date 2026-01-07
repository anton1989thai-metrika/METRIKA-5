#!/bin/bash

# Скрипт для деплоя изменений на VPS
# Использование: ./scripts/deploy-to-vps.sh

set -e

SERVER="root@72.62.72.196"
VPS_PATH="/var/www/metrika5"
PASSWORD="SikaAnt7Hostinger7+"

echo "🚀 Деплой изменений на VPS..."

# Файлы для деплоя
FILES=(
  "src/components/login-form.tsx"
  "src/components/UserManagementPanel.tsx"
  "src/components/BurgerMenu.tsx"
  "src/components/signup-form.tsx"
  "src/app/api/auth/me/route.ts"
  "src/app/api/user/route.ts"
  "src/app/api/users/route.ts"
  "src/app/api/auth/password-reset/request/route.ts"
  "src/app/api/auth/password-reset/confirm/route.ts"
  "src/app/admin/layout.tsx"
  "src/app/email/layout.tsx"
  "src/app/auth/forgot/page.tsx"
  "src/app/auth/reset-password/page.tsx"
  "src/app/auth/reset-password/ResetPasswordClient.tsx"
  "src/app/profile/layout.tsx"
  "src/app/my-objects/layout.tsx"
  "src/app/academy/layout.tsx"
  "src/app/knowledge-base/layout.tsx"
  "src/app/tasks/layout.tsx"
  "src/lib/permissions-core.ts"
  "prisma/schema.prisma"
)

# Проверяем наличие файлов
for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Файл не найден: $file"
    exit 1
  fi
done

echo "📤 Загрузка файлов на сервер..."

# Используем expect для автоматизации SSH
if command -v expect &> /dev/null; then
  # Создаем директории под файлы
  REMOTE_DIRS=()
  for file in "${FILES[@]}"; do
    REMOTE_DIRS+=("$VPS_PATH/$(dirname "$file")")
  done
  # uniq
  UNIQUE_DIRS=$(printf "%s\n" "${REMOTE_DIRS[@]}" | sort -u | tr '\n' ' ')

  expect << EOF
    set timeout 60
    spawn ssh -o StrictHostKeyChecking=no $SERVER "mkdir -p $UNIQUE_DIRS"
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

  # Загружаем файлы с сохранением путей
  for file in "${FILES[@]}"; do
    echo "➡️  $file"
    expect << EOF
      set timeout 60
      spawn scp -o StrictHostKeyChecking=no "$file" $SERVER:$VPS_PATH/$file
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
  done

  echo "✅ Файлы загружены"
  
  echo "🗄️  Prisma db push + generate на VPS..."
  expect << EOF
    set timeout 1200
    spawn ssh -o StrictHostKeyChecking=no $SERVER "cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && sudo -u metrika -H bash -lc 'cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && npm run db:setup'"
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

  echo "🏗️  Сборка Next.js на VPS (чтобы изменения вступили в силу)..."
  expect << EOF
    set timeout 1200
    spawn ssh -o StrictHostKeyChecking=no $SERVER "cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && export OPENAI_API_KEY=placeholder-for-build && export NODE_ENV=production && sudo -u metrika -H bash -lc 'cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && export OPENAI_API_KEY=placeholder-for-build && export NODE_ENV=production && npm run build'"
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

  echo "🔄 Перезапуск сервиса на VPS..."
  expect << EOF
    set timeout 30
    spawn ssh -o StrictHostKeyChecking=no $SERVER "systemctl restart metrika5"
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
  echo "✅ Сервис перезапущен"
  
else
  echo "⚠️  expect не установлен. Выполните вручную:"
  echo ""
  echo "1. Загрузите файлы:"
  for file in "${FILES[@]}"; do
    echo "   scp $file $SERVER:$VPS_PATH/$file"
  done
  echo ""
  echo "2. Подключитесь:"
  echo "   ssh $SERVER"
  echo ""
  echo "3. Перезапустите сервис:"
  echo "   cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && npm run db:setup && OPENAI_API_KEY=placeholder-for-build NODE_ENV=production npm run build && systemctl restart metrika5"
  echo ""
  echo "Или установите expect:"
  echo "   brew install expect  # macOS"
fi

echo "✅ Деплой завершен!"
