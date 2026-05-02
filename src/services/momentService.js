import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc, orderBy } from 'firebase/firestore';

export async function getMoments(coupleId) {
  try {
    const q = query(
      collection(db, 'moments'),
      where('couple_id', '==', coupleId),
      orderBy('date', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn("Mungkin index belum dibuat, mencoba tanpa orderBy", error);
    const qFallback = query(collection(db, 'moments'), where('couple_id', '==', coupleId));
    const snap = await getDocs(qFallback);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
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
  return { id: docRef.id, ...docData };
}

export async function deleteMoment(id) {
  await deleteDoc(doc(db, 'moments', id));
}

