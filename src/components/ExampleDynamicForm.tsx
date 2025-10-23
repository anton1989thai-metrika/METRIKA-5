// Пример использования DynamicForm
import { DynamicForm } from '@/components/DynamicForm'
import { FormConfig } from '@/config/form-rules'
import formRulesConfig from '@/config/form-rules.json'

// Конвертируем JSON в типизированный объект
const config: FormConfig = formRulesConfig as FormConfig

// Пример использования в компоненте
export function ExampleDynamicForm() {
  const handleSubmit = (data: any) => {
    console.log('Отправленные данные:', data)
    // Здесь можно отправить данные на сервер
  }

  const handleChange = (data: any) => {
    console.log('Изменения в форме:', data)
    // Здесь можно обработать изменения в реальном времени
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Динамическая форма недвижимости</h1>
      
      <DynamicForm
        config={config}
        initialData={{
          country: 'russia',
          operation: 'rent',
          type: 'apartment'
        }}
        onSubmit={handleSubmit}
        onChange={handleChange}
        className="bg-white p-6 rounded-lg shadow-md"
      />
    </div>
  )
}
