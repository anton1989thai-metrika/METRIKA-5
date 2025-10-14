import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getUsers } from '@/data/users'

export async function GET(request: NextRequest) {
  try {
    // Получаем токен пользователя
    const token = await getToken({ req: request })
    console.log('API /user - получен токен:', token)
    
    if (!token) {
      console.log('API /user - токен не найден')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Получаем данные пользователя
    const users = await getUsers()
    console.log('API /user - загружены пользователи:', users.length)
    const user = users.find(u => u.email === token.email || u.login === token.email)
    console.log('API /user - найден пользователь:', user?.name)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Возвращаем данные пользователя без пароля
    const { password, ...userWithoutPassword } = user
    console.log('API /user - возвращаем пользователя:', userWithoutPassword.name, 'с разрешениями:', userWithoutPassword.detailedPermissions)
    return NextResponse.json(userWithoutPassword)
    
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
