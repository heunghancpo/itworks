'use client';

import { Handle, Position, NodeResizer } from 'reactflow';
import { MessageSquare, Paperclip, Pencil } from 'lucide-react';

const statusColors: any = {
  proposed: 'border-blue-300 bg-blue-50',
  discussing: 'border-purple-300 bg-purple-50',
  approved: 'border-green-300 bg-green-50',
  implemented: 'border-gray-300 bg-gray-50',
  rejected: 'border-red-300 bg-red-50',
};

export default function IdeaNode({ data, selected }: any) {
  const { title, status, commentsCount, resourcesCount, authorName } = data;

  return (
    <>
      <NodeResizer
        color="#6366f1"
        isVisible={selected}
        minWidth={200}
        minHeight={100}
        onResizeEnd={(_, params) => {
          if (data.onResize) {
            data.onResize(params.width, params.height);
          }
        }}
      />

      <div className={`w-full h-full px-4 py-3 shadow-md rounded-xl bg-white border-2 transition-all hover:shadow-xl ${statusColors[status] || 'border-gray-200'}`}>
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />

        <div className="flex flex-col gap-2 h-full">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground font-medium truncate max-w-[80px]">{authorName}</span>
            <div className="flex items-center gap-1">
              {data.onEdit && (
                <button
                  onClick={(e) => { e.stopPropagation(); data.onEdit(); }}
                  className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="수정"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              )}
              <div className={`w-2 h-2 rounded-full ${status === 'approved' ? 'bg-green-500' : status === 'discussing' ? 'bg-purple-500' : status === 'implemented' ? 'bg-gray-500' : 'bg-blue-500'}`} />
            </div>
          </div>

          <div className="font-bold text-sm line-clamp-3 leading-tight flex-1">
            {title}
          </div>

          <div className="flex gap-3 mt-1 text-muted-foreground">
            {commentsCount > 0 && (
              <div className="flex items-center text-xs gap-1">
                <MessageSquare className="w-3 h-3" /> {commentsCount}
              </div>
            )}
            {resourcesCount > 0 && (
              <div className="flex items-center text-xs gap-1">
                <Paperclip className="w-3 h-3" /> {resourcesCount}
              </div>
            )}
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-400" />
      </div>
    </>
  );
}
