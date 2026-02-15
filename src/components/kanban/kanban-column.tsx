// src/components/kanban/kanban-column.tsx
'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './kanban-card';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
  id: string;
  title: string;
  ideas: any[];
  color: string;
  onCardClick: (idea: any) => void;
}

export function KanbanColumn({ id, title, ideas, color, onCardClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full min-w-[260px] sm:min-w-[280px] w-72 sm:w-80 bg-slate-100/50 rounded-xl border border-slate-200/60 snap-center shrink-0">
      {/* 컬럼 헤더 */}
      <div className={`p-3 border-b border-slate-200 flex items-center justify-between bg-white/50 rounded-t-xl backdrop-blur-sm sticky top-0 z-10`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <h3 className="font-semibold text-sm text-slate-700">{title}</h3>
        </div>
        <Badge variant="secondary" className="bg-white text-slate-500 hover:bg-white text-xs">
          {ideas.length}
        </Badge>
      </div>

      {/* 카드 리스트 영역 */}
      <div ref={setNodeRef} className="flex-1 p-2 overflow-y-auto custom-scrollbar">
        <SortableContext 
          items={ideas.map(idea => idea.id)} 
          strategy={verticalListSortingStrategy}
        >
          {ideas.map((idea) => (
            <KanbanCard 
              key={idea.id} 
              idea={idea} 
              onClick={onCardClick}
            />
          ))}
        </SortableContext>
        
        {ideas.length === 0 && (
          <div className="h-24 flex items-center justify-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-lg m-1">
            아이디어 없음
          </div>
        )}
      </div>
    </div>
  );
}