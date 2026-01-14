import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth/constants'

// Глобальные CORS-заголовки и обработка preflight для корректной работы через прокси/iframe
export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)

  // Protect UI routes (simple session check)
  const isPublic =
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/')

  const isProtectedUi =
    pathname === '/email' ||
    pathname.startsWith('/email/') ||
    pathname.startsWith('/admin')

  if (!isPublic && isProtectedUi) {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    if (!token) {
      const redirectUrl = new URL('/auth/signin', request.url)
      redirectUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin',
      }),
    })
  }

  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Vary', 'Origin')

  return response
}
