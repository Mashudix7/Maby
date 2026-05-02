import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/ui/GlassCard';
import MomentCard from '../components/ui/MomentCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMoments } from '../services/momentService';
import { getMoodToday, setMoodToday } from '../services/moodService';

const MOOD_OPTIONS = [
  { emoji: '🥰', label: 'Bahagia' },
  { emoji: '😌', label: 'Damai' },
  { emoji: '🥺', label: 'Rindu' },
];

function RelationshipTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const startDate = new Date('2026-02-21T00:00:00+07:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = now - startDate;
      
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
        <span className="text-[9px] sm:text-[10px] md:text-xs font-sans text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wider mt-1">Hari</span>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-xl sm:text-2xl md:text-4xl font-serif text-rose-400 dark:text-rose-300">{time.hours}</span>
        <span className="text-[9px] sm:text-[10px] md:text-xs font-sans text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wider mt-1">Jam</span>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-xl sm:text-2xl md:text-4xl font-serif text-rose-400 dark:text-rose-300">{time.minutes}</span>
        <span className="text-[9px] sm:text-[10px] md:text-xs font-sans text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wider mt-1">Menit</span>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-xl sm:text-2xl md:text-4xl font-serif text-rose-400 dark:text-rose-300">{time.seconds}</span>
        <span className="text-[9px] sm:text-[10px] md:text-xs font-sans text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wider mt-1">Detik</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { profile, coupleId, user } = useAuth();
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMood, setCurrentMood] = useState(null);

  useEffect(() => {
    if (!coupleId || !user) return;
    
    getMoments(coupleId)
      .then((data) => setMoments(data.slice(0, 3)))
      .catch((err) => console.error('Gagal memuat momen:', err))
      .finally(() => setLoading(false));
      
    getMoodToday(coupleId, user.uid).then(setCurrentMood);
  }, [coupleId, user]);

  const handleSetMood = async (moodLabel) => {
    setCurrentMood(moodLabel);
    try {
      await setMoodToday(coupleId, user.uid, moodLabel);
    } catch (err) {
      console.error('Gagal menyimpan mood', err);
    }
  };

  const latestMoment = moments[0];

  return (
    <MainLayout activePage="/">
      <div className="max-w-[1140px] mx-auto flex flex-col gap-12 md:gap-20">
        {/* Hero Greeting */}
        <section className="flex flex-col items-center text-center mt-8">
          <span className="font-sans text-xs font-semibold tracking-widest uppercase text-primary mb-4">
            21 Februari 2026
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-on-surface dark:text-[#ede0df] mb-4 md:mb-6">
            Hai, {profile?.display_name || 'sayangku'} <span className="text-rose-400">💗</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-on-surface-variant dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Yuk bikin hari ini juga spesial ya.
          </p>
          <div className="w-full max-w-lg mx-auto">
            <RelationshipTimer />
          </div>
        </section>

        {/* Bento Grid Layout */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Today's Memory */}
          <div className="md:col-span-8 glass-panel rounded-2xl md:rounded-[2rem] p-4 md:p-8 flex flex-col relative overflow-hidden group min-h-[280px] md:min-h-[400px]">
            {latestMoment?.image_url ? (
              <div className="absolute inset-0 z-0">
                <img
                  alt="Kenangan Terakhir"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                  src={latestMoment.image_url}
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
                  {latestMoment ? 'Kenangan Terakhir' : 'Belum Ada Kenangan'}
                </span>
              </div>
              <div className="mt-auto">
                <h2 className="font-serif text-xl md:text-3xl text-on-surface dark:text-[#ede0df] mb-2">
                  {latestMoment?.title || 'Tambah momen pertamamu!'}
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
              <h3 className="font-serif text-xl md:text-2xl text-on-surface dark:text-[#ede0df] mb-4 md:mb-6">Mood Kamu Hari Ini</h3>
              <div className="flex gap-4 justify-center">
                {MOOD_OPTIONS.map((mood) => {
                  const isActive = currentMood === mood.label;
                  return (
                  <button
                    key={mood.emoji}
                    onClick={() => handleSetMood(mood.label)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-transform hover:scale-110 shadow-sm ${isActive
                        ? 'bg-primary-container/50 border border-primary/20 ring-2 ring-primary/30'
                        : 'bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-white/40 dark:border-white/10'
                      }`}
                  >
                    {mood.emoji}
                  </button>
                )})}
              </div>
              <p className="font-sans text-xs font-semibold text-outline dark:text-zinc-500 mt-6 h-4">
                {currentMood ? `Kamu lagi merasa ${currentMood.toLowerCase()} ${MOOD_OPTIONS.find(m => m.label === currentMood)?.emoji}` : 'Gimana perasaanmu hari ini?'}
              </p>
            </GlassCard>

            {/* Action Boxes */}
            <div className="grid grid-cols-2 gap-4">
              <Link to="/momen/baru" className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-white/60 dark:hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                </div>
                <span className="font-serif text-sm font-semibold text-on-surface dark:text-[#ede0df]">Momen<br/>Baru</span>
              </Link>
              <Link to="/harapan" className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-white/60 dark:hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">favorite</span>
                </div>
                <span className="font-serif text-sm font-semibold text-on-surface dark:text-[#ede0df]">Tulis<br/>Harapan</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Moments */}
        <GlassCard className="flex flex-col gap-6 md:gap-8 p-4 md:p-8">
          <div className="flex justify-between items-center border-b border-outline-variant/30 dark:border-white/10 pb-4">
            <h2 className="font-serif text-xl md:text-2xl text-on-surface dark:text-[#ede0df]">Momen Terakhir</h2>
            <Link
              to="/momen"
              className="font-sans text-xs font-semibold text-primary dark:text-rose-300 hover:text-on-surface transition-colors flex items-center gap-1 bg-primary-container/30 dark:bg-primary-container/10 px-3 py-1.5 rounded-full"
            >
              Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          {loading ? (
            <p className="text-center text-on-surface-variant dark:text-zinc-500 py-8 font-serif italic">Memuat momen...</p>
          ) : moments.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-outline-variant dark:text-zinc-700 mb-3 block">photo_camera</span>
              <p className="text-sm text-on-surface-variant dark:text-zinc-500 font-serif italic">Belum ada momen. Yuk buat yang pertama!</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 hide-scrollbar">
              {moments.map((moment) => (
                <MomentCard
                  key={moment.id}
                  id={moment.id}
                  image={moment.image_url}
                  date={moment.date ? new Date(moment.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}
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
