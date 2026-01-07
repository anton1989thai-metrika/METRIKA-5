import { NextRequest, NextResponse } from 'next/server'
import { deleteEmail, permanentlyDeleteEmail } from '@/lib/email'
import { getEmailUserId, isAdmin } from '@/lib/auth-email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const viewEmail = request.nextUrl.searchParams.get('viewEmail') || undefined
    const permanent = request.nextUrl.searchParams.get('permanent') === '1'
    const admin = await isAdmin(request)
    const userId = await getEmailUserId(request, admin ? viewEmail : undefined)

    if (permanent) {
      await permanentlyDeleteEmail(id, userId)
    } else {
      await deleteEmail(id, userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting email:', error)
    return NextResponse.json(
      { error: 'Failed to delete email' },
      { status: 500 }
    )
  }
}

