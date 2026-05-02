import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import FilterTabs from '../components/ui/FilterTabs';
import DateIdeaCard from '../components/ui/DateIdeaCard';

const filters = [
  { value: 'all', label: 'Semua' },
  { value: 'cozy', label: 'Santai di Rumah' },
  { value: 'outdoor', label: 'Petualangan Outdoor' },
  { value: 'budget', label: 'Hemat Budget' },
];

const IMG_PICNIC = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIyv5V2wPKy7E3QyI9C_ls2odks-UpR8P0iPTD3J97qCqFSnyOAfAiJVvba3bdLctUzAsUa6xyMzfnpUi8nXw-_QM2bdMvtZpFWbe-gOPFAn7RV7gDii9A0oKAn0Hy-0JV1QClXPGJ3tei9CPX7B4hpFGXxK3MIPpXD12GQP5pzxH3-e6cQ4p-vIQud5L-PVpie9_A7_EgmieEkpkkfKe8aeqjbYDh-kwv7HPQ9udu1m5_p-uUoZ88dEFi6zZXRj4VVCOEHPxO1A';
const IMG_COOK = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHfkobswAjvDRA-3F12hIL2Ahvx4PHw5bHJaiox0SwBxpGrzniIEDjhEel9dC8l5CD9mgy_f67jwgn0gFO6jWICcP9NxurXtwk6FTWbd3v407hp-u6jqnQrlcTa9-JL4ogF8oz2g7wDY0WHIrGzswsVEUu8Ydh4a6A5dwQu1PImZzWGeh6FIsEHrWI_Y8OXxsh5ectTBxn-VCEfMcTtS86KA7XDShPinKsLRslaSca6CHDYdmWunkOvCGqiSn8dmjldKmfHQ_Mzg';
const IMG_STARS = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAS0ZQqCaWcXxh-Vl7VAmOazHBlty-26BIvGdXv6i1qAQwuRg5IPctn0skZi_oA-IZG0wIJAHCPZl5zXgZPSH2dJmpsLon5RuAz2FEAXBv8Vtc0vFd9MrRWxhFE-F4QNZt4Oxj-HhCAS4bW8HQaR8rE5xMv1RSYmTFSd7HDtL9fy4Z8B-48jYhBZnhBGMscoabq7koKVsNTiSCaFvs9LpPdrn_z1la6gig7I5T5cimVAzP2xx5btHJMrZrLD2cNrAJ-_yCNeTptnQ';

const ideas = [
  {
    image: IMG_PICNIC, title: 'Piknik Sore',
    description: 'Bawa keju lembut, buah segar, dan selimut. Cari tempat sunyi dengan pemandangan matahari terbenam.',
    tags: [{ label: 'Outdoor', className: 'bg-secondary-container/50 text-on-secondary-container' }, { label: 'Gratis', className: 'bg-tertiary-container/50 text-on-tertiary-container' }],
    isFavorited: true,
  },
  {
    image: IMG_COOK, title: 'Malam Pasta Homemade',
    description: 'Skip restoran dan bikin berantakan di dapur. Bikin pasta dari nol ternyata gampang dan seru banget kalau berdua.',
    tags: [{ label: 'Indoor', className: 'bg-primary-container/50 text-on-primary-container' }, { label: '$$', className: 'bg-surface-variant text-on-surface-variant' }],
    className: 'lg:col-span-2',
  },
  {
    imageIcon: 'auto_stories', title: 'Jelajah Toko Buku',
    description: 'Pilihkan buku satu sama lain di toko buku indie, terus cari kafe nyaman buat baca bab pertama.',
    tags: [{ label: 'Santai', className: 'bg-secondary-container/50 text-on-secondary-container' }, { label: '$', className: 'bg-surface-variant text-on-surface-variant' }],
  },
  {
    image: IMG_STARS, title: 'Lihat Bintang Malam',
    description: 'Nyetir jauh dari lampu kota. Bawa selimut hangat, coklat panas di termos, dan cuma lihat ke atas.',
    tags: [{ label: 'Outdoor', className: 'bg-secondary-container/50 text-on-secondary-container' }, { label: 'Gratis', className: 'bg-tertiary-container/50 text-on-tertiary-container' }],
  },
  {
    imageIcon: 'brush', title: 'Melukis & Ngobrol di Rumah',
    description: 'Beli kanvas murah dan cat air. Pasang jazz lembut, tuang minuman, dan coba gambar potret satu sama lain.',
    tags: [{ label: 'Indoor', className: 'bg-primary-container/50 text-on-primary-container' }, { label: '$', className: 'bg-surface-variant text-on-surface-variant' }],
  },
];

export default function DateIdeas() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <MainLayout activePage="/peta">
      <div className="max-w-[1140px] mx-auto">
        {/* Hero */}
        <section className="text-center mb-10 md:mb-16">
          <h1 className="font-serif text-3xl md:text-5xl text-primary dark:text-rose-300 mb-4">Ide Kencan</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            Temukan cara baru buat habiskan waktu bareng. Dari malam yang tenang sampai petualangan spontan 💫
          </p>
          <button className="glass-panel rounded-full px-8 py-4 flex items-center gap-2 mx-auto text-primary hover:scale-105 transition-transform duration-300 group">
            <span className="material-symbols-outlined text-3xl group-hover:animate-spin">casino</span>
            <span className="font-serif text-2xl italic">Kejutkan Aku</span>
          </button>
        </section>

        {/* Filters */}
        <div className="mb-10 md:mb-16">
          <FilterTabs tabs={filters} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ideas.map((idea, i) => (
            <DateIdeaCard key={i} {...idea} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
