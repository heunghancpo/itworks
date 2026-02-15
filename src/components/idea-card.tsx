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
  User
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Idea {
  id: string;
  title: string;
  content: string;
  status: 'proposed' | 'discussing' | 'approved' | 'implemented' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  project: {
    title: string;
    business: {
      name: string;
      color: string;
    };
  };
  parent_idea?: {
    id: string;
    title: string;
  };
  resources_count?: number;
}

interface IdeaCardProps {
  idea: Idea;
  onLike: (ideaId: string) => void;
  onComment: (ideaId: string) => void;
  onEvolve: (ideaId: string) => void;
  onDelete?: (ideaId: string) => void;
  isLiked?: boolean;
}

const statusColors = {
  proposed: 'bg-blue-100 text-blue-800',
  discussing: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  implemented: 'bg-gray-100 text-gray-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusLabels = {
  proposed: '제안',
  discussing: '논의중',
  approved: '승인',
  implemented: '구현완료',
  rejected: '보류',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
};

const priorityLabels = {
  low: '낮음',
  medium: '보통',
  high: '높음',
  urgent: '긴급',
};

export function IdeaCard({ idea, onLike, onComment, onEvolve, onDelete, isLiked = false }: IdeaCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  
  const shortContent = idea.content.length > 150 
    ? idea.content.substring(0, 150) + '...' 
    : idea.content;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* 부모 아이디어 표시 (발전된 아이디어인 경우) */}
            {idea.parent_idea && (
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>
                  <span className="font-medium">{idea.parent_idea.title}</span>에서 발전됨
                </span>
              </div>
            )}
            
            <CardTitle className="text-lg font-semibold leading-tight">
              {idea.title}
            </CardTitle>
            
            <CardDescription className="flex items-center gap-2 mt-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={idea.author.avatar} />
                <AvatarFallback>{idea.author.name[0]}</AvatarFallback>
              </Avatar>
              <span>{idea.author.name}</span>
              <span>•</span>
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(idea.created_at), { addSuffix: true, locale: ko })}</span>
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEvolve(idea.id)}>
                <TrendingUp className="mr-2 h-4 w-4" />
                이 아이디어 발전시키기
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                태스크로 전환
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(idea.id)}
                  className="text-red-600"
                >
                  삭제
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 태그 & 상태 */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge 
            className={statusColors[idea.status]}
            variant="secondary"
          >
            {statusLabels[idea.status]}
          </Badge>
          
          <Badge 
            className={priorityColors[idea.priority]}
            variant="secondary"
          >
            {priorityLabels[idea.priority]}
          </Badge>

          <Badge 
            style={{ 
              backgroundColor: `${idea.project.business.color}20`,
              color: idea.project.business.color,
              borderColor: idea.project.business.color
            }}
            variant="outline"
          >
            {idea.project.business.name}
          </Badge>

          {idea.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {showFullContent ? idea.content : shortContent}
        </p>
        
        {idea.content.length > 150 && (
          <Button
            variant="link"
            size="sm"
            className="px-0 h-auto mt-1"
            onClick={() => setShowFullContent(!showFullContent)}
          >
            {showFullContent ? '접기' : '더 보기'}
          </Button>
        )}
        
        {/* 프로젝트 정보 */}
        <div className="mt-3 text-xs text-muted-foreground">
          프로젝트: <span className="font-medium">{idea.project.title}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex items-center gap-2 w-full">
          <Button
            variant={isLiked ? "default" : "ghost"}
            size="sm"
            className="gap-2"
            onClick={() => onLike(idea.id)}
          >
            <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{idea.likes_count}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => onComment(idea.id)}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{idea.comments_count}</span>
          </Button>

          {idea.resources_count && idea.resources_count > 0 && (
            <Button variant="ghost" size="sm" className="gap-2">
              <Paperclip className="h-4 w-4" />
              <span>{idea.resources_count}</span>
            </Button>
          )}
          
          <div className="ml-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEvolve(idea.id)}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              발전시키기
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}