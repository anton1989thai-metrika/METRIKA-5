#!/bin/bash

# Исправление проблемы: auth-master: userdb lookup failed для системных пользователей
# Использование: sudo ./fix-lmtp-userdb-issue.sh

set -e

echo "🔧 Исправление userdb lookup для системных пользователей"
echo "========================================================="

# Создаем резервную копию
BACKUP_DIR="/root/dovecot-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "💾 Резервная копия: $BACKUP_DIR"

CONF_DIR="/etc/dovecot/conf.d"
[ -d "$CONF_DIR" ] || CONF_DIR="/etc/dovecot"

cp -r "$CONF_DIR" "$BACKUP_DIR/conf.d" 2>/dev/null || true

echo ""
echo "1️⃣ Исправление userdb для системных пользователей..."

# Создаем/обновляем 10-auth.conf
cat > "$CONF_DIR/10-auth.conf" << 'EOF'
# Authentication для системных пользователей
passdb {
  driver = pam
  args = session=yes dovecot
}

# User database для системных пользователей
# Используем passwd для чтения системных пользователей
userdb {
  driver = passwd
  args = blocking=no
}
EOF

echo "   ✅ Настроен userdb passwd"

echo ""
echo "2️⃣ Настройка mail_location для системных пользователей..."

# Создаем/обновляем 10-mail.conf
cat > "$CONF_DIR/10-mail.conf" << 'EOF'
# Mail location для системных пользователей (mbox формат)
# INBOX будет в /var/mail/username
mail_location = mbox:~/mail:INBOX=/var/mail/%u

# Разрешения
mail_privileged_group = mail
EOF

echo "   ✅ Настроен mail_location = mbox:~/mail:INBOX=/var/mail/%u"

echo ""
echo "3️⃣ Настройка service lmtp с правильным user..."

# Обновляем 10-master.conf
if [ -f "$CONF_DIR/10-master.conf" ]; then
    # Удаляем старую секцию lmtp если есть
    sed -i '/^service lmtp {/,/^}/d' "$CONF_DIR/10-master.conf"
fi

cat >> "$CONF_DIR/10-master.conf" << 'EOF'

# LMTP service для доставки от Postfix
service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
  # Важно: user = root для доступа к системным пользователям
  user = root
}
EOF

echo "   ✅ Настроен service lmtp с user = root"

echo ""
echo "4️⃣ Настройка service auth для LMTP..."

# Добавляем auth service если его нет
if ! grep -q "^service auth {" "$CONF_DIR/10-master.conf"; then
    cat >> "$CONF_DIR/10-master.conf" << 'EOF'

# Auth service
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
  user = root
}
EOF
    echo "   ✅ Добавлен service auth"
else
    echo "   ℹ️  service auth уже существует"
fi

echo ""
echo "5️⃣ Исправление Postfix конфигурации..."

# Убираем metrika.direct из mydestination если есть virtual_mailbox_domains
VIRTUAL_DOMAINS=$(postconf -h virtual_mailbox_domains 2>/dev/null || echo "")
MYDESTINATION=$(postconf -h mydestination 2>/dev/null || echo "")

if [ -n "$VIRTUAL_DOMAINS" ] && echo "$MYDESTINATION" | grep -q "metrika.direct"; then
    echo "   ⚠️  Убираю metrika.direct из mydestination (конфликт с virtual_mailbox_domains)"
    NEW_DEST=$(echo "$MYDESTINATION" | sed 's/,\?metrika\.direct//g' | sed 's/^,\|,$//g' | sed 's/  */ /g')
    if [ -n "$NEW_DEST" ]; then
        postconf -e "mydestination = $NEW_DEST"
    else
        postconf -e "mydestination = \$myhostname, localhost.\$mydomain, localhost"
    fi
    echo "   ✅ mydestination обновлен"
else
    echo "   ℹ️  Конфликта не обнаружено"
fi

# Убеждаемся что virtual_transport настроен
CURRENT_VT=$(postconf -h virtual_transport 2>/dev/null || echo "")
if [ "$CURRENT_VT" != "lmtp:unix:private/dovecot-lmtp" ]; then
    postconf -e "virtual_transport = lmtp:unix:private/dovecot-lmtp"
    echo "   ✅ Настроен virtual_transport = lmtp:unix:private/dovecot-lmtp"
else
    echo "   ℹ️  virtual_transport уже настроен"
fi

echo ""
echo "6️⃣ Создание почтовых директорий для пользователя info..."

if id info >/dev/null 2>&1; then
    INFO_HOME=$(getent passwd info | cut -d: -f6)
    
    # Создаем директорию mail в домашней директории
    if [ -n "$INFO_HOME" ] && [ "$INFO_HOME" != "/" ]; then
        mkdir -p "$INFO_HOME/mail"
        chown info:mail "$INFO_HOME/mail"
        chmod 700 "$INFO_HOME/mail"
        echo "   ✅ Создана $INFO_HOME/mail"
    fi
    
    # Создаем/проверяем /var/mail/info
    if [ ! -f /var/mail/info ]; then
        touch /var/mail/info
        chown info:mail /var/mail/info
        chmod 600 /var/mail/info
        echo "   ✅ Создан /var/mail/info"
    else
        chown info:mail /var/mail/info
        chmod 600 /var/mail/info
        echo "   ✅ Обновлены права на /var/mail/info"
    fi
else
    echo "   ⚠️  Пользователь info не найден"
fi

echo ""
echo "7️⃣ Проверка конфигурации Dovecot..."

if doveconf -n > /dev/null 2>&1; then
    echo "   ✅ Конфигурация Dovecot корректна"
    
    # Показываем ключевые настройки
    echo ""
    echo "   📋 Ключевые настройки:"
    doveconf -n | grep -E "(userdb|passdb|mail_location|service lmtp|service auth)" | head -10
else
    echo "   ❌ Ошибки в конфигурации Dovecot:"
    doveconf -n 2>&1 | head -20
    exit 1
fi

echo ""
echo "8️⃣ Перезапуск сервисов..."

systemctl restart dovecot
sleep 2
systemctl restart postfix
sleep 2

echo "   ✅ Сервисы перезапущены"

echo ""
echo "9️⃣ Проверка статуса сервисов..."

if systemctl is-active --quiet dovecot; then
    echo "   ✅ Dovecot работает"
else
    echo "   ❌ Dovecot не работает"
    systemctl status dovecot --no-pager -l | head -20
fi

if systemctl is-active --quiet postfix; then
    echo "   ✅ Postfix работает"
else
    echo "   ❌ Postfix не работает"
    systemctl status postfix --no-pager -l | head -20
fi

echo ""
echo "🧪 Тестирование доставки..."

# Очищаем очередь
postqueue -f

# Отправляем тестовое письмо
echo "Test message $(date)" | sendmail -v info@metrika.direct 2>&1 | head -20

sleep 3

echo ""
echo "📋 Проверка логов (последние 20 строк):"
echo "----------------------------------------"
echo "Dovecot:"
tail -20 /var/log/dovecot.log | grep -i "lmtp\|info\|delivered\|userdb\|error" || echo "Нет записей"
echo ""
echo "Postfix:"
tail -20 /var/log/mail.log | grep -i "info@metrika\|delivered\|sent\|deferred" || echo "Нет записей"

echo ""
echo "✅ Исправления применены!"
echo "💾 Резервная копия: $BACKUP_DIR"
echo ""
echo "Проверьте логи выше. Если есть ошибки, проверьте:"
echo "  - tail -f /var/log/dovecot.log"
echo "  - tail -f /var/log/mail.log"
echo "  - postqueue -p"

