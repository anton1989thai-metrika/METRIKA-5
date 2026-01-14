import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getEmailUserId } from '@/lib/auth-email'
import { StoredAttachment, resolveAttachmentPath } from '@/lib/attachments'
import { resolveRequestedMailbox } from '@/lib/mailbox-access'
import fs from 'fs/promises'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attId: string }> }
) {
  try {
    const { id, attId } = await params
    const { mailboxEmail } = await resolveRequestedMailbox(request)
    const userId = await getEmailUserId(request, mailboxEmail)

    const email = await db.email.findFirst({
      where: { id, userId },
      select: { attachments: true },
    })

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    const list = Array.isArray(email.attachments)
      ? (email.attachments as StoredAttachment[])
      : []
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

    return new NextResponse(new Uint8Array(file), { status: 200, headers })
  } catch (e) {
    console.error('download attachment error', e)
    const err = e as { message?: string }
    const msg = err.message || ''
    if (msg === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (msg === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
