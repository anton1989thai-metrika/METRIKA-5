'use client'

import { useEffect, useState } from 'react'
import type { ContractTemplate } from '@/types/contracts'
import { fetchJson } from '@/lib/api-client'

interface TemplateSelectorProps {
  onSelect: (template: ContractTemplate) => void
  selectedTemplate?: ContractTemplate
}

export default function TemplateSelector({ onSelect, selectedTemplate }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<ContractTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const data = await fetchJson<ContractTemplate[]>('/api/templates')
      const list = Array.isArray(data) ? data : []
      const normalized = list.map((template) => ({
        ...template,
        template: template.template || ''
      }))
      setTemplates(normalized)
    } catch (error) {
      console.error('Ошибка загрузки шаблонов:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Загрузка шаблонов...</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите шаблон договора</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`p-6 bg-white border-2 rounded-lg shadow-sm hover:shadow-md transition-all text-left ${
              selectedTemplate?.id === template.id
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-900 mb-1">{template.name}</div>
            <div className="text-sm text-gray-600 mb-3">{template.category}</div>
            <div className="text-sm text-gray-500">
              {template.fields.length} полей
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
