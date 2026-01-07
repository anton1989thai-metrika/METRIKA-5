import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth/session'
import { hashPassword } from '@/lib/auth/password'
import { mailboxctl } from '@/lib/mailboxctl'

type UiRole =
  | 'site-user'
  | 'client'
  | 'foreign-employee'
  | 'freelancer'
  | 'employee'
  | 'manager'
  | 'admin'

type UiStatus = 'active' | 'inactive' | 'pending'

function prismaRoleToUi(role: string): UiRole {
  if (role === 'site_user') return 'site-user'
  if (role === 'foreign_employee') return 'foreign-employee'
  return toUiRole(role)
}

function uiRoleToPrisma(role: UiRole): any {
  if (role === 'site-user') return 'site_user'
  if (role === 'foreign-employee') return 'foreign_employee'
  return role
}

function toUiRole(role: string): UiRole {
  if (
    role === 'admin' ||
    role === 'manager' ||
    role === 'employee' ||
    role === 'site-user' ||
    role === 'client' ||
    role === 'foreign-employee' ||
    role === 'freelancer'
  )
    return role
  return 'site-user'
}

function toDbRole(role: string): UiRole {
  return toUiRole(role)
}

function defaultPermissions(role: UiRole) {
  const isAdmin = role === 'admin'
  const isManager = role === 'manager'
  const canManageContent = isAdmin || isManager
  return {
    canManageObjects: isAdmin || isManager,
    canManageUsers: isAdmin,
    canViewAnalytics: isAdmin || isManager,
    canManageTasks: isAdmin || isManager,
    canManageMedia: canManageContent,
    canManageContent: canManageContent,
    canManageSettings: isAdmin,
  }
}

function normalizeEmail(email: string) {
  return String(email || '').trim().toLowerCase()
}

function shouldSyncMailboxPassword(email: string) {
  return email.endsWith('@metrika.direct') && Boolean(process.env.MAIL_ADMIN_SECRET)
}

