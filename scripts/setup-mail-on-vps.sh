#!/bin/bash

# Скрипт автоматической настройки почтового сервера на VPS
# Использование: ./scripts/setup-mail-on-vps.sh

set -e

echo "📧 Настройка почтового сервера для metrika.direct"
echo "=================================================="

# Проверка параметров
if [ -z "$VPS_HOST" ] || [ -z "$VPS_USER" ]; then
    echo "❌ Укажите переменные окружения:"
    echo "   export VPS_HOST=your-server-ip-or-hostname"
    echo "   export VPS_USER=root"
    echo "   export VPS_PASSWORD='your-password'"
    exit 1
fi

VPS_PASSWORD=${VPS_PASSWORD:-""}
DOMAIN="metrika.direct"
MAIL_HOST="mail.metrika.direct"

echo "✅ Подключение к серверу: $VPS_USER@$VPS_HOST"

# Функция для выполнения команд на удаленном сервере
ssh_exec() {
    if [ -z "$VPS_PASSWORD" ]; then
        ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "$@"
    else
        sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "$@"
    fi
}

# Проверка подключения
echo "🔌 Проверка подключения..."
if ! ssh_exec "echo 'Connected successfully'"; then
    echo "❌ Не удалось подключиться к серверу"
    exit 1
fi

echo "✅ Подключение установлено"

# Определение ОС
echo "📦 Определение операционной системы..."
OS_INFO=$(ssh_exec "cat /etc/os-release | grep '^ID=' | cut -d'=' -f2 | tr -d '\"'")
OS_VERSION=$(ssh_exec "cat /etc/os-release | grep '^VERSION_ID=' | cut -d'=' -f2 | tr -d '\"' | cut -d'.' -f1")

echo "✅ Обнаружена ОС: $OS_INFO $OS_VERSION"

# Выбор метода установки
echo ""
echo "Выберите метод установки:"
echo "1) Mail-in-a-Box (рекомендуется - автоматическая настройка всего)"
echo "2) Postfix + Dovecot (ручная настройка)"
read -p "Ваш выбор (1-2): " INSTALL_METHOD

case $INSTALL_METHOD in
    1)
        echo "📦 Установка Mail-in-a-Box..."
        
        # Проверка, что это чистая Ubuntu
        if [ "$OS_INFO" != "ubuntu" ] || [ "$OS_VERSION" -lt 20 ]; then
            echo "❌ Mail-in-a-Box требует Ubuntu 20.04 или новее"
            exit 1
        fi
        
        # Копируем скрипт установки на сервер
        ssh_exec "cd /root && git clone https://github.com/mail-in-a-box/mailinabox.git 2>/dev/null || (cd mailinabox && git pull)"
        
        echo "⚠️  Mail-in-a-Box требует интерактивную установку"
        echo "   Подключитесь к серверу: ssh $VPS_USER@$VPS_HOST"
        echo "   Запустите: cd /root/mailinabox && sudo setup/start.sh"
        echo "   Укажите hostname: $MAIL_HOST"
        ;;
    2)
        echo "📦 Установка Postfix + Dovecot..."
        
        # Копируем скрипт установки на сервер
        scp -o StrictHostKeyChecking=no scripts/install-postfix-dovecot.sh "$VPS_USER@$VPS_HOST:/root/" || {
            echo "⚠️  Используем sshpass для копирования..."
            sshpass -p "$VPS_PASSWORD" scp -o StrictHostKeyChecking=no scripts/install-postfix-dovecot.sh "$VPS_USER@$VPS_HOST:/root/"
        }
        
        # Запускаем установку
        SERVER_IP=$(ssh_exec "hostname -I | awk '{print \$1}'")
        ssh_exec "chmod +x /root/install-postfix-dovecot.sh && /root/install-postfix-dovecot.sh $DOMAIN $MAIL_HOST $SERVER_IP"
        
        echo "✅ Postfix + Dovecot установлены"
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
echo "   IMAP_PASS=\"пароль_от_почтового_ящика\""

