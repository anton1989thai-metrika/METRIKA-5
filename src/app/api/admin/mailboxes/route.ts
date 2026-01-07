import { NextRequest, NextResponse } from 'next/server'
import { mailboxctl } from '@/lib/mailboxctl'

export const runtime = 'nodejs'

function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export async function GET(request: NextRequest) {
  try {
    const secret = request.headers.get('x-admin-secret')
    const { stdout } = await mailboxctl('list', [], secret)
    const mailboxes = stdout
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
    return NextResponse.json({ success: true, mailboxes })
  } catch (e: any) {
    const msg = e?.message || 'Failed to list mailboxes'
    const status = msg === 'Unauthorized' ? 401 : 500
    return jsonError(msg, status)
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-admin-secret')
    const body = await request.json().catch(() => ({}))
    const email = String(body.email || '').trim()
    const password = String(body.password || '')
    if (!email || !password) return jsonError('email and password are required', 400)

    await mailboxctl('create', [email, password], secret)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    const msg = e?.message || 'Failed to create mailbox'
    const status = msg === 'Unauthorized' ? 401 : 500
    return jsonError(msg, status)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const secret = request.headers.get('x-admin-secret')
    const body = await request.json().catch(() => ({}))
    const email = String(body.email || '').trim()
    const password = String(body.password || '')
    if (!email || !password) return jsonError('email and password are required', 400)

    await mailboxctl('passwd', [email, password], secret)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    const msg = e?.message || 'Failed to change password'
    const status = msg === 'Unauthorized' ? 401 : 500
    return jsonError(msg, status)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const secret = request.headers.get('x-admin-secret')
    const url = new URL(request.url)
    const email = String(url.searchParams.get('email') || '').trim()
    if (!email) return jsonError('email is required', 400)

    await mailboxctl('delete', [email], secret)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    const msg = e?.message || 'Failed to delete mailbox'
    const status = msg === 'Unauthorized' ? 401 : 500
    return jsonError(msg, status)
  }
}


