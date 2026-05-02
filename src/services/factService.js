import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

// Fact categories with their UI config
export const FACT_CATEGORIES = [
  { key: 'food', icon: 'restaurant', iconBg: 'bg-primary-container', iconColor: 'text-primary', label: 'Makanan Favorit', label_en: 'Favorite Food', placeholder: 'Kamu suka makan apa sih?', placeholder_en: 'What do you love to eat?' },
  { key: 'place', icon: 'landscape', iconBg: 'bg-secondary-container', iconColor: 'text-secondary', label: 'Tempat Favorit', label_en: 'Favorite Place', placeholder: 'Tempat paling nyaman buat kamu?', placeholder_en: 'Most comfortable place for you?' },
  { key: 'dislike', icon: 'heart_broken', iconBg: 'bg-error-container', iconColor: 'text-error', label: 'Nggak Disuka', label_en: 'Dislikes', placeholder: 'Apa yang bikin kamu nggak nyaman?', placeholder_en: 'What makes you uncomfortable?' },
  { key: 'love_lang', icon: 'favorite', iconBg: 'bg-tertiary-container', iconColor: 'text-tertiary', label: 'Bahasa Cinta', label_en: 'Love Language', placeholder: 'Gimana cara kamu merasa dicintai?', placeholder_en: 'How do you feel loved?' },
  { key: 'sad_comfort', icon: 'spa', iconBg: 'bg-surface-variant', iconColor: 'text-primary', label: 'Kalau Lagi Sedih', label_en: 'When Sad', placeholder: 'Gimana caranya bikin kamu tenang?', placeholder_en: 'How to make you feel calm?', isTextarea: true },
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
