import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Публичные маршруты, которые доступны всем
const publicRoutes = [
  '/',
  '/objects',
  '/map', 
  '/about',
  '/contacts',
  '/blog',
  '/auth/signin',
  '/api/auth'
]

// Маршруты, требующие авторизации
const protectedRoutes = [
  '/profile',
  '/my-objects',
  '/email',
  '/academy',
  '/knowledge-base',
  '/tasks',
  '/admin'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Пропускаем публичные маршруты
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Проверяем только защищенные маршруты
  if (!protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  try {
    // Получаем токен пользователя
    const token = await getToken({ req: request })
    
    if (!token) {
      // Перенаправляем на страницу входа если пользователь не авторизован
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    
    // Для middleware мы не можем проверить детальные разрешения,
    // так как это требует доступа к файловой системе
    // Поэтому просто проверяем наличие токена
    return NextResponse.next()
    
  } catch (error) {
    console.error('Ошибка middleware:', error)
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
