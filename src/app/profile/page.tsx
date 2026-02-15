'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile, updateEmail } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { User, Mail, Briefcase, Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    avatar: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const profileData = {
          name: data.name || user.displayName || '',
          email: data.email || user.email || '',
          role: data.role || '',
          bio: data.bio || '',
          avatar: data.avatar || user.photoURL || '',
        };
        setProfile(profileData);
        setEditedProfile(profileData);
      } else {
        // 프로필이 없으면 생성
        const newProfile = {
          name: user.displayName || '',
          email: user.email || '',
          role: getRoleFromEmail(user.email || ''),
          bio: '',
          avatar: user.photoURL || '',
        };
        setProfile(newProfile);
        setEditedProfile(newProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('프로필 로드 실패');
    }
  };

  const getRoleFromEmail = (email: string): string => {
    if (email.includes('ceo')) return 'CEO';
    if (email.includes('cso')) return 'CSO';
    if (email.includes('cpo') || email.includes('cto')) return 'CPO';
    return '';
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      // Firestore 업데이트
      await updateDoc(doc(db, 'users', user.uid), {
        name: editedProfile.name,
        bio: editedProfile.bio,
        role: editedProfile.role,
        updatedAt: serverTimestamp(),
      });
      
      // Firebase Auth 프로필 업데이트
      await updateProfile(user, {
        displayName: editedProfile.name,
      });
      
      // 이메일 변경 (다른 경우에만)
      if (editedProfile.email !== user.email) {
        try {
          await updateEmail(user, editedProfile.email);
          toast.success('이메일이 변경되었습니다. 다시 로그인해주세요.');
        } catch (error: any) {
          if (error.code === 'auth/requires-recent-login') {
            toast.error('보안을 위해 다시 로그인 후 이메일을 변경해주세요');
          } else {
            throw error;
          }
        }
      }
      
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success('프로필이 업데이트되었습니다');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('프로필 저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">마이페이지</h1>
          <p className="text-muted-foreground mt-1">
            프로필 정보를 관리하세요
          </p>
        </div>

        <div className="grid gap-6">
          {/* 프로필 카드 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>프로필</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    수정
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      취소
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? '저장 중...' : '저장'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 아바타 */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profile.name[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{profile.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{profile.role}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {profile.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* 수정 폼 */}
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      이름
                    </label>
                    <Input
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      placeholder="이름 입력"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4" />
                      이메일
                    </label>
                    <Input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      placeholder="이메일 입력"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      이메일 변경 시 보안을 위해 다시 로그인이 필요합니다
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4" />
                      역할
                    </label>
                    <Input
                      value={editedProfile.role}
                      onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
                      placeholder="CEO, CSO, CPO 등"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      자기소개
                    </label>
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      placeholder="간단한 자기소개를 입력하세요"
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">자기소개</p>
                    <p className="text-sm">
                      {profile.bio || '자기소개가 없습니다.'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 계정 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>계정 정보</CardTitle>
              <CardDescription>
                보안 및 로그인 정보
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">이메일</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant="outline" className="text-green-600">인증됨</Badge>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">마지막 로그인</p>
                  <p className="text-sm text-muted-foreground">
                    {user.metadata.lastSignInTime ? 
                      new Date(user.metadata.lastSignInTime).toLocaleString('ko-KR') : 
                      '정보 없음'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    auth.signOut();
                    document.cookie = 'session=; path=/; max-age=0';
                    router.push('/login');
                    toast.success('로그아웃되었습니다');
                  }}
                >
                  로그아웃
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 활동 통계 */}
          <Card>
            <CardHeader>
              <CardTitle>활동 통계</CardTitle>
              <CardDescription>
                프로젝트 참여 및 기여도
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">12</p>
                  <p className="text-xs text-muted-foreground">아이디어</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">28</p>
                  <p className="text-xs text-muted-foreground">댓글</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">5</p>
                  <p className="text-xs text-muted-foreground">프로젝트</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}