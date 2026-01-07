'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type ApiResponse =
  | { success: true; mailboxes: string[] }
  | { success: false; error: string }

async function apiFetch<T>(
  url: string,
  opts: RequestInit & { secret: string },
): Promise<T> {
  const { secret, ...init } = opts
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init.headers || {}),
      'x-admin-secret': secret,
    },
  })
  return (await res.json()) as T
}

export default function AdminMailboxesPage() {
  const [secret, setSecret] = useState('')
  const [mailboxes, setMailboxes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [createEmail, setCreateEmail] = useState('')
  const [createPassword, setCreatePassword] = useState('')

  const [passwdEmail, setPasswdEmail] = useState('')
  const [passwdPassword, setPasswdPassword] = useState('')

  const canCall = useMemo(() => Boolean(secret.trim()), [secret])

  useEffect(() => {
    const saved = localStorage.getItem('MAIL_ADMIN_SECRET') || ''
    if (saved) setSecret(saved)
  }, [])

  const saveSecret = () => {
    localStorage.setItem('MAIL_ADMIN_SECRET', secret.trim())
  }

  const loadList = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await apiFetch<ApiResponse>('/api/admin/mailboxes', {
        method: 'GET',
        secret: secret.trim(),
      })
      if (!data.success) throw new Error(data.error)
      setMailboxes(data.mailboxes)
    } catch (e: any) {
      setError(e?.message || 'Ошибка загрузки списка ящиков')
    } finally {
      setLoading(false)
    }
  }

  const createMailbox = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await apiFetch<{ success: boolean; error?: string }>(
        '/api/admin/mailboxes',
        {
          method: 'POST',
          secret: secret.trim(),
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: createEmail.trim(),
            password: createPassword,
          }),
        },
      )
      if (!res.success) throw new Error(res.error || 'Ошибка создания ящика')
      setCreateEmail('')
      setCreatePassword('')
      await loadList()
    } catch (e: any) {
      setError(e?.message || 'Ошибка создания ящика')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await apiFetch<{ success: boolean; error?: string }>(
        '/api/admin/mailboxes',
        {
          method: 'PATCH',
          secret: secret.trim(),
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: passwdEmail.trim(),
            password: passwdPassword,
          }),
        },
      )
      if (!res.success) throw new Error(res.error || 'Ошибка смены пароля')
      setPasswdEmail('')
      setPasswdPassword('')
      await loadList()
    } catch (e: any) {
      setError(e?.message || 'Ошибка смены пароля')
    } finally {
      setLoading(false)
    }
  }

  const deleteMailbox = async (email: string) => {
    setError('')
    setLoading(true)
    try {
      const res = await apiFetch<{ success: boolean; error?: string }>(
        `/api/admin/mailboxes?email=${encodeURIComponent(email)}`,
        {
          method: 'DELETE',
          secret: secret.trim(),
        },
      )
      if (!res.success) throw new Error(res.error || 'Ошибка удаления')
      await loadList()
    } catch (e: any) {
      setError(e?.message || 'Ошибка удаления')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Почтовые ящики (сервер)</h1>
        <p className="text-sm text-muted-foreground">
          Управление ящиками напрямую на VPS (Postfix/Dovecot). Нужен админ‑секрет.
        </p>
      </div>

      <div className="space-y-3 border rounded-lg p-4">
        <div className="grid gap-2">
          <Label>MAIL_ADMIN_SECRET</Label>
          <Input
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="вставьте секрет"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={saveSecret} disabled={!canCall || loading}>
            Сохранить
          </Button>
          <Button variant="secondary" onClick={loadList} disabled={!canCall || loading}>
            Обновить список
          </Button>
        </div>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="space-y-3 border rounded-lg p-4">
        <h2 className="font-medium">Создать ящик</h2>
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input
            value={createEmail}
            onChange={e => setCreateEmail(e.target.value)}
            placeholder="user@metrika.direct"
          />
          <Label>Пароль</Label>
          <Input
            type="password"
            value={createPassword}
            onChange={e => setCreatePassword(e.target.value)}
            placeholder="пароль"
          />
        </div>
        <Button onClick={createMailbox} disabled={!canCall || loading}>
          Создать
        </Button>
      </div>

      <div className="space-y-3 border rounded-lg p-4">
        <h2 className="font-medium">Сменить пароль</h2>
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input
            value={passwdEmail}
            onChange={e => setPasswdEmail(e.target.value)}
            placeholder="user@metrika.direct"
          />
          <Label>Новый пароль</Label>
          <Input
            type="password"
            value={passwdPassword}
            onChange={e => setPasswdPassword(e.target.value)}
            placeholder="новый пароль"
          />
        </div>
        <Button onClick={changePassword} disabled={!canCall || loading}>
          Сменить
        </Button>
      </div>

      <div className="space-y-3 border rounded-lg p-4">
        <h2 className="font-medium">Список ящиков</h2>
        <div className="space-y-2">
          {mailboxes.length === 0 ? (
            <div className="text-sm text-muted-foreground">Нет ящиков (или список не загружен)</div>
          ) : (
            mailboxes.map(mb => (
              <div key={mb} className="flex items-center justify-between gap-3 border rounded p-2">
                <div className="font-mono text-sm">{mb}</div>
                <Button
                  variant="destructive"
                  onClick={() => deleteMailbox(mb)}
                  disabled={!canCall || loading || mb === 'info@metrika.direct'}
                  title={mb === 'info@metrika.direct' ? 'Не удаляем основной ящик' : undefined}
                >
                  Удалить
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


