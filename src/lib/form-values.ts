export function toInputValue(
  value: unknown
): string | number | readonly string[] | undefined {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (Array.isArray(value)) {
    return value.map((item) => String(item))
  }
  return ''
}

export function toStringValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

export function toDateArray(value: unknown): Date[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is Date => item instanceof Date)
}

export function hasOtherValue(value: unknown): boolean {
  if (typeof value === 'string') return value === 'other'
  if (Array.isArray(value)) {
    return value.some((item) => String(item) === 'other')
  }
  return false
}
