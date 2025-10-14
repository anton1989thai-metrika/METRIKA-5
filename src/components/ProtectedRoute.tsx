"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { hasPermission } from '@/lib/permissions'
import { User as UserType } from '@/data/users'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission: string
  fallbackUrl?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredPermission, 
  fallbackUrl = '/' 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'loading') {
        return
      }

      if (!session) {
        router.push('/auth/signin')
        return
      }

      try {
        const response = await fetch('/api/user', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const user = await response.json()
          setCurrentUser(user)
          
          const access = hasPermission(user, requiredPermission)
          setHasAccess(access)
          
          if (!access) {
            router.push(fallbackUrl)
            return
          }
        } else {
          router.push('/auth/signin')
          return
        }
        
      } catch (error) {
        console.error('Ошибка проверки доступа:', error)
        router.push('/auth/signin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [session, status, requiredPermission, fallbackUrl, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка доступа...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Доступ запрещен</h1>
          <p className="text-gray-600 mb-4">У вас нет прав для доступа к этому разделу</p>
          <button
            onClick={() => router.push(fallbackUrl)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
