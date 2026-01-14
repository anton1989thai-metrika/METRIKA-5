"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Archive,
  Building2,
  CheckCircle,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  File,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Trash2,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AGENTS, PROPERTY_TYPES } from "@/lib/real-estate-options"

// Интерфейс объекта
interface RealEstateObject {
  id: string
  title: string
  address: string
  price: string
  type: string
  country: string
  operation: string
  agent: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  createdBy: string
  images: Array<{
    id: string
    url: string
    size: string
    name: string
  }>
  characteristics: {
    area?: string
    floor?: string
    material?: string
    buildYear?: string
    rooms?: string
    bathrooms?: string
    balcony?: string
    parking?: string
    landArea?: string
    floors?: string
    commercialType?: string
    nonCapitalType?: string
    sharesType?: string
  }
  description: string
  comments: Array<{
    id: string
    text: string
    author: string
    createdAt: string
  }>
  history: Array<{
    id: string
    action: string
    author: string
    timestamp: string
    changes?: string
  }>
}

// Моковые данные
const mockObjects: RealEstateObject[] = [
  {
    id: '1',
    title: '2-комнатная квартира',
    address: 'пр. Мира, д. 8',
    price: '12 000 000 ₽',
    type: 'apartment',
    country: 'russia',
    operation: 'sale',
    agent: 'agent1',
    status: 'published',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'admin',
    images: [
      { id: '1', url: '/images/object-1.jpg', size: '2.4 MB', name: 'object-1.jpg' },
      { id: '2', url: '/images/object-2.jpg', size: '1.8 MB', name: 'object-2.jpg' }
    ],
    characteristics: {
      area: '65 м²',
      floor: '7/12',
      material: 'Панель',
      buildYear: '2018',
      rooms: '3',
      bathrooms: '2',
      balcony: 'Да',
      parking: 'Подземная'
    },
    description: 'Просторная трехкомнатная квартира в современном жилом комплексе.',
    comments: [],
    history: [
      {
        id: '1',
        action: 'Создан объект',
        author: 'admin',
        timestamp: '2024-01-15T10:30:00Z'
      }
    ]
  },
  {
    id: '2',
    title: '3-комнатная квартира',
    address: 'ул. Ленина, д. 15',
    price: '15 500 000 ₽',
    type: 'apartment',
    country: 'russia',
    operation: 'sale',
    agent: 'agent2',
    status: 'draft',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    createdBy: 'manager1',
    images: [
      { id: '3', url: '/images/object-3.jpg', size: '3.1 MB', name: 'object-3.jpg' }
    ],
    characteristics: {
      area: '85 м²',
      floor: '5/9',
      material: 'Кирпич',
      buildYear: '2020'
    },
    description: 'Современная квартира с отличным ремонтом.',
    comments: [
      {
        id: '1',
        text: 'Клиент просил не указывать точный адрес',
        author: 'manager1',
        createdAt: '2024-01-16T14:25:00Z'
      }
    ],
    history: [
      {
        id: '2',
        action: 'Создан черновик',
        author: 'manager1',
        timestamp: '2024-01-16T14:20:00Z'
      },
      {
        id: '3',
        action: 'Добавлен комментарий',
        author: 'manager1',
        timestamp: '2024-01-16T14:25:00Z'
      }
    ]
  }
]

