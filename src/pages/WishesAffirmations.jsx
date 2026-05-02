import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import WishCard from '../components/ui/WishCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getWishes, createWish, getRandomWish } from '../services/wishService';
import { showSuccess, showError } from '../lib/alerts';

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

  async function handleAddWish(e) {
    e.preventDefault();
    if (!newWish.trim()) return;
    setSaving(true);
    try {
      const wish = await createWish(coupleId, user.uid, newWish.trim());
      setWishes((prev) => [wish, ...prev]);
      setNewWish('');
      await showSuccess(t, 'save');
    } catch (err) {
      console.error('Gagal menambah harapan:', err);
      showError(t);
    } finally {
      setSaving(false);
    }
  }

  async function handleSurprise() {
    try {
      const wish = await getRandomWish(coupleId);
      if (wish) {
        setRandomWish(wish);
        setShowRandom(true);
      }
    } catch (err) {
      console.error('Gagal mengambil harapan acak:', err);
    }
  }

  return (
    <MainLayout activePage="/harapan" className="relative">
      {/* Ambient orbs */}
      <div className="fixed w-64 h-64 bg-primary-container rounded-full blur-[80px] opacity-40 dark:opacity-20 top-20 left-10 -z-10 pointer-events-none" />
      <div className="fixed w-80 h-80 bg-secondary-container rounded-full blur-[80px] opacity-40 dark:opacity-20 bottom-40 right-20 -z-10 pointer-events-none" />

      <div className="max-w-[1140px] mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 max-w-2xl">
          <h1 className="font-serif text-3xl md:text-5xl text-primary dark:text-rose-300 mb-4 italic">{t('wishes.title')}</h1>
          <p className="text-lg text-on-surface-variant dark:text-zinc-400 max-w-md mx-auto">
            {t('wishes.subtitle')}
          </p>
        </div>



        {/* Random Wish Modal */}
        {showRandom && randomWish && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setShowRandom(false)}>
            <div className="glass-panel rounded-3xl p-8 md:p-12 max-w-lg w-full text-center" onClick={(e) => e.stopPropagation()}>
              <span className="material-symbols-outlined text-5xl text-rose-400 mb-6 block">favorite</span>
              <p className="font-serif text-2xl md:text-3xl text-on-surface dark:text-[#ede0df] italic leading-relaxed mb-6">
                &quot;{randomWish.text}&quot;
              </p>
              <p className="text-xs font-semibold text-on-surface-variant dark:text-zinc-400">
                — {randomWish.profiles?.display_name || t('wishes.anonymous')}
              </p>
              <button
                onClick={() => setShowRandom(false)}
                className="mt-8 ghost-btn mx-auto"
              >
                {t('wishes.close')}
              </button>
            </div>
          </div>
        )}

        {/* Add Wish Form */}
        <form onSubmit={handleAddWish} className="w-full max-w-xl mb-12">
          <div className="glass-panel rounded-2xl p-4 flex gap-3 items-end">
            <textarea
              value={newWish}
              onChange={(e) => setNewWish(e.target.value)}
              placeholder={t('wishes.placeholder')}
              rows="2"
              className="glass-input resize-none flex-1"
            />
            <button
              type="submit"
              disabled={saving || !newWish.trim()}
              className="w-12 h-12 rounded-full soft-gradient flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform shrink-0 disabled:opacity-50"
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
          <p className="text-center text-on-surface-variant dark:text-zinc-500 py-12 font-serif italic">{t('wishes.loading')}</p>
        ) : wishes.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-5xl text-outline-variant dark:text-zinc-700 mb-4 block">edit_note</span>
            <p className="text-on-surface-variant dark:text-zinc-500 font-serif italic">{t('wishes.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {wishes.map((wish) => (
              <WishCard key={wish.id} className="flex flex-col justify-between">
                <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-300 italic leading-relaxed mb-4">
                  &quot;{wish.text}&quot;
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-primary-container dark:bg-primary-container/30 flex items-center justify-center text-primary text-sm font-serif">
                    {(wish.profiles?.display_name || '?')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant dark:text-zinc-500">
                    {wish.profiles?.display_name || t('wishes.anonymous')}
                  </span>
                  <span className="text-xs text-outline dark:text-zinc-600 ml-auto">
                    {new Date(wish.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' })} • {new Date(wish.created_at).toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </WishCard>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
