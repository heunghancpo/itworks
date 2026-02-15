// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Globe, Coffee, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getIdeas, getRecentActivities } from '@/lib/firestore-helpers'; // 이 함수들 활용
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DBInitializer } from '@/components/db-initializer';

export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const [recentIdeas, setRecentIdeas] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const ideas = await getIdeas({ limitCount: 5, sortBy: 'recent' });
      setRecentIdeas(ideas);
      
      // logActivity로 저장된 활동 로그를 가져오는 함수가 있다고 가정 (firestore-helpers에 추가 필요)
      const recentActs = await getRecentActivities(5); 
      setActivities(recentActs);
    };
    fetchData();
  }, []);

  if (!user) return <div className="p-8 text-center">로딩 중...</div>;

  return (
    <div className="container mx-auto p-6 space-y-8">
        <DBInitializer />
      {/* 헤더 섹션 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">안녕하세요, {user.displayName || '팀원'}님 👋</h1>
          <p className="text-muted-foreground mt-2">
            오늘도 아이디어를 현실로 만들어봅시다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/ideas">아이디어 보드</Link>
          </Button>
          <Button asChild>
            <Link href="/projects">프로젝트 현황</Link>
          </Button>
        </div>
      </div>

      {/* 사업부별 현황 카드 (KPI 요약) */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="secondary" className="bg-green-100 text-green-700">Service</Badge>
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-lg mt-2">HeungHan</CardTitle>
            <CardDescription>외국인 관광객 컨시어지</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">활성 제휴 식당</span>
                <span className="font-bold">12곳</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">이번 주 예약</span>
                <span className="font-bold">8건</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">R&D</Badge>
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg mt-2">Substract Lab</CardTitle>
            <CardDescription>AI 커피 장비 연구소</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mameya 프로토타입</span>
                <span className="font-bold text-blue-600">60%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">YOLOv8 정확도</span>
                <span className="font-bold">98.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">F&B</Badge>
              <Coffee className="h-5 w-5 text-orange-600" />
            </div>
            <CardTitle className="text-lg mt-2">Sensus</CardTitle>
            <CardDescription>AI 감각 분석 카페</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">로스팅 데이터</span>
                <span className="font-bold">150건</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">오픈 준비</span>
                <span className="font-bold text-orange-600">기획 단계</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 최근 아이디어 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              최근 등록된 아이디어
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIdeas.map((idea) => (
                <div key={idea.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                    idea.priority === 'urgent' ? 'bg-red-500' : 
                    idea.priority === 'high' ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{idea.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{idea.content}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{idea.authorName}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(idea.createdAt?.toDate ? idea.createdAt.toDate() : new Date(), { addSuffix: true, locale: ko })}</span>
                    </div>
                  </div>
                </div>
              ))}
              {recentIdeas.length === 0 && (
                <p className="text-muted-foreground text-center py-4">등록된 아이디어가 없습니다.</p>
              )}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs" asChild>
              <Link href="/ideas">더 보기 <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardContent>
        </Card>

        {/* 최근 활동 로그 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" />
              팀 활동 내역
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-3 text-sm">
                  <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
                    {act.userName[0]}
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">{act.userName}</span>님이 
                      <span className="font-medium text-indigo-600 mx-1">
                        {act.actionType === 'created_idea' ? '새 아이디어를 등록했습니다' : 
                         act.actionType === 'comment' ? '댓글을 남겼습니다' : '활동을 했습니다'}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(act.createdAt?.toDate ? act.createdAt.toDate() : new Date(), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-muted-foreground text-center py-4">최근 활동이 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}