import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs, onSnapshot, runTransaction } from 'firebase/firestore';
import { getCached, setCached, invalidatePrefix } from '../lib/queryCache';
import { getWIBDate } from '../lib/dateUtils';

const STREAK_TTL = 3 * 60 * 1000; // 3 minutes
const ACTIVITY_TTL = 3 * 60 * 1000; // 3 minutes

export const getStreak = async (coupleId) => {
  const cacheKey = `streak:${coupleId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const streakDoc = await getDoc(doc(db, 'streaks', coupleId));
    const data = streakDoc.exists()
      ? streakDoc.data()
      : { total_streak: 0, last_increment_date: null };
    
    setCached(cacheKey, data, STREAK_TTL);
    return data;
  } catch (error) {
    console.error('Error getting streak:', error);
    return { total_streak: 0, last_increment_date: null };
  }
};

export const getDailyActivity = async (coupleId, date) => {
  const cacheKey = `activity:${coupleId}:${date}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const activityDoc = await getDoc(doc(db, 'streaks', coupleId, 'daily_activity', date));
    const data = activityDoc.exists()
      ? activityDoc.data()
      : { user1_active: false, user2_active: false, completed: false };
    
    setCached(cacheKey, data, ACTIVITY_TTL);
    return data;
  } catch (error) {
    console.error('Error getting daily activity:', error);
    return { user1_active: false, user2_active: false, completed: false };
  }
};

export function listenStreak(coupleId, callback) {
  return onSnapshot(doc(db, 'streaks', coupleId), (snap) => {
    const data = snap.exists()
      ? snap.data()
      : { total_streak: 0, last_increment_date: null };
    callback(data);
  });
}

export function listenDailyActivity(coupleId, date, callback) {
  return onSnapshot(doc(db, 'streaks', coupleId, 'daily_activity', date), (snap) => {
    const data = snap.exists()
      ? snap.data()
      : { user1_active: false, user2_active: false, completed: false };
    callback(data);
  });
}

/**
 * Updates streak activity using a transaction to prevent race conditions.
 * Ensures that if both users update at the same time, the streak is correctly incremented.
 */
export const updateStreakActivity = async (coupleId, userId) => {
  try {
    if (!coupleId || !userId) return;
    
    const today = getWIBDate();
    const activityRef = doc(db, 'streaks', coupleId, 'daily_activity', today);
    const streakRef = doc(db, 'streaks', coupleId);

    // Get members to identify user1 vs user2
    const q = query(collection(db, 'users'), where('couple_id', '==', coupleId));
    const membersSnap = await getDocs(q);
    const members = membersSnap.docs.map(d => d.id).sort();
    
    const userIndex = members.indexOf(userId);
    if (userIndex === -1) return;
    const fieldToUpdate = userIndex === 0 ? 'user1_active' : 'user2_active';

    // Use transaction for atomic updates
    await runTransaction(db, async (transaction) => {
      const activitySnap = await transaction.get(activityRef);
      let activityData = activitySnap.exists() 
        ? activitySnap.data() 
        : { user1_active: false, user2_active: false, completed: false };

      // If already active, no need to update
      if (activityData[fieldToUpdate] && activityData.completed) return;

      // Update current user's activity
      activityData[fieldToUpdate] = true;
      
      // Check if both are now active
      const isNowCompleted = activityData.user1_active && activityData.user2_active;
      
      if (isNowCompleted && !activityData.completed) {
        activityData.completed = true;
        
        const streakSnap = await transaction.get(streakRef);
        if (streakSnap.exists()) {
          const streakData = streakSnap.data();
          // Only increment if not already incremented today
          if (streakData.last_increment_date !== today) {
            transaction.update(streakRef, {
              total_streak: increment(1),
              last_increment_date: today,
              last_activity_at: new Date().toISOString()
            });
          }
        } else {
          transaction.set(streakRef, {
            total_streak: 1,
            last_increment_date: today,
            last_activity_at: new Date().toISOString()
          });
        }
      }

      // Save activity data
      transaction.set(activityRef, activityData, { merge: true });
    });

    invalidatePrefix('streak:');
    invalidatePrefix('activity:');
  } catch (error) {
    console.error('Error updating streak activity in transaction:', error);
  }
};
