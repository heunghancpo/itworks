// src/components/timeline/timeline-view.tsx
'use client';

import React from 'react';
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface TimelineViewProps {
  ideas: any[];
  onTaskClick: (idea: any) => void;
}

export function TimelineView({ ideas, onTaskClick }: TimelineViewProps) {
  // 아이디어 데이터를 간트 차트 Task 형식으로 변환
  const tasks: Task[] = useMemo(() => {
    if (!ideas || ideas.length === 0) return [];

    return ideas.map((idea) => {
      // 날짜가 없으면 오늘 날짜로 기본 설정 (시각화를 위해)
      const now = new Date();
      const startDate = idea.startDate ? new Date(idea.startDate) : now;
      const endDate = idea.endDate ? new Date(idea.endDate) : new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // 상태별 색상 지정
      let barColor = '#3b82f6'; // blue (proposed)
      if (idea.status === 'discussing') barColor = '#a855f7'; // purple
      if (idea.status === 'approved') barColor = '#22c55e'; // green
      if (idea.status === 'implemented') barColor = '#64748b'; // gray

      return {
        start: startDate,
        end: endDate,
        name: idea.title,
        id: idea.id,
        type: 'task' as const,
        progress: idea.status === 'implemented' ? 100 : idea.status === 'approved' ? 60 : idea.status === 'discussing' ? 30 : 0,
        isDisabled: false,
        styles: { progressColor: barColor, progressSelectedColor: barColor },
        // 추가 데이터
        project: idea.project?.title,
      };
    }).sort((a, b) => a.start.getTime() - b.start.getTime()); // 시작일 순 정렬
  }, [ideas]);

  const handleTaskClick = (task: Task) => {
    const idea = ideas.find((i) => i.id === task.id);
    if (idea) {
      onTaskClick(idea);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl m-4 bg-slate-50/50">
        <p>일정이 설정된 아이디어가 없습니다.</p>
        <p className="text-sm mt-1">아이디어 상세에서 시작일/종료일을 설정해보세요.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">📅 프로젝트 일정</h3>
        <div className="flex gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"/>제안</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"/>논의중</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"/>승인</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <Gantt
            tasks={tasks}
            viewMode={ViewMode.Day}
            locale="ko"
            onClick={handleTaskClick}
            columnWidth={60}
            listCellWidth="155px"
            barFill={60}
            ganttHeight={400}
            barBackgroundColor="#e2e8f0"
            // 한글 폰트 적용 및 스타일 커스텀
            fontFamily="inherit"
            fontSize="12px"
            rowHeight={40}
          />
        </div>
      </div>
    </div>
  );
}