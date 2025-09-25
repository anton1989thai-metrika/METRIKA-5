# Инструкции для загрузки проекта на GitHub

## Шаг 1: Создайте репозиторий на GitHub

1. Откройте https://github.com
2. Нажмите кнопку "New repository" (зеленая кнопка)
3. Заполните форму:
   - **Repository name**: `METRIKA-5`
   - **Description**: `Портал агентства недвижимости МЕТРИКА`
   - **Visibility**: Public (или Private по желанию)
   - **НЕ** добавляйте README, .gitignore или лицензию (они уже есть)
4. Нажмите "Create repository"

## Шаг 2: Подключите локальный репозиторий к GitHub

Выполните эти команды в терминале (замените YOUR_USERNAME на ваш GitHub username):

```bash
cd /Users/antonnehoroskov/Desktop/METRIKA-5/METRIKA-5

# Добавьте удаленный репозиторий
git remote add origin https://github.com/YOUR_USERNAME/METRIKA-5.git

# Переименуйте ветку в main (если нужно)
git branch -M main

# Загрузите код на GitHub
git push -u origin main
```

## Шаг 3: Проверьте результат

После выполнения команд:
1. Откройте https://github.com/YOUR_USERNAME/METRIKA-5
2. Убедитесь, что все файлы загружены
3. Проверьте README.md

## Шаг 4: Деплой на Vercel

1. Откройте https://vercel.com
2. Нажмите "New Project"
3. Подключите GitHub репозиторий `METRIKA-5`
4. Vercel автоматически определит настройки Next.js
5. Добавьте переменные окружения:
   - `NEXTAUTH_URL` = ваш домен Vercel
   - `NEXTAUTH_SECRET` = случайная строка (например: `openssl rand -base64 32`)
   - `NEXT_PUBLIC_APP_URL` = ваш домен Vercel
6. Нажмите "Deploy"

## Готово! 🎉

Ваш проект будет доступен по адресу: `https://METRIKA-5.vercel.app`

---

**Альтернативный способ через GitHub CLI:**

Если хотите установить GitHub CLI:
```bash
brew install gh
gh auth login
gh repo create METRIKA-5 --public --description "Портал агентства недвижимости МЕТРИКА"
git push -u origin main
```
