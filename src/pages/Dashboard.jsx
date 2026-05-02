import { useState, useEffect, useCallback, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/ui/GlassCard';
import MomentCard, { MomentCardSkeleton } from '../components/ui/MomentCard';
import ScrollReveal from '../components/ui/ScrollReveal';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getMoments } from '../services/momentService';
import { getMoodToday, setMoodToday } from '../services/moodService';
import { getWishes } from '../services/wishService';
import { getStreak, getDailyActivity } from '../services/streakService';
import { requestNotificationPermission, listenForPartnerWishes } from '../services/notificationService';
import { sendNudge, listenForNudges } from '../services/nudgeService';
import { showSuccess, showError } from '../lib/alerts';

const MOOD_OPTIONS = [
  { emoji: '🥰', label_id: 'Bahagia', label_en: 'Happy' },
  { emoji: '😌', label_id: 'Damai', label_en: 'Peaceful' },
  { emoji: '🥺', label_id: 'Rindu', label_en: 'Missing' },
];

function StreakIndicator({ streak, activity }) {
  const { t } = useLanguage();
  const isCompleted = activity?.completed;

  return (
    <div 
      title={isCompleted ? t('streak.completed') : t('streak.hint')}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border transition-all duration-700 ${
        isCompleted 
          ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
          : 'bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-500'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]" style={isCompleted ? { fontVariationSettings: "'FILL' 1" } : undefined}>
        local_fire_department
      </span>
      <div className="flex flex-col items-start leading-none">
        <span className="text-sm font-serif font-bold">{streak} {t('streak.days')}</span>
      </div>
    </div>
  );
}

