import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Get the current streak status for a couple
 */
export const getStreak = async (coupleId) => {
  try {
    const streakDoc = await getDoc(doc(db, 'streaks', coupleId));
    if (streakDoc.exists()) {
      return streakDoc.data();
    }
    // Return initial state if doc doesn't exist
    return { total_streak: 0, last_increment_date: null };
  } catch (error) {
    console.error('Error getting streak:', error);
    return { total_streak: 0, last_increment_date: null };
  }
};

/**
 * Check activity for a specific date
 */
export const getDailyActivity = async (coupleId, date) => {
  try {
    const activityDoc = await getDoc(doc(db, 'streaks', coupleId, 'daily_activity', date));
    if (activityDoc.exists()) {
      return activityDoc.data();
    }
    return { user1_active: false, user2_active: false, completed: false };
  } catch (error) {
    console.error('Error getting daily activity:', error);
    return { user1_active: false, user2_active: false, completed: false };
  }
};

/**
 * Mark a user as active for today and potentially increment streak
 */
export const updateStreakActivity = async (coupleId, userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const activityRef = doc(db, 'streaks', coupleId, 'daily_activity', today);
    const streakRef = doc(db, 'streaks', coupleId);

    // 1. Get current couple members to identify if user is 1 or 2
    const q = query(collection(db, 'users'), where('couple_id', '==', coupleId));
    const membersSnap = await getDocs(q);
    const members = membersSnap.docs.map(d => d.id).sort(); // Sort to have consistent 1/2 mapping
    
    const userIndex = members.indexOf(userId);
    if (userIndex === -1) return; // User not in this couple?

    const fieldToUpdate = userIndex === 0 ? 'user1_active' : 'user2_active';
    const otherField = userIndex === 0 ? 'user2_active' : 'user1_active';

    // 2. Get current activity
    const activitySnap = await getDoc(activityRef);
    let activityData = activitySnap.exists() ? activitySnap.data() : { user1_active: false, user2_active: false, completed: false };

    if (activityData[fieldToUpdate]) return; // Already active today

    // 3. Update activity
    activityData[fieldToUpdate] = true;
    const isNowCompleted = activityData.user1_active && activityData.user2_active;
    
    if (isNowCompleted && !activityData.completed) {
      activityData.completed = true;
      
      // 4. Increment total streak
      const streakSnap = await getDoc(streakRef);
      if (streakSnap.exists()) {
        const streakData = streakSnap.data();
        if (streakData.last_increment_date !== today) {
          await updateDoc(streakRef, {
            total_streak: increment(1),
            last_increment_date: today
          });
        }
      } else {
        await setDoc(streakRef, {
          total_streak: 1,
          last_increment_date: today
        });
      }
    }

    await setDoc(activityRef, activityData, { merge: true });
    return activityData;
  } catch (error) {
    console.error('Error updating streak activity:', error);
  }
};
