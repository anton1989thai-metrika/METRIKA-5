#!/bin/bash

# Скрипт для исправления проблемы с LMTP доставкой в Dovecot
# Использование: sudo ./fix-lmtp-delivery.sh

set -e

echo "🔍 Анализ текущей конфигурации..."
echo "=================================="

# Проверка конфигурации Dovecot
echo ""
echo "📋 Конфигурация Dovecot (doveconf -n):"
doveconf -n | grep -E "(service lmtp|userdb|passdb|mail_location)" || true

# Проверка конфигурации Postfix
echo ""
echo "📋 Конфигурация Postfix (postconf -n):"
postconf -n | grep -E "(virtual_transport|mydestination|virtual_mailbox_domains|mydomain)" || true

# Проверка пользователя info
echo ""
echo "👤 Проверка пользователя info:"
id info || echo "Пользователь info не найден"
getent passwd info || echo "Пользователь info не в passwd"

# Проверка логов
echo ""
echo "📋 Последние ошибки в логах Dovecot:"
tail -30 /var/log/dovecot.log | grep -i "userdb\|auth-master\|lmtp\|error" || echo "Нет ошибок в последних 30 строках"

echo ""
echo "🔧 Исправление конфигурации..."
echo "=================================="

# Проверка существования конфигурационных файлов
DOVECOT_CONF="/etc/dovecot/dovecot.conf"
DOVECOT_CONF_D="/etc/dovecot/conf.d"

if [ -d "$DOVECOT_CONF_D" ]; then
    CONF_DIR="$DOVECOT_CONF_D"
else
    CONF_DIR="/etc/dovecot"
fi

# Создаем резервную копию
BACKUP_DIR="/root/dovecot-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "💾 Создана резервная копия в $BACKUP_DIR"

if [ -f "$DOVECOT_CONF" ]; then
    cp "$DOVECOT_CONF" "$BACKUP_DIR/"
fi
if [ -d "$CONF_DIR" ]; then
    cp -r "$CONF_DIR" "$BACKUP_DIR/conf.d"
fi

# Исправление 1: Настройка userdb для системных пользователей
echo ""
echo "1️⃣ Настройка userdb для системных пользователей..."

# Проверяем, есть ли уже настройка userdb
if [ -f "$CONF_DIR/10-auth.conf" ]; then
    # Проверяем текущую конфигурацию
    if ! grep -q "userdb.*passwd" "$CONF_DIR/10-auth.conf" 2>/dev/null; then
        echo "   Добавляю userdb passwd..."
        cat >> "$CONF_DIR/10-auth.conf" << 'EOF'

# User database для системных пользователей
userdb {
  driver = passwd
}
EOF
    else
        echo "   userdb passwd уже настроен"
    fi
else
    # Создаем файл если его нет
    cat > "$CONF_DIR/10-auth.conf" << 'EOF'
# Authentication configuration
passdb {
  driver = pam
}

# User database для системных пользователей
userdb {
  driver = passwd
}
EOF
fi

# Исправление 2: Настройка mail_location для системных пользователей
echo ""
echo "2️⃣ Настройка mail_location..."

if [ -f "$CONF_DIR/10-mail.conf" ]; then
    # Проверяем текущую mail_location
    if grep -q "mail_location.*maildir" "$CONF_DIR/10-mail.conf"; then
        echo "   mail_location уже настроен"
    else
        echo "   Настраиваю mail_location для системных пользователей..."
        # Добавляем или заменяем mail_location
        if grep -q "^mail_location" "$CONF_DIR/10-mail.conf"; then
            sed -i 's|^mail_location.*|mail_location = mbox:~/mail:INBOX=/var/mail/%u|' "$CONF_DIR/10-mail.conf"
        else
            echo "mail_location = mbox:~/mail:INBOX=/var/mail/%u" >> "$CONF_DIR/10-mail.conf"
        fi
    fi
else
    cat > "$CONF_DIR/10-mail.conf" << 'EOF'
# Mail location для системных пользователей
mail_location = mbox:~/mail:INBOX=/var/mail/%u
EOF
fi

# Исправление 3: Настройка service lmtp для правильной работы с системными пользователями
echo ""
echo "3️⃣ Настройка service lmtp..."

if [ -f "$CONF_DIR/10-master.conf" ]; then
    # Проверяем настройку lmtp
    if ! grep -q "service lmtp" "$CONF_DIR/10-master.conf"; then
        echo "   Добавляю настройку service lmtp..."
        cat >> "$CONF_DIR/10-master.conf" << 'EOF'

