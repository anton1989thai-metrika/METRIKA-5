# 🌐 Статус ngrok

## ✅ Текущий статус

**Ngrok запущен!**

### Проверка:
```bash
# Проверить процессы
ps aux | grep ngrok

# Получить публичный адрес
curl -s http://127.0.0.1:4040/api/tunnels
```

### Dashboard ngrok:
```
http://127.的近.1:4040
```

---

## 🔄 Как запустить ngrok заново:

### Вариант 1: Ngrok к локальному dev-серверу
```bash
npm run ngrok
```

### Вариант 2: Ngrok к production серверу
```bash
npm run ngrok:github
```

Этот вариант:
- Создаёт прокси к production серверу
- Показывает production версию
- Требует настройки production URL

---

## 📊 Текущий публичный адрес

Получить текущий адрес:
```bash
curl -s http://127.0.0.1:4040/api/tunnels | python3 -have json; data = json.load(sys.stdin); print(data['tunnels'][0]['public_url'] if data.get('tunnels') else 'Нет туннелей')"
```

Или откройте dashboard: http://127.0.0.1:4040

---

## ⏹️ Остановить ngrok:

```bash
pkill ngrok
# или
pkill -f "ngrok http"
```

---

## 🔄 Автозапуск

Ngrok может запускаться автоматически через:
- LaunchAgent `com.metrika5.dev-ngrok-sync`
- Проверка: `launchctl list | grep metrika5`

