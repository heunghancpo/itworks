'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Target, Zap, Users, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로
            </Link>
          </Button>
        </div>
      </nav>

      {/* 히어로 */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            이게 되네 (ItWorks)
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            아이디어를 현실로 만드는 것, 그게 우리가 하는 일입니다.
          </p>
        </div>
      </section>

      {/* 스토리 */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">우리의 시작</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              송현서, 이정호, 이정한. 세 명의 친구는 평소 다양한 아이디어를 공유하며 즐거운 시간을 보냈습니다. 
              어느 날, "이 아이디어들이 정말 현실이 된다면?"이라는 질문을 던졌고, 그 답을 찾기 위해 <strong>이게 되네</strong>를 시작했습니다.
            </p>
            <p>
              처음에는 하나의 아이디어로 시작했지만, 함께 일하면서 더 많은 가능성을 발견했습니다. 
              각자의 강점을 살려 여러 사업을 동시에 진행하고, 서로의 성공을 응원하며 성장하고 있습니다.
            </p>
            <p>
              지금은 <strong>외국인 관광객 서비스(HeungHan)</strong>, <strong>AI 커피 장비(Substract Lab)</strong>, 
              <strong>감각 분석 카페(Sensus)</strong> 세 개의 사업부를 운영하며, 
              각각의 분야에서 혁신을 만들어가고 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 비전 & 미션 */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>비전 (Vision)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  아이디어가 현실이 되는 세상을 만듭니다. 
                  누구나 떠올린 아이디어를 실현할 수 있고, 
                  그 과정에서 성장할 수 있는 환경을 조성합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>미션 (Mission)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  빠른 실행과 지속적인 개선을 통해 고객에게 가치를 전달합니다. 
                  기술과 디자인, 비즈니스를 결합하여 혁신적인 제품과 서비스를 만듭니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">핵심 가치</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="font-bold mb-2">빠른 실행</h3>
            <p className="text-sm text-muted-foreground">
              완벽함보다 실행이 먼저입니다. 
              아이디어를 빠르게 프로토타입으로 만들고, 
              시장의 반응을 통해 개선합니다.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-bold mb-2">협업과 신뢰</h3>
            <p className="text-sm text-muted-foreground">
              각자의 전문성을 존중하고, 
              열린 커뮤니케이션을 통해 
              최선의 결과를 만들어냅니다.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-bold mb-2">지속적 성장</h3>
            <p className="text-sm text-muted-foreground">
              실패를 두려워하지 않고, 
              매일 배우고 개선하며 
              더 나은 내일을 만듭니다.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            함께 성장할 동료를 찾습니다
          </h2>
          <p className="text-lg mb-8 opacity-90">
            투자자, 파트너, 팀원 모두 환영합니다
          </p>
          <Button size="lg" variant="secondary">
            contact@itworks.kr
          </Button>
        </div>
      </section>
    </div>
  );
}