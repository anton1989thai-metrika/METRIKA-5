"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
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
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Вход в систему</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Введите ваши данные для входа в систему
          </p>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        <Field>
          <FieldLabel htmlFor="email">Логин или Email</FieldLabel>
          <Input 
            id="email" 
            type="text" 
            placeholder="Введите логин или email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Пароль</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Забыли пароль?
            </a>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="Введите пароль"
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        
        <Field>
          <Button 
            type="submit" 
            disabled={isLoading}
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
          </Button>
        </Field>
        
        <FieldSeparator>Или продолжить с</FieldSeparator>
        
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Войти через GitHub
          </Button>
          <FieldDescription className="text-center">
            Нет аккаунта?{" "}
            <a href="#" className="underline underline-offset-4">
              Зарегистрироваться
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
      
      <div className="text-center">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-500 text-sm"
        >
          Вернуться на главную
        </Link>
      </div>
      
      {/* Реальные пользователи */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
    </form>
  )
}
