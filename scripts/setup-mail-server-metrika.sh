#!/bin/bash

# Скрипт установки почтового сервера для metrika.direct
# Использование: sudo ./scripts/setup-mail-server-metrika.sh

set -e

DOMAIN="metrika.direct"
MAIL_HOST="mail.metrika.direct"

# Список почтовых ящиков
MAILBOXES=("derik" "savluk" "ionin" "manager" "smm" "info" "reg" "kadastr" "lawyer" "kan")

echo "📧 Установка почтового сервера для $DOMAIN"
echo "=========================================="

# Проверка root доступа
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Запустите скрипт с sudo: sudo ./scripts/setup-mail-server-metrika.sh"
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

# Запрос IP адреса
read -p "Введите IP адрес сервера (72.62.72.196): " SERVER_IP
SERVER_IP=${SERVER_IP:-72.62.72.196}

echo ""
echo "📦 Установка пакетов..."

# Установка пакетов
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y \
        postfix \
        dovecot-core \
        dovecot-imapd \
        dovecot-pop3d \
        dovecot-lmtpd \
        opendkim \
        opendkim-tools \
        spamassassin \
        spamc \
        mailutils
elif [ "$OS" = "centos" ] || [ "$OS" = "rhel" ]; then
    yum install -y postfix dovecot opendkim mailx
else
    echo "❌ Неподдерживаемая ОС: $OS"
    exit 1
fi

echo "✅ Пакеты установлены"

# Создание пользователя для почты
if ! id "vmail" &>/dev/null; then
    echo "👤 Создание пользователя vmail..."
    useradd -r -u 5000 -g mail -d /var/mail -s /sbin/nologin -c "Virtual Mailbox" vmail
    mkdir -p /var/mail/vhosts/$DOMAIN
    chown -R vmail:mail /var/mail
fi

# Создание почтовых ящиков
echo ""
echo "📬 Создание почтовых ящиков..."
for mailbox in "${MAILBOXES[@]}"; do
    email="$mailbox@$DOMAIN"
    echo "  - Создание $email..."
    
    # Создание директории для ящика
    mkdir -p /var/mail/vhosts/$DOMAIN/$mailbox/{cur,new,tmp}
    chown -R vmail:mail /var/mail/vhosts/$DOMAIN/$mailbox
    
    # Запрос пароля
    read -sp "  Введите пароль для $email: " PASSWORD
    echo
    
    # Создание системного пользователя (для простоты используем passwd)
    if ! id "$mailbox" &>/dev/null; then
        useradd -r -s /sbin/nologin -d /var/mail/vhosts/$DOMAIN/$mailbox -u 5001 -g mail "$mailbox" || true
    fi
    echo "$mailbox:$PASSWORD" | chpasswd
done

echo "✅ Почтовые ящики созданы"

# Настройка Postfix
echo ""
echo "⚙️  Настройка Postfix..."

cat > /etc/postfix/main.cf <<EOF
# Основные настройки
myhostname = $MAIL_HOST
mydomain = $DOMAIN
myorigin = \$mydomain
inet_interfaces = all
inet_protocols = ipv4

# Сети
mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128

# Домены
mydestination = \$myhostname, localhost.\$mydomain, localhost, \$mydomain

# Виртуальные почтовые ящики
virtual_mailbox_domains = $DOMAIN
virtual_mailbox_base = /var/mail/vhosts
virtual_mailbox_maps = hash:/etc/postfix/virtual_mailbox
virtual_alias_maps = hash:/etc/postfix/virtual_alias
virtual_minimum_uid = 100
virtual_uid_maps = static:5000
virtual_gid_maps = static:5000

# Безопасность
smtpd_banner = \$myhostname ESMTP
smtpd_helo_required = yes
smtpd_helo_restrictions = permit_mynetworks, warn_if_reject reject_non_fqdn_helo_hostname, reject_invalid_helo_hostname, permit
smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination, permit
smtpd_sender_restrictions = permit_mynetworks, warn_if_reject reject_non_fqdn_sender, permit

# TLS
smtpd_tls_cert_file = /etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file = /etc/ssl/private/ssl-cert-snakeoil.key
smtpd_use_tls = yes
smtpd_tls_auth_only = yes
smtpd_tls_security_level = may
smtpd_tls_security_level = may

# SMTP AUTH
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = \$myhostname

# Relay
relayhost =
EOF

# Создание виртуальных ящиков
echo "# Virtual mailboxes" > /etc/postfix/virtual_mailbox
for mailbox in "${MAILBOXES[@]}"; do
    echo "$mailbox@$DOMAIN $DOMAIN/$mailbox/" >> /etc/postfix/virtual_mailbox
