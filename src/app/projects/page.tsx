'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getBusinesses, getProjects } from '@/lib/firestore-helpers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

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
          <h1 className="text-3xl font-bold">🚀 프로젝트</h1>
          <p className="text-muted-foreground mt-1">
            아이디어가 현실이 되는 공간입니다.
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
                <Card key={project.id} className="hover:shadow-md transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge 
                        variant="outline" 
                        style={{ color: biz?.color, borderColor: biz?.color }}
                        className="bg-white"
                      >
                        {biz?.name}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="mt-3">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || '아직 설명이 없습니다.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mt-2">
                      <Badge className={status.color} variant="secondary">
                        {status.label}
                      </Badge>
                      
                      <div className="text-xs text-muted-foreground group-hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer">
                        상세보기 <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                    
                    {/* 진행률 바 (예시) */}
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full" 
                        style={{ width: project.status === 'completed' ? '100%' : project.status === 'in_progress' ? '50%' : '10%' }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredProjects.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                <p>진행 중인 프로젝트가 없습니다.</p>
                <Button variant="link" className="mt-2">
                  + 첫 번째 프로젝트 생성하기
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}