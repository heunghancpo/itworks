'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getBusinesses, getProjects } from '@/lib/firestore-helpers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, MoreHorizontal, LayoutGrid } from 'lucide-react';
import Link from 'next/link'; // Link 컴포넌트 활용

export default function ProjectsPage() {
  const [user, loading] = useAuthState(auth);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      const [bizData, projData] = await Promise.all([
        getBusinesses(),
        getProjects()
      ]);
      setBusinesses(bizData);
      setProjects(projData);
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  if (!user) return <div className="p-8 text-center">로그인이 필요합니다.</div>;

  const getBusinessInfo = (bizId: string) => businesses.find(b => b.id === bizId);

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.businessId === activeTab);

  const statusMap: Record<string, { label: string, color: string }> = {
    'planning': { label: '기획 중', color: 'bg-gray-100 text-gray-800' },
    'in_progress': { label: '진행 중', color: 'bg-blue-100 text-blue-800' },
    'completed': { label: '완료', color: 'bg-green-100 text-green-800' },
    'paused': { label: '보류', color: 'bg-yellow-100 text-yellow-800' },
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutGrid className="h-8 w-8 text-indigo-600" />
            프로젝트
          </h1>
          <p className="text-muted-foreground mt-1">
            진행 중인 모든 프로젝트의 현황과 아이디어를 한눈에 확인하세요.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> 새 프로젝트
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-transparent border-b rounded-none gap-2">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-4 py-2"
          >
            전체
          </TabsTrigger>
          {businesses.map((biz) => (
            <TabsTrigger 
              key={biz.id} 
              value={biz.id}
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-4 py-2"
            >
              {biz.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const biz = getBusinessInfo(project.businessId);
              const status = statusMap[project.status] || statusMap['planning'];
              
              return (
                // ✨ Link 컴포넌트로 카드를 감싸 클릭 시 상세 페이지로 이동하게 함
                <Link key={project.id} href={`/projects/${project.id}`} className="block h-full">
                  <Card className="h-full hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge 
                          variant="outline" 
                          style={{ color: biz?.color, borderColor: biz?.color }}
                          className="bg-white"
                        >
                          {biz?.name}
                        </Badge>
                        {/* a 태그 안에 button 태그가 들어가는 것을 방지하기 위해 div로 변경 */}
                        <div className="text-muted-foreground hover:text-foreground p-1">
                          <MoreHorizontal className="h-4 w-4" />
                        </div>
                      </div>
                      <CardTitle className="mt-3 group-hover:text-indigo-700 transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description || '프로젝트 설명이 없습니다.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <div className="flex items-center justify-between mt-2">
                        <Badge className={status.color} variant="secondary">
                          {status.label}
                        </Badge>
                        
                        <div className="text-xs text-muted-foreground group-hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium">
                          Canvas 보기 <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                      
                      {/* 진행률 바 */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: project.status === 'completed' ? '100%' : project.status === 'in_progress' ? '50%' : '15%' }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
            
            {/* 프로젝트 생성 카드 (빈 상태) */}
            <Button variant="outline" className="h-full min-h-[200px] border-dashed border-2 flex flex-col gap-2 hover:border-indigo-400 hover:bg-indigo-50/50 text-muted-foreground hover:text-indigo-600">
              <Plus className="h-8 w-8 mb-2" />
              <span>새 프로젝트 시작하기</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}