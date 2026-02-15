// lib/storage-helpers.ts
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * 파일 업로드
 * Storage location: us-central1 (무료 티어)
 * CDN을 통해 전 세계에서 빠르게 접근 가능
 */

// ============================================
// 아이디어 첨부파일 업로드
// ============================================

export async function uploadIdeaAttachment(
  ideaId: string,
  file: File,
  userId: string
): Promise<string> {
  try {
    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedFileName}`;
    
    // Storage 경로: ideas/{ideaId}/attachments/{fileName}
    const storageRef = ref(storage, `ideas/${ideaId}/attachments/${fileName}`);
    
    // 메타데이터
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
      }
    };
    
    // 업로드
    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ 파일 업로드 성공:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('❌ 파일 업로드 실패:', error);
    throw error;
  }
}

// ============================================
// 프로필 이미지 업로드
// ============================================

export async function uploadProfileImage(
  userId: string,
  file: File
): Promise<string> {
  try {
    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다');
    }
    
    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('파일 크기는 5MB 이하여야 합니다');
    }
    
    const fileName = `avatar_${Date.now()}.${file.type.split('/')[1]}`;
    const storageRef = ref(storage, `avatars/${userId}/${fileName}`);
    
    const metadata = {
      contentType: file.type,
      customMetadata: {
        userId,
        uploadedAt: new Date().toISOString(),
      }
    };
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('❌ 프로필 이미지 업로드 실패:', error);
    throw error;
  }
}

// ============================================
// 프로젝트 파일 업로드 (문서, 이미지 등)
// ============================================

export async function uploadProjectFile(
  projectId: string,
  file: File,
  userId: string,
  folder: string = 'general' // 폴더 구분 (documents, images, etc)
): Promise<{ url: string; metadata: any }> {
  try {
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedFileName}`;
    
    const storageRef = ref(storage, `projects/${projectId}/${folder}/${fileName}`);
    
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
        fileSize: file.size.toString(),
      }
    };
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      metadata: {
        name: file.name,
        size: file.size,
        type: file.type,
      }
    };
  } catch (error) {
    console.error('❌ 프로젝트 파일 업로드 실패:', error);
    throw error;
  }
}

// ============================================
// 파일 삭제
// ============================================

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // URL에서 Storage 참조 생성
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
    console.log('✅ 파일 삭제 성공');
  } catch (error) {
    console.error('❌ 파일 삭제 실패:', error);
    throw error;
  }
}

// ============================================
// 파일 크기 제한 검증
// ============================================

export const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024,      // 5MB
  document: 10 * 1024 * 1024,  // 10MB
  video: 50 * 1024 * 1024,     // 50MB
};

export function validateFileSize(file: File, type: 'image' | 'document' | 'video'): boolean {
  const limit = FILE_SIZE_LIMITS[type];
  if (file.size > limit) {
    throw new Error(`파일 크기는 ${limit / 1024 / 1024}MB 이하여야 합니다`);
  }
  return true;
}

// ============================================
// 허용 파일 타입 검증
// ============================================

export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  code: ['text/plain', 'application/json'],
};

export function validateFileType(file: File, category: keyof typeof ALLOWED_FILE_TYPES): boolean {
  const allowedTypes = ALLOWED_FILE_TYPES[category];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`허용되지 않는 파일 형식입니다. 허용: ${allowedTypes.join(', ')}`);
  }
  return true;
}

// ============================================
// 파일 업로드 with 진행률
// ============================================

import { uploadBytesResumable } from 'firebase/storage';

export function uploadFileWithProgress(
  path: string,
  file: File,
  onProgress: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // 진행률 계산
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        // 에러 처리
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        // 완료
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

// ============================================
// 사용 예시
// ============================================

/**
 * 예시 1: 아이디어에 이미지 첨부
 * 
 * const file = event.target.files[0];
 * const url = await uploadIdeaAttachment(ideaId, file, userId);
 * 
 * await addResource(ideaId, {
 *   type: 'file',
 *   title: file.name,
 *   url: url,
 *   ...
 * });
 */

/**
 * 예시 2: 프로필 사진 업데이트
 * 
 * const file = event.target.files[0];
 * const url = await uploadProfileImage(userId, file);
 * 
 * await updateDoc(doc(db, 'users', userId), {
 *   avatar: url
 * });
 */

/**
 * 예시 3: 진행률 표시 업로드
 * 
 * const [progress, setProgress] = useState(0);
 * 
 * const url = await uploadFileWithProgress(
 *   `ideas/${ideaId}/attachments/${file.name}`,
 *   file,
 *   (p) => setProgress(p)
 * );
 * 
 * // <ProgressBar value={progress} />
 */