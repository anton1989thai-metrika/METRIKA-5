#!/bin/bash

# Скрипт для деплоя login-form.tsx на VPS (выполните вручную вне песочницы)
# Использование: ./scripts/deploy-login-form-manual.sh

SERVER="root@72.62.72.196"
VPS_PATH="/var/www/metrika5"
FILE="src/components/login-form.tsx"

echo "🚀 Деплой login-form.tsx на VPS..."
echo ""
echo "Выполните следующие команды:"
echo ""
echo "1. Загрузите файл:"
echo "   scp $FILE $SERVER:$VPS_PATH/$FILE"
echo ""
echo "2. Соберите проект и перезапустите сервис:"
echo "   ssh $SERVER"
echo "   cd $VPS_PATH"
echo "   export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db"
echo "   export OPENAI_API_KEY=placeholder-for-build"
echo "   export NODE_ENV=production"
echo "   sudo -u metrika -H bash -lc 'cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && export OPENAI_API_KEY=placeholder-for-build && export NODE_ENV=production && npm run build && systemctl restart metrika5'"
echo ""
echo "Или выполните одной командой:"
echo "   ssh $SERVER 'cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && export OPENAI_API_KEY=placeholder-for-build && export NODE_ENV=production && sudo -u metrika -H bash -lc \"cd $VPS_PATH && export DATABASE_URL=file:$VPS_PATH/prisma/prisma/prod.db && export OPENAI_API_KEY=placeholder-for-build && export NODE_ENV=production && npm run build && systemctl restart metrika5\"'"
