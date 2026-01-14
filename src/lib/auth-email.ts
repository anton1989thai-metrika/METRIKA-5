import { NextRequest } from 'next/server'
import { initializeEmailUser } from './init-email'
import { getSessionUser } from '@/lib/auth/session'

/**
 * Инициализирует пользователя почты и возвращает его ID
 */
export async function getEmailUserId(request: NextRequest, targetEmail?: string): Promise<string> {
  const sessionUser = await getSessionUser(request)
  const userEmail = String(targetEmail || sessionUser?.email || '').trim().toLowerCase()
  if (!userEmail) {
    throw new Error('Unauthorized')
  }
  const user = await initializeEmailUser(userEmail, userEmail.split('@')[0])
  return user.id
}
