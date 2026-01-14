import 'server-only'

import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { AccountType, UserRole } from '@prisma/client'
import { db } from '@/lib/db'

function getKey() {
  // Reuse existing secret on VPS; do not expose to client.
  const raw = process.env.MAIL_ADMIN_SECRET || process.env.OPENAI_API_KEY || ''
  if (!raw) return null
  return createHash('sha256').update(raw).digest() // 32 bytes
}

function encrypt(plain: string) {
  const key = getKey()
  if (!key) {
    // Dev fallback (not ideal, but keeps local env usable if secret not set)
    return `plain:${plain}`
  }
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(plain, 'utf8')), cipher.final()])
  const tag = cipher.getAuthTag()
  return `v1:${iv.toString('base64')}:${tag.toString('base64')}:${ciphertext.toString('base64')}`
}

function decrypt(enc: string) {
  if (!enc) return null
  if (enc.startsWith('plain:')) return enc.slice('plain:'.length)
  if (!enc.startsWith('v1:')) return null
  const parts = enc.split(':')
  if (parts.length !== 4) return null
  const [, ivB64, tagB64, ctB64] = parts
  const key = getKey()
  if (!key) return null
  const iv = Buffer.from(ivB64, 'base64')
  const tag = Buffer.from(tagB64, 'base64')
  const ciphertext = Buffer.from(ctB64, 'base64')
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
  return plain
}

export async function setMailPasswordByEmail(
  email: string,
  password: string,
  accountType: AccountType
) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail) throw new Error('Email обязателен')
  if (!password || password.length < 6) throw new Error('Пароль должен быть минимум 6 символов')

  const mailPasswordEnc = encrypt(password)

  const existing = await db.user.findUnique({ where: { email: normalizedEmail } }).catch(() => null)
  if (existing) {
    await db.user.update({
      where: { id: existing.id },
      data: {
        mailPasswordEnc,
        accountType,
      },
    })
    return
  }

  await db.user.create({
    data: {
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      role: UserRole.site_user,
      status: 'active',
      passwordHash: '',
      accountType,
      mailPasswordEnc,
    },
  })
}

export async function getMailPasswordByEmail(email: string): Promise<string | null> {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail) return null
  const u = await db.user
    .findUnique({ where: { email: normalizedEmail }, select: { mailPasswordEnc: true } })
    .catch(() => null)
  const enc = String(u?.mailPasswordEnc || '')
  if (!enc) return null
  return decrypt(enc)
}
