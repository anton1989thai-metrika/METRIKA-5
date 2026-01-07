#!/usr/bin/env bash
set -euo pipefail

# Запуск dev-сервера с настройками почты без .env (удобно, если env-файлы заблокированы).
# Использование:
#   MAIL_PASS="Metrika7887" ./scripts/dev-mail.sh
# или (с запросом пароля):
#   ./scripts/dev-mail.sh

MAIL_HOST="${MAIL_HOST:-mail.metrika.direct}"
MAIL_USER="${MAIL_USER:-info@metrika.direct}"
MAIL_PASS="${MAIL_PASS:-}"

if [[ -z "${MAIL_PASS}" ]]; then
  read -r -s -p "MAIL_PASS for ${MAIL_USER}: " MAIL_PASS
  echo
fi

export DEFAULT_MAILBOX_EMAIL="${MAIL_USER}"
export IMAP_HOST="${MAIL_HOST}"
export IMAP_PORT="${IMAP_PORT:-993}"
export IMAP_USER="${MAIL_USER}"
export IMAP_PASS="${MAIL_PASS}"
export SMTP_HOST="${MAIL_HOST}"
export SMTP_PORT="${SMTP_PORT:-587}"
export SMTP_USER="${MAIL_USER}"
export SMTP_PASS="${MAIL_PASS}"
export SMTP_FROM="${MAIL_USER}"

exec npx --yes next dev -p 3000


