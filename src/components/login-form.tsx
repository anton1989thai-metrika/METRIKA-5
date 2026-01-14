'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { fetchJson } from '@/lib/api-client';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowForgotPassword(false);
    setLoading(true);

    try {
      await fetchJson('/api/auth/login', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ email, password }),
      });
      router.push('/email')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка авторизации';
      setError(message);
      const lower = message.toLowerCase();
      if (lower.includes('неверн') || lower.includes('unauthorized')) {
        setShowForgotPassword(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div>
        <Label htmlFor="password">Пароль</Label>
        <div className="relative w-full">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
            className="pr-12 w-full"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPassword(!showPassword);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-20 flex items-center justify-center w-6 h-6"
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 block" />
            ) : (
              <Eye className="h-5 w-5 block" />
            )}
          </button>
        </div>
      </div>
      {error && (
        <div className="text-sm text-red-600">
          {error}
          {showForgotPassword ? (
            <div className="mt-2 text-sm text-black">
              <Link className="underline" href="/auth/forgot">
                Забыли пароль? Нажмите, чтобы восстановить.
              </Link>
            </div>
          ) : null}
        </div>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Вход...' : 'Войти'}
      </Button>
      <Button asChild className="w-full">
        <Link href="/register">Зарегистрироваться</Link>
      </Button>
    </form>
  );
}
