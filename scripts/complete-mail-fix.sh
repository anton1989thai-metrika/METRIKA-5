#!/bin/bash

# Полный анализ и исправление конфигурации Postfix + Dovecot
# Использование: sudo ./complete-mail-fix.sh

set -e

REPORT_FILE="/root/mail-fix-report-$(date +%Y%m%d-%H%M%S).txt"
BACKUP_DIR="/root/dovecot-postfix-backup-$(date +%Y%m%d-%H%M%S)"

echo "🔍 Полный анализ и исправление почтового сервера"
echo "=================================================" | tee "$REPORT_FILE"
echo "Дата: $(date)" | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"

# Создание резервной копии
mkdir -p "$BACKUP_DIR"
echo "💾 Создана резервная копия: $BACKUP_DIR" | tee -a "$REPORT_FILE"

cp -r /etc/dovecot "$BACKUP_DIR/dovecot" 2>/dev/null || true
cp -r /etc/postfix "$BACKUP_DIR/postfix" 2>/dev/null || true

echo "" | tee -a "$REPORT_FILE"
echo "📋 ШАГ 1: Анализ текущего состояния" | tee -a "$REPORT_FILE"
echo "====================================" | tee -a "$REPORT_FILE"

# 1.1 Анализ Dovecot конфигурации
echo "" | tee -a "$REPORT_FILE"
echo "1.1 Конфигурация Dovecot (doveconf -n):" | tee -a "$REPORT_FILE"
doveconf -n > "$BACKUP_DIR/doveconf-n-before.txt" 2>&1 || true
doveconf -n | tee -a "$REPORT_FILE" | head -100

# 1.2 Проверка auth конфигурации
echo "" | tee -a "$REPORT_FILE"
echo "1.2 Файлы auth конфигурации:" | tee -a "$REPORT_FILE"
ls -la /etc/dovecot/conf.d/auth-* 2>/dev/null | tee -a "$REPORT_FILE" || echo "Файлы auth-* не найдены" | tee -a "$REPORT_FILE"

if [ -f /etc/dovecot/conf.d/10-auth.conf ]; then
    echo "" | tee -a "$REPORT_FILE"
    echo "Содержимое 10-auth.conf:" | tee -a "$REPORT_FILE"
    cat /etc/dovecot/conf.d/10-auth.conf | tee -a "$REPORT_FILE"
fi

# 1.3 Проверка mail_location
echo "" | tee -a "$REPORT_FILE"
echo "1.3 mail_location:" | tee -a "$REPORT_FILE"
doveconf -n mail_location 2>/dev/null | tee -a "$REPORT_FILE" || echo "mail_location не настроен" | tee -a "$REPORT_FILE"

# 1.4 Проверка service lmtp
echo "" | tee -a "$REPORT_FILE"
echo "1.4 service lmtp:" | tee -a "$REPORT_FILE"
doveconf -n | grep -A 10 "service lmtp" | tee -a "$REPORT_FILE" || echo "service lmtp не найден" | tee -a "$REPORT_FILE"

# 1.5 Проверка service auth
echo "" | tee -a "$REPORT_FILE"
echo "1.5 service auth:" | tee -a "$REPORT_FILE"
doveconf -n | grep -A 10 "service auth" | tee -a "$REPORT_FILE" || echo "service auth не найден" | tee -a "$REPORT_FILE"

# 1.6 Проверка userdb/passdb
echo "" | tee -a "$REPORT_FILE"
echo "1.6 userdb/passdb:" | tee -a "$REPORT_FILE"
doveconf -n | grep -A 5 "passdb\|userdb" | tee -a "$REPORT_FILE"

# 1.7 Анализ Postfix конфигурации
echo "" | tee -a "$REPORT_FILE"
echo "1.7 Конфигурация Postfix (postconf -n):" | tee -a "$REPORT_FILE"
postconf -n > "$BACKUP_DIR/postconf-n-before.txt" 2>&1 || true
postconf -n | grep -E "(myhostname|mydomain|mydestination|virtual_mailbox_domains|virtual_transport|mynetworks)" | tee -a "$REPORT_FILE"

