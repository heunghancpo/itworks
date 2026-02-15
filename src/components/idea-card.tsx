// src/components/idea-card.tsx
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  ThumbsUp, 
  Paperclip, 
  MoreVertical,
  TrendingUp,
  Clock,
  Pencil,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

// 날짜 변환 헬퍼 (중복 방지를 위해 유틸로 빼는 것이 좋으나, 편의상 여기에 포함)
function getSafeDate(date: any) {
  if (!date) return new Date();
  if (date instanceof Timestamp || (date && typeof date.toDate === 'function')) {
    return date.toDate();
  }
  return new Date(date);
}

interface IdeaCardProps {
  idea: any;
  onLike: (ideaId: string) => void;
  onComment: (ideaId: string) => void;
  onEvolve: (ideaId: string) => void;
  onDelete?: (ideaId: string) => void;
  onEdit?: (idea: any) => void; // 수정 핸들러 추가
  isLiked?: boolean;
}

const statusColors: any = {
  proposed: 'bg-blue-100 text-blue-800',
  discussing: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  implemented: 'bg-gray-100 text-gray-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusLabels: any = {
  proposed: '제안',
  discussing: '논의중',
  approved: '승인',
  implemented: '구현완료',
  rejected: '보류',
};

export function IdeaCard({ idea, onLike, onComment, onEvolve, onDelete, onEdit, isLiked = false }: IdeaCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  
  const shortContent = idea.content.length > 150 
    ? idea.content.substring(0, 150) + '...' 
    : idea.content;

  // 프로젝트 정보 안전하게 접근
  const projectTitle = idea.project?.title || '';
  const businessName = idea.project?.business?.name || '';
  const businessColor = idea.project?.business?.color || '#000000';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {idea.parentId && (
              <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground bg-slate-50 w-fit px-2 py-1 rounded">
                <TrendingUp className="h-3 w-3" />
                <span>발전된 아이디어</span>
              </div>
            )}
            
            <CardTitle className="text-lg font-bold leading-tight">
              {idea.title}
            </CardTitle>
            
            <CardDescription className="flex items-center gap-2 mt-2 text-xs">
              <Avatar className="h-5 w-5">
                <AvatarImage src={idea.author?.avatar} />
                <AvatarFallback>{idea.author?.name?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <span>{idea.author?.name || '익명'}</span>
              <span>•</span>
              <Clock className="h-3 w-3" />
              {/* 🚨 날짜 오류 수정 적용 */}
              <span>{formatDistanceToNow(getSafeDate(idea.createdAt), { addSuffix: true, locale: ko })}</span>
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEvolve(idea.id)}>
                <TrendingUp className="mr-2 h-4 w-4" />
                발전시키기 (Evolve)
              </DropdownMenuItem>
              
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(idea)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  수정
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem>
                <LinkIcon className="mr-2 h-4 w-4" />
                링크 복사
              </DropdownMenuItem>
              
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(idea.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge className={statusColors[idea.status] || 'bg-slate-100'} variant="secondary">
            {statusLabels[idea.status] || idea.status}
          </Badge>
          
          {businessName && (
            <Badge 
              style={{ 
                backgroundColor: `${businessColor}15`,
                color: businessColor,
                borderColor: `${businessColor}40`
              }}
              variant="outline"
            >
              {businessName}
            </Badge>
          )}

          {idea.tags?.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs font-normal">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
          {showFullContent ? idea.content : shortContent}
        </p>
        
        {idea.content.length > 150 && (
          <Button
            variant="link"
            size="sm"
            className="px-0 h-auto mt-1 text-slate-400"
            onClick={() => setShowFullContent(!showFullContent)}
          >
            {showFullContent ? '접기' : '더 보기'}
          </Button>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t bg-slate-50/50">
        <div className="flex items-center gap-2 w-full">
          <Button
            variant={isLiked ? "secondary" : "ghost"}
            size="sm"
            className={`gap-1.5 h-8 ${isLiked ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}
            onClick={() => onLike(idea.id)}
          >
            <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{idea.likesCount || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-8 text-slate-500"
            onClick={() => onComment(idea.id)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-xs">{idea.commentsCount || 0}</span>
          </Button>

          {idea.resourcesCount > 0 && (
            <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-slate-500">
              <Paperclip className="h-3.5 w-3.5" />
              <span className="text-xs">{idea.resourcesCount}</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}