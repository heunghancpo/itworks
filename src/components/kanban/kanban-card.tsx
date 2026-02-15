// src/components/kanban/kanban-card.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Paperclip } from 'lucide-react';

interface KanbanCardProps {
  idea: any;
  onClick: (idea: any) => void;
}

export function KanbanCard({ idea, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: idea.id, data: { ...idea } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 touch-none">
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow bg-white"
        onClick={() => onClick(idea)}
      >
        <CardHeader className="p-3 pb-0 space-y-0">
          {idea.project?.business && (
            <div className="flex justify-between items-start mb-2">
              <Badge 
                variant="outline" 
                className="text-[10px] px-1.5 py-0 h-5"
                style={{ 
                  color: idea.project.business.color, 
                  borderColor: `${idea.project.business.color}40`,
                  backgroundColor: `${idea.project.business.color}10`
                }}
              >
                {idea.project.business.name}
              </Badge>
              {idea.priority === 'urgent' && <div className="w-2 h-2 rounded-full bg-red-500" />}
            </div>
          )}
          <CardTitle className="text-sm font-medium leading-snug line-clamp-2">
            {idea.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={idea.author?.avatar} />
                <AvatarFallback className="text-[9px]">{idea.author?.name?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <span className="max-w-[60px] truncate">{idea.author?.name}</span>
            </div>
            
            <div className="flex gap-2">
              {(idea.commentsCount > 0) && (
                <div className="flex items-center gap-0.5">
                  <MessageSquare className="h-3 w-3" />
                  <span>{idea.commentsCount}</span>
                </div>
              )}
              {(idea.resourcesCount > 0) && (
                <div className="flex items-center gap-0.5">
                  <Paperclip className="h-3 w-3" />
                  <span>{idea.resourcesCount}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}