#!/bin/bash

# Скрипт для деплоя изменений на VPS
# Использование: ./scripts/deploy-to-vps.sh

set -e

SERVER="root@72.62.72.196"
VPS_PATH="/var/www/metrika5"
PASSWORD="${VPS_PASSWORD:-}"

has_ssh_key_access() {
  ssh -o BatchMode=yes -o StrictHostKeyChecking=no "$SERVER" "true" >/dev/null 2>&1
}

use_password_auth=false
if [ -n "$PASSWORD" ]; then
  use_password_auth=true
else
  if has_ssh_key_access; then
    use_password_auth=false
  else
    # In interactive shells, allow prompting.
    if [ -t 0 ]; then
      echo "Введите пароль от VPS (будет скрыт):"
      read -rs PASSWORD
      echo ""
      use_password_auth=true
    else
      echo "❌ Нет доступа по SSH-ключу и пароль не задан (VPS_PASSWORD)."
      echo "Запустите локально: VPS_PASSWORD='...' bash scripts/deploy-to-vps.sh"
      exit 1
    fi
  fi
fi

echo "🚀 Деплой изменений на VPS..."

# Файлы для деплоя
FILES=(
  "src/components/login-form.tsx"
  "src/components/UserManagementPanel.tsx"
  "src/components/BurgerMenu.tsx"
  "src/components/signup-form.tsx"
  "src/components/admin/AdminEmailMailboxes.tsx"
  "src/components/email/ComposeEmail.tsx"
  "src/components/email/EmailList.tsx"
  "src/components/email/EmailView.tsx"
  "src/components/metrika/MetrikaSelect.tsx"
  "src/components/ObjectCreateForm.tsx"
  "src/components/ObjectManagementPanel.tsx"
  "src/components/ui/alert-dialog.tsx"
  "src/components/ui/badge.tsx"
  "src/components/ui/breadcrumb.tsx"
  "src/components/ui/calendar.tsx"
  "src/components/ui/carousel.tsx"
  "src/components/ui/dialog.tsx"
  "src/components/ui/dropdown-menu.tsx"
  "src/components/ui/select-fixed.tsx"
  "src/components/ui/select.tsx"
  "src/components/ui/sheet.tsx"
  "src/components/ui/table.tsx"
  "src/app/api/auth/me/route.ts"
  "src/app/api/user/route.ts"
  "src/app/api/users/route.ts"
  "src/app/api/mailboxes/route.ts"
  "src/app/api/auth/login/route.ts"
  "src/app/api/auth/password-reset/request/route.ts"
  "src/app/api/auth/password-reset/confirm/route.ts"
  "src/app/api/chat/route.ts"
  "src/app/api/admin/email-stats/route.ts"
  "src/app/api/admin/email-audit/route.ts"
  "src/app/api/emails/route.ts"
  "src/app/api/emails/sync/route.ts"
  "src/app/api/emails/watch/route.ts"
  "src/app/api/emails/send/route.ts"
  "src/app/api/emails/bulk/route.ts"
  "src/app/api/emails/trash/empty/route.ts"
  "src/app/api/emails/[id]/route.ts"
  "src/app/api/emails/[id]/delete/route.ts"
  "src/app/api/emails/[id]/star/route.ts"
  "src/app/api/emails/[id]/attachments/[attId]/route.ts"
  "src/app/page.tsx"
  "src/app/admin/page.tsx"
  "src/app/admin/layout.tsx"
  "src/app/email/layout.tsx"
  "src/app/email/page.tsx"
  "src/app/email/[folder]/[threadId]/page.tsx"
  "src/app/auth/forgot/page.tsx"
  "src/app/auth/reset-password/page.tsx"
  "src/app/auth/reset-password/ResetPasswordClient.tsx"
  "src/app/admin/mailboxes/page.tsx"
  "src/app/admin/users/add/page.tsx"
  "src/app/chat/page.tsx"
  "src/app/profile/layout.tsx"
  "src/app/my-objects/layout.tsx"
  "src/app/academy/layout.tsx"
  "src/app/knowledge-base/layout.tsx"
  "src/app/tasks/layout.tsx"
  "src/lib/permissions-core.ts"
  "src/lib/auth-email.ts"
  "src/lib/imap-actions.ts"
  "src/lib/imap-audit.ts"
  "src/lib/email.ts"
  "src/lib/init-email.ts"
  "src/lib/imap-sync.ts"
  "src/lib/imap-append.ts"
  "src/lib/imap-message-id.ts"
  "src/lib/mailbox-access.ts"
  "src/lib/mail-password.ts"
  "src/lib/logger.ts"
  "src/lib/api-client.ts"
  "src/lib/real-estate-options.ts"
  "src/config/form-rules.ts"
  "src/data/blog.ts"
  "src/data/users.ts"
  "prisma/schema.prisma"
  "prisma/migrations/20250109193300_add_imap_uid/migration.sql"
)

