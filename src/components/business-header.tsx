'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, Rocket, Globe, Lightbulb, Coffee, ArrowLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusinessHeaderProps {
  currentId: 'heunghan' | 'substract' | 'sensus' | 'itworks';
}

const BUSINESSES = [
  { id: 'itworks', name: 'ItWorks', icon: Rocket, color: 'text-[#97a82b]', href: '/businesses/itworks' },
  { id: 'heunghan', name: 'HeungHan', icon: Globe, color: 'text-green-600', href: '/businesses/heunghan' },
  { id: 'substract', name: 'Substract Lab', icon: Lightbulb, color: 'text-blue-600', href: '/businesses/substract' },
  { id: 'sensus', name: 'Sensus', icon: Coffee, color: 'text-orange-600', href: '/businesses/sensus' },

];

export function BusinessHeader({ currentId }: BusinessHeaderProps) {
  const current = BUSINESSES.find(b => b.id === currentId) || BUSINESSES[0];

  return (
    <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-sm z-50 transition-all">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          {/* 홈으로 가기 버튼 (모바일에서는 아이콘만) */}
          <Button variant="ghost" size="sm" asChild className="shrink-0 px-2 sm:px-4">
            <Link href="/businesses" className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">목록</span>
            </Link>
          </Button>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {/* 사업부 전환 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-bold text-lg px-2 hover:bg-slate-100 gap-2">
                <current.icon className={cn("h-5 w-5", current.color)} />
                <span>{current.name}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {BUSINESSES.map((biz) => (
                <DropdownMenuItem key={biz.id} asChild>
                  <Link href={biz.href} className="flex items-center gap-3 py-2.5 cursor-pointer">
                    <div className={cn("p-1.5 rounded-md bg-slate-50", biz.id === currentId && "bg-slate-100")}>
                      <biz.icon className={cn("h-4 w-4", biz.color)} />
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-sm font-medium", biz.id === currentId ? "text-slate-900" : "text-slate-600")}>
                        {biz.name}
                      </p>
                    </div>
                    {biz.id === currentId && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 로그인 버튼 (ItWorks인 경우 시그니처 컬러 적용) */}
        <Button 
          asChild 
          className={cn(
            currentId === 'itworks' 
              ? "bg-[#CBDD61] hover:bg-[#b8ca50] text-slate-900 font-semibold" 
              : "bg-indigo-600 hover:bg-indigo-700"
          )}
        >
          <Link href="/login">팀 로그인</Link>
        </Button>
      </div>
    </nav>
  );
}