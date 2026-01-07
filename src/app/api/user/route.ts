import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

function prismaRoleToUi(role: string): string {
  if (role === 'site_user') return 'site-user'
  if (role === 'foreign_employee') return 'foreign-employee'
  return role
}

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    // Получаем полные данные пользователя из базы данных
    const fullUser = await db.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        detailedPermissions: true,
        createdAt: true,
      },
    })
    
    if (!fullUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name || fullUser.email.split('@')[0],
      role: prismaRoleToUi(String(fullUser.role)),
      status: fullUser.status || 'active',
      detailedPermissions: (fullUser as any).detailedPermissions || null,
      createdAt: fullUser.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
