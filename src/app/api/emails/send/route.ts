import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import nodemailer, { type SentMessageInfo } from 'nodemailer'
import { getSessionUser } from '@/lib/auth/session'
import Imap from 'imap'
import MailComposer from 'nodemailer/lib/mail-composer'
import { storeAttachmentFile } from '@/lib/attachments'
import { getAllowedMailboxEmails } from '@/lib/mailbox-access'
import { getMailPasswordByEmail } from '@/lib/mail-password'
import { messageIdCandidates } from '@/lib/imap-message-id'

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
          const f = item as File
          const buf = Buffer.from(await f.arrayBuffer())
          attachments.push({
            filename: f.name || 'attachment',
            content: buf,
            contentType: f.type || undefined,
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
    // - any user: can specify fromEmail ONLY if they have access to that mailbox
    let senderEmail = String(sessionUser.email).toLowerCase()
    const requestedFrom = String(fromEmail || '').trim().toLowerCase()
    if (requestedFrom) {
      const { allowed, isAdmin } = await getAllowedMailboxEmails(request)
      if (!isAdmin && !allowed.includes(requestedFrom)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      senderEmail = requestedFrom
    }

    // userId in DB should be mailbox owner (sender)
    const { getEmailUserId } = await import('@/lib/auth-email')
    const userId = await getEmailUserId(request, senderEmail)

    // Configure SMTP transporter
    if (!process.env.SMTP_HOST) {
      return NextResponse.json(
        { error: 'SMTP не настроен. Укажите SMTP_HOST в .env' },
        { status: 400 }
      )
    }

    const mailboxPassword =
      (await getMailPasswordByEmail(senderEmail)) ??
      process.env.SMTP_PASS ??
      process.env.IMAP_PASS ??
      ''
    if (!mailboxPassword) {
      return NextResponse.json(
        { error: `Нет пароля для ящика ${senderEmail}. Задайте пароль в админ-панели → Email.` },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: senderEmail,
        pass: mailboxPassword,
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

    let smtpResult: SentMessageInfo
    try {
      smtpResult = await transporter.sendMail(mailOptions)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err || 'SMTP error')
      await db.mailDeliveryFailure.create({
        data: {
          mailboxEmail: senderEmail,
          userId,
          recipient: to,
          subject,
          error: errorMessage,
          source: 'smtp',
        },
      })
      return NextResponse.json({ error: 'Failed to send email' }, { status: 502 })
    }

    const sentMessageId = smtpResult.messageId
      ? String(smtpResult.messageId)
      : `<${Date.now()}@metrika.direct>`

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
        messageId: sentMessageId,
      })
        .compile()
        .build()

      const imap = new Imap({
        user: senderEmail,
        password: mailboxPassword,
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
            const messageId = smtpResult.messageId ? String(smtpResult.messageId) : ''
            const candidates = messageIdCandidates(sentMessageId || messageId)
            const searchNext = (idx: number) => {
              if (!candidates.length || idx >= candidates.length) {
                imap.append(raw, { mailbox, flags: ['\\Seen'], date: new Date() }, () => {
                  imap.end()
                  finish()
                })
                return
              }
              imap.search(['HEADER', 'MESSAGE-ID', candidates[idx]], (err, results) => {
                if (err) {
                  imap.append(raw, { mailbox, flags: ['\\Seen'], date: new Date() }, () => {
                    imap.end()
                    finish()
                  })
                  return
                }
                if (results && results.length > 0) {
                  imap.end()
                  finish()
                  return
                }
                searchNext(idx + 1)
              })
            }
            searchNext(0)
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
          messageKey: sentMessageId,
          filename: a.filename,
          contentType: a.contentType || 'application/octet-stream',
          content: a.content,
        })
        storedAttachments.push(stored)
      } catch {
        // ignore per-attachment errors
      }
    }

    const email = await db.email.create({
      data: {
        messageId: sentMessageId,
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
        imapMailbox: 'Sent',
        imapUid: null,
        attachments: storedAttachments.length
          ? (storedAttachments as Prisma.InputJsonValue)
          : undefined,
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
