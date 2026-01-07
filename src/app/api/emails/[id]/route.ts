import { NextRequest, NextResponse } from 'next/server'
import { getEmailById } from '@/lib/email'
import { getEmailUserId, isAdmin } from '@/lib/auth-email'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const viewEmail = request.nextUrl.searchParams.get('viewEmail') || undefined
    const admin = await isAdmin(request)
    const userId = await getEmailUserId(request, admin ? viewEmail : undefined)

    const email = await getEmailById(id, userId)

    if (!email) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(email)
  } catch (error) {
    console.error('Error fetching email:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email' },
      { status: 500 }
    )
  }
}

