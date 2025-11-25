// Типы для динамической формы

export interface FormRule {
  fieldId: string
  visibleIf?: FieldCondition
  requiredIf?: FieldCondition
  disabledIf?: FieldCondition
}

export interface FieldCondition {
  [fieldName: string]: string | string[] | boolean
}

export interface FormField {
  id: string
  type: 'input' | 'select' | 'multiselect' | 'textarea' | 'calendar' | 'switch' | 'number'
  label: string
  placeholder?: string
  options?: Array<{ id: string; name: string }>
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: string
    custom?: (value: any) => string | null
  }
  dependencies?: string[] // поля, от которых зависит это поле
}

export interface FormConfig {
  fields: FormField[]
  rules: FormRule[]
  sections?: Array<{
    id: string
    title: string
    fields: string[]
    visibleIf?: FieldCondition
  }>
}

export interface FormData {
  [key: string]: any
}

export interface DynamicFormProps {
  config: FormConfig
  initialData?: FormData
  onSubmit: (data: FormData) => void
  onChange?: (data: FormData) => void
  className?: string
}

// Утилиты для работы с правилами
export class FormRuleEngine {
  static isFieldVisible(fieldId: string, formData: FormData, rules: FormRule[]): boolean {
    const rule = rules.find(r => r.fieldId === fieldId)
    if (!rule?.visibleIf) return true
    
    return this.evaluateCondition(rule.visibleIf, formData)
  }

  static isFieldRequired(fieldId: string, formData: FormData, rules: FormRule[]): boolean {
    const rule = rules.find(r => r.fieldId === fieldId)
    if (!rule?.requiredIf) return false
    
    return this.evaluateCondition(rule.requiredIf, formData)
  }

  static isFieldDisabled(fieldId: string, formData: FormData, rules: FormRule[]): boolean {
    const rule = rules.find(r => r.fieldId === fieldId)
    if (!rule?.disabledIf) return false
    
    return this.evaluateCondition(rule.disabledIf, formData)
  }

  static getVisibleFields(formData: FormData, config: FormConfig): string[] {
    return config.fields
      .filter(field => this.isFieldVisible(field.id, formData, config.rules))
      .map(field => field.id)
  }

  static getRequiredFields(formData: FormData, config: FormConfig): string[] {
    return config.fields
      .filter(field => this.isFieldRequired(field.id, formData, config.rules))
      .map(field => field.id)
  }

  private static evaluateCondition(condition: FieldCondition, formData: FormData): boolean {
    return Object.entries(condition).every(([fieldName, expectedValue]) => {
      const actualValue = formData[fieldName]
      
      if (Array.isArray(expectedValue)) {
        return expectedValue.includes(actualValue)
      }
      
      if (typeof expectedValue === 'boolean') {
        return actualValue === expectedValue
      }
      
      return actualValue === expectedValue
    })
  }

  static validateForm(formData: FormData, config: FormConfig): Record<string, string> {
    const errors: Record<string, string> = {}
    const visibleFields = this.getVisibleFields(formData, config)
    const requiredFields = this.getRequiredFields(formData, config)

    // Проверка обязательных полей
    requiredFields.forEach(fieldId => {
      if (visibleFields.includes(fieldId)) {
        const field = config.fields.find(f => f.id === fieldId)
        const value = formData[fieldId]
        
        if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
          errors[fieldId] = `${field?.label || fieldId} обязательно для заполнения`
        }
      }
    })

    // Проверка валидации полей
    config.fields.forEach(field => {
      if (visibleFields.includes(field.id) && field.validation) {
        const value = formData[field.id]
        const validation = field.validation

        if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
          errors[field.id] = `Минимум ${validation.minLength} символов`
        }

        if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
          errors[field.id] = `Максимум ${validation.maxLength} символов`
        }

        if (validation.pattern && typeof value === 'string' && !new RegExp(validation.pattern).test(value)) {
          errors[field.id] = 'Неверный формат'
        }

        if (validation.custom) {
          const customError = validation.custom(value)
          if (customError) {
            errors[field.id] = customError
          }
        }
      }
    })

    return errors
  }
}
