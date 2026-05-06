import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/ui/GlassCard';
import MomentCard, { MomentCardSkeleton } from '../components/ui/MomentCard';
import SmartImage from '../components/ui/SmartImage';
import ScrollReveal from '../components/ui/ScrollReveal';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { listenMoments } from '../services/momentService';
import { setMoodToday, listenAllMoodsToday } from '../services/moodService';
import { listenWishes } from '../services/wishService';
import { listenStreak, listenDailyActivity } from '../services/streakService';
import { requestNotificationPermission, listenForPartnerWishes } from '../services/notificationService';
import { listenForNudges } from '../services/nudgeService';
import { getWIBDate } from '../lib/dateUtils';

// ... (Mood options, StreakIndicator, RelationshipTimer stay the same)

export default function Dashboard() {
  const { profile, coupleId, user } = useAuth();
  const { t, language } = useLanguage();
  
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMood, setCurrentMood] = useState(null);
  const [allMoods, setAllMoods] = useState({});
  const [latestWish, setLatestWish] = useState(null);
  const [streakData, setStreakData] = useState({ total_streak: 0 });
  const [dailyActivity, setDailyActivity] = useState(null);

  useEffect(() => {
    if (!coupleId || !user) return;
    
    const today = getWIBDate();

    const unsubMoments = listenMoments(coupleId, (momentsData) => {
      setMoments(momentsData.slice(0, 3));
      setLoading(false);
    });

    const unsubWishes = listenWishes(coupleId, (wishesData) => {
      setLatestWish(wishesData?.[0] || null);
    });

    const unsubMoods = listenAllMoodsToday(coupleId, (moodsData) => {
      setAllMoods(moodsData);
      setCurrentMood(moodsData[user.uid] || null);
    });

    const unsubStreak = listenStreak(coupleId, (data) => {
      setStreakData(data);
    });

    const unsubActivity = listenDailyActivity(coupleId, today, (data) => {
      setDailyActivity(data);
    });

    const now = new Date();
    const jakartaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
    const nextMidnight = new Date(jakartaTime);
    nextMidnight.setHours(24, 0, 0, 0);
    const msToMidnight = nextMidnight.getTime() - jakartaTime.getTime();

    const timer = setTimeout(() => {
      window.location.reload(); 
    }, msToMidnight);

    return () => {
      unsubMoments();
      unsubWishes();
      unsubMoods();
      unsubStreak();
      unsubActivity();
      clearTimeout(timer);
    };
  }, [coupleId, user]);

  useEffect(() => {
    if (!coupleId || !user) return;
    requestNotificationPermission(t);
    const unsubscribeWishes = listenForPartnerWishes(coupleId, user.uid, t);
    const unsubscribeNudges = listenForNudges(coupleId, user.uid, t);
    return () => {
      if (unsubscribeWishes) unsubscribeWishes();
      if (unsubscribeNudges) unsubscribeNudges();
    };
  }, [coupleId, user, t]);

  const handleSetMood = useCallback(async (moodId) => {
    if (currentMood) return;
    setCurrentMood(moodId);
    setAllMoods(prev => ({ ...prev, [user.uid]: moodId }));
    try {
      await setMoodToday(coupleId, user.uid, moodId);
    } catch (err) {
      console.error('Gagal menyimpan mood', err);
    }
  }, [currentMood, coupleId, user?.uid]);

  const relationshipDuration = useMemo(() => {
    const start = new Date('2026-02-21');
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years === 0 && months === 0) return t('dashboard.duration_just_started');
    let text = t('dashboard.relationship_duration') + ' ';
    if (years > 0) text += `${years} ${t('dashboard.years')} `;
    if (months > 0) text += `${months} ${t('dashboard.months')}`;
    return text + ' 💗';
  }, [language, t]);

  const formattedCurrentDate = useMemo(() => {
    const today = getWIBDate();
    const date = new Date(today);
    return date.toLocaleDateString(
      language === 'id' ? 'id-ID' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  }, [language]);

  const moodCount = Object.keys(allMoods).length;

  if (loading) {
    return (
      <MainLayout activePage="/">
        <DashboardSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout activePage="/">
      <div className="max-w-[1140px] mx-auto flex flex-col gap-12 md:gap-20 pb-20">
        
        {/* Hero Greeting */}
        <ScrollReveal delay={100}>
          <div className="flex flex-col items-center text-center mt-[-0.5rem] px-4">
            <div className="w-full max-w-lg flex justify-between items-center mb-6">
              <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-primary/60">
                {formattedCurrentDate}
              </span>
              <div className="flex items-center gap-2">
                <StreakIndicator streak={streakData.total_streak} activity={dailyActivity} />
              </div>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-on-surface dark:text-[#ede0df] mb-2 md:mb-4">
              {t('dashboard.hai')}, {profile?.display_name || t('dashboard.sayangku')}
            </h1>
            <p className="font-sans text-sm md:text-base font-semibold text-primary dark:text-rose-400 mb-6">
              {relationshipDuration}
            </p>
            <div className="w-full max-w-lg mx-auto bg-primary-container/20 dark:bg-rose-900/10 rounded-3xl p-4 border border-primary/10 shadow-sm">
              <p className="text-xs font-semibold text-primary dark:text-rose-300 mb-2 tracking-widest uppercase">{t('dashboard.anniversary_countdown')}</p>
              <RelationshipTimer />
            </div>
          </div>
        </ScrollReveal>

        {/* Bento Grid Layout */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Today's Memory */}
          <div className="md:col-span-8">
            <ScrollReveal direction="left" delay={200}>
              <div className="bg-zinc-100 dark:bg-white/5 rounded-2xl md:rounded-[2rem] p-4 md:p-8 flex flex-col relative overflow-hidden group min-h-[280px] md:min-h-[400px] border border-primary/5">
                {moments[0]?.image_url ? (
                  <div className="absolute inset-0 z-0">
                    <SmartImage
                      src={moments[0].image_url}
                      alt={t('dashboard.last_memory')}
                      aspectRatio="h-full"
                      className="opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/90 dark:from-[#1a1517]/90 via-surface-container-low/40 dark:via-[#1a1517]/40 to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="absolute inset-0 z-0 soft-gradient opacity-30 pointer-events-none" />
                )}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 dark:bg-white/10 text-primary dark:text-rose-300 font-sans text-xs font-semibold tracking-wide backdrop-blur-md">
                      <span className="material-symbols-outlined mr-2 text-[16px]">photo_library</span>
                      {moments[0] ? t('dashboard.last_memory') : t('dashboard.no_memory')}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <h2 className="font-serif text-xl md:text-3xl text-on-surface dark:text-[#ede0df] mb-2">
                      {moments[0]?.title || t('dashboard.add_first')}
                    </h2>
                    {moments[0]?.story && (
                      <p className="font-sans text-base text-on-surface-variant dark:text-zinc-400 font-serif italic line-clamp-2">
                        &quot;{moments[0].story.slice(0, 100)}...&quot;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Side Column */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <ScrollReveal direction="right" delay={300}>
              <div className="flex flex-col gap-3 mb-2">
                <Link to="/games" className="group relative h-20 md:h-22 rounded-2xl overflow-hidden shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] border border-primary/10">
                   <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-rose-500/90 dark:from-rose-900/60 dark:to-rose-800/60" />
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                   <div className="relative h-full flex items-center p-4 md:p-5 gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform shrink-0">
                        <span className="material-symbols-outlined text-xl text-white">casino</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <h3 className="font-serif text-base md:text-lg font-bold text-white leading-none">Truth or Dare</h3>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/70 mt-1">Fun Challenge</p>
                      </div>
                      <span className="material-symbols-outlined ml-auto text-white/50 group-hover:text-white transition-colors">chevron_right</span>
                   </div>
                </Link>

                <Link to="/prediction" className="group relative h-20 md:h-22 rounded-2xl overflow-hidden shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] border border-indigo-500/10">
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/90 to-purple-500/90 dark:from-indigo-900/60 dark:to-purple-800/60" />
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                   <div className="relative h-full flex items-center p-4 md:p-5 gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner group-hover:-rotate-12 transition-transform shrink-0">
                        <span className="material-symbols-outlined text-xl text-white">psychology</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <h3 className="font-serif text-base md:text-lg font-bold text-white leading-none">Prediction Game</h3>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/70 mt-1">Deep Match</p>
                      </div>
                      <span className="material-symbols-outlined ml-auto text-white/50 group-hover:text-white transition-colors">chevron_right</span>
                   </div>
                </Link>

                <Link to="/love-ladder" className="group relative h-20 md:h-22 rounded-2xl overflow-hidden shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] border border-rose-400/10">
                   <div className="absolute inset-0 bg-gradient-to-r from-rose-400/90 to-orange-400/90 dark:from-rose-900/60 dark:to-orange-800/60" />
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                   <div className="relative h-full flex items-center p-4 md:p-5 gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform shrink-0">
                        <span className="material-symbols-outlined text-xl text-white">grid_view</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <h3 className="font-serif text-base md:text-lg font-bold text-white leading-none">Love Ladder</h3>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/70 mt-1">Adventure Together</p>
                      </div>
                      <span className="material-symbols-outlined ml-auto text-white/50 group-hover:text-white transition-colors">chevron_right</span>
                   </div>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={400}>
              <GlassCard className="flex flex-col items-center justify-center text-center p-4 md:p-8 border border-primary/10">
                <div className="flex items-center justify-between w-full mb-6">
                  <h3 className="font-serif text-xl md:text-2xl text-on-surface dark:text-[#ede0df]">{t('dashboard.mood_title')}</h3>
                  <div className="bg-primary/10 text-primary dark:text-rose-300 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                    {moodCount}/2
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center mb-6">
                  {MOOD_OPTIONS.map((mood) => {
                    const isActive = currentMood === mood.id || currentMood === mood.label_id || currentMood === mood.label_en;
                    return (
                    <button
                      key={mood.id}
                      onClick={() => handleSetMood(mood.id)}
                      disabled={!!currentMood}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm transition-all duration-300 hover:scale-110 active:scale-95 ${isActive
                          ? 'bg-primary text-white ring-4 ring-primary/20 scale-110'
                          : currentMood 
                            ? 'opacity-40 grayscale cursor-not-allowed'
                            : 'bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 hover:border-primary/40'
                        }`}
                    >
                      {mood.emoji}
                    </button>
                  )})}
                </div>

                <div className="flex w-full gap-2 mt-2">
                  <div className={`flex-1 p-2 rounded-xl border transition-all ${allMoods[user?.uid] ? 'bg-primary/5 border-primary/20' : 'bg-zinc-100/50 dark:bg-white/5 border-zinc-200/50 dark:border-white/10 opacity-50'}`}>
                    <span className="text-[10px] block font-bold uppercase tracking-tighter text-outline dark:text-zinc-500 mb-1">
                      {profile?.display_name?.split(' ')[0] || 'Kamu'}
                    </span>
                    <span className="text-xl">
                      {MOOD_OPTIONS.find(m => m.id === allMoods[user?.uid] || m.label_id === allMoods[user?.uid] || m.label_en === allMoods[user?.uid])?.emoji || '—'}
                    </span>
                  </div>
                  <div className={`flex-1 p-2 rounded-xl border transition-all ${Object.keys(allMoods).find(id => id !== user?.uid) ? 'bg-primary/5 border-primary/20' : 'bg-zinc-100/50 dark:bg-white/5 border-zinc-200/50 dark:border-white/10 opacity-50'}`}>
                    <span className="text-[10px] block font-bold uppercase tracking-tighter text-outline dark:text-zinc-500 mb-1">
                      {profile?.display_name?.includes('Feby') ? 'Mashudi' : 'Feby Zahara'}
                    </span>
                    <span className="text-xl">
                      {(() => {
                        const partnerId = Object.keys(allMoods).find(id => id !== user?.uid);
                        const partnerMood = allMoods[partnerId];
                        return MOOD_OPTIONS.find(m => m.id === partnerMood || m.label_id === partnerMood || m.label_en === partnerMood)?.emoji || '—';
                      })()}
                    </span>
                  </div>
                </div>
                
                <p className="font-sans text-[10px] font-semibold text-outline dark:text-zinc-500 mt-4 italic">
                  {currentMood ? t('dashboard.mood_locked') : t('dashboard.mood_hint')}
                </p>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={500}>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/momen/baru" className="bg-white/40 dark:bg-white/5 p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 group/box hover:scale-105 transition-all duration-300 hover:border-primary/30 border border-primary/5">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_4px_12px_rgba(176,0,77,0.2)] group-hover/box:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                  </div>
                  <span className="font-serif text-sm font-semibold text-on-surface dark:text-[#ede0df]" dangerouslySetInnerHTML={{ __html: t('dashboard.new_moment').replace(' ', '<br/>') }} />
                </Link>
                <Link to="/harapan" className="bg-white/40 dark:bg-white/5 p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 group/box hover:scale-105 transition-all duration-300 hover:border-primary/30 border border-primary/5">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_4px_12px_rgba(176,0,77,0.2)] group-hover/box:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">favorite</span>
                  </div>
                  <span className="font-serif text-sm font-semibold text-on-surface dark:text-[#ede0df]" dangerouslySetInnerHTML={{ __html: t('dashboard.write_wish').replace(' ', '<br/>') }} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Recent Moments */}
        <ScrollReveal direction="up" delay={600}>
          <GlassCard className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 border border-primary/5">
            <div className="flex justify-between items-center border-b border-outline-variant/30 dark:border-white/10 pb-4">
              <h2 className="font-serif text-xl md:text-2xl text-on-surface dark:text-[#ede0df]">{t('dashboard.see_all')}</h2>
              <Link
                to="/momen"
                className="font-sans text-[11px] md:text-xs font-semibold text-primary dark:text-rose-300 hover:text-on-surface transition-colors flex items-center gap-1 bg-primary-container/30 dark:bg-primary-container/10 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
              >
                {t('dashboard.see_all')} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 hide-scrollbar">
              {moments.map((moment) => (
                <MomentCard
                  key={moment.id}
                  id={moment.id}
                  image={moment.image_url}
                  date={moment.date ? new Date(moment.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' }) : ''}
                  title={moment.title}
                />
              ))}
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>
    </MainLayout>
  );
}

