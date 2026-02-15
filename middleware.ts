import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = [
  '/', '/about', '/businesses', '/businesses/heunghan', 
  '/businesses/substract', '/businesses/sensus', '/team', '/login',
];

const PROTECTED_ROUTES = [
  '/dashboard', '/ideas', '/projects', '/profile', '/settings',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  const session = request.cookies.get('session');
  const isAuthenticated = !!session?.value;
  
  // 보호된 라우트 접근 시 로그인 필요
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // 이미 로그인했는데 로그인 페이지 접근 시
  if (pathname === '/login' && isAuthenticated) {
    // redirect 파라미터가 있으면 거기로, 없으면 대시보드로 이동
    const redirectTarget = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    const url = request.nextUrl.clone();
    url.pathname = redirectTarget;
    url.searchParams.delete('redirect');
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};