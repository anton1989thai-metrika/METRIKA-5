#!/bin/bash

# Установка и настройка Postfix + Dovecot
# Использование: sudo ./scripts/install-postfix-dovecot.sh domain mail_host server_ip password

set -e

DOMAIN=${1:-metrika.direct}
MAIL_HOST=${2:-mail.metrika.direct}
SERVER_IP=${3}
USER_PASS=${4}

echo "📧 Установка Postfix + Dovecot для $DOMAIN"

# Определение ОС
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "❌ Не удалось определить ОС"
    exit 1
fi

# Установка пакетов
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    echo "📦 Обновление пакетов..."
    apt-get update
    
    echo "📦 Установка Postfix и Dovecot..."
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
        postfix \
        dovecot-core \
        dovecot-imapd \
        dovecot-pop3d \
        opendkim \
        opendkim-tools \
        spamassassin \
        spamc
    
elif [ "$OS" = "centos" ] || [ "$OS" = "rhel" ]; then
    echo "📦 Установка Postfix и Dovecot..."
    yum install -y postfix dovecot opendkim
else
    echo "❌ Неподдерживаемая ОС: $OS"
    exit 1
fi

# Создание директорий
mkdir -p /etc/postfix
mkdir -p /etc/dovecot
mkdir -p /var/mail/vhosts/$DOMAIN
mkdir -p /etc/opendkim/keys/$DOMAIN

# Настройка Postfix
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
virtual_mailbox_domains = mysql:/etc/postfix/mysql-virtual-mailbox-domains.cf
virtual_mailbox_maps = mysql:/etc/postfix/mysql-virtual-mailbox-maps.cf
virtual_alias_maps = mysql:/etc/postfix/mysql-virtual-alias-maps.cf
virtual_minimum_uid = 100
virtual_uid_maps = static:5000
virtual_gid_maps = static:5000
virtual_mailbox_base = /var/mail/vhosts

# Безопасность
smtpd_banner = \$myhostname ESMTP
smtpd_helo_required = yes
smtpd_helo_restrictions = permit_mynetworks, warn_if_reject reject_non_fqdn_helo_hostname, reject_invalid_helo_hostname, permit
smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination, reject_rbl_client zen.spamhaus.org, permit
smtpd_sender_restrictions = permit_mynetworks, warn_if_reject reject_non_fqdn_sender, reject_unknown_sender_domain, permit

# TLS
smtpd_tls_cert_file = /etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file = /etc/ssl/private/ssl-cert-snakeoil.key
smtpd_use_tls = yes
smtpd_tls_auth_only = yes
smtpd_tls_security_level = may

# DKIM
milter_default_action = accept
milter_protocol = 6
smtpd_milters = inet:localhost:8891
non_smtpd_milters = inet:localhost:8891
EOF

# Упрощенная настройка без MySQL (для начала)
cat > /etc/postfix/main.cf <<EOF
myhostname = $MAIL_HOST
mydomain = $DOMAIN
myorigin = \$mydomain
inet_interfaces = all
mydestination = \$myhostname, localhost.\$mydomain, localhost, \$mydomain
virtual_mailbox_domains = $DOMAIN
virtual_mailbox_base = /var/mail/vhosts
virtual_mailbox_maps = hash:/etc/postfix/virtual
virtual_minimum_uid = 100
virtual_uid_maps = static:5000
virtual_gid_maps = static:5000
EOF

# Создание пользователя для почты
if ! id "vmail" &>/dev/null; then
    useradd -r -u 5000 -g mail -d /var/mail -s /sbin/nologin -c "Virtual Mailbox" vmail
    chown -R vmail:mail /var/mail
fi

# Настройка Dovecot
echo "⚙️  Настройка Dovecot..."

cat > /etc/dovecot/dovecot.conf <<EOF
protocols = imap pop3 lmtp
listen = *
mail_location = maildir:/var/mail/vhosts/%d/%n
mail_privileged_group = mail
userdb {
    driver = static
    args = uid=vmail gid=mail home=/var/mail/vhosts/%d/%n
}
passdb {
    driver = pam
}
namespace inbox {
    inbox = yes
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
ssl = required
ssl_cert = </etc/ssl/certs/ssl-cert-snakeoil.pem
ssl_key = </etc/ssl/private/ssl-cert-snakeoil.key
EOF

# Создание почтового ящика
if [ -n "$USER_PASS" ]; then
    echo "👤 Создание пользователя reg@$DOMAIN..."
    useradd -r -s /sbin/nologin reg || true
    echo "reg:$USER_PASS" | chpasswd
    mkdir -p /var/mail/vhosts/$DOMAIN/reg
    chown -R vmail:mail /var/mail/vhosts/$DOMAIN
fi

# Настройка виртуальных ящиков
echo "reg@$DOMAIN $DOMAIN/reg/" > /etc/postfix/virtual
postmap /etc/postfix/virtual

# Запуск сервисов
echo "🚀 Запуск сервисов..."
systemctl enable postfix dovecot
systemctl restart postfix dovecot

echo "✅ Postfix + Dovecot установлены и настроены!"
echo ""
echo "📋 Создайте DNS записи (см. scripts/dns-config.txt)"

