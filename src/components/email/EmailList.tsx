'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Star, Trash2, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { fetchJson } from '@/lib/api-client'

interface Email {
  id: string
  from: string
  subject: string
  date: string
  isRead: boolean
  isStarred: boolean
  text?: string | null
  thread?: {
    id: string
    emails: Email[]
  } | null
}

interface EmailListProps {
  threads: Array<{
    id: string
    subject: string
    updatedAt: string
    emails: Email[]
  }>
  folderSlug: string
  currentEmail?: string
  selectedMailbox?: string
  onEmailDeleted?: (emailId: string) => void
  onEmailOpened?: (emailId: string) => void
  onMarkedUnread?: (ids: string[]) => void
  onMarkedRead?: (ids: string[]) => void
  selectedIds?: Set<string>
  onToggleSelected?: (emailId: string) => void
  onSelectAll?: (ids: string[]) => void
  onClearSelection?: () => void
  hasMore?: boolean
  loadingMore?: boolean
  onLoadMore?: () => void
}

type BulkAction = 'markUnread' | 'markRead' | 'restore'

type BulkResponse = {
  success?: boolean
  error?: string
  updatedIds?: string[]
  failedIds?: string[]
  restoredIds?: string[]
  skippedIds?: string[]
}

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const

export default function EmailList({
  threads,
  folderSlug,
  currentEmail,
  selectedMailbox,
  onEmailDeleted,
  onEmailOpened,
  onMarkedUnread,
  onMarkedRead,
  selectedIds,
  onToggleSelected,
  onSelectAll,
  onClearSelection,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
}: EmailListProps) {
  const router = useRouter()
  const [starredEmails, setStarredEmails] = useState<Set<string>>(new Set())
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const selected = selectedIds ?? new Set<string>()
  const isTrash = String(folderSlug || '').toLowerCase() === 'trash'

  const viewParam = selectedMailbox ? `?mb=${encodeURIComponent(selectedMailbox)}` : ''

  const userHeader = currentEmail ? { 'x-user-email': currentEmail } : undefined
  const jsonHeaders = userHeader ? { ...userHeader, ...JSON_HEADERS } : JSON_HEADERS

  const buildApiQuery = (extra?: Record<string, string>) => {
    const qs = new URLSearchParams()
    if (selectedMailbox) qs.set('viewEmail', selectedMailbox)
    if (extra) {
      for (const [key, value] of Object.entries(extra)) {
        if (value) qs.set(key, value)
      }
    }
    const query = qs.toString()
    return query ? `?${query}` : ''
  }

  const apiViewQuery = buildApiQuery()

  const visibleEmailIds = useMemo(() => {
    return threads
      .map((t) => t.emails[t.emails.length - 1]?.id)
      .filter(Boolean) as string[]
  }, [threads])

  const runBulkAction = async (action: BulkAction) => {
    if (selected.size === 0) return
    const ids = Array.from(selected)
    try {
      const data = await fetchJson<BulkResponse>(`/api/emails/bulk${buildApiQuery()}`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ action, ids }),
      })

      if (action === 'markUnread') {
        const updatedIds = Array.isArray(data?.updatedIds) ? data.updatedIds : ids
        onMarkedUnread?.(updatedIds)
        onClearSelection?.()
        if (Array.isArray(data?.failedIds) && data.failedIds.length > 0) {
          alert(`Не удалось отметить как непрочитанное ${data.failedIds.length} писем`)
        }
        return
      }

      if (action === 'markRead') {
        const updatedIds = Array.isArray(data?.updatedIds) ? data.updatedIds : ids
        onMarkedRead?.(updatedIds)
        onClearSelection?.()
        if (Array.isArray(data?.failedIds) && data.failedIds.length > 0) {
          alert(`Не удалось отметить как прочитанные ${data.failedIds.length} писем`)
        }
        return
      }

      const restoredIds = Array.isArray(data?.restoredIds) ? data.restoredIds : []
      for (const id of restoredIds) {
        onEmailDeleted?.(id)
      }
      onClearSelection?.()
      if (Array.isArray(data?.failedIds) && data.failedIds.length > 0) {
        alert(`Не удалось восстановить ${data.failedIds.length} писем`)
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Не удалось выполнить действие'
      alert(message)
      console.error('bulk email action error', e)
    }
  }

  const markSelectedUnread = () => runBulkAction('markUnread')

  const markSelectedRead = () => runBulkAction('markRead')

  const restoreSelected = () => runBulkAction('restore')

  const handleStar = async (emailId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await fetchJson(`/api/emails/${emailId}/star${apiViewQuery}`, {
        method: 'POST',
        headers: userHeader,
      })
      setStarredEmails((prev) => {
        const next = new Set(prev)
        if (next.has(emailId)) {
          next.delete(emailId)
        } else {
          next.add(emailId)
        }
        return next
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось изменить флаг'
      alert(message)
      console.error('Error toggling star:', error)
    }
  }

  const handleDelete = async (emailId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Удалить это письмо?')) return

    try {
      const suffix = buildApiQuery(isTrash ? { permanent: '1' } : undefined)
      await fetchJson(`/api/emails/${emailId}/delete${suffix}`, {
        method: 'POST',
        headers: userHeader,
      })
      onEmailDeleted?.(emailId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось удалить письмо'
      alert(message)
      console.error('Error deleting email:', error)
    }
  }

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    if (!hasMore) return
    if (!onLoadMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first?.isIntersecting) {
          onLoadMore()
        }
      },
      { root: null, rootMargin: '600px', threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, onLoadMore, loadingMore, threads.length])

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Mail className="w-12 h-12 mb-4 opacity-50" />
        <p>Нет писем в этой папке</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {selected.size > 0 ? (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-700">Выбрано: {selected.size}</div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onSelectAll?.(visibleEmailIds)
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-white"
            >
              Выбрать все
            </button>
            {isTrash ? (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  restoreSelected()
                }}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-white"
              >
                Восстановить
              </button>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    markSelectedRead()
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-white"
                >
                  Отметить как прочитанное
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    markSelectedUnread()
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-white"
                >
                  Отметить как непрочитанное
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClearSelection?.()
              }}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-white"
            >
              Снять все
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end px-4 py-2 border-b border-gray-200 bg-white">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onSelectAll?.(visibleEmailIds)
            }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Выбрать все
          </button>
        </div>
      )}

      {threads.map((thread) => {
        const latestEmail = thread.emails[thread.emails.length - 1]
        const isStarred = starredEmails.has(latestEmail.id) || latestEmail.isStarred

        // Open newest email in thread (gmail-like)
        const openEmailId = latestEmail.id
        const href = `/email/${folderSlug}/${openEmailId}${viewParam}`

        return (
          <div
            key={thread.id}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="p-4 flex items-start space-x-4">
              <div className="flex-shrink-0 pt-0.5">
                <input
                  type="checkbox"
                  checked={selected.has(openEmailId)}
                  onPointerDown={(e) => {
                    // Stop parent click handlers early (prevents any row click)
                    e.stopPropagation()
                  }}
                  onChange={() => {
                    onToggleSelected?.(openEmailId)
                  }}
                  className="h-4 w-4"
                  aria-label="Выбрать письмо"
                />
              </div>

              <div className="flex-shrink-0">
                {!latestEmail.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
              </div>

              {/* Clickable content area (separate from checkbox/actions) */}
              <button
                type="button"
                onClick={() => {
                  onEmailOpened?.(openEmailId)
                  router.push(href)
                }}
                className="flex-1 min-w-0 text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{latestEmail.from}</p>
                  <span className="text-xs text-gray-500 ml-2">
                    {format(new Date(thread.updatedAt), 'd MMM', { locale: ru })}
                  </span>
                </div>

                <p
                  className={`text-sm truncate ${
                    !latestEmail.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {thread.subject || '(без темы)'}
                </p>

                {latestEmail.text && (
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {latestEmail.text.substring(0, 100)}
                    {latestEmail.text.length > 100 && '...'}
                  </p>
                )}

                {thread.emails.length > 1 && (
                  <p className="text-xs text-gray-400 mt-1">{thread.emails.length} писем в цепочке</p>
                )}
              </button>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleStar(latestEmail.id, e)}
                  className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                    isStarred ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDelete(latestEmail.id, e)}
                  className="p-1 rounded hover:bg-gray-200 text-gray-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )
      })}

      <div ref={sentinelRef} className="h-12 flex items-center justify-center border-t border-gray-200">
        {loadingMore ? (
          <span className="text-sm text-gray-500">Загрузка...</span>
        ) : hasMore ? (
          <span className="text-sm text-gray-400">Прокрутите вниз, чтобы загрузить ещё</span>
        ) : (
          <span className="text-sm text-gray-400">Писем больше нет</span>
        )}
      </div>
    </div>
  )
}
