# Инструкция по исправлению проблемы LMTP доставки

## Проблема
- Postfix принимает письмо, но доставка через LMTP откладывается (451 4.3.0 Temporary internal error)
- В логах Dovecot: `auth-master: userdb lookup failed`
- Пользователь info существует в системе (uid=992, gid=mail)

## Решение

### Вариант 1: Автоматическое исправление (рекомендуется)

1. Загрузите скрипт на сервер:
```bash
scp scripts/fix-lmtp-userdb-issue.sh root@72.62.72.196:/root/
```

2. Подключитесь к серверу:
```bash
ssh root@72.62.72.196
```

3. Запустите скрипт:
```bash
cd /root
chmod +x fix-lmtp-userdb-issue.sh
sudo ./fix-lmtp-userdb-issue.sh
```

### Вариант 2: Ручное исправление

#### Шаг 1: Настройка userdb в Dovecot

Отредактируйте `/etc/dovecot/conf.d/10-auth.conf`:

```bash
nano /etc/dovecot/conf.d/10-auth.conf
```

Добавьте/замените на:

```
# Authentication для системных пользователей
passdb {
  driver = pam
  args = session=yes dovecot
}

# User database для системных пользователей
userdb {
  driver = passwd
  args = blocking=no
}
```

#### Шаг 2: Настройка mail_location

Отредактируйте `/etc/dovecot/conf.d/10-mail.conf`:

```bash
nano /etc/dovecot/conf.d/10-mail.conf
```

Добавьте/замените на:

```
mail_location = mbox:~/mail:INBOX=/var/mail/%u
mail_privileged_group = mail
```

#### Шаг 3: Настройка service lmtp

Отредактируйте `/etc/dovecot/conf.d/10-master.conf`:

```bash
nano /etc/dovecot/conf.d/10-master.conf
```

Добавьте/убедитесь что есть:

```
service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
  user = root
}

service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
  user = root
}
```

#### Шаг 4: Исправление Postfix

Проверьте конфликт mydestination и virtual_mailbox_domains:

```bash
postconf -h mydestination
postconf -h virtual_mailbox_domains
```

Если `metrika.direct` есть в обоих, уберите из mydestination:

```bash
postconf -e "mydestination = \$myhostname, localhost.\$mydomain, localhost"
```

Убедитесь что virtual_transport настроен:

```bash
postconf -e "virtual_transport = lmtp:unix:private/dovecot-lmtp"
```

#### Шаг 5: Создание почтовых директорий

```bash
# Создать директорию mail для пользователя info
mkdir -p $(getent passwd info | cut -d: -f6)/mail
chown info:mail $(getent passwd info | cut -d: -f6)/mail
chmod 700 $(getent passwd info | cut -d: -f6)/mail

# Создать/обновить /var/mail/info
touch /var/mail/info
chown info:mail /var/mail/info
chmod 600 /var/mail/info
```

#### Шаг 6: Перезапуск и проверка

```bash
# Проверка конфигурации
doveconf -n

# Перезапуск
systemctl restart dovecot
systemctl restart postfix

# Проверка статуса
systemctl status dovecot
systemctl status postfix
```

#### Шаг 7: Тестирование

```bash
# Отправка тестового письма
echo "test" | sendmail info@metrika.direct

# Проверка логов
tail -f /var/log/dovecot.log
tail -f /var/log/mail.log

# Проверка очереди
postqueue -p
```

## Что исправлено

1. **userdb driver = passwd** - для чтения системных пользователей из /etc/passwd
2. **mail_location = mbox:~/mail:INBOX=/var/mail/%u** - правильное расположение почты для системных пользователей
3. **service lmtp { user = root }** - LMTP работает от root для доступа к системным пользователям
4. **Убран конфликт mydestination/virtual_mailbox_domains** - metrika.direct убран из mydestination
5. **Созданы почтовые директории** - /var/mail/info и ~/mail для пользователя info

## Проверка успешности

После исправлений команда должна работать без deferred:

```bash
echo "test" | sendmail info@metrika.direct
postqueue -p  # не должно быть писем в очереди
```

В логах должно быть:
- `dovecot: lmtp(info@metrika.direct): ... saved mail to INBOX`
- `postfix/smtp: ... delivered via dovecot-lmtp`

