import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Список поддерживаемых языков
export const locales = ['ru', 'en', 'th', 'zh', 'ko', 'ja', 'uz', 'tg', 'kk', 'hi'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // Проверяем, что язык поддерживается
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
