'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  createIdea,
  subscribeToIdeas,
  toggleLike,
  addComment,
  addResource,
  getBusinesses,
  getProjects,
  getComments,
  getResources,
  getEvolvedIdeas,
  logActivity,
} from '@/lib/firestore-helpers';
import { IdeaCard } from '@/components/idea-card';
import { IdeaDetailDialog } from '@/components/idea-detail-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Search, Clock, ThumbsUp, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IdeasPage() {
  const [user] = useAuthState(auth);
  
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
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
        idea.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // 정렬
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
  }, [ideas, filterBusiness, filterProject, filterStatus, searchQuery, sortBy]);

  const loadBusinesses = async () => {
    const data = await getBusinesses();
    setBusinesses(data);
  };

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  const handleCreateIdea = async () => {
    if (!newIdeaTitle || !newIdeaContent || !newIdeaProject) {
      toast.error('모든 필드를 입력해주세요');
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
        content: newIdeaContent,
        priority: newIdeaPriority,
        tags: newIdeaTags.split(',').map(t => t.trim()).filter(Boolean),
        authorId: user.uid,
        authorName: user.displayName || user.email,
        authorAvatar: user.photoURL,
      });
      
      // 활동 로그
      await logActivity({
        userId: user.uid,
        userName: user.displayName || user.email,
        actionType: 'created_idea',
        entityType: 'idea',
        entityId: newIdeaTitle,
        metadata: { title: newIdeaTitle },
      });
      
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
      console.error('Error toggling like:', error);
      toast.error('좋아요 실패');
    }
  };

  const handleOpenDetail = async (idea: any) => {
    try {
      // 댓글, 리소스, 발전된 아이디어 로드
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
      console.error('Error loading idea details:', error);
      toast.error('상세 정보 로드 실패');
    }
  };

  const handleSubmitComment = async (content: string) => {
    if (!user || !selectedIdea) return;
    
    try {
      await addComment(selectedIdea.id, {
        content,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        authorAvatar: user.photoURL,
      });
      
      toast.success('댓글이 추가되었습니다');
      
      // 상세 정보 다시 로드
      handleOpenDetail(selectedIdea);
    } catch (error) {
      console.error('Error adding comment:', error);
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
      
      // 상세 정보 다시 로드
      handleOpenDetail(selectedIdea);
    } catch (error) {
      console.error('Error adding resource:', error);
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
        authorName: user.displayName || user.email,
        authorAvatar: user.photoURL,
        parentId: selectedIdea.id,
      });
      
      toast.success('발전된 아이디어가 생성되었습니다');
      setIsDetailOpen(false);
    } catch (error) {
      console.error('Error creating evolution:', error);
      toast.error('아이디어 생성 실패');
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
    <div className="container mx-auto py-8 px-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">💡 아이디어 보드</h1>
          <p className="text-muted-foreground mt-1">
            팀의 아이디어를 모으고, 논의하고, 발전시키세요
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              새 아이디어
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
                <label className="text-sm font-medium">내용</label>
                <Textarea
                  placeholder="아이디어를 자세히 설명해주세요..."
                  value={newIdeaContent}
                  onChange={(e) => setNewIdeaContent(e.target.value)}
                  rows={6}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">우선순위</label>
                  <Select value={newIdeaPriority} onValueChange={setNewIdeaPriority}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
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

      {/* 필터 & 검색 */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
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
          <SelectTrigger className="w-[180px]">
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
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
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
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[150px]">
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

      {/* 아이디어 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map(idea => {
          const project = projects.find(p => p.id === idea.projectId);
          const business = businesses.find(b => b.id === idea.businessId);
          
          return (
            <IdeaCard
              key={idea.id}
              idea={{
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
              }}
              onLike={handleLikeIdea}
              onComment={() => handleOpenDetail(idea)}
              onEvolve={() => handleOpenDetail(idea)}
            />
          );
        })}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || filterBusiness !== 'all' || filterStatus !== 'all'
              ? '검색 결과가 없습니다.'
              : '아직 아이디어가 없습니다. 첫 아이디어를 추가해보세요!'}
          </p>
        </div>
      )}

      {/* 아이디어 상세 다이얼로그 */}
      {selectedIdea && (
        <IdeaDetailDialog
          idea={selectedIdea}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onSubmitComment={handleSubmitComment}
          onUploadResource={handleUploadResource}
          onCreateEvolution={handleCreateEvolution}
        />
      )}
    </div>
  );
}