'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Edit, Trash2 } from 'lucide-react'
import { fetchJson } from '@/lib/api-client'

type MailboxItem = {
  email: string
  hasPassword?: boolean
}

type ServerOnlyItem = {
  mailboxEmail: string
  folderName: string
  messageId: string
  uid?: number | null
  subject?: string | null
  date?: string | null
}

type DbOnlyItem = {
  mailboxEmail: string
  folderName: string
  messageId: string
  emailId: string
  subject?: string | null
  date?: string | null
}

type StateMismatchItem = {
  key: string
  mailboxEmail: string
  messageId: string
  uid?: number | null
  subject?: string | null
  date?: string | null
  serverFolderName: string
  dbFolderName: string
  serverIsRead: boolean
  serverIsStarred: boolean
  serverIsDeleted: boolean
  dbIsRead: boolean
  dbIsStarred: boolean
  dbIsDeleted: boolean
  emailId: string
}

type BackfillSummary = {
  mailboxEmail: string
  attempted: number
  updated: number
  missing: number
  conflicts: number
  skipped: number
}

type BackfillTotals = {
  attempted: number
  updated: number
  missing: number
  conflicts: number
  skipped: number
}

type ApiBaseResponse = {
  success?: boolean
  error?: string
}

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const

const requestJson = async <T,>(input: RequestInfo | URL, init?: RequestInit) => {
  return fetchJson<T>(input, { credentials: 'include', ...init })
}

const ensureSuccess = <T extends ApiBaseResponse>(data: T, fallback: string) => {
  if (!data?.success) {
    throw new Error(data?.error || fallback)
  }
  return data
}

