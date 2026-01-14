'use client'

import { debugLog } from '@/lib/logger'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Eye, Download, Trash2 } from 'lucide-react'
import { fetchJson } from '@/lib/api-client'

interface Contract {
  id: string
  templateType: string
  contractNumber: string
  createdBy: string
  createdAt: string
  filePathPDF?: string
  filePathDOCX?: string
}

export default function ContractList() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      const data = await fetchJson<Contract[]>('/api/contracts')
      setContracts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Ошибка загрузки договоров:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить договор?')) return
    
    try {
      await fetchJson('/api/contracts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      debugLog('Удаление договора:', id)
      setContracts((prev) => prev.filter((contract) => contract.id !== id))
    } catch (error) {
      console.error('Ошибка удаления:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">№</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Тип договора</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Номер</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Создал</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Дата</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contracts.length === 0 && (
                <tr key="empty-row">
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Договоры не найдены
                  </td>
                </tr>
              )}
              {contracts.map((contract, index) => (
                <tr key={`contract-${contract.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{contract.templateType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{contract.contractNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{contract.createdBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {format(new Date(contract.createdAt), 'dd.MM.yyyy', { locale: ru })}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Просмотр"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Скачать"
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(contract.id)}
                        className="p-2 hover:bg-red-50 rounded transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
