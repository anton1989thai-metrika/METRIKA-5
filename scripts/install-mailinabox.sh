#!/bin/bash

# Установка Mail-in-a-Box
# Использование: sudo ./scripts/install-mailinabox.sh domain mail_host server_ip

set -e

DOMAIN=${1:-metrika.direct}
MAIL_HOST=${2:-mail.metrika.direct}
SERVER_IP=${3}

echo "📧 Установка Mail-in-a-Box для $DOMAIN"
echo "======================================"

# Проверка root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Запустите скрипт с sudo"
    exit 1
fi

# Проверка ОС (только Ubuntu 20.04/22.04)
if [ ! -f /etc/os-release ]; then
    echo "❌ Не удалось определить ОС"
    exit 1
fi

. /etc/os-release

if [ "$ID" != "ubuntu" ]; then
    echo "❌ Mail-in-a-Box работает только на Ubuntu"
    exit 1
fi

echo "✅ Обнаружена Ubuntu $VERSION_ID"

# Обновление системы
echo "📦 Обновление системы..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y

# Установка зависимостей
echo "📦 Установка зависимостей..."
apt-get install -y git curl

# Клонирование Mail-in-a-Box
echo "📦 Клонирование Mail-in-a-Box..."
cd /root
if [ -d "mailinabox" ]; then
    cd mailinabox
    git pull
else
    git clone https://github.com/mail-in-a-box/mailinabox.git
    cd mailinabox
fi

# Запуск установки
echo "🚀 Запуск установки Mail-in-a-Box..."
echo ""
echo "⚠️  ВНИМАНИЕ: Mail-in-a-Box запустит интерактивную установку"
echo "   Вам нужно будет указать:"
echo "   - Hostname: $MAIL_HOST"
echo "   - Email адрес администратора: admin@$DOMAIN"
echo "   - Пароль администратора"
echo ""
read -p "Продолжить? (y/n): " CONTINUE

if [ "$CONTINUE" != "y" ]; then
    echo "❌ Установка отменена"
    exit 1
fi

# Запуск установщика
./setup/start.sh

echo ""
echo "✅ Mail-in-a-Box установлен!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Войдите в веб-интерфейс: https://$MAIL_HOST/admin"
echo "2. Создайте почтовый ящик reg@$DOMAIN"
echo "3. Настройте DNS записи (см. scripts/dns-config.txt)"
echo "4. Обновите .env на вашем сайте"

