#!/bin/bash

# Скрипт для подключения к VPS и быстрой настройки
# Использование: ./scripts/connect-to-vps.sh

set -e

VPS_HOST="${VPS_HOST:-}"
VPS_USER="${VPS_USER:-root}"
VPS_PASSWORD="${VPS_PASSWORD:-}"

if [ -z "$VPS_HOST" ]; then
    read -p "Введите IP адрес или hostname сервера: " VPS_HOST
fi

if [ -z "$VPS_PASSWORD" ]; then
    echo "Введите пароль от VPS (будет скрыт):"
    read -rs VPS_PASSWORD
    echo ""
fi

echo "🔌 Подключение к $VPS_USER@$VPS_HOST..."

# Используем expect для автоматического ввода пароля
expect <<EOF
set timeout 30
spawn ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST
expect {
    "password:" {
        send "$VPS_PASSWORD\r"
        expect "# "
        send "echo 'Connected successfully'\r"
        interact
    }
    "yes/no" {
        send "yes\r"
        expect "password:"
        send "$VPS_PASSWORD\r"
        expect "# "
        send "echo 'Connected successfully'\r"
        interact
    }
    timeout {
        puts "Connection timeout"
        exit 1
    }
}
EOF
