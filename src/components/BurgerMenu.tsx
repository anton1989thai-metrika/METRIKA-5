"use client"

import { useState } from "react"
import { Menu, X, Home, Building, Map, Info, Phone, BookOpen, User, Heart, Mail, GraduationCap, Book, CheckSquare, Settings, Calculator } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

interface MenuItem {
  href: string
  label: string
  icon: React.ReactNode
}

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()
  
  // Авторизация отключена - показываем все пункты меню без фильтрации
  const menuItemsWithTranslations: MenuItem[] = [
    { href: "/", label: t('menu.home'), icon: <Home className="w-5 h-5" /> },
    { href: "/objects", label: t('menu.objects'), icon: <Building className="w-5 h-5" /> },
    { href: "/map", label: t('menu.map'), icon: <Map className="w-5 h-5" /> },
    { href: "/about", label: t('menu.about'), icon: <Info className="w-5 h-5" /> },
    { href: "/contacts", label: t('menu.contacts'), icon: <Phone className="w-5 h-5" /> },
    { href: "/blog", label: t('menu.blog'), icon: <BookOpen className="w-5 h-5" /> },
    { href: "/profile", label: t('menu.profile'), icon: <User className="w-5 h-5" /> },
    { href: "/my-objects", label: t('menu.myObjects'), icon: <Heart className="w-5 h-5" /> },
    { href: "/email", label: "Email", icon: <Mail className="w-5 h-5" /> },
    { href: "/academy", label: t('menu.academy'), icon: <GraduationCap className="w-5 h-5" /> },
    { href: "/knowledge-base", label: t('menu.knowledgeBase'), icon: <Book className="w-5 h-5" /> },
    { href: "/tasks", label: t('menu.tasks'), icon: <CheckSquare className="w-5 h-5" /> },
    { href: "/admin", label: t('menu.admin'), icon: <Settings className="w-5 h-5" /> }
  ]
  
  const filteredMenuItems = menuItemsWithTranslations

  return (
    <>
      {/* Кнопка бургер-меню */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-[19px] left-4 z-50 bg-white border border-gray-300 rounded-md shadow-md transition-colors flex flex-col items-center justify-center p-2 hover:bg-gray-50"
        style={{ height: '40px', width: '40px' }}
        aria-label="Открыть меню"
      >
        <Menu className="w-6 h-6 text-black flex flex-col items-center justify-center" />
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
        <div className="flex items:center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text:black">{t('header.title')}</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Закрыть меню"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin">
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
      </div>
    </>
  )
}
