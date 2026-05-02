import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import GlassCard from '../components/ui/GlassCard';
import MomentCard from '../components/ui/MomentCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMoments } from '../services/momentService';

const moods = [
  { emoji: '🥰', label: 'Bahagia' },
  { emoji: '😌', label: 'Damai', isActive: true },
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
  const { profile, coupleId } = useAuth();
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coupleId) return;
    getMoments(coupleId)
      .then((data) => setMoments(data.slice(0, 3)))
      .catch((err) => console.error('Gagal memuat momen:', err))
      .finally(() => setLoading(false));
  }, [coupleId]);

  const latestMoment = moments[0];

  return (
    <MainLayout activePage="/">
      <div className="max-w-[1140px] mx-auto flex flex-col gap-12 md:gap-20">
        {/* Hero Greeting */}
        <section className="flex flex-col items-center text-center mt-8">
          <span className="font-sans text-xs font-semibold tracking-widest uppercase text-primary mb-4">
            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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
          <div className="md:col-span-8 glass-panel rounded-2xl md:rounded-[2rem] p-5 md:p-8 flex flex-col relative overflow-hidden group min-h-[280px] md:min-h-[400px]">
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
                  <span className="material-symbols-outlined mr-2 text-[16px]">auto_awesome</span>
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
            <GlassCard className="flex flex-col items-center justify-center text-center">
              <h3 className="font-serif text-2xl text-on-surface dark:text-[#ede0df] mb-6">Mood Kamu Hari Ini</h3>
              <div className="flex gap-4 justify-center">
                {moods.map((mood) => (
                  <button
                    key={mood.emoji}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-transform hover:scale-110 shadow-sm ${mood.isActive
                        ? 'bg-primary-container/50 border border-primary/20 ring-2 ring-primary/30'
                        : 'bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-white/40 dark:border-white/10'
                      }`}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
              <p className="font-sans text-xs font-semibold text-outline dark:text-zinc-500 mt-6">
                Kamu lagi merasa damai 🌿
              </p>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="flex flex-col gap-4">
              <h3 className="font-serif text-2xl text-on-surface dark:text-[#ede0df] mb-2">Aksi Cepat</h3>
              {[
                { icon: 'add_a_photo', label: 'Tambah momen', bg: 'bg-primary-container', color: 'text-primary', to: '/momen/baru' },
                { icon: 'edit_note', label: 'Tulis harapan', bg: 'bg-secondary-container', color: 'text-on-secondary-container', to: '/harapan' },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors text-left border border-transparent hover:border-white/40 dark:hover:border-white/10 group"
                >
                  <div className={`w-10 h-10 rounded-full ${action.bg} flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined">{action.icon}</span>
                  </div>
                  <span className="font-sans text-base text-on-surface dark:text-[#ede0df]">{action.label}</span>
                </Link>
              ))}
            </GlassCard>
          </div>
        </section>

        {/* Recent Moments */}
        <section className="flex flex-col gap-8">
          <div className="flex justify-between items-end">
            <h2 className="font-serif text-3xl text-on-surface dark:text-[#ede0df]">Momen Terakhir</h2>
            <Link
              to="/momen"
              className="font-sans text-xs font-semibold text-primary dark:text-rose-300 hover:text-on-surface transition-colors flex items-center gap-1"
            >
              Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          {loading ? (
            <p className="text-center text-on-surface-variant dark:text-zinc-500 py-12 font-serif italic">Memuat momen...</p>
          ) : moments.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-5xl text-outline-variant dark:text-zinc-700 mb-4 block">photo_camera</span>
              <p className="text-on-surface-variant dark:text-zinc-500 font-serif italic">Belum ada momen. Yuk buat yang pertama!</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar -mx-4 px-4">
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
        </section>
      </div>
    </MainLayout>
  );
}
