import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'

export default createMiddleware({
  // Список поддерживаемых языков
  locales,
  
  // Язык по умолчанию
  defaultLocale: 'ru',
  
  // Автоматическое определение языка
  localeDetection: true
})

export const config = {
  // Применяем middleware ко всем маршрутам кроме статических файлов
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
