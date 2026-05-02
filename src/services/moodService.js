import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getCached, setCached, invalidate } from '../lib/queryCache';

const MOOD_TTL = 10 * 60 * 1000; // 10 minutes

function getLocalDateString() {
  const d = new Date();
  // Format as YYYY-MM-DD using local time
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function getMoodToday(coupleId, userId) {
  const dateStr = getLocalDateString();
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
  const dateStr = getLocalDateString();
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
