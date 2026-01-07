'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { hasPermission } from '@/lib/permissions'
import type { User } from '@/data/users'

interface ClientPermissionCheckProps {
  children: React.ReactNode
  requiredSection: string
  fallbackUrl?: string
}

export default function ClientPermissionCheck({
  children,
  requiredSection,
  fallbackUrl = '/',
}: ClientPermissionCheckProps) {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    async function checkAccess() {
      try {
        // Загружаем данные пользователя
        const resp = await fetch('/api/user')
        if (!resp.ok) {
          setHasAccess(false)
          router.push(fallbackUrl)
          return
        }

        const userData = await resp.json()
        
        // Преобразуем в формат User
        const user: User = {
          id: userData.id || userData.email,
          email: userData.email,
          name: userData.name || '',
          role: userData.role,
          status: userData.status || 'active',
          permissions: {} as any,
          detailedPermissions: userData.detailedPermissions || undefined,
          createdAt: userData.createdAt || new Date().toISOString(),
        }

        setCurrentUser(user)

        // Проверяем доступ
        const access = hasPermission(user, requiredSection)
        setHasAccess(access)

        if (!access) {
          router.push(fallbackUrl)
        }
      } catch (error) {
        console.error('Ошибка проверки доступа:', error)
        setHasAccess(false)
        router.push(fallbackUrl)
      }
    }

    checkAccess()
  }, [requiredSection, fallbackUrl, router])

  // Показываем содержимое только если доступ разрешен
  if (hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return <>{children}</>
}

