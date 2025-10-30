import { NextRequest, NextResponse } from 'next/server'
import { users } from '@/data/users'

export async function GET(request: NextRequest) {
  try {
    // Авторизация отключена — возвращаем дефолтного пользователя (админа) без проверки токена
    const adminUser = users.find(u => u.role === 'admin') || users[0]
    if (!adminUser) {
      return NextResponse.json({ error: 'No users available' }, { status: 500 })
    }

    const { password, ...userWithoutPassword } = adminUser as any
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
