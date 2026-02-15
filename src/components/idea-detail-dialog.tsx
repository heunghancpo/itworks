// src/components/idea-detail-dialog.tsx
'use client';

import { useState } from 'react';
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
  ExternalLink,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore'; // Firestore Timestamp 타입 임포트

// 날짜 변환 헬퍼 함수
function getSafeDate(date: any) {
  if (!date) return new Date();
  // Firestore Timestamp인 경우 toDate() 호출
  if (date instanceof Timestamp || (date && typeof date.toDate === 'function')) {
    return date.toDate();
  }
  // 이미 Date 객체이거나 문자열/숫자인 경우
  return new Date(date);
}

interface IdeaDetailDialogProps {
  idea: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmitComment: (content: string) => Promise<void>;
  onUploadResource: (resource: { type: string; title: string; url: string; description?: string }) => Promise<void>;
  onCreateEvolution: (title: string, content: string) => Promise<void>;
}

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
  
  // 리소스 추가 폼 상태
  const [resourceType, setResourceType] = useState<string>('link');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  
  // 아이디어 발전 폼 상태
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
    setResourceTitle('');
    setResourceUrl('');
    setResourceDescription('');
  };

  const handleCreateEvolution = async () => {
    if (!evolutionTitle.trim() || !evolutionContent.trim()) return;
    await onCreateEvolution(evolutionTitle, evolutionContent);
    setEvolutionTitle('');
    setEvolutionContent('');
  };

  if (!idea) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-bold leading-tight">{idea.title}</DialogTitle>
            <Badge variant={idea.status === 'approved' ? 'default' : 'secondary'} className="shrink-0">
              {idea.status}
            </Badge>
          </div>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              {/* author 객체 안전하게 접근 */}
              <AvatarImage src={idea.author?.avatar} />
              <AvatarFallback>{idea.author?.name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">{idea.author?.name || '익명'}</span>
            <span className="text-muted-foreground">•</span>
            {/* ✅ 날짜 오류 수정 적용됨 */}
            <span>{formatDistanceToNow(getSafeDate(idea.createdAt), { addSuffix: true, locale: ko })}</span>
          </DialogDescription>
        </DialogHeader>

        {/* 본문 내용 */}
        <div className="space-y-6 mt-4">
          <div className="bg-slate-50 p-4 rounded-lg border">
            <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-700">
              {idea.content}
            </p>
          </div>

          {/* 태그 목록 */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {idea.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-slate-500">#{tag}</Badge>
              ))}
            </div>
          )}

          <Tabs defaultValue="discussion" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100">
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

            {/* 논의(댓글) 탭 */}
            <TabsContent value="discussion" className="space-y-4 mt-4">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {idea.comments?.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3 text-sm">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-white p-3 rounded-lg border shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(getSafeDate(comment.createdAt), { addSuffix: true, locale: ko })}
                        </span>
                      </div>
                      <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {(!idea.comments || idea.comments.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">첫 의견을 남겨보세요!</p>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="의견을 남겨주세요..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmitComment()}
                />
                <Button onClick={handleSubmitComment} disabled={isSubmitting || !commentContent.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            {/* 리소스 탭 */}
            <TabsContent value="resources" className="space-y-4 mt-4">
              <div className="space-y-2">
                {idea.resources?.map((resource: any) => (
                  <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded">
                        {resource.type === 'link' ? <LinkIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{resource.title}</p>
                        <p className="text-xs text-muted-foreground">{resource.description || resource.url}</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                ))}
              </div>
              <div className="border-t pt-4 space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  <select 
                    className="col-span-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                  >
                    <option value="link">링크</option>
                    <option value="file">파일</option>
                  </select>
                  <Input 
                    placeholder="제목" 
                    className="col-span-3"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                  />
                </div>
                <Input 
                  placeholder="URL 주소" 
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                />
                <Button onClick={handleAddResource} className="w-full" size="sm" variant="outline">
                  <Paperclip className="h-4 w-4 mr-2" /> 리소스 추가
                </Button>
              </div>
            </TabsContent>

            {/* 발전 경로 탭 */}
            <TabsContent value="evolution" className="space-y-4 mt-4">
              <div className="space-y-3">
                {idea.evolved_ideas?.map((evolved: any) => (
                  <div key={evolved.id} className="p-3 border border-indigo-100 bg-indigo-50/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <span className="font-semibold text-sm text-indigo-900">{evolved.title}</span>
                    </div>
                    <div className="text-xs text-indigo-700 flex gap-2">
                      <span>{evolved.author.name}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(getSafeDate(evolved.createdAt), { addSuffix: true, locale: ko })}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-3">
                <Input 
                  placeholder="발전된 아이디어 제목" 
                  value={evolutionTitle}
                  onChange={(e) => setEvolutionTitle(e.target.value)}
                />
                <Textarea 
                  placeholder="어떻게 발전시킬 수 있을까요?" 
                  value={evolutionContent}
                  onChange={(e) => setEvolutionContent(e.target.value)}
                  rows={2}
                />
                <Button onClick={handleCreateEvolution} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <TrendingUp className="h-4 w-4 mr-2" /> 가지 뻗기 (Evolve)
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}