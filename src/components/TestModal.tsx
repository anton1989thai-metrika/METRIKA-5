"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Test {
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
  status: 'not-taken' | 'in-progress' | 'passed' | 'failed'
  isRequired: boolean
}

interface TestModalProps {
  isOpen: boolean
  onClose: () => void
  test: Test | null
}

export default function TestModal({ isOpen, onClose, test }: TestModalProps) {
  if (!test) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{test.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">{test.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Вопросов:</span>
              <span className="ml-2 font-medium">{test.questions}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Время:</span>
              <span className="ml-2 font-medium">{test.timeLimit} мин</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Попытки:</span>
              <span className="ml-2 font-medium">{test.attempts}/{test.maxAttempts}</span>
            </div>
            {test.bestScore > 0 && (
              <div>
                <span className="text-sm text-gray-600">Лучший результат:</span>
                <span className="ml-2 font-medium">{test.bestScore}/100</span>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Закрыть
            </Button>
            <Button onClick={onClose}>
              Начать тест
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

