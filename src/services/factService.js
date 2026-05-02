import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

// Fact categories with their UI config
export const FACT_CATEGORIES = [
  { key: 'food', icon: 'restaurant', iconBg: 'bg-primary-container', iconColor: 'text-primary', label: 'Makanan Favorit', placeholder: 'Kamu suka makan apa sih?' },
  { key: 'place', icon: 'landscape', iconBg: 'bg-secondary-container', iconColor: 'text-secondary', label: 'Tempat Favorit', placeholder: 'Tempat paling nyaman buat kamu?' },
  { key: 'dislike', icon: 'heart_broken', iconBg: 'bg-error-container', iconColor: 'text-error', label: 'Nggak Disuka', placeholder: 'Apa yang bikin kamu nggak nyaman?' },
  { key: 'love_lang', icon: 'favorite', iconBg: 'bg-tertiary-container', iconColor: 'text-tertiary', label: 'Bahasa Cinta', placeholder: 'Gimana cara kamu merasa dicintai?' },
  { key: 'sad_comfort', icon: 'spa', iconBg: 'bg-surface-variant', iconColor: 'text-primary', label: 'Kalau Lagi Sedih', placeholder: 'Gimana caranya bikin kamu tenang?', isTextarea: true },
];

export async function getFacts(coupleId) {
  const q = query(collection(db, 'facts'), where('couple_id', '==', coupleId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function upsertFact(coupleId, userId, category, content) {
  // Use a predictable document ID to act as "upsert" mechanism (one fact per user per category)
  const factId = `${userId}_${category}`;
  const docRef = doc(db, 'facts', factId);
  
  const factData = {
    couple_id: coupleId,
    user_id: userId,
    category,
    content,
    updated_at: new Date().toISOString(),
  };

  await setDoc(docRef, factData, { merge: true });
  return { id: factId, ...factData };
}
