import { NextRequest, NextResponse } from 'next/server'

// Авторизация отключена - все страницы доступны всем пользователям
export async function middleware(request: NextRequest) {
  // Просто пропускаем все запросы без проверки авторизации
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - any Next.js internals (_next/* including webpack-hmr, static, image, data)
     * - favicon and common static assets
     */
    '/((?!api|_next/.*|favicon.ico|.*\\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|json|woff2?|ttf)$).*)',
  ],
}
