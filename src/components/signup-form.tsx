'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password) {
        setError('Пожалуйста, заполните все поля');
        return;
      }
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok || !data?.success) {
        setError(data?.error || 'Ошибка регистрации')
        return
      }
      // Registered + logged in -> go to personal cabinet
      router.push('/profile')
    } catch (err) {
      setError('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Имя</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя"
          required
        />
      </div>
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
        <div className="mt-1 text-xs text-gray-500">Email будет вашим логином для входа на сайт.</div>
      </div>
      <div>
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
          required
        />
      </div>
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
}
