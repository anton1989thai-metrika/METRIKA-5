#!/bin/bash

# Упрощенный скрипт для синхронизации файлов с VPS
set -e

SERVER="root@72.62.72.196"
VPS_PATH="/var/www/metrika5"
LOCAL_BACKUP="/tmp/vps-backup-metrika5"

echo "📥 Скачивание файлов с VPS..."
echo "Введите пароль когда попросит: SikaAnt7Hostinger7+"

mkdir -p "$LOCAL_BACKUP"

# Используем scp рекурсивно
rsync -avz --progress \
  -e "ssh -o StrictHostKeyChecking=no" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='out' \
  --exclude='.git' \
  --exclude='*.db' \
  --exclude='*.db-journal' \
  --exclude='.env*' \
  --exclude='dist' \
  --exclude='build' \
  "$SERVER:$VPS_PATH/" "$LOCAL_BACKUP/"

echo "✅ Файлы скачаны в $LOCAL_BACKUP"

