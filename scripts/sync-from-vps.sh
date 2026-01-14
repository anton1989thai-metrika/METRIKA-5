#!/bin/bash

# Скрипт для синхронизации файлов с VPS на локальную машину
# Использование: ./scripts/sync-from-vps.sh

set -e

SERVER="root@72.62.72.196"
VPS_PATH="/var/www/metrika5"
PASSWORD="${VPS_PASSWORD:-}"
LOCAL_BACKUP="/tmp/vps-backup-metrika5"

echo "📥 Скачивание файлов с VPS..."

if [ -z "$PASSWORD" ]; then
  echo "Введите пароль от VPS (будет скрыт):"
  read -rs PASSWORD
  echo ""
fi

# Исключаем node_modules, .next, и другие временные файлы
EXCLUDE="--exclude='node_modules' --exclude='.next' --exclude='out' --exclude='.git' --exclude='*.db' --exclude='*.db-journal' --exclude='.env' --exclude='.env.local'"

# Создаем временную директорию для бэкапа
mkdir -p "$LOCAL_BACKUP"

# Используем expect для автоматизации rsync
expect << EOF
set timeout 600
spawn rsync -avz --progress -e "ssh -o StrictHostKeyChecking=no" $EXCLUDE $SERVER:$VPS_PATH/ $LOCAL_BACKUP/
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

echo "✅ Файлы скачаны в $LOCAL_BACKUP"
echo "📁 Проверьте содержимое перед синхронизацией"
