#!/bin/bash
set -euo pipefail

# One-time setup: enable SSH key access to the VPS, so deploy scripts can run without passwords.
#
# Usage:
#   bash scripts/setup-ssh-key-access.sh
#
# After completion, you should be able to run:
#   bash scripts/deploy-to-vps.sh
#

SERVER="${VPS_SERVER:-root@72.62.72.196}"
KEY_PATH="${VPS_SSH_KEY_PATH:-$HOME/.ssh/metrika5_root_ed25519}"

mkdir -p "$(dirname "$KEY_PATH")"

if [ ! -f "$KEY_PATH" ]; then
  echo "🔐 Генерирую SSH-ключ: $KEY_PATH"
  ssh-keygen -t ed25519 -f "$KEY_PATH" -N "" -C "metrika5-deploy" >/dev/null
fi

PUB="${KEY_PATH}.pub"
if [ ! -f "$PUB" ]; then
  echo "❌ Public key not found: $PUB"
  exit 1
fi

echo "📌 Добавляю публичный ключ на VPS ($SERVER)."
echo "Сейчас SSH попросит пароль от VPS один раз."

cat "$PUB" | ssh -o StrictHostKeyChecking=no "$SERVER" 'bash -lc "
  set -euo pipefail
  mkdir -p /root/.ssh
  chmod 700 /root/.ssh
  cat >> /root/.ssh/authorized_keys
  chmod 600 /root/.ssh/authorized_keys
  echo \"✅ Ключ добавлен в /root/.ssh/authorized_keys\"
"'

echo "🧪 Проверяю вход по ключу..."
ssh -o BatchMode=yes -o StrictHostKeyChecking=no -i "$KEY_PATH" "$SERVER" "echo '✅ Key auth works'" >/dev/null

echo "✅ Готово."
echo "Подсказка: чтобы deploy-to-vps.sh автоматически использовал этот ключ, можно добавить в ~/.ssh/config:"
echo ""
echo "Host metrika5"
echo "  HostName 72.62.72.196"
echo "  User root"
echo "  IdentityFile $KEY_PATH"
echo ""
