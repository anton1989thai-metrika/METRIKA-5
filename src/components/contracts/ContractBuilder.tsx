'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save, Printer, X, Edit2 } from 'lucide-react'
import TemplateSelector from './TemplateSelector'
import FieldForm from './FieldForm'
import type { ContractTemplate } from '@/types/contracts'
import { fetchJson, fetchJsonOrNull } from '@/lib/api-client'

export default function ContractBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [editedTemplate, setEditedTemplate] = useState<string>('')
  const [isEditingTemplate, setIsEditingTemplate] = useState(false)
  const [contractNumber, setContractNumber] = useState('')
  const [contractCity, setContractCity] = useState('Москва')
  const [saving, setSaving] = useState(false)
  const [createdBy, setCreatedBy] = useState('')

  useEffect(() => {
        const fetchUser = async () => {
      try {
        const data = await fetchJsonOrNull<{ name?: string; email?: string }>('/api/user')
        if (!data) return
        const displayName = data?.name || data?.email
        if (displayName) setCreatedBy(displayName)
      } catch {
        // ignore user lookup errors
      }
    }
    fetchUser()
  }, [])

  const handleTemplateSelect = (template: ContractTemplate) => {
    setSelectedTemplate(template)
    setEditedTemplate(template.template)
    setFormValues({})
    setIsEditingTemplate(false)
  }

  const handleFillTemplate = () => {
    if (!selectedTemplate) return
    
    let filled = editedTemplate
    // Заменить плейсхолдеры на значения из формы
    Object.entries(formValues).forEach(([key, value]) => {
      filled = filled.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value))
    })
    
    // Заменить общие поля
    filled = filled.replace(/{contractNumber}/g, contractNumber)
    filled = filled.replace(/{contractCity}/g, contractCity)
    
    return filled
  }

  const handleSave = async () => {
    if (!selectedTemplate) return
    if (!contractNumber) {
      alert('Введите номер договора')
      return
    }

    setSaving(true)
    try {
      const filledTemplate = handleFillTemplate()
      
      await fetchJson('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateType: selectedTemplate.name,
          templateText: filledTemplate,
          values: formValues,
          contractNumber,
          contractCity,
          createdBy: createdBy || 'Unknown user'
        })
      })

      alert('Договор сохранен!')
      // Сброс формы
      setSelectedTemplate(null)
      setFormValues({})
      setContractNumber('')
      setEditedTemplate('')
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      alert('Ошибка сохранения договора')
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = () => {
    if (!selectedTemplate) return
    const filledTemplate = handleFillTemplate()
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Договор ${contractNumber}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; white-space: pre-wrap;">${filledTemplate}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (!selectedTemplate) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <TemplateSelector onSelect={handleTemplateSelect} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedTemplate.name}</h3>
              <p className="text-sm text-gray-600">{selectedTemplate.category}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditingTemplate(!isEditingTemplate)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            {isEditingTemplate ? 'Выйти из редактирования' : 'Внести изменения в шаблон'}
          </button>
        </div>

        {/* Номер и город */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="contractNumber" className="text-gray-700">
              Номер договора <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contractNumber"
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              placeholder="Введите номер договора"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="contractCity" className="text-gray-700">
              Город
            </Label>
            <Input
              id="contractCity"
              value={contractCity}
              onChange={(e) => setContractCity(e.target.value)}
              placeholder="Москва"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Форма с полями */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <FieldForm
          fields={selectedTemplate.fields}
          onValuesChange={setFormValues}
          initialValues={formValues}
        />
      </div>

      {/* Редактирование шаблона (опционально) */}
      {isEditingTemplate && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <Label htmlFor="templateEdit" className="text-gray-700 mb-2 block">
            Редактировать текст шаблона
          </Label>
          <Textarea
            id="templateEdit"
            value={editedTemplate}
            onChange={(e) => setEditedTemplate(e.target.value)}
            rows={15}
            className="w-full font-mono text-sm"
          />
        </div>
      )}

      {/* Предпросмотр */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Предпросмотр</h3>
        <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 whitespace-pre-wrap font-serif text-sm">
          {handleFillTemplate()}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-end gap-4">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Печать
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
            style={{ backgroundColor: '#fff60b' }}
          >
            <Save className="w-4 h-4" />
            Сохранить договор
          </Button>
        </div>
      </div>
    </div>
  )
}
