import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import { useAuth } from '../context/AuthContext';
import { getMoments } from '../services/momentService';

export default function StolenMoments() {
  const { coupleId } = useAuth();
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coupleId) return;
    getMoments(coupleId)
      .then(setMoments)
      .catch((err) => console.error('Gagal memuat momen:', err))
      .finally(() => setLoading(false));
  }, [coupleId]);

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {moments.map((moment) => (
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
                  <h3 className="font-serif text-xl text-primary dark:text-rose-300 italic">{moment.title}</h3>
                  {moment.story && (
                    <p className="text-sm text-on-surface-variant dark:text-zinc-400 mt-2 line-clamp-2">{moment.story}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <FloatingActionButton to="/momen/baru" label="Tambah Momen" />
    </MainLayout>
  );
}
