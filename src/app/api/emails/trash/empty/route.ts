import { NextRequest, NextResponse } from 'next/server'
import { emptyTrash } from '@/lib/email'
import { getEmailUserId, isAdmin } from '@/lib/auth-email'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const viewEmail = request.nextUrl.searchParams.get('viewEmail') || undefined
    const admin = await isAdmin(request)
    const userId = await getEmailUserId(request, admin ? viewEmail : undefined)

    const result = await emptyTrash(userId)
    return NextResponse.json({ success: true, deleted: result.count })
  } catch (error) {
    console.error('Error emptying trash:', error)
    return NextResponse.json({ error: 'Failed to empty trash' }, { status: 500 })
  }
}


