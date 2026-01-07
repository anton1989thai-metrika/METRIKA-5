#!/usr/bin/env bash
set -euo pipefail

BACKUP="/root/mail-wipe-backup-$(date +%Y%m%d-%H%M%S).tar.gz"

echo "[1/5] Creating backup -> $BACKUP"
tar -czf "$BACKUP" \
  /etc/postfix /etc/dovecot /etc/opendkim \
  /var/mail /var/spool/postfix \
  /etc/letsencrypt/live/mail.metrika.direct \
  /etc/letsencrypt/renewal/mail.metrika.direct.conf \
  2>/dev/null || true
ls -lh "$BACKUP" 2>/dev/null || true

echo "[2/5] Stopping/disabling services"
systemctl stop postfix dovecot opendkim spamassassin 2>/dev/null || true
systemctl disable postfix dovecot opendkim spamassassin 2>/dev/null || true

echo "[3/5] Purging packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y >/dev/null 2>&1 || true
apt-get purge -y "postfix*" "dovecot*" "opendkim*" spamassassin spamc mailutils >/dev/null 2>&1 || true
apt-get autoremove -y >/dev/null 2>&1 || true

echo "[4/5] Removing mail configs/data"
rm -rf \
  /etc/postfix /etc/dovecot /etc/opendkim \
  /var/mail /var/mail/vhosts \
  /var/spool/postfix /run/dovecot \
  /etc/dovecot/passwd \
  /etc/letsencrypt/live/mail.metrika.direct \
  /etc/letsencrypt/archive/mail.metrika.direct \
  /etc/letsencrypt/renewal/mail.metrika.direct.conf \
  2>/dev/null || true

echo "[5/5] Removing mail users (if exist)"
for u in vmail derik savluk ionin manager smm info reg kadastr lawyer kan; do
  id "$u" >/dev/null 2>&1 && userdel -r "$u" 2>/dev/null || true
done

echo "Done. Verify:"
command -v postfix >/dev/null 2>&1 && echo "postfix_present" || echo "postfix_removed"
command -v dovecot >/dev/null 2>&1 && echo "dovecot_present" || echo "dovecot_removed"
systemctl status postfix 2>/dev/null | head -5 || true
systemctl status dovecot 2>/dev/null | head -5 || true


