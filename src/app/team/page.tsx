// src/app/team/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Rocket, Brain, Code, Wrench, Handshake, Lightbulb } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로
            </Link>
          </Button>
          <Button asChild>
            <Link href="/login">팀 로그인</Link>
          </Button>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">The Founders</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          이게 되네(ItWorks)를 만드는 사람들
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
          아이디어 공유를 즐기는 사람들이 모여, <br />
          상상을 현실의 비즈니스로 만들어가고 있습니다.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* CEO 송현서 */}
          <Card className="text-left hover:shadow-lg transition-shadow border-indigo-100">
            <CardHeader className="text-center pb-2">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                현
              </div>
              <CardTitle className="text-2xl">송현서</CardTitle>
              <p className="text-indigo-600 font-semibold">CEO</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <Badge variant="outline">영업/기획</Badge>
                <Badge variant="outline">운영/재무</Badge>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                회사의 살림을 책임지며 아이디어가 비즈니스가 될 수 있도록 구체적인 실행 계획을 수립합니다. Substract Lab의 일본 시장 진출과 Sensus의 사업 확장을 위한 파트너십을 주도합니다.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm flex items-start gap-2">
                <Handshake className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                <span>미팅 및 글로벌 파트너십 총괄</span>
              </div>
            </CardContent>
          </Card>

          {/* CPO 이정호 */}
          <Card className="text-left hover:shadow-lg transition-shadow border-blue-100">
            <CardHeader className="text-center pb-2">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                호
              </div>
              <CardTitle className="text-2xl">이정호</CardTitle>
              <p className="text-blue-600 font-semibold">CPO</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <Badge variant="outline">메인 아이디어</Badge>
                <Badge variant="outline">전략/제품 설계</Badge>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "이게 될까?" 싶은 혁신적인 아이디어의 발원지입니다. HeungHan의 서비스 구조와 Sensus의 감각 분석 알고리즘 로직 등 핵심 비즈니스 모델을 설계합니다.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span>ItWorks의 비전 및 사업 방향성 제시</span>
              </div>
            </CardContent>
          </Card>

          {/* CTO 이정한 */}
          <Card className="text-left hover:shadow-lg transition-shadow border-orange-100">
            <CardHeader className="text-center pb-2">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                한
              </div>
              <CardTitle className="text-2xl">이정한</CardTitle>
              <p className="text-orange-600 font-semibold">CTO</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <Badge variant="outline">Full Stack</Badge>
                <Badge variant="outline">AI/Deep Learning</Badge>
                <Badge variant="outline">HW 설계</Badge>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                아이디어를 눈에 보이는 현실로 만듭니다. 웹 플랫폼 개발부터 결점두 선별기의 딥러닝 모델링, 하드웨어 제작까지 기술적인 모든 것을 담당합니다.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm flex items-start gap-2">
                <Wrench className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                <span>결점두 선별기 & 진동 제어 모듈 프로토타이핑</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}