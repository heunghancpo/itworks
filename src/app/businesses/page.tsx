'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Globe, Coffee, Lightbulb, ArrowRight } from 'lucide-react';

export default function BusinessesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <nav className="border-b">
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

      {/* 헤더 */}
      <section className="py-20 text-center bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Our Businesses</h1>
          <p className="text-xl text-muted-foreground">
            이게 되네(ItWorks)가 만들어가는 3가지 혁신
          </p>
        </div>
      </section>

      {/* 사업부 목록 */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* HeungHan */}
          <Link href="/businesses/heunghan">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" asChild>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                  <Globe className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  HeungHan
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </CardTitle>
                <CardDescription>Global Concierge Service</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  외국인 관광객을 위한 맛집 매칭, 짐 배송, 구매 대행 등 한국 여행의 모든 것을 연결하는 올인원 컨시어지 서비스입니다.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Substract Lab */}
          <Link href="/businesses/substract">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" asChild>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <Lightbulb className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  Substract Lab
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </CardTitle>
                <CardDescription>AI Coffee Equipment R&D</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  딥러닝 기반 결점두 선별기와 진동 제어 모듈 등 커피 산업의 기술적 혁신을 연구하고 개발합니다.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Sensus */}
          <Link href="/businesses/sensus">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" asChild>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                  <Coffee className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  Sensus
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </CardTitle>
                <CardDescription>AI Sensory Cafe</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  고객의 기분과 날씨 데이터를 AI로 분석하여 최적의 스페셜티 커피를 제공하는 감각적인 카페 공간입니다.
                </p>
              </CardContent>
            </Card>  
          </Link>

        </div>
      </section>
    </div>
  );
}