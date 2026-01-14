'use client'

import { useEffect, useMemo, useState } from 'react'
import BurgerMenu from '@/components/BurgerMenu'
import Header from '@/components/Header'
import { fetchJsonOrNull } from '@/lib/api-client'

type UserInfo = {
  name: string
  email: string
  role: string
  createdAt?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadUser() {
      try {
        const data = await fetchJsonOrNull<UserInfo>('/api/user')
        if (!data) return
        if (!isMounted) return
        setUser({
          name: data?.name || '',
          email: data?.email || '',
          role: data?.role || '',
          createdAt: data?.createdAt || '',
        })
      } catch (error) {
        console.error('Profile load error:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadUser()
    return () => {
      isMounted = false
    }
  }, [])

  const createdAtLabel = useMemo(() => {
    if (!user?.createdAt) return '—'
    const date = new Date(user.createdAt)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('ru-RU')
  }, [user?.createdAt])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
        
        <main className="pt-32 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-black mb-8">
              Личный кабинет
            </h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-black mb-4">
                  Информация о пользователе
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Имя:
                    </label>
                    <p className="text-black">{loading ? 'Загрузка...' : (user?.name || '—')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email:
                    </label>
                    <p className="text-black">{loading ? 'Загрузка...' : (user?.email || '—')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Роль:
                    </label>
                    <p className="text-black capitalize">{loading ? 'Загрузка...' : (user?.role || '—')}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-black mb-4">
                  Статистика
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Просмотренных объектов:</span>
                    <span className="font-semibold text-black">0</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Избранных объектов:</span>
                    <span className="font-semibold text-black">0</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Заявок подано:</span>
                    <span className="font-semibold text-black">0</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Дата регистрации:</span>
                    <span className="font-semibold text-black">{createdAtLabel}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">
                Быстрые действия
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  className="p-4 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                  style={{backgroundColor: '#fff60b'}}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
                >
                  Подать заявку
                </button>
                
                <button className="p-4 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                  Настроить уведомления
                </button>
                
                <button className="p-4 bg-white border border-gray-300 text-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                  Изменить данные
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}
