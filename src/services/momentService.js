import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getCached, setCached, invalidatePrefix } from '../lib/queryCache';
import { updateStreakActivity } from './streakService';

const CACHE_KEY = 'moments';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getMoments(coupleId, useCache = true) {
  const cacheKey = `${CACHE_KEY}:${coupleId}`;
  
  if (useCache) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }

  try {
    const q = query(
      collection(db, 'moments'),
      where('couple_id', '==', coupleId),
      orderBy('date', 'desc'),
      limit(50) // Basic pagination limit
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    setCached(cacheKey, data, CACHE_TTL);
    return data;
  } catch (error) {
    console.warn("Falling back to client-side sort", error);
    const qFallback = query(collection(db, 'moments'), where('couple_id', '==', coupleId));
    const snap = await getDocs(qFallback);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setCached(cacheKey, sorted, CACHE_TTL);
    return sorted;
  }
}

export function invalidateMomentsCache() {
  invalidatePrefix(CACHE_KEY);
}

export function listenMoments(coupleId, callback) {
  const q = query(
    collection(db, 'moments'),
    where('couple_id', '==', coupleId),
    orderBy('date', 'desc'),
    limit(100)
  );
  
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  }, (error) => {
    console.error("Real-time moments error:", error);
  });
}

export async function getMomentById(id) {
  const docRef = doc(db, 'moments', id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error('Moment tidak ditemukan');
  return { id: snap.id, ...snap.data() };
}

export async function createMoment(coupleId, userId, momentData) {
  const docData = {
    ...momentData,
    couple_id: coupleId,
    user_id: userId,
    created_at: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'moments'), docData);
  
  // Trigger streak update
  updateStreakActivity(coupleId, userId).catch(err => console.error('Streak update failed:', err));
  
  invalidateMomentsCache();
  return { id: docRef.id, ...docData };
}

export async function deleteMoment(id) {
  await deleteDoc(doc(db, 'moments', id));
  invalidateMomentsCache();
}

export async function toggleFavoriteMoment(id, isFavorite) {
  const docRef = doc(db, 'moments', id);
  await updateDoc(docRef, { is_favorite: isFavorite });
  invalidateMomentsCache();
}
