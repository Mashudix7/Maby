import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

export const requestNotificationPermission = async (t) => {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') return true;

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showLocalNotification = (title, body) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  // Check if we are in a service worker or a window
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body: body,
        icon: '/logo.jpg',
        badge: '/logo.jpg',
        vibrate: [200, 100, 200],
        tag: 'maby-notification',
        renotify: true
      });
    });
  } else {
    new Notification(title, { body, icon: '/logo.jpg' });
  }
};

/**
 * Listen for new wishes and notify if they are from the partner
 */
export const listenForPartnerWishes = (coupleId, userId, t) => {
  const q = query(
    collection(db, 'wishes'),
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
        const wish = change.doc.data();
        // Notify only if it's from the partner
        if (wish.user_id !== userId) {
          showLocalNotification(
            t('notifications.streak_reminder_title'),
            t('notifications.streak_reminder_body')
          );
        }
      }
    });
  });
};
