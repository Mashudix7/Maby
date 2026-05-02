import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc, orderBy, limit } from 'firebase/firestore';

// In-memory cache to reduce client load
let momentsCache = null;
let lastCoupleId = null;

export async function getMoments(coupleId, useCache = true) {
  if (useCache && momentsCache && lastCoupleId === coupleId) {
    return momentsCache;
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
    
    momentsCache = data;
    lastCoupleId = coupleId;
    return data;
  } catch (error) {
    console.warn("Falling back to client-side sort", error);
    const qFallback = query(collection(db, 'moments'), where('couple_id', '==', coupleId));
    const snap = await getDocs(qFallback);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    momentsCache = sorted;
    lastCoupleId = coupleId;
    return sorted;
  }
}

export function invalidateMomentsCache() {
  momentsCache = null;
  lastCoupleId = null;
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
}

