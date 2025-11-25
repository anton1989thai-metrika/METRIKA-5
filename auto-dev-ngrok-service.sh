#!/bin/bash

# Скрипт для создания LaunchAgent для автоматической синхронизации GitHub → ngrok
# Запускается автоматически при входе в систему

echo "🔧 Настраиваю автозапуск синхронизации GitHub → ngrok..."

PROJECT_DIR="$(pwd)"
SCRIPT_PATH="$PROJECT_DIR/auto-dev-ngrok.sh"

# Проверяем, что скрипт существует
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "❌ Ошибка: Скрипт auto-dev-ngrok.sh не найден"
    exit 1
fi

chmod +x "$SCRIPT_PATH"

# Создаём LaunchAgent
PLIST_FILE="$HOME/Library/LaunchAgents/com.metrika5.dev-ngrok-sync.plist"

cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.metrika5.dev-ngrok-sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$SCRIPT_PATH</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$HOME/Library/Logs/metrika5-dev-ngrok-sync.log</string>
    <key>StandardErrorPath</key>
    <string>$HOME/Library/Logs/metrika5-dev-ngrok-sync-error.log</string>
    <key>WorkingDirectory</key>
    <string>$PROJECT_DIR</string>
</dict>
</plist>
EOF

echo "✅ Файл автоза熬夜са создан: $PLIST_FILE"

# Загружаем LaunchAgent
launchctl unload "$PLIST_FILE" 2>/dev/null
launchctl load "$PLIST_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Автозапуск настроен и запущен!"
    echo ""
    echo "📋 Что происходит:"
    echo "   • Автоматически запускается при входе в систему"
    echo "   • Проверяет изменения на GitHub каждые 30 секунд"
    echo "   • Автоматически запускает dev-сервер если нужно"
    echo "   • Автоматически запускает ngrok если нужно"
    echo "   • Изменения с GitHub сразу попадают на ngrok"
    echo ""
    echo "📊 Логи:"
    echo "   • $HOME/Library/Logs/metrika5-dev-ngrok-sync.log"
    echo ""
    echo "🛑 Остановить:"
    echo "   launchctl unload $PLIST_FILE"
    echo ""
    echo "▶️  Запустить вручную (для теста):"
    echo "   ./auto-dev-ngrok.sh"
else
    echo "⚠️  Не удалось автоматически запустить. Запустите вручную:"
    echo "   ./auto-dev-ngrok.sh"
fi

