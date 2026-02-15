'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Paperclip,
  Link as LinkIcon,
  FileText,
  Send,
  TrendingUp,
  Download,
  ExternalLink,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  created_at: string;
}

interface Resource {
  id: string;
  type: 'file' | 'link' | 'paper' | 'dataset' | 'code' | 'document';
  title: string;
  url: string;
  description?: string;
  metadata?: {
    size?: string;
    author?: string;
  };
  uploaded_by: {
    name: string;
  };
  created_at: string;
}

interface EvolutionIdea {
  id: string;
  title: string;
  author: {
    name: string;
  };
  created_at: string;
  status: string;
}

interface IdeaDetailDialogProps {
  idea: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmitComment: (content: string) => Promise<void>;
  onUploadResource: (resource: { type: string; title: string; url: string; description?: string }) => Promise<void>;
  onCreateEvolution: (title: string, content: string) => Promise<void>;
}

const resourceTypeIcons = {
  file: FileText,
  link: LinkIcon,
  paper: FileText,
  dataset: FileText,
  code: FileText,
  document: FileText,
};

const resourceTypeLabels = {
  file: '파일',
  link: '링크',
  paper: '논문',
  dataset: '데이터셋',
  code: '코드',
  document: '문서',
};

export function IdeaDetailDialog({
  idea,
  isOpen,
  onClose,
  onSubmitComment,
  onUploadResource,
  onCreateEvolution,
}: IdeaDetailDialogProps) {
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 리소스 추가 폼
  const [resourceType, setResourceType] = useState<string>('link');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  
  // 아이디어 발전 폼
  const [evolutionTitle, setEvolutionTitle] = useState('');
  const [evolutionContent, setEvolutionContent] = useState('');

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitComment(commentContent);
      setCommentContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddResource = async () => {
    if (!resourceTitle.trim() || !resourceUrl.trim()) return;
    
    await onUploadResource({
      type: resourceType,
      title: resourceTitle,
      url: resourceUrl,
      description: resourceDescription,
    });
    
    // 폼 초기화
    setResourceTitle('');
    setResourceUrl('');
    setResourceDescription('');
  };

  const handleCreateEvolution = async () => {
    if (!evolutionTitle.trim() || !evolutionContent.trim()) return;
    
    await onCreateEvolution(evolutionTitle, evolutionContent);
    
    // 폼 초기화
    setEvolutionTitle('');
    setEvolutionContent('');
  };

  if (!idea) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{idea.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={idea.author.avatar} />
              <AvatarFallback>{idea.author.name[0]}</AvatarFallback>
            </Avatar>
            <span>{idea.author.name}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(idea.created_at), { addSuffix: true, locale: ko })}</span>
          </DialogDescription>
        </DialogHeader>

        {/* 아이디어 내용 */}
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2">아이디어 설명</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {idea.content}
            </p>
          </div>

          {/* 부모 아이디어 */}
          {idea.parent_idea && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>이전 아이디어</span>
              </div>
              <p className="font-medium">{idea.parent_idea.title}</p>
            </div>
          )}

          <Tabs defaultValue="discussion" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="discussion">
                <MessageSquare className="h-4 w-4 mr-2" />
                논의 ({idea.comments?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="resources">
                <Paperclip className="h-4 w-4 mr-2" />
                리소스 ({idea.resources?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="evolution">
                <TrendingUp className="h-4 w-4 mr-2" />
                발전 경로 ({idea.evolved_ideas?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* 논의 탭 */}
            <TabsContent value="discussion" className="space-y-4 mt-4">
              {/* 댓글 목록 */}
              <div className="space-y-4">
                {idea.comments?.map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ko })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {!idea.comments || idea.comments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    아직 논의가 없습니다. 첫 의견을 남겨보세요!
                  </p>
                )}
              </div>

              {/* 댓글 작성 */}
              <div className="space-y-2 pt-4 border-t">
                <Textarea
                  placeholder="의견을 남겨주세요..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={isSubmitting || !commentContent.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    댓글 달기
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* 리소스 탭 */}
            <TabsContent value="resources" className="space-y-4 mt-4">
              {/* 리소스 목록 */}
              <div className="space-y-3">
                {idea.resources?.map((resource: Resource) => {
                  const Icon = resourceTypeIcons[resource.type];
                  return (
                    <div key={resource.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{resource.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {resourceTypeLabels[resource.type]}
                          </Badge>
                        </div>
                        {resource.description && (
                          <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{resource.uploaded_by.name}</span>
                          <span>
                            {formatDistanceToNow(new Date(resource.created_at), { addSuffix: true, locale: ko })}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  );
                })}

                {!idea.resources || idea.resources.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    아직 첨부된 리소스가 없습니다.
                  </p>
                )}
              </div>

              {/* 리소스 추가 */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-sm">리소스 추가</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">종류</label>
                    <select
                      className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                      value={resourceType}
                      onChange={(e) => setResourceType(e.target.value)}
                    >
                      <option value="link">링크</option>
                      <option value="paper">논문</option>
                      <option value="dataset">데이터셋</option>
                      <option value="code">코드</option>
                      <option value="document">문서</option>
                      <option value="file">파일</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">제목</label>
                    <Input
                      placeholder="리소스 제목"
                      value={resourceTitle}
                      onChange={(e) => setResourceTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">URL</label>
                  <Input
                    placeholder="https://..."
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">설명 (선택)</label>
                  <Textarea
                    placeholder="리소스에 대한 간단한 설명..."
                    value={resourceDescription}
                    onChange={(e) => setResourceDescription(e.target.value)}
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddResource} size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    리소스 추가
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* 발전 경로 탭 */}
            <TabsContent value="evolution" className="space-y-4 mt-4">
              {/* 발전된 아이디어 목록 */}
              <div className="space-y-3">
                {idea.evolved_ideas?.map((evolved: EvolutionIdea) => (
                  <div key={evolved.id} className="p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{evolved.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{evolved.author.name}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(evolved.created_at), { addSuffix: true, locale: ko })}</span>
                          <Badge variant="secondary" className="text-xs">
                            {evolved.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {!idea.evolved_ideas || idea.evolved_ideas.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    아직 발전된 아이디어가 없습니다.
                  </p>
                )}
              </div>

              {/* 새 아이디어 작성 */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  이 아이디어를 발전시켜보세요
                </h4>
                <div>
                  <label className="text-xs text-muted-foreground">발전된 아이디어 제목</label>
                  <Input
                    placeholder="새로운 아이디어 제목..."
                    value={evolutionTitle}
                    onChange={(e) => setEvolutionTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">내용</label>
                  <Textarea
                    placeholder="어떻게 발전시킬 수 있을까요?"
                    value={evolutionContent}
                    onChange={(e) => setEvolutionContent(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleCreateEvolution}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    발전된 아이디어 만들기
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}