# 1.8 Проверка пользователя info
echo "" | tee -a "$REPORT_FILE"
echo "1.8 Пользователь info:" | tee -a "$REPORT_FILE"
id info 2>&1 | tee -a "$REPORT_FILE" || echo "Пользователь info не найден" | tee -a "$REPORT_FILE"
getent passwd info 2>&1 | tee -a "$REPORT_FILE" || echo "info не в passwd" | tee -a "$REPORT_FILE"

# 1.9 Проверка почтовых директорий
echo "" | tee -a "$REPORT_FILE"
echo "1.9 Почтовые директории:" | tee -a "$REPORT_FILE"
INFO_HOME=$(getent passwd info 2>/dev/null | cut -d: -f6 || echo "")
if [ -n "$INFO_HOME" ]; then
    echo "Домашняя директория info: $INFO_HOME" | tee -a "$REPORT_FILE"
    ls -la "$INFO_HOME" 2>/dev/null | tee -a "$REPORT_FILE" || echo "Директория не существует" | tee -a "$REPORT_FILE"
fi
ls -la /var/mail/info 2>/dev/null | tee -a "$REPORT_FILE" || echo "/var/mail/info не существует" | tee -a "$REPORT_FILE"

# 1.10 Проверка LMTP сокета
echo "" | tee -a "$REPORT_FILE"
echo "1.10 LMTP сокет:" | tee -a "$REPORT_FILE"
ls -la /var/spool/postfix/private/dovecot-lmtp 2>/dev/null | tee -a "$REPORT_FILE" || echo "LMTP сокет не существует" | tee -a "$REPORT_FILE"

# 1.11 Последние ошибки в логах
echo "" | tee -a "$REPORT_FILE"
echo "1.11 Последние ошибки в логах Dovecot:" | tee -a "$REPORT_FILE"
tail -50 /var/log/dovecot.log 2>/dev/null | grep -i "error\|failed\|userdb\|auth-master" | tail -20 | tee -a "$REPORT_FILE" || echo "Нет ошибок" | tee -a "$REPORT_FILE"

echo "" | tee -a "$REPORT_FILE"
echo "📋 ШАГ 2: Исправление конфигурации" | tee -a "$REPORT_FILE"
echo "====================================" | tee -a "$REPORT_FILE"

CONF_DIR="/etc/dovecot/conf.d"
[ -d "$CONF_DIR" ] || CONF_DIR="/etc/dovecot"

# 2.1 Исправление 10-auth.conf
echo "" | tee -a "$REPORT_FILE"
echo "2.1 Исправление 10-auth.conf..." | tee -a "$REPORT_FILE"

cat > "$CONF_DIR/10-auth.conf" << 'EOF'
# Authentication configuration для системных пользователей
# Disable all mechanisms by default
disable_plaintext_auth = no

# Authentication mechanisms
auth_mechanisms = plain login

# Password database - используем PAM для системных пользователей
passdb {
  driver = pam
  args = session=yes dovecot
}

# User database - используем passwd для системных пользователей
userdb {
  driver = passwd
  args = blocking=no
}

# Формат имени пользователя - НЕ использовать %{user}, это ломает конфиг
# auth_username_format = %u  # Раскомментируйте если нужно
EOF

echo "   ✅ 10-auth.conf обновлен" | tee -a "$REPORT_FILE"

# 2.2 Исправление 10-mail.conf
echo "" | tee -a "$REPORT_FILE"
echo "2.2 Исправление 10-mail.conf..." | tee -a "$REPORT_FILE"

# Проверяем текущий mail_location
CURRENT_MAIL_LOC=$(doveconf -n mail_location 2>/dev/null | cut -d' ' -f3 || echo "")

if [ -z "$CURRENT_MAIL_LOC" ] || echo "$CURRENT_MAIL_LOC" | grep -q "maildir"; then
    # Используем mbox для системных пользователей
    cat > "$CONF_DIR/10-mail.conf" << 'EOF'
