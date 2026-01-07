#!/bin/bash

# Скрипт автоматической установки почтового сервера
# Использование: sudo ./scripts/setup-mail-server.sh

set -e

echo "📧 Настройка почтового сервера для metrika.direct"
echo "=================================================="

# Проверка root доступа
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Запустите скрипт с sudo: sudo ./scripts/setup-mail-server.sh"
    exit 1
fi

# Определение ОС
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
else
    echo "❌ Не удалось определить ОС"
    exit 1
fi

echo "✅ Обнаружена ОС: $OS $VER"

# Запрос информации
read -p "Введите IP адрес сервера: " SERVER_IP
read -p "Введите домен (по умолчанию metrika.direct): " DOMAIN
DOMAIN=${DOMAIN:-metrika.direct}

read -p "Введите имя почтового сервера (по умолчанию mail.$DOMAIN): " MAIL_HOST
MAIL_HOST=${MAIL_HOST:-mail.$DOMAIN}

read -p "Создать почтовый ящик reg@$DOMAIN? (y/n): " CREATE_USER
if [ "$CREATE_USER" = "y" ]; then
    read -sp "Введите пароль для reg@$DOMAIN: " USER_PASS
    echo
fi

echo ""
echo "Выберите метод установки:"
echo "1) Mail-in-a-Box (рекомендуется для новичков)"
echo "2) iRedMail (полнофункциональный)"
echo "3) Postfix + Dovecot (ручная настройка)"
read -p "Ваш выбор (1-3): " INSTALL_METHOD

case $INSTALL_METHOD in
    1)
        echo "📦 Установка Mail-in-a-Box..."
        ./scripts/install-mailinabox.sh "$DOMAIN" "$MAIL_HOST" "$SERVER_IP"
        ;;
    2)
        echo "📦 Установка iRedMail..."
        ./scripts/install-iredmail.sh "$DOMAIN" "$MAIL_HOST" "$SERVER_IP"
        ;;
    3)
        echo "📦 Установка Postfix + Dovecot..."
        ./scripts/install-postfix-dovecot.sh "$DOMAIN" "$MAIL_HOST" "$SERVER_IP" "$USER_PASS"
        ;;
    *)
        echo "❌ Неверный выбор"
        exit 1
        ;;
esac

echo ""
echo "✅ Установка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте DNS записи (см. scripts/dns-config.txt)"
echo "2. Обновите .env файл на вашем сайте:"
echo "   IMAP_HOST=\"$MAIL_HOST\""
echo "   IMAP_PORT=\"993\""
echo "   IMAP_USER=\"reg@$DOMAIN\""
echo "   IMAP_PASS=\"ваш_пароль\""
echo ""
echo "3. Протестируйте подключение:"
echo "   curl -X POST http://localhost:3000/api/emails/sync"

