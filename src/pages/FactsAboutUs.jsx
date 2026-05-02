import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import FactCard from '../components/ui/FactCard';
import { useAuth } from '../context/AuthContext';
import { getFacts, upsertFact, FACT_CATEGORIES } from '../services/factService';
import { supabase } from '../lib/supabase';

export default function FactsAboutUs() {
  const { user, coupleId } = useAuth();
  const [myFacts, setMyFacts] = useState({});
  const [partnerFacts, setPartnerFacts] = useState({});
  const [myProfile, setMyProfile] = useState(null);
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');

  const loadData = useCallback(async () => {
    if (!coupleId || !user) return;
    try {
      // Get both couple members
      const { data: members } = await supabase
        .from('couple_members')
        .select('user_id, profiles(id, display_name, avatar_url)')
        .eq('couple_id', coupleId);

      const me = members?.find((m) => m.user_id === user.id);
      const partner = members?.find((m) => m.user_id !== user.id);
      setMyProfile(me?.profiles || { display_name: 'Aku', avatar_url: '' });
      setPartnerProfile(partner?.profiles || null);

      // Get all facts for this couple
      const facts = await getFacts(coupleId);
      const myMap = {};
      const partnerMap = {};
      facts.forEach((f) => {
        if (f.user_id === user.id) myMap[f.category] = f.content;
        else partnerMap[f.category] = f.content;
      });
      setMyFacts(myMap);
      setPartnerFacts(partnerMap);
    } catch (err) {
      console.error('Gagal memuat fakta:', err);
    } finally {
      setLoading(false);
    }
  }, [coupleId, user]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleSave(category, value) {
    setSaving(category);
    try {
      await upsertFact(coupleId, user.id, category, value);
      setMyFacts((prev) => ({ ...prev, [category]: value }));
    } catch (err) {
      console.error('Gagal menyimpan:', err);
    } finally {
      setSaving('');
    }
  }

  // Debounced save on blur
  function handleBlur(category, value) {
    if (value !== (myFacts[category] || '')) {
      handleSave(category, value);
    }
  }

  function ProfileSection({ profile, facts, isMe }) {
    return (
      <section className="glass-panel rounded-xl p-6 lg:p-10 flex flex-col gap-6 relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img className="w-16 h-16 rounded-full object-cover border-4 border-white/80 dark:border-white/10 shadow-md" src={profile.avatar_url} alt={profile.display_name} />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-container dark:bg-primary-container/30 flex items-center justify-center text-primary text-2xl font-serif">
                {(profile?.display_name || '?')[0].toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="font-serif text-xl text-on-surface dark:text-[#ede0df] mb-1">{isMe ? 'Aku' : (profile?.display_name || 'Pasangan')}</h2>
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-zinc-500">
                {isMe ? 'Hatiku' : 'Jiwaku'}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 z-10">
          {FACT_CATEGORIES.map((cat) => (
            <FactCard
              key={cat.key}
              icon={cat.icon}
              iconBg={cat.iconBg}
              iconColor={cat.iconColor}
              label={cat.label}
              value={isMe ? (myFacts[cat.key] || '') : (facts[cat.key] || '')}
              placeholder={cat.placeholder}
              isTextarea={cat.isTextarea}
              onChange={isMe ? undefined : undefined}
              onBlur={isMe ? (e) => handleBlur(cat.key, e.target.value) : undefined}
              readOnly={!isMe}
            />
          ))}
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <MainLayout activePage="/fakta">
        <div className="text-center py-20">
          <p className="font-serif italic text-on-surface-variant dark:text-zinc-500">Memuat fakta...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activePage="/fakta">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-center mb-10 md:mb-16 space-y-4">
          <h1 className="font-serif text-3xl md:text-5xl text-primary dark:text-rose-300">Fakta Tentang Kita</h1>
          <p className="text-lg text-on-surface-variant dark:text-zinc-400 font-serif italic">Hal-hal kecil yang bikin kita utuh, tercatat di sini.</p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent mx-auto mt-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <ProfileSection profile={myProfile} facts={myFacts} isMe={true} />
          {partnerProfile ? (
            <ProfileSection profile={partnerProfile} facts={partnerFacts} isMe={false} />
          ) : (
            <div className="glass-panel rounded-xl p-10 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-5xl text-outline-variant dark:text-zinc-700 mb-4">person_add</span>
              <p className="font-serif italic text-on-surface-variant dark:text-zinc-500">Pasanganmu belum bergabung</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