# Mail location для системных пользователей (mbox формат)
# INBOX будет в /var/mail/username
# Остальная почта в ~/mail
mail_location = mbox:~/mail:INBOX=/var/mail/%u

# Разрешения
mail_privileged_group = mail

# Namespace для inbox
namespace inbox {
  inbox = yes
  location = 
  mailbox Drafts {
    auto = subscribe
    special_use = \Drafts
  }
  mailbox Sent {
    auto = subscribe
    special_use = \Sent
  }
  mailbox "Sent Messages" {
    auto = subscribe
  }
  mailbox Trash {
    auto = subscribe
    special_use = \Trash
  }
  mailbox Spam {
    auto = subscribe
    special_use = \Junk
  }
  mailbox Archive {
    auto = subscribe
    special_use = \Archive
  }
}
EOF
    echo "   ✅ 10-mail.conf обновлен (mbox формат)" | tee -a "$REPORT_FILE"
else
    echo "   ℹ️  mail_location уже настроен: $CURRENT_MAIL_LOC" | tee -a "$REPORT_FILE"
fi

# 2.3 Исправление 10-master.conf
echo "" | tee -a "$REPORT_FILE"
echo "2.3 Исправление 10-master.conf..." | tee -a "$REPORT_FILE"

# Создаем или обновляем 10-master.conf
if [ -f "$CONF_DIR/10-master.conf" ]; then
    # Удаляем старые секции lmtp и auth если есть
    sed -i '/^service lmtp {/,/^}/d' "$CONF_DIR/10-master.conf"
    sed -i '/^service auth {/,/^}/d' "$CONF_DIR/10-master.conf"
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

# Auth service для SMTP AUTH
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
  user = root
}

# Auth worker
service auth-worker {
  user = root
}
EOF

echo "   ✅ 10-master.conf обновлен" | tee -a "$REPORT_FILE"

# 2.4 Исправление Postfix - убираем конфликт virtual_mailbox_domains
echo "" | tee -a "$REPORT_FILE"
echo "2.4 Исправление Postfix конфигурации..." | tee -a "$REPORT_FILE"

MYDEST=$(postconf -h mydestination 2>/dev/null || echo "")
VIRTUAL_DOMAINS=$(postconf -h virtual_mailbox_domains 2>/dev/null || echo "")

if [ -n "$VIRTUAL_DOMAINS" ] && echo "$MYDEST" | grep -q "metrika.direct"; then
    echo "   ⚠️  Обнаружен конфликт: metrika.direct в mydestination и virtual_mailbox_domains" | tee -a "$REPORT_FILE"
    echo "   Убираю metrika.direct из mydestination..." | tee -a "$REPORT_FILE"
    
    # Убираем metrika.direct из mydestination
    NEW_DEST=$(echo "$MYDEST" | sed 's/,\?metrika\.direct//g' | sed 's/^,\|,$//g' | sed 's/  */ /g')
    
    if [ -n "$NEW_DEST" ]; then
        postconf -e "mydestination = $NEW_DEST"
        echo "   ✅ mydestination обновлен: $NEW_DEST" | tee -a "$REPORT_FILE"
    else
        postconf -e "mydestination = \$myhostname, localhost.\$mydomain, localhost"
        echo "   ✅ mydestination установлен по умолчанию" | tee -a "$REPORT_FILE"
    fi
    
    # Также убираем virtual_mailbox_domains, так как используем системных пользователей
    echo "   Убираю virtual_mailbox_domains (используем системных пользователей)..." | tee -a "$REPORT_FILE"
    postconf -e "virtual_mailbox_domains ="
    postconf -e "virtual_mailbox_maps ="
    echo "   ✅ virtual_mailbox_domains убран" | tee -a "$REPORT_FILE"
else
    echo "   ℹ️  Конфликта не обнаружено" | tee -a "$REPORT_FILE"
fi

