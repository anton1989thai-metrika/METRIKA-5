"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Неверный email или пароль")
      } else {
        // Получаем обновленную сессию
        const session = await getSession()
        if (session) {
          router.push("/")
          router.refresh()
        }
      }
    } catch {
      setError("Произошла ошибка при входе")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">МЕТРИКА</h1>
          <h2 className="mt-6 text-2xl font-semibold text-black">
            Вход в систему
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Логин или Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-gray-300 focus:border-gray-400 text-black bg-white"
                placeholder="Введите логин или email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-gray-300 focus:border-gray-400 text-black bg-white"
                placeholder="Введите пароль"
              />
            </div>
          </div>

          {error && (
            <div className="text-gray-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 rounded-lg shadow-lg text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{backgroundColor: '#fff60b'}}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b';
                }
              }}
            >
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-500 text-sm"
            >
              Вернуться на главную
            </Link>
          </div>
        </form>

        {/* Реальные пользователи */}
        <div className="mt-8 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-black mb-2">Реальные пользователи:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Админ:</strong> admin / admin123 (Нехорошков Антон)</p>
            <p><strong>Менеджер:</strong> snikfayker / manager123 (Сникфайкер)</p>
            <p><strong>Агент:</strong> maslova / agent123 (Маслова Ирина)</p>
            <p><strong>Агент:</strong> ionin / agent123 (Ионин Владислав)</p>
            <p><strong>Агент:</strong> shirokikh / agent123 (Андрей Широких)</p>
            <p><strong>Агент:</strong> berdnik / agent123 (Бердник Вадим)</p>
            <p><strong>Агент:</strong> derik / agent123 (Дерик Олег)</p>
            <p><strong>Сотрудник:</strong> kan / employee123 (Кан Татьяна)</p>
            <p><strong>Сотрудник:</strong> povreznyuk / employee123 (Поврезнюк Мария)</p>
            <p><strong>Сотрудник:</strong> stulina / employee123 (Стулина Елена)</p>
            <p><strong>Сотрудник:</strong> tambovtseva / employee123 (Тамбовцева Екатерина)</p>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p>Можно входить как по email, так и по логину</p>
          </div>
        </div>
      </div>
    </div>
  )
}
