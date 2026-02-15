// src/components/app-sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Lightbulb,
  Rocket,
  Globe,
  Coffee,
  Cpu,
  Settings,
  LogOut,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { NotificationBell } from '@/components/notification-bell';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname?.startsWith(path);

  const handleLogout = async () => {
    await auth.signOut();
    document.cookie = 'session=; path=/; max-age=0';
    router.push('/login');
  };

  // 페이지 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // 로그인 페이지나 공개 페이지에서는 사이드바를 숨깁니다.
  if (['/login', '/', '/about', '/team'].includes(pathname)) return null;

  const sidebarContent = (
    <>
      {/* 로고 영역 */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Rocket className="h-6 w-6" />
          ItWorks
        </Link>
        <div className="flex items-center gap-1">
          <div className="hidden lg:block">
            <NotificationBell />
          </div>
          {/* 모바일 닫기 버튼 */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 메인 메뉴 */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 mb-2 px-2">WORKSPACE</h3>
          <div className="space-y-1">
            <SidebarItem href="/dashboard" icon={LayoutDashboard} label="대시보드" active={isActive('/dashboard')} />
            <SidebarItem href="/ideas" icon={Lightbulb} label="아이디어 보드" active={isActive('/ideas')} />
            <SidebarItem href="/projects" icon={Cpu} label="전체 프로젝트" active={isActive('/projects')} />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-400 mb-2 px-2">BUSINESS UNITS</h3>
          <div className="space-y-1">
            <SidebarItem href="/businesses/heunghan" icon={Globe} label="HeungHan" active={pathname.includes('heunghan')} color="text-green-600" />
            <SidebarItem href="/businesses/substract" icon={Cpu} label="Substract Lab" active={pathname.includes('substract')} color="text-blue-600" />
            <SidebarItem href="/businesses/sensus" icon={Coffee} label="Sensus" active={pathname.includes('sensus')} color="text-orange-600" />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-400 mb-2 px-2">TEAM</h3>
          <div className="space-y-1">
            <SidebarItem href="/profile" icon={Users} label="마이페이지" active={isActive('/profile')} />
            <SidebarItem href="/settings" icon={Settings} label="설정" active={isActive('/settings')} />
          </div>
        </div>
      </div>

      {/* 하단 로그아웃 */}
      <div className="p-4 border-t border-slate-100">
        <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* 모바일 햄버거 버튼 (헤더 바) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between h-14 px-4">
        <div className="flex items-center">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md text-slate-600 hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="ml-2 flex items-center gap-1.5 font-bold text-indigo-600">
            <Rocket className="h-5 w-5" />
            ItWorks
          </Link>
        </div>
        <NotificationBell />
      </div>

      {/* 데스크톱 고정 사이드바 */}
      <div className="hidden lg:flex w-64 h-screen bg-slate-50 border-r border-slate-200 flex-col fixed left-0 top-0 z-50">
        {sidebarContent}
      </div>

      {/* 모바일 오버레이 + 드로어 */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* 드로어 */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

function SidebarItem({ href, icon: Icon, label, active, color }: any) {
  return (
    <Link href={href}>
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start transition-all duration-200",
          active ? "bg-white shadow-sm font-semibold border border-slate-200" : "text-slate-600 hover:bg-slate-100",
          color
        )}
      >
        <Icon className={cn("mr-2 h-4 w-4", color)} />
        {label}
      </Button>
    </Link>
  );
}
