'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Save } from 'lucide-react'

interface UserType {
  id: string
  name: string
  email: string
  login: string
  password: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  dateOfBirth: string
  phoneWork: string
  phonePersonal: string
  address: string
  userObjects: string[]
  comments: string
}

export default function AddUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    login: '',
    password: '',
    role: 'employee',
    status: 'pending' as const,
    dateOfBirth: '',
    phoneWork: '',
    phonePersonal: '',
    address: '',
    userObjects: [] as string[],
    comments: ''
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    if (formData.login && formData.login.length < 3) {
      newErrors.login = 'Логин должен содержать минимум 3 символа'
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Здесь будет API запрос для создания пользователя
      const userData: UserType = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        login: formData.login,
        password: formData.password,
        role: formData.role,
        status: formData.status,
        createdAt: new Date().toISOString(),
        dateOfBirth: formData.dateOfBirth,
        phoneWork: formData.phoneWork,
        phonePersonal: formData.phonePersonal,
        address: formData.address,
        userObjects: formData.userObjects,
        comments: formData.comments
      }

      // Временная заглушка - в реальном приложении здесь будет API запрос
      console.log('Создание пользователя:', userData)
      
      // Перенаправляем обратно к списку пользователей
      router.push('/admin/users')
      
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin">Админ панель</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/users">Пользователи</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Добавить пользователя</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Информация о пользователе</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Имя <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Введите имя"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Введите email"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login">Логин</Label>
                  <Input
                    id="login"
                    value={formData.login}
                    onChange={(e) => handleInputChange('login', e.target.value)}
                    placeholder="Введите логин"
                    className={errors.login ? 'border-red-500' : ''}
                  />
                  {errors.login && (
                    <p className="text-sm text-red-500">{errors.login}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Введите пароль"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Роль</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site-user">Пользователь сайта</SelectItem>
                      <SelectItem value="client">Клиент Метрики</SelectItem>
                      <SelectItem value="foreign-employee">Иностранный сотрудник</SelectItem>
                      <SelectItem value="freelancer">Внештатный сотрудник</SelectItem>
                      <SelectItem value="employee">Сотрудник</SelectItem>
                      <SelectItem value="manager">Менеджер</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Активен</SelectItem>
                      <SelectItem value="inactive">Неактивен</SelectItem>
                      <SelectItem value="pending">Ожидает</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Дата рождения</Label>
                  <Input
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    placeholder="ДД.ММ.ГГГГ"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneWork">Рабочий телефон</Label>
                  <Input
                    id="phoneWork"
                    value={formData.phoneWork}
                    onChange={(e) => handleInputChange('phoneWork', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phonePersonal">Личный телефон</Label>
                  <Input
                    id="phonePersonal"
                    value={formData.phonePersonal}
                    onChange={(e) => handleInputChange('phonePersonal', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Адрес</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Введите адрес"
                  />
                </div>
              </div>

              {/* Объекты пользователя */}
              <div className="space-y-2">
                <Label>Объекты пользователя</Label>
                <div className="w-full h-32 border border-gray-300 rounded-lg bg-gray-50 p-3 flex items-center justify-center">
                  <span className="text-sm text-gray-500">
                    Объекты не назначены (функционал в разработке)
                  </span>
                </div>
              </div>

              {/* Комментарии */}
              <div className="space-y-2">
                <Label htmlFor="comments">Комментарии</Label>
                <Input
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  placeholder="Введите комментарии"
                />
              </div>

              {/* Кнопки */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: '#fff60b' }}
                  className="text-black hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Создание...' : 'Создать пользователя'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