export default function AdminEmailMailboxes() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [createEmail, setCreateEmail] = useState('')
  const [createPassword, setCreatePassword] = useState('')

  const [mailboxes, setMailboxes] = useState<MailboxItem[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const [editEmail, setEditEmail] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditError, setAuditError] = useState('')
  const [serverOnly, setServerOnly] = useState<ServerOnlyItem[]>([])
  const [dbOnly, setDbOnly] = useState<DbOnlyItem[]>([])
  const [stateMismatch, setStateMismatch] = useState<StateMismatchItem[]>([])
  const [backfillLoading, setBackfillLoading] = useState(false)
  const [backfillError, setBackfillError] = useState('')
  const [backfillResults, setBackfillResults] = useState<BackfillSummary[]>([])
  const [backfillTotals, setBackfillTotals] = useState<BackfillTotals | null>(null)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const data = await requestJson<{ success?: boolean; mailboxes?: MailboxItem[]; error?: string }>(
        '/api/mailboxes'
      )
      ensureSuccess(data, 'Не удалось загрузить ящики')
      setMailboxes(Array.isArray(data.mailboxes) ? data.mailboxes : [])
    } catch (e) {
      const err = e as { message?: string }
      setError(err.message || 'Не удалось загрузить ящики')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const runAudit = async () => {
    setAuditError('')
    setAuditLoading(true)
    try {
      const data = await requestJson<{
        success?: boolean
        serverOnly?: ServerOnlyItem[]
        dbOnly?: DbOnlyItem[]
        stateMismatch?: StateMismatchItem[]
        error?: string
      }>('/api/admin/email-audit', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ limit: 200 }),
      })
      ensureSuccess(data, 'Не удалось сверить ящики')
      setServerOnly(Array.isArray(data.serverOnly) ? data.serverOnly : [])
      setDbOnly(Array.isArray(data.dbOnly) ? data.dbOnly : [])
      setStateMismatch(Array.isArray(data.stateMismatch) ? data.stateMismatch : [])
    } catch (e) {
      const err = e as { message?: string }
      setAuditError(err.message || 'Не удалось сверить ящики')
    } finally {
      setAuditLoading(false)
    }
  }

  const runBackfill = async () => {
    setBackfillError('')
    setBackfillLoading(true)
    try {
      const mailboxList = mailboxes.map((m) => m.email).filter(Boolean)
      if (!mailboxList.length) {
        throw new Error('Нет доступных ящиков для заполнения UID')
      }
      const data = await requestJson<{
        success?: boolean
        results?: BackfillSummary[]
        totals?: BackfillTotals
        error?: string
      }>('/api/admin/email-audit', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({
          action: 'backfill-uids',
          mailboxEmail: mailboxList[0],
          mailboxes: mailboxList,
          limit: 500,
        }),
      })
      ensureSuccess(data, 'Не удалось заполнить UID')
      setBackfillResults(Array.isArray(data.results) ? data.results : [])
      setBackfillTotals(data.totals || null)
    } catch (e) {
      const err = e as { message?: string }
      setBackfillError(err.message || 'Не удалось заполнить UID')
    } finally {
      setBackfillLoading(false)
    }
  }

  const resolveAudit = async (opts: {
    action: 'pull' | 'delete-server' | 'delete-db' | 'push-server' | 'apply-db' | 'apply-server'
    mailboxEmail: string
    folderName: string
    messageId?: string
    uid?: number | null
    emailId?: string
    serverFolderName?: string
    serverIsRead?: boolean
    serverIsStarred?: boolean
    serverIsDeleted?: boolean
  }) => {
    setAuditError('')
    try {
      const data = await requestJson<ApiBaseResponse>('/api/admin/email-audit', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(opts),
      })
      ensureSuccess(data, 'Ошибка действия')

      if (opts.action === 'pull' || opts.action === 'delete-server') {
        setServerOnly((prev) =>
          prev.filter(
            (i) =>
              (opts.uid &&
                (i.uid !== opts.uid ||
                  i.mailboxEmail !== opts.mailboxEmail ||
                  i.folderName !== opts.folderName)) ||
              (!opts.uid &&
                (i.messageId !== opts.messageId ||
                  i.mailboxEmail !== opts.mailboxEmail ||
                  i.folderName !== opts.folderName))
          )
        )
      }
      if (opts.action === 'delete-db' || opts.action === 'push-server') {
        setDbOnly((prev) => prev.filter((i) => i.emailId !== opts.emailId))
      }
      if (opts.action === 'apply-db' || opts.action === 'apply-server') {
        setStateMismatch((prev) => prev.filter((i) => i.emailId !== opts.emailId))
      }
    } catch (e) {
      const err = e as { message?: string }
      setAuditError(err.message || 'Ошибка действия')
    }
  }

  const formatFlags = (opts: { isRead?: boolean; isStarred?: boolean; isDeleted?: boolean }) => {
    const items = []
    if (opts.isRead) items.push('прочитано')
    else items.push('непрочитано')
    if (opts.isStarred) items.push('важное')
    if (opts.isDeleted) items.push('удалено')
    return items.join(', ')
  }

  const createMailbox = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await requestJson<ApiBaseResponse>('/api/mailboxes', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({
          email: createEmail.trim(),
          password: createPassword,
        }),
      })
      ensureSuccess(data, 'Не удалось создать ящик')
      setCreateEmail('')
      setCreatePassword('')
      setCreateOpen(false)
      await load()
    } catch (e) {
      const err = e as { message?: string }
      setError(err.message || 'Не удалось создать ящик')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await requestJson<ApiBaseResponse>('/api/mailboxes', {
        method: 'PATCH',
        headers: JSON_HEADERS,
        body: JSON.stringify({
          email: editEmail.trim(),
          password: editPassword,
        }),
      })
      ensureSuccess(data, 'Не удалось сменить пароль')
      setEditPassword('')
      setEditOpen(false)
      await load()
    } catch (e) {
      const err = e as { message?: string }
      setError(err.message || 'Не удалось сменить пароль')
    } finally {
      setLoading(false)
    }
  }

  const deleteMailbox = async () => {
    setError('')
    setDeleteLoading(true)
    try {
      const data = await requestJson<ApiBaseResponse>('/api/mailboxes', {
        method: 'DELETE',
        headers: JSON_HEADERS,
        body: JSON.stringify({
          email: editEmail.trim(),
        }),
      })
      ensureSuccess(data, 'Не удалось удалить ящик')
      setEditOpen(false)
      setEditPassword('')
      await load()
    } catch (e) {
      const err = e as { message?: string }
      setError(err.message || 'Не удалось удалить ящик')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-black">Почтовые ящики</h3>
          <div className="text-sm text-gray-600">
            Создавайте почтовые ящики и задавайте им пароль.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={load} disabled={loading}>
            Обновить список
          </Button>
          <Button onClick={() => setCreateOpen(true)} disabled={loading}>
          Создать ящик
          </Button>
        </div>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <h4 className="font-medium text-black mb-3">Список почтовых ящиков</h4>
        {mailboxes.length === 0 ? (
          <div className="text-sm text-gray-600">Почтовых ящиков нет.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {mailboxes.map((m) => (
              <div key={m.email} className="flex items-center justify-between py-3">
                <div className="font-mono text-sm text-black">{m.email}</div>
                <button
                  className="p-1 text-gray-600 hover:text-black"
                  onClick={() => {
                    setEditEmail(m.email)
                    setEditPassword('')
                    setEditOpen(true)
                  }}
                  title="Изменить"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-black">Синхронизация с почтовым сервером</h4>
            <div className="text-sm text-gray-600">Проверка расхождений между сервером и сайтом</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={runBackfill}
              disabled={backfillLoading || !mailboxes.length}
            >
              {backfillLoading ? 'Заполняем UID...' : 'Заполнить UID'}
            </Button>
            <Button variant="outline" onClick={runAudit} disabled={auditLoading}>
              {auditLoading ? 'Проверяем...' : 'Сверить'}
            </Button>
          </div>
        </div>

        {auditError ? <div className="text-sm text-red-600">{auditError}</div> : null}
        {backfillError ? <div className="text-sm text-red-600">{backfillError}</div> : null}
        {backfillTotals ? (
          <div className="text-xs text-gray-600">
            UID: обновлено {backfillTotals.updated} из {backfillTotals.attempted}, не найдено{' '}
            {backfillTotals.missing}, конфликтов {backfillTotals.conflicts}, пропущено{' '}
            {backfillTotals.skipped}.
          </div>
        ) : null}
        {backfillResults.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {backfillResults.map((item) => (
              <div key={item.mailboxEmail} className="text-xs text-gray-600">
                {item.mailboxEmail}: обновлено {item.updated} из {item.attempted}, не найдено{' '}
                {item.missing}, конфликтов {item.conflicts}, пропущено {item.skipped}.
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-semibold text-black mb-2">На сервере есть, на сайте нет</h5>
            {serverOnly.length === 0 ? (
              <div className="text-sm text-gray-600">Расхождений нет</div>
            ) : (
              <div className="space-y-2">
                {serverOnly.map((item) => (
                  <div key={`${item.mailboxEmail}:${item.folderName}:${item.messageId}:${item.uid || ''}`} className="border rounded p-3">
                    <div className="text-xs text-gray-500 mb-1">{item.mailboxEmail} · {item.folderName}</div>
                    <div className="text-sm text-black">{item.subject || item.messageId}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => resolveAudit({
                          action: 'pull',
                          mailboxEmail: item.mailboxEmail,
                          folderName: item.folderName,
                          messageId: item.messageId,
                          uid: item.uid ?? null,
                        })}
                      >
                        Добавить на сайт
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => resolveAudit({
                          action: 'delete-server',
                          mailboxEmail: item.mailboxEmail,
                          folderName: item.folderName,
                          messageId: item.messageId,
                          uid: item.uid ?? null,
                        })}
                      >
                        Удалить на сервере
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h5 className="text-sm font-semibold text-black mb-2">На сайте есть, на сервере нет</h5>
            {dbOnly.length === 0 ? (
              <div className="text-sm text-gray-600">Расхождений нет</div>
            ) : (
              <div className="space-y-2">
                {dbOnly.map((item) => (
                  <div key={item.emailId} className="border rounded p-3">
                    <div className="text-xs text-gray-500 mb-1">{item.mailboxEmail} · {item.folderName}</div>
                    <div className="text-sm text-black">{item.subject || item.messageId}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => resolveAudit({
                          action: 'push-server',
                          mailboxEmail: item.mailboxEmail,
                          folderName: item.folderName,
                          emailId: item.emailId,
                        })}
                      >
                        Добавить на сервер
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => resolveAudit({
                          action: 'delete-db',
                          mailboxEmail: item.mailboxEmail,
                          folderName: item.folderName,
                          emailId: item.emailId,
                        })}
                      >
                        Удалить на сайте
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-black mb-2">Флаги или папки не совпадают</h5>
          {stateMismatch.length === 0 ? (
            <div className="text-sm text-gray-600">Расхождений нет</div>
          ) : (
            <div className="space-y-2">
              {stateMismatch.map((item) => (
                <div key={item.key || item.emailId} className="border rounded p-3">
                  <div className="text-xs text-gray-500 mb-1">{item.mailboxEmail}</div>
                  <div className="text-sm text-black">{item.subject || item.messageId}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Сервер: {item.serverFolderName} · {formatFlags({
                      isRead: item.serverIsRead,
                      isStarred: item.serverIsStarred,
                      isDeleted: item.serverIsDeleted,
                    })}
                  </div>
                  <div className="text-xs text-gray-600">
                    Сайт: {item.dbFolderName} · {formatFlags({
                      isRead: item.dbIsRead,
                      isStarred: item.dbIsStarred,
                      isDeleted: item.dbIsDeleted,
                    })}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => resolveAudit({
                        action: 'apply-db',
                        mailboxEmail: item.mailboxEmail,
                        folderName: item.serverFolderName,
                        serverFolderName: item.serverFolderName,
                        messageId: item.messageId,
                        uid: item.uid ?? null,
                        emailId: item.emailId,
                        serverIsRead: item.serverIsRead,
                        serverIsStarred: item.serverIsStarred,
                        serverIsDeleted: item.serverIsDeleted,
                      })}
                    >
                      Принять сервер
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => resolveAudit({
                        action: 'apply-server',
                        mailboxEmail: item.mailboxEmail,
                        folderName: item.serverFolderName,
                        serverFolderName: item.serverFolderName,
                        messageId: item.messageId,
                        uid: item.uid ?? null,
                        emailId: item.emailId,
                      })}
                    >
                      Принять сайт
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Создать ящик</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                placeholder="info@metrika.direct"
                autoComplete="off"
              />
            </div>
            <div className="grid gap-2">
              <Label>Пароль</Label>
              <Input
                type="text"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                placeholder="Пароль"
                autoComplete="off"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={loading}>
              Отменить
            </Button>
            <Button onClick={createMailbox} disabled={loading || !createEmail.trim() || !createPassword}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Ящик: {editEmail}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label>Новый пароль</Label>
              <Input
                type="text"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Новый пароль"
                autoComplete="off"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={loading || deleteLoading}
            >
              Закрыть
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={deleteMailbox}
                disabled={deleteLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Удалить
              </Button>
              <Button
                onClick={changePassword}
                disabled={loading || !editPassword.trim()}
              >
                Сменить пароль
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
