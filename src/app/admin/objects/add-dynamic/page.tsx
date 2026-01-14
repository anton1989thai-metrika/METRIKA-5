'use client'

import { debugLog } from '@/lib/logger'

import { useRouter } from 'next/navigation'
import { Home, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { DynamicForm } from '@/components/DynamicForm'
import { FormConfig, FormData } from '@/config/form-rules'
import ProtectedRoute from '@/components/ProtectedRoute'
import formRulesConfig from '@/config/form-rules.json'

// Конвертируем JSON в типизированный объект
const config = formRulesConfig as unknown as FormConfig

export default function AddObjectDynamicPage() {
  const router = useRouter()

  const handleSubmit = (formData: FormData) => {
    debugLog('Данные формы:', formData)
    
    // Здесь можно добавить логику сохранения
    // Например, отправка на API
    alert('Объект успешно добавлен!')
    
    // Перенаправление на страницу объектов
    router.push('/admin/objects')
  }

  const handleChange = (formData: FormData) => {
    // Обработка изменений в реальном времени
    debugLog('Изменения:', formData)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Хлебные крошки */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin" className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  Админ панель
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/objects">
                  Объекты недвижимости
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Добавить объект (Динамическая форма)</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Заголовок */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Добавить объект недвижимости
                </h1>
                <p className="mt-2 text-gray-600">
                  Заполните форму для добавления нового объекта недвижимости
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/admin/objects')}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Вернуться к списку
              </Button>
            </div>
          </div>

          {/* Динамическая форма */}
          <div className="bg-white rounded-lg shadow-sm border">
            <DynamicForm
              config={config}
              initialData={{
                country: 'russia',
                operation: 'rent',
                type: 'apartment'
              }}
              onSubmit={handleSubmit}
              onChange={handleChange}
              className="p-6"
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
