import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { updateStreakActivity } from './streakService';

export async function getWishes(coupleId) {
  try {
    const q = query(
      collection(db, 'wishes'),
      where('couple_id', '==', coupleId),
      orderBy('created_at', 'desc')
    );
    const snap = await getDocs(q);
    return await Promise.all(snap.docs.map(async (d) => {
      const data = d.data();
      const userSnap = await getDoc(doc(db, 'users', data.user_id));
      return { id: d.id, ...data, profiles: userSnap.exists() ? userSnap.data() : null };
    }));
  } catch (error) {
    console.warn("Mungkin index belum dibuat, mencoba tanpa orderBy", error);
    const qFallback = query(collection(db, 'wishes'), where('couple_id', '==', coupleId));
    const snap = await getDocs(qFallback);
    const results = await Promise.all(snap.docs.map(async (d) => {
      const data = d.data();
      const userSnap = await getDoc(doc(db, 'users', data.user_id));
      return { id: d.id, ...data, profiles: userSnap.exists() ? userSnap.data() : null };
    }));
    return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

export async function createWish(coupleId, userId, text) {
  const docData = {
    couple_id: coupleId,
    user_id: userId,
    text,
    created_at: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'wishes'), docData);
  
  // Trigger streak update
  updateStreakActivity(coupleId, userId).catch(err => console.error('Streak update failed:', err));

  const userSnap = await getDoc(doc(db, 'users', userId));
  return { id: docRef.id, ...docData, profiles: userSnap.exists() ? userSnap.data() : null };
}

export async function deleteWish(id) {
  await deleteDoc(doc(db, 'wishes', id));
}

export async function getRandomWish(coupleId) {
  const wishes = await getWishes(coupleId);
  if (!wishes || wishes.length === 0) return null;
  return wishes[Math.floor(Math.random() * wishes.length)];
}