function RelationshipTimer() {
  const { t } = useLanguage();
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const getNextTarget = () => {
      const now = new Date();
      let target = new Date(now.getFullYear(), 1, 21, 0, 0, 0); // Feb 21
      if (now.getTime() > target.getTime()) {
        target.setFullYear(now.getFullYear() + 1);
      }
      return target.getTime();
    };

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = getNextTarget() - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTime({ days, hours, minutes, seconds });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex justify-between text-center mt-6">
      <div className="flex flex-col flex-1">
        <span className="text-xl sm:text-2xl md:text-4xl font-serif text-rose-400 dark:text-rose-300">{time.days}</span>
        <span className="text-[9px] sm:text-[10px] md:text-xs font-sans text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wider mt-1">{t('dashboard.days')}</span>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-xl sm:text-2xl md:text-4xl font-serif text-rose-400 dark:text-rose-300">{time.hours}</span>
        <span className="text-[9px] sm:text-[10px] md:text-xs font-sans text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wider mt-1">{t('dashboard.hours')}</span>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-xl sm:text-2xl md:text-4xl font-serif text-rose-400 dark:text-rose-300">{time.minutes}</span>
        <span className="text-[9px] sm:text-[10px] md:text-xs font-sans text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wider mt-1">{t('dashboard.minutes')}</span>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-xl sm:text-2xl md:text-4xl font-serif text-rose-400 dark:text-rose-300">{time.seconds}</span>
        <span className="text-[9px] sm:text-[10px] md:text-xs font-sans text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wider mt-1">{t('dashboard.seconds')}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { profile, coupleId, user } = useAuth();
  const { t, language } = useLanguage();
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMood, setCurrentMood] = useState(null);
  const [latestWish, setLatestWish] = useState(null);
  const [streakData, setStreakData] = useState({ total_streak: 0 });
  const [dailyActivity, setDailyActivity] = useState(null);

  // Strategy 10: Parallel data fetch with Promise.all
  // Strategy 3: Removed `t` from deps — it's UI-only, not data logic
  useEffect(() => {
    if (!coupleId || !user) return;
    
    const today = new Date().toISOString().split('T')[0];

    Promise.all([
      getMoments(coupleId),
      getMoodToday(coupleId, user.uid),
      getWishes(coupleId),
      getStreak(coupleId),
      getDailyActivity(coupleId, today),
    ])
      .then(([momentsData, moodData, wishesData, streakResult, activityResult]) => {
        setMoments(momentsData.slice(0, 3));
        setCurrentMood(moodData);
        if (wishesData && wishesData.length > 0) setLatestWish(wishesData[0]);
        setStreakData(streakResult);
        setDailyActivity(activityResult);
      })
      .catch((err) => console.error('Dashboard data fetch error:', err))
      .finally(() => setLoading(false));
  }, [coupleId, user]);

  // Separate effect for notifications (depends on `t` for display text)
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

  // Automatic Nudge Check (Auto-Colek)
  useEffect(() => {
    if (!coupleId || !user || !streakData.last_activity_at) return;
    
    const lastActivity = new Date(streakData.last_activity_at).getTime();
    const lastNudge = streakData.last_nudge_at ? streakData.last_nudge_at.toMillis?.() || new Date(streakData.last_nudge_at).getTime() : 0;
    const now = new Date().getTime();
    
    const hoursSinceActivity = (now - lastActivity) / (1000 * 60 * 60);
    const hoursSinceNudge = (now - lastNudge) / (1000 * 60 * 60);

    if (hoursSinceActivity >= 18 && hoursSinceNudge >= 18) {
      console.log('Sending automatic streak reminder...');
      sendNudge(coupleId, user.uid);
    }
  }, [coupleId, user, streakData.last_activity_at, streakData.last_nudge_at]);

  const handleSetMood = useCallback(async (moodLabel) => {
    if (currentMood) return; // Mood already set for today
    setCurrentMood(moodLabel);
    try {
      await setMoodToday(coupleId, user.uid, moodLabel);
    } catch (err) {
      console.error('Gagal menyimpan mood', err);
    }
  }, [currentMood, coupleId, user?.uid]);

  const latestMoment = moments[0];

  // Strategy 7: Precompute data with useMemo
  const relationshipDuration = useMemo(() => {
    const start = new Date('2026-02-21');
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0 && months === 0) return t('dashboard.duration_just_started');
    
    let text = t('dashboard.relationship_duration') + ' ';
    if (years > 0) text += `${years} ${t('dashboard.years')} `;
    if (months > 0) text += `${months} ${t('dashboard.months')}`;
    return text + ' 💗';
  }, [language, t]);

  const formattedStartDate = useMemo(() => {
    return new Date('2026-02-21').toLocaleDateString(
      language === 'id' ? 'id-ID' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  }, [language]);

  return (
    <MainLayout activePage="/">
      <div className="max-w-[1140px] mx-auto flex flex-col gap-12 md:gap-20">
        {/* Hero Greeting */}
        <div className="flex flex-col items-center text-center mt-8 px-4">
          <div className="w-full max-w-lg flex justify-between items-center mb-6">
            <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-primary/60">
              {formattedStartDate}
            </span>
            <div className="flex items-center gap-2">
              <StreakIndicator streak={streakData.total_streak} activity={dailyActivity} />
            </div>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-on-surface dark:text-[#ede0df] mb-2 md:mb-4">
            {t('dashboard.hai')}, {profile?.display_name || t('dashboard.sayangku')} 👋
          </h1>
          <p className="font-sans text-sm md:text-base font-semibold text-rose-500 dark:text-rose-400 mb-6">
            {relationshipDuration}
          </p>
          <div className="w-full max-w-lg mx-auto bg-primary-container/20 dark:bg-rose-900/10 rounded-3xl p-4 border border-primary/10">
            <p className="text-xs font-semibold text-primary dark:text-rose-300 mb-2 tracking-widest uppercase">{t('dashboard.anniversary_countdown')}</p>
            <RelationshipTimer />
          </div>
        </div>

        {/* Bento Grid Layout */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Today's Memory */}
          <div className="md:col-span-8 glass-panel rounded-2xl md:rounded-[2rem] p-4 md:p-8 flex flex-col relative overflow-hidden group min-h-[280px] md:min-h-[400px]">
            {latestMoment?.image_url ? (
              <div className="absolute inset-0 z-0">
                <img
                  alt={t('dashboard.last_memory')}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                  src={latestMoment.image_url}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/90 via-surface-container-low/40 to-transparent" />
              </div>
            ) : (
              <div className="absolute inset-0 z-0 soft-gradient opacity-30" />
            )}
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 dark:bg-white/10 text-primary dark:text-rose-300 font-sans text-xs font-semibold tracking-wide backdrop-blur-md">
                  <span className="material-symbols-outlined mr-2 text-[16px]">photo_library</span>
                  {latestMoment ? t('dashboard.last_memory') : t('dashboard.no_memory')}
                </span>
              </div>
              <div className="mt-auto">
                <h2 className="font-serif text-xl md:text-3xl text-on-surface dark:text-[#ede0df] mb-2">
                  {latestMoment?.title || t('dashboard.add_first')}
                </h2>
                {latestMoment?.story && (
                  <p className="font-sans text-base text-on-surface-variant dark:text-zinc-400 font-serif italic line-clamp-2">
                    &quot;{latestMoment.story.slice(0, 100)}...&quot;
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Side Column */}
          <div className="md:col-span-4 flex flex-col gap-8">
            {/* Mood Tracker */}
            <GlassCard className="flex flex-col items-center justify-center text-center p-4 md:p-8">
              <h3 className="font-serif text-xl md:text-2xl text-on-surface dark:text-[#ede0df] mb-4 md:mb-6">{t('dashboard.mood_title')}</h3>
              <div className="flex gap-4 justify-center">
                {MOOD_OPTIONS.map((mood) => {
                  const moodLabel = language === 'id' ? mood.label_id : mood.label_en;
                  const isActive = currentMood === moodLabel;
                  return (
                  <button
                    key={mood.emoji}
                    onClick={() => handleSetMood(moodLabel)}
                    disabled={!!currentMood}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-transform shadow-sm ${isActive
                        ? 'bg-primary-container/50 border border-primary/20 ring-2 ring-primary/30'
                        : currentMood 
                          ? 'opacity-40 grayscale cursor-not-allowed'
                          : 'bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-white/40 dark:border-white/10 hover:scale-110'
                      }`}
                  >
                    {mood.emoji}
                  </button>
                )})}
              </div>
              <p className="font-sans text-xs font-semibold text-outline dark:text-zinc-500 mt-6 h-4">
                {currentMood ? `${t('dashboard.mood_locked')}: ${currentMood.toLowerCase()} ${MOOD_OPTIONS.find(m => (language === 'id' ? m.label_id : m.label_en) === currentMood)?.emoji}` : t('dashboard.mood_hint')}
              </p>
            </GlassCard>

            {/* Action Boxes */}
            <div className="grid grid-cols-2 gap-4">
              <Link to="/momen/baru" className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-white/60 dark:hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                </div>
                <span className="font-serif text-sm font-semibold text-on-surface dark:text-[#ede0df]" dangerouslySetInnerHTML={{ __html: t('dashboard.new_moment').replace(' ', '<br/>') }} />
              </Link>
              <Link to="/harapan" className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-white/60 dark:hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">favorite</span>
                </div>
                <span className="font-serif text-sm font-semibold text-on-surface dark:text-[#ede0df]" dangerouslySetInnerHTML={{ __html: t('dashboard.write_wish').replace(' ', '<br/>') }} />
              </Link>
            </div>

            {/* Latest Note */}
            {latestWish && (
              <GlassCard className="p-4 md:p-6 flex flex-col gap-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-secondary-container/30 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary dark:text-purple-300 text-sm">edit_note</span>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-outline dark:text-zinc-500">{t('dashboard.latest_note')}</span>
                </div>
                <p className="font-serif text-sm md:text-base italic text-on-surface dark:text-[#ede0df] line-clamp-3">
                  &quot;{latestWish.text}&quot;
                </p>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <div className="w-5 h-5 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold text-primary">
                    {latestWish.profiles?.display_name?.[0] || '?'}
                  </div>
                  <span className="text-[10px] text-on-surface-variant dark:text-zinc-400">
                    {new Date(latestWish.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </GlassCard>
            )}
          </div>
        </section>

        {/* Recent Moments */}
        <GlassCard className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
          <div className="flex justify-between items-center border-b border-outline-variant/30 dark:border-white/10 pb-4">
            <h2 className="font-serif text-xl md:text-2xl text-on-surface dark:text-[#ede0df]">{t('dashboard.see_all')}</h2>
            <Link
              to="/momen"
              className="font-sans text-[11px] md:text-xs font-semibold text-primary dark:text-rose-300 hover:text-on-surface transition-colors flex items-center gap-1 bg-primary-container/30 dark:bg-primary-container/10 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
            >
              {t('dashboard.see_all')} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          {loading ? (
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 hide-scrollbar">
              <MomentCardSkeleton />
              <MomentCardSkeleton />
              <MomentCardSkeleton />
            </div>
          ) : moments.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-outline-variant dark:text-zinc-700 mb-3 block">photo_camera</span>
              <p className="text-sm text-on-surface-variant dark:text-zinc-500 font-serif italic">{t('dashboard.no_moments')}</p>
            </div>
          ) : (
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
          )}
        </GlassCard>
      </div>
    </MainLayout>
  );
}
