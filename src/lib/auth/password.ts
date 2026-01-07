import 'server-only'

import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(_scrypt)

// Format: scrypt$N$r$p$saltB64$hashB64
const N = 16384
const r = 8
const p = 1
const keylen = 64

function b64(buf: Buffer) {
  return buf.toString('base64url')
}

function fromB64(s: string) {
  return Buffer.from(s, 'base64url')
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const derivedKey = (await scryptAsync(password, salt, keylen, { N, r, p })) as Buffer
  return `scrypt$${N}$${r}$${p}$${b64(salt)}$${b64(derivedKey)}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const parts = stored.split('$')
    if (parts.length !== 6) return false
    if (parts[0] !== 'scrypt') return false
    const n = Number(parts[1])
    const rr = Number(parts[2])
    const pp = Number(parts[3])
    const salt = fromB64(parts[4])
    const expected = fromB64(parts[5])
    const derived = (await scryptAsync(password, salt, expected.length, { N: n, r: rr, p: pp })) as Buffer
    return timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}


