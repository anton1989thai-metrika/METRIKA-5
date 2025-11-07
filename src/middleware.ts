import { NextRequest, NextResponse } from 'next/server'

// Авторизация отключена - все страницы доступны всем пользователям
export async function middleware(request: NextRequest) {
  // Просто пропускаем все запросы без проверки авторизации
  return NextResponse.next()
}
