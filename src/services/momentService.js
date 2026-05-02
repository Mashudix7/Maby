import { supabase } from '../lib/supabase';

export async function getMoments(coupleId) {
  const { data, error } = await supabase
    .from('moments')
    .select('*')
    .eq('couple_id', coupleId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getMomentById(id) {
  const { data, error } = await supabase
    .from('moments')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createMoment(coupleId, userId, momentData) {
  const { data, error } = await supabase
    .from('moments')
    .insert({
      couple_id: coupleId,
      user_id: userId,
      title: momentData.title,
      story: momentData.story || '',
      image_url: momentData.image_url || '',
      date: momentData.date || null,
      location: momentData.location || '',
      song_url: momentData.song_url || '',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMoment(id) {
  const { error } = await supabase.from('moments').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadMomentImage(file) {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `moments/${fileName}`;

  const { error: uploadErr } = await supabase.storage
    .from('moments')
    .upload(filePath, file);
  if (uploadErr) throw uploadErr;

  const { data } = supabase.storage.from('moments').getPublicUrl(filePath);
  return data.publicUrl;
}
