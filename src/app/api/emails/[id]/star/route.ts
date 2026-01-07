import { NextRequest, NextResponse } from 'next/server'
import { toggleStarEmail } from '@/lib/email'
import { getEmailUserId, isAdmin } from '@/lib/auth-email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const viewEmail = request.nextUrl.searchParams.get('viewEmail') || undefined
    const admin = await isAdmin(request)
    const userId = await getEmailUserId(request, admin ? viewEmail : undefined)

    const email = await toggleStarEmail(id, userId)

    return NextResponse.json(email)
  } catch (error) {
    console.error('Error toggling star:', error)
    return NextResponse.json(
      { error: 'Failed to toggle star' },
      { status: 500 }
    )
  }
}

