// middleware.ts (프로젝트 루트)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 공개 라우트 (로그인 불필요)
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/businesses',
  '/businesses/heunghan',
  '/businesses/substract',
  '/businesses/sensus',
  '/team',
  '/login',
];

// 팀 전용 라우트 (로그인 필수)
const PROTECTED_ROUTES = [
  '/dashboard',
  '/ideas',
  '/projects',
  '/profile',
  '/settings',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 정적 파일 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Firebase Auth 세션 체크
  const session = request.cookies.get('session');
  const isAuthenticated = !!session?.value;
  
  // 팀 전용 라우트 접근 시 로그인 필요
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !isAuthenticated) {
    // 로그인 페이지로 리디렉션
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // 이미 로그인했는데 /login 접근 시 대시보드로
  if (pathname === '/login' && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};