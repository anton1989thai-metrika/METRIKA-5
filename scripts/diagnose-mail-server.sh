#!/bin/bash

# Диагностический скрипт для анализа проблем с почтовым сервером
# Использование: sudo ./diagnose-mail-server.sh

echo "🔍 Диагностика почтового сервера"
echo "=================================="

echo ""
echo "1️⃣ Конфигурация Dovecot (doveconf -n):"
echo "----------------------------------------"
doveconf -n

echo ""
echo "2️⃣ Конфигурация Postfix (postconf -n):"
echo "----------------------------------------"
postconf -n

echo ""
echo "3️⃣ Пользователь info:"
echo "----------------------------------------"
id info
getent passwd info
ls -la /var/mail/info 2>/dev/null || echo "/var/mail/info не существует"
ls -la $(getent passwd info | cut -d: -f6)/mail 2>/dev/null || echo "Домашняя директория mail не существует"

echo ""
echo "4️⃣ Сервисы:"
echo "----------------------------------------"
systemctl status dovecot --no-pager -l | head -15
echo ""
systemctl status postfix --no-pager -l | head -15

echo ""
echo "5️⃣ Последние 50 строк логов Dovecot:"
echo "----------------------------------------"
tail -50 /var/log/dovecot.log

echo ""
echo "6️⃣ Последние 50 строк логов Postfix:"
echo "----------------------------------------"
tail -50 /var/log/mail.log

echo ""
echo "7️⃣ Проверка LMTP сокета:"
echo "----------------------------------------"
ls -la /var/spool/postfix/private/dovecot-lmtp 2>/dev/null || echo "LMTP сокет не существует"

echo ""
echo "8️⃣ Проверка портов:"
echo "----------------------------------------"
netstat -tlnp | grep -E "(25|587|993|143)" || ss -tlnp | grep -E "(25|587|993|143)"

