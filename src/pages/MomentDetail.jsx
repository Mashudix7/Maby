import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useLanguage } from '../context/LanguageContext';
import { getMomentById, deleteMoment, toggleFavoriteMoment } from '../services/momentService';
import { showConfirmDelete, showSuccess, showError } from '../lib/alerts';

export default function MomentDetail() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [moment, setMoment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!id) return;
    getMomentById(id)
      .then(data => {
        setMoment(data);
        setIsFavorite(data.is_favorite || false);
      })
      .catch((err) => {
        console.error('Gagal memuat detail:', err);
        setError(t('moments.error_not_found'));
      })
      .finally(() => setLoading(false));
  }, [id, t]);

  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed]);

  async function handleDelete() {
    const result = await showConfirmDelete(t);
    if (!result.isConfirmed) return;
    
    try {
      await deleteMoment(id);
      await showSuccess(t, 'delete');
      navigate('/momen');
    } catch (err) {
      console.error('Gagal menghapus:', err);
      showError(t, t('moments.error_save'));
    }
  }

  async function handleToggleFavorite() {
    try {
      const newStatus = !isFavorite;
      setIsFavorite(newStatus);
      await toggleFavoriteMoment(id, newStatus);
    } catch (err) {
      console.error('Gagal toggle favorit:', err);
      setIsFavorite(!isFavorite); // revert
    }
  }

  if (loading) {
    return (
      <MainLayout activePage="/momen">
        <div className="flex items-center justify-center py-20">
          <p className="font-serif italic text-on-surface-variant dark:text-zinc-500">{t('common.loading')}</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !moment) {
    return (
      <MainLayout activePage="/momen">
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-5xl text-outline-variant dark:text-zinc-700 mb-4">error</span>
          <p className="font-serif italic text-on-surface-variant dark:text-zinc-500">{error || t('moments.error_not_found')}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activePage="/momen">
      <div className="max-w-[900px] mx-auto">
        {/* Hero Image */}
        {moment.image_url && (
          <section 
            onClick={() => setIsZoomed(true)}
            className="relative w-full h-[280px] md:h-[500px] rounded-2xl md:rounded-[2rem] overflow-hidden mb-8 md:mb-10 shadow-[0_20px_40px_rgba(74,69,69,0.05)] cursor-zoom-in group"
          >
            <img 
              alt={moment.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              src={moment.image_url} 
            />
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
                    {new Date(moment.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl md:text-5xl text-white">{moment.title}</h1>
            </div>
            
            {/* Zoom Icon Hint */}
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[20px]">fullscreen</span>
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
                  {new Date(moment.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
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



        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-6 pb-12 px-4">
          <button
            onClick={() => navigate('/momen')}
            className="ghost-btn"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            {t('common.back')}
          </button>
          <button
            onClick={handleToggleFavorite}
            className={`ghost-btn ${isFavorite ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20' : 'text-on-surface-variant dark:text-zinc-400 hover:bg-surface-variant'}`}
          >
            <span className="material-symbols-outlined text-[16px]" style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              favorite
            </span>
            {isFavorite ? t('moments.is_favorite') : t('moments.make_favorite')}
          </button>
          <button
            onClick={handleDelete}
            className="ghost-btn text-error hover:bg-error-container/30"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            {t('common.delete')}
          </button>
        </div>
      </div>

      {/* Zoom Modal Overlay */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 transition-all duration-300 animate-in fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          
          <img 
            src={moment.image_url} 
            alt={moment.title} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-sm font-sans flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
            <span className="material-symbols-outlined text-[16px]">touch_app</span>
            {t('moments.zoom_close_hint')}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
