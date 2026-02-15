// src/components/command-palette.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Lightbulb, Cpu, Globe, Coffee,
  Settings, Users, Search, ArrowRight, Plus,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const go = useCallback((path: string) => {
    router.push(path);
    setOpen(false);
  }, [router]);

  const commands: CommandItem[] = useMemo(() => [
    { id: 'dashboard', label: '대시보드', description: '홈 대시보드로 이동', icon: <LayoutDashboard className="h-4 w-4" />, action: () => go('/dashboard'), keywords: ['home', '홈'] },
    { id: 'ideas', label: '아이디어 보드', description: '아이디어 목록 보기', icon: <Lightbulb className="h-4 w-4" />, action: () => go('/ideas'), keywords: ['idea', '아이디어', '보드'] },
    { id: 'ideas-new', label: '새 아이디어 작성', description: '아이디어 보드에서 새 아이디어 추가', icon: <Plus className="h-4 w-4" />, action: () => go('/ideas?create=true'), keywords: ['new', '새', '추가', '작성'] },
    { id: 'projects', label: '전체 프로젝트', description: '프로젝트 현황 보기', icon: <Cpu className="h-4 w-4" />, action: () => go('/projects'), keywords: ['project', '프로젝트'] },
    { id: 'heunghan', label: 'HeungHan', description: '외국인 관광객 컨시어지', icon: <Globe className="h-4 w-4 text-green-600" />, action: () => go('/businesses/heunghan'), keywords: ['흥한', '관광'] },
    { id: 'substract', label: 'Substract Lab', description: 'AI 커피 장비 연구소', icon: <Cpu className="h-4 w-4 text-blue-600" />, action: () => go('/businesses/substract'), keywords: ['서브스트랙트', '커피', 'ai'] },
    { id: 'sensus', label: 'Sensus', description: 'AI 감각 분석 카페', icon: <Coffee className="h-4 w-4 text-orange-600" />, action: () => go('/businesses/sensus'), keywords: ['센서스', '카페'] },
    { id: 'profile', label: '마이페이지', description: '내 프로필 확인', icon: <Users className="h-4 w-4" />, action: () => go('/profile'), keywords: ['profile', '프로필', '내'] },
    { id: 'settings', label: '설정', description: '앱 설정', icon: <Settings className="h-4 w-4" />, action: () => go('/settings'), keywords: ['setting', '설정'] },
  ], [go]);

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q) ||
      cmd.keywords?.some(k => k.toLowerCase().includes(q))
    );
  }, [query, commands]);

  // 키보드 단축키: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 방향키 및 Enter 처리
  useEffect(() => {
    if (!open) return;
    const handleNav = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
      }
    };
    document.addEventListener('keydown', handleNav);
    return () => document.removeEventListener('keydown', handleNav);
  }, [open, filtered, selectedIndex]);

  // query 바뀔 때 선택 초기화
  useEffect(() => { setSelectedIndex(0); }, [query]);

  // 열릴 때 스크롤 방지
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Palette */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* 검색 입력 */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="페이지 이동, 명령 실행..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* 결과 리스트 */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              검색 결과가 없습니다
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === selectedIndex ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`shrink-0 ${i === selectedIndex ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {cmd.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{cmd.label}</p>
                  {cmd.description && (
                    <p className="text-xs text-slate-400 truncate">{cmd.description}</p>
                  )}
                </div>
                {i === selectedIndex && <ArrowRight className="h-3.5 w-3.5 text-indigo-400 shrink-0" />}
              </button>
            ))
          )}
        </div>

        {/* 하단 힌트 */}
        <div className="border-t px-4 py-2 flex items-center gap-4 text-[10px] text-slate-400">
          <span><kbd className="px-1 py-0.5 bg-slate-100 rounded border text-[9px]">↑↓</kbd> 이동</span>
          <span><kbd className="px-1 py-0.5 bg-slate-100 rounded border text-[9px]">Enter</kbd> 실행</span>
          <span><kbd className="px-1 py-0.5 bg-slate-100 rounded border text-[9px]">Esc</kbd> 닫기</span>
        </div>
      </div>
    </div>
  );
}
