// src/components/editor/tiptap-editor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table';
import { TableHeader } from '@tiptap/extension-table';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Button } from '@/components/ui/button';
import {
  Bold, Italic, Strikethrough, Underline as UnderlineIcon,
  List, ListOrdered, ListChecks,
  Quote, Code, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight,
  Highlighter, Link as LinkIcon, ImageIcon,
  Table as TableIcon, Minus, Undo2, Redo2, Type,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

// 툴팁 래퍼
function ToolBtn({
  onClick, active, tooltip, children, className = '',
}: {
  onClick: () => void; active?: boolean; tooltip: string; children: React.ReactNode; className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      className={`relative group p-1.5 rounded-md transition-colors ${
        active ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
      } ${className}`}
    >
      {children}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {tooltip}
      </span>
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-slate-200 mx-0.5 shrink-0" />;
}

// 툴바
const EditorToolbar = ({ editor }: { editor: any }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) return null;

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const addImage = () => {
    const url = prompt('이미지 URL을 입력하세요');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const iconSize = 'h-3.5 w-3.5';

  return (
    <div className="border-b bg-slate-50/80 rounded-t-md sticky top-0 z-10 max-w-full overflow-hidden">
      {/* 메인 툴바 - 스크롤 가능 */}
      <div className="flex items-center gap-0.5 p-1.5 overflow-x-auto scrollbar-hide max-w-full">
        {/* 실행 취소/다시 실행 */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} tooltip="실행 취소 (Ctrl+Z)">
          <Undo2 className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} tooltip="다시 실행 (Ctrl+Y)">
          <Redo2 className={iconSize} />
        </ToolBtn>

        <Divider />

        {/* 텍스트 스타일 */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} tooltip="굵게 (Ctrl+B)">
          <Bold className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} tooltip="기울임 (Ctrl+I)">
          <Italic className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} tooltip="밑줄 (Ctrl+U)">
          <UnderlineIcon className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} tooltip="취소선">
          <Strikethrough className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} tooltip="형광펜">
          <Highlighter className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} tooltip="인라인 코드">
          <Code className={iconSize} />
        </ToolBtn>

        <Divider />

        {/* 헤딩 */}
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} tooltip="제목 1">
          <Heading1 className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} tooltip="제목 2">
          <Heading2 className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} tooltip="제목 3">
          <Heading3 className={iconSize} />
        </ToolBtn>

        <Divider />

        {/* 리스트 */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} tooltip="글머리 기호">
          <List className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} tooltip="번호 매기기">
          <ListOrdered className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} tooltip="체크리스트">
          <ListChecks className={iconSize} />
        </ToolBtn>

        <Divider />

        {/* 정렬 */}
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} tooltip="왼쪽 정렬">
          <AlignLeft className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} tooltip="가운데 정렬">
          <AlignCenter className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} tooltip="오른쪽 정렬">
          <AlignRight className={iconSize} />
        </ToolBtn>

        <Divider />

        {/* 블록 요소 */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} tooltip="인용문">
          <Quote className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} tooltip="코드 블록">
          <Code className={`${iconSize} rotate-12`} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip="구분선">
          <Minus className={iconSize} />
        </ToolBtn>

        <Divider />

        {/* 삽입 */}
        <ToolBtn onClick={() => setShowLinkInput(!showLinkInput)} active={editor.isActive('link')} tooltip="링크 삽입">
          <LinkIcon className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={addImage} tooltip="이미지 삽입">
          <ImageIcon className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={addTable} tooltip="표 삽입 (3x3)">
          <TableIcon className={iconSize} />
        </ToolBtn>
      </div>

      {/* 링크 입력 바 */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-2 pb-2">
          <input
            type="url"
            placeholder="https://..."
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addLink()}
            className="flex-1 h-7 text-sm border rounded px-2 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            autoFocus
          />
          <Button size="sm" className="h-7 text-xs" onClick={addLink}>확인</Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); }}>제거</Button>
        </div>
      )}

      {/* 표 컨트롤 (표 안에 커서가 있을 때만) */}
      {editor.isActive('table') && (
        <div className="flex items-center gap-1 px-2 pb-1.5 text-[11px]">
          <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="px-2 py-0.5 bg-slate-100 rounded hover:bg-slate-200 text-slate-600">열 추가</button>
          <button onClick={() => editor.chain().focus().addRowAfter().run()} className="px-2 py-0.5 bg-slate-100 rounded hover:bg-slate-200 text-slate-600">행 추가</button>
          <button onClick={() => editor.chain().focus().deleteColumn().run()} className="px-2 py-0.5 bg-red-50 rounded hover:bg-red-100 text-red-600">열 삭제</button>
          <button onClick={() => editor.chain().focus().deleteRow().run()} className="px-2 py-0.5 bg-red-50 rounded hover:bg-red-100 text-red-600">행 삭제</button>
          <button onClick={() => editor.chain().focus().deleteTable().run()} className="px-2 py-0.5 bg-red-50 rounded hover:bg-red-100 text-red-600">표 삭제</button>
        </div>
      )}
    </div>
  );
};

