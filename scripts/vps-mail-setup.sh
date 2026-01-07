#!/usr/bin/env bash
set -euo pipefail

# One-shot mail server setup for metrika.direct (Postfix + Dovecot + OpenDKIM)
# Intended to run on VPS as root (Ubuntu).
#
# Creates initial mailbox: info@metrika.direct
# Password is read from env MAIL_PASSWORD (recommended) or prompt (fallback).
#
# Usage (recommended):
#   sudo MAIL_PASSWORD='...' bash scripts/vps-mail-setup.sh
#
# After run:
# - Add DNS records (A, MX, SPF, DKIM, DMARC)
# - Request PTR: 72.62.72.196 -> mail.metrika.direct

DOMAIN="${DOMAIN:-metrika.direct}"
MAIL_HOST="${MAIL_HOST:-mail.metrika.direct}"
MAILBOX_LOCALPART="${MAILBOX_LOCALPART:-info}"
MAILBOX="${MAILBOX_LOCALPART}@${DOMAIN}"
VMAIL_UID="${VMAIL_UID:-5000}"
MAIL_GID="${MAIL_GID:-8}" # default 'mail' group on Ubuntu
MAIL_ROOT="${MAIL_ROOT:-/var/mail/vhosts}"
DKIM_SELECTOR="${DKIM_SELECTOR:-mail}"
POSTFIX_CHROOT_RUN="/var/spool/postfix/run"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo $0"
  exit 1
fi

MAIL_PASSWORD="${MAIL_PASSWORD:-}"
if [[ -z "${MAIL_PASSWORD}" ]]; then
  read -r -s -p "Enter password for ${MAILBOX}: " MAIL_PASSWORD
  echo
fi

export DEBIAN_FRONTEND=noninteractive

echo "[1/10] Installing packages"
echo "postfix postfix/mailname string ${MAIL_HOST}" | debconf-set-selections
echo "postfix postfix/main_mailer_type select Internet Site" | debconf-set-selections
apt-get update -y >/dev/null 2>&1 || true
apt-get install -y postfix dovecot-core dovecot-imapd dovecot-lmtpd opendkim opendkim-tools >/dev/null

echo "[2/10] Hostname sanity (does not change system hostname)"
postconf -e "myhostname = ${MAIL_HOST}"
postconf -e "mydomain = ${DOMAIN}"
postconf -e "myorigin = \$mydomain"
postconf -e "mydestination = \$myhostname, localhost.\$mydomain, localhost"

echo "[3/10] Create vmail user (uid=${VMAIL_UID})"
if ! id -u vmail >/dev/null 2>&1; then
  useradd -r -u "${VMAIL_UID}" -g "${MAIL_GID}" -d "${MAIL_ROOT}" -s /usr/sbin/nologin vmail || true
fi
mkdir -p "${MAIL_ROOT}/${DOMAIN}"
chown -R "${VMAIL_UID}:${MAIL_GID}" "${MAIL_ROOT}"

echo "[4/10] Postfix virtual delivery -> Dovecot LMTP"
postconf -e "virtual_mailbox_domains = ${DOMAIN}"
postconf -e "virtual_mailbox_base = ${MAIL_ROOT}"
postconf -e "virtual_mailbox_maps = hash:/etc/postfix/virtual_mailbox"
postconf -e "virtual_transport = lmtp:unix:private/dovecot-lmtp"
postconf -e "smtpd_sasl_type = dovecot"
postconf -e "smtpd_sasl_path = private/auth"
postconf -e "smtpd_sasl_auth_enable = yes"
postconf -e "smtpd_sasl_security_options = noanonymous"

cat > /etc/postfix/virtual_mailbox <<EOF
${MAILBOX} ${DOMAIN}/${MAILBOX_LOCALPART}/
EOF
postmap /etc/postfix/virtual_mailbox

echo "[5/10] Dovecot config (passwd-file virtual users + LMTP socket)"
install -d -m 0755 /etc/dovecot/conf.d

# TLS (Let’s Encrypt will be configured later once DNS is ready)

# Switch Debian defaults from mbox to Maildir for virtual mailboxes
# (also override mail_inbox_path to avoid /var/mail/%{user} default)
if [[ -f /etc/dovecot/conf.d/10-mail.conf ]]; then
  cp -a /etc/dovecot/conf.d/10-mail.conf "/etc/dovecot/conf.d/10-mail.conf.bak.$(date +%s)" || true
  cat >> /etc/dovecot/conf.d/10-mail.conf <<'EOF'

# METRIKA override (virtual mailboxes)
mail_driver = maildir
mail_home = /var/mail/vhosts/%{user|domain}/%{user|username}
mail_path = %{home}
mail_inbox_path = %{home}
EOF
fi

