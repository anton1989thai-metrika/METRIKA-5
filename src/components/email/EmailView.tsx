'use client'

import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ArrowLeft, Star, Trash2, Reply, ReplyAll, Forward, Paperclip, Download } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Email {
  id: string
  from: string
  to: string
  cc?: string | null
  subject: string
  text?: string | null
  html?: string | null
  date: string
  isStarred: boolean
  attachments?: any | null
  thread?: {
    id: string
    emails: Email[]
  } | null
}

interface EmailViewProps {
  emailId: string
  folderSlug: string
  currentEmail?: string
  selectedMailbox?: string
}

export default function EmailView({ emailId, folderSlug, currentEmail, selectedMailbox }: EmailViewProps) {
  const router = useRouter()
  const [email, setEmail] = useState<Email | null>(null)
  const [loading, setLoading] = useState(true)
  const abortRef = useRef<AbortController | null>(null)

  const apiViewQuery =
    selectedMailbox && currentEmail && selectedMailbox !== currentEmail
      ? `?viewEmail=${encodeURIComponent(selectedMailbox)}`
      : ''
  const viewParam =
    selectedMailbox && currentEmail && selectedMailbox !== currentEmail
      ? `&mb=${encodeURIComponent(selectedMailbox)}`
      : ''
  const userHeader = currentEmail ? { 'x-user-email': currentEmail } : undefined

  useEffect(() => {
    async function fetchEmail() {
      if (!emailId || emailId === 'undefined' || emailId === 'null') {
        // Avoid a "false 404" while router params are not ready
        setLoading(true)
        return
      }
      if (selectedMailbox && !currentEmail) {
        // Need currentEmail to decide viewEmail usage
        setLoading(true)
        return
      }

      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac

      setLoading(true)
      try {
        const response = await fetch(`/api/emails/${emailId}${apiViewQuery}`, {
          headers: userHeader,
          signal: ac.signal,
        })
        if (!response.ok) {
          // Do not show intermediate "not found" texts; keep UI calm.
          // If it's a real 404, we'll just leave empty state.
          return
        }
        const data = await response.json()
        setEmail(data)
      } catch (error) {
        // Ignore abort errors; keep UI calm.
        if ((error as any)?.name !== 'AbortError') {
          console.error('Error fetching email:', error)
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false)
      }
    }

    fetchEmail()
    return () => abortRef.current?.abort()
  }, [emailId, apiViewQuery, currentEmail, selectedMailbox])

  const handleStar = async () => {
    if (!email) return

    try {
      const response = await fetch(`/api/emails/${emailId}/star${apiViewQuery}`, {
        method: 'POST',
        headers: userHeader,
      })

      if (response.ok) {
        setEmail({ ...email, isStarred: !email.isStarred })
      }
    } catch (error) {
      console.error('Error toggling star:', error)
    }
  }

  const handleDelete = async () => {
    if (!email) return

    if (!confirm('Удалить это письмо?')) return

    try {
      const qs = new URLSearchParams()
      if (selectedMailbox && currentEmail && selectedMailbox !== currentEmail) {
        qs.set('viewEmail', selectedMailbox)
      }
      if (folderSlug === 'trash') {
        qs.set('permanent', '1')
      }
      const suffix = qs.toString() ? `?${qs.toString()}` : ''

      const response = await fetch(`/api/emails/${emailId}/delete${suffix}`, {
        method: 'POST',
        headers: userHeader,
      })

      if (response.ok) {
        router.push(`/email?folder=${folderSlug}${viewParam}`)
      }
    } catch (error) {
      console.error('Error deleting email:', error)
    }
  }

  // No intermediate texts: keep layout stable without flashing messages
  if (loading && !email) return <div className="h-64" />
  if (!email) return <div className="h-64" />

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <Link
            href={`/email?folder=${folderSlug}${viewParam}`}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleStar}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                email.isStarred ? 'text-yellow-500' : 'text-gray-400'
              }`}
            >
              <Star className={`w-5 h-5 ${email.isStarred ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleDelete}
              className="p-2 rounded hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {email.subject || '(без темы)'}
        </h1>

        <div className="space-y-1 text-sm text-gray-600">
          <div>
            <span className="font-medium">От:</span> {email.from}
          </div>
          <div>
            <span className="font-medium">Кому:</span> {email.to}
          </div>
          {email.cc && (
            <div>
              <span className="font-medium">Копия:</span> {email.cc}
            </div>
          )}
          <div>
            <span className="font-medium">Дата:</span>{' '}
            {format(new Date(email.date), 'd MMMM yyyy, HH:mm', { locale: ru })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-b border-gray-200 p-4 flex items-center space-x-2">
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
          <Reply className="w-4 h-4 mr-2" />
          Ответить
        </button>
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
          <ReplyAll className="w-4 h-4 mr-2" />
          Ответить всем
        </button>
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
          <Forward className="w-4 h-4 mr-2" />
          Переслать
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {Array.isArray(email.attachments) && email.attachments.length > 0 ? (
          <div className="mb-6 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center text-sm font-semibold text-gray-900 mb-3">
              <Paperclip className="w-4 h-4 mr-2" />
              Вложения ({email.attachments.length})
            </div>
            <div className="space-y-2">
              {email.attachments.map((att: any) => {
                const filename = String(att?.filename || 'file')
                const size = typeof att?.size === 'number' ? att.size : 0
                const downloadHref = att?.id
                  ? `/api/emails/${email.id}/attachments/${att.id}${apiViewQuery}`
                  : null
                return (
                  <div
                    key={String(att?.id || filename)}
                    className="flex items-center justify-between border border-gray-200 rounded px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm text-gray-900 truncate">{filename}</div>
                      <div className="text-xs text-gray-500">{Math.round(size / 1024)} KB</div>
                    </div>
                    {downloadHref ? (
                      <a
                        href={downloadHref}
                        className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Скачать
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Нет файла</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        {email.html ? (
          <div
            dangerouslySetInnerHTML={{ __html: email.html }}
            className="prose max-w-none"
          />
        ) : (
          <div className="whitespace-pre-wrap text-gray-900">{email.text}</div>
        )}
      </div>

      {/* Thread emails */}
      {email.thread && email.thread.emails.length > 1 && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Цепочка писем ({email.thread.emails.length})
          </h3>
          <div className="space-y-4">
            {email.thread.emails
              .filter((e) => e.id !== email.id)
              .map((threadEmail) => (
                <div
                  key={threadEmail.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {threadEmail.from}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(threadEmail.date), 'd MMM yyyy, HH:mm', {
                        locale: ru,
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {threadEmail.text?.substring(0, 200)}
                    {threadEmail.text && threadEmail.text.length > 200 && '...'}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

