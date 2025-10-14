"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User } from "@/data/users"

export default function TestFilePersistence() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: User[] = await response.json();
        setUsers(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    
    // Обновляем каждые 2 секунды
    const interval = setInterval(fetchUsers, 2000);
    return () => clearInterval(interval);
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Не авторизован</h1>
          <p className="text-gray-600 mb-4">Для доступа к этой странице необходимо войти в систему</p>
          <Link
            href="/auth/signin"
            className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
            style={{backgroundColor: '#fff60b'}}
          >
            Войти
          </Link>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Тест файловой персистентности</h1>
          <p className="text-gray-600">Эта страница показывает актуальные данные пользователей из файла в реальном времени</p>
          {lastUpdate && (
            <p className="text-sm text-gray-500 mt-2">
              Последнее обновление: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-4">Текущий пользователь</h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>ID:</strong> {session.user.id}</p>
            <p><strong>Имя:</strong> {session.user.name}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>Роль:</strong> <span className="capitalize">{session.user.role}</span></p>
            {(session.user as any).login && (
              <p><strong>Логин:</strong> {(session.user as any).login}</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-4">Все пользователи из файла (обновляется каждые 2 секунды)</h2>
          <div className="text-sm text-gray-500 mb-4">
            Количество пользователей: {users.length}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-black">{user.name}</h3>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <p className="text-sm text-gray-600">Логин: {user.login || 'Не указан'}</p>
                <p className="text-sm text-gray-600">Пароль: {user.password ? '***' + user.password.slice(-3) : 'Не указан'}</p>
                <p className="text-sm text-gray-600">Роль: <span className="capitalize">{user.role}</span></p>
                <p className="text-sm text-gray-600">Статус: <span className={user.status === 'active' ? 'text-green-600' : 'text-red-600'}>{user.status === 'active' ? 'Активен' : 'Неактивен'}</span></p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-black mb-2">✅ Система работает!</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Пользователи загружаются из файла <code>src/data/persisted-users.json</code></li>
            <li>Изменения в админ панели сохраняются в файл</li>
            <li>Система аутентификации читает данные из файла</li>
            <li>Данные обновляются в реальном времени</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-black mb-2">Как тестировать:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Откройте админ панель: <Link href="/admin" className="text-blue-600 hover:underline">http://localhost:3000/admin</Link></li>
            <li>Перейдите в раздел "Пользователи"</li>
            <li>Нажмите "Добавить пользователя" и создайте нового пользователя</li>
            <li>Или нажмите "Редактировать" на существующем пользователе и измените логин/пароль</li>
            <li>Нажмите "Сохранить изменения"</li>
            <li>Вернитесь на эту страницу - изменения должны отобразиться автоматически</li>
            <li>Попробуйте войти с новыми данными на странице входа</li>
          </ol>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-500 rounded-lg shadow-sm hover:shadow-md transition-all font-medium hover:bg-red-600"
          >
            Выйти
          </button>
          
          <Link
            href="/admin"
            className="px-4 py-2 text-black rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
            style={{backgroundColor: '#fff60b'}}
          >
            Админ панель
          </Link>
          
          <Link
            href="/auth/signin"
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all font-medium hover:bg-gray-200"
          >
            Страница входа
          </Link>
        </div>
      </div>
    </div>
  )
}
