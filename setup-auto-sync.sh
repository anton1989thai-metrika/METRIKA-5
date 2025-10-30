#!/bin/bash

# Скрипт настройки автоматической синхронизации

echo "🔧 Настраиваю автоматическую синхронизацию..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" dobr ]; then
    echo "❌ Ошибка: Запустите скрипт из корневой папки проекта METRIKA-5"
    exit 1
fi

# Делаем все скрипты исполняемыми
chmod +x auto-sync.sh watch-sync.sh poll-sync.sh

echo "✅ Скрипты настроены!"

# Создаем LaunchAgent для macOS (автозапуск при входе)
echo ""
echo "📱 Настраиваю автозапуск для macOS..."

PLIST_FILE="$HOME/Library/LaunchAgents/com.metrika5.sync.plist"
SCRIPT_PATH="$(pwd)/poll-sync.sh"

cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.metrika5.sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$SCRIPT_PATH</string>
        <string>60</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$HOME/Library/Logs/metrika5-sync.log</string>
    <key>StandardErrorPath</key>
    <string>$HOME/Library/Logs/metrika5-sync-error.log</string>
    <key>WorkingDirectory</key>
    <string>$(pwd)</string>
</dict>
</plist>
EOF

echo "✅ Файл автозапуска создан: $PLIST_FILE"

# Загружаем LaunchAgent
echo ""
echo "🚀 Запускаю синхронизацию..."
launchctl unload "$PLIST_FILE" 2>/dev/null
launchctl load "$PLIST_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Автозапуск настроен и запущен!"
    echo ""
    echo "📋 Что происходит:"
    echo "   • Синхронизация запускается автоматически при входе в систему"
    echo "   • Проверяет изменения каждые 60 секунд"
    echo "   • Работает в фоновом режиме"
    echo ""
    echo "📊 Логи:"
    echo "   • $HOME/Library/Logs/metrika5-sync.log"
    echo "   • $HOME/Library/Logs/metrika5-sync-error.log"
    echo ""
    echo "🛑 Чтобы остановить:"
    echo "   launchctl unload $PLIST_FILE"
    echo ""
    echo "▶️  Чтобы запустить снова:"
    echo "   launchctl load $PLIST_FILE"
else
    echo "⚠️  Не удалось автоматически запустить. Запустите вручную:"
    echo "   npm run poll-sync"
fi

