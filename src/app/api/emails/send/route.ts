import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import nodemailer from 'nodemailer'
import { getSessionUser } from '@/lib/auth/session'
import Imap from 'imap'
import MailComposer from 'nodemailer/lib/mail-composer'
import { storeAttachmentFile } from '@/lib/attachments'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let to = ''
    let subject = ''
    let text = ''
    let html: string | undefined
    let cc: string | undefined
    let bcc: string | undefined
    let fromEmail: string | undefined
    const attachments: Array<{ filename: string; content: Buffer; contentType?: string }> = []

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      to = String(form.get('to') || '')
      subject = String(form.get('subject') || '')
      text = String(form.get('text') || '')
      cc = String(form.get('cc') || '') || undefined
      bcc = String(form.get('bcc') || '') || undefined
      fromEmail = String(form.get('fromEmail') || '') || undefined
      html = String(form.get('html') || '') || undefined

      const files = form.getAll('attachments')
      for (const item of files) {
        if (item && typeof item === 'object' && 'arrayBuffer' in item) {
          const f = item as unknown as File
          const buf = Buffer.from(await f.arrayBuffer())
          attachments.push({
            filename: (f as any).name || 'attachment',
            content: buf,
            contentType: (f as any).type || undefined,
          })
        }
      }
    } else {
      const body = await request.json()
      to = String(body.to || '')
      subject = String(body.subject || '')
      text = String(body.text || '')
      html = body.html
      cc = body.cc
      bcc = body.bcc
      fromEmail = body.fromEmail
    }
    
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Decide which mailbox we send as:
    // - normal user: always self
    // - admin: can specify fromEmail to send as that mailbox
    let senderEmail = String(sessionUser.email).toLowerCase()
    const requestedFrom = String(fromEmail || '').trim().toLowerCase()
    if (requestedFrom && sessionUser.role === 'admin') {
      senderEmail = requestedFrom
    }

    // userId in DB should be mailbox owner (sender)
    const { getEmailUserId } = await import('@/lib/auth-email')
    const userId = await getEmailUserId(request, senderEmail)

    // Configure SMTP transporter
    if (!process.env.SMTP_HOST || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: 'SMTP не настроен. Укажите SMTP_HOST и SMTP_PASS в .env' },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: senderEmail,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Для самоподписанных сертификатов
      },
    })

    // Send email via SMTP
    const mailOptions = {
      from: senderEmail,
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    const smtpResult = await transporter.sendMail(mailOptions)

    // Append a copy to sender's IMAP Sent folder (so it exists on server too)
    try {
      const raw = await new MailComposer({
        from: senderEmail,
        to,
        cc,
        bcc,
        subject,
        text,
        html,
        attachments: attachments.length > 0 ? attachments : undefined,
        date: new Date(),
        messageId: smtpResult.messageId || undefined,
      })
        .compile()
        .build()

      const imap = new Imap({
        user: senderEmail,
        password: process.env.IMAP_PASS || '',
        host: process.env.IMAP_HOST || 'mail.metrika.direct',
        port: parseInt(process.env.IMAP_PORT || '993'),
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        connTimeout: 10_000,
        authTimeout: 10_000,
        socketTimeout: 30_000,
        keepalive: {
          interval: 10_000,
          idleInterval: 30_000,
          forceNoop: true,
        },
      })

      await new Promise<void>((resolve) => {
        const finish = () => resolve()
        imap.once('ready', () => {
          const mailbox = 'Sent'
          imap.addBox(mailbox, () => {
            imap.append(raw, { mailbox, flags: ['\\Seen'], date: new Date() }, () => {
              imap.end()
              finish()
            })
          })
        })
        imap.once('error', () => finish())
        imap.once('end', () => finish())
        imap.connect()
      })
    } catch (e) {
      // Don't fail API if IMAP append fails; DB still keeps sent copy.
      console.warn('IMAP append to Sent failed:', e)
    }

    // Save to database
    const messageId = `<${Date.now()}@metrika.direct>`
    const date = new Date()

    // Create or find thread
    let thread = await db.thread.findFirst({
      where: {
        userId,
        subject,
      },
    })

    if (!thread) {
      thread = await db.thread.create({
        data: {
          userId,
          subject,
        },
      })
    }

    // Get sent folder
    const sentFolder = await db.folder.findFirst({
      where: {
        userId,
        slug: 'sent',
      },
    })

    // Save sent email
    const storedAttachments = []
    for (const a of attachments) {
      try {
        const stored = await storeAttachmentFile({
          userId,
          messageKey: smtpResult.messageId || messageId,
          filename: a.filename,
          contentType: a.contentType || 'application/octet-stream',
          content: a.content,
        })
        storedAttachments.push(stored)
      } catch (e) {
        // ignore per-attachment errors
      }
    }

    const email = await db.email.create({
      data: {
        messageId: smtpResult.messageId || messageId,
        threadId: thread.id,
        userId,
        from: senderEmail,
        to,
        cc,
        bcc,
        subject,
        text,
        html,
        date,
        isRead: true,
        folderId: sentFolder?.id || null, // Sent emails go to sent folder
        attachments: storedAttachments.length ? (storedAttachments as any) : null,
      },
    })

    return NextResponse.json({ success: true, email })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

