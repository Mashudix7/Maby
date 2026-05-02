import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import FactCard from '../components/ui/FactCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFacts, upsertFact, FACT_CATEGORIES } from '../services/factService';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
      const q = query(collection(db, 'users'), where('couple_id', '==', coupleId));
      const membersSnap = await getDocs(q);
      const members = membersSnap.docs.map(doc => ({ user_id: doc.id, profiles: doc.data() }));

      const me = members?.find((m) => m.user_id === user.uid);
      const partner = members?.find((m) => m.user_id !== user.uid);
      
      const myDisplayName = user?.displayName || (user?.email?.includes('feby') ? 'Feby Zahara' : 'Mashudi');
      
      setMyProfile(me?.profiles || { display_name: myDisplayName, avatar_url: '' });
      
      if (partner?.profiles) {
        setPartnerProfile(partner.profiles);
      } else {
        // Fallback for Maby if partner hasn't logged in yet
        const partnerName = myDisplayName.toLowerCase().includes('feby') ? 'Mashudi' : 'Feby Zahara';
        setPartnerProfile({ display_name: partnerName, avatar_url: '' });
      }

      // Get all facts for this couple
      const facts = await getFacts(coupleId);
      const myMap = {};
      const partnerMap = {};
      facts.forEach((f) => {
        if (f.user_id === user.uid) myMap[f.category] = f.content;
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
      await upsertFact(coupleId, user.uid, category, value);
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
              <h2 className="font-serif text-xl text-on-surface dark:text-[#ede0df] mb-1">{profile?.display_name || '...'}</h2>
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
          <div className="flex justify-center pt-2">
            <Link to="/rahasia" className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-zinc-900 dark:bg-black text-zinc-300 hover:text-white border border-zinc-700 dark:border-zinc-800 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span className="text-sm font-semibold tracking-wide">Ruang Rahasia</span>
            </Link>
          </div>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent mx-auto mt-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <ProfileSection profile={myProfile} facts={myFacts} isMe={true} />
          <ProfileSection profile={partnerProfile} facts={partnerFacts} isMe={false} />
        </div>
      </div>
    </MainLayout>
  );
}
