"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, Home, Building, Map, Info, Phone, BookOpen, User, Heart, GraduationCap, Book, CheckSquare, Settings } from "lucide-react"
import Link from "next/link"
import { UserRole } from "@/types/auth"

interface MenuItem {
  href: string
  label: string
  icon: React.ReactNode
  roles: UserRole[]
}

const menuItems: MenuItem[] = [
  {
    href: "/",
    label: "Главная",
    icon: <Home className="w-5 h-5" />,
    roles: ["guest", "client", "employee", "admin"]
  },
  {
    href: "/objects",
    label: "Объекты",
    icon: <Building className="w-5 h-5" />,
    roles: ["guest", "client", "employee", "admin"]
  },
  {
    href: "/map",
    label: "Карта",
    icon: <Map className="w-5 h-5" />,
    roles: ["guest", "client", "employee", "admin"]
  },
  {
    href: "/about",
    label: "О компании",
    icon: <Info className="w-5 h-5" />,
    roles: ["guest", "client", "employee", "admin"]
  },
  {
    href: "/contacts",
    label: "Контакты",
    icon: <Phone className="w-5 h-5" />,
    roles: ["guest", "client", "employee", "admin"]
  },
  {
    href: "/blog",
    label: "Блог",
    icon: <BookOpen className="w-5 h-5" />,
    roles: ["guest", "client", "employee", "admin"]
  },
  {
    href: "/profile",
    label: "Личный кабинет",
    icon: <User className="w-5 h-5" />,
    roles: ["client", "employee", "admin"]
  },
  {
    href: "/my-objects",
    label: "Мои объекты",
    icon: <Heart className="w-5 h-5" />,
    roles: ["client", "employee", "admin"]
  },
  {
    href: "/academy",
    label: "Академия",
    icon: <GraduationCap className="w-5 h-5" />,
    roles: ["employee", "admin"]
  },
  {
    href: "/knowledge-base",
    label: "База знаний",
    icon: <Book className="w-5 h-5" />,
    roles: ["employee", "admin"]
  },
  {
    href: "/tasks",
    label: "Менеджер задач",
    icon: <CheckSquare className="w-5 h-5" />,
    roles: ["employee", "admin"]
  },
  {
    href: "/admin",
    label: "Админ панель",
    icon: <Settings className="w-5 h-5" />,
    roles: ["admin"]
  }
]

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  
  const userRole: UserRole = (session?.user?.role as UserRole) || "guest"
  
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  )

  const handleSignOut = () => {
    signOut()
    setIsOpen(false)
  }

  return (
    <>
      {/* Кнопка бургер-меню */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-4 z-50 p-2 bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Открыть меню"
      >
        <Menu className="w-6 h-6 text-black" />
      </button>

      {/* Оверлей */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-400 bg-opacity-20 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Боковое меню */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Заголовок меню */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">МЕТРИКА</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Закрыть меню"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 overflow-y-auto">
          <div className="p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 p-3 text-black hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Футер с информацией о пользователе */}
        <div className="border-t border-gray-200 p-4">
          {session ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <p className="font-medium">{session.user?.name}</p>
                <p className="capitalize">{session.user?.role}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/auth/signin"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Войти
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