# Проверяем наличие файлов
for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Файл не найден: $file"
    exit 1
  fi
done

echo "📤 Загрузка файлов на сервер..."

# Escape special chars for Tcl/expect scripts (not for the remote shell).
escape_for_tcl() {
  # Escape [ ] so Tcl doesn't treat them as command substitutions.
  printf "%s" "$1" | sed -e 's/\[/\\[/g' -e 's/\]/\\]/g'
}

# Если есть пароль — используем expect для автоматизации (парольный доступ).
if [ "$use_password_auth" = true ] && command -v expect &> /dev/null; then
  # Создаем директории под файлы
  REMOTE_DIRS=()
  for file in "${FILES[@]}"; do
    REMOTE_DIRS+=("$VPS_PATH/$(dirname "$file")")
  done
  # uniq
  UNIQUE_DIRS=$(printf "%s\n" "${REMOTE_DIRS[@]}" | sort -u | tr '\n' ' ')
  UNIQUE_DIRS_TCL="$(escape_for_tcl "$UNIQUE_DIRS")"

  expect << EOF
    set timeout 60
    spawn ssh -o StrictHostKeyChecking=no $SERVER "mkdir -p $UNIQUE_DIRS_TCL"
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
    FILE_TCL="$(escape_for_tcl "$file")"
    REMOTE_TCL="$(escape_for_tcl "$VPS_PATH/$file")"
    expect << EOF
      set timeout 60
      spawn scp -o StrictHostKeyChecking=no -- "$FILE_TCL" $SERVER:$REMOTE_TCL
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
      set wait_result [wait]
      set exit_status [lindex \$wait_result 3]
      if { \$exit_status != 0 } { exit \$exit_status }
EOF
  done

  echo "✅ Файлы загружены"
  
  echo "🗄️  Применяем SQL миграцию (imapUid/imapMailbox)..."
  expect << EOF
    set timeout 300
    spawn ssh -o StrictHostKeyChecking=no $SERVER "sqlite3 $VPS_PATH/prisma/prisma/prod.db < $VPS_PATH/prisma/migrations/20250109193300_add_imap_uid/migration.sql || true"
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
  # Без пароля (SSH-ключи) или без expect: используем обычный ssh/scp.
  if [ "$use_password_auth" = true ]; then
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
    exit 1
  fi

  echo "🔑 SSH-ключ найден, деплой без пароля..."

  # Create remote directories
  REMOTE_DIRS=()
  for file in "${FILES[@]}"; do
    REMOTE_DIRS+=("$VPS_PATH/$(dirname "$file")")
  done
  UNIQUE_DIRS=$(printf "%s\n" "${REMOTE_DIRS[@]}" | sort -u | tr '\n' ' ')
  ssh -o StrictHostKeyChecking=no "$SERVER" "mkdir -p $UNIQUE_DIRS"

  # Upload files
  for file in "${FILES[@]}"; do
    echo "➡️  $file"
    scp -o StrictHostKeyChecking=no "$file" "$SERVER:$VPS_PATH/$file"
  done

  echo "🗄️  Применяем SQL миграцию (imapUid/imapMailbox)..."
  ssh -o StrictHostKeyChecking=no "$SERVER" "sqlite3 $VPS_PATH/prisma/prisma/prod.db < $VPS_PATH/prisma/migrations/20250109193300_add_imap_uid/migration.sql || true"

  echo "🗄️  Prisma db push + generate на VPS..."
  ssh -o StrictHostKeyChecking=no "$SERVER" "cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && sudo -u metrika -H bash -lc 'cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && npm run db:setup'"

  echo "🏗️  Сборка Next.js на VPS..."
  ssh -o StrictHostKeyChecking=no "$SERVER" "cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && export OPENAI_API_KEY=placeholder-for-build && export NODE_ENV=production && sudo -u metrika -H bash -lc 'cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && export OPENAI_API_KEY=placeholder-for-build && export NODE_ENV=production && npm run build'"

  echo "🔄 Перезапуск сервиса на VPS..."
  ssh -o StrictHostKeyChecking=no "$SERVER" "systemctl restart metrika5"
fi

echo "✅ Деплой завершен!"
