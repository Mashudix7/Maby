import { db, storage } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

export async function uploadMomentImage(file) {
  const ext = file.name.split('.').pop();
  const fileName = `moments/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef = ref(storage, fileName);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
