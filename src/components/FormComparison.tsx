'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { DynamicForm } from '@/components/DynamicForm'
import { FormConfig } from '@/config/form-rules'
import { migrateOldFormData, migrateNewFormData, validateFormData } from '@/lib/form-migration'
import formRulesConfig from '@/config/form-rules.json'

const config: FormConfig = formRulesConfig as FormConfig

// Импортируем старую форму (упрощенная версия для демонстрации)
import OldFormContent from './OldFormContent'

export function FormComparison() {
  const [oldFormData, setOldFormData] = useState<any>({})
  const [newFormData, setNewFormData] = useState<any>({})
  const [migrationResult, setMigrationResult] = useState<any>(null)

  const handleOldFormChange = (data: any) => {
    setOldFormData(data)
    
    // Автоматическая миграция в новую форму
    const migratedData = migrateOldFormData(data)
    setNewFormData(migratedData)
    
    // Валидация
    const validation = validateFormData(migratedData)
    setMigrationResult(validation)
  }

  const handleNewFormChange = (data: any) => {
    setNewFormData(data)
    
    // Обратная миграция в старую форму
    const migratedData = migrateNewFormData(data)
    setOldFormData(migratedData)
  }

  const handleSubmit = (data: any) => {
    console.log('Отправка данных:', data)
    alert('Данные успешно отправлены!')
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Сравнение форм
        </h1>
        <p className="text-gray-600">
          Сравните старую и новую динамическую форму недвижимости
        </p>
      </div>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">Сравнение</TabsTrigger>
          <TabsTrigger value="old-form">Старая форма</TabsTrigger>
          <TabsTrigger value="new-form">Новая форма</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Старая форма */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Старая форма
                  <Badge variant="secondary">Legacy</Badge>
                </CardTitle>
                <CardDescription>
                  Текущая реализация с жестко заданной логикой
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OldFormContent 
                  formData={oldFormData}
                  onChange={handleOldFormChange}
                />
              </CardContent>
            </Card>

            {/* Новая форма */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Новая форма
                  <Badge variant="default">Dynamic</Badge>
                </CardTitle>
                <CardDescription>
                  Динамическая форма с JSON-конфигурацией
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicForm
                  config={config}
                  initialData={newFormData}
                  onChange={handleNewFormChange}
                  onSubmit={handleSubmit}
                />
              </CardContent>
            </Card>
          </div>

          {/* Результат миграции */}
          {migrationResult && (
            <Card>
              <CardHeader>
                <CardTitle>Результат миграции</CardTitle>
                <CardDescription>
                  Статус валидации и миграции данных
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={migrationResult.isValid ? "default" : "destructive"}>
                      {migrationResult.isValid ? "Валидно" : "Ошибки"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {migrationResult.errors.length} ошибок
                    </span>
                  </div>
                  
                  {migrationResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-600">Ошибки валидации:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {migrationResult.errors.map((error: string, index: number) => (
                          <li key={index} className="text-sm text-red-600">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="old-form">
          <Card>
            <CardHeader>
              <CardTitle>Старая форма (полная версия)</CardTitle>
              <CardDescription>
                Текущая реализация из src/app/admin/objects/add/page.tsx
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OldFormContent 
                formData={oldFormData}
                onChange={handleOldFormChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-form">
          <Card>
            <CardHeader>
              <CardTitle>Новая динамическая форма</CardTitle>
              <CardDescription>
                Реализация на основе JSON-конфигурации
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicForm
                config={config}
                initialData={newFormData}
                onChange={handleNewFormChange}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
