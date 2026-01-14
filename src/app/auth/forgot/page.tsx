'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchJson } from '@/lib/api-client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const JSON_HEADERS = { 'Content-Type': 'application/json' } as const

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const data = await fetchJson<{ success?: boolean; message?: string }>(
        '/api/auth/password-reset/request',
        {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify({ email }),
        }
      )
      setMessage(data?.message || 'Проверьте почту для дальнейших инструкций.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось отправить ссылку'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-white flex items-center justify-center">
      <div className="w-full max-w-xs space-y-4">
        <h1 className="text-xl font-semibold text-black">Восстановление пароля</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
              required
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {message && <div className="text-sm text-green-700">{message}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Отправка...' : 'Отправить ссылку'}
          </Button>
        </form>
        <div className="text-sm text-gray-600">
          <Link className="underline" href="/auth/signin">
            Вернуться ко входу
          </Link>
        </div>
      </div>
    </div>
  )
}
