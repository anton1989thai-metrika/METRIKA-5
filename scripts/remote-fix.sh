#!/usr/bin/expect -f

# Скрипт для автоматического подключения и исправления почтового сервера
# Использование: ./remote-fix.sh

set timeout 300
if {![info exists env(VPS_PASSWORD)] || $env(VPS_PASSWORD) eq ""} {
    puts "VPS_PASSWORD is not set. Run: export VPS_PASSWORD='...'"
    exit 1
}
set password $env(VPS_PASSWORD)
set server "root@72.62.72.196"

# Загружаем скрипт исправления на сервер
spawn scp scripts/complete-mail-fix.sh $server:/root/
expect {
    "password:" {
        send "$password\r"
        exp_continue
    }
    "yes/no" {
        send "yes\r"
        exp_continue
    }
    eof
}

# Подключаемся и выполняем скрипт
spawn ssh -o StrictHostKeyChecking=no $server
expect {
    "password:" {
        send "$password\r"
    }
    "yes/no" {
        send "yes\r"
        exp_continue
    }
}

expect "# "
send "cd /root\r"
expect "# "
send "chmod +x complete-mail-fix.sh\r"
expect "# "
send "./complete-mail-fix.sh\r"

# Ждем завершения
expect {
    "✅ УСПЕХ" {
        puts "\n✅ Скрипт выполнен успешно!"
    }
    "⚠️" {
        puts "\n⚠️ Есть предупреждения, проверьте отчет"
    }
    timeout {
        puts "\n⏱ Скрипт выполняется..."
    }
}

# Получаем отчет
expect "# "
send "cat /root/mail-fix-report-*.txt | tail -50\r"
expect "# "
send "exit\r"
expect eof
