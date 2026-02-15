'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  // 이미 로그인되어 있으면 리디렉션
  useEffect(() => {
    if (user && !authLoading) {
      router.push(redirect);
    }
  }, [user, authLoading, router, redirect]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력하세요');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // 세션 쿠키 설정 (서버 사이드 확인용)
      document.cookie = `session=true; path=/; max-age=604800`; // 7일
      
      toast.success('로그인 성공!');
      router.push(redirect);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // 에러 메시지 한글화
      let errorMessage = '로그인 실패';
      if (error.code === 'auth/user-not-found') {
        errorMessage = '등록되지 않은 이메일입니다';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = '비밀번호가 올바르지 않습니다';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '이메일 형식이 올바르지 않습니다';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = '너무 많은 시도가 있었습니다. 잠시 후 다시 시도하세요';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 빠른 로그인 (개발용)
  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    // 실제 프로덕션에서는 제거
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">
            🏢 이게 되네
          </CardTitle>
          <CardDescription>
            팀 전용 프로젝트 관리 시스템
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">이메일</label>
              <Input
                type="email"
                placeholder="cto@koreaheung.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">비밀번호</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
          
          {/* 개발용 빠른 로그인 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground mb-2">빠른 로그인 (개발용)</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('founder@koreaheung.com')}
                >
                  현서 (CEO)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('cto@koreaheung.com')}
                >
                  정한 (CTO)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('cpo@koreaheung.com')}
                >
                  정호 (CPO)
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              팀원만 접근 가능합니다
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* 공개 홈으로 돌아가기 */}
      <div className="fixed bottom-4 left-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
        >
          ← 홈으로
        </Button>
      </div>
    </div>
  );
}