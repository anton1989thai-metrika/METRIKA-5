"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function TestAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Тест аутентификации</h1>
          <p className="text-gray-600">Проверка работы системы входа</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-4">Информация о пользователе</h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>ID:</strong> {session.user.id}</p>
            <p><strong>Имя:</strong> {session.user.name}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>Роль:</strong> <span className="capitalize">{session.user.role}</span></p>
            {(session.user as any).login && (
              <p><strong>Логин:</strong> {(session.user as any).login}</p>
            )}
            {(session.user as any).department && (
              <p><strong>Отдел:</strong> {(session.user as any).department}</p>
            )}
            {(session.user as any).phone && (
              <p><strong>Телефон:</strong> {(session.user as any).phone}</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-4">Права доступа</h2>
          {(session.user as any).permissions ? (
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              {Object.entries((session.user as any).permissions).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${value ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm">{key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Права доступа не определены</p>
          )}
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
            href="/"
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all font-medium hover:bg-gray-200"
          >
            Главная
          </Link>
        </div>
      </div>
    </div>
  )
}
