// src/components/kanban/kanban-board.tsx
'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { KanbanCard } from './kanban-card';

const COLUMNS = [
  { id: 'proposed', title: '제안 (Proposed)', color: 'bg-blue-500' },
  { id: 'discussing', title: '논의중 (Discussing)', color: 'bg-purple-500' },
  { id: 'approved', title: '승인 (Approved)', color: 'bg-green-500' },
  { id: 'implemented', title: '구현완료 (Implemented)', color: 'bg-gray-500' },
];

interface KanbanBoardProps {
  ideas: any[];
  onStatusChange: (ideaId: string, newStatus: string) => void;
  onCardClick: (idea: any) => void;
}

export function KanbanBoard({ ideas, onStatusChange, onCardClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px 이상 움직여야 드래그 시작 (클릭과 구분)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 아이디어들을 상태별로 그룹화
  const groupedIdeas = COLUMNS.reduce((acc, col) => {
    acc[col.id] = ideas.filter(idea => idea.status === col.id);
    return acc;
  }, {} as Record<string, any[]>);

  // 드래그 시작 시
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // 드래그 종료 시
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 드롭된 곳이 컬럼인지, 다른 카드인지 확인
    let newStatus = overId;
    
    // 카드 위에 드롭된 경우, 해당 카드의 상태를 찾음
    if (!COLUMNS.find(col => col.id === overId)) {
      const overIdea = ideas.find(i => i.id === overId);
      if (overIdea) {
        newStatus = overIdea.status;
      }
    }

    // 현재 아이디어 찾기
    const activeIdea = ideas.find(i => i.id === activeId);
    
    // 상태가 변경되었다면 업데이트 호출
    if (activeIdea && activeIdea.status !== newStatus && COLUMNS.some(col => col.id === newStatus)) {
      onStatusChange(activeId, newStatus);
    }
  };

  const activeIdea = activeId ? ideas.find(i => i.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-280px)] sm:h-[calc(100vh-220px)] gap-3 sm:gap-6 overflow-x-auto pb-4 items-start snap-x snap-mandatory sm:snap-none">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            ideas={groupedIdeas[col.id] || []}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeIdea ? (
          <div className="w-80 opacity-80 rotate-2 cursor-grabbing">
            <KanbanCard idea={activeIdea} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}