# Настройка Email Клиента

Этот документ описывает настройку собственного почтового клиента на основе шаблона [next-email-client](https://github.com/leerob/next-email-client).

## Установка зависимостей

```bash
npm install nodemailer pg @types/nodemailer @types/pg
```

## Настройка базы данных

1. Создайте файл `.env` в корне проекта:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/metrika_email?schema=public"
SMTP_HOST="your-smtp-server.com"
SMTP_PORT="587"
SMTP_USER="your-email@metrika.direct"
SMTP_PASS="your-password"
SMTP_FROM="noreply@metrika.direct"
```

2. Инициализируйте базу данных:

```bash
npx prisma generate
npx prisma db push
```

3. Создайте начальные папки (опционально):

```bash
npx prisma studio
# Создайте папки через Prisma Studio или через API
```

## Настройка почтового сервера

### Вариант 1: Использование существующего SMTP сервера

Если у вас уже есть почтовый сервер, просто укажите его настройки в `.env`.

### Вариант 2: Настройка собственного почтового сервера

1. **Установите почтовый сервер** (например, Postfix + Dovecot):
   - На Ubuntu/Debian: `sudo apt-get install postfix dovecot-core dovecot-imapd`
   - Следуйте инструкциям по настройке

2. **Настройте DNS записи**:
   - MX запись: указывает на ваш почтовый сервер
   - SPF запись: `v=spf1 mx ~all`
   - DKIM запись: сгенерируйте ключ и добавьте TXT запись
   - DMARC запись: `v=DMARC1; p=none; rua=mailto:dmarc@metrika.direct`

3. **Настройте SSL/TLS** для безопасной передачи

## Получение писем с сервера

Для получения писем с почтового сервера нужно настроить IMAP синхронизацию. Это можно сделать через:

1. **Cron job** для периодической синхронизации
2. **Webhook** от почтового сервера (если поддерживается)
3. **API endpoint** для ручной синхронизации

Пример скрипта синхронизации будет добавлен позже.

## Использование

1. Запустите сервер разработки:
```bash
npm run dev
```

2. Откройте http://localhost:3000/email

3. Используйте интерфейс для:
   - Просмотра писем
   - Отправки писем
   - Управления папками
   - Поиска по письмам

## API Endpoints

- `GET /api/emails?folder=inbox&search=query` - Получить список писем
- `GET /api/emails/[id]` - Получить письмо по ID
- `POST /api/emails/send` - Отправить письмо
- `POST /api/emails/[id]/delete` - Удалить письмо
- `POST /api/emails/[id]/star` - Добавить/убрать звездочку

## Структура базы данных

- `User` - Пользователи
- `Folder` - Папки (Inbox, Sent, Trash и т.д.)
- `Thread` - Цепочки писем
- `Email` - Отдельные письма

## Следующие шаги

1. Настроить аутентификацию пользователей
2. Реализовать IMAP синхронизацию для получения писем
3. Добавить поддержку вложений
4. Настроить фильтры и правила
5. Добавить поддержку нескольких аккаунтов

