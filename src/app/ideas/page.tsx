// src/app/ideas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  createIdea,
  updateIdea,
  subscribeToIdeas,
  toggleLike,
  addComment,
  addResource,
  deleteComment,
  updateComment,
  deleteResource,
  getBusinesses,
  getProjects,
  getComments,
  getResources,
  getEvolvedIdeas,
  logActivity,
  notifyTeam,
} from '@/lib/firestore-helpers';
import { IdeaCard } from '@/components/idea-card';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { TimelineView } from '@/components/timeline/timeline-view';
import { IdeaDetailDialog } from '@/components/idea-detail-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, Search, Clock, ThumbsUp, TrendingUp, 
  LayoutGrid, Kanban, CalendarRange 
} from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

// 에디터는 SSR 이슈 방지를 위해 동적 로딩
const TiptapEditor = dynamic(() => import('@/components/editor/tiptap-editor'), {
  ssr: false,
  loading: () => <div className="h-40 bg-slate-50 animate-pulse rounded-md" />,
});

export default function IdeasPage() {
  const [user] = useAuthState(auth);
  
  const [ideas, setIdeas] = useState<any[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // 뷰 모드 상태: 그리드, 칸반, 타임라인
  const [viewMode, setViewMode] = useState<'grid' | 'board' | 'timeline'>('grid');

  // 필터
  const [filterBusiness, setFilterBusiness] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  
  // 새 아이디어 폼
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaContent, setNewIdeaContent] = useState('');
  const [newIdeaProject, setNewIdeaProject] = useState('');
  const [newIdeaPriority, setNewIdeaPriority] = useState('medium');
  const [newIdeaTags, setNewIdeaTags] = useState('');

  // 아이디어 수정
  const [isEditIdeaOpen, setIsEditIdeaOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [editIdeaTitle, setEditIdeaTitle] = useState('');
  const [editIdeaContent, setEditIdeaContent] = useState('');
  const [editIdeaPriority, setEditIdeaPriority] = useState('medium');
  const [editIdeaTags, setEditIdeaTags] = useState('');

  // 데이터 로드
  useEffect(() => {
    loadBusinesses();
    loadProjects();
    
    // Realtime 구독
    const unsubscribe = subscribeToIdeas((newIdeas) => {
      setIdeas(newIdeas);
    });
    
    return () => unsubscribe();
  }, []);

  // 필터링
  useEffect(() => {
    let filtered = [...ideas];
    
    // 프로젝트 및 비즈니스 정보 매핑
    filtered = filtered.map(idea => {
      const project = projects.find(p => p.id === idea.projectId);
      const business = businesses.find(b => b.id === idea.businessId);
      return {
        ...idea,
        project: project ? {
          title: project.title,
          business: business || { name: '', color: '' }
        } : { title: '', business: { name: '', color: '' } },
        author: {
          id: idea.authorId,
          name: idea.authorName,
          avatar: idea.authorAvatar,
        }
      };
    });
    
    if (filterBusiness !== 'all') {
      filtered = filtered.filter(idea => idea.businessId === filterBusiness);
    }
    
    if (filterProject !== 'all') {
      filtered = filtered.filter(idea => idea.projectId === filterProject);
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(idea => idea.status === filterStatus);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // 정렬 (그리드 뷰에서만 주로 사용됨)
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
        break;
      case 'discussed':
        filtered.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
        break;
      default:
        filtered.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });
    }
    
    setFilteredIdeas(filtered);
  }, [ideas, filterBusiness, filterProject, filterStatus, searchQuery, sortBy, projects, businesses]);

  const loadBusinesses = async () => {
    const data = await getBusinesses();
    setBusinesses(data);
  };

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  const handleCreateIdea = async () => {
    // Tiptap은 초기값이 빈 태그일 수 있으므로 검사
    if (!newIdeaTitle || !newIdeaProject || newIdeaContent === '<p></p>' || !newIdeaContent) {
      toast.error('제목, 프로젝트, 내용을 모두 입력해주세요');
      return;
    }
    
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }
    
    try {
      const project = projects.find(p => p.id === newIdeaProject);
      
      await createIdea({
        projectId: newIdeaProject,
        businessId: project.businessId,
        title: newIdeaTitle,
        content: newIdeaContent, // HTML 컨텐츠 저장
        priority: newIdeaPriority,
        tags: newIdeaTags.split(',').map(t => t.trim()).filter(Boolean),
        authorId: user.uid,
        authorName: user.displayName || user.email || '익명',
        authorAvatar: user.photoURL || '',
      });
      
      await logActivity({
        userId: user.uid,
        userName: user.displayName || user.email || '익명',
        actionType: 'created_idea',
        entityType: 'idea',
        entityId: newIdeaTitle,
        metadata: { title: newIdeaTitle },
      });

      // 팀에 알림
      notifyTeam(user.uid, {
        type: 'idea_created',
        title: '새 아이디어',
        message: `${user.displayName || '팀원'}님이 "${newIdeaTitle}" 아이디어를 등록했습니다`,
        link: '/ideas',
        fromUserId: user.uid,
        fromUserName: user.displayName || user.email || '익명',
      }).catch(() => {}); // 알림 실패는 무시

      toast.success('아이디어가 추가되었습니다');
      setIsCreateOpen(false);
      setNewIdeaTitle('');
      setNewIdeaContent('');
      setNewIdeaTags('');
    } catch (error) {
      console.error('Error creating idea:', error);
      toast.error('아이디어 추가 실패');
    }
  };

  const handleLikeIdea = async (ideaId: string) => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }
    try {
      await toggleLike(ideaId, user.uid);
    } catch (error) {
      toast.error('좋아요 실패');
    }
  };

  const handleOpenDetail = async (idea: any) => {
    try {
      const [comments, resources, evolvedIdeas] = await Promise.all([
        getComments(idea.id),
        getResources(idea.id),
        getEvolvedIdeas(idea.id),
      ]);
      
      setSelectedIdea({
        ...idea,
        comments,
        resources,
        evolved_ideas: evolvedIdeas,
      });
      setIsDetailOpen(true);
    } catch (error) {
      toast.error('상세 정보 로드 실패');
    }
  };

  const handleSubmitComment = async (content: string) => {
    if (!user || !selectedIdea) return;
    try {
      await addComment(selectedIdea.id, {
        content,
        authorId: user.uid,
        authorName: user.displayName || user.email || '익명',
        authorAvatar: user.photoURL || '',
      });

      notifyTeam(user.uid, {
        type: 'comment',
        title: '새 댓글',
        message: `${user.displayName || '팀원'}님이 "${selectedIdea.title}"에 댓글을 남겼습니다`,
        link: '/ideas',
        fromUserId: user.uid,
        fromUserName: user.displayName || user.email || '익명',
      }).catch(() => {});

      toast.success('댓글이 추가되었습니다');
      handleOpenDetail(selectedIdea);
    } catch (error) {
      toast.error('댓글 추가 실패');
    }
  };

  const handleUploadResource = async (resource: any) => {
    if (!user || !selectedIdea) return;
    try {
      await addResource(selectedIdea.id, {
        ...resource,
        uploadedBy: user.uid,
        uploadedByName: user.displayName || user.email,
      });
      toast.success('리소스가 추가되었습니다');
      handleOpenDetail(selectedIdea);
    } catch (error) {
      toast.error('리소스 추가 실패');
    }
  };

  const handleCreateEvolution = async (title: string, content: string) => {
    if (!user || !selectedIdea) return;
    try {
      await createIdea({
        projectId: selectedIdea.projectId,
        businessId: selectedIdea.businessId,
        title,
        content,
        priority: 'medium',
        tags: [],
        authorId: user.uid,
        authorName: user.displayName || user.email || '익명',
        authorAvatar: user.photoURL || '',
        parentId: selectedIdea.id,
      });
      toast.success('발전된 아이디어가 생성되었습니다');
      setIsDetailOpen(false);
    } catch (error) {
      toast.error('아이디어 생성 실패');
    }
  };

  const handleStatusChange = async (ideaId: string, newStatus: string) => {
    if (!user) return;
    try {
      await updateIdea(ideaId, { status: newStatus });
      // 뷰 모드가 보드일 때는 드래그로 상태가 바뀌므로 로그 생략 또는 간단히 처리
      if (viewMode !== 'board') {
        await logActivity({
          userId: user.uid,
          userName: user.displayName || user.email || '익명',
          actionType: 'status_changed',
          entityType: 'idea',
          entityId: ideaId,
          metadata: { newStatus },
        });
      }
      toast.success('상태가 변경되었습니다');
      if (selectedIdea && selectedIdea.id === ideaId) {
        handleOpenDetail({ ...selectedIdea, status: newStatus });
      }
    } catch (error) {
      toast.error('상태 변경 실패');
    }
  };

  const handleEditIdea = (idea: any) => {
    setEditingIdea(idea);
    setEditIdeaTitle(idea.title);
    setEditIdeaContent(idea.content);
    setEditIdeaPriority(idea.priority || 'medium');
    setEditIdeaTags(idea.tags?.join(', ') || '');
    setIsEditIdeaOpen(true);
  };

  const handleSaveEditIdea = async () => {
    if (!editingIdea || !editIdeaTitle) return;
    try {
      await updateIdea(editingIdea.id, {
        title: editIdeaTitle,
        content: editIdeaContent,
        priority: editIdeaPriority,
        tags: editIdeaTags.split(',').map((t: string) => t.trim()).filter(Boolean),
      });
      toast.success('아이디어가 수정되었습니다');
      setIsEditIdeaOpen(false);
    } catch (error) {
      toast.error('수정 실패');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedIdea) return;
    try {
      await deleteComment(selectedIdea.id, commentId);
      toast.success('댓글이 삭제되었습니다');
      handleOpenDetail(selectedIdea);
    } catch (error) {
      toast.error('댓글 삭제 실패');
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    if (!selectedIdea) return;
    try {
      await updateComment(selectedIdea.id, commentId, content);
      toast.success('댓글이 수정되었습니다');
      handleOpenDetail(selectedIdea);
    } catch (error) {
      toast.error('댓글 수정 실패');
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!selectedIdea) return;
    try {
      await deleteResource(selectedIdea.id, resourceId);
      toast.success('리소스가 삭제되었습니다');
      handleOpenDetail(selectedIdea);
    } catch (error) {
      toast.error('리소스 삭제 실패');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>로그인이 필요합니다</p>
        <Button onClick={() => {/* 로그인 모달 열기 */}}>로그인</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4 h-[calc(100vh-56px)] lg:h-screen flex flex-col overflow-x-hidden">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 flex-shrink-0 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">💡 아이디어 보드</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base hidden sm:block">
            팀의 아이디어를 모으고, 논의하고, 발전시키세요
          </p>
        </div>

        <div className="flex gap-2">
          {/* 뷰 모드 토글 */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="그리드 뷰"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="칸반 보드"
            >
              <Kanban className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === 'timeline' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="타임라인"
            >
              <CalendarRange className="h-4 w-4" />
            </button>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="sm:size-default">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">새 아이디어</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[calc(100vw-32px)] max-h-[90vh] overflow-y-auto overflow-x-hidden">
              <DialogHeader>
                <DialogTitle>새 아이디어 추가</DialogTitle>
                <DialogDescription>
                  떠오른 아이디어를 팀과 공유하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">프로젝트</label>
                  <Select value={newIdeaProject} onValueChange={setNewIdeaProject}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="프로젝트 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => {
                        const business = businesses.find(b => b.id === project.businessId);
                        return (
                          <SelectItem key={project.id} value={project.id}>
                            {business?.name} - {project.title}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">제목</label>
                  <Input
                    placeholder="아이디어 제목..."
                    value={newIdeaTitle}
                    onChange={(e) => setNewIdeaTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">내용</label>
                  {/* Tiptap 에디터 사용 */}
                  <TiptapEditor
                    content={newIdeaContent}
                    onChange={setNewIdeaContent}
                    placeholder="아이디어 내용을 구체적으로 작성하세요..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">우선순위</label>
                    <Select value={newIdeaPriority} onValueChange={setNewIdeaPriority}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">낮음</SelectItem>
                        <SelectItem value="medium">보통</SelectItem>
                        <SelectItem value="high">높음</SelectItem>
                        <SelectItem value="urgent">긴급</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">태그 (쉼표로 구분)</label>
                    <Input
                      placeholder="AI, Hardware, Design"
                      value={newIdeaTags}
                      onChange={(e) => setNewIdeaTags(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleCreateIdea}>
                    아이디어 추가
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 필터 & 검색 */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6 flex-shrink-0">
        <div className="w-full sm:flex-1 sm:min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="아이디어 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={filterBusiness} onValueChange={setFilterBusiness}>
          <SelectTrigger className="w-[130px] sm:w-[180px]">
            <SelectValue placeholder="사업체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 사업체</SelectItem>
            {businesses.map(business => (
              <SelectItem key={business.id} value={business.id}>
                {business.icon} {business.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 칸반 뷰에서는 상태 필터링 숨김 (보드 자체에 상태가 다 나오므로) */}
        {viewMode === 'grid' && (
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[110px] sm:w-[150px]">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="proposed">제안</SelectItem>
              <SelectItem value="discussing">논의중</SelectItem>
              <SelectItem value="approved">승인</SelectItem>
              <SelectItem value="implemented">구현완료</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[110px] sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">
              <Clock className="h-4 w-4 inline mr-2" />
              최신순
            </SelectItem>
            <SelectItem value="popular">
              <ThumbsUp className="h-4 w-4 inline mr-2" />
              인기순
            </SelectItem>
            <SelectItem value="discussed">
              <TrendingUp className="h-4 w-4 inline mr-2" />
              논의 많은 순
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 min-h-0">
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10 overflow-y-auto h-full pr-2 custom-scrollbar">
            {filteredIdeas.map(idea => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onLike={handleLikeIdea}
                onComment={() => handleOpenDetail(idea)}
                onEvolve={() => handleOpenDetail(idea)}
                onEdit={handleEditIdea}
                onStatusChange={handleStatusChange}
              />
            ))}
            {filteredIdeas.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>
                  {searchQuery || filterBusiness !== 'all' || filterStatus !== 'all'
                    ? '검색 결과가 없습니다.'
                    : '아직 아이디어가 없습니다. 첫 아이디어를 추가해보세요!'}
                </p>
              </div>
            )}
          </div>
        )}
        
        {viewMode === 'board' && (
          <KanbanBoard 
            ideas={filteredIdeas} 
            onStatusChange={handleStatusChange}
            onCardClick={handleOpenDetail}
          />
        )}

        {viewMode === 'timeline' && (
          <div className="h-full overflow-hidden pb-4">
            <TimelineView 
              ideas={filteredIdeas} 
              onTaskClick={handleOpenDetail} 
            />
          </div>
        )}
      </div>

      {/* 아이디어 상세 다이얼로그 */}
      {selectedIdea && (
        <IdeaDetailDialog
          idea={selectedIdea}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onSubmitComment={handleSubmitComment}
          onUploadResource={handleUploadResource}
          onCreateEvolution={handleCreateEvolution}
          onStatusChange={handleStatusChange}
          onDeleteComment={handleDeleteComment}
          onUpdateComment={handleUpdateComment}
          onDeleteResource={handleDeleteResource}
          currentUserId={user?.uid}
        />
      )}

      {/* 아이디어 수정 다이얼로그 */}
      <Dialog open={isEditIdeaOpen} onOpenChange={setIsEditIdeaOpen}>
        <DialogContent className="max-w-4xl w-[calc(100vw-32px)] max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>아이디어 수정</DialogTitle>
            <DialogDescription>아이디어 내용을 수정하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">제목</label>
              <Input
                value={editIdeaTitle}
                onChange={e => setEditIdeaTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="min-w-0">
              <label className="text-sm font-medium mb-1 block">내용</label>
              <TiptapEditor
                content={editIdeaContent}
                onChange={setEditIdeaContent}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">우선순위</label>
                <Select value={editIdeaPriority} onValueChange={setEditIdeaPriority}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">낮음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="high">높음</SelectItem>
                    <SelectItem value="urgent">긴급</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">태그 (쉼표로 구분)</label>
                <Input
                  value={editIdeaTags}
                  onChange={e => setEditIdeaTags(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditIdeaOpen(false)}>취소</Button>
              <Button onClick={handleSaveEditIdea}>수정 완료</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}