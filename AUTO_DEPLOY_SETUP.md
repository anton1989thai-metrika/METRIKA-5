# 🚀 Автоматическая синхронизация METRIKA-5

## Настройка автоматического деплоя на Vercel

### Шаг 1: Получите токены Vercel

1. Откройте [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Создайте новый токен с именем "METRIKA-5 Deploy"
3. Скопируйте токен

### Шаг 2: Настройте GitHub Secrets

1. Откройте [https://github.com/anton1989thai-metrika/METRIKA-5/settings/secrets/actions](https://github.com/anton1989thai-metrika/METRIKA-5/settings/secrets/actions)
2. Нажмите "New repository secret"
3. Добавьте следующие секреты:

```
VERCEL_TOKEN = ваш_токен_vercel
VERCEL_ORG_ID = ваш_org_id_vercel
VERCEL_PROJECT_ID = ваш_project_id_vercel
```

### Шаг 3: Получите Vercel Project ID

1. Подключите репозиторий к Vercel
2. В настройках проекта найдите Project ID
3. Скопируйте его в GitHub Secrets

## Использование автоматической синхронизации

### Способ 1: Использование скрипта sync.sh

```bash
# Перейдите в папку проекта
cd /Users/antonnehoroskov/Desktop/METRIKA-5/METRIKA-5

# Запустите скрипт с описанием изменений
./sync.sh "Добавлена новая страница каталога"
```

### Способ 2: Ручные команды git

```bash
# Добавить изменения
git add .

# Создать коммит
git commit -m "Описание изменений"

# Отправить на GitHub
git push origin main
```

## Что происходит при синхронизации

1. **Локальные изменения** → Git репозиторий
2. **Git репозиторий** → GitHub (автоматически)
3. **GitHub** → Vercel (через GitHub Actions)

## Мониторинг деплоя

- **GitHub Actions**: https://github.com/anton1989thai-metrika/METRIKA-5/actions
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Live сайт**: https://METRIKA-5.vercel.app

## Переменные окружения для Vercel

Убедитесь, что в Vercel настроены переменные:

```
NEXTAUTH_URL = https://METRIKA-5.vercel.app
NEXTAUTH_SECRET = случайная_строка
NEXT_PUBLIC_APP_URL = https://METRIKA-5.vercel.app
```

## Troubleshooting

### Если деплой не работает:

1. Проверьте GitHub Secrets
2. Убедитесь, что Vercel проект подключен
3. Проверьте логи в GitHub Actions
4. Проверьте переменные окружения в Vercel

### Если скрипт sync.sh не работает:

```bash
# Проверьте права доступа
ls -la sync.sh

# Если нужно, сделайте исполняемым
chmod +x sync.sh
```

## 🎯 Результат

После настройки любое изменение в проекте будет автоматически:
- ✅ Сохранено в Git
- ✅ Отправлено на GitHub  
- ✅ Развернуто на Vercel
- ✅ Доступно в интернете

**Время деплоя**: ~2-3 минуты
