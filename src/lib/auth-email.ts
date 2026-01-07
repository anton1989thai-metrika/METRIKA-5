import { NextRequest } from 'next/server'
import { users } from '@/data/users'
import { initializeEmailUser } from './init-email'
import { getSessionUser } from '@/lib/auth/session'

/**
 * Получает email пользователя из запроса
 * Пока используется заглушка, позже можно интегрировать с реальной авторизацией
 */
export async function getCurrentUserEmail(request: NextRequest): Promise<string> {
  // TODO: Реализовать реальную авторизацию через сессию/токен
  // Пока используем заглушку - получаем из заголовка или используем дефолтного пользователя

  // Priority 1: real session user
  const sessionUser = await getSessionUser(request)
  if (sessionUser?.email) return sessionUser.email
  
  // Попытка получить из заголовка (если будет реализована авторизация)
  const userEmail = request.headers.get('x-user-email')
  if (userEmail) {
    return userEmail
  }

  // Получаем из query параметра (для тестирования)
  const url = new URL(request.url)
  const emailParam = url.searchParams.get('userEmail')
  if (emailParam) {
    return emailParam
  }

  // Дефолтный пользователь (админ)
  const adminUser = users.find(u => u.role === 'admin')
  if (adminUser && adminUser.email) {
    // Для старта (пока реальная авторизация не подключена) используем единый ящик
    return process.env.DEFAULT_MAILBOX_EMAIL || 'info@metrika.direct'
  }

  // Fallback
  return process.env.DEFAULT_MAILBOX_EMAIL || 'info@metrika.direct'
}

/**
 * Проверяет, является ли пользователь админом
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const sessionUser = await getSessionUser(request)
  if (sessionUser) return sessionUser.role === 'admin'
  const userEmail = await getCurrentUserEmail(request)
  const user = users.find(u => u.email === userEmail)
  return user?.role === 'admin' || false
}

/**
 * Получает все почтовые ящики для админа
 */
export function getAllMailboxes(): string[] {
  return [
    'derik@metrika.direct',
    'savluk@metrika.direct',
    'ionin@metrika.direct',
    'manager@metrika.direct',
    'smm@metrika.direct',
    'info@metrika.direct',
    'reg@metrika.direct',
    'kadastr@metrika.direct',
    'lawyer@metrika.direct',
    'kan@metrika.direct',
  ]
}

/**
 * Инициализирует пользователя почты и возвращает его ID
 */
export async function getEmailUserId(request: NextRequest, targetEmail?: string): Promise<string> {
  const userEmail = targetEmail || await getCurrentUserEmail(request)
  const user = await initializeEmailUser(userEmail, userEmail.split('@')[0])
  return user.id
}

