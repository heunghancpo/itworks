'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Controls,
  Background,
  MiniMap,
  Panel,
  MarkerType,
  Connection,
  Edge,
  Node,
  NodeChange,
  applyNodeChanges,
  EdgeChange,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';

import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { IdeaDetailDialog } from '@/components/idea-detail-dialog';
import IdeaNode from '@/components/canvas/idea-node';
import MemoNode from '@/components/canvas/memo-node';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Plus, Loader2, StickyNote, Pencil } from 'lucide-react';
import {
  addComment,
  addResource,
  deleteComment,
  updateComment,
  deleteResource,
  createIdea,
  createMemo,
  updateMemo,
  deleteMemo,
  deleteIdea,
  connectIdeas,
  getComments,
  getResources,
  getEvolvedIdeas,
  updateIdea,
  logActivity,
} from '@/lib/firestore-helpers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(() => import('@/components/editor/tiptap-editor'), {
  ssr: false,
  loading: () => <div className="h-40 bg-slate-50 animate-pulse rounded-md" />,
});

const nodeTypes = {
  ideaNode: IdeaNode,
  memoNode: MemoNode,
};

const getLayoutedElements = (nodes: any[], edges: any[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const nodeWidth = 280;
  const nodeHeight = 150;
  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 100, nodesep: 80 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    if (node.position.x !== 0 || node.position.y !== 0) return node;
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function ProjectCanvasPage() {
  const { id: projectId } = useParams();
  const router = useRouter();
  const [user] = useAuthState(auth);
  
  const [project, setProject] = useState<any>(null);
  
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isCreateRootOpen, setIsCreateRootOpen] = useState(false);
  const [rootTitle, setRootTitle] = useState('');
  const [rootContent, setRootContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // 아이디어 수정
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editTags, setEditTags] = useState('');

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      const docRef = doc(db, 'projects', projectId as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setProject({ id: docSnap.id, ...docSnap.data() });
    };
    fetchProject();

    const qIdeas = query(collection(db, 'ideas'), where('projectId', '==', projectId));
    const qMemos = query(collection(db, 'memos'), where('projectId', '==', projectId));
    const qConns = query(collection(db, 'connections'), where('projectId', '==', projectId));

    // 각 컬렉션 데이터를 독립적으로 추적
    let latestIdeas: any[] = [];
    let latestMemos: any[] = [];
    let latestConns: any[] = [];

    const refresh = () => updateGraph(latestIdeas, latestMemos, latestConns);

    const unsubIdeas = onSnapshot(qIdeas, (snap) => {
      latestIdeas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      refresh();
    });
    const unsubMemos = onSnapshot(qMemos, (snap) => {
      latestMemos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      refresh();
    });
    const unsubConns = onSnapshot(qConns, (snap) => {
      latestConns = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      refresh();
    });

    return () => {
      unsubIdeas();
      unsubMemos();
      unsubConns();
    };
  }, [projectId]);

  const updateGraph = (ideas: any[], memos: any[], connections: any[]) => {
    const ideaNodes = ideas.map((idea: any) => ({
      id: idea.id,
      type: 'ideaNode',
      data: { 
        ...idea,
        author: {
          id: idea.authorId,
          name: idea.authorName,
          avatar: idea.authorAvatar
        },
        onResize: (width: number, height: number) => updateIdea(idea.id, { width, height }),
        onEdit: () => handleEditIdea(idea),
      },
      position: idea.position || { x: 0, y: 0 },
      style: idea.width && idea.height ? { width: idea.width, height: idea.height } : undefined,
    }));

    const memoNodes = memos.map((memo: any) => ({
      id: memo.id,
      type: 'memoNode',
      position: memo.position || { x: 100, y: 100 },
      style: memo.width && memo.height ? { width: memo.width, height: memo.height } : undefined,
      data: { 
        ...memo, 
        onDelete: handleDeleteMemo, 
        onUpdate: handleUpdateMemo,
        // 🚨 리사이즈 핸들러 전달
        onResize: (width: number, height: number) => updateMemo(memo.id, { width, height })
      },
    }));

    const hierEdges = ideas
      .filter((idea: any) => idea.parentId)
      .map((idea: any) => ({
        id: `e-${idea.parentId}-${idea.id}`,
        source: idea.parentId,
        target: idea.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
      }));

    const customEdges = connections.map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      animated: true,
      style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' },
      data: { isCustom: true },
    }));

    const { nodes: layoutedIdeaNodes, edges: layoutedEdges } = getLayoutedElements(
      ideaNodes,
      hierEdges
    );

    // 선택 상태 유지: 기존 노드의 selected를 보존
    setNodes((prevNodes) => {
      const selectedIds = new Set(prevNodes.filter(n => n.selected).map(n => n.id));
      const allNew = [...layoutedIdeaNodes, ...memoNodes];
      return allNew.map(n => selectedIds.has(n.id) ? { ...n, selected: true } : n);
    });
    setEdges([...layoutedEdges, ...customEdges]);
  };

  // --- 이벤트 핸들러 ---

  const onNodeDragStop = useCallback((event: any, node: Node) => {
    if (node.type === 'ideaNode') {
      updateIdea(node.id, { position: node.position });
    } else if (node.type === 'memoNode') {
      updateMemo(node.id, { position: node.position });
    }
  }, []);

  const onConnect = useCallback(
    async (params: Connection) => {
      if (!user || !params.source || !params.target) return;
      await connectIdeas(params.source, params.target, projectId as string);
      toast.success('연결되었습니다');
    },
    [projectId, user]
  );

  const handleDeleteMemo = async (memoId: string) => {
    if (confirm('메모를 삭제하시겠습니까?')) {
      await deleteMemo(memoId);
    }
  };

  const handleUpdateMemo = async (memoId: string, content: string) => {
    await updateMemo(memoId, { content });
  };

  const handleAddMemo = async (color: string = 'yellow') => {
    if (!user) return;
    const centerX = 200 + Math.random() * 100;
    const centerY = 200 + Math.random() * 100;

    await createMemo({
      projectId: projectId as string,
      content: '',
      color,
      position: { x: centerX, y: centerY },
      authorId: user.uid,
    });
  };

  const onNodesDelete = useCallback(
    async (nodesToDelete: Node[]) => {
      for (const node of nodesToDelete) {
        if (node.type === 'memoNode') {
          await deleteMemo(node.id);
        } else if (node.type === 'ideaNode') {
          if (confirm(`'${node.data.title}' 아이디어를 정말 삭제하시겠습니까?`)) {
            await deleteIdea(node.id);
          } else {
            toast('아이디어 삭제가 취소되었습니다. 화면을 새로고침해주세요.');
          }
        }
      }
    },
    []
  );

  const onNodeDoubleClick = (_: any, node: any) => {
    if (node.type === 'ideaNode') {
      fetchIdeaDetails(node.data);
      setIsDetailOpen(true);
    }
  };

  const handleEditIdea = (idea: any) => {
    setEditingIdea(idea);
    setEditTitle(idea.title);
    setEditContent(idea.content || '');
    setEditPriority(idea.priority || 'medium');
    setEditTags(idea.tags?.join(', ') || '');
    setIsEditOpen(true);
  };

  const handleSaveEditIdea = async () => {
    if (!editingIdea || !editTitle) return;
    try {
      await updateIdea(editingIdea.id, {
        title: editTitle,
        content: editContent,
        priority: editPriority,
        tags: editTags.split(',').map((t: string) => t.trim()).filter(Boolean),
      });
      toast.success('아이디어가 수정되었습니다');
      setIsEditOpen(false);
    } catch (error) {
      toast.error('수정 실패');
    }
  };

  // 🚨 수정됨: evolvedIdeas 데이터 매핑 (TypeError 방지)
  const fetchIdeaDetails = async (ideaData: any) => {
    try {
      const [comments, resources, rawEvolvedIdeas] = await Promise.all([
        getComments(ideaData.id),
        getResources(ideaData.id),
        getEvolvedIdeas(ideaData.id),
      ]);

      // author 정보가 flat하게 들어오는 것을 객체로 변환
      const evolvedIdeas = rawEvolvedIdeas.map((item: any) => ({
        ...item,
        author: {
          id: item.authorId,
          name: item.authorName,
          avatar: item.authorAvatar
        }
      }));
      
      setSelectedIdea({ ...ideaData, comments, resources, evolved_ideas: evolvedIdeas });
    } catch (e) {
      console.error(e);
      setSelectedIdea(ideaData);
    }
  };

  const handleSubmitComment = async (content: string) => {
    if (!user || !selectedIdea) return;
    await addComment(selectedIdea.id, {
      content,
      authorId: user.uid,
      authorName: user.displayName || '익명',
      authorAvatar: user.photoURL || '',
    });
    fetchIdeaDetails(selectedIdea);
  };

  const handleUploadResource = async (resource: any) => {
    if (!user || !selectedIdea) return;
    await addResource(selectedIdea.id, {
      ...resource,
      uploadedBy: user.uid,
      uploadedByName: user.displayName || '익명',
    });
    fetchIdeaDetails(selectedIdea);
  };

  const handleCreateEvolution = async (title: string, content: string) => {
    if (!user || !selectedIdea) return;
    const parentNode = nodes.find(n => n.id === selectedIdea.id);
    const newPos = parentNode ? { 
      x: parentNode.position.x + 100, 
      y: parentNode.position.y + 250 
    } : { x: 0, y: 0 };

    await createIdea({
      projectId: projectId as string,
      businessId: project?.businessId,
      title,
      content,
      priority: 'medium',
      tags: [],
      authorId: user.uid,
      authorName: user.displayName || '익명',
      authorAvatar: user.photoURL || '',
      parentId: selectedIdea.id,
      position: newPos,
    });
    toast.success('아이디어가 가지를 쳤습니다! 🌱');
    setIsDetailOpen(false);
  };

  const handleStatusChange = async (ideaId: string, newStatus: string) => {
    if (!user) return;
    try {
      await updateIdea(ideaId, { status: newStatus });
      await logActivity({
        userId: user.uid,
        userName: user.displayName || '익명',
        actionType: 'status_changed',
        entityType: 'idea',
        entityId: ideaId,
        metadata: { newStatus },
      });
      toast.success('상태가 변경되었습니다');
      if (selectedIdea && selectedIdea.id === ideaId) {
        fetchIdeaDetails({ ...selectedIdea, status: newStatus });
      }
    } catch (error) {
      console.error(error);
      toast.error('상태 변경 실패');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedIdea) return;
    try {
      await deleteComment(selectedIdea.id, commentId);
      toast.success('댓글이 삭제되었습니다');
      fetchIdeaDetails(selectedIdea);
    } catch (error) {
      toast.error('댓글 삭제 실패');
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    if (!selectedIdea) return;
    try {
      await updateComment(selectedIdea.id, commentId, content);
      toast.success('댓글이 수정되었습니다');
      fetchIdeaDetails(selectedIdea);
    } catch (error) {
      toast.error('댓글 수정 실패');
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!selectedIdea) return;
    try {
      await deleteResource(selectedIdea.id, resourceId);
      toast.success('리소스가 삭제되었습니다');
      fetchIdeaDetails(selectedIdea);
    } catch (error) {
      toast.error('리소스 삭제 실패');
    }
  };

  const handleCreateRootIdeaSubmit = async () => {
    if (!user || !rootTitle.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    setIsCreating(true);
    try {
      await createIdea({
        projectId: projectId as string,
        businessId: project?.businessId,
        title: rootTitle,
        content: rootContent || '프로젝트의 시작점입니다.',
        priority: 'high',
        tags: ['New'],
        authorId: user.uid,
        authorName: user.displayName || '익명',
        authorAvatar: user.photoURL || '',
        position: { x: 300, y: 100 }
      });
      toast.success('아이디어 등록 완료');
      setIsCreateRootOpen(false);
      setRootTitle('');
      setRootContent('');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-[calc(100vh-56px)] lg:h-screen w-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="min-h-[56px] border-b bg-white flex items-center px-3 sm:px-6 justify-between z-10 shadow-sm gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 shrink">
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 sm:h-9 sm:w-9" onClick={() => router.push('/projects')}>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <h1 className="font-bold text-sm sm:text-lg truncate min-w-0">
            {project?.title || 'Loading...'}
          </h1>
          <span className="hidden sm:inline text-xs font-normal text-muted-foreground px-2 py-0.5 bg-slate-100 rounded-full border whitespace-nowrap shrink-0">
            Canvas
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 px-2 sm:px-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200">
                <StickyNote className="w-4 h-4" />
                <span className="hidden sm:inline ml-1.5">메모</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[
                { color: 'yellow', label: '노란색', bg: 'bg-yellow-200' },
                { color: 'blue', label: '파란색', bg: 'bg-blue-200' },
                { color: 'green', label: '초록색', bg: 'bg-green-200' },
                { color: 'red', label: '빨간색', bg: 'bg-red-200' },
              ].map(opt => (
                <DropdownMenuItem key={opt.color} onClick={() => handleAddMemo(opt.color)}>
                  <div className={`w-3 h-3 rounded-full ${opt.bg} mr-2`} />
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="h-8 px-2 sm:px-3" onClick={() => setIsCreateRootOpen(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline ml-1.5">아이디어</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          // 🚨 수정됨: onNodeResizeStop 제거 (노드 내부에서 처리)
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          onNodeDoubleClick={onNodeDoubleClick}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          minZoom={0.1}
          maxZoom={2}
        >
          <Background color="#e2e8f0" gap={20} size={1} />
          <Controls className="bg-white border shadow-md" />
          <MiniMap 
            className="bg-white border shadow-md rounded-lg overflow-hidden" 
            nodeColor={(node) => node.type === 'memoNode' ? '#fde047' : '#3b82f6'}
          />
          <Panel position="top-right" className="bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border m-4">
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold text-slate-500 mb-1">Status</div>
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 bg-blue-500 rounded-full"/> 제안됨</div>
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 bg-purple-500 rounded-full"/> 논의중</div>
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 bg-green-500 rounded-full"/> 승인됨</div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {selectedIdea && (
        <IdeaDetailDialog
          idea={selectedIdea}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onSubmitComment={handleSubmitComment}
          onUploadResource={handleUploadResource}
          onCreateEvolution={handleCreateEvolution}
          onStatusChange={handleStatusChange}
          onDeleteComment={handleDeleteComment}
          onUpdateComment={handleUpdateComment}
          onDeleteResource={handleDeleteResource}
          currentUserId={user?.uid}
        />
      )}

      <Dialog open={isCreateRootOpen} onOpenChange={setIsCreateRootOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>새로운 아이디어 제안</DialogTitle>
            <DialogDescription>
              프로젝트에 새로운 흐름을 만들 아이디어를 기록하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">제목</label>
              <Input
                placeholder="아이디어의 핵심 주제"
                value={rootTitle}
                onChange={(e) => setRootTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">상세 내용</label>
              <Textarea
                placeholder="구체적인 실행 방안이나 배경을 설명해주세요."
                value={rootContent}
                onChange={(e) => setRootContent(e.target.value)}
                rows={5}
              />
            </div>
            {user && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md text-sm border">
                <span className="text-muted-foreground font-medium">기안자</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback>{user.displayName?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-slate-700">{user.displayName || user.email}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateRootOpen(false)}>취소</Button>
            <Button onClick={handleCreateRootIdeaSubmit} disabled={isCreating}>
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              아이디어 등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 아이디어 수정 다이얼로그 */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl w-[calc(100vw-32px)] max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>아이디어 수정</DialogTitle>
            <DialogDescription>아이디어 내용을 수정하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">제목</label>
              <Input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="min-w-0">
              <label className="text-sm font-medium mb-1 block">내용</label>
              <TiptapEditor
                content={editContent}
                onChange={setEditContent}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">우선순위</label>
                <Select value={editPriority} onValueChange={setEditPriority}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">낮음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="high">높음</SelectItem>
                    <SelectItem value="urgent">긴급</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">태그 (쉼표로 구분)</label>
                <Input
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>취소</Button>
              <Button onClick={handleSaveEditIdea}>수정 완료</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}