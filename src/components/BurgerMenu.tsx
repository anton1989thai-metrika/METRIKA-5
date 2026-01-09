"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Menu, X, Home, Building, Map, Info, Phone, BookOpen, User, Heart, Mail, GraduationCap, Book, CheckSquare, Settings, LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { usePathname } from "next/navigation"
import type { UserRole } from "@/types/auth"
import { hasPermission } from "@/lib/permissions"
import type { User } from "@/data/users"

interface MenuItem {
  href: string
  label: string
  icon: React.ReactNode
}

export default function BurgerMenu() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpenDialog, setHasOpenDialog] = useState(false)
  const [authRole, setAuthRole] = useState<UserRole | null>(null)
  const [isAuthed, setIsAuthed] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
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
        // Явно исключаем z-index 45, чтобы избежать ложных срабатываний на overlay бургер-меню
        return zIndex > 50 && zIndex !== 45 && !isBurgerMenu && !isHeader
      })
      
      // Проверяем модальные окна с backdrop/overlay
      // Проверяем только элементы с явными признаками Radix UI диалогов или реальных модальных окон
      const modalBackdrops = Array.from(document.querySelectorAll('div')).filter(el => {
        const styles = window.getComputedStyle(el)
        const zIndex = parseInt(styles.zIndex) || 0
        const position = styles.position
        
        // Явно исключаем overlay бургер-меню: z-index 45 или элементы с z-[45] в Tailwind
        // Проверяем разные варианты, как может вычисляться z-index во внутреннем браузере
        if (zIndex === 45 || 
            styles.zIndex === '45' || 
            styles.zIndex === '45px' ||
            (zIndex >= 44 && zIndex <= 46)) return false
        
        const isBurgerMenu = el.closest('[class*="burger"]') || el.closest('[class*="Burger"]')
        const isHeader = el.closest('header')
        
        // Проверяем наличие атрибутов Radix UI - ВАЖНО: проверяем только "open", не просто наличие атрибута!
        const dataState = el.getAttribute('data-state')
        const hasRadixAttributes = el.getAttribute('data-radix-dialog-overlay') !== null ||
                                   el.getAttribute('data-radix-alert-dialog-overlay') !== null ||
                                   (dataState !== null && dataState === 'open') // Только открытые диалоги!
        
        const hasBackdrop = (el.classList.contains('bg-black') || 
                            el.classList.contains('backdrop-blur') ||
                            (styles.backgroundColor && (styles.backgroundColor.includes('rgba') || styles.backgroundColor.includes('rgb'))))
        
        return position === 'fixed' && 
               zIndex > 50 &&
               hasBackdrop &&
               hasRadixAttributes && // Только элементы с явными признаками ОТКРЫТЫХ диалогов
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
  
  // Load session user data (for permission-based menu)
  useEffect(() => {
    let cancelled = false
    async function loadMe() {
      try {
        // Загружаем полные данные пользователя из API
        const resp = await fetch('/api/user')
        if (!resp.ok) {
          if (!cancelled) {
            setIsAuthed(false)
            setAuthRole(null)
            setCurrentUser(null)
          }
          return
        }
        const userData = await resp.json().catch(() => ({}))
        if (!cancelled && userData?.email) {
          setIsAuthed(true)
          setAuthRole(userData.role as UserRole)
          
          // Преобразуем данные пользователя в формат User
          setCurrentUser({
            id: userData.id || userData.email,
            email: userData.email,
            name: userData.name || '',
            role: userData.role,
            status: userData.status || 'active',
            permissions: {} as any, // Будет вычислено из detailedPermissions
            detailedPermissions: userData.detailedPermissions || undefined,
            createdAt: userData.createdAt || new Date().toISOString(),
          } as User)
        }
      } catch {
        if (!cancelled) {
          setIsAuthed(false)
          setAuthRole(null)
          setCurrentUser(null)
        }
      }
    }
    loadMe()
    
    // Слушаем изменения в localStorage для обновления разрешений
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('userPermissions_')) {
        loadMe()
      }
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Слушаем кастомное событие обновления разрешений
    const handlePermissionsUpdate = (e: CustomEvent) => {
      if (currentUser && e.detail?.userId === currentUser.id) {
        loadMe()
      }
    }
    window.addEventListener('permissionsUpdated', handlePermissionsUpdate as EventListener)
    
    // Проверяем изменения каждые 2 секунды (на случай, если разрешения изменились)
    const interval = setInterval(() => {
      loadMe()
    }, 2000)
    
    return () => {
      cancelled = true
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('permissionsUpdated', handlePermissionsUpdate as EventListener)
      clearInterval(interval)
    }
  }, [])

  const filteredMenuItems = useMemo(() => {
    const base = new Set(['/', '/objects', '/map', '/about', '/contacts', '/blog'])

    const allow = (href: string) => {
      // Базовые разделы доступны всем
      if (base.has(href)) return true
      
      // Для остальных разделов проверяем разрешения
      if (!isAuthed || !currentUser) return false

      // Маппинг href на названия разделов для проверки прав
      const sectionMap: Record<string, string> = {
        '/profile': 'profile',
        '/my-objects': 'my-objects',
        '/email': 'email',
        '/academy': 'academy',
        '/knowledge-base': 'knowledge-base',
        '/tasks': 'tasks',
        '/admin': 'admin',
      }

      const section = sectionMap[href]
      if (!section) return false

      // Используем функцию hasPermission, которая учитывает индивидуальные разрешения
      return hasPermission(currentUser, section)
    }

    return menuItemsWithTranslations.filter((i) => allow(i.href))
  }, [currentUser, isAuthed, menuItemsWithTranslations])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    setIsAuthed(false)
    setAuthRole(null)
    setIsOpen(false)
    router.push('/')
  }

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
          <h2 className="text-xl font-semibold text:black pl-[14px] pr-[14px]">{t('header.title')}</h2>
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
              {!isAuthed ? (
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
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 p-3 rounded-md transition-all font-medium bg-white border border-gray-300 text-black hover:bg-gray-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Выйти</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
