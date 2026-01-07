# Руководство по миграции почты с Яндекс 360 на собственный сервер

## Обзор

Это руководство поможет вам перейти с Яндекс 360 на собственный почтовый сервер для домена `metrika.direct`.

## Шаг 1: Установка почтового сервера на VPS

### Подготовка

1. Подключитесь к вашему VPS по SSH:
```bash
ssh root@72.62.72.196
```

2. Скачайте скрипт установки на сервер:
```bash
# На вашем локальном компьютере
scp scripts/setup-mail-server-metrika.sh root@72.62.72.196:/root/
scp scripts/dns-config-metrika.txt root@72.62.72.196:/root/
```

Или клонируйте репозиторий на сервере:
```bash
git clone [ваш_репозиторий]
cd METRIKA-5-main
```

### Установка

1. Запустите скрипт установки:
```bash
sudo ./scripts/setup-mail-server-metrika.sh
```

2. Скрипт запросит:
   - IP адрес сервера (по умолчанию: 72.62.72.196)
   - Пароли для каждого почтового ящика

3. После установки получите DKIM ключ:
```bash
cat /etc/opendkim/keys/metrika.direct/mail.txt
```

Скопируйте содержимое из кавычек - оно понадобится для DNS.

## Шаг 2: Настройка DNS записей

### В панели nic.ru (RU-CENTER)

1. Войдите в панель управления DNS для домена `metrika.direct`
2. Добавьте следующие записи (см. `scripts/dns-config-metrika.txt`):

#### A запись
- Тип: A
- Имя: mail
- Значение: 72.62.72.196
- TTL: 3600

#### MX запись
- Тип: MX
- Имя: @
- Значение: mail.metrika.direct
- Приоритет: 10
- TTL: 3600

#### SPF запись
- Тип: TXT
- Имя: @
- Значение: `v=spf1 mx a:mail.metrika.direct ip4:72.62.72.196 ~all`
- TTL: 3600

#### DKIM запись
- Тип: TXT
- Имя: mail._domainkey
- Значение: [из файла mail.txt на сервере]
- TTL: 3600

#### DMARC запись
- Тип: TXT
- Имя: _dmarc
- Значение: `v=DMARC1; p=none; rua=mailto:dmarc@metrika.direct; ruf=mailto:dmarc@metrika.direct`
- TTL: 3600

### Обратная DNS запись (PTR)

Настройте через поддержку Hostinger:
- IP: 72.62.72.196
- Домен: mail.metrika.direct

## Шаг 3: Обновление .env файла

Обновите файл `.env` на вашем сайте:

```env
# IMAP настройки (для получения писем)
IMAP_HOST="mail.metrika.direct"
IMAP_PORT="993"
IMAP_USER="info@metrika.direct"  # Можно указать любой ящик, синхронизация работает для всех
IMAP_PASS="пароль_от_почтового_ящика"

# SMTP настройки (для отправки писем)
SMTP_HOST="mail.metrika.direct"
SMTP_PORT="587"
SMTP_USER="info@metrika.direct"  # Будет использоваться как отправитель по умолчанию
SMTP_PASS="пароль_от_почтового_ящика"
SMTP_FROM="info@metrika.direct"

# Список ящиков для синхронизации (опционально)
# Если не указано, будут синхронизироваться все ящики
SYNC_EMAILS="derik@metrika.direct,savluk@metrika.direct,info@metrika.direct"
```

## Шаг 4: Тестирование

### Проверка DNS

Подождите 5-60 минут после добавления DNS записей, затем проверьте:

```bash
# MX запись
dig MX metrika.direct

# SPF
dig TXT metrika.direct | grep spf

# DKIM
dig TXT mail._domainkey.metrika.direct
```

### Проверка почтового сервера

```bash
# Проверка портов
telnet mail.metrika.direct 25
telnet mail.metrika.direct 993

# Отправка тестового письма
echo "Test" | mail -s "Test Subject" info@metrika.direct
```

### Синхронизация писем

1. Откройте сайт: http://localhost:3000/email
2. Нажмите кнопку "Синхронизировать"
3. Или через API:
```bash
curl -X POST http://localhost:3000/api/emails/sync
```

## Шаг 5: Автоматическая синхронизация

Настройте cron для автоматической синхронизации каждые 5 минут:

```bash
crontab -e
```

Добавьте строку:
```
*/5 * * * * curl -X POST http://localhost:3000/api/emails/sync
```

Или на сервере (если сайт там же):
```
*/5 * * * * curl -X POST http://localhost:3000/api/emails/sync
```

## Шаг 6: Миграция данных с Яндекс 360

Если нужно перенести старые письма:

1. Экспортируйте письма из Яндекс 360 (через IMAP)
2. Импортируйте их на новый сервер

Или оставьте Яндекс 360 работать параллельно на время перехода.

## Созданные почтовые ящики

После установки будут созданы следующие ящики:
- derik@metrika.direct
- savluk@metrika.direct
- ionin@metrika.direct
- manager@metrika.direct
- smm@metrika.direct
- info@metrika.direct
- reg@metrika.direct
- kadastr@metrika.direct
- lawyer@metrika.direct
- kan@metrika.direct

## Добавление новых ящиков

Для добавления нового почтового ящика на сервере:

```bash
# Создать директорию
mkdir -p /var/mail/vhosts/metrika.direct/новый_ящик/{cur,new,tmp}
chown -R vmail:mail /var/mail/vhosts/metrika.direct/новый_ящик

# Создать пользователя
useradd -r -s /sbin/nologin -d /var/mail/vhosts/metrika.direct/новый_ящик -u 5001 -g mail новый_ящик
echo "новый_ящик:пароль" | chpasswd

# Добавить в Postfix
echo "новый_ящик@metrika.direct metrika.direct/новый_ящик/" >> /etc/postfix/virtual_mailbox
postmap /etc/postfix/virtual_mailbox

# Перезапустить Postfix
systemctl restart postfix
```

Также добавьте ящик в список в `src/lib/auth-email.ts` (функция `getAllMailboxes`).

## Устранение проблем

### Письма не приходят
1. Проверьте MX записи: `dig MX metrika.direct`
2. Проверьте логи: `tail -f /var/log/mail.log`
3. Проверьте firewall: откройте порты 25, 587, 993, 995

### Письма попадают в спам
1. Проверьте SPF: `dig TXT metrika.direct | grep spf`
2. Проверьте DKIM: `dig TXT mail._domainkey.metrika.direct`
3. Настройте обратную DNS (PTR)

### Ошибки подключения IMAP
1. Проверьте настройки в `.env`
2. Проверьте, что Dovecot запущен: `systemctl status dovecot`
3. Проверьте логи: `tail -f /var/log/dovecot.log`

## Безопасность

1. ✅ Используйте сильные пароли для почтовых ящиков
2. ✅ Настройте firewall (откройте только нужные порты)
3. ✅ Регулярно обновляйте систему
4. ✅ Настройте резервное копирование
5. ✅ Мониторьте логи на подозрительную активность

## Поддержка

При возникновении проблем проверьте:
- Логи почтового сервера: `/var/log/mail.log`, `/var/log/dovecot.log`
- Статус сервисов: `systemctl status postfix dovecot`
- DNS записи через онлайн-инструменты: https://mxtoolbox.com

