'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const [user] = useAuthState(auth);

  if (!user) return <div className="p-8 text-center">로그인이 필요합니다.</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-slate-600" />
          설정
        </h1>
        <p className="text-muted-foreground mt-1">앱 설정을 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>계정 정보</CardTitle>
          <CardDescription>현재 로그인된 계정 정보입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">이름</label>
            <Input value={user.displayName || ''} disabled className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">이메일</label>
            <Input value={user.email || ''} disabled className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
          <CardDescription>알림 기능은 Phase 3에서 구현 예정입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">아직 설정 가능한 항목이 없습니다.</p>
        </CardContent>
      </Card>
    </div>
  );
}
