import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { updateStreakActivity } from './streakService';

export async function getPrivateNotes(userId) {
  try {
    const q = query(
      collection(db, 'private_notes'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Index missing, falling back to manual sort", error);
    const qFallback = query(collection(db, 'private_notes'), where('user_id', '==', userId));
    const snap = await getDocs(qFallback);
    const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).reverse();
  }
}

export async function createPrivateNote(userId, text) {
  const docData = {
    user_id: userId,
    text,
    created_at: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, 'private_notes'), docData);

  try {
    const userSnap = await getDoc(doc(db, 'users', userId));
    if (userSnap.exists()) {
      const coupleId = userSnap.data().couple_id;
      if (coupleId) {
        updateStreakActivity(coupleId, userId).catch(err => console.error('Streak update failed:', err));
      }
    }
  } catch (err) {
    console.error('Failed to get coupleId for streak update:', err);
  }

  return { id: docRef.id, ...docData };
}

export function listenPrivateNotes(userId, callback) {
  // Simple query to avoid index requirements
  const q = query(
    collection(db, 'private_notes'),
    where('user_id', '==', userId)
  );

  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Client-side sort
    const sorted = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    callback(sorted);
  }, (error) => {
    console.error("Real-time private notes error:", error);
  });
}

export async function deletePrivateNote(id) {
  await deleteDoc(doc(db, 'private_notes', id));
}
