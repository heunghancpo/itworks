'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  ArrowLeft, Globe, MapPin, ShoppingBag, 
  MessageCircle, Plane, CheckCircle2, Star 
} from 'lucide-react';

export default function HeungHanPage() {
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
          <Button asChild>
            <Link href="/login">팀 로그인</Link>
          </Button>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 bg-white text-green-700">Global Concierge</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              🌏 HeungHan
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium">
              한국 여행의 모든 순간을 연결합니다
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              언어 장벽 없는 식당 예약부터 공항 픽업, 한정판 굿즈 구매 대행까지. <br/>
              외국인 관광객이 오직 '여행'에만 집중할 수 있도록 돕는 프리미엄 컨시어지 서비스입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 핵심 서비스 (Grid) */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">핵심 서비스</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-green-100 hover:border-green-300 transition-colors shadow-sm hover:shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>로컬 맛집 매칭 & 예약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                관광객이 찾기 힘든 '진짜 맛집'을 추천하고, 전화 예약이 어려운 외국인을 위해 실시간 대행 예약을 제공합니다.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>비건/할랄 등 식이요법 맞춤</span>
                </div>
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>노쇼 방지 보증금 시스템</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 hover:border-green-300 transition-colors shadow-sm hover:shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Plane className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>수하물 운송 & 보관</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                공항에서 숙소까지, 숙소에서 공항까지 무거운 짐을 안전하게 운송합니다. 여행 첫날과 마지막 날을 가볍게 만듭니다.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>실시간 위치 추적</span>
                </div>
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>파손/분실 100% 보상 보험</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 hover:border-green-300 transition-colors shadow-sm hover:shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>구매 대행 (K-Goods)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                K-POP 굿즈, 팝업스토어 한정판 등 현장 대기가 필요한 물품을 대신 구매하여 숙소로 배송합니다.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>오픈런/현장 대기 전문 인력</span>
                </div>
                <div className="flex items-center text-sm gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>정품 인증 및 검수</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 프로세스 (Highlight) */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-2">Process</Badge>
              <h2 className="text-3xl font-bold">Seamless Travel Experience</h2>
              <p className="text-muted-foreground mt-2">여행의 시작부터 끝까지 HeungHan이 함께합니다</p>
            </div>

            <div className="relative">
              {/* 타임라인 라인 */}
              <div className="absolute left-[20px] top-0 bottom-0 w-0.5 bg-green-200 md:left-1/2 md:-ml-px"></div>

              {/* Step 1 */}
              <div className="relative flex items-center mb-12 md:justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white shadow-lg z-10 md:order-2 md:mx-auto">1</div>
                <div className="ml-6 bg-white p-6 rounded-lg shadow-sm border border-green-100 md:w-[45%] md:ml-0 md:mr-auto md:text-right">
                  <h3 className="font-bold text-lg mb-1">입국 전 사전 예약</h3>
                  <p className="text-sm text-muted-foreground">앱을 통해 여행 일정, 선호 음식, 필요 서비스를 미리 파악하고 맞춤형 일정을 제안합니다.</p>
                </div>
                <div className="hidden md:block md:w-[45%]"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center mb-12 md:justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white shadow-lg z-10 md:order-2 md:mx-auto">2</div>
                <div className="ml-6 bg-white p-6 rounded-lg shadow-sm border border-green-100 md:w-[45%] md:ml-auto md:mr-0 md:order-3">
                  <h3 className="font-bold text-lg mb-1">공항 도착 & 짐 해방</h3>
                  <p className="text-sm text-muted-foreground">공항에서 HeungHan 매니저에게 짐을 맡기고, 가벼운 몸으로 바로 첫 번째 관광지로 이동합니다.</p>
                </div>
                <div className="hidden md:block md:w-[45%] md:order-1"></div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center md:justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white shadow-lg z-10 md:order-2 md:mx-auto">3</div>
                <div className="ml-6 bg-white p-6 rounded-lg shadow-sm border border-green-100 md:w-[45%] md:ml-0 md:mr-auto md:text-right">
                  <h3 className="font-bold text-lg mb-1">실시간 컨시어지</h3>
                  <p className="text-sm text-muted-foreground">여행 중 발생하는 모든 문제(길 찾기, 통역, 급한 예약 변경)를 실시간 채팅으로 해결합니다.</p>
                </div>
                <div className="hidden md:block md:w-[45%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 성장 전략 */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">성장 로드맵</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <Badge className="w-fit mb-2 bg-green-600">Phase 1</Badge>
              <CardTitle>서비스 검증 (MVP)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                카카오톡/왓츠앱 기반 수동 컨시어지 운영. <br/>
                핵심 파트너 식당 50곳 및 운송 업체 제휴.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <Badge className="w-fit mb-2 bg-green-600">Phase 2</Badge>
              <CardTitle>플랫폼 자동화</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                전용 앱 출시 및 예약 자동화 시스템 구축. <br/>
                AI 챗봇 도입으로 단순 문의 처리 효율화.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <Badge className="w-fit mb-2 bg-green-600">Phase 3</Badge>
              <CardTitle>VIP & 의료 관광</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                성형/피부과 연계 프리미엄 패키지 런칭. <br/>
                의전 차량 및 전담 수행 비서 서비스 확장.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Star className="h-10 w-10 mx-auto mb-4 text-yellow-400 fill-current" />
          <h2 className="text-3xl font-bold mb-4">
            가장 한국적인 환대를 세계에 전합니다
          </h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            HeungHan과 함께 인바운드 관광 시장의 새로운 표준을 만들어갈 파트너를 찾습니다.
          </p>
          <Button size="lg" variant="secondary" className="font-semibold">
            제휴/협업 문의
          </Button>
        </div>
      </section>
    </div>
  );
}