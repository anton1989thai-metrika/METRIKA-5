#!/bin/bash

# Простой скрипт для деплоя на VPS
# Использование: ./scripts/deploy-to-vps-simple.sh

SERVER="root@72.62.72.196"
VPS_PATH="/var/www/metrika5"
PASSWORD="${VPS_PASSWORD:-}"

echo "🚀 Деплой изменений на VPS..."

if [ -z "$PASSWORD" ]; then
  echo "Введите пароль от VPS (будет скрыт):"
  read -rs PASSWORD
  echo ""
fi

# Создаем временный скрипт для выполнения на сервере
cat > /tmp/deploy-metrika.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
cd /var/www/metrika5

# Создаем директории если их нет
mkdir -p src/components

# Копируем файлы (они будут загружены отдельно)
echo "Файлы будут загружены через scp..."

# Перезапускаем сервис
systemctl restart metrika5
echo "✅ Сервис перезапущен"
DEPLOY_SCRIPT

echo "📤 Загрузка файлов на сервер..."

# Используем sshpass если доступен
if command -v sshpass &> /dev/null; then
  # Загружаем login-form.tsx
  sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no src/components/login-form.tsx "$SERVER:$VPS_PATH/src/components/" 2>&1
  echo "✅ login-form.tsx загружен"
  
  # Загружаем UserManagementPanel.tsx
  sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no src/components/UserManagementPanel.tsx "$SERVER:$VPS_PATH/src/components/" 2>&1
  echo "✅ UserManagementPanel.tsx загружен"
  
  # Собираем и перезапускаем сервис (Next.js changes require rebuild)
  sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER" "cd $VPS_PATH && export OPENAI_API_KEY=placeholder-for-build && export NODE_ENV=production && sudo -u metrika -H bash -lc 'cd $VPS_PATH && export OPENAI_API_KEY=placeholder-for-build && export NODE_ENV=production && npm run build' && systemctl restart metrika5" 2>&1
  echo "✅ Проект собран и сервис перезапущен"
  
else
  echo "⚠️  sshpass не установлен. Выполните вручную:"
  echo ""
  echo "1. Загрузите файлы:"
  echo "   scp src/components/login-form.tsx $SERVER:$VPS_PATH/src/components/"
  echo "   scp src/components/UserManagementPanel.tsx $SERVER:$VPS_PATH/src/components/"
  echo ""
  echo "2. Перезапустите сервис:"
  echo "   ssh $SERVER 'cd $VPS_PATH && OPENAI_API_KEY=placeholder-for-build NODE_ENV=production sudo -u metrika -H bash -lc \"cd $VPS_PATH && OPENAI_API_KEY=placeholder-for-build NODE_ENV=production npm run build\" && systemctl restart metrika5'"
  echo ""
  echo "Или установите sshpass:"
  echo "   brew install hudochenkov/sshpass/sshpass  # macOS"
fi

rm -f /tmp/deploy-metrika.sh

echo "✅ Деплой завершен!"
