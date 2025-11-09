import { NextRequest, NextResponse } from 'next/server'

// Глобальные CORS-заголовки и обработка preflight для корректной работы через прокси/iframe и Plasmic
export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || '*'
  
  // Разрешаем запросы от Plasmic
  const isPlasmicRequest = origin.includes('plasmic.app') || 
                          origin.includes('plasmic.run') ||
                          request.headers.get('user-agent')?.includes('Plasmic')

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: new Headers({
        'Access-Control-Allow-Origin': isPlasmicRequest ? origin : '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin',
      }),
    })
  }

  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', isPlasmicRequest ? origin : '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Vary', 'Origin')

  return response
}
