#!/bin/bash
set -euo pipefail

# Safely sets OPENAI_API_KEY on the VPS in systemd for the metrika5 service.
# The key is prompted interactively and is NOT stored in this repo.

SERVER="${VPS_SERVER:-root@72.62.72.196}"
SERVICE="${VPS_SERVICE:-metrika5}"

echo "This will set OPENAI_API_KEY for systemd service: $SERVICE on $SERVER"
echo "You will be prompted to paste the key on the VPS session (hidden input)."
echo ""

ssh -o StrictHostKeyChecking=no "$SERVER" "bash -lc '
  set -euo pipefail
  read -rsp \"OPENAI_API_KEY (hidden): \" OPENAI_API_KEY
  echo
  if [ -z \"\$OPENAI_API_KEY\" ]; then
    echo \"OPENAI_API_KEY is empty\" >&2
    exit 1
  fi
  sudo install -d -m 0755 /etc/systemd/system/${SERVICE}.service.d
  printf \"[Service]\\nEnvironment=\\\"OPENAI_API_KEY=%s\\\"\\n\" \"\$OPENAI_API_KEY\" | sudo tee /etc/systemd/system/${SERVICE}.service.d/openai.conf >/dev/null
  sudo systemctl daemon-reload
  sudo systemctl restart ${SERVICE}
  echo \"Done. ${SERVICE} restarted.\"
'"

