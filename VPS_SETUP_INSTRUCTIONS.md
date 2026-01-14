# Инструкция по настройке почтового сервера на VPS

## Данные для подключения:
**Пароль:** задайте в переменной окружения `VPS_PASSWORD` (не храните пароль в файлах репозитория).

## Шаг 1: Узнать IP адрес сервера

Если у вас есть доступ к панели Hostinger, найдите IP адрес вашего VPS там.

Или попробуйте подключиться, если знаете hostname.

## Шаг 2: Подключение к серверу

### Рекомендуется (один раз): настроить SSH-ключи

Это позволит деплоить и подключаться без пароля.

```bash
bash scripts/setup-ssh-key-access.sh
```

### Вариант A: Через скрипт (автоматически)

```bash
export VPS_HOST="your-server-ip"
./scripts/connect-to-vps.sh
```

### Вариант B: Вручную через SSH

```bash
ssh root@your-server-ip
# Пароль: (введите свой пароль)
```

## Шаг 3: Проверка сервера

После подключения проверьте:

```bash
# Проверка ОС
cat /etc/os-release

# Проверка IP адреса
hostname -I

# Проверка свободного места
df -h
```

## Шаг 4: Установка почтового сервера

### Если Ubuntu 20.04/22.04 - используйте Mail-in-a-Box:

```bash
cd /root
git clone https://github.com/mail-in-a-box/mailinabox.git
cd mailinabox
sudo setup/start.sh
```

Во время установки укажите:
- **Hostname:** `mail.metrika.direct`
- **Email администратора:** `admin@metrika.direct`
- **Пароль администратора:** (придумайте надежный)

### Если другая ОС - используйте Postfix + Dovecot:

```bash
# На сервере выполните:
cd /root
git clone https://github.com/your-repo/METRIKA-5.git
cd METRIKA-5
chmod +x scripts/install-postfix-dovecot.sh
sudo ./scripts/install-postfix-dovecot.sh metrika.direct mail.metrika.direct YOUR_SERVER_IP
```

## Шаг 5: Настройка DNS

После установки почтового сервера настройте DNS записи:

1. **A запись:**
   - Имя: `mail`
   - Значение: `YOUR_SERVER_IP`
   - TTL: 3600

2. **MX запись:**
   - Имя: `@` (или `metrika.direct`)
   - Значение: `mail.metrika.direct`
   - Приоритет: `10`
   - TTL: 3600

3. **SPF запись:**
   - Тип: TXT
   - Имя: `@`
   - Значение: `v=spf1 mx a:mail.metrika.direct ~all`

4. **DKIM запись** (получите на сервере):
   ```bash
   # Для Mail-in-a-Box: будет показан во время установки
   # Для Postfix:
   cat /etc/opendkim/keys/metrika.direct/mail.txt
   ```

5. **DMARC запись:**
   - Тип: TXT
   - Имя: `_dmarc`
   - Значение: `v=DMARC1; p=none; rua=mailto:dmarc@metrika.direct`

## Шаг 6: Обновление .env на сайте

Обновите файл `.env`:

```env
IMAP_HOST="mail.metrika.direct"
IMAP_PORT="993"
IMAP_USER="reg@metrika.direct"
IMAP_PASS="пароль_от_почтового_ящика"

SMTP_HOST="mail.metrika.direct"
SMTP_PORT="587"
SMTP_USER="reg@metrika.direct"
SMTP_PASS="пароль_от_почтового_ящика"
SMTP_FROM="reg@metrika.direct"
```

## Готово!

После настройки DNS (может занять до 48 часов, обычно 1-2 часа) письма будут приходить на ваш сервер.
