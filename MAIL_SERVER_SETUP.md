# Настройка собственного почтового сервера

## Что нужно для настройки

### 1. Информация о сервере
- ✅ IP адрес сервера
- ✅ ОС (Ubuntu/Debian/CentOS)
- ✅ SSH доступ с root/sudo правами

### 2. Доступ к DNS
- ✅ Доступ к настройкам DNS для домена `metrika.direct`
- ✅ Возможность добавлять MX, A, TXT записи

### 3. Выбор метода установки

#### Вариант 1: Mail-in-a-Box (рекомендуется) ⭐
**Плюсы:**
- Автоматическая настройка всего
- Веб-интерфейс для управления
- Автоматическая настройка DNS
- SSL сертификаты
- Защита от спама

**Минусы:**
- Требует чистый сервер (Ubuntu 20.04/22.04)
- Меньше гибкости в настройке

**Установка:**
```bash
sudo ./scripts/setup-mail-server.sh
# Выберите вариант 1
```

#### Вариант 2: iRedMail
**Плюсы:**
- Полнофункциональный
- Веб-интерфейс
- Поддержка разных ОС

**Минусы:**
- Более сложная настройка
- Требует больше ресурсов

**Установка:**
```bash
sudo ./scripts/setup-mail-server.sh
# Выберите вариант 2
```

#### Вариант 3: Postfix + Dovecot (ручная настройка)
**Плюсы:**
- Полный контроль
- Легковесный
- Гибкая настройка

**Минусы:**
- Сложная ручная настройка
- Нужны знания Linux

**Установка:**
```bash
sudo ./scripts/install-postfix-dovecot.sh metrika.direct mail.metrika.direct [IP] [пароль]
```

## Быстрый старт

### Шаг 1: Подготовка сервера

1. Подключитесь к серверу по SSH:
```bash
ssh root@ваш_сервер_ip
```

2. Скачайте скрипты на сервер:
```bash
# На вашем локальном компьютере
scp -r scripts/ root@ваш_сервер_ip:/root/
```

3. Или клонируйте репозиторий на сервере:
```bash
git clone https://github.com/ваш_репозиторий/METRIKA-5.git
cd METRIKA-5
```

### Шаг 2: Запуск установки

```bash
sudo ./scripts/setup-mail-server.sh
```

Скрипт запросит:
- IP адрес сервера
- Домен (metrika.direct)
- Имя почтового сервера (mail.metrika.direct)
- Метод установки

### Шаг 3: Настройка DNS

После установки добавьте DNS записи (см. `scripts/dns-config.txt`):

1. **A запись**: `mail.metrika.direct` → IP сервера
2. **MX запись**: `metrika.direct` → `mail.metrika.direct`
3. **SPF запись**: защита от спама
4. **DKIM запись**: подпись писем
5. **DMARC запись**: политика обработки писем

### Шаг 4: Создание почтового ящика

#### Если использовали Mail-in-a-Box:
1. Откройте https://mail.metrika.direct/admin
2. Войдите с учетными данными администратора
3. Создайте ящик `reg@metrika.direct`

#### Если использовали Postfix + Dovecot:
```bash
# Создание пользователя (если еще не создан)
sudo useradd -m -s /bin/bash reg
sudo passwd reg

# Настройка почтового ящика
sudo mkdir -p /var/mail/vhosts/metrika.direct/reg
sudo chown -R vmail:mail /var/mail/vhosts
```

### Шаг 5: Обновление .env на сайте

Обновите файл `.env` на вашем сайте:

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

### Шаг 6: Тестирование

1. Отправьте тестовое письмо на `reg@metrika.direct`
2. Синхронизируйте письма:
```bash
curl -X POST http://localhost:3000/api/emails/sync
```
3. Проверьте в интерфейсе `/email`

## Автоматическая синхронизация

Настройте cron для автоматической синхронизации каждые 5 минут:

```bash
crontab -e
# Добавьте строку:
*/5 * * * * curl -X POST http://localhost:3000/api/emails/sync
```

## Устранение проблем

### Письма не приходят
1. Проверьте MX записи: `dig MX metrika.direct`
2. Проверьте, что сервер слушает порт 25: `netstat -tlnp | grep 25`
3. Проверьте логи: `tail -f /var/log/mail.log`

### Письма попадают в спам
1. Проверьте SPF: `dig TXT metrika.direct | grep spf`
2. Проверьте DKIM: `dig TXT mail._domainkey.metrika.direct`
3. Настройте обратную DNS запись (PTR) у хостинг-провайдера

### Ошибки подключения IMAP
1. Проверьте, что Dovecot запущен: `systemctl status dovecot`
2. Проверьте порты: `netstat -tlnp | grep 993`
3. Проверьте логи: `tail -f /var/log/dovecot.log`

## Безопасность

1. ✅ Используйте сильные пароли
2. ✅ Настройте firewall (откройте только нужные порты: 25, 587, 993, 995)
3. ✅ Регулярно обновляйте систему
4. ✅ Настройте резервное копирование
5. ✅ Мониторьте логи на подозрительную активность

## Полезные команды

```bash
# Проверка статуса сервисов
systemctl status postfix
systemctl status dovecot

# Просмотр логов
tail -f /var/log/mail.log
tail -f /var/log/dovecot.log

# Тест отправки письма
echo "Test" | mail -s "Test" reg@metrika.direct

# Проверка очереди писем
postqueue -p
```

