import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getEmailUserId, isAdmin } from '@/lib/auth-email'
import { resolveAttachmentPath } from '@/lib/attachments'
import fs from 'fs/promises'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attId: string }> }
) {
  try {
    const { id, attId } = await params
    const viewEmail = request.nextUrl.searchParams.get('viewEmail') || undefined
    const admin = await isAdmin(request)
    const userId = await getEmailUserId(request, admin ? viewEmail : undefined)

    const email = await db.email.findFirst({
      where: { id, userId },
      select: { attachments: true },
    })

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    const list = Array.isArray(email.attachments) ? (email.attachments as any[]) : []
    const att = list.find((a) => String(a?.id || '') === String(attId))
    if (!att) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 })
    }

    if (!att.path) {
      return NextResponse.json(
        { error: 'Attachment content is not stored yet. Please re-sync this mailbox.' },
        { status: 409 }
      )
    }

    const { absPath } = resolveAttachmentPath(String(att.path))
    const file = await fs.readFile(absPath)

    const headers = new Headers()
    headers.set('Content-Type', String(att.contentType || 'application/octet-stream'))
    headers.set('Content-Length', String(file.length))
    const filename = String(att.filename || 'attachment').replace(/"/g, '')
    headers.set('Content-Disposition', `attachment; filename="${filename}"`)

    return new NextResponse(file, { status: 200, headers })
  } catch (e: any) {
    console.error('download attachment error', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}


