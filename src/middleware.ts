import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return Response.redirect(url)
  }

  if (session && request.nextUrl.pathname === ('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return Response.redirect(url)
  }
}
 
export const config = {
  matcher: ['/admin/:path*', '/login'],
}
