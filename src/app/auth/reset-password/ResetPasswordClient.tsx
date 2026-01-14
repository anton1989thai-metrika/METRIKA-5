'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchJson } from '@/lib/api-client'

export default function ResetPasswordClient({ token }: { token: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const JSON_HEADERS = { 'Content-Type': 'application/json' } as const

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await fetchJson('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ token, password }),
      })
      router.push('/auth/signin')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось сменить пароль'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-white flex items-center justify-center">
      <div className="w-full max-w-xs space-y-4">
        <h1 className="text-xl font-semibold text-black">Новый пароль</h1>
        {!token ? (
          <div className="text-sm text-red-600">Нет токена. Откройте ссылку из письма.</div>
        ) : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите новый пароль"
              required
              disabled={!token}
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button type="submit" disabled={loading || !token} className="w-full">
            {loading ? 'Сохранение...' : 'Сохранить'}
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
