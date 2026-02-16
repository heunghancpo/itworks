'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BusinessHeader } from '@/components/business-header';
import Link from 'next/link';
import { ArrowLeft, Cpu, Camera, Waves, Award, Target, Calendar } from 'lucide-react';

export default function SubstractLabPage() {
  return (
    <div className="min-h-screen bg-white">
      <BusinessHeader currentId="substract" />

      {/* 히어로 */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">AI & Hardware</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              🔬 Substract Lab
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              AI 기반 커피 장비 연구소
            </p>
            <p className="text-muted-foreground">
              딥러닝과 하드웨어 기술을 결합하여 커피 산업의 품질 혁신을 만들어갑니다.
            </p>
          </div>
        </div>
      </section>

      {/* 주요 제품 */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">주요 제품</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 결점두 선별기 */}
          <Card className="border-blue-200">
            <CardHeader>
              <Camera className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>결점두 선별기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                YOLOv8 기반 딥러닝 모델로 로스팅 커피콩의 불량을 자동 검출합니다.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">정확도</span>
                  <span className="font-semibold">mAP50 52.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">검출율</span>
                  <span className="font-semibold text-green-600">98.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">처리 속도</span>
                  <span className="font-semibold">30 FPS</span>
                </div>
              </div>

              <Badge variant="outline" className="w-full justify-center">
                개발 진행 중 (60%)
              </Badge>
            </CardContent>
          </Card>

          {/* 진동 제어 모듈 */}
          <Card className="border-purple-200">
            <CardHeader>
              <Waves className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>진동 제어 모듈</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                에스프레소 머신의 진동과 소음을 70% 감소시키는 액티브 노이즈 컨트롤 시스템입니다.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">소음 감소</span>
                  <span className="font-semibold">70%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">진동 감소</span>
                  <span className="font-semibold">65%</span>
                </div>
              </div>

              <Badge variant="outline" className="w-full justify-center">
                아이디어 단계
              </Badge>
            </CardContent>
          </Card>

          {/* 티 드리퍼 */}
          <Card className="border-orange-200">
            <CardHeader>
              <Cpu className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>스마트 티 드리퍼</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                온도와 추출 시간을 정밀하게 제어하여 최적의 차 맛을 구현하는 스마트 드리퍼입니다.
              </p>

              <Badge variant="outline" className="w-full justify-center">
                컨셉 단계
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 마메야 협력 */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <Award className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  도쿄 Koffee Mameya와의 협력
                </h2>
                <p className="text-muted-foreground mb-6">
                  일본 최고의 프리미엄 카페 Koffee Mameya의 대표님께 사업 설명회를 진행하였고, 
                  굉장히 긍정적인 반응과 함께 많은 도움을 받고 있습니다.
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">마메야 전용 선별기 개발 중</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Koffee Mameya의 브랜드 아이덴티티에 맞춘 커스텀 디자인과 
                  프리미엄 카페에 최적화된 기능을 탑재한 전용 선별기를 개발하고 있습니다.
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">프로토타입 완성</p>
                      <p className="text-sm font-semibold">2026년 3월</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">목표</p>
                      <p className="text-sm font-semibold">도쿄 카페쇼 출품</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 비즈니스 전략 */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">비즈니스 전략</h2>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1단계: 일본 시장 진입 (2026)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                마메야를 통한 검증과 브랜드 구축. 일본 프리미엄 카페 시장에서 신뢰성 확보.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">마메야 협력</Badge>
                <Badge variant="secondary">도쿄 카페쇼</Badge>
                <Badge variant="secondary">프리미엄 포지셔닝</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2단계: 한국 역수출 (2027)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                일본 성공 사례를 활용한 한국 시장 공략. K-커피 시장의 일본 동경 심리 활용.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">일본 검증 완료</Badge>
                <Badge variant="secondary">한국 스페셜티 카페</Badge>
                <Badge variant="secondary">프랜차이즈 확장</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3단계: 글로벌 확장 (2028+)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                아시아 및 글로벌 스페셜티 커피 시장 진출. 
                OEM/ODM 사업 확대.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">아시아 시장</Badge>
                <Badge variant="secondary">유럽/미국</Badge>
                <Badge variant="secondary">B2B 확장</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 기술 스택 */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">기술 스택</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>AI / Machine Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>YOLOv8</Badge>
                  <Badge>PyTorch</Badge>
                  <Badge>Computer Vision</Badge>
                  <Badge>TensorFlow</Badge>
                  <Badge>OpenCV</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hardware / Embedded</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Raspberry Pi</Badge>
                  <Badge>Arduino</Badge>
                  <Badge>Camera Module</Badge>
                  <Badge>센서 제어</Badge>
                  <Badge>모터 제어</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          함께 커피 산업의 미래를 만들어갈 파트너를 찾습니다
        </h2>
        <p className="text-muted-foreground mb-8">
          투자, 기술 협력, 유통 파트너십 등 다양한 방식으로 참여하실 수 있습니다
        </p>
        <Button size="lg">
          문의하기
        </Button>
      </section>
    </div>
  );
}