import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getEmailUserId, isAdmin } from '@/lib/auth-email'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const action = String(body.action || '')
    const ids = Array.isArray(body.ids) ? body.ids.map((x: any) => String(x)) : []
    if (!action || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'action and ids are required' }, { status: 400 })
    }

    const viewEmail = request.nextUrl.searchParams.get('viewEmail') || undefined
    const admin = await isAdmin(request)
    const userId = await getEmailUserId(request, admin ? viewEmail : undefined)

    if (action === 'markUnread') {
      const r = await db.email.updateMany({
        where: { userId, id: { in: ids } },
        data: { isRead: false },
      })
      return NextResponse.json({ success: true, updated: r.count })
    }

    if (action === 'markRead') {
      const r = await db.email.updateMany({
        where: { userId, id: { in: ids } },
        data: { isRead: true },
      })
      return NextResponse.json({ success: true, updated: r.count })
    }

    return NextResponse.json({ success: false, error: 'Unsupported action' }, { status: 400 })
  } catch (e: any) {
    console.error('bulk email action error', e)
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
  }
}