done
postmap /etc/postfix/virtual_mailbox

# Создание алиасов (можно добавить позже)
echo "# Virtual aliases" > /etc/postfix/virtual_alias
postmap /etc/postfix/virtual_alias

echo "✅ Postfix настроен"

# Настройка Dovecot
echo ""
echo "⚙️  Настройка Dovecot..."

cat > /etc/dovecot/dovecot.conf <<EOF
protocols = imap pop3 lmtp
listen = *
mail_location = maildir:/var/mail/vhosts/%d/%n
mail_privileged_group = mail
userdb {
    driver = static
    args = uid=vmail gid=mail home=/var/mail/vhosts/%d/%n allow_all_users=yes
}
passdb {
    driver = pam
}
namespace inbox {
    inbox = yes
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
service imap-login {
    inet_listener imap {
        port = 143
    }
    inet_listener imaps {
        port = 993
        ssl = yes
    }
}
service pop3-login {
    inet_listener pop3 {
        port = 110
    }
    inet_listener pop3s {
        port = 995
        ssl = yes
    }
}
service lmtp {
    unix_listener /var/spool/postfix/private/dovecot-lmtp {
        mode = 0600
        user = postfix
        group = postfix
    }
}
service auth {
    unix_listener /var/spool/postfix/private/auth {
        mode = 0666
        user = postfix
        group = postfix
    }
    unix_listener auth-userdb {
        mode = 0600
        user = vmail
        group = mail
    }
    user = dovecot
}
service auth-worker {
    user = vmail
}
ssl = required
ssl_cert = </etc/ssl/certs/ssl-cert-snakeoil.pem
ssl_key = </etc/ssl/private/ssl-cert-snakeoil.key
auth_mechanisms = plain login
EOF

# Настройка Postfix для работы с Dovecot
postconf -e "smtpd_sasl_type = dovecot"
postconf -e "smtpd_sasl_path = private/auth"
postconf -e "smtpd_sasl_auth_enable = yes"
postconf -e "smtpd_sasl_security_options = noanonymous"
postconf -e "smtpd_sasl_local_domain = $MAIL_HOST"

# Настройка LMTP для доставки
postconf -e "virtual_transport = lmtp:unix:private/dovecot-lmtp"

echo "✅ Dovecot настроен"

# Генерация DKIM ключа
echo ""
echo "🔐 Генерация DKIM ключа..."
mkdir -p /etc/opendkim/keys/$DOMAIN
opendkim-genkey -t -s mail -d $DOMAIN -D /etc/opendkim/keys/$DOMAIN
chown -R opendkim:opendkim /etc/opendkim/keys/$DOMAIN
chmod 600 /etc/opendkim/keys/$DOMAIN/mail.private

# Настройка OpenDKIM
cat > /etc/opendkim.conf <<EOF
Domain                  $DOMAIN
KeyFile                 /etc/opendkim/keys/$DOMAIN/mail.private
Selector                mail
Socket                  inet:8891@localhost
PidFile                 /var/run/opendkim/opendkim.pid
UMask                   022
UserID                  opendkim:opendkim
EOF

# Добавление в Postfix
postconf -e "milter_default_action = accept"
postconf -e "milter_protocol = 6"
postconf -e "smtpd_milters = inet:localhost:8891"
postconf -e "non_smtpd_milters = inet:localhost:8891"

echo "✅ DKIM настроен"

# Запуск сервисов
echo ""
echo "🚀 Запуск сервисов..."
systemctl enable postfix dovecot opendkim
systemctl restart postfix dovecot opendkim

echo ""
echo "✅ Установка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo ""
echo "1. Получите DKIM ключ для DNS:"
echo "   cat /etc/opendkim/keys/$DOMAIN/mail.txt"
echo ""
echo "2. Настройте DNS записи (см. scripts/dns-config-metrika.txt)"
echo ""
echo "3. Обновите .env файл на вашем сайте:"
echo "   IMAP_HOST=\"$MAIL_HOST\""
echo "   IMAP_PORT=\"993\""
echo "   SMTP_HOST=\"$MAIL_HOST\""
echo "   SMTP_PORT=\"587\""
echo ""
echo "4. Проверьте работу:"
echo "   telnet $MAIL_HOST 25"
echo "   telnet $MAIL_HOST 993"
echo ""
echo "📧 Созданные почтовые ящики:"
for mailbox in "${MAILBOXES[@]}"; do
    echo "   - $mailbox@$DOMAIN"
done

