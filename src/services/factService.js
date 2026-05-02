import { supabase } from '../lib/supabase';

// Fact categories with their UI config
export const FACT_CATEGORIES = [
  { key: 'food', icon: 'restaurant', iconBg: 'bg-primary-container', iconColor: 'text-primary', label: 'Makanan Favorit', placeholder: 'Kamu suka makan apa sih?' },
  { key: 'place', icon: 'landscape', iconBg: 'bg-secondary-container', iconColor: 'text-secondary', label: 'Tempat Favorit', placeholder: 'Tempat paling nyaman buat kamu?' },
  { key: 'dislike', icon: 'heart_broken', iconBg: 'bg-error-container', iconColor: 'text-error', label: 'Nggak Disuka', placeholder: 'Apa yang bikin kamu nggak nyaman?' },
  { key: 'love_lang', icon: 'favorite', iconBg: 'bg-tertiary-container', iconColor: 'text-tertiary', label: 'Bahasa Cinta', placeholder: 'Gimana cara kamu merasa dicintai?' },
  { key: 'sad_comfort', icon: 'spa', iconBg: 'bg-surface-variant', iconColor: 'text-primary', label: 'Kalau Lagi Sedih', placeholder: 'Gimana caranya bikin kamu tenang?', isTextarea: true },
];

export async function getFacts(coupleId) {
  const { data, error } = await supabase
    .from('facts')
    .select('*')
    .eq('couple_id', coupleId);
  if (error) throw error;
  return data || [];
}

export async function upsertFact(coupleId, userId, category, content) {
  const { data, error } = await supabase
    .from('facts')
    .upsert(
      {
        couple_id: coupleId,
        user_id: userId,
        category,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,category' }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