service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
  user = root
}
EOF
    else
        echo "   service lmtp уже настроен"
        # Проверяем, что user = root
        if ! grep -A 5 "service lmtp" "$CONF_DIR/10-master.conf" | grep -q "user = root"; then
            echo "   Обновляю user для lmtp на root..."
            sed -i '/service lmtp/,/^}/ s/user = .*/user = root/' "$CONF_DIR/10-master.conf"
        fi
    fi
else
    cat > "$CONF_DIR/10-master.conf" << 'EOF'
service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
  user = root
}
EOF
fi

# Исправление 4: Проверка и исправление Postfix
echo ""
echo "4️⃣ Проверка конфигурации Postfix..."

# Проверяем virtual_transport
CURRENT_VIRTUAL_TRANSPORT=$(postconf -h virtual_transport 2>/dev/null || echo "")
if [ "$CURRENT_VIRTUAL_TRANSPORT" != "lmtp:unix:private/dovecot-lmtp" ]; then
    echo "   Настраиваю virtual_transport..."
    postconf -e "virtual_transport = lmtp:unix:private/dovecot-lmtp"
else
    echo "   virtual_transport уже настроен"
fi

# Проверяем конфликт mydestination и virtual_mailbox_domains
MYDESTINATION=$(postconf -h mydestination 2>/dev/null || echo "")
VIRTUAL_DOMAINS=$(postconf -h virtual_mailbox_domains 2>/dev/null || echo "")

if [ -n "$VIRTUAL_DOMAINS" ] && echo "$MYDESTINATION" | grep -q "metrika.direct"; then
    echo "   ⚠️  Обнаружен потенциальный конфликт: metrika.direct в mydestination и virtual_mailbox_domains"
    echo "   Убираю metrika.direct из mydestination..."
    NEW_DESTINATION=$(echo "$MYDESTINATION" | sed 's/,\?metrika\.direct//g' | sed 's/^,\|,$//g')
    if [ -n "$NEW_DESTINATION" ]; then
        postconf -e "mydestination = $NEW_DESTINATION"
    else
        postconf -e "mydestination = \$myhostname, localhost.\$mydomain, localhost"
    fi
fi

# Исправление 5: Создание директории для почты пользователя info
echo ""
echo "5️⃣ Создание директорий для почты..."

if id info >/dev/null 2>&1; then
    INFO_HOME=$(getent passwd info | cut -d: -f6)
    if [ -n "$INFO_HOME" ] && [ "$INFO_HOME" != "/" ]; then
        mkdir -p "$INFO_HOME/mail"
        chown info:mail "$INFO_HOME/mail"
        chmod 700 "$INFO_HOME/mail"
        echo "   Создана директория $INFO_HOME/mail для пользователя info"
    fi
    
    # Также проверяем /var/mail/info
    if [ ! -f /var/mail/info ]; then
        touch /var/mail/info
        chown info:mail /var/mail/info
        chmod 600 /var/mail/info
        echo "   Создан файл /var/mail/info"
    fi
fi

# Проверка конфигурации
echo ""
echo "✅ Проверка конфигурации..."
doveconf -n > /dev/null 2>&1 && echo "   Dovecot конфигурация корректна" || echo "   ⚠️  Ошибки в конфигурации Dovecot"

# Перезапуск сервисов
echo ""
echo "🔄 Перезапуск сервисов..."
systemctl restart dovecot
systemctl restart postfix

sleep 2

# Проверка статуса
echo ""
echo "📊 Статус сервисов:"
systemctl status dovecot --no-pager -l | head -10
echo ""
systemctl status postfix --no-pager -l | head -10

# Тест доставки
echo ""
echo "🧪 Тестирование доставки..."
echo "test message $(date)" | sendmail -v info@metrika.direct 2>&1 | head -20

sleep 3

# Проверка логов
echo ""
echo "📋 Последние записи в логах:"
tail -20 /var/log/dovecot.log | grep -i "lmtp\|info\|delivered" || echo "Нет записей о доставке"
tail -20 /var/log/mail.log | grep -i "info@metrika\|delivered\|sent" || echo "Нет записей в mail.log"

echo ""
echo "✅ Готово! Проверьте логи выше на наличие ошибок."
echo "💾 Резервная копия сохранена в: $BACKUP_DIR"

