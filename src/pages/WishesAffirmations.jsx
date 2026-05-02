import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import WishCard from '../components/ui/WishCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getWishes, createWish, getRandomWish } from '../services/wishService';
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
  const [randomWish, setRandomWish] = useState(null);
  const [showRandom, setShowRandom] = useState(false);

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

  const handleShowRandom = async () => {
    const wish = await getRandomWish(coupleId);
    setRandomWish(wish);
    setShowRandom(true);
  };

  const renderWish = useCallback((wish) => (
    <WishCard key={wish.id} className="flex flex-col justify-between h-full">
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
          {new Date(wish.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' })} • {new Date(wish.created_at).toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
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
          <p className="text-on-surface-variant dark:text-zinc-400 font-sans">{t('wishes.subtitle')}</p>
          <button
            onClick={handleShowRandom}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary-container text-on-secondary-container font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-lg">casino</span>
            {t('wishes.random')}
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl mb-12 border border-primary/10">
          <div className="flex gap-4">
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
              className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg disabled:opacity-50 transition-all hover:scale-105"
            >
              {saving ? (
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
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

      {/* Random Wish Modal */}
      {showRandom && randomWish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass-panel max-w-lg w-full p-8 rounded-[2.5rem] relative text-center animate-slideFadeIn">
            <button
              onClick={() => setShowRandom(false)}
              className="absolute top-6 right-6 text-outline hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <span className="material-symbols-outlined text-primary text-5xl mb-6">format_quote</span>
            <p className="font-serif text-2xl text-on-surface dark:text-[#ede0df] italic leading-relaxed mb-8">
              &quot;{randomWish.text}&quot;
            </p>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-serif font-bold">
                {(randomWish.profiles?.display_name || '?')[0].toUpperCase()}
              </div>
              <span className="text-xs font-bold text-primary tracking-widest uppercase">
                {randomWish.profiles?.display_name || t('wishes.anonymous')}
              </span>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
