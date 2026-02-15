// lib/firestore-helpers.ts
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  increment,
  serverTimestamp,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';

// ============================================
// Ideas 관련 함수
// ============================================

export const ideasCollection = collection(db, 'ideas');

export async function createIdea(data: {
  projectId: string;
  businessId: string;
  title: string;
  content: string;
  priority: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  parentId?: string;
}) {
  return await addDoc(ideasCollection, {
    ...data,
    status: 'proposed',
    likesCount: 0,
    commentsCount: 0,
    resourcesCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateIdea(ideaId: string, data: Partial<any>) {
  const ideaRef = doc(db, 'ideas', ideaId);
  return await updateDoc(ideaRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteIdea(ideaId: string) {
  const ideaRef = doc(db, 'ideas', ideaId);
  return await deleteDoc(ideaRef);
}

export async function getIdeas(filters?: {
  businessId?: string;
  projectId?: string;
  status?: string;
  sortBy?: 'recent' | 'popular' | 'discussed';
  limitCount?: number;
}) {
  let q = query(ideasCollection);
  const constraints: QueryConstraint[] = [];
  
  if (filters?.businessId) {
    constraints.push(where('businessId', '==', filters.businessId));
  }
  
  if (filters?.projectId) {
    constraints.push(where('projectId', '==', filters.projectId));
  }
  
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }
  
  // 정렬
  switch (filters?.sortBy) {
    case 'popular':
      constraints.push(orderBy('likesCount', 'desc'));
      break;
    case 'discussed':
      constraints.push(orderBy('commentsCount', 'desc'));
      break;
    default:
      constraints.push(orderBy('createdAt', 'desc'));
  }
  
  if (filters?.limitCount) {
    constraints.push(limit(filters.limitCount));
  }
  
  q = query(ideasCollection, ...constraints);
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Realtime 구독
export function subscribeToIdeas(
  callback: (ideas: any[]) => void,
  filters?: any
) {
  let q = query(ideasCollection, orderBy('createdAt', 'desc'));
  
  if (filters?.businessId) {
    q = query(ideasCollection, where('businessId', '==', filters.businessId), orderBy('createdAt', 'desc'));
  }
  
  return onSnapshot(q, (snapshot) => {
    const ideas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(ideas);
  });
}

// ============================================
// Comments 관련 함수
// ============================================

export async function addComment(ideaId: string, data: {
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
}) {
  const commentsRef = collection(db, 'ideas', ideaId, 'comments');
  
  // 댓글 추가
  await addDoc(commentsRef, {
    ...data,
    ideaId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  // 아이디어의 댓글 수 증가
  const ideaRef = doc(db, 'ideas', ideaId);
  await updateDoc(ideaRef, {
    commentsCount: increment(1),
    updatedAt: serverTimestamp(),
  });
}

export async function getComments(ideaId: string) {
  const commentsRef = collection(db, 'ideas', ideaId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'asc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function subscribeToComments(ideaId: string, callback: (comments: any[]) => void) {
  const commentsRef = collection(db, 'ideas', ideaId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(comments);
  });
}

// ============================================
// Likes 관련 함수
// ============================================

export async function toggleLike(ideaId: string, userId: string) {
  const likeRef = doc(db, 'ideas', ideaId, 'likes', userId);
  const ideaRef = doc(db, 'ideas', ideaId);
  
  const likeDoc = await getDoc(likeRef);
  
  if (likeDoc.exists()) {
    // 좋아요 취소
    await deleteDoc(likeRef);
    await updateDoc(ideaRef, {
      likesCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
    return false;
  } else {
    // 좋아요
    await addDoc(collection(db, 'ideas', ideaId, 'likes'), {
      userId,
      createdAt: serverTimestamp(),
    });
    await updateDoc(ideaRef, {
      likesCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    return true;
  }
}

export async function checkIfLiked(ideaId: string, userId: string) {
  const likeRef = doc(db, 'ideas', ideaId, 'likes', userId);
  const likeDoc = await getDoc(likeRef);
  return likeDoc.exists();
}

// ============================================
// Resources 관련 함수
// ============================================

export async function addResource(ideaId: string, data: {
  type: string;
  title: string;
  url: string;
  description?: string;
  uploadedBy: string;
  uploadedByName: string;
}) {
  const resourcesRef = collection(db, 'ideas', ideaId, 'resources');
  
  await addDoc(resourcesRef, {
    ...data,
    ideaId,
    createdAt: serverTimestamp(),
  });
  
  // 아이디어의 리소스 수 증가
  const ideaRef = doc(db, 'ideas', ideaId);
  await updateDoc(ideaRef, {
    resourcesCount: increment(1),
    updatedAt: serverTimestamp(),
  });
}

export async function getResources(ideaId: string) {
  const resourcesRef = collection(db, 'ideas', ideaId, 'resources');
  const q = query(resourcesRef, orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ============================================
// Evolution (발전된 아이디어) 관련
// ============================================

export async function getEvolvedIdeas(parentId: string) {
  const q = query(
    ideasCollection,
    where('parentId', '==', parentId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ============================================
// Projects & Businesses
// ============================================

export async function getBusinesses() {
  const snapshot = await getDocs(collection(db, 'businesses'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProjects(businessId?: string) {
  let q = query(collection(db, 'projects'), orderBy('title'));
  
  if (businessId) {
    q = query(collection(db, 'projects'), where('businessId', '==', businessId), orderBy('title'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ============================================
// Activity Log
// ============================================

export async function logActivity(data: {
  userId: string;
  userName: string;
  actionType: string;
  entityType: string;
  entityId: string;
  metadata?: any;
}) {
  await addDoc(collection(db, 'activities'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getRecentActivities(limitCount: number = 50) {
  const q = query(
    collection(db, 'activities'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ============================================
// 유틸리티
// ============================================

export function timestampToDate(timestamp: any): Date | null {
  if (!timestamp) return null;
  if (timestamp.toDate) {
    return timestamp.toDate();
  }
  return null;
}