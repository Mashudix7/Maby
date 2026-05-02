import { supabase } from '../lib/supabase';

export async function getWishes(coupleId) {
  const { data, error } = await supabase
    .from('wishes')
    .select('*, profiles(display_name, avatar_url)')
    .eq('couple_id', coupleId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createWish(coupleId, userId, text) {
  const { data, error } = await supabase
    .from('wishes')
    .insert({
      couple_id: coupleId,
      user_id: userId,
      text,
    })
    .select('*, profiles(display_name, avatar_url)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWish(id) {
  const { error } = await supabase.from('wishes').delete().eq('id', id);
  if (error) throw error;
}

export async function getRandomWish(coupleId) {
  // Fetch all, pick random client-side (simple approach)
  const { data, error } = await supabase
    .from('wishes')
    .select('*, profiles(display_name, avatar_url)')
    .eq('couple_id', coupleId);
  if (error) throw error;
  if (!data || data.length === 0) return null;
  return data[Math.floor(Math.random() * data.length)];
}