export default function TiptapEditor({
  content,
  onChange,
  editable = true,
  placeholder = '내용을 입력하세요... ( / 로 명령어 사용)',
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false, // 별도 확장 사용
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, autolink: true }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Image.configure({ inline: true }),
      HorizontalRule,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4 text-slate-700 ${!editable ? 'bg-slate-50 rounded-md border' : ''}`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      if ((editor.isEditable && content === '') || !editor.isEditable) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) editor.setEditable(editable);
  }, [editable, editor]);

  if (!editor) {
    return <div className="border rounded-md w-full h-[200px] bg-slate-50 animate-pulse" />;
  }

  return (
    <div className={`border rounded-md w-full overflow-hidden bg-white shadow-sm max-w-full ${className || ''}`}>
      {editable && <EditorToolbar editor={editor} />}


      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror { line-height: 1.7; overflow-wrap: break-word; word-break: break-word; }
        .ProseMirror p { margin-bottom: 0.5em; }
        .ProseMirror h1 { font-size: 1.75em; font-weight: 700; margin: 1em 0 0.4em; }
        .ProseMirror h2 { font-size: 1.35em; font-weight: 700; margin: 0.8em 0 0.3em; }
        .ProseMirror h3 { font-size: 1.15em; font-weight: 600; margin: 0.7em 0 0.3em; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.5em; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.5em; }
        .ProseMirror ul[data-type="taskList"] { list-style: none; padding-left: 0; }
        .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5em; margin-bottom: 0.25em; }
        .ProseMirror ul[data-type="taskList"] li > label { flex: 0 0 auto; margin-top: 0.25em; }
        .ProseMirror ul[data-type="taskList"] li > label input[type="checkbox"] { width: 16px; height: 16px; accent-color: #6366f1; cursor: pointer; }
        .ProseMirror ul[data-type="taskList"] li > div { flex: 1 1 auto; }
        .ProseMirror blockquote { border-left: 3px solid #6366f1; padding-left: 1em; color: #64748b; font-style: italic; margin: 0.5em 0; }
        .ProseMirror code { background-color: #f1f5f9; padding: 0.15em 0.35em; border-radius: 0.25em; font-size: 0.85em; font-family: 'SF Mono', monospace; color: #e11d48; }
        .ProseMirror pre { background-color: #1e293b; color: #f8fafc; padding: 0.75em 1em; border-radius: 0.5em; overflow-x: auto; margin: 0.5em 0; }
        .ProseMirror pre code { background: transparent; padding: 0; color: inherit; font-size: 0.85em; }
        .ProseMirror a { color: #4f46e5; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
        .ProseMirror a:hover { color: #3730a3; }
        .ProseMirror hr { border: none; border-top: 2px solid #e2e8f0; margin: 1em 0; }
        .ProseMirror mark { background-color: #fef08a; padding: 0.1em 0.2em; border-radius: 0.15em; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5em; margin: 0.5em 0; }
        .ProseMirror table { border-collapse: collapse; width: 100%; margin: 0.5em 0; overflow: hidden; table-layout: fixed; }
        .ProseMirror table td, .ProseMirror table th { border: 1px solid #e2e8f0; padding: 0.4em 0.6em; min-width: 80px; vertical-align: top; }
        .ProseMirror table th { background-color: #f8fafc; font-weight: 600; text-align: left; }
        .ProseMirror table .selectedCell { background-color: #eef2ff; }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #94a3b8; content: attr(data-placeholder); float: left; height: 0; pointer-events: none;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
