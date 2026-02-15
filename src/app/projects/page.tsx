'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import {
  getBusinesses,
  subscribeToProjects,
  subscribeToIdeas,
  createProject,
  updateProject,
  deleteProject,
  logActivity,
} from '@/lib/firestore-helpers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, ArrowRight, MoreHorizontal, LayoutGrid, Pencil, Trash2, Archive, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const teamMembers = [
  { id: 'hyunseo', name: '송현서' },
  { id: 'jungho', name: '이정호' },
  { id: 'junghan', name: '이정한' },
];

const statusMap: Record<string, { label: string; color: string }> = {
  planning: { label: '기획 중', color: 'bg-gray-100 text-gray-800' },
  in_progress: { label: '진행 중', color: 'bg-blue-100 text-blue-800' },
  completed: { label: '완료', color: 'bg-green-100 text-green-800' },
  paused: { label: '보류', color: 'bg-yellow-100 text-yellow-800' },
  archived: { label: '보관됨', color: 'bg-slate-100 text-slate-500' },
};

export default function ProjectsPage() {
  const [user, loading] = useAuthState(auth);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [ideaCountsByProject, setIdeaCountsByProject] = useState<Record<string, { total: number; done: number }>>({});

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState('planning');
  const [formBusiness, setFormBusiness] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formAssignee, setFormAssignee] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      const bizData = await getBusinesses();
      setBusinesses(bizData);
    };
    fetchBusinesses();

    const unsubProjects = subscribeToProjects((projData) => {
      setProjects(projData);
    });

    const unsubIdeas = subscribeToIdeas((ideas) => {
      const counts: Record<string, { total: number; done: number }> = {};
      ideas.forEach((idea: any) => {
        if (!idea.projectId) return;
        if (!counts[idea.projectId]) counts[idea.projectId] = { total: 0, done: 0 };
        counts[idea.projectId].total++;
        if (idea.status === 'approved' || idea.status === 'implemented') {
          counts[idea.projectId].done++;
        }
      });
      setIdeaCountsByProject(counts);
    });

    return () => {
      unsubProjects();
      unsubIdeas();
    };
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  if (!user) return <div className="p-8 text-center">로그인이 필요합니다.</div>;

  const getBusinessInfo = (bizId: string) => businesses.find(b => b.id === bizId);

  const filteredProjects = activeTab === 'all'
    ? projects.filter(p => p.status !== 'archived')
    : projects.filter(p => p.businessId === activeTab && p.status !== 'archived');

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormStatus('planning');
    setFormBusiness('');
    setFormDeadline('');
    setFormAssignee('');
  };

  const handleCreateProject = async () => {
    if (!formTitle || !formBusiness) {
      toast.error('제목과 사업체를 선택해주세요');
      return;
    }
    setIsSubmitting(true);
    try {
      await createProject({
        title: formTitle,
        description: formDescription,
        status: formStatus,
        businessId: formBusiness,
        deadline: formDeadline || null,
        assigneeId: formAssignee || null,
        assigneeName: teamMembers.find(m => m.id === formAssignee)?.name || null,
      });
      await logActivity({
        userId: user.uid,
        userName: user.displayName || user.email || '익명',
        actionType: 'created_project',
        entityType: 'project',
        entityId: formTitle,
        metadata: { title: formTitle },
      });
      toast.success('프로젝트가 생성되었습니다');
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('프로젝트 생성 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (project: any) => {
    setSelectedProject(project);
    setFormTitle(project.title);
    setFormDescription(project.description || '');
    setFormStatus(project.status);
    setFormBusiness(project.businessId);
    setFormDeadline(project.deadline || '');
    setFormAssignee(project.assigneeId || '');
    setIsEditOpen(true);
  };

  const handleEditProject = async () => {
    if (!selectedProject || !formTitle) return;
    setIsSubmitting(true);
    try {
      await updateProject(selectedProject.id, {
        title: formTitle,
        description: formDescription,
        status: formStatus,
        businessId: formBusiness,
        deadline: formDeadline || null,
        assigneeId: formAssignee || null,
        assigneeName: teamMembers.find(m => m.id === formAssignee)?.name || null,
      });
      toast.success('프로젝트가 수정되었습니다');
      setIsEditOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('프로젝트 수정 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    try {
      await deleteProject(selectedProject.id);
      toast.success('프로젝트가 삭제되었습니다');
      setIsDeleteOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error(error);
      toast.error('프로젝트 삭제 실패');
    }
  };

  const handleArchiveProject = async (project: any) => {
    try {
      await updateProject(project.id, { status: 'archived' });
      toast.success('프로젝트가 보관되었습니다');
    } catch (error) {
      console.error(error);
      toast.error('보관 처리 실패');
    }
  };

  const renderProjectForm = (onSubmit: () => void, submitLabel: string) => (
    <div className="space-y-4 mt-4">
      <div>
        <label className="text-sm font-medium">사업체</label>
        <Select value={formBusiness} onValueChange={setFormBusiness}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="사업체 선택" /></SelectTrigger>
          <SelectContent>
            {businesses.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">프로젝트명</label>
        <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} className="mt-1" placeholder="프로젝트 제목" />
      </div>
      <div>
        <label className="text-sm font-medium">설명</label>
        <Textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} className="mt-1" rows={3} placeholder="프로젝트 설명" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">상태</label>
          <Select value={formStatus} onValueChange={setFormStatus}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">기획 중</SelectItem>
              <SelectItem value="in_progress">진행 중</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
              <SelectItem value="paused">보류</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">담당자</label>
          <Select value={formAssignee} onValueChange={setFormAssignee}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="선택" /></SelectTrigger>
            <SelectContent>
              {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">마감일</label>
        <Input type="date" value={formDeadline} onChange={e => setFormDeadline(e.target.value)} className="mt-1" />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }}>취소</Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            프로젝트
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base hidden sm:block">
            진행 중인 모든 프로젝트의 현황과 아이디어를 한눈에 확인하세요.
          </p>
        </div>
        <Button size="sm" className="sm:size-default self-start sm:self-auto" onClick={() => { resetForm(); setIsCreateOpen(true); }}>
          <Plus className="mr-1 sm:mr-2 h-4 w-4" /> 새 프로젝트
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
              const counts = ideaCountsByProject[project.id];
              const pct = counts && counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0;

              return (
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div
                              className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={(e) => { e.preventDefault(); openEditDialog(project); }}>
                              <Pencil className="mr-2 h-4 w-4" /> 수정
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleArchiveProject(project); }}>
                              <Archive className="mr-2 h-4 w-4" /> 보관
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={(e) => { e.preventDefault(); setSelectedProject(project); setIsDeleteOpen(true); }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> 삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                        <div className="flex items-center gap-2">
                          <Badge className={status.color} variant="secondary">
                            {status.label}
                          </Badge>
                          {project.assigneeName && (
                            <span className="text-xs text-muted-foreground">{project.assigneeName}</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground group-hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium">
                          Canvas 보기 <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>

                      {project.deadline && (
                        <p className="text-xs text-muted-foreground mt-2">
                          마감: {project.deadline}
                        </p>
                      )}

                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{counts?.done || 0}/{counts?.total || 0} 아이디어</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}

            <Button
              variant="outline"
              className="h-full min-h-[200px] border-dashed border-2 flex flex-col gap-2 hover:border-indigo-400 hover:bg-indigo-50/50 text-muted-foreground hover:text-indigo-600"
              onClick={() => { resetForm(); setIsCreateOpen(true); }}
            >
              <Plus className="h-8 w-8 mb-2" />
              <span>새 프로젝트 시작하기</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Project Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>새 프로젝트</DialogTitle>
            <DialogDescription>새로운 프로젝트를 시작하세요</DialogDescription>
          </DialogHeader>
          {renderProjectForm(handleCreateProject, '프로젝트 생성')}
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>프로젝트 수정</DialogTitle>
            <DialogDescription>프로젝트 정보를 수정하세요</DialogDescription>
          </DialogHeader>
          {renderProjectForm(handleEditProject, '수정 완료')}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>프로젝트를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{selectedProject?.title}&rdquo; 프로젝트가 영구적으로 삭제됩니다. 이 작업은 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
