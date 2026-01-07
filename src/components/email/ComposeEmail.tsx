'use client'

import { useMemo, useRef, useState } from 'react'
import { X, Send, Paperclip, Trash2 } from 'lucide-react'

interface ComposeEmailProps {
  isOpen: boolean
  onClose: () => void
  fromEmail?: string
  onSent?: () => void
  replyTo?: {
    from: string
    subject: string
    text?: string | null
  }
}

export default function ComposeEmail({
  isOpen,
  onClose,
  fromEmail,
  onSent,
  replyTo,
}: ComposeEmailProps) {
  const [to, setTo] = useState(replyTo?.from || '')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [subject, setSubject] = useState(
    replyTo ? `Re: ${replyTo.subject}` : ''
  )
  const [text, setText] = useState(
    replyTo && replyTo.text
      ? `\n\n--- Исходное сообщение ---\n${replyTo.text}`
      : ''
  )
  const [sending, setSending] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const totalSize = useMemo(() => files.reduce((sum, f) => sum + (f.size || 0), 0), [files])

  if (!isOpen) return null

  const handleSend = async () => {
    if (!to.trim()) {
      alert('Укажите получателя')
      return
    }

    setSending(true)

    try {
      const form = new FormData()
      form.set('fromEmail', fromEmail || '')
      form.set('to', to)
      form.set('cc', cc)
      form.set('bcc', bcc)
      form.set('subject', subject)
      form.set('text', text)
      for (const f of files) {
        form.append('attachments', f, f.name)
      }

      const response = await fetch('/api/emails/send', { method: 'POST', body: form })

      if (response.ok) {
        onClose()
        // Reset form
        setTo('')
        setCc('')
        setBcc('')
        setSubject('')
        setText('')
        setFiles([])
        onSent?.()
      } else {
        alert('Ошибка при отправке письма')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Ошибка при отправке письма')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Новое письмо</h2>
            {fromEmail ? (
              <div className="text-xs text-gray-500 mt-0.5">От: {fromEmail}</div>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Кому
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Копия (необязательно)
            </label>
            <input
              type="email"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Скрытая копия (необязательно)
            </label>
            <input
              type="email"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тема
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Тема письма"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Сообщение
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
              placeholder="Введите текст письма..."
            />
          </div>

          {files.length > 0 ? (
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">
                  Вложения: {files.length}
                  <span className="text-xs text-gray-500 ml-2">
                    ({Math.round(totalSize / 1024)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Удалить все
                </button>
              </div>
              <div className="space-y-2">
                {files.map((f, idx) => (
                  <div key={`${f.name}-${f.size}-${idx}`} className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 truncate pr-2">{f.name}</div>
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      title="Удалить файл"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={(e) => {
                const list = Array.from(e.target.files || [])
                if (list.length > 0) {
                  setFiles((prev) => [...prev, ...list])
                }
                // allow selecting the same file again
                e.currentTarget.value = ''
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              title="Прикрепить файл"
            >
            <Paperclip className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              {sending ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

