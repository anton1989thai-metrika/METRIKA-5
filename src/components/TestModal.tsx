"use client"

import { useState, useEffect } from "react"
import { X, Clock, CheckCircle, AlertCircle, RotateCcw, Flag, TestTube } from "lucide-react"

interface TestModalProps {
  isOpen: boolean
  onClose: () => void
  test: {
    id: number
    title: string
    description: string
    category: string
    questions: number
    timeLimit: number
    attempts: number
    maxAttempts: number
    bestScore: number
    lastScore?: number
    status: string
    isRequired: boolean
  }
}

export default function TestModal({ isOpen, onClose, test }: TestModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(test.timeLimit * 60)
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      id: 1,
      question: "Что такое кадастровая стоимость недвижимости?",
      options: [
        "Рыночная стоимость объекта",
        "Стоимость, определенная государством для налогообложения",
        "Стоимость строительства объекта",
        "Стоимость аренды объекта"
      ],
      correct: 1,
      explanation: "Кадастровая стоимость - это стоимость недвижимости, определенная государством для целей налогообложения."
    },
    {
      id: 2,
      question: "Какой документ подтверждает право собственности на недвижимость?",
      options: [
        "Договор купли-продажи",
        "Свидетельство о государственной регистрации права",
        "Технический паспорт",
        "Кадастровый паспорт"
      ],
      correct: 1,
      explanation: "Свидетельство о государственной регистрации права - основной документ, подтверждающий право собственности."
    },
    {
      id: 3,
      question: "Что такое эскроу-счет?",
      options: [
        "Счет для оплаты коммунальных услуг",
        "Счет для хранения денег до завершения сделки",
        "Счет для получения ипотечного кредита",
        "Счет для уплаты налогов"
      ],
      correct: 1,
      explanation: "Эскроу-счет используется для безопасного хранения денег до завершения сделки с недвижимостью."
    }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStarted && timeLeft > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && !isCompleted) {
      handleSubmit()
    }
    return () => clearInterval(interval)
  }, [isStarted, timeLeft, isCompleted])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    let correctAnswers = 0
    questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctAnswers++
      }
    })
    const calculatedScore = Math.round((correctAnswers / questions.length) * 100)
    setScore(calculatedScore)
    setIsCompleted(true)
    setShowResults(true)
  }

  const handleStart = () => {
    setIsStarted(true)
    setTimeLeft(test.timeLimit * 60)
  }

  const handleRestart = () => {
    setIsStarted(false)
    setIsCompleted(false)
    setShowResults(false)
    setCurrentQuestion(0)
    setAnswers({})
    setScore(0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      case 'not-taken': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'passed': return 'Пройден'
      case 'failed': return 'Не пройден'
      case 'in-progress': return 'В процессе'
      case 'not-taken': return 'Не пройден'
      default: return 'Неизвестно'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <TestTube className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-2xl font-bold text-black">{test.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!isStarted && !showResults && (
            <div className="space-y-6">
              {/* Информация о тесте */}
              <div className="bg-white shadow-sm rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-black mb-2">Информация о тесте</h3>
                <p className="text-gray-600 mb-4">{test.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">{test.questions}</div>
                    <div className="text-sm text-gray-600">Вопросов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">{test.timeLimit}</div>
                    <div className="text-sm text-gray-600">Минут</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">{test.attempts}/{test.maxAttempts}</div>
                    <div className="text-sm text-gray-600">Попыток</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">{test.bestScore || 0}</div>
                    <div className="text-sm text-gray-600">Лучший результат</div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(test.status)}`}>
                    {getStatusText(test.status)}
                  </span>
                  {test.isRequired && (
                    <span className="ml-2 px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                      Обязательный
                    </span>
                  )}
                </div>
              </div>

              {/* Правила */}
              <div className="bg-white shadow-sm rounded-lg p-4 shadow-lg">
                <h4 className="font-semibold text-black mb-2">Правила прохождения теста</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Время на прохождение теста ограничено</li>
                  <li>• Можно вернуться к предыдущим вопросам</li>
                  <li>• Для прохождения необходимо набрать минимум 70 баллов</li>
                  <li>• Количество попыток ограничено</li>
                </ul>
              </div>

              {/* Кнопка начала */}
              <div className="text-center">
                <button
                  onClick={handleStart}
                  className="px-8 py-3 bg-white shadow-sm text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium text-lg"
                  style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}>
                  Начать тест
                </button>
              </div>
            </div>
          )}

          {isStarted && !showResults && (
            <div className="space-y-6">
              {/* Прогресс и время */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm text-gray-600 mr-4">
                    Вопрос {currentQuestion + 1} из {questions.length}
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-black h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center text-lg font-medium">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  <span className={timeLeft < 300 ? 'text-red-500' : 'text-black'}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Вопрос */}
              <div className="bg-white shadow-sm rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-black mb-4">
                  {questions[currentQuestion].question}
                </h3>
                
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[questions[currentQuestion].id] === index
                          ? 'border-gray-300 bg-gray-100'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questions[currentQuestion].id}`}
                        checked={answers[questions[currentQuestion].id] === index}
                        onChange={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                        className="mr-3"
                      />
                      <span className="text-black">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Навигация */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 bg-white shadow-sm text-black rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Предыдущий
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowResults(true)}
                    className="px-4 py-2 bg-white shadow-sm text-black rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    <Flag className="w-4 h-4 mr-2 inline text-gray-600" />
                    Завершить досрочно
                  </button>
                  
                  {currentQuestion === questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-white shadow-sm text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                      style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}>
                      Завершить тест
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 bg-white shadow-sm text-black rounded-full shadow-lg hover:shadow-xl transition-all"
                      style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}>
                      Следующий
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {showResults && (
            <div className="space-y-6">
              {/* Результаты */}
              <div className={`rounded-lg p-6 text-center shadow-lg border-2 ${
                score >= 70 ? 'bg-white shadow-sm' : 'bg-white shadow-sm'
              }`}>
                <div className={`text-6xl mb-4 ${
                  score >= 70 ? 'text-gray-600' : 'text-gray-600'
                }`}>
                  {score >= 70 ? '🎉' : '😞'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  score >= 70 ? 'text-black' : 'text-black'
                }`}>
                  {score >= 70 ? 'Поздравляем!' : 'Попробуйте еще раз'}
                </h3>
                <div className={`text-4xl font-bold mb-2 ${
                  score >= 70 ? 'text-black' : 'text-black'
                }`}>
                  {score}/100
                </div>
                <p className={`text-lg ${
                  score >= 70 ? 'text-gray-600' : 'text-gray-600'
                }`}>
                  {score >= 70 ? 'Тест пройден успешно!' : 'Необходимо набрать минимум 70 баллов'}
                </p>
              </div>

              {/* Детали результатов */}
              <div className="bg-white shadow-sm rounded-lg p-6 shadow-lg">
                <h4 className="font-semibold text-black mb-4">Детали результатов</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">{score}</div>
                    <div className="text-sm text-gray-600">Баллов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {Object.keys(answers).length}
                    </div>
                    <div className="text-sm text-gray-600">Отвечено</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {questions.length - Object.keys(answers).length}
                    </div>
                    <div className="text-sm text-gray-600">Пропущено</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {Math.round((test.timeLimit * 60 - timeLeft) / 60)}м
                    </div>
                    <div className="text-sm text-gray-600">Потрачено времени</div>
                  </div>
                </div>
              </div>

              {/* Правильные ответы */}
              <div className="bg-white shadow-sm rounded-lg p-6 shadow-lg">
                <h4 className="font-semibold text-black mb-4">Правильные ответы</h4>
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="bg-white border border-gray-300 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-black">
                          Вопрос {index + 1}: {question.question}
                        </h5>
                        <div className="flex items-center">
                          {answers[question.id] === question.correct ? (
                            <CheckCircle className="w-5 h-5 text-gray-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Правильный ответ: {question.options[question.correct]}
                      </div>
                      <div className="text-sm text-gray-600">
                        {question.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Действия */}
              <div className="flex justify-center gap-4">
                {score < 70 && test.attempts < test.maxAttempts && (
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 bg-white shadow-sm text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                    style={{ backgroundColor: '#fff60b', '--hover-color': '#e6d90a' } as React.CSSProperties}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6d90a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff60b'}>
                    <RotateCcw className="w-4 h-4 mr-2 inline text-gray-600" />
                    Попробовать снова
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white shadow-sm text-black rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                >
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
