import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { getMoments } from '../services/momentService';

export default function StolenMoments() {
  const { coupleId } = useAuth();
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!coupleId) return;
    getMoments(coupleId)
      .then(setMoments)
      .catch((err) => console.error('Gagal memuat momen:', err))
      .finally(() => setLoading(false));
  }, [coupleId]);

  const filteredMoments = moments.filter(m => {
    if (activeTab === 'favorite' && !m.is_favorite) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = m.title?.toLowerCase().includes(q);
      const storyMatch = m.story?.toLowerCase().includes(q);
      const locationMatch = m.location?.toLowerCase().includes(q);
      if (!titleMatch && !storyMatch && !locationMatch) return false;
    }
    return true;
  });

  return (
    <MainLayout activePage="/momen">
      <div className="max-w-[1140px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
          <span className="font-sans text-xs font-semibold text-on-surface-variant dark:text-zinc-500 uppercase tracking-widest mb-4 inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary dark:text-rose-300">favorite</span>
            Diari Kita
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-primary dark:text-rose-300 italic mb-4 md:mb-6">Momen Indah Bersamamu</h1>
          <p className="text-lg text-on-surface-variant dark:text-zinc-400 max-w-2xl mx-auto opacity-80">
            Kumpulan hal-hal kecil yang berarti segalanya.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant dark:text-zinc-500">search</span>
            <input
              type="text"
              placeholder="Cari kata di judul, cerita, atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-[#1e1a1b]/50 border border-outline-variant/30 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-on-surface dark:text-[#ede0df]"
            />
          </div>
          <div className="flex bg-white/50 dark:bg-[#1e1a1b]/50 rounded-2xl p-1 border border-outline-variant/30 dark:border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-rose-300'}`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab('favorite')}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1 ${activeTab === 'favorite' ? 'bg-rose-500 text-white shadow-sm' : 'text-on-surface-variant dark:text-zinc-400 hover:text-rose-500'}`}
            >
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              Favorit
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-on-surface-variant dark:text-zinc-500 py-20 font-serif italic">Memuat momen...</p>
        ) : moments.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline-variant dark:text-zinc-700 mb-4 block">photo_camera</span>
            <p className="text-on-surface-variant dark:text-zinc-500 font-serif italic text-lg mb-6">Belum ada momen yang tersimpan</p>
            <Link
              to="/momen/baru"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-4 rounded-full font-semibold text-sm shadow-md hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">add</span>
              Tambah Momen Pertama
            </Link>
          </div>
        ) : filteredMoments.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-outline-variant dark:text-zinc-700 mb-4 block">search_off</span>
            <p className="text-on-surface-variant dark:text-zinc-500 font-serif italic text-lg mb-6">
              Tidak ada momen yang cocok dengan pencarianmu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredMoments.map((moment) => (
              <Link
                key={moment.id}
                to={`/momen/${moment.id}`}
                className="glass-panel rounded-2xl p-5 md:p-6 flex flex-col gap-4 group hover:scale-[1.01] transition-transform duration-300"
              >
                {moment.image_url && (
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                    <img
                      alt={moment.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={moment.image_url}
                    />
                    {moment.location && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 glass-panel px-3 py-1 rounded-full text-xs font-semibold text-on-surface-variant dark:text-zinc-300">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {moment.location}
                      </span>
                    )}
                  </div>
                )}
                <div className="px-1">
                  {moment.date && (
                    <time className="font-sans text-xs font-semibold text-outline dark:text-zinc-500 mb-1 block">
                      {new Date(moment.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-xl text-primary dark:text-rose-300 italic">{moment.title}</h3>
                    {moment.is_favorite && (
                      <span className="material-symbols-outlined text-rose-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    )}
                  </div>
                  {moment.story && (
                    <p className="text-sm text-on-surface-variant dark:text-zinc-400 mt-2 line-clamp-2">{moment.story}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        {!loading && (
          <Link
            to="/momen/baru"
            className="fixed bottom-28 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-gradient-to-br from-primary to-secondary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 z-50 group"
          >
            <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add</span>
          </Link>
        )}
      </div>
    </MainLayout>
  );
}