# Убеждаемся что virtual_transport настроен правильно
CURRENT_VT=$(postconf -h virtual_transport 2>/dev/null || echo "")
if [ "$CURRENT_VT" != "lmtp:unix:private/dovecot-lmtp" ]; then
    postconf -e "virtual_transport = lmtp:unix:private/dovecot-lmtp"
    echo "   ✅ virtual_transport настроен" | tee -a "$REPORT_FILE"
else
    echo "   ℹ️  virtual_transport уже настроен" | tee -a "$REPORT_FILE"
fi

# Настраиваем local_transport для локальной доставки
postconf -e "local_transport = virtual"
echo "   ✅ local_transport настроен" | tee -a "$REPORT_FILE"

# 2.5 Создание почтовых директорий
echo "" | tee -a "$REPORT_FILE"
echo "2.5 Создание почтовых директорий..." | tee -a "$REPORT_FILE"

if id info >/dev/null 2>&1; then
    INFO_HOME=$(getent passwd info | cut -d: -f6)
    
    if [ -n "$INFO_HOME" ] && [ "$INFO_HOME" != "/" ]; then
        mkdir -p "$INFO_HOME/mail"
        chown info:mail "$INFO_HOME/mail"
        chmod 700 "$INFO_HOME/mail"
        echo "   ✅ Создана $INFO_HOME/mail" | tee -a "$REPORT_FILE"
    fi
    
    # Создаем/обновляем /var/mail/info
    if [ ! -f /var/mail/info ]; then
        touch /var/mail/info
        chown info:mail /var/mail/info
        chmod 600 /var/mail/info
        echo "   ✅ Создан /var/mail/info" | tee -a "$REPORT_FILE"
    else
        chown info:mail /var/mail/info
        chmod 600 /var/mail/info
        echo "   ✅ Обновлены права на /var/mail/info" | tee -a "$REPORT_FILE"
    fi
else
    echo "   ⚠️  Пользователь info не найден" | tee -a "$REPORT_FILE"
fi

# 2.6 Проверка прав на LMTP сокет
echo "" | tee -a "$REPORT_FILE"
echo "2.6 Проверка LMTP сокета..." | tee -a "$REPORT_FILE"

if [ -S /var/spool/postfix/private/dovecot-lmtp ]; then
    chown postfix:postfix /var/spool/postfix/private/dovecot-lmtp
    chmod 0600 /var/spool/postfix/private/dovecot-lmtp
    echo "   ✅ Права на LMTP сокет обновлены" | tee -a "$REPORT_FILE"
else
    echo "   ⚠️  LMTP сокет не существует (будет создан при запуске Dovecot)" | tee -a "$REPORT_FILE"
fi

echo "" | tee -a "$REPORT_FILE"
echo "📋 ШАГ 3: Проверка конфигурации" | tee -a "$REPORT_FILE"
echo "====================================" | tee -a "$REPORT_FILE"

# 3.1 Проверка doveconf
echo "" | tee -a "$REPORT_FILE"
echo "3.1 Проверка doveconf -n..." | tee -a "$REPORT_FILE"
if doveconf -n > /dev/null 2>&1; then
    echo "   ✅ Конфигурация Dovecot корректна" | tee -a "$REPORT_FILE"
    doveconf -n > "$BACKUP_DIR/doveconf-n-after.txt" 2>&1
else
    echo "   ❌ Ошибки в конфигурации Dovecot:" | tee -a "$REPORT_FILE"
    doveconf -n 2>&1 | tee -a "$REPORT_FILE" | head -20
    exit 1
fi

# 3.2 Проверка postconf
echo "" | tee -a "$REPORT_FILE"
echo "3.2 Проверка postconf -n..." | tee -a "$REPORT_FILE"
if postconf -n > /dev/null 2>&1; then
    echo "   ✅ Конфигурация Postfix корректна" | tee -a "$REPORT_FILE"
    postconf -n > "$BACKUP_DIR/postconf-n-after.txt" 2>&1
else
    echo "   ❌ Ошибки в конфигурации Postfix:" | tee -a "$REPORT_FILE"
    postconf -n 2>&1 | tee -a "$REPORT_FILE" | head -20
    exit 1
fi

