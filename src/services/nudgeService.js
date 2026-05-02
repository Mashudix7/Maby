import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, limit, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { showLocalNotification } from './notificationService';

/**
 * Send a nudge to the partner
 */
export const sendNudge = async (coupleId, userId) => {
  try {
    await addDoc(collection(db, 'nudges'), {
      couple_id: coupleId,
      from_user_id: userId,
      created_at: serverTimestamp(),
    });

    // Update last nudge time to prevent spam
    await setDoc(doc(db, 'streaks', coupleId), {
      last_nudge_at: serverTimestamp()
    }, { merge: true });

    return true;
  } catch (err) {
    console.error('Failed to send nudge:', err);
    return false;
  }
};

/**
 * Listen for nudges from the partner
 */
export const listenForNudges = (coupleId, userId, t) => {
  const q = query(
    collection(db, 'nudges'),
    where('couple_id', '==', coupleId),
    orderBy('created_at', 'desc'),
    limit(1)
  );

  let initialLoad = true;

  return onSnapshot(q, (snapshot) => {
    if (initialLoad) {
      initialLoad = false;
      return;
    }

    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const nudge = change.doc.data();
        // Notify only if it's from the partner
        if (nudge.from_user_id !== userId) {
          showLocalNotification(
            t('notifications.nudge_title'),
            t('notifications.nudge_body')
          );
        }
      }
    });
  });
};
