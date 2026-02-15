'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Bell, MessageSquare, Lightbulb, TrendingUp } from 'lucide-react';

interface NotifSettings {
  ideaCreated: boolean;
  commentAdded: boolean;
  statusChanged: boolean;
}

const STORAGE_KEY = 'itworks_notif_settings';

function loadSettings(): NotifSettings {
  if (typeof window === 'undefined') return { ideaCreated: true, commentAdded: true, statusChanged: true };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { ideaCreated: true, commentAdded: true, statusChanged: true };
}

function saveSettings(s: NotifSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export default function SettingsPage() {
  const [user] = useAuthState(auth);
  const [notif, setNotif] = useState<NotifSettings>(loadSettings);

  useEffect(() => { saveSettings(notif); }, [notif]);

  const toggle = (key: keyof NotifSettings) => {
    setNotif(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!user) return <div className="p-8 text-center">로그인이 필요합니다.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 text-slate-600" />
          설정
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">앱 설정을 관리합니다.</p>
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
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-500" />
            <div>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>어떤 알림을 받을지 선택하세요.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">새 아이디어 알림</p>
                <p className="text-xs text-muted-foreground">팀원이 새 아이디어를 등록하면 알림</p>
              </div>
            </div>
            <Switch checked={notif.ideaCreated} onCheckedChange={() => toggle('ideaCreated')} />
          </div>

          <div className="border-t" />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">댓글 알림</p>
                <p className="text-xs text-muted-foreground">아이디어에 새 댓글이 달리면 알림</p>
              </div>
            </div>
            <Switch checked={notif.commentAdded} onCheckedChange={() => toggle('commentAdded')} />
          </div>

          <div className="border-t" />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">상태 변경 알림</p>
                <p className="text-xs text-muted-foreground">아이디어 상태가 변경되면 알림</p>
              </div>
            </div>
            <Switch checked={notif.statusChanged} onCheckedChange={() => toggle('statusChanged')} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
