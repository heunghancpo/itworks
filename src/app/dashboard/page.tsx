// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity, Globe, Coffee, Lightbulb, ArrowRight,
  Cpu, TrendingUp, CheckCircle2, Clock, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import {
  subscribeToIdeas, subscribeToProjects, getBusinesses, getRecentActivities,
} from '@/lib/firestore-helpers';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DBInitializer } from '@/components/db-initializer';

const BUSINESS_CONFIG: Record<string, { icon: React.ReactNode; color: string; borderColor: string; badgeClass: string; label: string; desc: string }> = {
  heunghan: { icon: <Globe className="h-5 w-5 text-green-600" />, color: 'green', borderColor: 'border-l-green-500', badgeClass: 'bg-green-100 text-green-700', label: 'HeungHan', desc: '외국인 관광객 컨시어지' },
  substract: { icon: <Cpu className="h-5 w-5 text-blue-600" />, color: 'blue', borderColor: 'border-l-blue-500', badgeClass: 'bg-blue-100 text-blue-700', label: 'Substract Lab', desc: 'AI 커피 장비 연구소' },
  sensus: { icon: <Coffee className="h-5 w-5 text-orange-600" />, color: 'orange', borderColor: 'border-l-orange-500', badgeClass: 'bg-orange-100 text-orange-700', label: 'Sensus', desc: 'AI 감각 분석 카페' },
};

export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    getBusinesses().then(setBusinesses);
    getRecentActivities(8).then(setActivities);

    const unsub1 = subscribeToIdeas(setIdeas);
    const unsub2 = subscribeToProjects(setProjects);
    return () => { unsub1(); unsub2(); };
  }, []);

  if (!user) return <div className="p-8 text-center text-muted-foreground">로딩 중...</div>;

  // KPI 계산
  const totalIdeas = ideas.length;
  const approvedIdeas = ideas.filter(i => i.status === 'approved' || i.status === 'implemented').length;
  const discussingIdeas = ideas.filter(i => i.status === 'discussing').length;
  const totalProjects = projects.filter(p => p.status !== 'archived').length;

  // 사업체별 통계
  const bizStats = businesses.map(biz => {
    const bizIdeas = ideas.filter(i => i.businessId === biz.id);
    const bizProjects = projects.filter(p => p.businessId === biz.id && p.status !== 'archived');
    const approved = bizIdeas.filter(i => i.status === 'approved' || i.status === 'implemented').length;
    const config = BUSINESS_CONFIG[biz.id] || BUSINESS_CONFIG.heunghan;
    return { ...biz, config, ideasCount: bizIdeas.length, projectsCount: bizProjects.length, approvedCount: approved };
  });

  // 최근 아이디어 5개
  const recentIdeas = [...ideas]
    .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-x-hidden">
      <DBInitializer />

      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">안녕하세요, {user.displayName || '팀원'}님 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            오늘도 아이디어를 현실로 만들어봅시다.
            <span className="hidden sm:inline ml-2 text-xs">
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border text-[10px]">Cmd+K</kbd> 빠른 이동
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/ideas">아이디어 보드</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/projects">프로젝트 현황</Link>
          </Button>
        </div>
      </div>

      {/* 전체 KPI 요약 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between mb-1">
              <Lightbulb className="h-4 w-4 text-indigo-500" />
              <span className="text-2xl font-bold text-indigo-700">{totalIdeas}</span>
            </div>
            <p className="text-xs text-muted-foreground">전체 아이디어</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-700">{approvedIdeas}</span>
            </div>
            <p className="text-xs text-muted-foreground">승인/구현 완료</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between mb-1">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-700">{discussingIdeas}</span>
            </div>
            <p className="text-xs text-muted-foreground">논의 중</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between mb-1">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold text-orange-700">{totalProjects}</span>
            </div>
            <p className="text-xs text-muted-foreground">활성 프로젝트</p>
          </CardContent>
        </Card>
      </div>

      {/* 사업부별 현황 카드 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {bizStats.map(biz => (
          <Link key={biz.id} href={`/businesses/${biz.id}`}>
            <Card className={`border-l-4 ${biz.config.borderColor} hover:shadow-md transition cursor-pointer h-full`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className={biz.config.badgeClass}>{biz.name}</Badge>
                  {biz.config.icon}
                </div>
                <CardTitle className="text-lg mt-2">{biz.config.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{biz.config.desc}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">아이디어</span>
                    <span className="font-bold">{biz.ideasCount}건</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">프로젝트</span>
                    <span className="font-bold">{biz.projectsCount}건</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">승인/완료</span>
                    <span className="font-bold text-green-600">{biz.approvedCount}건</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        {/* 최근 아이디어 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              최근 등록된 아이디어
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentIdeas.map((idea) => (
                <div key={idea.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                    idea.priority === 'urgent' ? 'bg-red-500' :
                    idea.priority === 'high' ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{idea.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span>{idea.authorName}</span>
                      <span>·</span>
                      <span>{formatDistanceToNow(idea.createdAt?.toDate ? idea.createdAt.toDate() : new Date(), { addSuffix: true, locale: ko })}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {idea.status === 'proposed' ? '제안' : idea.status === 'discussing' ? '논의중' : idea.status === 'approved' ? '승인' : '완료'}
                  </Badge>
                </div>
              ))}
              {recentIdeas.length === 0 && (
                <p className="text-muted-foreground text-center py-4 text-sm">등록된 아이디어가 없습니다.</p>
              )}
            </div>
            <Button variant="ghost" className="w-full mt-3 text-xs" asChild>
              <Link href="/ideas">더 보기 <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardContent>
        </Card>

        {/* 최근 활동 로그 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="h-5 w-5 text-indigo-500" />
              팀 활동 내역
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-3 text-sm">
                  <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
                    {(act.userName || '?')[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">{act.userName}</span>
                      <span className="text-indigo-600 mx-1">
                        {act.actionType === 'created_idea' ? '새 아이디어 등록' :
                         act.actionType === 'comment' ? '댓글 작성' :
                         act.actionType === 'status_changed' ? '상태 변경' : '활동'}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(act.createdAt?.toDate ? act.createdAt.toDate() : new Date(), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-muted-foreground text-center py-4 text-sm">최근 활동이 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
