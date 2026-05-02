import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { getMomentById, deleteMoment } from '../services/momentService';

export default function MomentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moment, setMoment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getMomentById(id)
      .then(setMoment)
      .catch((err) => {
        console.error('Gagal memuat detail:', err);
        setError('Momen tidak ditemukan');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Yakin ingin menghapus momen ini?')) return;
    try {
      await deleteMoment(id);
      navigate('/momen');
    } catch (err) {
      console.error('Gagal menghapus:', err);
    }
  }

  if (loading) {
    return (
      <MainLayout activePage="/momen">
        <div className="flex items-center justify-center py-20">
          <p className="font-serif italic text-on-surface-variant dark:text-zinc-500">Memuat...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !moment) {
    return (
      <MainLayout activePage="/momen">
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-5xl text-outline-variant dark:text-zinc-700 mb-4">error</span>
          <p className="font-serif italic text-on-surface-variant dark:text-zinc-500">{error || 'Momen tidak ditemukan'}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activePage="/momen">
      <div className="max-w-[900px] mx-auto">
        {/* Hero Image */}
        {moment.image_url && (
          <section className="relative w-full h-[280px] md:h-[500px] rounded-2xl md:rounded-[2rem] overflow-hidden mb-8 md:mb-10 shadow-[0_20px_40px_rgba(74,69,69,0.05)]">
            <img alt={moment.title} className="w-full h-full object-cover" src={moment.image_url} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 text-white">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {moment.location && (
                  <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-semibold text-white border-white/20 bg-white/20">
                    {moment.location}
                  </span>
                )}
                {moment.date && (
                  <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-semibold text-white border-white/20 bg-white/20">
                    {new Date(moment.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl md:text-5xl text-white">{moment.title}</h1>
            </div>
          </section>
        )}

        {/* If no image, show title differently */}
        {!moment.image_url && (
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-5xl text-primary dark:text-rose-300 italic mb-4">{moment.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              {moment.location && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant dark:text-zinc-400">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {moment.location}
                </span>
              )}
              {moment.date && (
                <span className="text-xs font-semibold text-outline dark:text-zinc-500">
                  {new Date(moment.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Story */}
        {moment.story && (
          <article className="glass-panel rounded-2xl md:rounded-3xl p-6 md:p-10 mb-8">
            <div className="space-y-6">
              <p className="text-lg text-on-surface-variant dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {moment.story}
              </p>
            </div>
          </article>
        )}

        {/* Song */}
        {moment.song_url && (
          <div className="glass-panel rounded-2xl p-6 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full soft-gradient flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined">music_note</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-variant dark:text-zinc-400 mb-1">Soundtrack</p>
              <a
                href={moment.song_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary dark:text-rose-300 hover:underline text-sm"
              >
                {moment.song_url}
              </a>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/momen')}
            className="ghost-btn"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Kembali
          </button>
          <button
            onClick={handleDelete}
            className="ghost-btn text-error hover:bg-error-container/30"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Hapus
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
