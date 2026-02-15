'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, Sparkles, Globe, Coffee, Lightbulb } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* 네비게이션 */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold">이게 되네</span>
            <Badge variant="secondary" className="ml-2">ItWorks</Badge>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm hover:text-indigo-600 transition">
              회사 소개
            </Link>
            <Link href="/businesses" className="text-sm hover:text-indigo-600 transition">
              사업부
            </Link>
            <Link href="/team" className="text-sm hover:text-indigo-600 transition">
              팀
            </Link>
          </div>
          
          <Button asChild>
            <Link href="/login">
              팀 로그인
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="outline" className="mb-4">
          Making Ideas Work
        </Badge>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          아이디어를 현실로
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          세 명의 친구가 모여 다양한 아이디어를 사업으로 실현하는 여정
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/businesses">
              사업 둘러보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/team">팀 소개</Link>
          </Button>
        </div>
      </section>

      {/* 사업부 소개 */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">우리의 사업</h2>
          <p className="text-muted-foreground">
            3개의 사업부에서 혁신을 만들어갑니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* HeungHan */}
          <Card className="border-green-200 hover:shadow-lg transition">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-8 w-8 text-green-600" />
                <CardTitle>🌏 HeungHan</CardTitle>
              </div>
              <CardDescription>
                외국인 관광객 종합 컨시어지
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                한국을 방문하는 외국인 관광객을 위한 맞춤형 서비스. 식당 매칭, 캐리어 운송, 구매 대행 등 여행의 모든 것을 지원합니다.
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/businesses/heunghan">
                  자세히 보기 →
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Substract Lab */}
          <Card className="border-blue-200 hover:shadow-lg transition">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-8 w-8 text-blue-600" />
                <CardTitle>🔬 Substract Lab</CardTitle>
              </div>
              <CardDescription>
                AI 기반 커피 장비 연구소
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                딥러닝 기반 결점두 선별기, 진동 제어 모듈 등 커피 산업의 품질 혁신을 위한 AI 솔루션을 개발합니다.
              </p>
              <div className="mb-4">
                <Badge variant="secondary" className="text-xs">
                  도쿄 Koffee Mameya 협력
                </Badge>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/businesses/substract">
                  자세히 보기 →
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Sensus */}
          <Card className="border-orange-200 hover:shadow-lg transition">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="h-8 w-8 text-orange-600" />
                <CardTitle>☕ Sensus</CardTitle>
              </div>
              <CardDescription>
                AI 감각 분석 카페
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                사람의 감각과 기분을 AI로 분석해 최적의 커피를 추천하는 카페. 날씨 기반 로스팅과 개인 맞춤형 브루잉을 제공합니다.
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/businesses/sensus">
                  자세히 보기 →
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 팀 하이라이트 */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">우리 팀</h2>
          <p className="text-muted-foreground">
            다양한 아이디어를 현실로 만드는 3인 팀
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              현
            </div>
            <h3 className="font-bold mb-1">송현서</h3>
            <p className="text-sm text-muted-foreground mb-2">CEO</p>
            <p className="text-xs text-muted-foreground">
              영업, 기획, 운영, 재무
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              호
            </div>
            <h3 className="font-bold mb-1">이정호</h3>
            <p className="text-sm text-muted-foreground mb-2">CPO</p>
            <p className="text-xs text-muted-foreground">
              전략, 제품 설계, 기획
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              한
            </div>
            <h3 className="font-bold mb-1">이정한</h3>
            <p className="text-sm text-muted-foreground mb-2">CTO</p>
            <p className="text-xs text-muted-foreground">
              풀스택 개발, AI/ML, 제품 제작
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/team">
              팀 자세히 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          함께 일하고 싶으신가요?
        </h2>
        <p className="text-muted-foreground mb-8">
          투자, 협업, 채용 등 다양한 방식으로 참여하실 수 있습니다
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" variant="outline">
            contact@itworks.kr
          </Button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span className="font-bold">이게 되네 (ItWorks)</span>
            </div>
            
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-indigo-600">
                회사 소개
              </Link>
              <Link href="/businesses" className="hover:text-indigo-600">
                사업부
              </Link>
              <Link href="/team" className="hover:text-indigo-600">
                팀
              </Link>
              <Link href="/login" className="hover:text-indigo-600">
                팀 로그인
              </Link>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2026 ItWorks. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}