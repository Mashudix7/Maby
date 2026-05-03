import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import WishCard from '../components/ui/WishCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getWishes, createWish } from '../services/wishService';
import { showSuccess, showError } from '../lib/alerts';
import { WishCardSkeleton } from '../components/ui/Skeleton';
import VirtualGrid from '../components/ui/VirtualGrid';

export default function WishesAffirmations() {
  const { user, coupleId } = useAuth();
  const { t, language } = useLanguage();
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWish, setNewWish] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!coupleId) return;
    getWishes(coupleId)
      .then(setWishes)
      .catch((err) => console.error('Gagal memuat harapan:', err))
      .finally(() => setLoading(false));
  }, [coupleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newWish.trim() || saving) return;

    setSaving(true);
    try {
      const wish = await createWish(coupleId, user.uid, newWish);
      setWishes(prev => [wish, ...prev]);
      setNewWish('');
      showSuccess(t('wishes.success'));
    } catch (err) {
      showError(t('wishes.error'));
    } finally {
      setSaving(false);
    }
  };

  const renderWish = useCallback((wish) => (
    <WishCard key={wish.id} className="flex flex-col justify-between h-full group hover:scale-[1.02] transition-all duration-300">
      <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-300 italic leading-relaxed mb-4">
        &quot;{wish.text}&quot;
      </p>
      <div className="flex items-center gap-2 mt-auto">
        <div className="w-8 h-8 rounded-full bg-primary-container dark:bg-primary-container/30 flex items-center justify-center text-primary text-sm font-serif shrink-0">
          {(wish.profiles?.display_name || '?')[0].toUpperCase()}
        </div>
        <span className="text-xs font-semibold text-on-surface-variant dark:text-zinc-500 truncate">
          {wish.profiles?.display_name || t('wishes.anonymous')}
        </span>
        <span className="text-xs text-outline dark:text-zinc-600 ml-auto shrink-0">
          {new Date(wish.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </WishCard>
  ), [language, t]);

  return (
    <MainLayout activePage="/harapan">
      <div className="max-w-[1140px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl md:text-5xl text-primary dark:text-rose-300 italic mb-4">{t('wishes.title')}</h1>
          <p className="text-on-surface-variant dark:text-zinc-400 font-sans max-w-lg mx-auto">{t('wishes.subtitle')}</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="glass-panel p-4 md:p-6 rounded-[2rem] mb-12 border border-primary/10 shadow-lg relative overflow-hidden group">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={newWish}
              onChange={(e) => setNewWish(e.target.value)}
              placeholder={t('wishes.placeholder')}
              className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface dark:text-[#ede0df] font-serif italic text-lg"
            />
            <button
              type="submit"
              disabled={saving || !newWish.trim()}
              className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_8px_20px_rgba(176,0,77,0.3)] disabled:opacity-50 transition-all hover:scale-110 active:scale-95 group/btn relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              {saving ? (
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-2xl transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              )}
            </button>
          </div>
        </form>

        {/* Wishes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[...Array(6)].map((_, i) => <WishCardSkeleton key={i} />)}
          </div>
        ) : wishes.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-5xl text-outline-variant dark:text-zinc-700 mb-4 block">edit_note</span>
            <p className="text-on-surface-variant dark:text-zinc-500 font-serif italic">{t('wishes.empty')}</p>
          </div>
        ) : (
          <VirtualGrid
            items={wishes}
            itemHeight={220}
            minColumnWidth={320}
            renderItem={renderWish}
          />
        )}
      </div>
    </MainLayout>
  );
}