# Ensure lmtp strips nothing: use full user@domain
cat > /etc/dovecot/conf.d/20-lmtp.conf <<'EOF'
protocol lmtp {
  auth_username_format = %{user|lower}
}
EOF

cat > /etc/dovecot/conf.d/10-master.conf <<'EOF'
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
}
EOF

cat > /etc/dovecot/conf.d/auth-passwdfile.conf.ext <<EOF
passdb passwd-file {
  auth_username_format = %{user|lower}
  passwd_file_path = /etc/dovecot/passwd
  default_password_scheme = SHA512-CRYPT
}

userdb static {
  fields {
    uid = ${VMAIL_UID}
    gid = ${MAIL_GID}
    home = ${MAIL_ROOT}/%{user|domain}/%{user|username}
    mail = maildir:${MAIL_ROOT}/%{user|domain}/%{user|username}
  }
}
EOF

# Minimal auth config that includes passwdfile only
cat > /etc/dovecot/conf.d/10-auth.conf <<'EOF'
auth_mechanisms = plain login
!include auth-passwdfile.conf.ext
EOF

echo "[6/10] Create mailbox Maildir"
install -d -m 0770 -o "${VMAIL_UID}" -g "${MAIL_GID}" \
  "${MAIL_ROOT}/${DOMAIN}/${MAILBOX_LOCALPART}/cur" \
  "${MAIL_ROOT}/${DOMAIN}/${MAILBOX_LOCALPART}/new" \
  "${MAIL_ROOT}/${DOMAIN}/${MAILBOX_LOCALPART}/tmp"

echo "[7/10] Create /etc/dovecot/passwd entry"
HASH="$(doveadm pw -s SHA512-CRYPT -p "${MAIL_PASSWORD}")"
install -m 0640 /dev/null /etc/dovecot/passwd
cat > /etc/dovecot/passwd <<EOF
${MAILBOX}:${HASH}
EOF
chown root:dovecot /etc/dovecot/passwd 2>/dev/null || chown root:root /etc/dovecot/passwd
chmod 0640 /etc/dovecot/passwd

echo "[8/10] OpenDKIM key"
install -d -m 0755 /etc/opendkim/keys/${DOMAIN}
opendkim-genkey -s "${DKIM_SELECTOR}" -d "${DOMAIN}" -D /etc/opendkim/keys/${DOMAIN} >/dev/null 2>&1 || true
chown -R opendkim:opendkim /etc/opendkim/keys/${DOMAIN} || true
chmod 0600 /etc/opendkim/keys/${DOMAIN}/${DKIM_SELECTOR}.private 2>/dev/null || true

# Create socket directory inside Postfix chroot so Postfix can reach the milter
install -d -m 0755 -o opendkim -g opendkim "${POSTFIX_CHROOT_RUN}/opendkim"

cat > /etc/opendkim.conf <<EOF
Syslog                  yes
UMask                   002
Mode                    sv
Socket                  local:${POSTFIX_CHROOT_RUN}/opendkim/opendkim.sock
PidFile                 /var/run/opendkim/opendkim.pid
UserID                  opendkim:opendkim
Selector                ${DKIM_SELECTOR}
Domain                  ${DOMAIN}
KeyFile                 /etc/opendkim/keys/${DOMAIN}/${DKIM_SELECTOR}.private
EOF

postconf -e "milter_default_action = accept"
postconf -e "milter_protocol = 6"
postconf -e "smtpd_milters = unix:run/opendkim/opendkim.sock"
postconf -e "non_smtpd_milters = unix:run/opendkim/opendkim.sock"

# Allow Postfix processes to connect to the OpenDKIM socket (group write via opendkim group)
usermod -aG opendkim postfix 2>/dev/null || true

echo "[9/10] Restart services"
systemctl enable --now opendkim >/dev/null 2>&1 || true
systemctl restart dovecot postfix >/dev/null 2>&1 || true

echo "[10/10] Output DKIM DNS record"
echo "Add these DNS records at nic.ru:"
echo "- A: mail -> <VPS_IP>"
echo "- MX: @ -> mail.${DOMAIN} (priority 10)"
echo "- TXT (SPF): @ -> v=spf1 mx ip4:<VPS_IP> ~all"
echo "- TXT (DMARC): _dmarc -> v=DMARC1; p=none; rua=mailto:dmarc@${DOMAIN}"
echo "- TXT (DKIM): ${DKIM_SELECTOR}._domainkey -> value from:"
echo "  cat /etc/opendkim/keys/${DOMAIN}/${DKIM_SELECTOR}.txt"
echo
echo "PTR (reverse DNS) request to VPS provider:"
echo "- ${DOMAIN} mail host: ${MAIL_HOST}"
echo "- IP should resolve back to: ${MAIL_HOST}"
echo
echo "Mailbox created: ${MAILBOX}"

