"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, Home, Building, Map, Info, Phone, BookOpen, User, Heart, GraduationCap, Book, CheckSquare, Settings } from "lucide-react"
import Link from "next/link"
import { UserRole } from "@/types/auth"
import { useLanguage } from "@/contexts/LanguageContext"

interface MenuItem {
  href: string
  label: string
  icon: React.ReactNode
  roles: UserRole[]
}


export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const { t } = useLanguage()
  
  const userRole: UserRole = (session?.user?.role as UserRole) || "guest"
  
  const menuItemsWithTranslations: MenuItem[] = [
    {
      href: "/",
      label: t('menu.home'),
      icon: <Home className="w-5 h-5" />,
      roles: ["guest", "client", "employee", "admin"]
    },
    {
      href: "/objects",
      label: t('menu.objects'),
      icon: <Building className="w-5 h-5" />,
      roles: ["guest", "client", "employee", "admin"]
    },
    {
      href: "/map",
      label: t('menu.map'),
      icon: <Map className="w-5 h-5" />,
      roles: ["guest", "client", "employee", "admin"]
    },
    {
      href: "/about",
      label: t('menu.about'),
      icon: <Info className="w-5 h-5" />,
      roles: ["guest", "client", "employee", "admin"]
    },
    {
      href: "/contacts",
      label: t('menu.contacts'),
      icon: <Phone className="w-5 h-5" />,
      roles: ["guest", "client", "employee", "admin"]
    },
    {
      href: "/blog",
      label: t('menu.blog'),
      icon: <BookOpen className="w-5 h-5" />,
      roles: ["guest", "client", "employee", "admin"]
    },
    {
      href: "/profile",
      label: t('menu.profile'),
      icon: <User className="w-5 h-5" />,
      roles: ["client", "employee", "admin"]
    },
    {
      href: "/my-objects",
      label: t('menu.myObjects'),
      icon: <Heart className="w-5 h-5" />,
      roles: ["client", "employee", "admin"]
    },
    {
      href: "/academy",
      label: t('menu.academy'),
      icon: <GraduationCap className="w-5 h-5" />,
      roles: ["employee", "admin"]
    },
    {
      href: "/knowledge-base",
      label: t('menu.knowledgeBase'),
      icon: <Book className="w-5 h-5" />,
      roles: ["employee", "admin"]
    },
    {
      href: "/tasks",
      label: t('menu.tasks'),
      icon: <CheckSquare className="w-5 h-5" />,
      roles: ["employee", "admin"]
    },
    {
      href: "/admin",
      label: t('menu.admin'),
      icon: <Settings className="w-5 h-5" />,
      roles: ["admin"]
    }
  ]
  
  const filteredMenuItems = menuItemsWithTranslations.filter(item => 
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
        className="fixed top-5 left-4 z-50 p-2 bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Открыть меню"
      >
        <Menu className="w-6 h-6 text-black" />
      </button>

      {/* Оверлей */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
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
          <h2 className="text-xl font-semibold text-black">{t('header.title')}</h2>
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
                {t('menu.logout')}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/auth/signin"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-center text-black rounded-md transition-colors"
                style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}
              >
                {t('menu.login')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
