import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, addDoc, deleteDoc, orderBy } from 'firebase/firestore';

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
  return { id: docRef.id, ...docData };
}

export async function deletePrivateNote(id) {
  await deleteDoc(doc(db, 'private_notes', id));
}
