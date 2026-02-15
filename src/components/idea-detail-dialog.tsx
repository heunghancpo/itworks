// src/components/idea-detail-dialog.tsx
'use client';

import React, { useState } from 'react';
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
  Pencil,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

function getSafeDate(date: any) {
  if (!date) return new Date();
  if (date instanceof Timestamp || (date && typeof date.toDate === 'function')) {
    return date.toDate();
  }
  return new Date(date);
}

const statusLabels: Record<string, string> = {
  proposed: '제안',
  discussing: '논의중',
  approved: '승인',
  implemented: '구현완료',
};

const statusFlow = ['proposed', 'discussing', 'approved', 'implemented'];

interface IdeaDetailDialogProps {
  idea: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmitComment: (content: string) => Promise<void>;
  onUploadResource: (resource: { type: string; title: string; url: string; description?: string }) => Promise<void>;
  onCreateEvolution: (title: string, content: string) => Promise<void>;
  onStatusChange?: (ideaId: string, newStatus: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  onUpdateComment?: (commentId: string, content: string) => Promise<void>;
  onDeleteResource?: (resourceId: string) => Promise<void>;
  currentUserId?: string;
}

export function IdeaDetailDialog({
  idea,
  isOpen,
  onClose,
  onSubmitComment,
  onUploadResource,
  onCreateEvolution,
  onStatusChange,
  onDeleteComment,
  onUpdateComment,
  onDeleteResource,
  currentUserId,
}: IdeaDetailDialogProps) {
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [resourceType, setResourceType] = useState<string>('link');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');

  const [evolutionTitle, setEvolutionTitle] = useState('');
  const [evolutionContent, setEvolutionContent] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');

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

  const currentStatusIndex = statusFlow.indexOf(idea.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-bold leading-tight">{idea.title}</DialogTitle>
            <Badge variant={idea.status === 'approved' ? 'default' : 'secondary'} className="shrink-0">
              {statusLabels[idea.status] || idea.status}
            </Badge>
          </div>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={idea.author?.avatar} />
              <AvatarFallback>{idea.author?.name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">{idea.author?.name || '익명'}</span>
            <span className="text-muted-foreground">•</span>
            <span>{formatDistanceToNow(getSafeDate(idea.createdAt), { addSuffix: true, locale: ko })}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="bg-slate-50 p-4 rounded-lg border">
            <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-700">
              {idea.content}
            </p>
          </div>

          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {idea.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-slate-500">#{tag}</Badge>
              ))}
            </div>
          )}

          {/* Status Workflow */}
          {onStatusChange && (
            <div className="flex items-center gap-1.5 p-3 bg-slate-50 rounded-lg border">
              <span className="text-sm font-medium text-slate-600 mr-2 shrink-0">상태:</span>
              {statusFlow.map((s, idx) => {
                const isActive = s === idea.status;
                const isPast = idx < currentStatusIndex;
                return (
                  <React.Fragment key={s}>
                    {idx > 0 && <div className={`h-0.5 w-4 shrink-0 ${isPast ? 'bg-indigo-400' : 'bg-slate-200'}`} />}
                    <button
                      onClick={() => onStatusChange(idea.id, s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0
                        ${isActive ? 'bg-indigo-600 text-white' : isPast ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {statusLabels[s]}
                    </button>
                  </React.Fragment>
                );
              })}
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

            {/* Discussion Tab */}
            <TabsContent value="discussion" className="space-y-4 mt-4">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {idea.comments?.map((comment: any) => {
                  const authorName = comment.authorName || comment.author?.name || '익명';
                  const authorAvatar = comment.authorAvatar || comment.author?.avatar;
                  const authorId = comment.authorId || comment.author?.id;
                  const isOwn = currentUserId && authorId === currentUserId;

                  return (
                    <div key={comment.id} className="flex gap-3 text-sm">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={authorAvatar} />
                        <AvatarFallback>{authorName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-white p-3 rounded-lg border shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{authorName}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(getSafeDate(comment.createdAt), { addSuffix: true, locale: ko })}
                            </span>
                            {isOwn && (
                              <>
                                <Button variant="ghost" size="icon" className="h-6 w-6"
                                  onClick={() => { setEditingCommentId(comment.id); setEditCommentContent(comment.content); }}>
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700"
                                  onClick={() => onDeleteComment?.(comment.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        {editingCommentId === comment.id ? (
                          <div className="flex gap-2">
                            <Input
                              value={editCommentContent}
                              onChange={e => setEditCommentContent(e.target.value)}
                              className="flex-1 h-8 text-sm"
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  onUpdateComment?.(comment.id, editCommentContent);
                                  setEditingCommentId(null);
                                }
                                if (e.key === 'Escape') setEditingCommentId(null);
                              }}
                            />
                            <Button size="icon" className="h-8 w-8" onClick={async () => {
                              await onUpdateComment?.(comment.id, editCommentContent);
                              setEditingCommentId(null);
                            }}>
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingCommentId(null)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
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

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-4 mt-4">
              <div className="space-y-2">
                {idea.resources?.map((resource: any) => (
                  <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                    <a href={resource.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="bg-slate-100 p-2 rounded shrink-0">
                        {resource.type === 'link' ? <LinkIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{resource.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{resource.description || resource.url}</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <a href={resource.url} target="_blank" rel="noreferrer" className="p-1 hover:bg-slate-100 rounded">
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                      </a>
                      {onDeleteResource && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => onDeleteResource(resource.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
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

            {/* Evolution Tab */}
            <TabsContent value="evolution" className="space-y-4 mt-4">
              <div className="space-y-3">
                {idea.evolved_ideas?.map((evolved: any) => {
                  const evolvedAuthor = evolved.authorName || evolved.author?.name || '익명';
                  return (
                    <div key={evolved.id} className="p-3 border border-indigo-100 bg-indigo-50/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-indigo-600" />
                        <span className="font-semibold text-sm text-indigo-900">{evolved.title}</span>
                      </div>
                      <div className="text-xs text-indigo-700 flex gap-2">
                        <span>{evolvedAuthor}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(getSafeDate(evolved.createdAt), { addSuffix: true, locale: ko })}</span>
                      </div>
                    </div>
                  );
                })}
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