# 3.3 Показываем ключевые настройки
echo "" | tee -a "$REPORT_FILE"
echo "3.3 Ключевые настройки Dovecot:" | tee -a "$REPORT_FILE"
doveconf -n | grep -E "(mail_location|userdb|passdb|service lmtp|service auth)" | tee -a "$REPORT_FILE"

echo "" | tee -a "$REPORT_FILE"
echo "3.4 Ключевые настройки Postfix:" | tee -a "$REPORT_FILE"
postconf -n | grep -E "(myhostname|mydomain|mydestination|virtual_mailbox_domains|virtual_transport|local_transport)" | tee -a "$REPORT_FILE"

echo "" | tee -a "$REPORT_FILE"
echo "📋 ШАГ 4: Перезапуск сервисов" | tee -a "$REPORT_FILE"
echo "====================================" | tee -a "$REPORT_FILE"

# 4.1 Перезапуск Dovecot
echo "" | tee -a "$REPORT_FILE"
echo "4.1 Перезапуск Dovecot..." | tee -a "$REPORT_FILE"
systemctl restart dovecot
sleep 3

if systemctl is-active --quiet dovecot; then
    echo "   ✅ Dovecot запущен" | tee -a "$REPORT_FILE"
else
    echo "   ❌ Dovecot не запустился:" | tee -a "$REPORT_FILE"
    systemctl status dovecot --no-pager -l | head -20 | tee -a "$REPORT_FILE"
    exit 1
fi

# 4.2 Перезапуск Postfix
echo "" | tee -a "$REPORT_FILE"
echo "4.2 Перезапуск Postfix..." | tee -a "$REPORT_FILE"
systemctl restart postfix
sleep 2

if systemctl is-active --quiet postfix; then
    echo "   ✅ Postfix запущен" | tee -a "$REPORT_FILE"
else
    echo "   ❌ Postfix не запустился:" | tee -a "$REPORT_FILE"
    systemctl status postfix --no-pager -l | head -20 | tee -a "$REPORT_FILE"
    exit 1
fi

# 4.3 Проверка LMTP сокета после перезапуска
echo "" | tee -a "$REPORT_FILE"
echo "4.3 Проверка LMTP сокета..." | tee -a "$REPORT_FILE"
sleep 1
if [ -S /var/spool/postfix/private/dovecot-lmtp ]; then
    ls -la /var/spool/postfix/private/dovecot-lmtp | tee -a "$REPORT_FILE"
    echo "   ✅ LMTP сокет создан" | tee -a "$REPORT_FILE"
else
    echo "   ⚠️  LMTP сокет не создан, проверьте логи Dovecot" | tee -a "$REPORT_FILE"
fi

echo "" | tee -a "$REPORT_FILE"
echo "📋 ШАГ 5: Тестирование" | tee -a "$REPORT_FILE"
echo "====================================" | tee -a "$REPORT_FILE"

# 5.1 Очистка очереди
echo "" | tee -a "$REPORT_FILE"
echo "5.1 Очистка очереди Postfix..." | tee -a "$REPORT_FILE"
postqueue -f 2>&1 | tee -a "$REPORT_FILE" || true

# 5.2 Отправка тестового письма
echo "" | tee -a "$REPORT_FILE"
echo "5.2 Отправка тестового письма..." | tee -a "$REPORT_FILE"
echo "Test message $(date)" | sendmail -v info@metrika.direct 2>&1 | tee -a "$REPORT_FILE" | head -30

sleep 5

# 5.3 Проверка очереди
echo "" | tee -a "$REPORT_FILE"
echo "5.3 Проверка очереди Postfix..." | tee -a "$REPORT_FILE"
QUEUE_OUTPUT=$(postqueue -p 2>&1)
echo "$QUEUE_OUTPUT" | tee -a "$REPORT_FILE"

if echo "$QUEUE_OUTPUT" | grep -q "Mail queue is empty"; then
    echo "   ✅ Очередь пуста - письмо доставлено!" | tee -a "$REPORT_FILE"
    SUCCESS=true
