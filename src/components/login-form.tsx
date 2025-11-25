'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Реализовать реальную авторизацию
      // Временная заглушка
      if (email && password) {
        router.push('/');
      } else {
        setError('Пожалуйста, заполните все поля');
      }
    } catch (err) {
      setError('Ошибка авторизации');
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
        {loading ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  );
}

