#!/usr/bin/expect -f

# Скрипт для скачивания файлов с VPS
set timeout 300

set server "root@72.62.72.196"
set vps_path "/var/www/metrika5"
set local_backup "/tmp/vps-backup-metrika5"
if {![info exists env(VPS_PASSWORD)] || $env(VPS_PASSWORD) eq ""} {
    puts "VPS_PASSWORD is not set. Run: export VPS_PASSWORD='...'"
    exit 1
}
set password $env(VPS_PASSWORD)

puts "📥 Скачивание файлов с VPS..."

spawn rsync -avz --progress \
  -e "ssh -o StrictHostKeyChecking=no" \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=out \
  --exclude=.git \
  --exclude="*.db" \
  --exclude="*.db-journal" \
  --exclude=".env*" \
  --exclude=dist \
  --exclude=build \
  "$server:$vps_path/" "$local_backup/"

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

puts "\n✅ Файлы скачаны в $local_backup"