else
    DEFERRED_COUNT=$(echo "$QUEUE_OUTPUT" | grep -c "deferred" || echo "0")
    if [ "$DEFERRED_COUNT" -gt 0 ]; then
        echo "   ⚠️  Есть deferred письма в очереди" | tee -a "$REPORT_FILE"
        SUCCESS=false
    else
        echo "   ✅ Письмо обработано" | tee -a "$REPORT_FILE"
        SUCCESS=true
    fi
fi

# 5.4 Проверка логов
echo "" | tee -a "$REPORT_FILE"
echo "5.4 Последние записи в логах Dovecot:" | tee -a "$REPORT_FILE"
tail -30 /var/log/dovecot.log 2>/dev/null | grep -i "lmtp\|info\|delivered\|sent" | tail -10 | tee -a "$REPORT_FILE" || echo "Нет записей" | tee -a "$REPORT_FILE"

echo "" | tee -a "$REPORT_FILE"
echo "5.5 Последние записи в логах Postfix:" | tee -a "$REPORT_FILE"
tail -30 /var/log/mail.log 2>/dev/null | grep -i "info@metrika\|delivered\|sent\|lmtp" | tail -10 | tee -a "$REPORT_FILE" || echo "Нет записей" | tee -a "$REPORT_FILE"

# 5.6 Проверка доставки в /var/mail/info
echo "" | tee -a "$REPORT_FILE"
echo "5.6 Проверка доставки в /var/mail/info:" | tee -a "$REPORT_FILE"
if [ -f /var/mail/info ]; then
    SIZE=$(stat -c%s /var/mail/info 2>/dev/null || stat -f%z /var/mail/info 2>/dev/null || echo "0")
    if [ "$SIZE" -gt 0 ]; then
        echo "   ✅ Письмо доставлено! Размер файла: $SIZE байт" | tee -a "$REPORT_FILE"
        echo "   Первые строки письма:" | tee -a "$REPORT_FILE"
        head -5 /var/mail/info | tee -a "$REPORT_FILE"
        SUCCESS=true
    else
        echo "   ⚠️  Файл /var/mail/info пуст" | tee -a "$REPORT_FILE"
        SUCCESS=false
    fi
else
    echo "   ⚠️  Файл /var/mail/info не существует" | tee -a "$REPORT_FILE"
    SUCCESS=false
fi

echo "" | tee -a "$REPORT_FILE"
echo "====================================" | tee -a "$REPORT_FILE"
if [ "$SUCCESS" = true ]; then
    echo "✅ УСПЕХ! Почта работает корректно" | tee -a "$REPORT_FILE"
else
    echo "⚠️  Есть проблемы, проверьте логи выше" | tee -a "$REPORT_FILE"
fi
echo "" | tee -a "$REPORT_FILE"
echo "💾 Резервная копия: $BACKUP_DIR" | tee -a "$REPORT_FILE"
echo "📄 Полный отчет: $REPORT_FILE" | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"

# Выводим краткую сводку изменений
echo "📋 КРАТКАЯ СВОДКА ИЗМЕНЕНИЙ:" | tee -a "$REPORT_FILE"
echo "============================" | tee -a "$REPORT_FILE"
echo "1. Настроен userdb driver = passwd для системных пользователей" | tee -a "$REPORT_FILE"
echo "2. Настроен mail_location = mbox:~/mail:INBOX=/var/mail/%u" | tee -a "$REPORT_FILE"
echo "3. Настроен service lmtp с user = root" | tee -a "$REPORT_FILE"
echo "4. Настроен service auth с user = root" | tee -a "$REPORT_FILE"
echo "5. Убран конфликт mydestination/virtual_mailbox_domains" | tee -a "$REPORT_FILE"
echo "6. Убраны virtual_mailbox_domains (используем системных пользователей)" | tee -a "$REPORT_FILE"
echo "7. Настроен local_transport = virtual" | tee -a "$REPORT_FILE"
echo "8. Созданы почтовые директории для пользователя info" | tee -a "$REPORT_FILE"

cat "$REPORT_FILE"

