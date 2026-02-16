'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  ArrowLeft, Rocket, Layout, Zap, 
  Users, CheckCircle2, ExternalLink, 
  Database, Code2, Cpu, Paintbrush, 
  Globe, Smartphone, Bot, Brain, MessageSquare,
  Activity, BarChart3, Clock, Shield, Check, GitBranch, 
  Lightbulb, Target, TrendingUp, Layers
} from 'lucide-react';

export default function ItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/businesses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              사업부 목록
            </Link>
          </Button>
          <Button asChild className="bg-[#CBDD61] hover:bg-[#b8ca50] text-slate-900 font-semibold">
            <Link href="/login">팀 로그인</Link>
          </Button>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-[#f4f7e0] to-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 bg-[#CBDD61]/30 text-slate-800 hover:bg-[#CBDD61]/40">SaaS & Productivity</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 flex items-center justify-center gap-3">
              <Rocket className="h-10 w-10 md:h-16 md:w-16 text-[#CBDD61]" />
              ItWorks
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium">
              우리가 쓰려고 만들었다가, <br className="md:hidden"/>너무 좋아서 출시한 협업 툴
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              아이디어 제안부터 프로젝트 관리, 캔버스 시각화까지.<br/>
              스타트업의 빠른 실행을 돕는 올인원 생산성 플랫폼입니다.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-[#CBDD61] hover:bg-[#b8ca50] text-slate-900 font-bold" asChild>
                <a href="https://itworks-evotree.web.app/" target="_blank" rel="noopener noreferrer">
                  제품 보러가기 <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 기능 */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">핵심 기능</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-[#eef3cd] hover:border-[#CBDD61] transition-colors shadow-sm hover:shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-[#CBDD61]/20 rounded-lg flex items-center justify-center mb-4">
                <Layout className="h-6 w-6 text-[#97a82b]" />
              </div>
              <CardTitle>Idea Board</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                칸반 보드, 그리드, 타임라인 등 다양한 뷰를 통해 아이디어의 상태를 직관적으로 관리합니다.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#97a82b]" />
                  <span>실시간 드래그 앤 드롭</span>
                </div>
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#97a82b]" />
                  <span>간트 차트 자동 생성</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#eef3cd] hover:border-[#CBDD61] transition-colors shadow-sm hover:shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-[#CBDD61]/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-[#97a82b]" />
              </div>
              <CardTitle>Infinite Canvas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                아이디어 간의 관계를 시각화하고 마인드맵처럼 확장할 수 있는 무한 캔버스 공간입니다.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#97a82b]" />
                  <span>노드 연결 및 메모</span>
                </div>
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#97a82b]" />
                  <span>자유로운 아이데이션</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#eef3cd] hover:border-[#CBDD61] transition-colors shadow-sm hover:shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-[#CBDD61]/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#97a82b]" />
              </div>
              <CardTitle>Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                댓글, 좋아요, 실시간 알림을 통해 팀원들과 끊김 없이 소통하고 의사결정을 내립니다.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#97a82b]" />
                  <span>실시간 알림 센터</span>
                </div>
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#97a82b]" />
                  <span>Tiptap 리치 텍스트 에디터</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>


      {/* Problem / Solution */}
      <section className="container mx-auto px-4 py-20 lg:py-28">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">좋은 아이디어가 사라지고 있습니다</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            메시지에 묻히고, 흩어진 메모에 잊혀지고, 회의록에서 증발합니다.
            <br />
            ItWorks는 아이디어가 태어나는 순간부터 실행까지 추적합니다.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: Target,
              problem: '아이디어가 흩어져 있음',
              solution: '한 곳에서 수집 · 분류 · 검색',
              desc: '메신저, 문서, 이메일에 흩어진 아이디어를 보드 하나로 통합. 칸반, 그리드, 타임라인 뷰로 자유롭게 관리하세요.',
            },
            {
              icon: TrendingUp,
              problem: '발전 과정을 추적할 수 없음',
              solution: 'Evolution Tree로 계보 시각화',
              desc: '아이디어가 어떻게 발전했는지, 어떤 비판을 거쳤는지, 피벗은 몇 번 했는지 트리 구조로 한눈에 파악합니다.',
            },
            {
              icon: Layers,
              problem: '아이디어 간 연결이 보이지 않음',
              solution: 'Dynamic Canvas로 관계 매핑',
              desc: '메모와 아이디어를 캔버스 위에 배치하고 연결선으로 관계를 표현. 메모를 바로 아이디어로 전환할 수 있습니다.',
            },
          ].map((item) => (
            <Card key={item.problem} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-slate-50/50">
              <CardContent className="p-8">
                <div className="inline-flex p-3 rounded-xl bg-red-100 text-red-600 mb-6">
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-red-500 mb-2">{item.problem}</p>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{item.solution}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Core Features Detail */}
      <section id="features" className="bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">아이디어를 실행으로 바꾸는 4가지 도구</h2>
            <p className="text-lg text-slate-600">각 도구가 유기적으로 연결되어 아이디어의 전체 라이프사이클을 관리합니다.</p>
          </div>

          {/* Feature 1 - Idea Board */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 max-w-7xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-sm font-medium mb-6">
                <Lightbulb className="h-4 w-4" /> 수집 & 관리
              </div>
              <h3 className="text-3xl font-bold mb-4">아이디어 보드</h3>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                떠오르는 아이디어를 즉시 캡처하고, 상태별로 관리하세요. 씨앗 단계부터 구현 완료까지 아이디어의 성장을 추적합니다.
              </p>
              <ul className="space-y-4">
                {[
                  '칸반 보드로 상태 흐름 관리 (씨앗 → 검토 → 실행 → 완료)',
                  '그리드 뷰로 전체 아이디어를 한눈에',
                  '타임라인 뷰로 시간 순서대로 정렬',
                  '카테고리, 우선순위, 태그로 필터링',
                  '좋아요와 댓글로 팀원 피드백 수집',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-slate-700">
                    <Check className="h-5 w-5 text-[#97a82b] mt-0.5 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 aspect-[4/3] flex items-center justify-center border border-amber-100 shadow-sm">
              {/* Visual Placeholder */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md opacity-80">
                {['씨앗', '검토 중', '구현 완료'].map((s) => (
                  <div key={s} className="bg-white rounded-xl p-4 shadow-sm border border-amber-100/50">
                    <p className="text-xs font-bold text-amber-800 mb-3">{s}</p>
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-slate-100 rounded-lg h-10 mb-2 last:mb-0" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2 - Evolution Tree */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 max-w-7xl mx-auto">
            <div className="order-2 lg:order-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 aspect-[4/3] flex items-center justify-center border border-green-100 shadow-sm">
              <div className="space-y-6 w-full max-w-xs opacity-90">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200 text-center font-bold text-green-900">원본 아이디어</div>
                <div className="flex justify-center h-8">
                  <div className="w-0.5 bg-green-300" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 rounded-xl p-3 shadow-sm border border-green-100 text-center text-sm">발전 A</div>
                  <div className="bg-white/80 rounded-xl p-3 shadow-sm border border-green-100 text-center text-sm">피벗 B</div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-sm font-medium mb-6">
                <GitBranch className="h-4 w-4" /> 발전 & 추적
              </div>
              <h3 className="text-3xl font-bold mb-4">Evolution Tree</h3>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                아이디어가 어떻게 진화했는지 계보를 추적합니다. 원본에서 파생된 발전, 비판, 피벗을 트리 구조로 시각화하여 의사결정의 맥락을 보존합니다.
              </p>
              <ul className="space-y-4">
                {[
                  '부모-자식 관계로 아이디어 계보 자동 구성',
                  '발전 / 비판 / 피벗 유형별 분류',
                  '세대(Generation) 깊이 표시',
                  '3세대 이상 발전 시 루트 아이디어 자동 보관 제안',
                  '노드 클릭으로 아이디어 상세 바로 확인',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-slate-700">
                    <Check className="h-5 w-5 text-[#97a82b] mt-0.5 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3 - Dynamic Canvas */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 max-w-7xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-sm font-medium mb-6">
                <Cpu className="h-4 w-4" /> 연결 & 시각화
              </div>
              <h3 className="text-3xl font-bold mb-4">Dynamic Canvas</h3>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                무한 화이트보드에서 메모와 아이디어를 자유롭게 배치하고 연결하세요. 브레인스토밍부터 프로젝트 구조화까지, 생각의 흐름을 그대로 캔버스에 담습니다.
              </p>
              <ul className="space-y-4">
                {[
                  '메모 노드 → 아이디어 노드 원클릭 전환',
                  '드래그 & 드롭으로 자유로운 배치',
                  '연결선으로 아이디어 간 관계 표현',
                  '캔버스에서 바로 프로젝트/태스크로 전환',
                  'Pro: 실시간 멀티 커서로 팀 동시 작업',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-slate-700">
                    <Check className="h-5 w-5 text-[#97a82b] mt-0.5 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-[#f4f7e0] rounded-3xl p-8 aspect-[4/3] flex items-center justify-center border border-blue-100 shadow-sm">
              <div className="relative w-full max-w-sm h-56">
                <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-200 rounded-lg p-4 shadow-sm w-32">
                  <p className="font-bold text-yellow-800 text-xs">Memo</p>
                  <div className="h-1.5 bg-yellow-300/50 rounded mt-2 w-3/4"/>
                </div>
                <div className="absolute top-12 right-4 bg-white border-l-4 border-[#CBDD61] rounded-lg p-4 shadow-sm w-32">
                  <p className="font-bold text-slate-800 text-xs">Idea</p>
                  <div className="h-1.5 bg-slate-100 rounded mt-2 w-full"/>
                </div>
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                  <path d="M 140 50 Q 180 50, 220 80" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" fill="none" />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature 4 - AI Insight */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
            <div className="order-2 lg:order-1 bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl p-8 aspect-[4/3] flex items-center justify-center border border-purple-100 shadow-sm">
              <div className="space-y-4 w-full max-w-xs">
                <div className="bg-white rounded-xl p-5 shadow-md border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-bold text-purple-700">AI 분석 결과</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "현재 제안하신 아이디어는 기존 <strong>프로젝트 A</strong>와 85% 유사합니다. 두 아이디어를 통합하여 시너지를 내는 것을 추천합니다."
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-purple-700 bg-purple-100 px-3 py-1 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" /> AI 인사이트
              </div>
              <h3 className="text-3xl font-bold mb-4">AI Insight Booster</h3>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Claude AI가 팀의 아이디어를 분석하여 놓치고 있는 연결고리를 찾아줍니다. 유사 아이디어 발견, 발전 방향 제안, 아이디어 정제까지 AI가 도와줍니다.
              </p>
              <ul className="space-y-4">
                {[
                  '유사 아이디어 자동 매칭으로 중복 방지',
                  '프로젝트 컨텍스트 기반 발전 방향 3가지 제안',
                  '아이디어 정제: 강점/약점 분석 + 개선안',
                  '리소스 나이스레터 기반 지식 연결 (곧 출시)',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-slate-700">
                    <Check className="h-5 w-5 text-[#97a82b] mt-0.5 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 text-sm text-purple-700 bg-purple-50 px-4 py-2 rounded-lg border border-purple-100">
                <Zap className="h-4 w-4 fill-current" /> Pro / Enterprise 전용 기능
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Features */}
      <section className="container mx-auto px-4 py-20 lg:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">그리고 더 많은 것들</h2>
          <p className="text-lg text-slate-600">팀의 생산성을 높이는 부가 기능들</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { icon: MessageSquare, title: '컨텍스트 채팅', desc: '아이디어별 타임라인 채팅으로 맥락 없는 대화를 없애세요. @멘션으로 팀원을 바로 호출.' },
            { icon: Activity, title: '활동 피드', desc: '누가 어떤 아이디어를 만들고, 발전시키고, 댓글을 달았는지 실시간 타임라인으로 확인.' },
            { icon: BarChart3, title: '대시보드 & 분석', desc: '프로젝트별 KPI, 아이디어 전환율, 팀원별 기여도를 한눈에 파악.' },
            { icon: Users, title: '팀 협업', desc: '멤버 초대, 역할 관리(소유자/관리자/멤버), 워크스페이스 단위 데이터 격리.' },
            { icon: Clock, title: '실시간 동기화', desc: 'Firestore 실시간 구독으로 모든 변경사항이 즉시 반영. 새로고침 불필요.' },
            { icon: Shield, title: '보안 & 권한', desc: '워크스페이스 멤버만 데이터 접근 가능.' },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-[#CBDD61] transition-all">
              <div className="w-10 h-10 bg-[#f4f7e0] rounded-lg flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-[#97a82b]" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Built With</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center p-6 hover:border-[#CBDD61] transition-colors">
                <div className="mx-auto w-10 h-10 bg-black rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-xs">N</span>
                </div>
                <div className="font-bold text-lg mb-1">Next.js 15</div>
                <p className="text-xs text-muted-foreground">App Router & Server Actions</p>
              </Card>
              <Card className="text-center p-6 hover:border-[#CBDD61] transition-colors">
                <div className="mx-auto w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mb-3 text-white">
                  <Database className="h-5 w-5" />
                </div>
                <div className="font-bold text-lg mb-1">Firebase</div>
                <p className="text-xs text-muted-foreground">Auth, Firestore & Storage</p>
              </Card>
              <Card className="text-center p-6 hover:border-[#CBDD61] transition-colors">
                <div className="mx-auto w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mb-3 text-white">
                  <Cpu className="h-5 w-5" />
                </div>
                <div className="font-bold text-lg mb-1">React Flow</div>
                <p className="text-xs text-muted-foreground">Node-based Interactive UI</p>
              </Card>
              <Card className="text-center p-6 hover:border-[#CBDD61] transition-colors">
                <div className="mx-auto w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-3 text-white">
                  <Paintbrush className="h-5 w-5" />
                </div>
                <div className="font-bold text-lg mb-1">Tailwind + Shadcn</div>
                <p className="text-xs text-muted-foreground">Modern Styling System</p>
              </Card>
              <Card className="text-center p-6 hover:border-[#CBDD61] transition-colors md:col-start-2">
                <div className="mx-auto w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mb-3 text-white">
                  <Code2 className="h-5 w-5" />
                </div>
                <div className="font-bold text-lg mb-1">Tiptap</div>
                <p className="text-xs text-muted-foreground">Rich Text Editor Framework</p>
              </Card>
              <Card className="text-center p-6 hover:border-[#CBDD61] transition-colors">
                <div className="mx-auto w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-3 text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="font-bold text-lg mb-1">Vercel</div>
                <p className="text-xs text-muted-foreground">Global Edge Deployment</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 로드맵 */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Future Roadmap</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Phase 1 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-[#CBDD61] shrink-0 shadow-[0_0_0_4px_rgba(203,221,97,0.2)]"></div>
              <div className="w-0.5 h-full bg-slate-200 my-1"></div>
            </div>
            <div className="pb-8 pt-0.5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                Phase 1: Internal Tool <Badge variant="secondary" className="bg-[#CBDD61]/20 text-[#8a9926] text-xs">완료</Badge>
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                자사 3개 사업부(HeungHan, Substract, Sensus) 관리를 위한 MVP 개발 및 검증 완료. <br/>
                기본적인 칸반 보드, 캔버스 기능 구현 및 실무 적용 테스트 통과.
              </p>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-[#CBDD61] shrink-0 shadow-[0_0_0_4px_rgba(203,221,97,0.2)] animate-pulse"></div>
              <div className="w-0.5 h-full bg-slate-200 my-1"></div>
            </div>
            <div className="pb-8 pt-0.5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                Phase 2: Public Beta <Badge className="bg-[#CBDD61] text-slate-900 hover:bg-[#b8ca50] text-xs">현재 단계</Badge>
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                외부 스타트업 대상 클로즈드 베타 서비스 운영 및 피드백 수집 중. <br/>
                초기 사용자를 위한 온보딩 프로세스 개선 및 데이터 마이그레이션 도구 개발.
              </p>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-slate-300 shrink-0"></div>
            </div>
            <div className="pt-0.5">
              <h3 className="text-lg font-bold text-slate-500 flex items-center gap-2">
                Phase 3: Global SaaS
              </h3>
              <p className="text-slate-400 mt-1 text-sm">
                <span className="block mb-1 flex items-center gap-2"><Smartphone className="h-3 w-3" /> 모바일 앱 (iOS/Android) 출시</span>
                <span className="block mb-1 flex items-center gap-2"><Bot className="h-3 w-3" /> AI 어시스턴트: 아이디어 자동 분류 및 요약</span>
                <span className="block flex items-center gap-2"><Globe className="h-3 w-3" /> 다국어 지원 및 Slack/Jira 연동 강화</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            복잡한 도구는 이제 그만.
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            아이디어에서 실행까지, 끊김 없는 흐름을 경험하세요.<br/>
            가장 직관적인 협업 툴, ItWorks입니다.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-[#CBDD61] hover:bg-[#b8ca50] text-slate-900 font-bold px-8 h-12 text-base" asChild>
              <a href="https://itworks-evotree.web.app/" target="_blank" rel="noopener noreferrer">
                무료로 시작하기
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}