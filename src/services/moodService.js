import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { getCached, setCached } from '../lib/queryCache';
import { getWIBDate } from '../lib/dateUtils';
import { updateStreakActivity } from './streakService';

const MOOD_TTL = 10 * 60 * 1000; // 10 minutes

export async function getMoodToday(coupleId, userId) {
  const dateStr = getWIBDate();
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
  const dateStr = getWIBDate();
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

  // Update streak activity
  try {
    updateStreakActivity(coupleId, userId).catch(err => console.error('Streak update failed:', err));
  } catch (err) {
    console.error('Failed to trigger streak update from mood:', err);
  }
}

export async function getAllMoodsToday(coupleId) {
  const dateStr = getWIBDate();
  const cacheKey = `moods_all:${coupleId}:${dateStr}`;
  
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const q = query(
    collection(db, 'moods'),
    where('couple_id', '==', coupleId),
    where('date', '==', dateStr)
  );
  
  const snap = await getDocs(q);
  const moods = {};
  snap.forEach(doc => {
    const data = doc.data();
    moods[data.user_id] = data.mood;
  });
  
  setCached(cacheKey, moods, MOOD_TTL);
  return moods;
}

export function listenAllMoodsToday(coupleId, callback) {
  const dateStr = getWIBDate();
  const q = query(
    collection(db, 'moods'),
    where('couple_id', '==', coupleId),
    where('date', '==', dateStr)
  );
  
  return onSnapshot(q, (snap) => {
    const moods = {};
    snap.forEach(doc => {
      const data = doc.data();
      moods[data.user_id] = data.mood;
    });
    callback(moods);
  }, (error) => {
    console.error("Real-time moods error:", error);
  });
}
