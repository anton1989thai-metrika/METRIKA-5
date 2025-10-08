"use client"

import { useState } from "react"
import { X, FileText, Download, Eye, File, Image, FileSpreadsheet } from "lucide-react"

interface DocumentationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DocumentationModal({ isOpen, onClose }: DocumentationModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const documents = [
    {
      id: 1,
      name: "Договор купли-продажи",
      type: "pdf",
      size: "2.3 MB",
      category: "contracts",
      date: "2024-01-15"
    },
    {
      id: 2,
      name: "Технический паспорт",
      type: "pdf",
      size: "1.8 MB",
      category: "technical",
      date: "2024-01-10"
    },
    {
      id: 3,
      name: "Справка об отсутствии задолженности",
      type: "pdf",
      size: "0.5 MB",
      category: "certificates",
      date: "2024-01-20"
    },
    {
      id: 4,
      name: "План квартиры",
      type: "jpg",
      size: "1.2 MB",
      category: "plans",
      date: "2024-01-05"
    },
    {
      id: 5,
      name: "Справка о кадастровой стоимости",
      type: "pdf",
      size: "0.8 MB",
      category: "certificates",
      date: "2024-01-18"
    },
    {
      id: 6,
      name: "Акт приема-передачи",
      type: "pdf",
      size: "1.1 MB",
      category: "contracts",
      date: "2024-01-12"
    },
    {
      id: 7,
      name: "Схема расположения",
      type: "jpg",
      size: "0.9 MB",
      category: "plans",
      date: "2024-01-08"
    },
    {
      id: 8,
      name: "Экспликация помещений",
      type: "xlsx",
      size: "0.3 MB",
      category: "technical",
      date: "2024-01-14"
    }
  ]

  const categories = [
    { id: "all", name: "Все документы" },
    { id: "contracts", name: "Договоры" },
    { id: "technical", name: "Техническая документация" },
    { id: "certificates", name: "Справки и сертификаты" },
    { id: "plans", name: "Планы и схемы" }
  ]

  const filteredDocuments = selectedCategory === "all" 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory)

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <Image className="w-6 h-6 text-green-500" />
      case "xlsx":
      case "xls":
        return <FileSpreadsheet className="w-6 h-6 text-green-600" />
      default:
        return <File className="w-6 h-6 text-gray-500" />
    }
  }

  const handleDownload = (document: any) => {
    // Имитация скачивания
    alert(`Скачивание файла: ${document.name}`)
  }

  const handlePreview = (document: any) => {
    // Имитация предварительного просмотра
    alert(`Предварительный просмотр: ${document.name}`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden border-2 border-black">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Документация объекта</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Фильтры по категориям */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Список документов */}
          <div className="space-y-3">
            {filteredDocuments.map(document => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getFileIcon(document.type)}
                  <div>
                    <h3 className="font-medium text-gray-900">{document.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{document.size}</span>
                      <span>{document.date}</span>
                      <span className="capitalize">{document.type.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePreview(document)}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Просмотр
                  </button>
                  <button
                    onClick={() => handleDownload(document)}
                    className="flex items-center px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Скачать
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Статистика */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
              <div className="text-sm text-blue-800">Всего документов</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.type === 'pdf').length}
              </div>
              <div className="text-sm text-green-800">PDF файлов</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {documents.filter(d => d.type === 'jpg').length}
              </div>
              <div className="text-sm text-purple-800">Изображений</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {documents.filter(d => d.type === 'xlsx').length}
              </div>
              <div className="text-sm text-orange-800">Таблиц</div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Важная информация</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Все документы предоставлены продавцом</p>
              <p>• Рекомендуется проверить актуальность справок</p>
              <p>• При возникновении вопросов обращайтесь к агенту</p>
              <p>• Документы можно скачать пакетом</p>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="mt-6 flex space-x-3">
            <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Скачать все документы
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Запросить дополнительные документы
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
