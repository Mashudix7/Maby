import MainLayout from '../components/layout/MainLayout';
import { useLanguage } from '../context/LanguageContext';

const BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHXpENKkw3QZrteUjfVRRxMAYxUafSYJ7-6kOzTT2VkbVFv6wkvlVW_zcIWjYpWI7MoXfUbsQR4NVMCjCdRqh_drr6J7IPNO1QNY0CWOFYBxXPdy_EZDHqFTih4I5fxQk29i9Sb5iH_QYrGPV2n1-esG-5liqpKexV82VmEclQAnAQnypm_CD7X7z0hJ4wohac7OBZbjKfVGKdKiBPKtfi7t634oY42P7gYs0HGwwUXSrFiZaCPKT4A1aQ0cb4qpquE1DckjPBdA';

const milestones = [
  { 
    date_id: 'Januari 2020', 
    date_en: 'January 2020',
    title_id: 'Pertama Bertemu', 
    title_en: 'First Meet',
    description_id: 'Tatapan pertama yang mengubah segalanya. Kita bertemu di kedai kopi kecil di sudut jalan.', 
    description_en: 'The first gaze that changed everything. We met at a small coffee shop on the corner.',
    icon: 'favorite', 
    color: 'bg-primary-container text-primary' 
  },
  { 
    date_id: 'Maret 2020', 
    date_en: 'March 2020',
    title_id: 'Kencan Pertama', 
    title_en: 'First Date',
    description_id: 'Makan malam sederhana yang berakhir dengan jalan-jalan panjang di bawah bintang-bintang.', 
    description_en: 'A simple dinner that ended with a long walk under the stars.',
    icon: 'restaurant', 
    color: 'bg-secondary-container text-secondary' 
  },
  { 
    date_id: 'Juni 2020', 
    date_en: 'June 2020',
    title_id: 'Resmi Jadian', 
    title_en: 'Official Anniversary',
    description_id: 'Hari dimana kita memutuskan untuk menjalani semuanya bersama. Nggak ada yang lebih membahagiakan.', 
    description_en: 'The day we decided to walk this path together. Nothing is more joyful.',
    icon: 'celebration', 
    color: 'bg-primary-container text-primary' 
  },
  { 
    date_id: 'Desember 2020', 
    date_en: 'December 2020',
    title_id: 'Liburan Pertama Bersama', 
    title_en: 'First Vacation Together',
    description_id: 'Perjalanan ke pegunungan yang dingin tapi hati kita hangat. Momen yang nggak akan pernah terlupakan.', 
    description_en: 'A trip to the cold mountains but our hearts were warm. A moment never forgotten.',
    icon: 'flight', 
    color: 'bg-tertiary-container text-tertiary' 
  },
  { 
    date_id: 'Februari 2021', 
    date_en: 'February 2021',
    title_id: 'Anniversary Pertama', 
    title_en: 'First Anniversary',
    description_id: 'Setahun penuh cinta, tawa, dan air mata bahagia. Ini baru permulaan.', 
    description_en: 'A year full of love, laughter, and happy tears. This is just the beginning.',
    icon: 'cake', 
    color: 'bg-primary-container text-primary' 
  },
  { 
    date_id: 'Agustus 2021', 
    date_en: 'August 2021',
    title_id: 'Pindah Bareng', 
    title_en: 'Moving In Together',
    description_id: 'Apartemen kecil kita. Tempat dimana setiap sudut menyimpan kenangan manis.', 
    description_en: 'Our little apartment. A place where every corner holds sweet memories.',
    icon: 'home', 
    color: 'bg-secondary-container text-secondary' 
  },
  { 
    date_id: 'Oktober 2023', 
    date_en: 'October 2023',
    title_id: 'Hari Ini', 
    title_en: 'Today',
    description_id: 'Setiap hari bersamamu adalah petualangan baru. Nggak sabar buat lanjut nulis cerita ini.', 
    description_en: 'Every day with you is a new adventure. Can\'t wait to continue writing this story.',
    icon: 'auto_awesome', 
    color: 'bg-primary-container text-primary' 
  },
];

export default function RelationshipJourney() {
  const { t, language } = useLanguage();

  return (
    <MainLayout activePage="/">
      {/* Ambient BG */}
      <div className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-multiply" style={{ backgroundImage: `url('${BG}')` }} />

      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4 inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">favorite</span>
            {language === 'id' ? 'Cerita Kita' : 'Our Story'}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-primary dark:text-rose-300 italic mb-4">{t('journey.title')}</h1>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto">
            {t('journey.subtitle')}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary-container via-secondary-container to-primary-container md:-translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((ms, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className={`relative flex items-start gap-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full ${ms.color} flex items-center justify-center shadow-lg border-4 border-white z-10`}>
                    <span className="material-symbols-outlined text-[20px]">{ms.icon}</span>
                  </div>

                  {/* Card */}
                  <div className={`ml-20 md:ml-0 md:w-[calc(50%-40px)] glass-panel rounded-2xl p-6 md:p-8 ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <time className="text-xs font-semibold text-outline block mb-2">{language === 'id' ? ms.date_id : ms.date_en}</time>
                    <h3 className="font-serif text-xl md:text-2xl text-primary italic mb-3">{language === 'id' ? ms.title_id : ms.title_en}</h3>
                    <p className="text-base text-on-surface-variant leading-relaxed">{language === 'id' ? ms.description_id : ms.description_en}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <p className="font-serif text-2xl text-primary italic mb-4">{t('journey.footer_title')}</p>
          <p className="text-base text-on-surface-variant">{t('journey.footer_subtitle')}</p>
        </div>
      </div>
    </MainLayout>
  );
}
