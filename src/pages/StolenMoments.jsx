import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { listenMoments } from '../services/momentService';
import { MomentGridSkeleton } from '../components/ui/Skeleton';
import VirtualGrid from '../components/ui/VirtualGrid';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function StolenMoments() {
  const { coupleId } = useAuth();
  const { t, language } = useLanguage();
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (!coupleId) return;
    
    // Real-time listener
    const unsubscribe = listenMoments(coupleId, (data) => {
      setMoments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [coupleId]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredMoments = useMemo(() => {
    return moments.filter(m => {
      if (activeTab === 'favorite' && !m.is_favorite) return false;
      
      if (dateQuery && m.date) {
        if (m.date !== dateQuery) return false;
      }

      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const titleMatch = m.title?.toLowerCase().includes(q);
        const storyMatch = m.story?.toLowerCase().includes(q);
        const locationMatch = m.location?.toLowerCase().includes(q);
        if (!titleMatch && !storyMatch && !locationMatch) return false;
      }
      return true;
    });
  }, [moments, activeTab, debouncedSearch, dateQuery]);

  const renderMoment = useCallback((moment) => (
    <ScrollReveal direction="up" distance="15px" threshold={0.05}>
      <Link
        key={moment.id}
        to={`/momen/${moment.id}`}
        className="glass-panel rounded-2xl p-5 md:p-6 flex flex-col gap-4 group hover:scale-[1.02] transition-all duration-300 h-full border border-primary/5 hover:border-primary/20"
      >
        {moment.image_url && (
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shrink-0">
            <img
              alt={moment.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              src={moment.image_url}
              loading="lazy"
              decoding="async"
            />
            {moment.location && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 glass-panel px-3 py-1 rounded-full text-xs font-semibold text-on-surface-variant dark:text-zinc-300">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {moment.location}
              </span>
            )}
          </div>
        )}
        <div className="px-1 flex flex-col flex-1">
          {moment.date && (
            <time className="font-sans text-xs font-semibold text-outline dark:text-zinc-500 mb-1 block">
              {new Date(moment.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          )}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-xl text-primary dark:text-rose-300 italic group-hover:translate-x-1 transition-transform">{moment.title}</h3>
            {moment.is_favorite && (
              <span className="material-symbols-outlined text-rose-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            )}
          </div>
          {moment.story && (
            <p className="text-sm text-on-surface-variant dark:text-zinc-400 mt-2 line-clamp-2">{moment.story}</p>
          )}
        </div>
      </Link>
    </ScrollReveal>
  ), [language]);

  const fab = !loading && (
    <Link
      to="/momen/baru"
      className="fixed bottom-28 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(176,0,77,0.4)] hover:scale-110 active:scale-95 transition-all z-[60] group overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add</span>
    </Link>
  );

  return (
    <MainLayout activePage="/momen" fab={fab}>
      <div className="max-w-[1140px] mx-auto">
        {/* Header */}
        <ScrollReveal delay={100} distance="30px">
          <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
            <span className="font-sans text-xs font-semibold text-on-surface-variant dark:text-zinc-500 uppercase tracking-widest mb-4 inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary dark:text-rose-300">favorite</span>
              {t('moments.diary_title')}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-primary dark:text-rose-300 italic mb-4 md:mb-6">{t('moments.title')}</h1>
            <p className="text-lg text-on-surface-variant dark:text-zinc-400 max-w-2xl mx-auto opacity-80">
              {t('moments.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Search & Filter Section */}
        <ScrollReveal delay={200} distance="20px">
          <div className="glass-panel p-4 md:p-6 rounded-[2rem] mb-12 border border-primary/5 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Input */}
              <div className="flex-1 relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">search</span>
                <input
                  type="text"
                  placeholder={t('moments.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/40 dark:bg-[#1e1a1b]/40 border border-outline-variant/20 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-on-surface dark:text-[#ede0df] font-serif italic text-lg"
                />
              </div>

              {/* Date Input */}
              <div className="w-full lg:w-64 relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">calendar_month</span>
                <input
                  type="date"
                  value={dateQuery}
                  onChange={(e) => setDateQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/40 dark:bg-[#1e1a1b]/40 border border-outline-variant/20 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-on-surface dark:text-[#ede0df] font-sans font-semibold uppercase tracking-widest text-xs h-full"
                />
                {dateQuery && (
                  <button 
                    onClick={() => setDateQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant/20 dark:border-white/5">
              <div className="flex bg-white/40 dark:bg-[#1e1a1b]/40 rounded-2xl p-1.5 border border-outline-variant/20 dark:border-white/5 shrink-0">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'all' ? 'bg-primary text-white shadow-lg scale-105' : 'text-on-surface-variant dark:text-zinc-400 hover:text-primary'}`}
                >
                  {t('common.all')}
                </button>
                <button
                  onClick={() => setActiveTab('favorite')}
                  className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'favorite' ? 'bg-rose-500 text-white shadow-lg scale-105' : 'text-on-surface-variant dark:text-zinc-400 hover:text-rose-500'}`}
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  {t('common.favorite')}
                </button>
              </div>

              <div className="text-xs font-semibold text-outline dark:text-zinc-500 uppercase tracking-widest italic">
                {filteredMoments.length} {t('moments.found_count') || 'Moments Found'}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[...Array(6)].map((_, i) => <MomentGridSkeleton key={i} />)}
          </div>
        ) : moments.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline-variant dark:text-zinc-700 mb-4 block">photo_camera</span>
            <p className="text-on-surface-variant dark:text-zinc-500 font-serif italic text-lg mb-6">{t('moments.no_moments')}</p>
            <Link
              to="/momen/baru"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-semibold text-sm shadow-lg hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined">add</span>
              {t('moments.add_moment')}
            </Link>
          </div>
        ) : filteredMoments.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-outline-variant dark:text-zinc-700 mb-4 block">search_off</span>
            <p className="text-on-surface-variant dark:text-zinc-500 font-serif italic text-lg mb-6">
              {t('moments.no_results')}
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setDateQuery(''); setActiveTab('all'); }}
              className="text-primary font-bold hover:underline"
            >
              {t('common.reset_filters') || 'Reset All Filters'}
            </button>
          </div>
        ) : (
          <VirtualGrid
            items={filteredMoments}
            itemHeight={380}
            minColumnWidth={300}
            renderItem={renderMoment}
          />
        )}
      </div>
    </MainLayout>
  );
}
