'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import BurgerMenu from '@/components/BurgerMenu'
import Header from '@/components/Header'
import Sidebar from '@/components/email/Sidebar'
import EmailList from '@/components/email/EmailList'
import ComposeEmail from '@/components/email/ComposeEmail'
import { Mail, Send, Search, RefreshCw, ChevronDown, Trash2 } from 'lucide-react'
import { fetchJsonOrNull } from '@/lib/api-client'

interface Thread {
  id: string
  subject: string
  updatedAt: string
  emails: Array<{
    id: string
    from: string
    subject: string
    date: string
    isRead: boolean
    isStarred: boolean
    text?: string | null
  }>
}

interface Folder {
  id: string
  name: string
  slug: string
  _count?: {
    emails: number
  }
}

function EmailPageContent() {
  const searchParams = useSearchParams()
  const folderSlug = searchParams.get('folder') || 'inbox'
  const isTrash = String(folderSlug || '').toLowerCase() === 'trash'
  const searchQuery = searchParams.get('search') || ''

  const [threads, setThreads] = useState<Thread[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [searchInput, setSearchInput] = useState(searchQuery)
  const [syncing, setSyncing] = useState(false)
  const [currentEmail, setCurrentEmail] = useState<string>('')
  const [mailboxes, setMailboxes] = useState<string[]>([])
  const [selectedMailbox, setSelectedMailbox] = useState<string>('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Загружаем данные пользователя один раз
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Restore last selected mailbox from localStorage (admin convenience)
        let storedMailbox: string | null = null
        try {
          storedMailbox = localStorage.getItem('EMAIL_SELECTED_MAILBOX')
          if (storedMailbox) storedMailbox = storedMailbox.trim()
        } catch {}

        const userData = await fetchJsonOrNull<{ email?: string }>('/api/user')
        if (userData?.email) {
          setCurrentEmail(userData.email)
          setSelectedMailbox((prev) => prev || storedMailbox || userData.email || '')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  // Загружаем письма
  useEffect(() => {
    async function fetchFirstPage() {
      if (!selectedMailbox) return // Ждем загрузки email пользователя
      
      setLoading(true)
      setHasMore(true)
      setNextCursor(null)
      try {
        const params = new URLSearchParams()
        params.set('folder', folderSlug)
        if (searchInput) {
          params.set('search', searchInput)
        }
        params.set('limit', '30')

        // Always request selected mailbox; server will enforce access.
        params.set('viewEmail', selectedMailbox)

        // Persist selection for other /email/* pages
        try {
          localStorage.setItem('EMAIL_SELECTED_MAILBOX', selectedMailbox)
        } catch {}

        const response = await fetch(`/api/emails?${params.toString()}`, {
          headers: currentEmail ? { 'x-user-email': currentEmail } : undefined,
        })
        if (response.ok) {
          const data = await response.json()
          setThreads(data.threads || [])
          setFolders(data.folders || [])
          setHasMore(Boolean(data.hasMore))
          setNextCursor(data.nextCursor || null)
          
          if (Array.isArray(data.mailboxes)) {
            setMailboxes(data.mailboxes)
            // Ensure current selection exists
            if (!data.mailboxes.includes(selectedMailbox)) {
              setSelectedMailbox(data.mailboxes[0] || '')
            }
          }
        }
      } catch (error) {
        console.error('Error fetching emails:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFirstPage()
  }, [folderSlug, searchInput, selectedMailbox, currentEmail, refreshKey])

  // Clear selection only when switching dataset (mailbox/folder/search)
  useEffect(() => {
    setSelectedIds(new Set())
  }, [folderSlug, searchInput, selectedMailbox])

  const toggleSelected = (emailId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(emailId)) next.delete(emailId)
      else next.add(emailId)
      return next
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  const selectAll = (ids: string[]) => setSelectedIds(new Set(ids))

  const mergeThreads = (prev: Thread[], incoming: Thread[]) => {
    const byId = new Map<string, Thread>(prev.map((t) => [t.id, t]))
    for (const t of incoming) {
      const existing = byId.get(t.id)
      if (!existing) {
        byId.set(t.id, t)
        continue
      }
      const seen = new Set(existing.emails.map((e) => e.id))
      const mergedEmails = [...existing.emails]
      for (const e of t.emails) {
        if (!seen.has(e.id)) mergedEmails.push(e)
      }
      mergedEmails.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const updatedAt =
        new Date(existing.updatedAt).getTime() >= new Date(t.updatedAt).getTime()
          ? existing.updatedAt
          : t.updatedAt
      byId.set(t.id, { ...existing, subject: existing.subject || t.subject, updatedAt, emails: mergedEmails })
    }
    return Array.from(byId.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  const loadMoreThreads = async () => {
    if (!selectedMailbox) return
    if (!hasMore || loadingMore) return
    if (!nextCursor) return

    setLoadingMore(true)
    try {
      const params = new URLSearchParams()
      params.set('folder', folderSlug)
      if (searchInput) params.set('search', searchInput)
      params.set('limit', '30')
      params.set('cursor', nextCursor)
      params.set('viewEmail', selectedMailbox)

      const response = await fetch(`/api/emails?${params.toString()}`, {
        headers: currentEmail ? { 'x-user-email': currentEmail } : undefined,
      })
      if (!response.ok) return
      const data = await response.json()

      const incoming: Thread[] = data.threads || []
      setThreads((prev) => mergeThreads(prev, incoming))

      setHasMore(Boolean(data.hasMore))
      setNextCursor(data.nextCursor || null)
    } finally {
      setLoadingMore(false)
    }
  }

  // Sync once on mailbox switch (silent)
  useEffect(() => {
    if (!selectedMailbox) return

    let cancelled = false

    async function syncSelectedMailbox(opts: { silent: boolean }) {
      if (!selectedMailbox) return
      if (!opts.silent) setSyncing(true)
      try {
        const params = new URLSearchParams()
        // Для админа синхронизируем выбранный ящик; для обычного пользователя сервер сам ограничит его ящиком
        params.set('email', selectedMailbox)
        const response = await fetch(`/api/emails/sync?${params.toString()}`, {
          method: 'POST',
          headers: currentEmail ? { 'x-user-email': currentEmail } : undefined,
        })
        if (!response.ok) return
        // После синка — тихо обновляем список без loading/дерганья
        if (cancelled) return
        const q = new URLSearchParams()
        q.set('folder', folderSlug)
        if (searchInput) q.set('search', searchInput)
        q.set('limit', '30')
        q.set('viewEmail', selectedMailbox)
        const fetchResp = await fetch(`/api/emails?${q.toString()}`, {
          headers: currentEmail ? { 'x-user-email': currentEmail } : undefined,
        })
        if (!fetchResp.ok) return
        const data = await fetchResp.json()
        if (cancelled) return
        setThreads((prev) => mergeThreads(prev, data.threads || []))
        if (data.folders) setFolders(data.folders || [])
      } catch {
        // silent
      } finally {
        if (!cancelled) {
          if (!opts.silent) setSyncing(false)
        }
      }
    }

    // Immediate sync on mailbox switch
    syncSelectedMailbox({ silent: true })

    return () => {
      cancelled = true
    }
  }, [selectedMailbox, currentEmail, folderSlug, searchInput])

  // Background sync: every 30s, silently refresh mailbox/folder
  useEffect(() => {
    if (!selectedMailbox) return
    let cancelled = false

    async function runBackgroundSync() {
      if (cancelled) return
      try {
        const syncParams = new URLSearchParams()
        syncParams.set('email', selectedMailbox)
        await fetch(`/api/emails/sync?${syncParams.toString()}`, {
          method: 'POST',
          headers: currentEmail ? { 'x-user-email': currentEmail } : undefined,
        })
        if (cancelled) return
        const q = new URLSearchParams()
        q.set('folder', folderSlug)
        if (searchInput) q.set('search', searchInput)
        q.set('limit', '30')
        q.set('viewEmail', selectedMailbox)
        const fetchResp = await fetch(`/api/emails?${q.toString()}`, {
          headers: currentEmail ? { 'x-user-email': currentEmail } : undefined,
        })
        if (!fetchResp.ok) return
        const d = await fetchResp.json()
        if (cancelled) return
        setThreads((prev) => mergeThreads(prev, d.threads || []))
        if (d.folders) setFolders(d.folders || [])
      } catch {
        // silent
      } finally {
        // silent
      }
    }

    runBackgroundSync()
    const interval = window.setInterval(runBackgroundSync, 30_000)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [selectedMailbox, currentEmail, folderSlug, searchInput])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchInput) {
      params.set('search', searchInput)
    } else {
      params.delete('search')
    }
    window.history.pushState({}, '', `/email?${params.toString()}`)
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const params = new URLSearchParams()
      if (selectedMailbox) params.set('email', selectedMailbox)

      const response = await fetch(`/api/emails/sync?${params.toString()}`, {
        method: 'POST',
        headers: currentEmail ? { 'x-user-email': currentEmail } : undefined,
      })
      
      if (response.ok) {
        setRefreshKey((k) => k + 1)
      } else {
        const error = await response.json()
        alert(`Ошибка синхронизации: ${error.error || 'Неизвестная ошибка'}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка'
      alert(`Ошибка синхронизации: ${message}`)
    } finally {
      setSyncing(false)
    }
  }

  const handleEmptyTrash = async () => {
    if (!isTrash) return
    if (!confirm('Очистить корзину? Все письма будут удалены без возможности восстановления.')) return

    setSyncing(true)
    try {
      const params = new URLSearchParams()
      // If admin is viewing another mailbox, pass viewEmail so server purges that mailbox's trash.
      if (selectedMailbox) params.set('viewEmail', selectedMailbox)
      const response = await fetch(`/api/emails/trash/empty?${params.toString()}`, {
        method: 'POST',
        headers: currentEmail ? { 'x-user-email': currentEmail } : undefined,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        alert(`Ошибка: ${data?.error || 'Не удалось очистить корзину'}`)
        return
      }

      const failedIds = Array.isArray(data?.failedIds) ? data.failedIds : []
      const deletedIds = Array.isArray(data?.deletedIds) ? data.deletedIds : []

      if (failedIds.length === 0) {
        setThreads([])
        setHasMore(false)
        setNextCursor(null)
      } else if (deletedIds.length > 0) {
        setThreads((prev) =>
          prev
            .map((t) => ({
              ...t,
              emails: t.emails.filter((e) => !deletedIds.includes(e.id)),
            }))
            .filter((t) => t.emails.length > 0)
        )
      }

      if (failedIds.length > 0) {
        alert(`Не удалось удалить ${failedIds.length} писем из корзины`)
      }

      setRefreshKey((k) => k + 1)
    } finally {
      setSyncing(false)
    }
  }

  const removeEmailFromThreads = (emailId: string) => {
    setThreads((prev) => {
      const next = prev
        .map((t) => ({
          ...t,
          emails: t.emails.filter((e) => e.id !== emailId),
        }))
        .filter((t) => t.emails.length > 0)
      return next
    })
    // also refresh folders counters in background
    setRefreshKey((k) => k + 1)
  }

  const markReadInThreads = (emailId: string) => {
    setThreads((prev) =>
      prev.map((t) => ({
        ...t,
        emails: t.emails.map((e) => (e.id === emailId ? { ...e, isRead: true } : e)),
      }))
    )
  }

  const applyMarkUnread = (ids: string[]) => {
    const setIds = new Set(ids)
    setThreads((prev) =>
      prev.map((t) => ({
        ...t,
        emails: t.emails.map((e) => (setIds.has(e.id) ? { ...e, isRead: false } : e)),
      }))
    )
    // Keep selection (user might want more actions), but often markUnread should keep them selected.
    // We'll keep them selected; user can "Снять все" if needed.
  }

  const applyMarkRead = (ids: string[]) => {
    const setIds = new Set(ids)
    setThreads((prev) =>
      prev.map((t) => ({
        ...t,
        emails: t.emails.map((e) => (setIds.has(e.id) ? { ...e, isRead: true } : e)),
      }))
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header>
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Mail className="w-8 h-8 text-black" />
                <div>
                  <h1 className="text-xl font-semibold text-black">Почта METRIKA</h1>
                  {mailboxes.length > 0 ? (
                    <div className="relative">
                      <select
                        value={selectedMailbox}
                        onChange={(e) => {
                          setSelectedMailbox(e.target.value)
                        }}
                        className="text-sm text-gray-700 bg-transparent border border-gray-300 rounded px-2 py-1 pr-8 appearance-none cursor-pointer hover:bg-gray-50"
                      >
                        {mailboxes.map((mailbox) => (
                          <option key={mailbox} value={mailbox}>
                            {mailbox}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">{currentEmail || 'Загрузка...'}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск писем..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-64"
                  />
                </form>

                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="min-w-[132px] justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  title="Синхронизировать письма с почтового сервера"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  Обновить
                </button>

                {isTrash ? (
                  <button
                    onClick={handleEmptyTrash}
                    disabled={syncing}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    title="Удалить все письма из корзины навсегда"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Очистить корзину
                  </button>
                ) : null}

                <button
                  onClick={() => setShowCompose(true)}
                  className="px-4 py-2 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                  style={{ backgroundColor: '#fff60b' }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a')
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor = '#fff60b')
                  }
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Написать
                </button>
              </div>
            </div>
          </div>
        </div>
      </Header>
      <BurgerMenu />

      {/* Main Content */}
      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex space-x-6">
            {/* Sidebar */}
            <Sidebar folders={folders} />

            {/* Email List */}
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Загрузка...</div>
                </div>
              ) : (
                <EmailList
                  threads={threads}
                  folderSlug={folderSlug}
                  currentEmail={currentEmail}
                  selectedMailbox={selectedMailbox}
                  onEmailDeleted={removeEmailFromThreads}
                  onEmailOpened={markReadInThreads}
                  onMarkedUnread={applyMarkUnread}
                  onMarkedRead={applyMarkRead}
                  selectedIds={selectedIds}
                  onToggleSelected={toggleSelected}
                  onSelectAll={selectAll}
                  onClearSelection={clearSelection}
                  hasMore={hasMore}
                  loadingMore={loadingMore}
                  onLoadMore={loadMoreThreads}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Compose Modal */}
      <ComposeEmail
        isOpen={showCompose}
        onClose={() => setShowCompose(false)}
        fromEmail={selectedMailbox || undefined}
        onSent={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  )
}

export default function EmailPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <EmailPageContent />
    </Suspense>
  )
}
