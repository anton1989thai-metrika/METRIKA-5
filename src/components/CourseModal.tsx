"use client"

import { useState } from "react"
import { X, Play, FileText, TestTube, Clock, Users, Star, User, Calendar, Bookmark, Share2, Download, Eye, CheckCircle, BookOpen } from "lucide-react"

interface CourseModalProps {
  isOpen: boolean
  onClose: () => void
  course: {
    id: number
    title: string
    description: string
    category: string
    level: string
    duration: number
    progress: number
    status: string
    rating: number
    students: number
    materials: {
      videos: number
      documents: number
      tests: number
    }
    instructor: string
    deadline?: string
    isRequired: boolean
    tags: string[]
  }
}

export default function CourseModal({ isOpen, onClose, course }: CourseModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const videos = [
    { id: 1, title: "Введение в курс", duration: "15:30", completed: true },
    { id: 2, title: "Основные понятия", duration: "22:45", completed: true },
    { id: 3, title: "Практические примеры", duration: "18:20", completed: false },
    { id: 4, title: "Заключение", duration: "12:10", completed: false }
  ]

  const documents = [
    { id: 1, title: "Методическое пособие", type: "PDF", size: "2.3 MB", downloaded: true },
    { id: 2, title: "Шаблоны документов", type: "DOCX", size: "1.8 MB", downloaded: false },
    { id: 3, title: "Справочник терминов", type: "PDF", size: "0.9 MB", downloaded: false }
  ]

  const tests = [
    { id: 1, title: "Тест по основам", questions: 15, timeLimit: 20, completed: true, score: 85 },
    { id: 2, title: "Практическое задание", questions: 10, timeLimit: 30, completed: false, score: null },
    { id: 3, title: "Финальный экзамен", questions: 25, timeLimit: 45, completed: false, score: null }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-gray-600 bg-gray-100'
      case 'in-progress': return 'text-gray-600 bg-gray-100'
      case 'not-started': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершен'
      case 'in-progress': return 'В процессе'
      case 'not-started': return 'Не начат'
      default: return 'Неизвестно'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Новичок'
      case 'intermediate': return 'Средний'
      case 'advanced': return 'Продвинутый'
      case 'expert': return 'Эксперт'
      default: return 'Неизвестно'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-gray-600 bg-gray-100'
      case 'intermediate': return 'text-gray-600 bg-gray-100'
      case 'advanced': return 'text-gray-600 bg-gray-100'
      case 'expert': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white border border-gray-300 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-2xl font-bold text-black">{course.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Информация о курсе */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-black mb-4">{course.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-gray-600" />
                    {course.duration} мин
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-600" />
                    {course.students} студентов
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-gray-600" />
                    {course.rating}
                  </span>
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1 text-gray-600" />
                    {course.instructor}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(course.status)}`}>
                  {getStatusText(course.status)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                  {getLevelText(course.level)}
                </span>
                {course.isRequired && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    Обязательный
                  </span>
                )}
              </div>
            </div>

            {/* Прогресс */}
            {course.status !== 'not-started' && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Прогресс</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-black h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Дедлайн */}
            {course.deadline && (
              <div className="mb-4 p-3 bg-white shadow-sm border border-gray-300 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm text-black">
                    Дедлайн: {course.deadline}
                  </span>
                </div>
              </div>
            )}

            {/* Теги */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {course.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white shadow-sm border border-gray-300 text-black text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Навигация по вкладкам */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-white shadow-sm border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'overview' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                Обзор
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'videos' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                Видео ({course.materials.videos})
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'documents' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                Документы ({course.materials.documents})
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'tests' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                Тесты ({course.materials.tests})
              </button>
            </div>
          </div>

          {/* Контент вкладок */}
          <div className="min-h-96">
            {/* Обзор */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center mb-2">
                      <Play className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="font-medium text-black">Видео-уроки</span>
                    </div>
                    <div className="text-2xl font-bold text-black">{course.materials.videos}</div>
                    <div className="text-sm text-gray-600">уроков</div>
                  </div>
                  
                  <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center mb-2">
                      <FileText className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="font-medium text-black">Документы</span>
                    </div>
                    <div className="text-2xl font-bold text-black">{course.materials.documents}</div>
                    <div className="text-sm text-gray-600">материалов</div>
                  </div>
                  
                  <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center mb-2">
                      <TestTube className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="font-medium text-black">Тесты</span>
                    </div>
                    <div className="text-2xl font-bold text-black">{course.materials.tests}</div>
                    <div className="text-sm text-gray-600">заданий</div>
                  </div>
                </div>

                <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-4 shadow-lg">
                  <h3 className="font-semibold text-black mb-2">Описание курса</h3>
                  <p className="text-gray-600">{course.description}</p>
                </div>

                <div className="bg-white shadow-sm border border-gray-300 rounded-lg p-4 shadow-lg">
                  <h3 className="font-semibold text-black mb-2">Что вы изучите</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-gray-600 mr-2" />
                      Основные понятия и терминология
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-gray-600 mr-2" />
                      Практические навыки работы
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-gray-600 mr-2" />
                      Решение типовых задач
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-gray-600 mr-2" />
                      Лучшие практики и рекомендации
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Видео */}
            {activeTab === 'videos' && (
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-4 bg-white shadow-sm border border-gray-300 rounded-lg shadow-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white shadow-sm border border-gray-300 rounded-lg mr-4 flex items-center justify-center">
                        <Play className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-black">{video.title}</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1 text-gray-600" />
                          {video.duration}
                          {video.completed && (
                            <>
                              <span className="mx-2">•</span>
                              <CheckCircle className="w-4 h-4 text-gray-600 mr-1" />
                              <span className="text-gray-600">Просмотрено</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white shadow-sm border border-gray-300 text-black rounded-full shadow-lg hover:shadow-xl transition-all">
                      Смотреть
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Документы */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-white shadow-sm border border-gray-300 rounded-lg shadow-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white shadow-sm border border-gray-300 rounded-lg mr-4 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-black">{doc.title}</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <span>{doc.type}</span>
                          <span className="mx-2">•</span>
                          <span>{doc.size}</span>
                          {doc.downloaded && (
                            <>
                              <span className="mx-2">•</span>
                              <CheckCircle className="w-4 h-4 text-gray-600 mr-1" />
                              <span className="text-gray-600">Скачано</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-white shadow-sm border border-gray-300 text-black rounded-full shadow-lg hover:shadow-xl transition-all">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="px-3 py-1 bg-white shadow-sm border border-gray-300 text-black rounded-full shadow-lg hover:shadow-xl transition-all">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Тесты */}
            {activeTab === 'tests' && (
              <div className="space-y-4">
                {tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 bg-white shadow-sm border border-gray-300 rounded-lg shadow-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white shadow-sm border border-gray-300 rounded-lg mr-4 flex items-center justify-center">
                        <TestTube className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-black">{test.title}</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <span>{test.questions} вопросов</span>
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-1 text-gray-600" />
                          {test.timeLimit} мин
                          {test.completed && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="text-gray-600 font-medium">{test.score}/100</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all font-medium ${
                      test.completed 
                        ? 'bg-white shadow-sm border border-gray-300 text-black' 
                        : 'bg-white shadow-sm border border-gray-300 text-black'
                    }`}
                    style={!test.completed ? { backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties : {}}
                    onMouseEnter={!test.completed ? (e) => e.currentTarget.style.backgroundColor = '#e6d90a' : undefined}
                    onMouseLeave={!test.completed ? (e) => e.currentTarget.style.backgroundColor = '#fff60b' : undefined}>
                      {test.completed ? 'Повторить' : 'Начать тест'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Действия */}
          <div className="mt-6 flex gap-3">
            {course.status === 'not-started' ? (
              <button className="px-6 py-3 bg-white shadow-sm border border-gray-300 text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                      style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}>
                Начать обучение
              </button>
            ) : course.status === 'in-progress' ? (
              <button className="px-6 py-3 bg-white shadow-sm border border-gray-300 text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                      style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}>
                Продолжить обучение
              </button>
            ) : (
              <button className="px-6 py-3 bg-white shadow-sm border border-gray-300 text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium">
                Повторить курс
              </button>
            )}
            <button className="px-4 py-3 bg-white shadow-sm border border-gray-300 text-black rounded-full shadow-lg hover:shadow-xl transition-all">
              <Bookmark className="w-4 h-4 mr-2 inline text-gray-600" />
              В закладки
            </button>
            <button className="px-4 py-3 bg-white shadow-sm border border-gray-300 text-black rounded-full shadow-lg hover:shadow-xl transition-all">
              <Share2 className="w-4 h-4 mr-2 inline text-gray-600" />
              Поделиться
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
