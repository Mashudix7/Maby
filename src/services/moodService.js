import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getCached, setCached, invalidate } from '../lib/queryCache';

const MOOD_TTL = 10 * 60 * 1000; // 10 minutes (mood only changes once per day)

export async function getMoodToday(coupleId, userId) {
  const dateStr = new Date().toISOString().split('T')[0];
  const cacheKey = `mood:${coupleId}:${userId}:${dateStr}`;
  
  const cached = getCached(cacheKey);
  if (cached !== undefined) return cached;

  const id = `${coupleId}_${userId}_${dateStr}`;
  const docRef = doc(db, 'moods', id);
  const snap = await getDoc(docRef);
  const mood = snap.exists() ? snap.data().mood : null;
  
  setCached(cacheKey, mood, MOOD_TTL);
  return mood;
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
  
  // Update cache immediately
  const cacheKey = `mood:${coupleId}:${userId}:${dateStr}`;
  setCached(cacheKey, mood, MOOD_TTL);
}
