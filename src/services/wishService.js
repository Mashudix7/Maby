import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { updateStreakActivity } from './streakService';

let wishesCache = null;
let lastCoupleId = null;

export async function getWishes(coupleId, useCache = true) {
  if (useCache && wishesCache && lastCoupleId === coupleId) {
    return wishesCache;
  }

  try {
    // Get all couple members once to avoid per-document reads
    const membersQuery = query(collection(db, 'users'), where('couple_id', '==', coupleId));
    const membersSnap = await getDocs(membersQuery);
    const membersMap = {};
    membersSnap.forEach(d => membersMap[d.id] = d.data());

    const q = query(
      collection(db, 'wishes'),
      where('couple_id', '==', coupleId),
      orderBy('created_at', 'desc')
    );
    const snap = await getDocs(q);
    const results = snap.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data, profiles: membersMap[data.user_id] || null };
    });

    wishesCache = results;
    lastCoupleId = coupleId;
    return results;
  } catch (error) {
    console.warn("Falling back to client-side sort for wishes", error);
    const membersQuery = query(collection(db, 'users'), where('couple_id', '==', coupleId));
    const membersSnap = await getDocs(membersQuery);
    const membersMap = {};
    membersSnap.forEach(d => membersMap[d.id] = d.data());

    const qFallback = query(collection(db, 'wishes'), where('couple_id', '==', coupleId));
    const snap = await getDocs(qFallback);
    const results = snap.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data, profiles: membersMap[data.user_id] || null };
    });
    const sorted = results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    wishesCache = sorted;
    lastCoupleId = coupleId;
    return sorted;
  }
}

export function invalidateWishesCache() {
  wishesCache = null;
  lastCoupleId = null;
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

  invalidateWishesCache();

  const userSnap = await getDoc(doc(db, 'users', userId));
  return { id: docRef.id, ...docData, profiles: userSnap.exists() ? userSnap.data() : null };
}

export async function deleteWish(id) {
  await deleteDoc(doc(db, 'wishes', id));
  invalidateWishesCache();
}

export async function getRandomWish(coupleId) {
  const wishes = await getWishes(coupleId);
  if (!wishes || wishes.length === 0) return null;
  return wishes[Math.floor(Math.random() * wishes.length)];
}
