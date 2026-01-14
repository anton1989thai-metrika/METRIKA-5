import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { prismaRoleToUiRole } from '@/lib/permissions-core'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: prismaRoleToUiRole(String(user.role || '')),
      detailedPermissions: user.detailedPermissions || null,
    },
  })
}
