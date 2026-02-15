'use client';

import { useState, useEffect } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { X } from 'lucide-react';

const colors: any = {
  yellow: 'bg-yellow-100 border-yellow-200 text-yellow-900',
  blue: 'bg-blue-100 border-blue-200 text-blue-900',
  green: 'bg-green-100 border-green-200 text-green-900',
  red: 'bg-red-100 border-red-200 text-red-900',
};

export default function MemoNode({ data, id, selected }: any) {
  const [content, setContent] = useState(data.content);

  useEffect(() => {
    setContent(data.content);
  }, [data.content]);

  const handleBlur = () => {
    if (content !== data.content) {
      data.onUpdate?.(id, content);
    }
  };

  return (
    <>
      <NodeResizer
        color="#fbbf24"
        isVisible={selected}
        minWidth={150}
        minHeight={100}
        onResizeEnd={(_, params) => {
          if (data.onResize) {
            data.onResize(params.width, params.height);
          }
        }}
      />

      <div
        className={`w-full h-full p-3 shadow-sm rounded-lg border transition-all flex flex-col
          ${colors[data.color || 'yellow']}
          ${selected ? 'shadow-md' : ''}`}
      >
        <Handle type="target" position={Position.Top} className="opacity-0" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete?.(id);
          }}
          className="absolute top-1.5 right-1.5 p-0.5 text-black/20 hover:text-black/60 transition-colors z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <textarea
          className="w-full h-full bg-transparent border-none resize-none focus:outline-none text-sm font-medium leading-relaxed font-sans nodrag nopan"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          placeholder="메모를 입력하세요..."
        />

        <Handle type="source" position={Position.Bottom} className="opacity-0" />
      </div>
    </>
  );
}
