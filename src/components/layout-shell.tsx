'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Toaster } from 'react-hot-toast';
import { AppSidebar } from '@/components/app-sidebar';
import { CommandPalette } from '@/components/command-palette';
import { useEffect } from 'react';

const PUBLIC_PATHS = ['/login', '/', '/about', '/team', '/businesses', '/home'];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
}

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const pub = isPublic(pathname);

  // 비로그인 상태에서 보호 페이지 접근 시 로그인으로 리다이렉트
  useEffect(() => {
    if (!loading && !user && !pub) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, pub, pathname, router]);

  // 로딩 중이면서 보호 페이지면 빈 화면 (깜빡임 방지)
  if (loading && !pub) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400">로딩 중...</div>
        <Toaster position="top-right" />
      </div>
    );
  }

  // 비로그인 + 보호 페이지면 렌더링하지 않음
  if (!user && !pub) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400">로그인 페이지로 이동 중...</div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
        <AppSidebar />
        <main
          className={`flex-1 min-w-0 transition-all duration-300 overflow-x-hidden ${
            !pub ? 'pt-14 lg:pt-0 lg:ml-64' : ''
          }`}
        >
          {children}
        </main>
      </div>
      {!pub && <CommandPalette />}
      <Toaster position="top-right" />
    </>
  );
}
