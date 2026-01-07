import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  const startedAt = Date.now()
  try {
    // Minimal DB check (sqlite)
    await db.$queryRaw`SELECT 1`
    const ms = Date.now() - startedAt
    return NextResponse.json({ ok: true, db: 'ok', ms })
  } catch (e: any) {
    const ms = Date.now() - startedAt
    return NextResponse.json({ ok: false, db: 'error', ms, error: e?.message || 'db error' }, { status: 500 })
  }
}


