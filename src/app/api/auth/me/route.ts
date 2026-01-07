import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'

export const runtime = 'nodejs'

function roleToUi(role: string) {
  // Prisma enum uses snake_case for mapped values (site_user, foreign_employee)
  if (role === 'site_user') return 'site-user'
  if (role === 'foreign_employee') return 'foreign-employee'
  return role
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: roleToUi(String((user as any).role || '')),
      detailedPermissions: (user as any).detailedPermissions || null,
    },
  })
}