export default function ObjectManagementPanel() {
  const router = useRouter()
  const [objects, setObjects] = useState<RealEstateObject[]>(mockObjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [agentFilter, setAgentFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<keyof RealEstateObject>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showBulkUpload, setShowBulkUpload] = useState(false)

  // Фильтрация и сортировка объектов
  const filteredObjects = objects
    .filter(obj => {
      if (searchQuery && !obj.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !obj.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !obj.price.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (statusFilter !== 'all' && obj.status !== statusFilter) return false
      if (typeFilter !== 'all' && obj.type !== typeFilter) return false
      if (agentFilter !== 'all' && obj.agent !== agentFilter) return false
      return true
    })
    .sort((a, b) => {
      const normalizeValue = (value: RealEstateObject[keyof RealEstateObject]) => {
        if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
          return new Date(String(value)).getTime()
        }
        if (typeof value === 'string') return value.toLowerCase()
        if (Array.isArray(value)) return value.length
        return value ? JSON.stringify(value) : ''
      }

      const aValue = normalizeValue(a[sortBy])
      const bValue = normalizeValue(b[sortBy])

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }

      const order = String(aValue).localeCompare(String(bValue))
      return sortOrder === 'asc' ? order : -order
    })

  const handleCreateObject = () => {
    router.push('/admin/objects/add-dynamic-form')
  }

  // Скачивание шаблона Excel
  const downloadExcelTemplate = () => {
    // Создаем CSV файл с заголовками
    const headers = [
      'Название объекта',
      'Адрес',
      'Цена',
      'Тип недвижимости',
      'Страна',
      'Тип операции',
      'Агент',
      'Описание',
      'Площадь',
      'Этаж',
      'Материал',
      'Год постройки',
      'Количество комнат',
      'Санузлы',
      'Балкон',
      'Парковка',
      'Площадь участка',
      'Этажность',
      'Тип коммерции',
      'Тип строения',
      'Тип доли',
      'Район',
      'Метро',
      'Широта',
      'Долгота',
      'Meta заголовок',
      'Meta описание',
      'Ключевые слова',
      'Комментарии'
    ]

    const csvContent = headers.join(',') + '\n'
    
    // Создаем и скачиваем файл
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'template_objects.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Обработка загрузки Excel файла
  const handleBulkUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      
      const newObjects: RealEstateObject[] = []
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',')
          const objectData: Record<string, string> = {}
          
          headers.forEach((header, index) => {
            objectData[header.trim()] = values[index]?.trim() || ''
          })
          
          if (objectData['Название объекта'] && objectData['Адрес'] && objectData['Цена']) {
            const newObject: RealEstateObject = {
              id: Date.now().toString() + i,
              title: objectData['Название объекта'],
              address: objectData['Адрес'],
              price: objectData['Цена'],
              type: objectData['Тип недвижимости'] || 'apartment',
              country: objectData['Страна'] || 'russia',
              operation: objectData['Тип операции'] || 'sale',
              agent: objectData['Агент'] || 'agent1',
              status: 'draft',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: 'current-user',
              images: [],
              characteristics: {
                area: objectData['Площадь'],
                floor: objectData['Этаж'],
                material: objectData['Материал'],
                buildYear: objectData['Год постройки'],
                rooms: objectData['Количество комнат'],
                bathrooms: objectData['Санузлы'],
                balcony: objectData['Балкон'],
                parking: objectData['Парковка'],
                landArea: objectData['Площадь участка'],
                floors: objectData['Этажность'],
                commercialType: objectData['Тип коммерции'],
                nonCapitalType: objectData['Тип строения'],
                sharesType: objectData['Тип доли']
              },
              description: objectData['Описание'],
              comments: objectData['Комментарии'] ? [{
                id: Date.now().toString() + i,
                text: objectData['Комментарии'],
                author: 'current-user',
                createdAt: new Date().toISOString()
              }] : [],
              history: [{
                id: Date.now().toString() + i,
                action: 'Создан через массовую загрузку',
                author: 'current-user',
                timestamp: new Date().toISOString()
              }]
            }
            
            newObjects.push(newObject)
          }
        }
      }
      
      setObjects(prev => [...newObjects, ...prev])
      setShowBulkUpload(false)
      alert(`Успешно загружено ${newObjects.length} объектов!`)
    }
    
    reader.readAsText(file)
  }

  const handleDuplicateObject = (objectId: string) => {
    const objectToDuplicate = objects.find(obj => obj.id === objectId)
    if (objectToDuplicate) {
      const duplicatedObject: RealEstateObject = {
        ...objectToDuplicate,
        id: Date.now().toString(),
        title: `${objectToDuplicate.title} (копия)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
          {
            id: Date.now().toString(),
            action: 'Создан дубликат',
            author: 'current-user',
            timestamp: new Date().toISOString(),
          },
          ...objectToDuplicate.history,
        ],
      }

      setObjects(prev => [duplicatedObject, ...prev])
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Опубликован'
      case 'draft': return 'Черновик'
      case 'archived': return 'Архив'
      default: return 'Неизвестно'
    }
  }

  const getAgentName = (agentId: string) => {
    const agent = AGENTS.find(a => a.id === agentId)
    return agent ? agent.name : 'Неизвестно'
  }

  const getTypeName = (typeId: string) => {
    const type = PROPERTY_TYPES.find(t => t.id === typeId)
    return type ? type.name : 'Неизвестно'
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Управление объектами</h2>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={downloadExcelTemplate}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Скачать шаблон
          </Button>
          <Button 
            onClick={() => setShowBulkUpload(true)}
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            Массовая загрузка
          </Button>
          <Button 
            onClick={handleCreateObject}
            className="bg-[#fff60b] hover:bg-[#e6d90a] text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить объект
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-black">{objects.length}</div>
                <div className="text-sm text-gray-600">Всего объектов</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-black">{objects.filter(obj => obj.status === 'published').length}</div>
                <div className="text-sm text-gray-600">Опубликовано</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-black">{objects.filter(obj => obj.status === 'draft').length}</div>
                <div className="text-sm text-gray-600">Черновики</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Archive className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-black">{objects.filter(obj => obj.status === 'archived').length}</div>
                <div className="text-sm text-gray-600">В архиве</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Фильтры и поиск */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск объектов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="published">Опубликовано</SelectItem>
                <SelectItem value="draft">Черновики</SelectItem>
                <SelectItem value="archived">Архив</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                {PROPERTY_TYPES.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Все агенты" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все агенты</SelectItem>
                {AGENTS.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex space-x-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as keyof RealEstateObject)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Дата создания</SelectItem>
                  <SelectItem value="updatedAt">Дата обновления</SelectItem>
                  <SelectItem value="title">Название</SelectItem>
                  <SelectItem value="price">Цена</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                variant="outline"
                size="icon"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Список объектов */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Объект</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Агент</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Создан</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObjects.map(obj => (
                <TableRow key={obj.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-black">{obj.title}</div>
                        <div className="text-sm text-gray-600">{obj.address}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{getTypeName(obj.type)}</TableCell>
                  <TableCell className="font-medium text-black">{obj.price}</TableCell>
                  <TableCell className="text-gray-600">{getAgentName(obj.agent)}</TableCell>
                  <TableCell>
                    <Badge variant={obj.status === 'published' ? 'default' : 'secondary'}>
                      {getStatusText(obj.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(obj.createdAt).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        onClick={() => window.open(`/objects/${obj.id}`, '_blank')}
                        variant="ghost"
                        size="icon"
                        title="Просмотр"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDuplicateObject(obj.id)}
                        variant="ghost"
                        size="icon"
                        title="Дублировать"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => {/* Редактирование */}}
                        variant="ghost"
                        size="icon"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => {
                          if (confirm('Вы уверены, что хотите удалить этот объект?')) {
                            setObjects(prev => prev.filter(object => object.id !== obj.id))
                          }
                        }}
                        variant="ghost"
                        size="icon"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Модальное окно массовой загрузки */}
      <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Массовая загрузка объектов</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-black mb-2">Инструкция:</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Скачайте шаблон Excel файла</li>
                  <li>Заполните данные объектов в соответствии с шаблоном</li>
                  <li>Сохраните файл в формате CSV</li>
                  <li>Загрузите файл через форму ниже</li>
                </ol>
              </CardContent>
            </Card>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-black mb-2">
                Перетащите CSV файл сюда или
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleBulkUpload(e.target.files[0])
                  }
                }}
                className="hidden"
                id="bulk-upload-input"
              />
              <label
                htmlFor="bulk-upload-input"
                className="px-4 py-2 bg-[#fff60b] hover:bg-[#e6d90a] text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium cursor-pointer inline-block"
              >
                Выберите файл
              </label>
              <p className="text-sm text-gray-600 mt-2">
                Поддерживаются форматы: CSV, XLSX, XLS
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-gray-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Важно:</h4>
                    <p className="text-sm text-gray-700">
                      Все объекты будут созданы как черновики. После загрузки вы сможете создать задачи для их проверки и публикации.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
