'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile, verifyBeforeUpdateEmail } from 'firebase/auth'; // 🚨 변경됨
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
    if (email.includes('founder')) return 'CEO';
    if (email.includes('cpo')) return 'CPO';
    if (email.includes('cto')) return 'CTO';
    return '';
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    let emailVerificationSent = false;
    
    try {
      // 1. 이메일 변경 시도 (verifyBeforeUpdateEmail 사용)
      if (editedProfile.email !== user.email) {
        try {
          await verifyBeforeUpdateEmail(user, editedProfile.email);
          emailVerificationSent = true;
          toast.success('새 이메일로 인증 링크를 보냈습니다. 인증 후 변경됩니다.');
        } catch (error: any) {
          if (error.code === 'auth/requires-recent-login') {
            toast.error('보안을 위해 다시 로그인 후 이메일을 변경해주세요');
            setSaving(false);
            return;
          }
          throw error; // 그 외 에러는 하단 catch로 전달
        }
      }

      // 2. Firestore 저장
      // 주의: 이메일은 인증 전까지 변경되지 않으므로, Firestore에도 기존 이메일을 유지하는 것이 안전합니다.
      const firestoreData = {
        name: editedProfile.name,
        bio: editedProfile.bio,
        role: editedProfile.role,
        // 이메일 변경 요청이 있었다면(인증 대기 중) DB 업데이트에서 제외하거나 기존 값 유지
        email: emailVerificationSent ? user.email : editedProfile.email,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), firestoreData, { merge: true });
      
      // 3. Auth 프로필(이름) 업데이트
      if (editedProfile.name !== user.displayName) {
        await updateProfile(user, {
          displayName: editedProfile.name,
        });
      }
      
      // UI 업데이트
      // 이메일은 아직 안 바뀌었으므로 기존 이메일로 되돌려서 보여줌
      const updatedProfileState = {
        ...editedProfile,
        email: user.email || '', 
      };
      
      setProfile(updatedProfileState);
      setEditedProfile(updatedProfileState);
      setIsEditing(false);
      
      if (!emailVerificationSent) {
        toast.success('프로필이 업데이트되었습니다');
      }

    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(`저장 실패: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">마이페이지</h1>
          <p className="text-muted-foreground mt-1">프로필 정보를 관리하세요</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>프로필</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" /> 수정
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
                      <X className="h-4 w-4 mr-2" /> 취소
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" /> {saving ? '저장 중...' : '저장'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl">{profile.name[0] || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{profile.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{profile.role}</Badge>
                    <span className="text-sm text-muted-foreground">{profile.email}</span>
                  </div>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" /> 이름
                    </label>
                    <Input
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      placeholder="이름 입력"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4" /> 이메일
                    </label>
                    <Input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      placeholder="이메일 입력"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-orange-600">
                      * 이메일 변경 시 인증 메일이 발송되며, 인증 후 변경이 완료됩니다.
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4" /> 역할
                    </label>
                    <Input
                      value={editedProfile.role}
                      onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
                      placeholder="CEO, CPO, CTO 등"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">자기소개</label>
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
                    <p className="text-sm whitespace-pre-wrap">{profile.bio || '자기소개가 없습니다.'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}