export async function GET() {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        login: true,
        name: true,
        role: true,
        status: true,
        lastLogin: true,
        passwordHash: true,
        detailedPermissions: true,
        dateOfBirth: true,
        phoneWork: true,
        phonePersonal: true,
        address: true,
        comments: true,
        createdAt: true,
      } as any,
    })

    // Shape compatible with old UI (UserManagementPanel)
    const payload = users.map((u) => {
      const role = prismaRoleToUi(String(u.role))
      return {
        id: u.id,
        name: u.name || u.email.split('@')[0],
        email: u.email,
        login: u.login || u.email,
        role,
        status: ((u.status as any) || 'active') as UiStatus,
        permissions: defaultPermissions(role),
        detailedPermissions: (u as any).detailedPermissions || null,
        lastLogin: u.lastLogin ? u.lastLogin.toISOString() : null,
        createdAt: u.createdAt.toISOString(),
        needsPassword: !u.passwordHash,
        dateOfBirth: u.dateOfBirth || '',
        phoneWork: u.phoneWork || '',
        phonePersonal: u.phonePersonal || '',
        address: u.address || '',
        userObjects: [],
        comments: u.comments || '',
      }
    })

    return NextResponse.json(payload, { status: 200 })
  } catch (error) {
    console.error('API Error fetching users:', error)
    return NextResponse.json(
      {
        message: 'Failed to fetch users.',
        error: (error as Error).message,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const newUsers: any[] = await request.json()
    if (!Array.isArray(newUsers)) {
      return NextResponse.json(
        { message: 'Invalid data format. Expected an array of users.' },
        { status: 400 }
      )
    }

    // Ensure we keep at least one admin and don't delete current admin
    const desired = newUsers
      .map((u) => ({
        id: String(u?.id || '').trim(),
        email: normalizeEmail(u?.email),
        login: String(u?.login || '').trim().toLowerCase() || null,
        name: String(u?.name || '').trim() || null,
        role: toDbRole(String(u?.role || 'employee')) as UiRole,
        password: String(u?.password || ''),
        status: (String(u?.status || 'active') || 'active') as UiStatus,
        detailedPermissions: (u as any)?.detailedPermissions ?? undefined,
        dateOfBirth: String(u?.dateOfBirth || '').trim() || null,
        phoneWork: String(u?.phoneWork || '').trim() || null,
        phonePersonal: String(u?.phonePersonal || '').trim() || null,
        address: String(u?.address || '').trim() || null,
        comments: String(u?.comments || '').trim() || null,
      }))
      .filter((u) => Boolean(u.email))

    const adminCount = desired.filter((u) => u.role === 'admin').length
    if (adminCount === 0) {
      return NextResponse.json({ message: 'Должен остаться хотя бы один администратор' }, { status: 400 })
    }

    const desiredEmails = new Set(desired.map((u) => u.email))
    const desiredIds = new Set(desired.map((u) => u.id).filter(Boolean))

    // Validate passwords explicitly: if provided, must be >= 6 chars.
    for (const u of desired) {
      const raw = String(u.password || '')
      if (raw && raw !== '********' && raw.length < 6) {
        return NextResponse.json(
          { message: `Пароль для ${u.email} должен быть минимум 6 символов` },
          { status: 400 }
        )
      }
    }

    // Preflight: if password changes are requested, update mailboxes first (to keep site+mail in sync)
    // and pre-hash passwords so DB transaction doesn't do heavy work.
    const preHashedByEmail = new Map<string, string>()
    for (const u of desired) {
      const isPasswordChange = u.password && u.password.length >= 6 && u.password !== '********'
      if (!isPasswordChange) continue

      if (shouldSyncMailboxPassword(u.email)) {
        const secret = process.env.MAIL_ADMIN_SECRET || null
        try {
          await mailboxctl('passwd', [u.email, u.password], secret)
        } catch (e: any) {
          // If mailbox doesn't exist yet, try create (sets password)
          try {
            await mailboxctl('create', [u.email, u.password], secret)
          } catch (e2: any) {
            const msg = e2?.message || e?.message || 'Failed to update mailbox password'
            return NextResponse.json(
              { message: `Не удалось обновить пароль почты для ${u.email}. ${msg}` },
              { status: 500 }
            )
          }
        }
      }

      preHashedByEmail.set(u.email, await hashPassword(u.password))
    }

    await db.$transaction(async (tx) => {
      // upsert desired users by id/email
      for (const u of desired) {
        const existing =
          (u.id ? await tx.user.findUnique({ where: { id: u.id } }).catch(() => null) : null) ||
          (await tx.user.findUnique({ where: { email: u.email } }).catch(() => null))
        if (existing) {
          const data: any = {
            role: uiRoleToPrisma(u.role),
            status: u.status || 'active',
            dateOfBirth: u.dateOfBirth,
            phoneWork: u.phoneWork,
            phonePersonal: u.phonePersonal,
            address: u.address,
            comments: u.comments,
          }
          if (u.detailedPermissions !== undefined) data.detailedPermissions = u.detailedPermissions
          if (u.name !== null) data.name = u.name
          if (u.login) data.login = u.login
          if (u.email && u.email !== existing.email) data.email = u.email
          // Update password only when provided (non-empty)
          if (u.password && u.password.length >= 6 && u.password !== '********') {
            data.passwordHash = preHashedByEmail.get(u.email) || (await hashPassword(u.password))
          }
          await tx.user.update({ where: { id: existing.id }, data: data as any })
        } else {
          if (!u.password || u.password.length < 6) {
            // Skip creation if no usable password was provided
            continue
          }
          await tx.user.create({
            data: {
              email: u.email,
              login: u.login || u.email,
              name: u.name,
              role: uiRoleToPrisma(u.role),
              passwordHash: preHashedByEmail.get(u.email) || (await hashPassword(u.password)),
              status: u.status || 'active',
              detailedPermissions: u.detailedPermissions ?? null,
              dateOfBirth: u.dateOfBirth,
              phoneWork: u.phoneWork,
              phonePersonal: u.phonePersonal,
              address: u.address,
              comments: u.comments,
            } as any,
          })
        }
      }

      // delete users not present (except current session user)
      const dbUsers = await tx.user.findMany({ select: { id: true, email: true, role: true } })
      const toDelete = dbUsers.filter((u) => {
        if (u.email === sessionUser.email) return false
        if (desiredIds.size > 0) return !desiredIds.has(u.id)
        return !desiredEmails.has(u.email)
      })

      // prevent deleting the last admin in DB
      const remainingAdmins = dbUsers
        .filter((u) => {
          if (u.email === sessionUser.email) return true
          if (desiredIds.size > 0) return desiredIds.has(u.id)
          return desiredEmails.has(u.email)
        })
        .filter((u) => u.role === 'admin').length
      if (remainingAdmins === 0) {
        throw new Error('No admin would remain')
      }

      if (toDelete.length > 0) {
        await tx.user.deleteMany({ where: { id: { in: toDelete.map((u) => u.id) } } })
      }
    })

    return NextResponse.json({ message: 'Users updated successfully.' }, { status: 200 })
  } catch (error) {
    console.error('API Error updating users:', error)
    return NextResponse.json(
      {
        message: 'Failed to update users.',
        error: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
