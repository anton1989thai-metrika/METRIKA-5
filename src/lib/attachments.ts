import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export type StoredAttachment = {
  id: string
  filename: string
  contentType: string
  size: number
  path: string // relative to attachments root
}

const DEFAULT_ATTACHMENTS_DIR = path.join(process.cwd(), 'uploads', 'email-attachments')

function getAttachmentsRoot(): string {
  return process.env.ATTACHMENTS_DIR?.trim() || DEFAULT_ATTACHMENTS_DIR
}

function safeFilename(name: string): string {
  const base = (name || 'attachment').replace(/[/\\?%*:|"<>]/g, '_')
  // avoid super long names
  return base.length > 200 ? base.slice(0, 200) : base
}

function hashKey(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export async function storeAttachmentFile(opts: {
  userId: string
  messageKey: string // messageId or any stable key
  filename: string
  contentType: string
  content: Buffer
}): Promise<StoredAttachment> {
  const root = getAttachmentsRoot()
  const attachmentId = crypto.randomUUID()
  const safeName = safeFilename(opts.filename)
  const bucket = hashKey(opts.messageKey).slice(0, 24)
  const relDir = path.join(opts.userId, bucket)
  const absDir = path.join(root, relDir)
  await fs.mkdir(absDir, { recursive: true })

  const relPath = path.join(relDir, `${attachmentId}__${safeName}`)
  const absPath = path.join(root, relPath)
  await fs.writeFile(absPath, opts.content)

  return {
    id: attachmentId,
    filename: safeName,
    contentType: opts.contentType || 'application/octet-stream',
    size: opts.content.length,
    path: relPath,
  }
}

export function resolveAttachmentPath(relPath: string): { root: string; absPath: string } {
  const root = getAttachmentsRoot()
  const absPath = path.join(root, relPath)
  // basic traversal protection
  const normalizedRoot = path.resolve(root)
  const normalizedAbs = path.resolve(absPath)
  if (!normalizedAbs.startsWith(normalizedRoot + path.sep) && normalizedAbs !== normalizedRoot) {
    throw new Error('Invalid attachment path')
  }
  return { root, absPath }
}

