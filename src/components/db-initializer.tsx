'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Database, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export function DBInitializer() {
  const [loading, setLoading] = useState(false);

  const initializeDB = async () => {
    if (!confirm('경고: DB에 기초 데이터를 주입하시겠습니까? 중복 데이터가 생길 수 있습니다.')) return;
    
    setLoading(true);
    try {
      const batch = writeBatch(db);

      // 1. 사업부 (Businesses) 데이터 생성
      const businesses = [
        { id: 'heunghan', name: 'HeungHan', description: '외국인 관광객 컨시어지', color: '#16a34a', icon: 'Globe' },
        { id: 'substract', name: 'Substract Lab', description: 'AI 커피 장비 연구소', color: '#2563eb', icon: 'Lightbulb' },
        { id: 'sensus', name: 'Sensus', description: 'AI 감각 분석 카페', color: '#ea580c', icon: 'Coffee' },
      ];

      businesses.forEach(biz => {
        const ref = doc(db, 'businesses', biz.id);
        batch.set(ref, biz);
      });

      // 2. 초기 프로젝트 (Projects) 데이터 생성
      const projects = [
        // HeungHan Projects
        { id: 'hh-app-mvp', businessId: 'heunghan', title: '컨시어지 앱 MVP', status: 'in_progress', priority: 'high' },
        { id: 'hh-partner', businessId: 'heunghan', title: '식당 제휴 확장', status: 'planning', priority: 'medium' },
        
        // Substract Lab Projects
        { id: 'sl-sorter', businessId: 'substract', title: '결점두 선별기 Pro', status: 'in_progress', priority: 'urgent' },
        { id: 'sl-mameya', businessId: 'substract', title: '마메야 전용 모듈', status: 'planning', priority: 'high' },
        
        // Sensus Projects
        { id: 'ss-interior', businessId: 'sensus', title: '성수 플래그십 인테리어', status: 'planning', priority: 'medium' },
        { id: 'ss-roasting-ai', businessId: 'sensus', title: '날씨 기반 로스팅 알고리즘', status: 'in_progress', priority: 'high' },
      ];

      projects.forEach(proj => {
        const ref = doc(db, 'projects', proj.id);
        batch.set(ref, {
          ...proj,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      await batch.commit();
      toast.success('DB 초기화 완료! 사업부와 프로젝트가 생성되었습니다.');
      window.location.reload(); // 데이터 반영을 위해 새로고침
    } catch (error) {
      console.error(error);
      toast.error('DB 초기화 실패');
    } finally {
      setLoading(false);
    }
  };

  // 개발 환경에서만 보이도록 설정 (배포 시 제거하거나 관리자만 보이게 처리)
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={initializeDB} 
        disabled={loading}
        className="shadow-lg"
      >
        {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
        DB 초기화 (Dev Only)
      </Button>
    </div>
  );
}