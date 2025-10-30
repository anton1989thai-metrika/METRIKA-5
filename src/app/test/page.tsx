"use client"

import { useState } from "react"

export default function TestPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<{ title?: string }>({})

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { title?: string } = {}
    if (!title.trim()) {
      newErrors.title = "Укажите заголовок"
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // Здесь могла быть интеграция с задачами; для теста просто закрываем модалку
    setIsOpen(false)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-black text-white px-4 py-2"
      >
        Открыть узкое модальное окно
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-full max-w-sm">{/* узкая модалка */}
            <div className="rounded-lg bg-white shadow-xl">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-base font-semibold">Создание задачи (тест)</h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-2 py-1 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Название</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full rounded-md border px-3 py-2 text-sm ${errors.title ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Например: Подготовить отчёт"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Описание</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[80px]"
                    placeholder="Краткие детали задачи"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      resetForm()
                    }}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-black text-white px-4 py-2 text-sm"
                  >
                    Создать
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
