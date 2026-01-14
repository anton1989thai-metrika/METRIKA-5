import { NextRequest, NextResponse } from 'next/server'
import { AccountType, Prisma, UserRole } from '@prisma/client'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth/session'
import { hashPassword } from '@/lib/auth/password'
import { mailboxctl } from '@/lib/mailboxctl'
import { setMailPasswordByEmail } from '@/lib/mail-password'
import { UiRole, prismaRoleToUiRole, toUiRole } from '@/lib/permissions-core'

type UiStatus = 'active' | 'inactive' | 'pending'

type IncomingUser = Partial<{
  id: string
  email: string
  login: string
  name: string
  role: string
  password: string
  status: string
  detailedPermissions: unknown
  dateOfBirth: string
  phoneWork: string
  phonePersonal: string
  address: string
  comments: string
}>

function uiRoleToPrisma(role: UiRole): UserRole {
  if (role === 'site-user') return UserRole.site_user
  if (role === 'foreign-employee') return UserRole.foreign_employee
  if (role === 'client') return UserRole.client
  if (role === 'freelancer') return UserRole.freelancer
  if (role === 'employee') return UserRole.employee
  if (role === 'manager') return UserRole.manager
  return UserRole.admin
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

function normalizeEmail(email?: string | null) {
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
      where: { accountType: AccountType.human },
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
      },
    })

    // Shape compatible with old UI (UserManagementPanel)
    const payload = users.map((u) => {
      const role = prismaRoleToUiRole(String(u.role))
      return {
        id: u.id,
        name: u.name || u.email.split('@')[0],
        email: u.email,
        login: u.login || u.email,
        role,
        status: (u.status || 'active') as UiStatus,
        permissions: defaultPermissions(role),
        detailedPermissions: u.detailedPermissions || null,
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

    const body = await request.json().catch(() => null)
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { message: 'Invalid data format. Expected an array of users.' },
        { status: 400 }
      )
    }
    const newUsers = body as IncomingUser[]

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
        detailedPermissions: u.detailedPermissions ?? undefined,
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
        } catch (e) {
          // If mailbox doesn't exist yet, try create (sets password)
          try {
            await mailboxctl('create', [u.email, u.password], secret)
          } catch (e2) {
            const err1 = e as { message?: string }
            const err2 = e2 as { message?: string }
            const msg = err2.message || err1.message || 'Failed to update mailbox password'
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
          const data: Prisma.UserUpdateInput = {
            role: uiRoleToPrisma(u.role),
            status: u.status || 'active',
            dateOfBirth: u.dateOfBirth,
            phoneWork: u.phoneWork,
            phonePersonal: u.phonePersonal,
            address: u.address,
            comments: u.comments,
            accountType: AccountType.human,
          }
          if (u.detailedPermissions !== undefined) {
            data.detailedPermissions = u.detailedPermissions as Prisma.InputJsonValue
          }
          if (u.name !== null) data.name = u.name
          if (u.login) data.login = u.login
          if (u.email && u.email !== existing.email) data.email = u.email
          // Update password only when provided (non-empty)
          if (u.password && u.password.length >= 6 && u.password !== '********') {
            data.passwordHash = preHashedByEmail.get(u.email) || (await hashPassword(u.password))
          }
          await tx.user.update({ where: { id: existing.id }, data })
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
              detailedPermissions: (u.detailedPermissions ?? undefined) as Prisma.InputJsonValue | undefined,
              dateOfBirth: u.dateOfBirth,
              phoneWork: u.phoneWork,
              phonePersonal: u.phonePersonal,
              address: u.address,
              comments: u.comments,
              accountType: AccountType.human,
            },
          })
        }
      }

      // delete users not present (except current session user)
      const dbUsers = await tx.user.findMany({
        where: { accountType: AccountType.human },
        select: { id: true, email: true, role: true },
      })
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
        .filter((u) => u.role === UserRole.admin).length
      if (remainingAdmins === 0) {
        throw new Error('No admin would remain')
      }

      if (toDelete.length > 0) {
        await tx.user.deleteMany({ where: { id: { in: toDelete.map((u) => u.id) } } })
      }
    })

    // Store mailbox password (encrypted) for human users that have mailbox sync enabled.
    // Do this after the DB transaction to avoid upsert/create conflicts.
    for (const u of desired) {
      const isPasswordChange = u.password && u.password.length >= 6 && u.password !== '********'
      if (!isPasswordChange) continue
      if (!shouldSyncMailboxPassword(u.email)) continue
      await setMailPasswordByEmail(u.email, u.password, AccountType.human).catch(() => null)
    }

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
