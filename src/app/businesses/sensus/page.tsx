'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  ArrowLeft, Coffee, Brain, CloudRain, 
  Thermometer, Smile, TrendingUp, Sparkles 
} from 'lucide-react';

export default function SensusPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* 네비게이션 */}
      <nav className="border-b sticky top-0 bg-stone-50/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/businesses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              사업부 목록
            </Link>
          </Button>
          <Button asChild className="bg-orange-900 hover:bg-orange-800">
            <Link href="/login">팀 로그인</Link>
          </Button>
        </div>
      </nav>

      {/* 히어로 */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg-coffee.jpg')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              <span>AI Sensory Coffee Lab</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-stone-900">
              ☕ Sensus
            </h1>
            <p className="text-xl md:text-2xl text-stone-600 mb-10 font-light">
              데이터로 추출하고, 감각으로 완성합니다.
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Sensus는 당신의 표정, 날씨, 그리고 기분을 분석하여 <br className="hidden md:block"/>
              지금 이 순간 당신에게 가장 완벽한 스페셜티 커피를 제안합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 알고리즘 섹션 */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-stone-900">Sensory Algorithm</h2>
              <p className="text-stone-600">
                단순한 추천이 아닙니다. Sensus의 AI는 3가지 핵심 변수를 실시간으로 분석하여 로스팅 프로파일과 추출 레시피를 미세 조정합니다.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-none shadow-md bg-white">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Smile className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900">Mood Analysis</h3>
                    <p className="text-sm text-stone-500">카메라 비전 인식으로 고객의 표정과 피로도를 분석</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-white">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <CloudRain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900">Environmental Data</h3>
                    <p className="text-sm text-stone-500">실시간 기압, 습도, 온도에 따른 최적의 분쇄도 자동 조절</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-white">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Thermometer className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900">Adaptive Roasting</h3>
                    <p className="text-sm text-stone-500">당일 날씨 데이터 기반 로스팅 프로파일 가변 적용</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-stone-900 rounded-2xl p-8 text-white relative overflow-hidden min-h-[400px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Coffee className="w-64 h-64" />
            </div>
            <div className="relative z-10 space-y-6">
              <Badge variant="outline" className="text-orange-400 border-orange-400">Analysis Result</Badge>
              <div className="text-4xl font-serif">
                Today's Best: <br/>
                <span className="text-orange-400">Ethiopia Yirgacheffe</span>
              </div>
              <div className="space-y-2 text-stone-300 text-sm">
                <p>• Weather: Rainy (Humidity 85%)</p>
                <p>• Mood: Need Energy</p>
                <p>• Recommendation: Bright Acidity & Floral</p>
              </div>
              <div className="pt-4">
                <div className="h-1 w-full bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[85%]"></div>
                </div>
                <p className="text-right text-xs text-stone-500 mt-1">Matching Score: 85%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 공간 & 경험 */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-serif">The Space</h2>
            <p className="text-muted-foreground">Koffee Mameya의 철학을 잇는 공간 경험</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-stone-50 border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-stone-600" />
                  Barista Table
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-600">
                  바리스타와 고객의 경계를 허문 1:1 컨설팅 바. <br/>
                  취향을 찾아가는 대화의 장을 제공합니다.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-stone-50 border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-stone-600" />
                  Roasting Lab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-600">
                  매장 내 스마트 로스터기를 통해 매일 아침 <br/>
                  데이터 기반으로 로스팅되는 신선한 원두.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-stone-50 border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-stone-600" />
                  Tasting Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-600">
                  단일 원두를 에스프레소, 드립, 베리에이션으로 <br/>
                  즐기는 커피 오마카세 코스.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 비즈니스 로드맵 */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Business Expansion</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-bold shrink-0">
                Phase 1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Flagship Store (Seoul)</h3>
                <p className="text-stone-600">
                  성수동 또는 한남동 플래그십 스토어 오픈. <br/>
                  AI 추천 알고리즘 고도화 및 고객 데이터 확보.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-stone-200 text-stone-800 px-4 py-2 rounded-full font-bold shrink-0">
                Phase 2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Roastery & Bean Subscription</h3>
                <p className="text-stone-600">
                  날씨/기분 맞춤형 원두 구독 서비스 런칭. <br/>
                  B2B 원두 납품 및 컨설팅 사업 확장.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-stone-200 text-stone-800 px-4 py-2 rounded-full font-bold shrink-0">
                Phase 3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Global & Tech Franchise</h3>
                <p className="text-stone-600">
                  AI 바리스타 모듈과 레시피를 포함한 기술 프랜차이즈 모델 구축. <br/>
                  아시아 주요 도시(도쿄, 방콕) 진출.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="bg-stone-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Future of Specialty Coffee
          </h2>
          <p className="text-stone-300 mb-8">
            기술과 감성의 완벽한 블렌딩, Sensus와 함께하세요.
          </p>
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white border-none">
            입점 및 투자 문의
          </Button>
        </div>
      </section>
    </div>
  );
}