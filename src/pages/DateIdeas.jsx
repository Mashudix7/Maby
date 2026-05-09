import { useState, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import FilterTabs from '../components/ui/FilterTabs';
import DateIdeaCard from '../components/ui/DateIdeaCard';
import VirtualGrid from '../components/ui/VirtualGrid';
import { useLanguage } from '../context/LanguageContext';

const IMG_PICNIC = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIyv5V2wPKy7E3QyI9C_ls2odks-UpR8P0iPTD3J97qCqFSnyOAfAiJVvba3bdLctUzAsUa6xyMzfnpUi8nXw-_QM2bdMvtZpFWbe-gOPFAn7RV7gDii9A0oKAn0Hy-0JV1QClXPGJ3tei9CPX7B4hpFGXxK3MIPpXD12GQP5pzxH3-e6cQ4p-vIQud5L-PVpie9_A7_EgmieEkpkkfKe8aeqjbYDh-kwv7HPQ9udu1m5_p-uUoZ88dEFi6zZXRj4VVCOEHPxO1A';
const IMG_COOK = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHfkobswAjvDRA-3F12hIL2Ahvx4PHw5bHJaiox0SwBxpGrzniIEDjhEel9dC8l5CD9mgy_f67jwgn0gFO6jWICcP9NxurXtwk6FTWbd3v407hp-u6jqnQrlcTa9-JL4ogF8oz2g7wDY0WHIrGzswsVEUu8Ydh4a6A5dwQu1PImZzWGeh6FIsEHrWI_Y8OXxsh5ectTBxn-VCEfMcTtS86KA7XDShPinKsLRslaSca6CHDYdmWunkOvCGqiSn8dmjldKmfHQ_Mzg';
const IMG_STARS = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAS0ZQqCaWcXxh-Vl7VAmOazHBlty-26BIvGdXv6i1qAQwuRg5IPctn0skZi_oA-IZG0wIJAHCPZl5zXgZPSH2dJmpsLon5RuAz2FEAXBv8Vtc0vFd9MrRWxhFE-F4QNZt4Oxj-HhCAS4bW8HQaR8rE5xMv1RSYmTFSd7HDtL9fy4Z8B-48jYhBZnhBGMscoabq7koKVsNTiSCaFvs9LpPdrn_z1la6gig7I5T5cimVAzP2xx5btHJMrZrLD2cNrAJ-_yCNeTptnQ';

const ideas = [
  {
    image: IMG_PICNIC, 
    title_id: 'Piknik Sore',
    title_en: 'Afternoon Picnic',
    description_id: 'Bawa keju lembut, buah segar, dan selimut. Cari tempat sunyi dengan pemandangan matahari terbenam.',
    description_en: 'Bring soft cheese, fresh fruit, and a blanket. Find a quiet spot with a sunset view.',
    tags: [{ label_id: 'Outdoor', label_en: 'Outdoor', className: 'bg-secondary-container/50 text-on-secondary-container' }, { label_id: 'Gratis', label_en: 'Free', className: 'bg-tertiary-container/50 text-on-tertiary-container' }],
    isFavorited: true,
    category: 'outdoor'
  },
  {
    image: IMG_COOK, 
    title_id: 'Malam Pasta Homemade',
    title_en: 'Homemade Pasta Night',
    description_id: 'Skip restoran dan bikin berantakan di dapur. Bikin pasta dari nol ternyata gampang dan seru banget kalau berdua.',
    description_en: 'Skip the restaurant and make a mess in the kitchen. Making pasta from scratch is easy and fun together.',
    tags: [{ label_id: 'Indoor', label_en: 'Indoor', className: 'bg-primary-container/50 text-on-primary-container' }, { label: '$$', className: 'bg-surface-variant text-on-surface-variant' }],
    category: 'cozy'
  },
  {
    imageIcon: 'auto_stories', 
    title_id: 'Jelajah Toko Buku',
    title_en: 'Bookstore Exploration',
    description_id: 'Pilihkan buku satu sama lain di toko buku indie, terus cari kafe nyaman buat baca bab pertama.',
    description_en: 'Pick books for each other at an indie bookstore, then find a cozy cafe to read the first chapter.',
    tags: [{ label_id: 'Santai', label_en: 'Relaxing', className: 'bg-secondary-container/50 text-on-secondary-container' }, { label: '$', className: 'bg-surface-variant text-on-surface-variant' }],
    category: 'budget'
  },
  {
    image: IMG_STARS, 
    title_id: 'Lihat Bintang Malam',
    title_en: 'Stargazing Night',
    description_id: 'Nyetir jauh dari lampu kota. Bawa selimut hangat, coklat panas di termos, dan cuma lihat ke atas.',
    description_en: 'Drive away from city lights. Bring a warm blanket, hot chocolate in a thermos, and just look up.',
    tags: [{ label_id: 'Outdoor', label_en: 'Outdoor', className: 'bg-secondary-container/50 text-on-secondary-container' }, { label_id: 'Gratis', label_en: 'Free', className: 'bg-tertiary-container/50 text-on-tertiary-container' }],
    category: 'outdoor'
  },
  {
    imageIcon: 'brush', 
    title_id: 'Melukis & Ngobrol di Rumah',
    title_en: 'Paint & Chat at Home',
    description_id: 'Beli kanvas murah dan cat air. Pasang jazz lembut, tuang minuman, dan coba gambar potret satu sama lain.',
    description_en: 'Buy cheap canvases and watercolors. Play some soft jazz, pour a drink, and try painting each other.',
    tags: [{ label_id: 'Indoor', label_en: 'Indoor', className: 'bg-primary-container/50 text-on-primary-container' }, { label: '$', className: 'bg-surface-variant text-on-surface-variant' }],
    category: 'cozy'
  },
];

export default function DateIdeas() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');

  const filters = [
    { value: 'all', label: t('ideas.filter_all') },
    { value: 'cozy', label: t('ideas.filter_cozy') },
    { value: 'outdoor', label: t('ideas.filter_outdoor') },
    { value: 'budget', label: t('ideas.filter_budget') },
  ];

  const filteredIdeas = ideas.filter(idea => 
    activeTab === 'all' || idea.category === activeTab
  );

  const renderIdea = useCallback((idea) => (
    <DateIdeaCard 
      {...idea} 
      title={language === 'id' ? idea.title_id : idea.title_en}
      description={language === 'id' ? idea.description_id : idea.description_en}
      tags={idea.tags.map(tag => ({
        ...tag,
        label: tag.label ? tag.label : (language === 'id' ? tag.label_id : tag.label_en)
      }))}
    />
  ), [language]);

  return (
    <MainLayout activePage="/peta">
      <div className="max-w-[1140px] mx-auto">
        {/* Hero */}
        <section className="text-center mb-10 md:mb-16">
          <h1 className="font-serif text-3xl md:text-5xl text-primary dark:text-rose-300 mb-4">{t('ideas.title')}</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            {t('ideas.subtitle')}
          </p>
          <button className="glass-panel rounded-full px-8 py-4 flex items-center gap-2 mx-auto text-primary hover:scale-105 transition-transform duration-300 group">
            <span className="material-symbols-outlined text-3xl group-hover:animate-spin">casino</span>
            <span className="font-serif text-2xl italic">{t('ideas.surprise')}</span>
          </button>
        </section>

        {/* Filters */}
        <div className="mb-10 md:mb-16">
          <FilterTabs tabs={filters} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Grid */}
        <VirtualGrid 
          items={filteredIdeas}
          renderItem={renderIdea}
          itemHeight={450}
          minColumnWidth={320}
        />
      </div>
    </MainLayout>
  );
}
