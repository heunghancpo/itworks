// src/components/notification-bell.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { subscribeToNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/firestore-helpers';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

export function NotificationBell() {
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;
    // Firebase uid를 사용하지만, 팀 시스템에서는 간단한 id 매핑 필요
    // 여기서는 uid를 그대로 사용
    const unsub = subscribeToNotifications(user.uid, setNotifications);
    return unsub;
  }, [user]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.link) router.push(notif.link);
    setOpen(false);
  };

  const handleMarkAllRead = () => {
    if (user) markAllNotificationsRead(user.uid);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-14 sm:top-full sm:mt-2 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-[60]">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
            <h3 className="font-semibold text-sm">알림</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 hover:text-indigo-800">
                모두 읽음
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                알림이 없습니다
              </div>
            ) : (
              notifications.map(notif => (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${
                    !notif.read ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />}
                    <div className={`flex-1 min-w-0 ${notif.read ? 'ml-4' : ''}`}>
                      <p className="text-sm font-medium truncate">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {notif.createdAt?.toDate
                          ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true, locale: ko })
                          : '방금 전'}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
