"use client"

import { useState, useEffect } from "react"
import { Menu, X, Home, Building, Map, Info, Phone, BookOpen, User, Heart, Mail, GraduationCap, Book, CheckSquare, Settings, LogIn } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { usePathname } from "next/navigation"

interface MenuItem {
  href: string
  label: string
  icon: React.ReactNode
}

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpenDialog, setHasOpenDialog] = useState(false)
  const { t } = useLanguage()
  const pathname = usePathname()
  
  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Проверяем наличие открытых диалогов/модальных окон
  useEffect(() => {
    // Не проверяем диалоги на сервере
    if (typeof window === 'undefined') return

    let observer: MutationObserver | null = null
    let interval: NodeJS.Timeout | null = null

    const checkForOpenDialogs = () => {
      // Если бургер-меню открыто, не проверяем диалоги (чтобы не конфликтовать с собственным overlay)
      if (isOpen) {
        setHasOpenDialog(false)
        return
      }

      // Проверяем Radix UI Dialog (data-state="open")
      // Исключаем элементы бургер-меню
      const radixDialogs = Array.from(document.querySelectorAll('[data-state="open"]')).filter(el => {
        // Исключаем элементы бургер-меню
        const isBurgerMenu = el.closest('[class*="burger"]') || el.closest('[class*="Burger"]')
        if (isBurgerMenu) return false
        
        // Проверяем что это overlay или content диалога
        const isDialogOverlay = el.getAttribute('data-radix-dialog-overlay') !== null ||
                               el.getAttribute('data-radix-alert-dialog-overlay') !== null ||
                               (el.classList.contains('fixed') && 
                               (el.classList.contains('inset-0') || el.classList.contains('z-50')))
        
        return isDialogOverlay
      })
      
      // Проверяем модальные окна с z-50 (обычные модальные окна)
      // Исключаем overlay бургер-меню (z-[45]) и Header (z-50)
      const modalOverlays = Array.from(document.querySelectorAll('.fixed.inset-0')).filter(el => {
        const styles = window.getComputedStyle(el)
        const zIndex = parseInt(styles.zIndex) || 0
        const isBurgerMenu = el.closest('[class*="burger"]') || el.closest('[class*="Burger"]')
        const isHeader = el.closest('header')
        // Исключаем overlay бургер-меню (z-45), Header (z-50) и проверяем только z-50+ модальные окна
        return zIndex > 50 && !isBurgerMenu && !isHeader
      })
      
      // Проверяем модальные окна с backdrop/overlay
      const modalBackdrops = Array.from(document.querySelectorAll('div')).filter(el => {
        const styles = window.getComputedStyle(el)
        const zIndex = parseInt(styles.zIndex) || 0
        const position = styles.position
        const isBurgerMenu = el.closest('[class*="burger"]') || el.closest('[class*="Burger"]')
        const isHeader = el.closest('header')
        const hasBackdrop = (el.classList.contains('bg-black') || 
                            el.classList.contains('backdrop-blur') ||
                            (styles.backgroundColor && (styles.backgroundColor.includes('rgba') || styles.backgroundColor.includes('rgb'))))
        
        return position === 'fixed' && 
               zIndex > 50 &&
               hasBackdrop &&
               !isBurgerMenu &&
               !isHeader &&
               el.offsetWidth > 0 &&
               el.offsetHeight > 0
      })

      const hasDialog = radixDialogs.length > 0 || 
                       modalOverlays.length > 0 || 
                       modalBackdrops.length > 0
      
      // Временно логируем для отладки
      if (hasDialog) {
        console.log('Dialog detected:', { radixDialogs: radixDialogs.length, modalOverlays: modalOverlays.length, modalBackdrops: modalBackdrops.length })
      }
      
      setHasOpenDialog(hasDialog)
    }

    // Задержка для инициализации после загрузки DOM
    const timeout = setTimeout(() => {
      checkForOpenDialogs()

      // Создаем MutationObserver для отслеживания изменений в DOM
      observer = new MutationObserver(checkForOpenDialogs)
      
      // Наблюдаем за изменениями в body
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-state', 'class', 'style']
      })

      // Также проверяем периодически (на случай если MutationObserver пропустит)
      interval = setInterval(checkForOpenDialogs, 200)
    }, 100)

    return () => {
      clearTimeout(timeout)
      if (observer) {
        observer.disconnect()
      }
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isOpen])
  
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
      {!isOpen && (
      <button
        onClick={() => setIsOpen(true)}
          className="fixed top-[19px] left-4 z-[60] bg-white border border-gray-300 rounded-md shadow-md transition-all flex flex-col items-center justify-center p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            height: '40px', 
            width: '40px',
            zIndex: 60
          }}
        aria-label="Открыть меню"
          disabled={hasOpenDialog}
      >
        <Menu className="w-6 h-6 text-black flex flex-col items-center justify-center" />
      </button>
      )}

      {/* Оверлей */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[45] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Боковое меню */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-[50] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
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
            
            {/* Кнопка Войти */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/auth/signin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 p-3 rounded-md transition-all font-medium"
                style={{ backgroundColor: '#fff60b', color: '#000' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e6d80a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff60b';
                }}
              >
                <LogIn className="w-5 h-5" />
                <span>Войти</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
