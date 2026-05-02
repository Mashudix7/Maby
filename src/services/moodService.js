import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function getMoodToday(coupleId, userId) {
  const dateStr = new Date().toISOString().split('T')[0];
  const id = `${coupleId}_${userId}_${dateStr}`;
  const docRef = doc(db, 'moods', id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data().mood;
  }
  return null;
}

export async function setMoodToday(coupleId, userId, mood) {
  const dateStr = new Date().toISOString().split('T')[0];
  const id = `${coupleId}_${userId}_${dateStr}`;
  const docRef = doc(db, 'moods', id);
  await setDoc(docRef, {
    couple_id: coupleId,
    user_id: userId,
    date: dateStr,
    mood,
    timestamp: new Date().toISOString()
  });
}
